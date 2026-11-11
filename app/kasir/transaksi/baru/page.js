import { supabaseAdmin } from '@/lib/supabaseAdmin';
import TransaksiForm from '@/components/transaksi/TransaksiForm';
import { buatTransaksiKasir } from '../actions';
import Link from 'next/link';

export default async function TambahTransaksiKasirPage() {
  const { data: pelanggan } = await supabaseAdmin
    .from('pelanggan')
    .select('id_pelanggan, nama_pelanggan, no_hp')
    .order('nama_pelanggan', { ascending: true });

  const { data: layanan } = await supabaseAdmin
    .from('layanan')
    .select('*')
    .order('nama_layanan', { ascending: true });

  return (
    <div
      style={{
        padding: '28px 32px',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        maxWidth: '960px',
      }}
    >
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}>
        <Link
          href="/kasir/transaksi"
          style={{ fontSize: '13px', color: '#9CA3AF', textDecoration: 'none' }}
        >
          Transaksi
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
        Tambah Transaksi
      </h1>

      <TransaksiForm
        action={buatTransaksiKasir}
        pelangganList={pelanggan}
        layananList={layanan}
        backUrl="/kasir/transaksi"
      />
    </div>
  );
}
