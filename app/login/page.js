'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Poppins } from 'next/font/google';
import Logo from '@/components/Logo';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
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
    } catch {
      setLoading(false);
      setErrorMsg('Gagal terhubung ke server. Periksa koneksi Anda.');
    }
  }

  function handleQuickFill(role) {
    setUsername(role);
    const passInput = document.getElementById('password');
    if (passInput) passInput.focus();
  }

  return (
    <main
      className={`${poppins.className} relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden`}
      style={{ backgroundColor: '#080B0F' }}
    >
      {/* Background Foto Fullscreen dengan Lapisan Solid Gelap */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <Image
          src="/images/login-bg.jpg"
          alt="Latar belakang mesin cuci"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(8, 11, 15, 0.72)' }}
        />
      </div>

      {/* Konten Utama Layar Penuh (2 Kolom di Desktop) */}
      <div className="relative z-10 w-full flex-1 flex items-center justify-center px-4 sm:px-8 lg:px-16 py-8">
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Panel Kiri (Sisi Foto): Disederhanakan */}
          <div className="hidden lg:flex flex-col justify-center text-left">
            <div style={{ marginBottom: '28px' }}>
              <Logo />
            </div>

            {/* Judul Besar tanpa pemisah baris manual agar mengalir otomatis */}
            <h1
              style={{
                fontSize: 'clamp(28px, 3.2vw, 44px)',
                fontWeight: 600,
                lineHeight: 1.25,
                color: '#F4F6F8',
                marginBottom: '16px',
                letterSpacing: '-0.4px',
                maxWidth: '560px',
              }}
            >
              Catat cucian, hitung tagihan, dan cetak nota dari satu tempat.
            </h1>

            {/* Kalimat pendukung 16px putih opasitas 75% */}
            <p
              style={{
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.75)',
                margin: 0,
                lineHeight: 1.5,
                fontWeight: 400,
                maxWidth: '520px',
              }}
            >
              Pelanggan, layanan, transaksi, dan laporan dalam satu aplikasi.
            </p>
          </div>

          {/* Panel Kanan: Kartu Login Solid */}
          <div className="flex flex-col items-center lg:items-end w-full">
            {/* Logo dan judul untuk layar mobile (< 1024px) */}
            <div className="lg:hidden mb-6 text-center select-none">
              <Logo />
              <p
                style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.75)',
                  marginTop: '8px',
                  marginBottom: 0,
                  fontWeight: 400,
                }}
              >
                Catat cucian, hitung tagihan, dan cetak nota dari satu tempat.
              </p>
            </div>

            {/* Kartu Solid Krem Padat */}
            <div
              className="login-card"
              style={{
                width: '100%',
                maxWidth: '400px',
                backgroundColor: '#F5F3EE',
                color: '#12161C',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                padding: '32px',
                boxShadow: 'none',
              }}
            >
              {/* Header Kartu */}
              <div style={{ marginBottom: '24px', textAlign: 'left' }}>
                <h2
                  style={{
                    fontSize: '24px',
                    fontWeight: 600,
                    color: '#12161C',
                    lineHeight: 1.2,
                    marginBottom: '4px',
                  }}
                >
                  Masuk
                </h2>
                <p style={{ fontSize: '14px', color: '#5B6470', margin: 0 }}>
                  Gunakan akun admin atau kasir.
                </p>
              </div>

              {/* Form Login */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label
                    htmlFor="username"
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#12161C',
                      marginBottom: '6px',
                      textAlign: 'left',
                    }}
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
                    placeholder="contoh: kasir1"
                    style={{
                      width: '100%',
                      minHeight: '44px',
                      height: '48px',
                      padding: '0 12px',
                      fontSize: '16px',
                      color: '#12161C',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '6px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#12161C';
                      e.target.style.outline = '2px solid #F2D94E';
                      e.target.style.outlineOffset = '1px';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#E5E7EB';
                      e.target.style.outline = 'none';
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#12161C',
                      marginBottom: '6px',
                      textAlign: 'left',
                    }}
                  >
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                      minLength={1}
                      placeholder="password Anda"
                      style={{
                        width: '100%',
                        minHeight: '44px',
                        height: '48px',
                        padding: '0 48px 0 12px',
                        fontSize: '16px',
                        color: '#12161C',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E5E7EB',
                        borderRadius: '6px',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#12161C';
                        e.target.style.outline = '2px solid #F2D94E';
                        e.target.style.outlineOffset = '1px';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#E5E7EB';
                        e.target.style.outline = 'none';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                      tabIndex={-1}
                      style={{
                        position: 'absolute',
                        right: '1px',
                        top: '1px',
                        width: '46px',
                        height: '46px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'none',
                        border: 'none',
                        color: '#8A8F98',
                        cursor: 'pointer',
                        borderRadius: '6px',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#12161C')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#8A8F98')}
                    >
                      {showPassword ? (
                        <svg
                          width="16"
                          height="16"
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
                          width="16"
                          height="16"
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
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#B42318',
                      fontSize: '13px',
                      fontWeight: 500,
                      marginTop: '2px',
                    }}
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#B42318"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ flexShrink: 0 }}
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Tombol Masuk */}
                <button
                  type="submit"
                  disabled={loading}
                  className="login-submit-btn"
                  style={{
                    width: '100%',
                    minHeight: '48px',
                    height: '48px',
                    borderRadius: '6px',
                    backgroundColor: loading ? '#2A313B' : '#12161C',
                    color: '#FFFFFF',
                    fontSize: '15px',
                    fontWeight: 600,
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'background-color 150ms ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '4px',
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) e.currentTarget.style.backgroundColor = '#2A313B';
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) e.currentTarget.style.backgroundColor = '#12161C';
                  }}
                >
                  {loading ? 'Memeriksa...' : 'Masuk'}
                </button>

                {/* Pilihan Akun Cepat */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '12px', color: '#7E8691' }}>Pilih akun:</span>
                  <button
                    type="button"
                    onClick={() => handleQuickFill('admin')}
                    style={{
                      fontSize: '12px',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      border: '1px solid #E5E7EB',
                      backgroundColor: '#FFFFFF',
                      color: '#12161C',
                      cursor: 'pointer',
                      fontWeight: 500,
                    }}
                  >
                    admin
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill('kasir1')}
                    style={{
                      fontSize: '12px',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      border: '1px solid #E5E7EB',
                      backgroundColor: '#FFFFFF',
                      color: '#12161C',
                      cursor: 'pointer',
                      fontWeight: 500,
                    }}
                  >
                    kasir1
                  </button>
                </div>
              </form>

              <style>{`
                @media (max-width: 480px) {
                  .login-card {
                    padding: 24px 18px !important;
                  }
                }
              `}</style>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Manual */}
      <footer style={{ position: 'relative', zIndex: 10, width: '100%', padding: '16px 24px' }}>
        <div className="w-full max-w-5xl mx-auto text-left">
          <p style={{ fontSize: '13px', color: '#8A8F98', margin: 0 }}>
            © 2026 LaundryGo
          </p>
        </div>
      </footer>
    </main>
  );
}
