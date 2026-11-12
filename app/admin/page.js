import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// Format tanggal: "16 Okt 2026"
function formatTanggal(str) {
  if (!str) return '—';
  const d = new Date(str);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Format mata uang
function formatRupiah(val) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val || 0);
}

export default async function AdminDashboardPage() {
  // Today's date range in ISO format
  const now = new Date();
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
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
    {
      label: 'Pendapatan Hari Ini',
      value: formatRupiah(pendapatanHariIni),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      ),
    },
    {
      label: 'Cucian Diproses',
      value: cucianDiproses ?? 0,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
        </svg>
      ),
    },
    {
      label: 'Belum Lunas',
      value: belumLunas ?? 0,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
    },
  ];

  const statusBayarBadge = (status) => {
    const isLunas = status === 'lunas';
    return {
      display: 'inline-block',
      padding: '2px 10px',
      fontSize: '12px',
      fontWeight: 600,
      borderRadius: '9999px',
      backgroundColor: isLunas ? '#DCFCE7' : '#FEF9C3',
      color: isLunas ? '#166534' : '#854D0E',
    };
  };

  const statusCucianBadge = (status) => {
    const map = {
      diterima: { bg: '#F3F4F6', color: '#374151' },
      diproses: { bg: '#DBEAFE', color: '#1E40AF' },
      selesai: { bg: '#DCFCE7', color: '#166534' },
      diambil: { bg: '#E2E8F0', color: '#475569' },
    };
    const s = map[status] || map.diterima;
    return {
      display: 'inline-block',
      padding: '2px 10px',
      fontSize: '12px',
      fontWeight: 600,
      borderRadius: '9999px',
      backgroundColor: s.bg,
      color: s.color,
    };
  };

  return (
    <div
      style={{
        padding: '28px 32px',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        maxWidth: '960px',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1
          style={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#1C1C1A',
            margin: 0,
          }}
        >
          Dashboard
        </h1>
        <p style={{ fontSize: '13px', color: '#9CA3AF', margin: '3px 0 0' }}>
          Ringkasan data laundry hari ini
        </p>
      </div>

      {/* Summary Cards 2x2 */}
      <div
        className="dashboard-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        {cards.map((card, i) => (
          <div
            key={i}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E4E4E0',
              borderRadius: '8px',
              padding: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              {card.icon}
              <span style={{ fontSize: '13px', color: '#9CA3AF' }}>{card.label}</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#1C1C1A' }}>
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* Transaksi Terbaru */}
      <div style={{ marginBottom: '8px' }}>
        <h2
          style={{
            fontSize: '15px',
            fontWeight: 600,
            color: '#1C1C1A',
            margin: '0 0 14px 0',
          }}
        >
          Transaksi Terbaru
        </h2>
      </div>

      <div
        className="table-container"
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E4E4E0',
          borderRadius: '8px',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#F7F7F5', borderBottom: '1px solid #E4E4E0' }}>
              <th style={thStyle}>No Nota</th>
              <th style={thStyle}>Pelanggan</th>
              <th style={thStyle}>Tgl Masuk</th>
              <th style={thStyle}>Total</th>
              <th style={thStyle}>Status Bayar</th>
              <th style={thStyle}>Status Cucian</th>
              <th style={{ ...thStyle, textAlign: 'right', width: '60px' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {transaksiTerbaru?.length ? (
              transaksiTerbaru.map((t, i) => (
                <tr
                  key={t.id_transaksi}
                  style={{
                    borderBottom: i < transaksiTerbaru.length - 1 ? '1px solid #F0F0EE' : 'none',
                    height: '44px',
                  }}
                >
                  <td style={{ ...tdStyle, fontWeight: 500, color: '#1C1C1A' }}>
                    {t.id_transaksi}
                  </td>
                  <td style={{ ...tdStyle, color: '#6B6B67' }}>
                    {t.pelanggan?.nama_pelanggan || '—'}
                  </td>
                  <td style={{ ...tdStyle, color: '#9CA3AF', whiteSpace: 'nowrap' }}>
                    {formatTanggal(t.tgl_masuk)}
                  </td>
                  <td style={{ ...tdStyle, color: '#1C1C1A', fontVariantNumeric: 'tabular-nums' }}>
                    {formatRupiah(t.total_bayar)}
                  </td>
                  <td style={tdStyle}>
                    <span style={statusBayarBadge(t.status_bayar)}>{t.status_bayar}</span>
                  </td>
                  <td style={tdStyle}>
                    <span style={statusCucianBadge(t.status_cucian)}>{t.status_cucian}</span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>
                    <Link
                      href={`/admin/transaksi/${t.id_transaksi}`}
                      style={{ fontSize: '13px', color: '#0F766E', textDecoration: 'none', fontWeight: 500 }}
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
                  style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF', fontSize: '14px' }}
                >
                  Belum ada transaksi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thStyle = {
  padding: '10px 14px',
  textAlign: 'left',
  fontSize: '12px',
  fontWeight: 600,
  color: '#9CA3AF',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

const tdStyle = {
  padding: '0 14px',
};
