import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import LayananForm from '@/components/layanan/LayananForm';
import { updateLayanan } from '../../actions';

export default async function EditLayananPage({ params }) {
  const { id } = await params;

  const { data: layanan } = await supabaseAdmin
    .from('layanan')
    .select('*')
    .eq('id_layanan', id)
    .single();

  if (!layanan) {
    notFound();
  }

  const actionWithId = updateLayanan.bind(null, id);

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
          Edit Layanan: {layanan.nama_layanan}
        </h1>
        <p style={{ fontSize: '13px', color: '#9CA3AF', margin: '4px 0 0' }}>
          Perbarui informasi paket layanan dan tarif laundry.
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
        <LayananForm action={actionWithId} initialData={layanan} isEdit />
      </div>
    </div>
  );
}
