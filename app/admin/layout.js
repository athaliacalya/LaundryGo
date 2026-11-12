import { getSession } from '@/lib/session';
import LogoutButton from '@/components/LogoutButton';
import Logo from '@/components/Logo';
import Link from 'next/link';
import ResponsiveShell from '@/components/ResponsiveShell';

// Komponen sidebar item — aktif ditandai dengan blok hijau muda
function NavItem({ href, label, icon }) {
  return (
    <Link
      href={href}
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
        transition: 'background-color 0.1s',
      }}
      className="sidebar-link"
      data-href={href}
    >
      <span style={{ color: '#9CA3AF', flexShrink: 0 }}>{icon}</span>
      {label}
    </Link>
  );
}

export default async function AdminLayout({ children }) {
  const session = await getSession();
  const user = session.user;

  const navItems = [
    {
      href: '/admin',
      label: 'Dashboard',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      href: '/admin/pelanggan',
      label: 'Pelanggan',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        </svg>
      ),
    },
    {
      href: '/admin/layanan',
      label: 'Layanan',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>
      ),
    },
    {
      href: '/admin/transaksi',
      label: 'Transaksi',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
        </svg>
      ),
    },
    {
      href: '/admin/laporan',
      label: 'Laporan',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
    },
  ];

  const sidebar = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div style={{ padding: '4px 12px 20px', borderBottom: '1px solid #E4E4E0', marginBottom: '12px' }}>
        <Logo textColor="#12161C" />
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
        {navItems.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </nav>

      {/* User info + logout */}
      <div
        style={{
          borderTop: '1px solid #E4E4E0',
          paddingTop: '16px',
          marginTop: '8px',
        }}
      >
        <p style={{ fontSize: '13px', fontWeight: 500, color: '#1C1C1A', marginBottom: '2px' }}>
          {user?.nama_lengkap}
        </p>
        <p style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '10px' }}>
          {user?.role}
        </p>
        <LogoutButton />
      </div>
    </div>
  );

  return (
    <ResponsiveShell sidebar={sidebar}>
      {children}
    </ResponsiveShell>
  );
}
