'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const statusFlow = ['diterima', 'diproses', 'selesai', 'diambil'];

const statusLabels = {
  diterima: 'Diterima',
  diproses: 'Diproses',
  selesai: 'Selesai',
  diambil: 'Diambil',
};

const nextLabel = {
  diterima: 'Proses Cucian',
  diproses: 'Tandai Selesai',
  selesai: 'Tandai Diambil',
};

export default function StatusCucianButton({ idTransaksi, currentStatus, updateAction }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const currentIdx = statusFlow.indexOf(currentStatus);
  const isFinal = currentStatus === 'diambil' || currentIdx === statusFlow.length - 1;
  const nextStatus = isFinal ? null : statusFlow[currentIdx + 1];

  async function handleClick() {
    if (!nextStatus) return;
    setLoading(true);
    setError('');

    try {
      const result = await updateAction(idTransaksi, nextStatus);
      if (result?.error) {
        setError(result.error);
      } else {
        router.refresh();
      }
    } catch (e) {
      setError('Gagal mengubah status cucian.');
    } finally {
      setLoading(false);
    }
  }

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
          margin: '0 0 12px',
        }}
      >
        Update Status Cucian
      </h3>

      <p style={{ fontSize: '14px', color: '#6B6B67', margin: '0 0 12px' }}>
        Status saat ini: <strong style={{ color: '#1C1C1A' }}>{statusLabels[currentStatus] || currentStatus}</strong>
      </p>

      {error && (
        <div
          style={{
            padding: '10px 14px',
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '6px',
            color: '#B91C1C',
            fontSize: '13px',
            marginBottom: '12px',
          }}
        >
          {error}
        </div>
      )}

      {!isFinal && nextStatus && (
        <button
          onClick={handleClick}
          disabled={loading}
          style={{
            padding: '9px 16px',
            fontSize: '13px',
            fontWeight: 600,
            color: '#FFFFFF',
            backgroundColor: loading ? '#0D9488' : '#0F766E',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Memproses...' : `→ ${nextLabel[currentStatus] || 'Lanjutkan'}`}
        </button>
      )}

      {isFinal && (
        <p style={{ fontSize: '13px', color: '#9CA3AF', margin: 0, fontStyle: 'italic' }}>
          Cucian sudah diambil (status akhir).
        </p>
      )}
    </div>
  );
}
