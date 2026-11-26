'use client';

import { useState, useActionState } from 'react';

const inputStyle = {
  width: '100%',
  minHeight: '44px',
  padding: '10px 12px',
  fontSize: '16px',
  color: '#1C1C1A',
  backgroundColor: '#FFFFFF',
  border: '1px solid #E5E7EB',
  borderRadius: '6px',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
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
  // State metode pembayaran & konfirmasi dana masuk untuk non-tunai
  const [metode, setMetode] = useState('tunai');
  const [danaChecked, setDanaChecked] = useState(false);

  const isNonTunai = metode === 'transfer' || metode === 'qris';
  const isTombolDisabled = isPending || (isNonTunai && !danaChecked);

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxSizing: 'border-box',
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

      <form action={formAction} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Baris Dua Kolom: Jumlah Bayar & Metode (menjadi 1 kolom di layar < 640px) */}
        <div
          className="pembayaran-form-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '16px',
          }}
        >
          <div>
            <label htmlFor="jumlah_bayar" style={labelStyle}>
              Jumlah Bayar (Rp) <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              id="jumlah_bayar"
              name="jumlah_bayar"
              type="number"
              min={1}
              max={sisaTagihan}
              step={1}
              inputMode="numeric"
              required
              value={jumlah}
              onChange={(e) => setJumlah(e.target.value)}
              placeholder="0"
              style={{ ...inputStyle, width: '100%' }}
            />
          </div>
          <div>
            <label htmlFor="metode" style={labelStyle}>
              Metode Pembayaran <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <select
              id="metode"
              name="metode"
              required
              value={metode}
              onChange={(e) => {
                setMetode(e.target.value);
                setDanaChecked(false); // Reset centang saat metode diganti
              }}
              style={{ ...inputStyle, width: '100%' }}
            >
              <option value="tunai">Tunai</option>
              <option value="transfer">Transfer</option>
              <option value="qris">QRIS</option>
            </select>
          </div>
        </div>

        {/* Kotak centang verifikasi dana masuk bila metode non-tunai */}
        {isNonTunai && (
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E5E7EB',
              borderRadius: '6px',
              marginBottom: '16px',
            }}
          >
            <label
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
                color: '#1E293B',
              }}
            >
              <input
                type="checkbox"
                checked={danaChecked}
                onChange={(e) => setDanaChecked(e.target.checked)}
                style={{
                  marginTop: '2px',
                  width: '16px',
                  height: '16px',
                  accentColor: '#0F766E',
                  cursor: 'pointer',
                }}
              />
              <div>
                <span>Dana sudah saya cek masuk</span>
                <span
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 400,
                    color: '#64748B',
                    marginTop: '2px',
                  }}
                >
                  Pastikan bukti transfer / notifikasi QRIS sudah diterima.
                </span>
              </div>
            </label>
          </div>
        )}

        {/* Tombol Aksi */}
        <div
          className="pembayaran-buttons-row"
          style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            flexWrap: 'wrap',
            marginTop: 'auto',
            paddingTop: '16px',
          }}
        >
          <button
            type="button"
            disabled={isTombolDisabled}
            onClick={() => setJumlah(String(sisaTagihan))}
            className="bayar-lunas-btn"
            style={{
              padding: '10px 16px',
              fontSize: '13px',
              fontWeight: 500,
              color: isTombolDisabled ? '#94A3B8' : '#0F766E',
              backgroundColor: isTombolDisabled ? '#F1F5F9' : '#ECFDF5',
              border: `1px solid ${isTombolDisabled ? '#E2E8F0' : '#A7F3D0'}`,
              borderRadius: '6px',
              cursor: isTombolDisabled ? 'not-allowed' : 'pointer',
              opacity: isTombolDisabled ? 0.6 : 1,
              whiteSpace: 'nowrap',
            }}
          >
            Bayar Lunas
          </button>
          <button
            type="submit"
            disabled={isTombolDisabled}
            className="primary-btn"
            style={{
              padding: '10px 18px',
              fontSize: '14px',
              fontWeight: 600,
              color: '#FFFFFF',
              backgroundColor: isTombolDisabled ? '#94A3B8' : '#0F766E',
              border: 'none',
              borderRadius: '6px',
              cursor: isTombolDisabled ? 'not-allowed' : 'pointer',
              opacity: isTombolDisabled ? 0.6 : 1,
              whiteSpace: 'nowrap',
            }}
          >
            {isPending ? 'Menyimpan...' : 'Simpan Pembayaran'}
          </button>
        </div>
      </form>

      <style>{`
        @media (max-width: 639px) {
          .pembayaran-form-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .pembayaran-buttons-row {
            flex-direction: column !important;
            gap: 8px !important;
          }
          .pembayaran-buttons-row > button {
            width: 100% !important;
          }
        }
        @media (max-width: 767px) {
          .primary-btn {
            min-height: 48px !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .bayar-lunas-btn {
            min-height: 44px !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
        }
      `}</style>
    </div>
  );
}
