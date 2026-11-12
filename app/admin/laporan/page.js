import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import ExportCSV from '@/components/laporan/ExportCSV';

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

import PrintButton from '@/components/laporan/PrintButton';

export default async function LaporanPage({ searchParams }) {
  const sp = await searchParams;

  // Default: dari = first day of current month, sampai = today
  const now = new Date();
  const defaultDari = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
  const defaultSampai = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const dari = sp?.dari || defaultDari;
  const sampai = sp?.sampai || defaultSampai;

  // Date range: dari 00:00 to sampai 23:59:59
  const dariISO = new Date(dari + 'T00:00:00').toISOString();
  const sampaiISO = new Date(sampai + 'T23:59:59').toISOString();

  // Fetch transaksi in range
  const { data: transaksi } = await supabaseAdmin
    .from('transaksi')
    .select('id_transaksi, tgl_masuk, total_bayar, status_bayar, pelanggan(nama_pelanggan)')
    .gte('tgl_masuk', dariISO)
    .lte('tgl_masuk', sampaiISO)
    .order('tgl_masuk', { ascending: false });

  // Fetch pembayaran in range for total pendapatan
  const { data: pembayaran } = await supabaseAdmin
    .from('pembayaran')
    .select('jumlah_bayar')
    .gte('tgl_bayar', dariISO)
    .lte('tgl_bayar', sampaiISO);

  const totalPendapatan = (pembayaran || []).reduce((sum, p) => sum + (p.jumlah_bayar || 0), 0);
  const jumlahTransaksi = transaksi?.length || 0;

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

  return (
    <div
      style={{
        padding: '28px 32px',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        maxWidth: '960px',
      }}
    >
      {/* Print styles */}
      <style>{`
        @media print {
          aside, .no-print {
            display: none !important;
          }
          main {
            margin: 0 !important;
            padding: 0 !important;
          }
          body {
            font-family: 'Plus Jakarta Sans', sans-serif;
          }
          .print-title {
            display: block !important;
          }
        }
        .print-title {
          display: none;
        }
      `}</style>

      {/* Print-only title */}
      <div className="print-title" style={{ marginBottom: '16px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#1C1C1A', margin: 0 }}>
          Laporan Pendapatan LaundryGo
        </h1>
        <p style={{ fontSize: '13px', color: '#6B6B67', margin: '4px 0 0' }}>
          Periode: {formatTanggal(dari)} – {formatTanggal(sampai)}
        </p>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h1
          style={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#1C1C1A',
            margin: 0,
          }}
        >
          Laporan Pendapatan
        </h1>
        <p style={{ fontSize: '13px', color: '#9CA3AF', margin: '3px 0 0' }}>
          Lihat ringkasan pendapatan dalam periode tertentu
        </p>
      </div>

      {/* Date Filter Form */}
      <form
        method="GET"
        className="no-print report-filter-form"
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '12px',
          marginBottom: '20px',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#6B6B67', marginBottom: '4px' }}>
            Dari
          </label>
          <input
            type="date"
            name="dari"
            defaultValue={dari}
            style={{
              padding: '8px 12px',
              fontSize: '14px',
              color: '#1C1C1A',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E4E4E0',
              borderRadius: '6px',
              outline: 'none',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#6B6B67', marginBottom: '4px' }}>
            Sampai
          </label>
          <input
            type="date"
            name="sampai"
            defaultValue={sampai}
            style={{
              padding: '8px 12px',
              fontSize: '14px',
              color: '#1C1C1A',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E4E4E0',
              borderRadius: '6px',
              outline: 'none',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: '8px 18px',
            fontSize: '13px',
            fontWeight: 600,
            color: '#FFFFFF',
            backgroundColor: '#0F766E',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          Filter
        </button>
      </form>

      {/* Summary Card */}
      <div
        className="laporan-summary-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E4E4E0',
            borderRadius: '8px',
            padding: '20px',
          }}
        >
          <div style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '6px' }}>
            Total Pendapatan
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#0F766E' }}>
            {formatRupiah(totalPendapatan)}
          </div>
        </div>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E4E4E0',
            borderRadius: '8px',
            padding: '20px',
          }}
        >
          <div style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '6px' }}>
            Jumlah Transaksi
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#1C1C1A' }}>
            {jumlahTransaksi}
          </div>
        </div>
      </div>

      {/* Table */}
      <div
        className="table-container"
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E4E4E0',
          borderRadius: '8px',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          marginBottom: '16px',
        }}
      >
        <table style={{ width: '100%', minWidth: '550px', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#F7F7F5', borderBottom: '1px solid #E4E4E0' }}>
              <th style={thStyle}>No Nota</th>
              <th style={thStyle}>Tanggal</th>
              <th style={thStyle}>Pelanggan</th>
              <th style={thStyle}>Total</th>
              <th style={thStyle}>Status Bayar</th>
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
                  <td style={{ ...tdStyle, fontWeight: 500, color: '#1C1C1A' }}>
                    {t.id_transaksi}
                  </td>
                  <td style={{ ...tdStyle, color: '#9CA3AF', whiteSpace: 'nowrap' }}>
                    {formatTanggal(t.tgl_masuk)}
                  </td>
                  <td style={{ ...tdStyle, color: '#6B6B67' }}>
                    {t.pelanggan?.nama_pelanggan || '—'}
                  </td>
                  <td style={{ ...tdStyle, color: '#1C1C1A', fontVariantNumeric: 'tabular-nums' }}>
                    {formatRupiah(t.total_bayar)}
                  </td>
                  <td style={tdStyle}>
                    <span style={statusBayarBadge(t.status_bayar)}>{t.status_bayar}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF', fontSize: '14px' }}
                >
                  Tidak ada transaksi dalam periode ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Export Buttons */}
      <div className="no-print" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <ExportCSV data={transaksi || []} dari={dari} sampai={sampai} />
        <PrintButton />
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
