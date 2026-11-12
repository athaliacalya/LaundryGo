import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { bersihkanKataCari } from '@/lib/cari';

const PER_HALAMAN = 10;

function formatTanggal(str) {
  if (!str) return '—';
  const d = new Date(str);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default async function PelangganKasirPage({ searchParams }) {
  const sp = await searchParams;
  const cari = sp?.cari || '';
  const kataKunci = bersihkanKataCari(cari);
  const halaman = parseInt(sp?.halaman || '1', 10);

  let query = supabaseAdmin
    .from('pelanggan')
    .select('*', { count: 'exact' })
    .order('id_pelanggan', { ascending: false })
    .range((halaman - 1) * PER_HALAMAN, halaman * PER_HALAMAN - 1);

  if (kataKunci) query = query.ilike('nama_pelanggan', `%${kataKunci}%`);

  const { data: pelanggan, count } = await query;
  const totalHalaman = Math.max(1, Math.ceil((count || 0) / PER_HALAMAN));

  return (
    <div
      style={{
        padding: '28px 32px',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        maxWidth: '960px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: 600, color: '#1C1C1A', margin: 0 }}>
            Pelanggan
          </h1>
          <p style={{ fontSize: '13px', color: '#9CA3AF', margin: '3px 0 0' }}>
            {count ?? 0} total pelanggan terdaftar
          </p>
        </div>
        <Link
          href="/kasir/pelanggan/baru"
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
            textDecoration: 'none',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Tambah Pelanggan
        </Link>
      </div>

      <form style={{ marginBottom: '16px' }}>
        <input
          name="cari"
          defaultValue={cari}
          placeholder="Cari nama pelanggan..."
          style={{
            padding: '8px 12px',
            fontSize: '14px',
            color: '#1C1C1A',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E4E4E0',
            borderRadius: '6px',
            outline: 'none',
            width: '260px',
          }}
        />
      </form>

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
              <th style={{ textAlign: 'left', padding: '10px 16px', fontWeight: 500, color: '#6B6B67', width: '40px' }}>No</th>
              <th style={{ textAlign: 'left', padding: '10px 16px', fontWeight: 500, color: '#6B6B67' }}>Nama</th>
              <th style={{ textAlign: 'left', padding: '10px 16px', fontWeight: 500, color: '#6B6B67' }}>No. HP</th>
              <th style={{ textAlign: 'left', padding: '10px 16px', fontWeight: 500, color: '#6B6B67' }}>Alamat</th>
              <th style={{ textAlign: 'left', padding: '10px 16px', fontWeight: 500, color: '#6B6B67' }}>Tgl Daftar</th>
            </tr>
          </thead>
          <tbody>
            {!pelanggan || pelanggan.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '36px', color: '#9CA3AF' }}>
                  {cari ? `Tidak ada pelanggan dengan kata kunci "${cari}"` : 'Belum ada data pelanggan.'}
                </td>
              </tr>
            ) : (
              pelanggan.map((p, i) => (
                <tr
                  key={p.id_pelanggan}
                  style={{
                    borderBottom: i < pelanggan.length - 1 ? '1px solid #F0F0EE' : 'none',
                  }}
                >
                  <td style={{ padding: '12px 16px', color: '#9CA3AF', fontSize: '13px' }}>
                    {(halaman - 1) * PER_HALAMAN + i + 1}
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 500, color: '#1C1C1A' }}>
                    {p.nama_pelanggan}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#3D3D3A' }}>
                    {p.no_hp}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#6B6B67' }}>
                    {p.alamat}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#9CA3AF', fontSize: '13px' }}>
                    {formatTanggal(p.tgl_daftar)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

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
                  href={`/kasir/pelanggan?halaman=${halaman - 1}${cari ? `&cari=${cari}` : ''}`}
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
                  href={`/kasir/pelanggan?halaman=${halaman + 1}${cari ? `&cari=${cari}` : ''}`}
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

