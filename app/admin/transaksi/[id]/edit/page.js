import { redirect } from 'next/navigation';

export default async function EditTransaksiPage({ params }) {
  const { id } = await params;
  redirect(`/admin/transaksi/${id}`);
}
