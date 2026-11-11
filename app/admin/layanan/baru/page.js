import Link from 'next/link';
import LayananForm from '@/components/layanan/LayananForm';
import { tambahLayanan } from '../actions';

export default function TambahLayananPage() {
  return (
    <div
      style={{
        padding: '28px 32px',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        maxWidth: '640px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <Link
          href="/admin/layanan"
          style={{
            fontSize: '13px',
            color: '#6B6B67',
            textDecoration: 'none',
          }}
        >
          &larr; Kembali ke Layanan
        </Link>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 600, color: '#1C1C1A', margin: 0 }}>
          Tambah Layanan Baru
        </h1>
        <p style={{ fontSize: '13px', color: '#9CA3AF', margin: '4px 0 0' }}>
          Tentukan nama paket, satuan hitung, tarif, dan estimasi waktu selesai.
        </p>
      </div>

      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E4E4E0',
          borderRadius: '8px',
          padding: '24px',
        }}
      >
        <LayananForm action={tambahLayanan} />
      </div>
    </div>
  );
}
