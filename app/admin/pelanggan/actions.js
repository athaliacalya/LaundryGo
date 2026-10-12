'use server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

function validasiPelanggan(formData) {
  const nama = formData.get('nama_pelanggan')?.toString().trim();
  const no_hp = formData.get('no_hp')?.toString().trim();
  const alamat = formData.get('alamat')?.toString().trim();

  const errors = {};
  if (!nama || nama.length < 3) errors.nama_pelanggan = 'Nama minimal 3 karakter';
  if (!no_hp || !/^0[0-9]{9,14}$/.test(no_hp)) errors.no_hp = 'Nomor HP tidak valid, contoh: 081234567890';
  if (!alamat) errors.alamat = 'Alamat wajib diisi';

  return { nama, no_hp, alamat, errors };
}

export async function tambahPelanggan(prevState, formData) {
  const { nama, no_hp, alamat, errors } = validasiPelanggan(formData);
  if (Object.keys(errors).length > 0) return { errors };

  const { error } = await supabaseAdmin.from('pelanggan').insert({
    nama_pelanggan: nama,
    no_hp,
    alamat,
    tgl_daftar: new Date().toISOString().slice(0, 10),
  });

  if (error) return { errors: { umum: 'Gagal menyimpan: ' + error.message } };

  revalidatePath('/admin/pelanggan');
  redirect('/admin/pelanggan');
}

export async function updatePelanggan(id, prevState, formData) {
  const { nama, no_hp, alamat, errors } = validasiPelanggan(formData);
  if (Object.keys(errors).length > 0) return { errors };

  const { error } = await supabaseAdmin
    .from('pelanggan')
    .update({ nama_pelanggan: nama, no_hp, alamat })
    .eq('id_pelanggan', id);

  if (error) return { errors: { umum: 'Gagal menyimpan: ' + error.message } };

  revalidatePath('/admin/pelanggan');
  redirect('/admin/pelanggan');
}

export async function hapusPelanggan(formData) {
  const id = formData.get('id_pelanggan');
  await supabaseAdmin.from('pelanggan').delete().eq('id_pelanggan', id);
  revalidatePath('/admin/pelanggan');
}