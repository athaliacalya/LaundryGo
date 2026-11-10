import PelangganForm from '@/components/pelanggan/PelangganForm';
import { updatePelanggan } from '../../actions';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function EditPelangganPage({ params }) {
  const { id } = await params;

  const { data: pelanggan } = await supabaseAdmin
    .from('pelanggan')
    .select('*')
    .eq('id_pelanggan', id)
    .single();

  if (!pelanggan) notFound();

  const updateWithId = updatePelanggan.bind(null, id);

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
        <span style={{ fontSize: '13px', color: '#6B6B67' }}>Edit</span>
      </div>

      <h1
        style={{
          fontSize: '18px',
          fontWeight: 600,
          color: '#1C1C1A',
          margin: '0 0 4px',
        }}
      >
        Edit Pelanggan
      </h1>
      <p style={{ fontSize: '13px', color: '#9CA3AF', margin: '0 0 24px' }}>
        {pelanggan.nama_pelanggan}
      </p>

      <PelangganForm action={updateWithId} initialData={pelanggan} submitLabel="Simpan Perubahan" />
    </div>
  );
}