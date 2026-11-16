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
    <div className={`${poppins.className} min-h-screen bg-slate-50 text-slate-800 flex flex-col`}>
      {/* 1. Header / Navbar Publik */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
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
                <span>Masuk ke Sistem</span>
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

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white py-16 sm:py-24">
        {/* Latar Belakang Mesin Cuci Halus */}
        <div className="absolute inset-0 z-0 opacity-15">
          <Image
            src="/images/login-bg.jpg"
            alt="Latar belakang mesin cuci"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-200 text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
            Sistem Informasi &amp; Kasir Laundry Modern
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight sm:leading-tight mb-4">
            Cucian Bersih, Rapi, &amp; Tepat Waktu <br className="hidden sm:inline" />
            <span className="text-teal-400">Tanpa Khawatir Hilang</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed mb-8">
            LaundryGo menghadirkan pencatatan operasional laundry yang transparan. Pelanggan dapat memantau status cucian secara langsung dan kasir dapat mencetak nota secara otomatis.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
            <a
              href="#lacak"
              className="w-full sm:w-auto px-6 py-3 rounded-md bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition"
            >
              Lacak Status Cucian Anda
            </a>
            <Link
              href="/login"
              className="w-full sm:w-auto px-6 py-3 rounded-md bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-sm transition"
            >
              Portal Petugas (Login)
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Section Cek Status Cucian (Tracking) */}
      <section id="lacak" className="py-12 sm:py-16 bg-white border-b border-[#E5E7EB]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Lacak Pesanan Cucian
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Masukkan Nomor Nota (contoh: <span className="font-semibold text-teal-700">T0001</span>) untuk memeriksa proses pencucian
            </p>
          </div>

          {/* Form Pencarian Nota */}
          <form method="GET" action="/#lacak" className="flex flex-col sm:flex-row gap-2 max-w-xl mx-auto mb-8">
            <div className="relative flex-1">
              <input
                type="text"
                name="nota"
                defaultValue={notaQuery}
                placeholder="Masukkan Nomor Nota (mis. T0001)..."
                required
                className="w-full h-12 pl-11 pr-4 rounded-md border border-[#E5E7EB] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 text-sm font-medium"
              />
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <button
              type="submit"
              className="h-12 px-6 rounded-md bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm transition shrink-0"
            >
              Cek Status
            </button>
          </form>

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
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Paket Layanan &amp; Tarif Kami
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Harga transparan dan terjangkau dengan hasil cucian wangi, bersih, dan higienis.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {daftarLayanan.map((item) => (
              <div
                key={item.id_layanan}
                className="bg-white rounded-lg border border-[#E5E7EB] p-6 flex flex-col justify-between transition"
              >
                <div>
                  <div className="w-10 h-10 rounded-md bg-teal-50 text-teal-700 flex items-center justify-center font-bold mb-4">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-1">
                    {item.nama_layanan}
                  </h3>
                  <div className="text-xs text-slate-500 mb-4">
                    Estimasi pengerjaan: <span className="font-semibold text-slate-700">{item.estimasi_hari} hari</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-baseline justify-between">
                  <div>
                    <span className="text-xl font-extrabold text-teal-700">
                      {formatRupiah(item.harga)}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">/{item.satuan}</span>
                  </div>
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
      <footer className="mt-auto bg-slate-900 text-slate-400 py-10 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Logo textColor="#FFFFFF" />
            </div>
            <div className="text-xs text-slate-400 text-center sm:text-right">
              Jl. Pendidikan No. 26 • Jam Operasional: 07.00 - 21.00 WIB
            </div>
          </div>
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <p>© 2026 LaundryGo • Sistem Informasi Pengelolaan Laundry</p>
            <p>Athalia Calya Fitriani — Project WEB 26</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
