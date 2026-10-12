// lib/supabaseAdmin.js
// Client Supabase KHUSUS SISI SERVER, memakai service_role key.
// Dipakai di API routes / Server Actions saja - JANGAN diimport di
// komponen 'use client', karena akan membocorkan key ke browser.

import { createClient } from '@supabase/supabase-js';

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);