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
    <>
      <button
        onClick={handleLogout}
        className="logout-btn"
        style={{
          fontSize: '13px',
          color: '#9CA3AF',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px 0',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          display: 'inline-flex',
          alignItems: 'center',
        }}
        onMouseOver={(e) => (e.currentTarget.style.color = '#EF4444')}
        onMouseOut={(e) => (e.currentTarget.style.color = '#9CA3AF')}
      >
        Keluar
      </button>

      <style>{`
        @media (max-width: 767px) {
          .logout-btn {
            min-height: 48px !important;
            padding: 10px 14px !important;
            width: 100% !important;
            border-radius: 6px !important;
            background-color: #FEF2F2 !important;
            color: #DC2626 !important;
            font-weight: 500 !important;
            font-size: 14px !important;
            justify-content: center !important;
          }
          .logout-btn:hover {
            background-color: #FEE2E2 !important;
            color: #B91C1C !important;
          }
        }
      `}</style>
    </>
  );
}