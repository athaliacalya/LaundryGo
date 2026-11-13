import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getSession } from '@/lib/session';

// Format tanggal pendek: "16 Okt 2026"
function formatTanggal(str) {
  if (!str) return '—';
  const d = new Date(str);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Format mata uang: "Rp 50.000"
function formatRupiah(val) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val || 0);
}

export default async function AdminDashboardPage() {
  const session = await getSession();
  const user = session?.user;

  // Tanggal hari ini
  const now = new Date();
  const todayFormatted = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const tomorrowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString();

  // 1. Transaksi Hari Ini
  const { count: transaksiHariIni } = await supabaseAdmin
    .from('transaksi')
    .select('*', { count: 'exact', head: true })
    .gte('tgl_masuk', todayStart)
    .lt('tgl_masuk', tomorrowStart);

  // 2. Pendapatan Hari Ini — sum jumlah_bayar from pembayaran today
  const { data: pembayaranHariIni } = await supabaseAdmin
    .from('pembayaran')
    .select('jumlah_bayar')
    .gte('tgl_bayar', todayStart)
    .lt('tgl_bayar', tomorrowStart);

  const pendapatanHariIni = (pembayaranHariIni || []).reduce((sum, p) => sum + (p.jumlah_bayar || 0), 0);

  // 3. Cucian Diproses
  const { count: cucianDiproses } = await supabaseAdmin
    .from('transaksi')
    .select('*', { count: 'exact', head: true })
    .eq('status_cucian', 'diproses');

  // 4. Belum Lunas
  const { count: belumLunas } = await supabaseAdmin
    .from('transaksi')
    .select('*', { count: 'exact', head: true })
    .eq('status_bayar', 'belum');

  // 5. Transaksi Terbaru (5 terakhir)
  const { data: transaksiTerbaru } = await supabaseAdmin
    .from('transaksi')
    .select('id_transaksi, tgl_masuk, total_bayar, status_bayar, status_cucian, pelanggan(nama_pelanggan)')
    .order('id_transaksi', { ascending: false })
    .limit(5);

  const cards = [
    {
      label: 'Transaksi Hari Ini',
      value: transaksiHariIni ?? 0,
      sublabel: 'pesanan masuk hari ini',
      iconBg: '#CCFBF1',
      iconColor: '#0F766E',
      borderColor: '#99F6E4',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
    {
      label: 'Pendapatan Hari Ini',
      value: formatRupiah(pendapatanHariIni),
      sublabel: 'total kas masuk hari ini',
      iconBg: '#D1FAE5',
      iconColor: '#059669',
      borderColor: '#A7F3D0',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      label: 'Cucian Diproses',
      value: cucianDiproses ?? 0,
      sublabel: 'sedang dicuci / disetrika',
      iconBg: '#E0F2FE',
      iconColor: '#0284C7',
      borderColor: '#BAE6FD',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
    },
    {
      label: 'Belum Lunas',
      value: belumLunas ?? 0,
      sublabel: 'menunggu pembayaran',
      iconBg: '#FEF3C7',
      iconColor: '#D97706',
      borderColor: '#FDE68A',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
    },
  ];

  const statusBayarBadge = (status) => {
    const isLunas = status === 'lunas';
    return {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '3px 10px',
      fontSize: '12px',
      fontWeight: 600,
      borderRadius: '9999px',
      backgroundColor: isLunas ? '#DCFCE7' : '#FEF9C3',
      color: isLunas ? '#166534' : '#854D0E',
      border: `1px solid ${isLunas ? '#BBF7D0' : '#FEF08A'}`,
    };
  };

  const statusCucianBadge = (status) => {
    const map = {
      diterima: { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0', label: 'Diterima' },
      diproses: { bg: '#E0F2FE', color: '#0369A1', border: '#BAE6FD', label: 'Diproses' },
      selesai: { bg: '#DCFCE7', color: '#15803D', border: '#BBF7D0', label: 'Selesai' },
      diambil: { bg: '#F3E8FF', color: '#7E22CE', border: '#E9D5FF', label: 'Diambil' },
    };
    const s = map[status] || map.diterima;
    return {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '3px 10px',
      fontSize: '12px',
      fontWeight: 600,
      borderRadius: '9999px',
      backgroundColor: s.bg,
      color: s.color,
      border: `1px solid ${s.border}`,
    };
  };

  return (
    <div
      style={{
        padding: '24px 28px',
        maxWidth: '1080px',
        margin: '0 auto',
      }}
    >
      {/* Header & Greeting Personal */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '16px',
          paddingBottom: '20px',
          marginBottom: '20px',
          borderBottom: '1px solid #E2E8F0',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h1
              style={{
                fontSize: '22px',
                fontWeight: 700,
                color: '#0F172A',
                margin: 0,
                letterSpacing: '-0.3px',
              }}
            >
              Halo, {user?.nama_lengkap || 'Admin'} 👋
            </h1>
          </div>
          <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
            {todayFormatted} • Operasional Outlet Laundry
          </p>
        </div>

        {/* Quick Actions Bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
          <Link
            href="/admin/transaksi/baru"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 14px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#FFFFFF',
              backgroundColor: '#0F766E',
              borderRadius: '8px',
              textDecoration: 'none',
              boxShadow: '0 1px 2px rgba(15, 118, 110, 0.2)',
              transition: 'background-color 0.15s ease',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            + Transaksi Baru
          </Link>

          <Link
            href="/admin/pelanggan/baru"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 14px',
              fontSize: '13px',
              fontWeight: 500,
              color: '#334155',
              backgroundColor: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              textDecoration: 'none',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
            + Pelanggan
          </Link>

          <Link
            href="/admin/laporan"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 14px',
              fontSize: '13px',
              fontWeight: 500,
              color: '#334155',
              backgroundColor: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              textDecoration: 'none',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            Laporan
          </Link>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div
        className="dashboard-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px',
          marginBottom: '28px',
        }}
      >
        {cards.map((card, i) => (
          <div
            key={i}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              padding: '16px 18px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>
                {card.label}
              </span>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  backgroundColor: card.iconBg,
                  color: card.iconColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {card.icon}
              </div>
            </div>

            <div
              style={{
                fontSize: '26px',
                fontWeight: 700,
                color: '#0F172A',
                letterSpacing: '-0.5px',
                fontVariantNumeric: 'tabular-nums',
                lineHeight: 1.1,
                marginBottom: '4px',
              }}
            >
              {card.value}
            </div>
            <div style={{ fontSize: '12px', color: '#94A3B8' }}>
              {card.sublabel}
            </div>
          </div>
        ))}
      </div>

      {/* Bagian Transaksi Terbaru */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '10px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          overflow: 'hidden',
        }}
      >
        {/* Header Tabel */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid #E2E8F0',
            backgroundColor: '#FAFAFA',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: '15px',
                fontWeight: 600,
                color: '#0F172A',
                margin: 0,
              }}
            >
              Transaksi Terbaru
            </h2>
            <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0' }}>
              5 nota terakhir yang masuk ke sistem
            </p>
          </div>

          <Link
            href="/admin/transaksi"
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#0F766E',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            Lihat Semua Transaksi →
          </Link>
        </div>

        {/* Tabel Data */}
        <div
          className="table-container"
          style={{
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <table style={{ width: '100%', minWidth: '640px', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <th style={thStyle}>No Nota</th>
                <th style={thStyle}>Pelanggan</th>
                <th style={thStyle}>Tgl Masuk</th>
                <th style={thStyle}>Total Biaya</th>
                <th style={thStyle}>Status Bayar</th>
                <th style={thStyle}>Status Cucian</th>
                <th style={{ ...thStyle, textAlign: 'right', width: '70px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {transaksiTerbaru?.length ? (
                transaksiTerbaru.map((t, i) => (
                  <tr
                    key={t.id_transaksi}
                    style={{
                      borderBottom: i < transaksiTerbaru.length - 1 ? '1px solid #F1F5F9' : 'none',
                      height: '48px',
                    }}
                  >
                    <td style={{ ...tdStyle, fontWeight: 600, color: '#0F172A' }}>
                      {t.id_transaksi}
                    </td>
                    <td style={{ ...tdStyle, color: '#334155', fontWeight: 500 }}>
                      {t.pelanggan?.nama_pelanggan || '—'}
                    </td>
                    <td style={{ ...tdStyle, color: '#64748B', whiteSpace: 'nowrap' }}>
                      {formatTanggal(t.tgl_masuk)}
                    </td>
                    <td style={{ ...tdStyle, color: '#0F172A', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                      {formatRupiah(t.total_bayar)}
                    </td>
                    <td style={tdStyle}>
                      <span style={statusBayarBadge(t.status_bayar)}>
                        {t.status_bayar === 'lunas' ? '✓ Lunas' : '• Belum'}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <span style={statusCucianBadge(t.status_cucian)}>
                        {t.status_cucian}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                      <Link
                        href={`/admin/transaksi/${t.id_transaksi}`}
                        style={{
                          fontSize: '12px',
                          color: '#0F766E',
                          backgroundColor: '#F0FDFA',
                          border: '1px solid #CCFBF1',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          textDecoration: 'none',
                          fontWeight: 600,
                          display: 'inline-block',
                        }}
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    style={{ padding: '40px', textAlign: 'center', color: '#94A3B8', fontSize: '14px' }}
                  >
                    Belum ada riwayat transaksi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const thStyle = {
  padding: '12px 16px',
  textAlign: 'left',
  fontSize: '11px',
  fontWeight: 700,
  color: '#64748B',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const tdStyle = {
  padding: '10px 16px',
};
