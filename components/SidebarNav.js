'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/Logo';
import LogoutButton from '@/components/LogoutButton';

export default function SidebarNav({ items, user, rolePrefix = 'admin' }) {
  const pathname = usePathname();

  const homeHref = rolePrefix === 'admin' ? '/admin' : '/kasir/transaksi';
  const initial = (user?.nama_lengkap || user?.username || 'U').charAt(0).toUpperCase();
  const roleName = user?.role === 'admin' ? 'Administrator' : 'Kasir';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Brand Header */}
      <div
        style={{
          padding: '6px 12px 18px',
          borderBottom: '1px solid #E2E8F0',
          marginBottom: '14px',
        }}
      >
        <Link href={homeHref} style={{ textDecoration: 'none', display: 'inline-block' }}>
          <Logo textColor="#0F172A" />
        </Link>
      </div>

      {/* Navigation List */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
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

      {/* User Profile Card & Logout */}
      <div
        style={{
          borderTop: '1px solid #E2E8F0',
          paddingTop: '16px',
          marginTop: '12px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 12px',
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            marginBottom: '10px',
          }}
        >
          {/* Avatar Inisial */}
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: rolePrefix === 'admin' ? '#0F766E' : '#0284C7',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {initial}
          </div>

          {/* User Details */}
          <div style={{ flex: 1, minWidth: 0 }}>
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
                display: 'inline-block',
                fontSize: '11px',
                fontWeight: 600,
                color: rolePrefix === 'admin' ? '#0F766E' : '#0284C7',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginTop: '1px',
              }}
            >
              {roleName}
            </span>
          </div>
        </div>

        <LogoutButton />
      </div>
    </div>
  );
}

