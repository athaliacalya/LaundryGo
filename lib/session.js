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