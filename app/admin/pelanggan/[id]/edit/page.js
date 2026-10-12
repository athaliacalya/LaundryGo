import PelangganForm from '../../PelangganForm';
import { updatePelanggan } from '../../actions';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { notFound } from 'next/navigation';

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
    <main className="p-6 sm:p-10 max-w-xl mx-auto">
      <h1
        style={{ fontFamily: 'Fraunces, serif', fontWeight: 600 }}
        className="text-2xl text-[#16323A] mb-6"
      >
        Edit Pelanggan
      </h1>
      <PelangganForm action={updateWithId} initialData={pelanggan} submitLabel="Simpan Perubahan" />
    </main>
  );
}