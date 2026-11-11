'use server';

import { buatTransaksi, updateStatusCucian, catatPembayaran } from '@/lib/transaksiActions';

export async function buatTransaksiKasir(prevState, formData) {
  return buatTransaksi('kasir', prevState, formData);
}

export async function updateStatusCucianKasir(id, status) {
  return updateStatusCucian(id, status, 'kasir');
}

export async function catatPembayaranKasir(id, prev, fd) {
  return catatPembayaran(id, 'kasir', prev, fd);
}
