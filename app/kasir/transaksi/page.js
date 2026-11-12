import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { bersihkanKataCari } from '@/lib/cari';

const PER_HALAMAN = 10;

function formatTanggal(str) {
  if (!str) return '—';
  const d = new Date(str);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatRupiah(angka) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(angka || 0);
}

const statusBayarStyle = (status) => {
  if (status === 'lunas') {
    return {
      display: 'inline-block',
      padding: '2px 10px',
      fontSize: '12px',
      fontWeight: 600,
      borderRadius: '999px',
      backgroundColor: '#DCFCE7',
      color: '#166534',
    };
  }
  return {
    display: 'inline-block',
    padding: '2px 10px',
    fontSize: '12px',
    fontWeight: 600,
    borderRadius: '999px',
    backgroundColor: '#FEF9C3',
    color: '#854D0E',
  };
};

const statusCucianStyle = (status) => {
  const base = {
    display: 'inline-block',
    padding: '2px 10px',
    fontSize: '12px',
    fontWeight: 600,
    borderRadius: '999px',
  };
  switch (status) {
    case 'diterima':
      return { ...base, backgroundColor: '#F3F4F6', color: '#374151' };
    case 'diproses':
      return { ...base, backgroundColor: '#DBEAFE', color: '#1E40AF' };
    case 'selesai':
      return { ...base, backgroundColor: '#DCFCE7', color: '#166534' };
    case 'diambil':
      return { ...base, backgroundColor: '#F1F5F9', color: '#475569' };
    default:
      return { ...base, backgroundColor: '#F3F4F6', color: '#374151' };
  }
};

export default async function TransaksiKasirPage({ searchParams }) {
  const sp = await searchParams;
  const cari = sp?.cari || '';
  const kataKunci = bersihkanKataCari(cari);
  const halaman = parseInt(sp?.halaman || '1', 10);

  let query = supabaseAdmin
    .from('transaksi')
    .select('*, pelanggan(nama_pelanggan)', { count: 'exact' })
    .order('tgl_masuk', { ascending: false })
    .range((halaman - 1) * PER_HALAMAN, halaman * PER_HALAMAN - 1);

  if (kataKunci) {
    query = query.or(`id_transaksi.ilike.%${kataKunci}%,pelanggan.nama_pelanggan.ilike.%${kataKunci}%`);
  }

  const { data: transaksi, count } = await query;
  const totalHalaman = Math.max(1, Math.ceil((count || 0) / PER_HALAMAN));

  return (
    <div
      style={{
        padding: '28px 32px',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        maxWidth: '960px',
      }}
    >
      {/* Header */}
      <div
        className="page-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#1C1C1A',
              margin: 0,
            }}
          >
            Transaksi
          </h1>
          <p style={{ fontSize: '13px', color: '#9CA3AF', margin: '3px 0 0' }}>
            {count ?? 0} total transaksi
          </p>
        </div>
        <Link
          href="/kasir/transaksi/baru"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            fontSize: '13px',
            fontWeight: 600,
            color: '#FFFFFF',
            backgroundColor: '#0F766E',
            border: 'none',
            borderRadius: '6px',
            textDecoration: 'none',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Tambah Transaksi
        </Link>
      </div>

      {/* Search */}
      <form className="search-form" style={{ marginBottom: '16px' }}>
        <input
          name="cari"
          defaultValue={cari}
          placeholder="Cari no nota atau nama pelanggan..."
          className="search-input"
          style={{
            padding: '8px 12px',
            fontSize: '14px',
            color: '#1C1C1A',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E4E4E0',
            borderRadius: '6px',
            outline: 'none',
            width: '300px',
            maxWidth: '100%',
          }}
        />
      </form>

      {/* Tabel */}
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
        <table style={{ width: '100%', minWidth: '680px', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#F7F7F5', borderBottom: '1px solid #E4E4E0' }}>
              <th style={thStyle}>No Nota</th>
              <th style={thStyle}>Tgl Masuk</th>
              <th style={thStyle}>Pelanggan</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Total</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Status Bayar</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Status Cucian</th>
              <th style={{ ...thStyle, textAlign: 'right', width: '70px' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {transaksi?.length ? (
              transaksi.map((t, i) => (
                <tr
                  key={t.id_transaksi}
                  style={{
                    borderBottom: i < transaksi.length - 1 ? '1px solid #F0F0EE' : 'none',
                    height: '44px',
                  }}
                >
                  <td style={{ ...tdStyle, fontWeight: 500, color: '#1C1C1A', whiteSpace: 'nowrap' }}>
                    {t.id_transaksi}
                  </td>
                  <td style={{ ...tdStyle, color: '#6B6B67', whiteSpace: 'nowrap' }}>
                    {formatTanggal(t.tgl_masuk)}
                  </td>
                  <td style={{ ...tdStyle, color: '#1C1C1A' }}>
                    {t.pelanggan?.nama_pelanggan || '—'}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: '#1C1C1A', fontWeight: 500 }}>
                    {formatRupiah(t.total_bayar)}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <span style={statusBayarStyle(t.status_bayar)}>
                      {t.status_bayar === 'lunas' ? 'Lunas' : 'Belum'}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <span style={statusCucianStyle(t.status_cucian)}>
                      {t.status_cucian ? t.status_cucian.charAt(0).toUpperCase() + t.status_cucian.slice(1) : '—'}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <Link
                      href={`/kasir/transaksi/${t.id_transaksi}`}
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
                  {cari ? `Tidak ada transaksi dengan kata kunci "${cari}".` : 'Belum ada data transaksi.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalHalaman > 1 && (
        <div style={{ display: 'flex', gap: '6px', marginTop: '16px', alignItems: 'center' }}>
          {Array.from({ length: totalHalaman }, (_, i) => i + 1).map((h) => (
            <a
              key={h}
              href={`?cari=${cari}&halaman=${h}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                fontSize: '13px',
                fontWeight: h === halaman ? 600 : 400,
                color: h === halaman ? '#0F766E' : '#6B6B67',
                backgroundColor: h === halaman ? '#F0FDF9' : '#FFFFFF',
                border: `1px solid ${h === halaman ? '#0F766E' : '#E4E4E0'}`,
                borderRadius: '6px',
                textDecoration: 'none',
              }}
            >
              {h}
            </a>
          ))}
        </div>
      )}
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
