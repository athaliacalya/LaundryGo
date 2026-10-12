import { getSession } from '@/lib/session';
import LogoutButton from '@/components/LogoutButton';

export default async function AdminLayout({ children }) {
  const session = await getSession();
  const user = session.user;

  return (
    <div className="min-h-screen bg-[#F6FAF8]">
      <header className="bg-white border-b border-[#E2ECE7] px-6 py-4 flex items-center justify-between">
        <p style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: '#046B4F' }} className="text-lg">
          Emeraldé
        </p>
        <div className="flex items-center gap-4 text-sm text-[#3E5750]">
          <span>{user?.nama_lengkap} <span className="text-[#8AA79E]">({user?.role})</span></span>
          <LogoutButton />
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}