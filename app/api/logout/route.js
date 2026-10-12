// app/api/logout/route.js

import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions } from '@/lib/session';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  const session = await getIronSession(cookieStore, sessionOptions);
  session.destroy();
  return NextResponse.json({ success: true });
}