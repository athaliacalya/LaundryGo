// lib/session.js
// Konfigurasi & helper session login (pakai iron-session).
// Session menyimpan: id_user, username, nama_lengkap, role.

import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

export const sessionOptions = {
  password: process.env.SESSION_SECRET,
  cookieName: 'laundry_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
  },
};

// Dipakai di Server Component / API route untuk membaca session saat ini
export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession(cookieStore, sessionOptions);
}

// Memeriksa status login pengguna, mengembalikan user jika aktif
export async function requireLogin() {
  try {
    const session = await getSession();
    if (!session?.user) {
      return { ok: false, error: 'Anda harus login terlebih dahulu.' };
    }
    return { ok: true, user: session.user };
  } catch {
    return { ok: false, error: 'Anda harus login terlebih dahulu.' };
  }
}

// Memeriksa apakah role pengguna termasuk dalam daftar role yang diizinkan
export async function requireRole(roles = []) {
  const auth = await requireLogin();
  if (!auth.ok) {
    return auth;
  }

  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  if (!allowedRoles.includes(auth.user?.role)) {
    return { ok: false, error: 'Anda tidak memiliki akses untuk tindakan ini.' };
  }

  return { ok: true, user: auth.user };
}
