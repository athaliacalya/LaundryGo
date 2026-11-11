'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
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
    router.push(data.role === 'admin' ? '/admin/pelanggan' : '/kasir/transaksi');
    router.refresh();
  }

  return (
    <main
      className={`${poppins.className} relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden`}
      style={{ backgroundColor: '#0B0F14' }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <Image
          src="/images/login-bg.jpg"
          alt="Mesin cuci LaundryGo"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Dark Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(5,8,12,0.88) 0%, rgba(5,8,12,0.55) 55%, rgba(5,8,12,0.35) 100%)',
          }}
        />

        {/* Vignette Overlay (Top & Bottom) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(5,8,12,0.78) 0%, transparent 18%, transparent 82%, rgba(5,8,12,0.82) 100%)',
          }}
        />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full flex-1 flex items-center justify-center px-4 sm:px-8 lg:px-16 py-10 lg:py-12">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* Kolom Kiri: Desktop Hero Section (>= 1024px) */}
          <div className="hidden lg:flex flex-col justify-center max-w-xl text-left select-none">
            {/* Logo Desktop */}
            <div className="mb-8">
              <span className="text-3xl font-extrabold italic tracking-tight text-[#F4F6F8]">
                LaundryGo
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl xl:text-6xl font-extrabold uppercase leading-[1.08] tracking-tight mb-6">
              <span className="block text-[#F4F6F8]">CUCI LAUNDRY</span>
              <span className="block text-[#F2D94E]">LEBIH CEPAT</span>
              <span className="block text-[#F4F6F8]">&amp; TERATUR</span>
            </h1>

            {/* Deskripsi */}
            <p className="text-[#C9CED6] text-lg lg:text-xl font-normal leading-relaxed max-w-md">
              Kelola pelanggan, layanan, dan transaksi laundry dalam satu sistem.
            </p>
          </div>

          {/* Kolom Kanan: Kartu Login Melayang */}
          <div className="flex flex-col items-center lg:items-end w-full">
            {/* Logo Mobile (< 1024px) */}
            <div className="lg:hidden text-center mb-6 select-none">
              <span className="text-3xl font-extrabold italic tracking-tight text-[#F4F6F8]">
                LaundryGo
              </span>
            </div>

            {/* Kartu Glassmorphism */}
            <div
              className="floating-card w-full max-w-[420px] lg:max-w-[440px] rounded-3xl p-7 sm:p-10 transition-shadow duration-300"
              style={{
                backgroundColor: 'rgba(11, 15, 20, 0.72)',
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 30px 80px rgba(0, 0, 0, 0.55)',
              }}
            >
              <div className="mb-8">
                <h2 className="text-[26px] sm:text-[28px] font-bold text-[#F4F6F8] leading-tight mb-2 tracking-tight">
                  Selamat datang kembali
                </h2>
                <p className="text-sm sm:text-[15px] text-[#C9CED6] font-normal leading-snug">
                  Masuk untuk mengelola laundry Anda.
                </p>
              </div>

              {/* Alert Error */}
              {errorMsg && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="mb-6 p-3.5 rounded-xl text-sm flex items-start gap-3"
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    color: '#FCA5A5',
                  }}
                >
                  <svg
                    className="w-5 h-5 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span className="leading-snug">{errorMsg}</span>
                </div>
              )}

              {/* Form Login */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-[#F4F6F8] mb-2 tracking-normal"
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
                    placeholder="Masukkan username"
                    className="w-full h-[52px] px-4 rounded-xl text-[15px] text-[#F4F6F8] outline-none transition-all duration-200"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.14)',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#6FA3E8';
                      e.target.style.boxShadow = '0 0 0 4px rgba(111, 163, 232, 0.25)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.14)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-[#F4F6F8] mb-2 tracking-normal"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                      placeholder="Masukkan password"
                      className="w-full h-[52px] pl-4 pr-12 rounded-xl text-[15px] text-[#F4F6F8] outline-none transition-all duration-200"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.14)',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#6FA3E8';
                        e.target.style.boxShadow = '0 0 0 4px rgba(111, 163, 232, 0.25)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.14)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                      className="absolute right-1 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-[#C9CED6] hover:text-[#F4F6F8] transition-colors rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#6FA3E8]/40"
                    >
                      {showPassword ? (
                        <svg
                          className="w-5 h-5"
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
                          className="w-5 h-5"
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-[52px] mt-2 rounded-full font-semibold text-base flex items-center justify-center cursor-pointer transition-all duration-200 hover:-translate-y-[1px] disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none"
                  style={{
                    backgroundColor: '#F2D94E',
                    color: '#0B0F14',
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) e.currentTarget.style.backgroundColor = '#FFE76A';
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) e.currentTarget.style.backgroundColor = '#F2D94E';
                  }}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-[#0B0F14]"
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
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Memproses...</span>
                    </span>
                  ) : (
                    'Masuk'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Hak Cipta */}
      <footer className="relative z-10 w-full px-4 sm:px-8 lg:px-16 py-4">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-center lg:justify-start">
          <p
            className="text-xs font-normal select-none"
            style={{ color: 'rgba(201, 206, 214, 0.6)' }}
          >
            &copy; 2026 LaundryGo
          </p>
        </div>
      </footer>
    </main>
  );
}
