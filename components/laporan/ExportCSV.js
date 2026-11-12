'use client';

export default function ExportCSV({ data, dari, sampai }) {
  function handleExport() {
    if (!data || data.length === 0) return;

    const headers = ['No Nota', 'Tanggal', 'Pelanggan', 'Total', 'Status Bayar'];
    const rows = data.map((t) => [
      t.id_transaksi,
      t.tgl_masuk || '',
      t.pelanggan?.nama_pelanggan || '',
      t.total_bayar || 0,
      t.status_bayar || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((r) =>
        r.map((cell) => {
          const str = String(cell);
          // Escape cells containing commas or quotes
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        }).join(',')
      ),
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `laporan-laundry-${dari}-${sampai}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={handleExport}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 14px',
        fontSize: '13px',
        fontWeight: 600,
        color: '#0F766E',
        backgroundColor: '#FFFFFF',
        border: '1px solid #0F766E',
        borderRadius: '6px',
        cursor: 'pointer',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      Ekspor CSV (Excel)
    </button>
  );
}
