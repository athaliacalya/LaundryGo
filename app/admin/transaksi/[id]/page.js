import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { notFound } from 'next/navigation';
import TransaksiDetailView from '@/components/transaksi/TransaksiDetailView';
import { updateStatusCucianAdmin, catatPembayaranAdmin } from '../actions';

export default async function TransaksiDetailAdminPage({ params }) {
  const { id } = await params;

  const { data: transaksi } = await supabaseAdmin
    .from('transaksi')
    .select('*, pelanggan(*), users(nama_lengkap)')
    .eq('id_transaksi', id)
    .single();

  if (!transaksi) notFound();

  const { data: items } = await supabaseAdmin
    .from('detail_transaksi')
    .select('*, layanan(*)')
    .eq('id_transaksi', id);

  const { data: pembayaran } = await supabaseAdmin
    .from('pembayaran')
    .select('*')
    .eq('id_transaksi', id)
    .order('tgl_bayar', { ascending: true });

  return (
    <TransaksiDetailView
      transaksi={transaksi}
      items={items || []}
      pembayaran={pembayaran || []}
      rolePrefix="admin"
      updateStatusAction={updateStatusCucianAdmin}
      catatPembayaranAction={catatPembayaranAdmin}
    />
  );
}

