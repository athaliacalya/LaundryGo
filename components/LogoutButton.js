'use client';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        fontSize: '13px',
        color: '#9CA3AF',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
      onMouseOver={(e) => (e.target.style.color = '#EF4444')}
      onMouseOut={(e) => (e.target.style.color = '#9CA3AF')}
    >
      Keluar
    </button>
  );
}