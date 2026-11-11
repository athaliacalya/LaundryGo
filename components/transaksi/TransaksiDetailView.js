import Link from 'next/link';
import PrintNotaButton from './PrintNotaButton';
import PembayaranForm from './PembayaranForm';
import StatusCucianButton from './StatusCucianButton';

function formatTanggal(str) {
  if (!str) return '—';
  const d = new Date(str);
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatTanggalShort(str) {
  if (!str) return '—';
  const d = new Date(str);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatRupiah(val) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(val || 0);
}

const statusBayarStyle = (status) => {
  if (status === 'lunas') {
    return {
      display: 'inline-block',
      padding: '3px 10px',
      fontSize: '12px',
      fontWeight: 600,
      borderRadius: '999px',
      backgroundColor: '#DCFCE7',
      color: '#166534',
    };
  }
  return {
    display: 'inline-block',
    padding: '3px 10px',
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
    padding: '3px 10px',
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

export default function TransaksiDetailView({
  transaksi,
  items,
  pembayaran,
  rolePrefix,
  updateStatusAction,
  catatPembayaranAction,
}) {
  const totalSudahBayar = (pembayaran || []).reduce((acc, p) => acc + (p.jumlah_bayar || 0), 0);
  const sisaTagihan = Math.max(0, transaksi.total_bayar - totalSudahBayar);

  return (
    <div
      style={{
        padding: '28px 32px',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        maxWidth: '960px',
      }}
    >
      {/* CSS untuk Cetak Nota */}
      <style>{`
        @media print {
          aside, nav, .no-print, header {
            display: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
          }
          body {
            background-color: #FFFFFF !important;
            color: #000000 !important;
            font-family: 'Courier New', Courier, monospace !important;
          }
          .screen-view {
            display: none !important;
          }
          .print-nota {
            display: block !important;
            width: 320px !important;
            margin: 0 auto !important;
            padding: 10px !important;
            font-size: 12px !important;
            color: #000000 !important;
          }
        }
        @media screen {
          .print-nota {
            display: none;
          }
        }
      `}</style>

      {/* ================= TAMPILAN CETAK NOTA (STRUK KASIR) ================= */}
      <div className="print-nota">
        <div style={{ textAlign: 'center', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 4px' }}>LaundryGo</h2>
          <p style={{ margin: '0', fontSize: '11px' }}>Sistem Informasi Laundry Modern</p>
          <p style={{ margin: '2px 0 0', fontSize: '11px' }}>Jl. Raya Utama No. 88, Telp. 0812-3456-7890</p>
        </div>

        <div style={{ borderTop: '1px dashed #000', margin: '8px 0' }} />

        <table style={{ width: '100%', fontSize: '11px', marginBottom: '8px' }}>
          <tbody>
            <tr>
              <td>No Nota</td>
              <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{transaksi.id_transaksi}</td>
            </tr>
            <tr>
              <td>Tgl Masuk</td>
              <td style={{ textAlign: 'right' }}>{formatTanggal(transaksi.tgl_masuk)}</td>
            </tr>
            <tr>
              <td>Est. Selesai</td>
              <td style={{ textAlign: 'right' }}>{formatTanggalShort(transaksi.tgl_selesai)}</td>
            </tr>
            <tr>
              <td>Pelanggan</td>
              <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{transaksi.pelanggan?.nama_pelanggan}</td>
            </tr>
            <tr>
              <td>No HP</td>
              <td style={{ textAlign: 'right' }}>{transaksi.pelanggan?.no_hp || '—'}</td>
            </tr>
          </tbody>
        </table>

        <div style={{ borderTop: '1px dashed #000', margin: '8px 0' }} />

        <table style={{ width: '100%', fontSize: '11px', marginBottom: '8px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #000' }}>
              <th style={{ textAlign: 'left', paddingBottom: '4px' }}>Item</th>
              <th style={{ textAlign: 'center', paddingBottom: '4px' }}>Qty</th>
              <th style={{ textAlign: 'right', paddingBottom: '4px' }}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {(items || []).map((it, idx) => (
              <tr key={idx}>
                <td style={{ padding: '3px 0' }}>
                  {it.layanan?.nama_layanan || 'Layanan'}
                  <div style={{ fontSize: '10px', color: '#444' }}>
                    @{formatRupiah(it.harga_satuan)}/{it.layanan?.satuan || 'satuan'}
                  </div>
                </td>
                <td style={{ textAlign: 'center', padding: '3px 0' }}>{it.jumlah}</td>
                <td style={{ textAlign: 'right', padding: '3px 0' }}>{formatRupiah(it.subtotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ borderTop: '1px dashed #000', margin: '8px 0' }} />

        <table style={{ width: '100%', fontSize: '11px', marginBottom: '10px' }}>
          <tbody>
            <tr>
              <td>Total Tagihan</td>
              <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{formatRupiah(transaksi.total_bayar)}</td>
            </tr>
            <tr>
              <td>Sudah Dibayar</td>
              <td style={{ textAlign: 'right' }}>{formatRupiah(totalSudahBayar)}</td>
            </tr>
            <tr>
              <td>Sisa Tagihan</td>
              <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{formatRupiah(sisaTagihan)}</td>
            </tr>
            <tr>
              <td>Status Bayar</td>
              <td style={{ textAlign: 'right', textTransform: 'uppercase', fontWeight: 'bold' }}>
                {transaksi.status_bayar}
              </td>
            </tr>
            <tr>
              <td>Status Cucian</td>
              <td style={{ textAlign: 'right', textTransform: 'uppercase' }}>
                {transaksi.status_cucian}
              </td>
            </tr>
          </tbody>
        </table>

        <div style={{ borderTop: '1px dashed #000', margin: '8px 0' }} />

        <div style={{ textAlign: 'center', fontSize: '10px', marginTop: '12px' }}>
          <p style={{ margin: '0 0 3px' }}>Terima kasih atas kepercayaan Anda!</p>
          <p style={{ margin: '0' }}>Pengambilan cucian wajib membawa nota ini.</p>
        </div>
      </div>

      {/* ================= TAMPILAN LAYAR (DASHBOARD) ================= */}
      <div className="screen-view">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}>
          <Link
            href={`/${rolePrefix}/transaksi`}
            style={{ fontSize: '13px', color: '#9CA3AF', textDecoration: 'none' }}
          >
            Transaksi
          </Link>
          <span style={{ fontSize: '13px', color: '#D1D5DB' }}>/</span>
          <span style={{ fontSize: '13px', color: '#6B6B67' }}>{transaksi.id_transaksi}</span>
        </div>

        {/* Header Transaksi */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <h1
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#1C1C1A',
                  margin: 0,
                }}
              >
                Nota: {transaksi.id_transaksi}
              </h1>
              <span style={statusBayarStyle(transaksi.status_bayar)}>
                {transaksi.status_bayar === 'lunas' ? 'Lunas' : 'Belum Lunas'}
              </span>
              <span style={statusCucianStyle(transaksi.status_cucian)}>
                {transaksi.status_cucian.charAt(0).toUpperCase() + transaksi.status_cucian.slice(1)}
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#9CA3AF', margin: 0 }}>
              Masuk: {formatTanggal(transaksi.tgl_masuk)} • Estimasi Selesai: {formatTanggalShort(transaksi.tgl_selesai)}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <PrintNotaButton />
          </div>
        </div>

        {/* Grid Info Pelanggan & Transaksi */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E4E4E0',
              borderRadius: '8px',
              padding: '18px 20px',
            }}
          >
            <h2 style={{ fontSize: '12px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 10px', fontWeight: 600 }}>
              Informasi Pelanggan
            </h2>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#1C1C1A', marginBottom: '4px' }}>
              {transaksi.pelanggan?.nama_pelanggan}
            </div>
            <div style={{ fontSize: '13px', color: '#6B6B67', marginBottom: '2px' }}>
              No HP: {transaksi.pelanggan?.no_hp || '—'}
            </div>
            <div style={{ fontSize: '13px', color: '#6B6B67' }}>
              Alamat: {transaksi.pelanggan?.alamat || '—'}
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E4E4E0',
              borderRadius: '8px',
              padding: '18px 20px',
            }}
          >
            <h2 style={{ fontSize: '12px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 10px', fontWeight: 600 }}>
              Ringkasan Pembayaran
            </h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
              <span style={{ color: '#6B6B67' }}>Total Tagihan:</span>
              <span style={{ fontWeight: 600, color: '#1C1C1A' }}>{formatRupiah(transaksi.total_bayar)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
              <span style={{ color: '#6B6B67' }}>Sudah Dibayar:</span>
              <span style={{ fontWeight: 600, color: '#0F766E' }}>{formatRupiah(totalSudahBayar)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', paddingTop: '6px', borderTop: '1px dashed #E4E4E0' }}>
              <span style={{ color: '#6B6B67', fontWeight: 500 }}>Sisa Tagihan:</span>
              <span style={{ fontWeight: 700, color: sisaTagihan > 0 ? '#B91C1C' : '#0F766E' }}>
                {formatRupiah(sisaTagihan)}
              </span>
            </div>
          </div>
        </div>

        {/* Tabel Rincian Item Cucian */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#1C1C1A', margin: '0 0 12px' }}>
            Rincian Item Layanan
          </h2>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E4E4E0',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F7F7F5', borderBottom: '1px solid #E4E4E0' }}>
                  <th style={thStyle}>Layanan</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>Jumlah</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Harga Satuan</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {(items || []).map((it, idx) => (
                  <tr
                    key={idx}
                    style={{
                      borderBottom: idx < items.length - 1 ? '1px solid #F0F0EE' : 'none',
                      height: '44px',
                    }}
                  >
                    <td style={{ ...tdStyle, fontWeight: 500, color: '#1C1C1A' }}>
                      {it.layanan?.nama_layanan || '—'}
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center', color: '#6B6B67' }}>
                      {it.jumlah} {it.layanan?.satuan || ''}
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'right', color: '#6B6B67', fontVariantNumeric: 'tabular-nums' }}>
                      {formatRupiah(it.harga_satuan)}
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 600, color: '#1C1C1A', fontVariantNumeric: 'tabular-nums' }}>
                      {formatRupiah(it.subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ backgroundColor: '#FAFAF9', borderTop: '2px solid #E4E4E0' }}>
                  <td colSpan={3} style={{ ...tdStyle, fontWeight: 600, textAlign: 'right', color: '#1C1C1A', height: '44px' }}>
                    Total:
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700, color: '#0F766E', fontSize: '15px' }}>
                    {formatRupiah(transaksi.total_bayar)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Riwayat Pembayaran */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#1C1C1A', margin: '0 0 12px' }}>
            Riwayat Pembayaran
          </h2>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E4E4E0',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F7F7F5', borderBottom: '1px solid #E4E4E0' }}>
                  <th style={thStyle}>Tanggal Pembayaran</th>
                  <th style={thStyle}>Metode</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Jumlah Dibayar</th>
                </tr>
              </thead>
              <tbody>
                {pembayaran && pembayaran.length > 0 ? (
                  pembayaran.map((p, idx) => (
                    <tr
                      key={p.id_pembayaran || idx}
                      style={{
                        borderBottom: idx < pembayaran.length - 1 ? '1px solid #F0F0EE' : 'none',
                        height: '42px',
                      }}
                    >
                      <td style={{ ...tdStyle, color: '#1C1C1A' }}>
                        {formatTanggal(p.tgl_bayar)}
                      </td>
                      <td style={{ ...tdStyle, color: '#6B6B67', textTransform: 'capitalize' }}>
                        {p.metode}
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 600, color: '#0F766E' }}>
                        {formatRupiah(p.jumlah_bayar)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} style={{ ...tdStyle, padding: '24px', textAlign: 'center', color: '#9CA3AF' }}>
                      Belum ada catatan pembayaran.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Panel Form Pembayaran & Update Status Cucian */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '16px',
            marginTop: '28px',
          }}
        >
          {/* Form Pembayaran (jika belum lunas) */}
          {sisaTagihan > 0 ? (
            <PembayaranForm
              idTransaksi={transaksi.id_transaksi}
              sisaTagihan={sisaTagihan}
              catatPembayaranAction={catatPembayaranAction}
            />
          ) : (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E4E4E0',
                borderRadius: '8px',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#DCFCE7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#166534',
                  flexShrink: 0,
                }}
              >
                ✓
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#166534' }}>
                  Pembayaran Lunas
                </div>
                <div style={{ fontSize: '13px', color: '#6B6B67' }}>
                  Tidak ada sisa tagihan untuk transaksi ini.
                </div>
              </div>
            </div>
          )}

          {/* Tombol Perubahan Status Cucian */}
          <StatusCucianButton
            idTransaksi={transaksi.id_transaksi}
            currentStatus={transaksi.status_cucian}
            updateAction={updateStatusAction}
          />
        </div>
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

