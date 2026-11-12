'use client';

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
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
        cursor: 'pointer',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" /><rect x="6" y="14" width="12" height="8" />
      </svg>
      Cetak / Simpan PDF
    </button>
  );
}
