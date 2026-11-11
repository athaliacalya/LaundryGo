'use server';

import { buatTransaksi, updateStatusCucian, catatPembayaran } from '@/lib/transaksiActions';

export async function buatTransaksiAdmin(prevState, formData) {
  return buatTransaksi('admin', prevState, formData);
}

export async function updateStatusCucianAdmin(id, status) {
  return updateStatusCucian(id, status, 'admin');
}

export async function catatPembayaranAdmin(id, prev, fd) {
  return catatPembayaran(id, 'admin', prev, fd);
}
