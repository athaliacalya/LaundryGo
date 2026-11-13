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
          fontWeight: 500,
          color: '#64748B',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '6px 8px',
          borderRadius: '6px',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          width: '100%',
          transition: 'all 0.15s ease',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.color = '#DC2626';
          e.currentTarget.style.backgroundColor = '#FEF2F2';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.color = '#64748B';
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        <span>Keluar dari Akun</span>
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