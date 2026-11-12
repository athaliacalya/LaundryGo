import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { bersihkanKataCari } from '@/lib/cari';
import { hapusLayanan } from './actions';

const PER_HALAMAN = 10;

function formatRupiah(angka) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(angka || 0);
}

export default async function LayananAdminPage({ searchParams }) {
  const sp = await searchParams;
  const cari = sp?.cari || '';
  const kataKunci = bersihkanKataCari(cari);
  const halaman = parseInt(sp?.halaman || '1', 10);
  const error = sp?.error || '';

  let query = supabaseAdmin
    .from('layanan')
    .select('*', { count: 'exact' })
    .order('id_layanan', { ascending: true })
    .range((halaman - 1) * PER_HALAMAN, halaman * PER_HALAMAN - 1);

  if (kataKunci) {
    query = query.ilike('nama_layanan', `%${kataKunci}%`);
  }

  const { data: daftarLayanan, count } = await query;
  const totalHalaman = Math.max(1, Math.ceil((count || 0) / PER_HALAMAN));

  return (
    <div
      style={{
        padding: '28px 32px',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        maxWidth: '960px',
      }}
    >
      {/* Header Halaman */}
      <div
        className="page-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: 600, color: '#1C1C1A', margin: 0 }}>
            Layanan &amp; Tarif
          </h1>
          <p style={{ fontSize: '13px', color: '#9CA3AF', margin: '3px 0 0' }}>
            {count ?? 0} total paket layanan laundry terdaftar
          </p>
        </div>

        <Link
          href="/admin/layanan/baru"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            fontSize: '13px',
            fontWeight: 600,
            color: '#FFFFFF',
            backgroundColor: '#0F766E',
            borderRadius: '6px',
            textDecoration: 'none',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Tambah Layanan
        </Link>
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

      {/* Banner Error */}
      {error && (
        <div
          style={{
            padding: '10px 14px',
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '6px',
            color: '#B91C1C',
            fontSize: '13px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Tabel Layanan */}
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
        <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#F7F7F5', borderBottom: '1px solid #E4E4E0' }}>
              <th style={{ textAlign: 'left', padding: '10px 16px', fontWeight: 500, color: '#6B6B67', width: '40px' }}>No</th>
              <th style={{ textAlign: 'left', padding: '10px 16px', fontWeight: 500, color: '#6B6B67' }}>Nama Layanan</th>
              <th style={{ textAlign: 'left', padding: '10px 16px', fontWeight: 500, color: '#6B6B67' }}>Satuan</th>
              <th style={{ textAlign: 'left', padding: '10px 16px', fontWeight: 500, color: '#6B6B67' }}>Harga / Tarif</th>
              <th style={{ textAlign: 'left', padding: '10px 16px', fontWeight: 500, color: '#6B6B67' }}>Estimasi</th>
              <th style={{ textAlign: 'right', padding: '10px 16px', fontWeight: 500, color: '#6B6B67', width: '130px' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {!daftarLayanan || daftarLayanan.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: '#9CA3AF' }}>
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
                    {(halaman - 1) * PER_HALAMAN + i + 1}
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
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <Link
                        href={`/admin/layanan/${item.id_layanan}/edit`}
                        style={{
                          fontSize: '13px',
                          color: '#0F766E',
                          textDecoration: 'none',
                          fontWeight: 500,
                        }}
                      >
                        Edit
                      </Link>
                      <span style={{ color: '#E4E4E0' }}>|</span>
                      <form action={hapusLayanan} style={{ display: 'inline' }}>
                        <input type="hidden" name="id_layanan" value={item.id_layanan} />
                        <button
                          type="submit"
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            fontSize: '13px',
                            color: '#DC2626',
                            cursor: 'pointer',
                          }}
                        >
                          Hapus
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalHalaman > 1 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderTop: '1px solid #E4E4E0',
              backgroundColor: '#FAFAF9',
              fontSize: '13px',
              color: '#6B6B67',
            }}
          >
            <span>Halaman {halaman} dari {totalHalaman}</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              {halaman > 1 && (
                <Link
                  href={`/admin/layanan?halaman=${halaman - 1}${cari ? `&cari=${cari}` : ''}`}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '4px',
                    border: '1px solid #E4E4E0',
                    backgroundColor: '#FFFFFF',
                    color: '#1C1C1A',
                    textDecoration: 'none',
                  }}
                >
                  &larr; Sebelumnya
                </Link>
              )}
              {halaman < totalHalaman && (
                <Link
                  href={`/admin/layanan?halaman=${halaman + 1}${cari ? `&cari=${cari}` : ''}`}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '4px',
                    border: '1px solid #E4E4E0',
                    backgroundColor: '#FFFFFF',
                    color: '#1C1C1A',
                    textDecoration: 'none',
                  }}
                >
                  Berikutnya &rarr;
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
