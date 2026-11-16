'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/Logo';
import LogoutButton from '@/components/LogoutButton';

export default function SidebarNav({ items, user, rolePrefix = 'admin' }) {
  const pathname = usePathname();

  const homeHref = rolePrefix === 'admin' ? '/admin' : '/kasir/transaksi';
  const roleDisplay = (user?.role || rolePrefix).toLowerCase();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', flex: 1 }}>
      {/* Brand Header */}
      <div
        style={{
          padding: '6px 12px 18px',
          borderBottom: '1px solid #E5E7EB',
          marginBottom: '14px',
        }}
      >
        <Link href={homeHref} style={{ textDecoration: 'none', display: 'inline-block' }}>
          <Logo textColor="#0F172A" />
        </Link>
      </div>

      {/* Navigation List */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {items.map((item) => {
          // Check if link is active
          const isExact = pathname === item.href;
          const isNested = item.href !== `/${rolePrefix}` && pathname.startsWith(item.href);
          const isActive = isExact || isNested;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '9px 12px',
                fontSize: '14px',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#0F766E' : '#475569',
                backgroundColor: isActive ? '#F0FDFA' : 'transparent',
                borderLeft: isActive ? '3px solid #0F766E' : '3px solid transparent',
                borderRadius: '0 8px 8px 0',
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <span
                style={{
                  color: isActive ? '#0F766E' : '#94A3B8',
                  display: 'flex',
                  alignItems: 'center',
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Kotak User Profile & Tombol Keluar: margin-top auto agar selalu menempel di dasar */}
      <div
        style={{
          borderTop: '1px solid #E5E7EB',
          paddingTop: '16px',
          marginTop: 'auto',
        }}
      >
        {/* Info Pengguna: nama lengkap di atas, peran huruf kecil abu di bawah */}
        <div
          style={{
            padding: '10px 12px',
            backgroundColor: '#F8FAFC',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            marginBottom: '10px',
          }}
        >
          <p
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#1E293B',
              margin: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {user?.nama_lengkap || user?.username}
          </p>
          <span
            style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 400,
              color: '#64748B',
              marginTop: '2px',
            }}
          >
            {roleDisplay}
          </span>
        </div>

        <LogoutButton />
      </div>
    </div>
  );
}

