'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Poppins } from 'next/font/google';
import Logo from '@/components/Logo';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setErrorMsg(data.error || 'Username atau password salah.');
        return;
      }

      router.push(data.role === 'admin' ? '/admin' : '/kasir/transaksi');
      router.refresh();
    } catch (err) {
      setLoading(false);
      setErrorMsg('Gagal terhubung ke server. Periksa koneksi Anda.');
    }
  }

  function handleQuickFill(user) {
    setUsername(user);
    const passInput = document.getElementById('password');
    if (passInput) passInput.focus();
  }

  return (
    <main
      className={`${poppins.className} min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-8`}
      style={{
        backgroundColor: '#0F172A',
        backgroundImage: 'radial-gradient(circle at 50% 20%, #1E293B 0%, #0F172A 100%)',
      }}
    >
      {/* Box Login Utama */}
      <div
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-700/40"
        style={{ minHeight: '520px' }}
      >
        {/* Kolom Kiri / Visual Showcase (Foto Mesin Cuci) */}
        <div className="relative w-full md:w-5/12 min-h-[160px] md:min-h-full flex flex-col justify-between p-6 sm:p-8 text-white select-none">
          {/* Foto Mesin Cuci */}
          <Image
            src="/images/login-bg.jpg"
            alt="Mesin Cuci LaundryGo"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 420px"
            className="object-cover object-center z-0"
          />

          {/* Overlay Gradient Elegan Khas LaundryGo */}
          <div
            className="absolute inset-0 z-0"
            style={{
              background:
                'linear-gradient(165deg, rgba(15, 23, 42, 0.45) 0%, rgba(15, 118, 110, 0.88) 100%)',
            }}
          />

          {/* Header Brand di Visual */}
          <div className="relative z-10">
            <Logo textColor="#FFFFFF" />
            <div className="mt-2 text-xs font-medium tracking-wide text-teal-100/90 hidden sm:block">
              SISTEM INFORMASI LAUNDRY
            </div>
          </div>

          {/* Deskripsi & Status Outlet di Desktop */}
          <div className="relative z-10 hidden md:block mt-auto pt-8">
            <h2 className="text-xl font-bold leading-snug text-white mb-2">
              Kelola Operasional Kasir Lebih Praktis
            </h2>
            <p className="text-xs text-teal-50/90 leading-relaxed mb-4">
              Pencatatan nota, status cuci kiloan/satuan, dan pembukuan pendapatan harian.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-xs font-medium text-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Sistem Aktif & Terhubung
            </div>
          </div>
        </div>

        {/* Kolom Kanan / Formulir Login */}
        <div className="w-full md:w-7/12 p-6 sm:p-10 md:p-12 flex flex-col justify-between bg-white">
          <div>
            {/* Header Form */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Selamat Datang
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Silakan masuk dengan akun Admin atau Kasir Anda.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Field Username */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                  minLength={3}
                  maxLength={50}
                  placeholder="Contoh: admin atau kasir1"
                  style={{ minHeight: '44px', fontSize: '16px' }}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition"
                />
              </div>

              {/* Field Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
                  >
                    Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    minLength={1}
                    placeholder="Masukkan password Anda"
                    style={{ minHeight: '44px', fontSize: '16px' }}
                    className="w-full pl-3.5 pr-11 py-2.5 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                    tabIndex={-1}
                    style={{ minHeight: '44px', minWidth: '44px' }}
                    className="absolute right-0 top-0 bottom-0 flex items-center justify-center text-slate-400 hover:text-slate-700 transition"
                  >
                    {showPassword ? (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Pesan Error */}
              {errorMsg && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0 text-red-600"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Tombol Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{ minHeight: '48px' }}
                className="w-full mt-2 flex items-center justify-center gap-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm shadow-md transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Memeriksa...
                  </>
                ) : (
                  'Masuk ke Sistem'
                )}
              </button>
            </form>

            {/* Quick Fill Helper */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-400">Pilih akun:</span>
              <button
                type="button"
                onClick={() => handleQuickFill('admin')}
                className="text-xs px-2.5 py-1 rounded bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 font-medium transition border border-slate-200"
              >
                admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('kasir1')}
                className="text-xs px-2.5 py-1 rounded bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 font-medium transition border border-slate-200"
              >
                kasir1
              </button>
            </div>
          </div>

          {/* Footer Card */}
          <div className="mt-6 pt-4 text-center sm:text-left">
            <p className="text-xs text-slate-400">
              © 2026 LaundryGo • Sistem Kasir & Manajemen Laundry
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
