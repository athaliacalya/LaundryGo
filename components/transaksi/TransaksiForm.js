'use client';

import { useState, useActionState } from 'react';

const inputStyle = {
  width: '100%',
  padding: '9px 12px',
  fontSize: '14px',
  color: '#1C1C1A',
  backgroundColor: '#FFFFFF',
  border: '1px solid #E4E4E0',
  borderRadius: '6px',
  outline: 'none',
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
          style={{ ...inputStyle, width: '240px' }}
        />
      </div>

      {/* Daftar Item Layanan */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ ...labelStyle, marginBottom: 0 }}>Item Layanan Cucian</span>
          <button
            type="button"
            onClick={addItem}
            style={{
              padding: '4px 12px',
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
          className="table-container"
          style={{
            border: '1px solid #E4E4E0',
            borderRadius: '8px',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            backgroundColor: '#FFFFFF',
          }}
        >
          <table style={{ width: '100%', minWidth: '460px', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F7F7F5', borderBottom: '1px solid #E4E4E0' }}>
                <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 500, color: '#6B6B67' }}>Layanan</th>
                <th style={{ textAlign: 'center', padding: '8px 12px', fontWeight: 500, color: '#6B6B67', width: '100px' }}>Jumlah</th>
                <th style={{ textAlign: 'right', padding: '8px 12px', fontWeight: 500, color: '#6B6B67', width: '130px' }}>Subtotal</th>
                <th style={{ width: '40px' }}></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => {
                const detail = itemsDetail[idx];
                return (
                  <tr key={idx} style={{ borderBottom: '1px solid #F0F0EE' }}>
                    <td style={{ padding: '8px 12px' }}>
                      <select
                        value={item.id_layanan}
                        onChange={(e) => updateItem(idx, 'id_layanan', e.target.value)}
                        required
                        style={{ ...inputStyle, padding: '6px 8px', fontSize: '13px' }}
                      >
                        <option value="">Pilih layanan</option>
                        {(layananList || []).map((l) => (
                          <option key={l.id_layanan} value={l.id_layanan}>
                            {l.nama_layanan} ({formatRupiah(l.harga)}/{l.satuan})
                          </option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: '8px 6px', textAlign: 'center' }}>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={item.jumlah}
                        onChange={(e) => updateItem(idx, 'jumlah', e.target.value)}
                        required
                        placeholder="0"
                        style={{ ...inputStyle, padding: '6px 8px', fontSize: '13px', textAlign: 'center', width: '80px' }}
                      />
                    </td>
                    <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 500, color: '#0F766E', fontSize: '13px' }}>
                      {detail?.subtotal > 0 ? formatRupiah(detail.subtotal) : '—'}
                    </td>
                    <td style={{ padding: '8px 6px', textAlign: 'center' }}>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#DC2626',
                            cursor: 'pointer',
                            fontSize: '16px',
                            padding: '2px 6px',
                          }}
                          title="Hapus baris"
                        >
                          &times;
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: '2px solid #E4E4E0', backgroundColor: '#FAFAF9' }}>
                <td colSpan={2} style={{ padding: '10px 12px', fontWeight: 600, textAlign: 'right', color: '#1C1C1A' }}>
                  Total:
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#0F766E', fontSize: '15px' }}>
                  {formatRupiah(totalBayar)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Pembayaran Awal (DP / Lunas) */}
      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="bayar_awal" style={labelStyle}>
          Pembayaran Awal / DP (opsional)
        </label>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            id="bayar_awal"
            type="number"
            min="0"
            value={bayarAwal}
            onChange={(e) => setBayarAwal(e.target.value)}
            placeholder="0"
            style={{ ...inputStyle, width: '180px' }}
          />
          <select name="metode_bayar" style={{ ...inputStyle, width: '140px' }}>
            <option value="tunai">Tunai</option>
            <option value="transfer">Transfer</option>
            <option value="qris">QRIS</option>
          </select>
          {totalBayar > 0 && (
            <button
              type="button"
              onClick={() => setBayarAwal(String(totalBayar))}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 500,
                color: '#0F766E',
                backgroundColor: '#ECFDF5',
                border: '1px solid #A7F3D0',
                borderRadius: '6px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Bayar Lunas
            </button>
          )}
        </div>
      </div>

      {/* Tombol Aksi */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
        <button
          type="submit"
          disabled={isPending}
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
          }}
        >
          Batal
        </a>
      </div>
    </form>
  );
}

