import { getSession } from '@/lib/session';
import LogoutButton from '@/components/LogoutButton';

export default async function KasirLayout({ children }) {
  const session = await getSession();
  const user = session.user;

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#F7F7F5',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {/* Sidebar kasir — lebih sederhana dari admin */}
      <aside
        style={{
          width: '220px',
          flexShrink: 0,
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #E4E4E0',
          display: 'flex',
          flexDirection: 'column',
          padding: '20px 12px',
          position: 'sticky',
          top: 0,
          height: '100vh',
        }}
      >
        {/* Logo */}
        <div style={{ padding: '4px 12px 20px', borderBottom: '1px solid #E4E4E0', marginBottom: '12px' }}>
          <span
            style={{
              fontFamily: 'Fraunces, serif',
              fontWeight: 600,
              fontSize: '18px',
              color: '#0F766E',
              letterSpacing: '-0.2px',
            }}
          >
            LaundryGo
          </span>
        </div>

        {/* Nav kasir */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
          <a
            href="/kasir/transaksi"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 12px',
              fontSize: '14px',
              fontWeight: 500,
              color: '#3D3D3A',
              borderRadius: '6px',
              textDecoration: 'none',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
            Transaksi
          </a>
        </nav>

        {/* User info */}
        <div style={{ borderTop: '1px solid #E4E4E0', paddingTop: '16px' }}>
          <p style={{ fontSize: '13px', fontWeight: 500, color: '#1C1C1A', marginBottom: '2px' }}>
            {user?.nama_lengkap}
          </p>
          <p style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '10px' }}>
            {user?.role}
          </p>
          <LogoutButton />
        </div>
      </aside>

      <main style={{ flex: 1, minWidth: 0 }}>{children}</main>
    </div>
  );
}
