/**
 * Utilitas format dan perhitungan tanggal/waktu zona Asia/Jakarta (WIB).
 * Seluruh data di database tetap disimpan dalam format ISO/UTC;
 * utilitas ini memastikan tampilan dan pembagian rentang hari selalu menurut WIB (UTC+7).
 */

const TIMEZONE_WIB = 'Asia/Jakarta';

/**
 * Mem-parse masukan tanggal ke objek Date.
 * Mendukung string ISO, Date, timestamp, atau string tanggal YYYY-MM-DD.
 */
function parseDate(nilai) {
  if (!nilai) return null;
  let d;
  if (typeof nilai === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(nilai.trim())) {
    // Tanggal murni (tanpa jam), kunci ke awal hari WIB (00:00:00+07:00)
    d = new Date(`${nilai.trim()}T00:00:00+07:00`);
  } else {
    d = new Date(nilai);
  }
  if (isNaN(d.getTime())) return null;
  return d;
}

/**
 * Format tanggal Indonesia: "16 Nov 2026"
 * @param {string|Date|number} nilai
 * @returns {string}
 */
export function formatTanggal(nilai) {
  const d = parseDate(nilai);
  if (!d) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    timeZone: TIMEZONE_WIB,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

/**
 * Format tanggal dan jam Indonesia: "16 Nov 2026, 09.42"
 * @param {string|Date|number} nilai
 * @returns {string}
 */
export function formatTanggalJam(nilai) {
  const d = parseDate(nilai);
  if (!d) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    timeZone: TIMEZONE_WIB,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(d);
}

/**
 * Format hari dan tanggal lengkap Indonesia: "Senin, 16 November 2026"
 * @param {string|Date|number} nilai
 * @returns {string}
 */
export function formatHariTanggalWIB(nilai = new Date()) {
  const d = parseDate(nilai);
  if (!d) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    timeZone: TIMEZONE_WIB,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}

/**
 * Mengembalikan tanggal hari ini menurut zona waktu WIB dalam format "YYYY-MM-DD".
 * @returns {string}
 */
export function tanggalHariIniWIB() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TIMEZONE_WIB,
  }).format(new Date());
}

/**
 * Mengembalikan tanggal awal bulan berjalan menurut zona waktu WIB ("YYYY-MM-01").
 * @returns {string}
 */
export function awalBulanWIB() {
  const hariIni = tanggalHariIniWIB();
  return `${hariIni.slice(0, 7)}-01`;
}

/**
 * Menghasilkan batas ISO string UTC untuk awal hari (00:00:00) dan akhir hari (23:59:59.999)
 * pada tanggal tertentu menurut zona waktu WIB (UTC+7).
 * @param {string} tanggalYYYYMMDD Contoh: "2026-11-16"
 * @returns {{ awal: string, akhir: string }}
 */
export function awalAkhirHariWIB(tanggalYYYYMMDD) {
  const tgl = tanggalYYYYMMDD || tanggalHariIniWIB();
  return {
    awal: new Date(`${tgl}T00:00:00+07:00`).toISOString(),
    akhir: new Date(`${tgl}T23:59:59.999+07:00`).toISOString(),
  };
}

/**
 * Menambahkan jumlah hari ke suatu tanggal WIB string "YYYY-MM-DD"
 * dan menghasilkan tanggal baru "YYYY-MM-DD" menurut WIB.
 * @param {string} tanggalWIBStr Contoh: "2026-11-16"
 * @param {number} jumlahHari
 * @returns {string}
 */
export function tambahHariWIB(tanggalWIBStr, jumlahHari = 0) {
  if (!tanggalWIBStr) return tanggalHariIniWIB();
  const [tahun, bulan, tgl] = tanggalWIBStr.split('-').map(Number);
  // Jam 05:00 UTC = Jam 12:00 siang WIB, aman dari pergeseran daylight/offset
  const dt = new Date(Date.UTC(tahun, bulan - 1, tgl + (jumlahHari || 0), 5, 0, 0));
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TIMEZONE_WIB,
  }).format(dt);
}

/**
 * Mengambil tanggal "YYYY-MM-DD" menurut zona waktu WIB dari sembarang nilai ISO/Date.
 * @param {string|Date} nilai
 * @returns {string}
 */
export function ambilTanggalWIB(nilai) {
  const d = parseDate(nilai) || new Date();
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TIMEZONE_WIB,
  }).format(d);
}

/**
 * Format nilai untuk input type="datetime-local" (YYYY-MM-DDTHH:mm) sesuai WIB.
 * @param {string|Date} nilai
 * @returns {string}
 */
export function formatDateTimeLocalWIB(nilai = new Date()) {
  const d = parseDate(nilai) || new Date();
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIMEZONE_WIB,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(d);

  const getPart = (t) => parts.find((p) => p.type === t)?.value || '00';
  let hour = getPart('hour');
  if (hour === '24') hour = '00';
  return `${getPart('year')}-${getPart('month')}-${getPart('day')}T${hour}:${getPart('minute')}`;
}
