'use server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function buatTransaksi(rolePrefix, prevState, formData) {
  const session = await getSession();
  if (!session?.user) {
    return { error: 'Anda harus login terlebih dahulu.' };
  }

  const id_pelanggan = parseInt(formData.get('id_pelanggan'), 10);
  const tgl_masuk_raw = formData.get('tgl_masuk')?.toString();
  const tgl_masuk = tgl_masuk_raw ? new Date(tgl_masuk_raw).toISOString() : new Date().toISOString();
  const rawItems = formData.get('items')?.toString();

  const bayar_awal = parseInt(formData.get('bayar_awal') || '0', 10);
  const metode_bayar = formData.get('metode_bayar')?.toString() || 'tunai';

  if (!id_pelanggan) {
    return { error: 'Pilih pelanggan terlebih dahulu.' };
  }

  let items = [];
  try {
    items = JSON.parse(rawItems || '[]');
  } catch {
    return { error: 'Data item layanan tidak valid.' };
  }

  if (!items || items.length === 0) {
    return { error: 'Tambahkan minimal satu layanan cucian.' };
  }

  // 1. Generate nomor nota otomatis: T0001, T0002...
  const { data: allTrans } = await supabaseAdmin
    .from('transaksi')
    .select('id_transaksi');

  let maxNum = 0;
  if (allTrans && allTrans.length > 0) {
    for (const t of allTrans) {
      const m = t.id_transaksi.match(/\d+/);
      if (m) {
        const num = parseInt(m[0], 10);
        if (num > maxNum) maxNum = num;
      }
    }
  }
  const nextId = `T${String(maxNum + 1).padStart(4, '0')}`;

  // 2. Hitung subtotal dan tanggal selesai dari estimasi terlama
  let total_bayar = 0;
  let maxEstimasiHari = 1;

  // Fetch data layanan untuk validasi harga & estimasi
  const layananIds = items.map((i) => i.id_layanan);
  const { data: layananDb } = await supabaseAdmin
    .from('layanan')
    .select('*')
    .in('id_layanan', layananIds);

  const layananMap = new Map((layananDb || []).map((l) => [l.id_layanan, l]));

  const detailRows = [];
  for (const item of items) {
    const l = layananMap.get(item.id_layanan);
    if (!l) continue;
    const jumlah = parseFloat(item.jumlah);
    if (isNaN(jumlah) || jumlah <= 0) continue;

    const harga_satuan = l.harga;
    const subtotal = Math.round(jumlah * harga_satuan);
    total_bayar += subtotal;

    if (l.estimasi_hari > maxEstimasiHari) {
      maxEstimasiHari = l.estimasi_hari;
    }

    detailRows.push({
      id_transaksi: nextId,
      id_layanan: l.id_layanan,
      jumlah,
      harga_satuan,
      subtotal,
    });
  }

  if (detailRows.length === 0) {
    return { error: 'Jumlah item layanan harus lebih besar dari 0.' };
  }

  // Hitung tanggal estimasi selesai
  const dMasuk = new Date(tgl_masuk);
  const dSelesai = new Date(dMasuk);
  dSelesai.setDate(dSelesai.getDate() + maxEstimasiHari);
  const tgl_selesai = dSelesai.toISOString().slice(0, 10);

  // Status bayar awal
  const isLunas = bayar_awal >= total_bayar;
  const status_bayar = isLunas ? 'lunas' : 'belum';

  // 3. Simpan Transaksi Header
  const { error: errHeader } = await supabaseAdmin.from('transaksi').insert({
    id_transaksi: nextId,
    tgl_masuk,
    tgl_selesai,
    id_pelanggan,
    id_user: session.user.id_user,
    total_bayar,
    status_bayar,
    status_cucian: 'diterima',
  });

  if (errHeader) {
    return { error: 'Gagal membuat transaksi: ' + errHeader.message };
  }

  // 4. Simpan Detail Transaksi
  const { error: errDetail } = await supabaseAdmin
    .from('detail_transaksi')
    .insert(detailRows);

  if (errDetail) {
    return { error: 'Gagal menyimpan detail transaksi: ' + errDetail.message };
  }

  // 5. Simpan Pembayaran Awal (jika ada DP / Lunas)
  if (bayar_awal > 0) {
    const nominalBayar = Math.min(bayar_awal, total_bayar);
    await supabaseAdmin.from('pembayaran').insert({
      id_transaksi: nextId,
      tgl_bayar: new Date().toISOString(),
      jumlah_bayar: nominalBayar,
      metode: metode_bayar,
    });
  }

  revalidatePath(`/${rolePrefix}/transaksi`);
  redirect(`/${rolePrefix}/transaksi/${nextId}`);
}

