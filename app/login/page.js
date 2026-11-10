'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
    if (!res.ok) { setErrorMsg(data.error || 'Username atau password salah.'); return; }
    router.push(data.role === 'admin' ? '/admin/pelanggan' : '/kasir/transaksi');
    router.refresh();
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F7F7F5',
        padding: '24px',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <div style={{ width: '100%', maxWidth: '360px' }}>
        {/* Logo */}
        <div style={{ marginBottom: '32px' }}>
          <span
            style={{
              fontFamily: 'Fraunces, serif',
              fontWeight: 600,
              fontSize: '22px',
              color: '#0F766E',
              letterSpacing: '-0.3px',
            }}
          >
            LaundryGo
          </span>
          <p style={{ marginTop: '6px', fontSize: '14px', color: '#6B6B67' }}>
            Sistem Informasi Laundry. Masuk untuk melanjutkan.
          </p>
        </div>

        {/* Error */}
        {errorMsg && (
          <div
            style={{
              marginBottom: '16px',
              padding: '10px 14px',
              fontSize: '13px',
              color: '#991B1B',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '6px',
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label
              htmlFor="username"
              style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#1C1C1A', marginBottom: '6px' }}
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
              style={{
                width: '100%',
                padding: '9px 12px',
                fontSize: '14px',
                color: '#1C1C1A',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E4E4E0',
                borderRadius: '6px',
                outline: 'none',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#0F766E')}
              onBlur={(e) => (e.target.style.borderColor = '#E4E4E0')}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#1C1C1A', marginBottom: '6px' }}
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
                placeholder="Masukkan password"
                style={{
                  width: '100%',
                  padding: '9px 38px 9px 12px',
                  fontSize: '14px',
                  color: '#1C1C1A',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E4E4E0',
                  borderRadius: '6px',
                  outline: 'none',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#0F766E')}
                onBlur={(e) => (e.target.style.borderColor = '#E4E4E0')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#9CA3AF',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            style={{
              marginTop: '4px',
              width: '100%',
              padding: '10px',
              fontSize: '14px',
              fontWeight: 600,
              color: '#FFFFFF',
              backgroundColor: loading ? '#5EADA8' : '#0F766E',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.15s',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
      </div>
    </main>
  );
}