import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { bersihkanKataCari } from '@/lib/cari';

function formatRupiah(angka) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(angka || 0);
}

export default async function LayananKasirPage({ searchParams }) {
  const sp = await searchParams;
  const cari = sp?.cari || '';
  const kataKunci = bersihkanKataCari(cari);

  let query = supabaseAdmin
    .from('layanan')
    .select('*')
    .order('id_layanan', { ascending: true });

  if (kataKunci) {
    query = query.ilike('nama_layanan', `%${kataKunci}%`);
  }

  const { data: daftarLayanan } = await query;

  return (
    <div
      style={{
        padding: '28px 32px',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        maxWidth: '880px',
      }}
    >
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 600, color: '#1C1C1A', margin: 0 }}>
          Daftar Layanan &amp; Tarif
        </h1>
        <p style={{ fontSize: '13px', color: '#9CA3AF', margin: '3px 0 0' }}>
          Informasi paket layanan dan tarif cuci laundry (Read-only)
        </p>
      </div>

      {/* Pencarian */}
      <form className="search-form" style={{ marginBottom: '16px' }}>
        <input
          name="cari"
          defaultValue={cari}
          placeholder="Cari nama layanan..."
          className="search-input"
          style={{
            padding: '8px 12px',
            fontSize: '14px',
            color: '#1C1C1A',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E4E4E0',
            borderRadius: '6px',
            outline: 'none',
            width: '260px',
            maxWidth: '100%',
          }}
        />
      </form>

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
        <table style={{ width: '100%', minWidth: '500px', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#F7F7F5', borderBottom: '1px solid #E4E4E0' }}>
              <th style={{ textAlign: 'left', padding: '10px 16px', fontWeight: 500, color: '#6B6B67', width: '40px' }}>No</th>
              <th style={{ textAlign: 'left', padding: '10px 16px', fontWeight: 500, color: '#6B6B67' }}>Nama Layanan</th>
              <th style={{ textAlign: 'left', padding: '10px 16px', fontWeight: 500, color: '#6B6B67' }}>Satuan</th>
              <th style={{ textAlign: 'left', padding: '10px 16px', fontWeight: 500, color: '#6B6B67' }}>Tarif</th>
              <th style={{ textAlign: 'left', padding: '10px 16px', fontWeight: 500, color: '#6B6B67' }}>Estimasi Selesai</th>
            </tr>
          </thead>
          <tbody>
            {!daftarLayanan || daftarLayanan.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '36px', color: '#9CA3AF' }}>
                  {cari ? `Tidak ada layanan dengan kata kunci "${cari}"` : 'Belum ada data layanan.'}
                </td>
              </tr>
            ) : (
              daftarLayanan.map((item, i) => (
                <tr
                  key={item.id_layanan}
                  style={{
                    borderBottom: i < daftarLayanan.length - 1 ? '1px solid #F0F0EE' : 'none',
                  }}
                >
                  <td style={{ padding: '12px 16px', color: '#9CA3AF', fontSize: '13px' }}>
                    {i + 1}
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 500, color: '#1C1C1A' }}>
                    {item.nama_layanan}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#3D3D3A' }}>
                    <span
                      style={{
                        padding: '2px 8px',
                        backgroundColor: '#F3F4F6',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 500,
                        color: '#4B5563',
                      }}
                    >
                      per {item.satuan}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#0F766E', fontWeight: 600 }}>
                    {formatRupiah(item.harga)}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#3D3D3A' }}>
                    {item.estimasi_hari} hari
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