export async function updateStatusCucian(id_transaksi, status_baru, rolePrefix) {
  const session = await getSession();
  if (!session?.user) return { error: 'Unauthorized' };

  // Ambil data transaksi saat ini
  const { data: trans, error: errTrans } = await supabaseAdmin
    .from('transaksi')
    .select('status_cucian, status_bayar')
    .eq('id_transaksi', id_transaksi)
    .single();

  if (errTrans || !trans) {
    return { error: 'Transaksi tidak ditemukan.' };
  }

  // Status cucian hanya boleh maju tepat satu langkah sesuai urutan
  const urutanStatus = ['diterima', 'diproses', 'selesai', 'diambil'];
  const currentIndex = urutanStatus.indexOf(trans.status_cucian);
  const nextStatus = currentIndex >= 0 && currentIndex < urutanStatus.length - 1
    ? urutanStatus[currentIndex + 1]
    : null;

  if (status_baru !== nextStatus) {
    return { error: 'Status cucian hanya dapat maju sesuai urutan: diterima, diproses, selesai, diambil.' };
  }

  // Jika status diambil, cek apakah sudah lunas (PRD: saat diambil, pastikan pembayaran lunas)
  if (status_baru === 'diambil' && trans.status_bayar !== 'lunas') {
    return { error: 'Pakaian belum bisa diambil karena pembayaran belum lunas.' };
  }

  const { error } = await supabaseAdmin
    .from('transaksi')
    .update({ status_cucian: status_baru })
    .eq('id_transaksi', id_transaksi);

  if (error) {
    return { error: 'Gagal mengubah status: ' + error.message };
  }

  revalidatePath(`/${rolePrefix}/transaksi/${id_transaksi}`);
  revalidatePath(`/${rolePrefix}/transaksi`);
  return { success: true };
}

export async function catatPembayaran(id_transaksi, rolePrefix, prevState, formData) {
  const session = await getSession();
  if (!session?.user) return { error: 'Unauthorized' };

  const jumlah_bayar = parseInt(formData.get('jumlah_bayar'), 10);
  const metode = formData.get('metode')?.toString() || 'tunai';

  if (isNaN(jumlah_bayar) || jumlah_bayar <= 0) {
    return { error: 'Jumlah pembayaran harus lebih dari 0.' };
  }

  // Ambil transaksi & riwayat pembayaran untuk hitung sisa tagihan
  const { data: trans } = await supabaseAdmin
    .from('transaksi')
    .select('total_bayar, status_bayar')
    .eq('id_transaksi', id_transaksi)
    .single();

  if (!trans) return { error: 'Transaksi tidak ditemukan.' };

  const { data: riwayat } = await supabaseAdmin
    .from('pembayaran')
    .select('jumlah_bayar')
    .eq('id_transaksi', id_transaksi);

  const totalSudahBayar = (riwayat || []).reduce((acc, p) => acc + p.jumlah_bayar, 0);
  const sisa = Math.max(0, trans.total_bayar - totalSudahBayar);

  if (jumlah_bayar > sisa) {
    return { error: `Jumlah bayar (Rp ${jumlah_bayar.toLocaleString('id-ID')}) melebihi sisa tagihan (Rp ${sisa.toLocaleString('id-ID')}).` };
  }

  // Insert pembayaran baru
  const { error: errInsert } = await supabaseAdmin.from('pembayaran').insert({
    id_transaksi,
    tgl_bayar: new Date().toISOString(),
    jumlah_bayar,
    metode,
  });

  if (errInsert) {
    return { error: 'Gagal mencatat pembayaran: ' + errInsert.message };
  }

  // Jika total sudah mencapai total_bayar, ubah status_bayar jadi lunas
  if (totalSudahBayar + jumlah_bayar >= trans.total_bayar) {
    await supabaseAdmin
      .from('transaksi')
      .update({ status_bayar: 'lunas' })
      .eq('id_transaksi', id_transaksi);
  }

  revalidatePath(`/${rolePrefix}/transaksi/${id_transaksi}`);
  revalidatePath(`/${rolePrefix}/transaksi`);
  return { success: true };
}

