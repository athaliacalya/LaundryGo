'use client';

import { useState, useActionState } from 'react';

const inputStyle = {
  width: '100%',
  minHeight: '44px',
  padding: '10px 12px',
  fontSize: '16px',
  color: '#1C1C1A',
  backgroundColor: '#FFFFFF',
  border: '1px solid #E4E4E0',
  borderRadius: '6px',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: "'Plus Jakarta Sans', sans-serif",
};

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 500,
  color: '#1C1C1A',
  marginBottom: '6px',
};

function formatRupiah(angka) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(angka || 0);
}

export default function TransaksiForm({ action, pelangganList, layananList, backUrl }) {
  const [state, formAction, isPending] = useActionState(action, null);
  const [items, setItems] = useState([{ id_layanan: '', jumlah: '' }]);
  const [bayarAwal, setBayarAwal] = useState('');

  function addItem() {
    setItems([...items, { id_layanan: '', jumlah: '' }]);
  }

  function removeItem(idx) {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== idx));
  }

  function updateItem(idx, field, value) {
    const updated = [...items];
    updated[idx] = { ...updated[idx], [field]: value };
    setItems(updated);
  }

  // Hitung total
  const layananMap = new Map((layananList || []).map((l) => [String(l.id_layanan), l]));
  let totalBayar = 0;
  const itemsDetail = items.map((item) => {
    const l = layananMap.get(String(item.id_layanan));
    const jumlah = parseFloat(item.jumlah) || 0;
    const subtotal = l ? Math.round(jumlah * l.harga) : 0;
    totalBayar += subtotal;
    return { ...item, layanan: l, jumlah, subtotal };
  });

  return (
    <form
      action={(fd) => {
        // Sertakan data items sebagai JSON
        fd.set('items', JSON.stringify(items.map((i) => ({
          id_layanan: parseInt(i.id_layanan, 10),
          jumlah: parseFloat(i.jumlah) || 0,
        })).filter((i) => i.id_layanan && i.jumlah > 0)));
        fd.set('bayar_awal', bayarAwal || '0');
        return formAction(fd);
      }}
      style={{ maxWidth: '680px' }}
    >
      {state?.error && (
        <div
          style={{
            padding: '10px 14px',
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '6px',
            color: '#B91C1C',
            fontSize: '13px',
            marginBottom: '16px',
          }}
        >
          {state.error}
        </div>
      )}

      {/* Pilih Pelanggan */}
      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="id_pelanggan" style={labelStyle}>
          Pelanggan <span style={{ color: '#EF4444' }}>*</span>
        </label>
        <select
          id="id_pelanggan"
          name="id_pelanggan"
          required
          style={inputStyle}
        >
          <option value="">— Pilih pelanggan —</option>
          {(pelangganList || []).map((p) => (
            <option key={p.id_pelanggan} value={p.id_pelanggan}>
              {p.nama_pelanggan} — {p.no_hp}
            </option>
          ))}
        </select>
      </div>

      {/* Tanggal Masuk */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="tgl_masuk" style={labelStyle}>
          Tanggal Masuk
        </label>
        <input
          id="tgl_masuk"
          name="tgl_masuk"
          type="datetime-local"
          defaultValue={new Date().toISOString().slice(0, 16)}
          style={{ ...inputStyle, width: '100%', maxWidth: '280px' }}
        />
      </div>

      {/* Daftar Item Layanan */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{ ...labelStyle, marginBottom: 0 }}>Item Layanan Cucian</span>
          <button
            type="button"
            onClick={addItem}
            className="tambah-baris-btn"
            style={{
              padding: '6px 14px',
              fontSize: '13px',
              fontWeight: 500,
              color: '#0F766E',
              backgroundColor: '#ECFDF5',
              border: '1px solid #A7F3D0',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            + Tambah Baris
          </button>
        </div>

        <div
          className="transaksi-items-wrapper table-container"
          style={{
            border: '1px solid #E4E4E0',
            borderRadius: '8px',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            backgroundColor: '#FFFFFF',
          }}
        >
          <table className="transaksi-items-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F7F7F5', borderBottom: '1px solid #E4E4E0' }}>
                <th style={{ textAlign: 'left', padding: '10px 12px', fontWeight: 500, color: '#6B6B67' }}>Layanan</th>
                <th style={{ textAlign: 'center', padding: '10px 12px', fontWeight: 500, color: '#6B6B67', width: '110px' }}>Jumlah</th>
                <th style={{ textAlign: 'right', padding: '10px 12px', fontWeight: 500, color: '#6B6B67', width: '130px' }}>Subtotal</th>
                <th style={{ width: '48px' }}></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => {
                const detail = itemsDetail[idx];
                return (
                  <tr key={idx} style={{ borderBottom: '1px solid #F0F0EE' }}>
                    <td className="td-layanan" style={{ padding: '8px 12px' }}>
                      <label className="mobile-only-label">
                        Layanan #{idx + 1}
                      </label>
                      <select
                        value={item.id_layanan}
                        onChange={(e) => updateItem(idx, 'id_layanan', e.target.value)}
                        required
                        style={{ ...inputStyle, minHeight: '44px', fontSize: '16px' }}
                      >
                        <option value="">Pilih layanan</option>
                        {(layananList || []).map((l) => (
                          <option key={l.id_layanan} value={l.id_layanan}>
                            {l.nama_layanan} ({formatRupiah(l.harga)}/{l.satuan})
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="td-jumlah" style={{ padding: '8px 6px', textAlign: 'center' }}>
                      <label className="mobile-only-label">
                        Jumlah ({detail?.layanan?.satuan || 'satuan'})
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={item.jumlah}
                        onChange={(e) => updateItem(idx, 'jumlah', e.target.value)}
                        required
                        placeholder="0"
                        style={{ ...inputStyle, minHeight: '44px', fontSize: '16px', textAlign: 'center' }}
                      />
                    </td>
                    <td className="td-subtotal" style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 500, color: '#0F766E', fontSize: '14px' }}>
                      <span className="mobile-only-label">Subtotal</span>
                      <span className="subtotal-val">{detail?.subtotal > 0 ? formatRupiah(detail.subtotal) : '—'}</span>
                    </td>
                    <td className="td-hapus" style={{ padding: '8px 6px', textAlign: 'center' }}>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          className="hapus-baris-btn"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#DC2626',
                            cursor: 'pointer',
                            fontSize: '18px',
                            padding: '4px 8px',
                          }}
                          title="Hapus baris"
                        >
                          <span className="desktop-hapus-icon">&times;</span>
                          <span className="mobile-hapus-text">Hapus Item</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: '2px solid #E4E4E0', backgroundColor: '#FAFAF9' }}>
                <td colSpan={2} style={{ padding: '12px 14px', fontWeight: 600, textAlign: 'right', color: '#1C1C1A' }}>
                  Total:
                </td>
                <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 700, color: '#0F766E', fontSize: '16px' }}>
                  {formatRupiah(totalBayar)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Pembayaran Awal (DP / Lunas) */}
      <div style={{ marginBottom: '24px' }}>
        <label style={labelStyle}>
          Pembayaran Awal / DP (opsional)
        </label>
        
        {/* Baris Dua Kolom: Menjadi satu kolom di layar < 640px */}
        <div
          className="form-row-2col"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '8px',
          }}
        >
          <div>
            <label htmlFor="bayar_awal" className="mobile-only-label" style={{ fontSize: '12px', color: '#6B6B67', marginBottom: '4px' }}>
              Jumlah Bayar Awal (Rp)
            </label>
            <input
              id="bayar_awal"
              type="number"
              min="0"
              value={bayarAwal}
              onChange={(e) => setBayarAwal(e.target.value)}
              placeholder="Nominal DP (0)"
              style={{ ...inputStyle, minHeight: '44px', fontSize: '16px' }}
            />
          </div>
          <div>
            <label htmlFor="metode_bayar" className="mobile-only-label" style={{ fontSize: '12px', color: '#6B6B67', marginBottom: '4px' }}>
              Metode Pembayaran
            </label>
            <select
              id="metode_bayar"
              name="metode_bayar"
              style={{ ...inputStyle, minHeight: '44px', fontSize: '16px' }}
            >
              <option value="tunai">Tunai</option>
              <option value="transfer">Transfer</option>
              <option value="qris">QRIS</option>
            </select>
          </div>
        </div>

        {totalBayar > 0 && (
          <button
            type="button"
            onClick={() => setBayarAwal(String(totalBayar))}
            className="bayar-lunas-btn"
            style={{
              padding: '8px 14px',
              fontSize: '13px',
              fontWeight: 500,
              color: '#0F766E',
              backgroundColor: '#ECFDF5',
              border: '1px solid #A7F3D0',
              borderRadius: '6px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Bayar Lunas ({formatRupiah(totalBayar)})
          </button>
        )}
      </div>

      {/* Tombol Aksi */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '24px', flexWrap: 'wrap' }}>
        <button
          type="submit"
          disabled={isPending}
          className="primary-btn"
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: 600,
            color: '#FFFFFF',
            backgroundColor: isPending ? '#0D9488' : '#0F766E',
            border: 'none',
            borderRadius: '6px',
            cursor: isPending ? 'not-allowed' : 'pointer',
          }}
        >
          {isPending ? 'Menyimpan...' : 'Buat Transaksi'}
        </button>
        <a
          href={backUrl}
          className="cancel-btn"
          style={{
            padding: '10px 16px',
            fontSize: '14px',
            fontWeight: 500,
            color: '#6B6B67',
            border: '1px solid #E4E4E0',
            borderRadius: '6px',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Batal
        </a>
      </div>

      <style>{`
        @media (min-width: 640px) {
          .mobile-only-label {
            display: none !important;
          }
          .mobile-hapus-text {
            display: none !important;
          }
          .desktop-hapus-icon {
            display: inline !important;
          }
        }
        @media (max-width: 639px) {
          .mobile-only-label {
            display: block !important;
            font-size: 12px !important;
            font-weight: 500 !important;
            color: #6B6B67 !important;
            margin-bottom: 4px !important;
          }
          .mobile-hapus-text {
            display: inline !important;
          }
          .desktop-hapus-icon {
            display: none !important;
          }
          .form-row-2col {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .transaksi-items-wrapper {
            background: transparent !important;
            border: none !important;
            overflow: visible !important;
          }
          .transaksi-items-table {
            display: block !important;
            min-width: 0 !important;
            width: 100% !important;
          }
          .transaksi-items-table thead {
            display: none !important;
          }
          .transaksi-items-table tbody {
            display: flex !important;
            flex-direction: column !important;
            gap: 12px !important;
            width: 100% !important;
          }
          .transaksi-items-table tbody tr {
            display: flex !important;
            flex-direction: column !important;
            gap: 8px !important;
            background: #FFFFFF !important;
            border: 1px solid #E4E4E0 !important;
            border-radius: 8px !important;
            padding: 12px !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }
          .transaksi-items-table tbody td {
            display: block !important;
            padding: 0 !important;
            border: none !important;
            width: 100% !important;
            text-align: left !important;
            height: auto !important;
          }
          .transaksi-items-table .td-layanan select {
            width: 100% !important;
            min-height: 44px !important;
            font-size: 16px !important;
          }
          .transaksi-items-table .td-jumlah input {
            width: 100% !important;
            min-height: 44px !important;
            font-size: 16px !important;
            text-align: left !important;
          }
          .transaksi-items-table .td-subtotal {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            padding-top: 6px !important;
            padding-bottom: 6px !important;
            border-top: 1px dashed #E4E4E0 !important;
          }
          .transaksi-items-table .td-subtotal .subtotal-val {
            font-size: 15px !important;
            font-weight: 600 !important;
            color: #0F766E !important;
          }
          .transaksi-items-table .hapus-baris-btn {
            width: 100% !important;
            min-height: 44px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            background-color: #FEF2F2 !important;
            color: #DC2626 !important;
            border: 1px solid #FECACA !important;
            border-radius: 6px !important;
            font-size: 13px !important;
            font-weight: 500 !important;
            margin-top: 4px !important;
          }
          .transaksi-items-table tfoot {
            display: block !important;
            width: 100% !important;
            margin-top: 12px !important;
          }
          .transaksi-items-table tfoot tr {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            padding: 12px 14px !important;
            background: #FFFFFF !important;
            border: 1px solid #E4E4E0 !important;
            border-radius: 8px !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }
          .transaksi-items-table tfoot td {
            display: inline-block !important;
            padding: 0 !important;
            border: none !important;
            height: auto !important;
          }
        }
        @media (max-width: 767px) {
          .primary-btn {
            min-height: 48px !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            flex: 1 1 auto !important;
          }
          .cancel-btn {
            min-height: 48px !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .tambah-baris-btn {
            min-height: 44px !important;
            display: inline-flex !important;
            align-items: center !important;
          }
          .bayar-lunas-btn {
            min-height: 44px !important;
            width: 100% !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
        }
      `}</style>
    </form>
  );
}

