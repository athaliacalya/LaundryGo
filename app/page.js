import Link from 'next/link';
import Image from 'next/image';
import { Poppins } from 'next/font/google';
import Logo from '@/components/Logo';
import { getSession } from '@/lib/session';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { formatTanggal } from '@/lib/waktu';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

function formatRupiah(val) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(val || 0);
}

export default async function IndexPage({ searchParams }) {
  const session = await getSession();
  const user = session?.user;

  const sp = await searchParams;
  const notaQuery = (sp?.nota || '').trim().toUpperCase();

  // 1. Ambil data layanan dari database
  let daftarLayanan = [];
  try {
    const { data } = await supabaseAdmin
      .from('layanan')
      .select('*')
      .order('harga', { ascending: true });
    if (data && data.length > 0) {
      daftarLayanan = data;
    }
  } catch {
    daftarLayanan = [];
  }

  // Fallback layanan jika belum ada di database
  if (daftarLayanan.length === 0) {
    daftarLayanan = [
      { id_layanan: 1, nama_layanan: 'Cuci Kering Setrika', satuan: 'kg', harga: 7000, estimasi_hari: 2 },
      { id_layanan: 2, nama_layanan: 'Bed Cover Besar', satuan: 'pcs', harga: 25000, estimasi_hari: 3 },
      { id_layanan: 3, nama_layanan: 'Cuci Karpet', satuan: 'm2', harga: 15000, estimasi_hari: 4 },
      { id_layanan: 4, nama_layanan: 'Cuci Kilat / Express', satuan: 'kg', harga: 12000, estimasi_hari: 1 },
    ];
  }

  // 2. Jika ada pencarian nomor nota (Tracking cucian)
  let hasilLacak = null;
  let statusLacak = 'idle'; // 'idle' | 'found' | 'not_found'

  if (notaQuery) {
    try {
      const { data: tx } = await supabaseAdmin
        .from('transaksi')
        .select(`
          id_transaksi,
          tgl_masuk,
          tgl_selesai,
          total_bayar,
          status_bayar,
          status_cucian,
          pelanggan ( nama_pelanggan ),
          detail_transaksi (
            jumlah,
            subtotal,
            layanan ( nama_layanan, satuan )
          )
        `)
        .ilike('id_transaksi', notaQuery)
        .maybeSingle();

      if (tx) {
        hasilLacak = tx;
        statusLacak = 'found';
      } else {
        statusLacak = 'not_found';
      }
    } catch {
      statusLacak = 'not_found';
    }
  }

  const stepStatus = ['diterima', 'diproses', 'selesai', 'diambil'];
  const stepLabels = {
    diterima: { title: 'Diterima', desc: 'Pakaian masuk & ditimbang' },
    diproses: { title: 'Diproses', desc: 'Sedang dicuci & disetrika' },
    selesai: { title: 'Selesai', desc: 'Siap untuk diambil' },
    diambil: { title: 'Diambil', desc: 'Sudah diserahkan' },
  };

  const currentStepIdx = hasilLacak ? stepStatus.indexOf(hasilLacak.status_cucian) : -1;

  return (
    <div className={`${poppins.className} min-h-screen bg-slate-50 text-slate-800 flex flex-col overflow-x-hidden`}>
      {/* 1. Header / Navbar Publik dengan latar putih solid */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-decoration-none">
            <Logo textColor="#0F172A" />
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="#layanan" className="hover:text-teal-700 transition">
              Layanan &amp; Tarif
            </Link>
            <Link href="#lacak" className="hover:text-teal-700 transition">
              Cek Status Cucian
            </Link>
            <Link href="#keunggulan" className="hover:text-teal-700 transition">
              Keunggulan
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href={user.role === 'admin' ? '/admin' : '/kasir/transaksi'}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-semibold transition"
              >
                <span>Dashboard ({user.nama_lengkap.split(' ')[0]})</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-semibold transition"
              >
                <span>Login Petugas</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section — tinggi penuh layar dikurangi navbar */}
      <section
        className="relative overflow-hidden text-white"
        style={{ minHeight: 'calc(100svh - 64px)' }}
      >
        {/* CSS Variables untuk warna utama */}
        <style>{`
          :root {
            --primary: #00BFA5;
            --primary-dark: #00897B;
            --text-dark: #0F172A;
          }
        `}</style>

        {/* Overlay gradasi sejuk — lebih terang dari versi lama */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              'linear-gradient(135deg, rgba(10,25,35,0.80) 0%, rgba(0,30,45,0.68) 50%, rgba(10,20,40,0.72) 100%)',
          }}
        />

        {/* Foto latar mesin cuci */}
        <div className="absolute inset-0 z-[-1]">
          <Image
            src="/images/login-bg.jpg"
            alt="Latar belakang mesin cuci"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        {/* Konten rata tengah vertikal & horizontal */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[inherit] px-4 sm:px-6 lg:px-8 py-16 text-center"
          style={{ minHeight: 'calc(100svh - 64px)' }}
        >
          {/* Judul dua baris */}
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight sm:leading-tight mb-4 max-w-3xl">
            Cucian Bersih, Rapi, &amp; Tepat Waktu{' '}
            <br />
            <span style={{ color: 'var(--primary)' }}>Tanpa Khawatir Hilang</span>
          </h1>

          {/* Deskripsi singkat */}
          <p className="max-w-xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed mb-8">
            Pantau status cucianmu secara langsung dengan nomor nota.
          </p>

          {/* Form pelacakan nota langsung di hero */}
          <form
            method="GET"
            action="/"
            className="w-full max-w-md mx-auto flex flex-col sm:flex-row gap-2 mb-6"
          >
            <label htmlFor="nota-hero" className="sr-only">
              Nomor nota cucian
            </label>
            <input
              id="nota-hero"
              type="text"
              name="nota"
              defaultValue={notaQuery}
              placeholder="Contoh: T0001"
              aria-label="Masukkan nomor nota cucian"
              className="flex-1 h-12 px-4 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 text-sm font-medium bg-white"
              style={{ '--tw-ring-color': 'var(--primary)' }}
            />
            <button
              type="submit"
              className="h-12 px-6 rounded-md font-bold text-sm transition shrink-0 whitespace-nowrap text-slate-950"
              style={{ background: 'var(--primary)' }}
              onMouseOver={(e) => { e.currentTarget.style.background = 'var(--primary-dark)'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'var(--primary)'; }}
            >
              Lacak Cucian
            </button>
          </form>

          {/* Kartu pratinjau statis dekoratif (aria-hidden agar tidak dibaca screen reader) */}
          <div
            aria-hidden="true"
            className="w-full max-w-sm mx-auto rounded-xl border border-white/15 text-left text-xs"
            style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)' }}
          >
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
              <span className="font-bold text-white text-sm">Nota T0001</span>
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                style={{ background: 'var(--primary)', color: 'var(--text-dark)' }}
              >
                Sedang dicuci
              </span>
            </div>
            <div className="px-4 py-3 grid grid-cols-4 gap-1">
              {[
                { label: 'Diterima', done: true },
                { label: 'Dicuci', active: true },
                { label: 'Disetrika', done: false },
                { label: 'Siap diambil', done: false },
              ].map((s, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                    style={{
                      background: s.done
                        ? '#10B981'
                        : s.active
                        ? 'var(--primary)'
                        : 'rgba(255,255,255,0.15)',
                      color: s.done || s.active ? '#fff' : 'rgba(255,255,255,0.5)',
                    }}
                  >
                    {s.done ? '✓' : s.active ? '●' : i + 1}
                  </div>
                  <span
                    className="text-center leading-tight"
                    style={{
                      color: s.done || s.active ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)',
                      fontSize: '9px',
                    }}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Section Cek Status Cucian — form ada di hero, section ini hanya tampilkan hasil */}
      <section id="lacak" className="py-12 sm:py-16 bg-white border-b border-[#E5E7EB]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Judul hanya tampil jika belum ada query */}
          {!notaQuery && (
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Lacak Pesanan Cucian
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Masukkan Nomor Nota (contoh:{' '}
                <span className="font-semibold text-teal-700">T0001</span>) di kolom
                pencarian di atas untuk memeriksa proses pencucian.
              </p>
            </div>
          )}

          {/* Alert Jika Tidak Ditemukan */}
          {statusLacak === 'not_found' && (
            <div className="max-w-xl mx-auto p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-start gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-amber-600 mt-0.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <div>
                <p className="font-semibold">Nomor Nota &ldquo;{notaQuery}&rdquo; Tidak Ditemukan</p>
                <p className="text-xs text-amber-700 mt-0.5">
                  Pastikan kode nota sudah sesuai dengan struk yang Anda terima (misal: T0001, T0002).
                </p>
              </div>
            </div>
          )}

          {/* Hasil Pelacakan Cucian */}
          {statusLacak === 'found' && hasilLacak && (
            <div className="max-w-2xl mx-auto bg-slate-50 border border-[#E5E7EB] rounded-lg p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E5E7EB]">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-teal-700">
                    Nomor Nota
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900">
                    {hasilLacak.id_transaksi}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500">Nama Pelanggan</div>
                  <div className="text-base font-bold text-slate-900">
                    {hasilLacak.pelanggan?.nama_pelanggan || 'Pelanggan'}
                  </div>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="my-6">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                  Tahapan Pengerjaan
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {stepStatus.map((step, idx) => {
                    const isDone = idx <= currentStepIdx;
                    const isCurrent = idx === currentStepIdx;
                    return (
                      <div
                        key={step}
                        className={`p-3 rounded-lg border text-center transition ${
                          isCurrent
                            ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-500/20'
                            : isDone
                            ? 'bg-emerald-50 border-emerald-300'
                            : 'bg-white border-[#E5E7EB] opacity-60'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center text-xs font-bold mb-1.5 ${
                            isCurrent
                              ? 'bg-teal-700 text-white'
                              : isDone
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {isDone ? '✓' : idx + 1}
                        </div>
                        <div className="text-xs font-bold text-slate-900 capitalize">
                          {stepLabels[step].title}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                          {stepLabels[step].desc}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ringkasan Waktu & Pembayaran */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-lg bg-white border border-[#E5E7EB] text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Tanggal Masuk:</span>
                  <span className="font-semibold text-slate-800">{formatTanggal(hasilLacak.tgl_masuk)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Estimasi Selesai:</span>
                  <span className="font-semibold text-teal-800">{formatTanggal(hasilLacak.tgl_selesai)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Status Pembayaran:</span>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${
                      hasilLacak.status_bayar === 'lunas'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {hasilLacak.status_bayar === 'lunas' ? 'Lunas' : 'Belum Lunas'}
                  </span>
                </div>
              </div>

              {/* Rincian Cucian */}
              {hasilLacak.detail_transaksi?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
                  <div className="text-xs font-bold text-slate-700 mb-2">Item Cucian:</div>
                  <ul className="divide-y divide-slate-100 text-xs text-slate-600">
                    {hasilLacak.detail_transaksi.map((d, i) => (
                      <li key={i} className="py-1.5 flex justify-between">
                        <span>
                          {d.layanan?.nama_layanan} ({d.jumlah} {d.layanan?.satuan})
                        </span>
                        <span className="font-medium text-slate-800">{formatRupiah(d.subtotal)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 pt-2 border-t border-[#E5E7EB] flex justify-between items-center text-sm font-bold text-slate-900">
                    <span>Total Tagihan</span>
                    <span className="text-teal-700">{formatRupiah(hasilLacak.total_bayar)}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 4. Section Layanan & Tarif */}
      <section id="layanan" className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section Rata Tengah */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Paket Layanan &amp; Tarif
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Harga per satuan, tanpa biaya tambahan.
            </p>
          </div>

          {/* Pembungkus Kartu Tarif Rata Tengah */}
          <div
            style={{
              maxWidth: '1100px',
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '20px',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            {daftarLayanan.map((item) => (
              <div
                key={item.id_layanan}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  boxShadow: 'none',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  {/* Nama Layanan (18px, semibold) */}
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: 600,
                      color: '#0F172A',
                      margin: '0 0 12px 0',
                    }}
                  >
                    {item.nama_layanan}
                  </h3>

                  {/* Harga besar 28px hijau #0F766E dengan satuan kecil abu */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '16px' }}>
                    <span
                      style={{
                        fontSize: '28px',
                        fontWeight: 700,
                        color: '#0F766E',
                        lineHeight: 1.1,
                      }}
                    >
                      {formatRupiah(item.harga)}
                    </span>
                    <span
                      style={{
                        fontSize: '13px',
                        color: '#94A3B8',
                        fontWeight: 500,
                      }}
                    >
                      / {item.satuan}
                    </span>
                  </div>
                </div>

                {/* Garis tipis dan estimasi hari tanpa ikon */}
                <div
                  style={{
                    borderTop: '1px solid #E5E7EB',
                    paddingTop: '14px',
                    fontSize: '13px',
                    color: '#64748B',
                  }}
                >
                  Estimasi {item.estimasi_hari} hari
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Section Keunggulan */}
      <section id="keunggulan" className="py-16 bg-white border-t border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Kenapa Memilih LaundryGo?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Memberikan pengalaman mencuci yang praktis, aman, dan dapat diandalkan setiap hari.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg bg-slate-50 border border-[#E5E7EB]">
              <div className="w-12 h-12 rounded-md bg-teal-50 text-teal-800 flex items-center justify-center font-bold mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Higienis &amp; Terawat</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Pakaian dicuci terpisah per pelanggan dengan deterjen pilihan ramah serat kain serta setrika uap rapi.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-slate-50 border border-[#E5E7EB]">
              <div className="w-12 h-12 rounded-md bg-teal-50 text-teal-800 flex items-center justify-center font-bold mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Pelacakan Real-Time</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Kapan pun Anda ingin tahu apakah cucian sudah selesai atau belum, cukup masukkan nomor nota di website.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-slate-50 border border-[#E5E7EB]">
              <div className="w-12 h-12 rounded-md bg-teal-50 text-teal-800 flex items-center justify-center font-bold mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Nota &amp; Kasir Akurat</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Perhitungan harga otomatis dan struk nota cetak satu lembar yang rapi memudahkan transaksi pembayaran.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer
        className="mt-auto text-slate-300 py-10 border-t border-white/10"
        style={{
          background: 'linear-gradient(to top right, #123332 0%, #1E2E3B 50%, #182334 100%)',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Logo textColor="#FFFFFF" />
            </div>
            <div className="text-xs text-center sm:text-right space-y-1">
              <p className="text-slate-200 font-medium">Jam Operasional: 07.00 - 21.00 WIB</p>
              <p className="text-slate-400">Jl. Pendidikan No. 26</p>
            </div>
          </div>
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <p>© 2026 LaundryGo • Sistem Informasi Pengelolaan Laundry</p>
            <p>Athalia Calya Fitriani — Project WEB 26</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
