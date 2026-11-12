// lib/cari.js
// Membersihkan kata kunci pencarian dari karakter berbahaya untuk PostgREST filter string

export function bersihkanKataCari(teks) {
  if (typeof teks !== 'string') return '';
  return teks
    .replace(/[,\(\)"'\\%_*:]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 50)
    .trim();
}
