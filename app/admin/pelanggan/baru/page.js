import PelangganForm from '../PelangganForm';
import { tambahPelanggan } from '../actions';

export default function TambahPelangganPage() {
  return (
    <main className="p-6 sm:p-10 max-w-xl mx-auto">
      <h1
        style={{ fontFamily: 'Fraunces, serif', fontWeight: 600 }}
        className="text-2xl text-[#16323A] mb-6"
      >
        Tambah Pelanggan
      </h1>
      <PelangganForm action={tambahPelanggan} submitLabel="Simpan" />
    </main>
  );
}