import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { bersihkanKataCari } from '@/lib/cari';
import { hapusPelanggan } from './actions';

const PER_HALAMAN = 10;

// Format tanggal: "16 Okt 2026"
function formatTanggal(str) {
  if (!str) return '—';
  const d = new Date(str);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default async function PelangganPage({ searchParams }) {
  const sp = await searchParams;
  const cari = sp?.cari || '';
  const kataKunci = bersihkanKataCari(cari);
  const halaman = parseInt(sp?.halaman || '1', 10);
  const error = sp?.error || '';

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
      {/* Header halaman */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#1C1C1A',
              margin: 0,
            }}
          >
            Pelanggan
          </h1>
          <p style={{ fontSize: '13px', color: '#9CA3AF', margin: '3px 0 0' }}>
            {count ?? 0} total pelanggan terdaftar
          </p>
        </div>
        <Link
          href="/admin/pelanggan/baru"
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

      {/* Search */}
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

      {/* Tabel */}
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
              <th style={thStyle}>Nama</th>
              <th style={thStyle}>No HP</th>
              <th style={thStyle}>Alamat</th>
              <th style={thStyle}>Tgl Daftar</th>
              <th style={{ ...thStyle, textAlign: 'right', width: '100px' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pelanggan?.length ? (
              pelanggan.map((p, i) => (
                <tr
                  key={p.id_pelanggan}
                  style={{
                    borderBottom: i < pelanggan.length - 1 ? '1px solid #F0F0EE' : 'none',
                    height: '44px',
                  }}
                >
                  <td style={{ ...tdStyle, fontWeight: 500, color: '#1C1C1A' }}>
                    {p.nama_pelanggan}
                  </td>
                  <td style={{ ...tdStyle, color: '#6B6B67', fontVariantNumeric: 'tabular-nums' }}>
                    {p.no_hp}
                  </td>
                  <td style={{ ...tdStyle, color: '#6B6B67', maxWidth: '220px' }}>
                    <span
                      style={{
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {p.alamat}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, color: '#9CA3AF', whiteSpace: 'nowrap' }}>
                    {formatTanggal(p.tgl_daftar)}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <Link
                      href={`/admin/pelanggan/${p.id_pelanggan}/edit`}
                      style={{ fontSize: '13px', color: '#0F766E', textDecoration: 'none', marginRight: '12px', fontWeight: 500 }}
                    >
                      Edit
                    </Link>
                    <form action={hapusPelanggan} style={{ display: 'inline' }}>
                      <input type="hidden" name="id_pelanggan" value={p.id_pelanggan} />
                      <button
                        type="submit"
                        style={{
                          fontSize: '13px',
                          color: '#9CA3AF',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0,
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}
                      >
                        Hapus
                      </button>
                    </form>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF', fontSize: '14px' }}
                >
                  {cari ? `Tidak ada pelanggan dengan nama "${cari}".` : 'Belum ada data pelanggan.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalHalaman > 1 && (
        <div style={{ display: 'flex', gap: '6px', marginTop: '16px', alignItems: 'center' }}>
          {Array.from({ length: totalHalaman }, (_, i) => i + 1).map((h) => (
            <a
              key={h}
              href={`?cari=${cari}&halaman=${h}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                fontSize: '13px',
                fontWeight: h === halaman ? 600 : 400,
                color: h === halaman ? '#0F766E' : '#6B6B67',
                backgroundColor: h === halaman ? '#F0FDF9' : '#FFFFFF',
                border: `1px solid ${h === halaman ? '#0F766E' : '#E4E4E0'}`,
                borderRadius: '6px',
                textDecoration: 'none',
              }}
            >
              {h}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

const thStyle = {
  padding: '10px 14px',
  textAlign: 'left',
  fontSize: '12px',
  fontWeight: 600,
  color: '#9CA3AF',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

const tdStyle = {
  padding: '0 14px',
};