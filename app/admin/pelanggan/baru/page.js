import PelangganForm from '@/components/pelanggan/PelangganForm';
import { tambahPelanggan } from '../actions';
import Link from 'next/link';

export default function TambahPelangganPage() {
  return (
    <div
      style={{
        padding: '28px 32px',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        maxWidth: '600px',
      }}
    >
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}>
        <Link
          href="/admin/pelanggan"
          style={{ fontSize: '13px', color: '#9CA3AF', textDecoration: 'none' }}
        >
          Pelanggan
        </Link>
        <span style={{ fontSize: '13px', color: '#D1D5DB' }}>/</span>
        <span style={{ fontSize: '13px', color: '#6B6B67' }}>Tambah</span>
      </div>

      <h1
        style={{
          fontSize: '18px',
          fontWeight: 600,
          color: '#1C1C1A',
          margin: '0 0 24px',
        }}
      >
        Tambah Pelanggan
      </h1>

      <PelangganForm action={tambahPelanggan} submitLabel="Simpan" />
    </div>
  );
}