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

export default function PembayaranForm({ idTransaksi, sisaTagihan, catatPembayaranAction }) {
  const boundAction = catatPembayaranAction.bind(null, idTransaksi);
  const [state, formAction, isPending] = useActionState(boundAction, null);
  const [jumlah, setJumlah] = useState('');

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E4E4E0',
        borderRadius: '8px',
        padding: '20px',
      }}
    >
      <h3
        style={{
          fontSize: '15px',
          fontWeight: 600,
          color: '#1C1C1A',
          margin: '0 0 16px',
        }}
      >
        Catat Pembayaran
      </h3>

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

      {state?.success && (
        <div
          style={{
            padding: '10px 14px',
            backgroundColor: '#F0FDF4',
            border: '1px solid #BBF7D0',
            borderRadius: '6px',
            color: '#166534',
            fontSize: '13px',
            marginBottom: '16px',
          }}
        >
          Pembayaran berhasil dicatat.
        </div>
      )}

      <form action={formAction}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '150px' }}>
            <label htmlFor="jumlah_bayar" style={labelStyle}>
              Jumlah Bayar
            </label>
            <input
              id="jumlah_bayar"
              name="jumlah_bayar"
              type="number"
              min="1"
              max={sisaTagihan}
              required
              value={jumlah}
              onChange={(e) => setJumlah(e.target.value)}
              placeholder="0"
              style={{ ...inputStyle, width: '180px' }}
            />
          </div>
          <div style={{ minWidth: '130px' }}>
            <label htmlFor="metode" style={labelStyle}>
              Metode
            </label>
            <select id="metode" name="metode" style={{ ...inputStyle, width: '140px' }}>
              <option value="tunai">Tunai</option>
              <option value="transfer">Transfer</option>
              <option value="qris">QRIS</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setJumlah(String(sisaTagihan))}
              style={{
                padding: '9px 14px',
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
              Bayar Lunas
            </button>
            <button
              type="submit"
              disabled={isPending}
              style={{
                padding: '9px 16px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#FFFFFF',
                backgroundColor: isPending ? '#0D9488' : '#0F766E',
                border: 'none',
                borderRadius: '6px',
                cursor: isPending ? 'not-allowed' : 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {isPending ? 'Menyimpan...' : 'Simpan Pembayaran'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
