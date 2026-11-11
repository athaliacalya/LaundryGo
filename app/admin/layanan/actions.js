'use server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

function validasiLayanan(formData) {
  const nama = formData.get('nama_layanan')?.toString().trim();
  const satuan = formData.get('satuan')?.toString().trim();
  const harga = parseInt(formData.get('harga')?.toString(), 10);
  const estimasi_hari = parseInt(formData.get('estimasi_hari')?.toString(), 10);

  const errors = {};
  if (!nama || nama.length < 3) errors.nama_layanan = 'Nama layanan minimal 3 karakter';
  if (!satuan || !['kg', 'pcs', 'm2'].includes(satuan)) errors.satuan = 'Pilih satuan yang valid (kg, pcs, atau m2)';
  if (isNaN(harga) || harga < 100) errors.harga = 'Harga minimal Rp 100';
  if (isNaN(estimasi_hari) || estimasi_hari < 1) errors.estimasi_hari = 'Estimasi pengerjaan minimal 1 hari';

  return { nama, satuan, harga, estimasi_hari, errors };
}

export async function tambahLayanan(prevState, formData) {
  const { nama, satuan, harga, estimasi_hari, errors } = validasiLayanan(formData);
  if (Object.keys(errors).length > 0) return { errors };

  const { error } = await supabaseAdmin.from('layanan').insert({
    nama_layanan: nama,
    satuan,
    harga,
    estimasi_hari,
  });

  if (error) return { errors: { umum: 'Gagal menambahkan layanan: ' + error.message } };

  revalidatePath('/admin/layanan');
  revalidatePath('/kasir/layanan');
  redirect('/admin/layanan');
}

export async function updateLayanan(id, prevState, formData) {
  const { nama, satuan, harga, estimasi_hari, errors } = validasiLayanan(formData);
  if (Object.keys(errors).length > 0) return { errors };

  const { error } = await supabaseAdmin
    .from('layanan')
    .update({
      nama_layanan: nama,
      satuan,
      harga,
      estimasi_hari,
    })
    .eq('id_layanan', id);

  if (error) return { errors: { umum: 'Gagal memperbarui layanan: ' + error.message } };

  revalidatePath('/admin/layanan');
  revalidatePath('/kasir/layanan');
  redirect('/admin/layanan');
}

export async function hapusLayanan(formData) {
  const id = formData.get('id_layanan');

  // Validasi PRD: Layanan yang sudah dipakai transaksi tidak bisa dihapus
  const { count } = await supabaseAdmin
    .from('detail_transaksi')
    .select('*', { count: 'exact', head: true })
    .eq('id_layanan', id);

  if (count && count > 0) {
    // Tidak dihapus karena sudah dipakai transaksi
    return { error: 'Layanan tidak dapat dihapus karena sudah tercatat dalam riwayat transaksi.' };
  }

  await supabaseAdmin.from('layanan').delete().eq('id_layanan', id);
  revalidatePath('/admin/layanan');
  revalidatePath('/kasir/layanan');
}
