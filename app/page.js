import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function RootPage() {
  const session = await getSession();
  if (!session?.user) {
    redirect('/login');
  }
  if (session.user.role === 'admin') {
    redirect('/admin');
  }
  redirect('/kasir/transaksi');
}

