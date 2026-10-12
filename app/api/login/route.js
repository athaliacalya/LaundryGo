// app/api/login/route.js
// Endpoint login: cek username, cocokkan password (bcrypt), simpan session.

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getIronSession } from 'iron-session';
import { sessionOptions } from '@/lib/session';
import { cookies } from 'next/headers';

export async function POST(request) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json({ error: 'Username dan password wajib diisi' }, { status: 400 });
  }

  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select('id_user, username, password, nama_lengkap, role')
    .eq('username', username)
    .single();

  if (error || !user) {
    return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 });
  }

  const cocok = await bcrypt.compare(password, user.password);
  if (!cocok) {
    return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 });
  }

  const cookieStore = await cookies();
  const session = await getIronSession(cookieStore, sessionOptions);
  session.user = {
    id_user: user.id_user,
    username: user.username,
    nama_lengkap: user.nama_lengkap,
    role: user.role,
  };
  await session.save();

  return NextResponse.json({ success: true, role: user.role });
}