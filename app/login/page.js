'use client';
// app/login/page.js - halaman login Emeraldé

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
      setErrorMsg(data.error || 'Login gagal');
      return;
    }

    router.push(data.role === 'admin' ? '/admin/pelanggan' : '/kasir/transaksi');
    router.refresh();
  }

  return (
    <main className="min-h-screen flex bg-[#F3FAF6]">
      {/* Panel kiri - branding, hanya tampil di layar besar */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#046B4F] to-[#023D2E] text-white flex-col justify-between p-14">
        <div className="pointer-events-none absolute -top-16 -left-10 w-72 h-72 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute top-1/3 right-0 w-40 h-40 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute bottom-10 left-1/4 w-24 h-24 rounded-full bg-white/10" />

        <div className="relative z-10">
          <p className="text-sm tracking-wide text-white/70 mb-2">Sistem Informasi</p>
          <h1
            className="text-6xl"
            style={{ fontFamily: 'Fraunces, serif', fontWeight: 600 }}
          >
            Emeraldé
          </h1>
        </div>

        <div className="relative z-10">
          <p className="text-lg leading-relaxed max-w-sm text-white/90">
            Catat cucian masuk, pantau status pengerjaan, dan kelola pelanggan
            dari satu tempat.
          </p>
        </div>
      </div>

      {/* Panel kanan - form login */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <p
            className="lg:hidden text-2xl mb-8 text-[#046B4F]"
            style={{ fontFamily: 'Fraunces, serif', fontWeight: 600 }}
          >
            Emeraldé
          </p>

          <h2
            className="text-2xl text-[#16323A] mb-1"
            style={{ fontFamily: 'Fraunces, serif', fontWeight: 600 }}
          >
            Masuk ke akun kamu
          </h2>
          <p className="text-sm text-[#5B7377] mb-8">
            Gunakan akun admin atau kasir untuk melanjutkan.
          </p>

          {errorMsg && (
            <div className="mb-5 text-sm text-[#9A3324] bg-[#FBEAE8] border border-[#F0C7C1] rounded-lg px-4 py-2.5">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#16323A] mb-1.5">
                Username
              </label>
              <input
                className="w-full border border-[#CBE0D5] rounded-lg px-4 py-2.5 text-[#16323A] focus:outline-none focus:ring-2 focus:ring-[#046B4F] focus:border-transparent transition-shadow"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#16323A] mb-1.5">
                Password
              </label>
              <input
                type="password"
                className="w-full border border-[#CBE0D5] rounded-lg px-4 py-2.5 text-[#16323A] focus:outline-none focus:ring-2 focus:ring-[#046B4F] focus:border-transparent transition-shadow"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#046B4F] hover:bg-[#035940] disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition-colors mt-2"
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}