import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { hapusPelanggan } from './actions';

const PER_HALAMAN = 10;

export default async function PelangganPage({ searchParams }) {
  const sp = await searchParams;
  const cari = sp?.cari || '';
  const halaman = parseInt(sp?.halaman || '1', 10);

  let query = supabaseAdmin
    .from('pelanggan')
    .select('*', { count: 'exact' })
    .order('id_pelanggan', { ascending: false })
    .range((halaman - 1) * PER_HALAMAN, halaman * PER_HALAMAN - 1);

  if (cari) query = query.ilike('nama_pelanggan', `%${cari}%`);

  const { data: pelanggan, count } = await query;
  const totalHalaman = Math.max(1, Math.ceil((count || 0) / PER_HALAMAN));

  return (
    <main className="p-6 sm:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1
          style={{ fontFamily: 'Fraunces, serif', fontWeight: 600 }}
          className="text-2xl text-[#16323A]"
        >
          Data Pelanggan
        </h1>
        <Link
          href="/admin/pelanggan/baru"
          className="bg-[#046B4F] hover:bg-[#035940] text-white text-sm font-medium px-4 py-2.5 rounded-lg"
        >
          + Tambah Pelanggan
        </Link>
      </div>

      <form className="mb-5">
        <input
          name="cari"
          defaultValue={cari}
          placeholder="Cari nama pelanggan..."
          className="border border-[#CBE0D5] rounded-lg px-4 py-2.5 w-full max-w-xs text-[#16323A] focus:outline-none focus:ring-2 focus:ring-[#046B4F]"
        />
      </form>

      <div className="bg-white rounded-xl border border-[#E2ECE7] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#F3FAF6]">
            <tr>
              <th className="p-3.5 text-left font-medium text-[#3E5750]">Nama</th>
              <th className="p-3.5 text-left font-medium text-[#3E5750]">No HP</th>
              <th className="p-3.5 text-left font-medium text-[#3E5750]">Alamat</th>
              <th className="p-3.5 text-left font-medium text-[#3E5750] w-32">Tgl Daftar</th>
              <th className="p-3.5 text-right font-medium text-[#3E5750] w-28">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EDF4F1]">
            {pelanggan?.length ? pelanggan.map((p) => (
              <tr key={p.id_pelanggan} className="hover:bg-[#FAFDFB]">
                <td className="p-3.5 text-[#243430] font-medium">{p.nama_pelanggan}</td>
                <td className="p-3.5 text-[#3E5750]">{p.no_hp}</td>
                <td className="p-3.5 text-[#3E5750]">{p.alamat}</td>
                <td className="p-3.5 text-[#3E5750]">{p.tgl_daftar}</td>
                <td className="p-3.5 text-right whitespace-nowrap">
                  <Link href={`/admin/pelanggan/${p.id_pelanggan}/edit`} className="text-[#046B4F] hover:underline mr-3">
                    Edit
                  </Link>
                  <form action={hapusPelanggan} className="inline">
                    <input type="hidden" name="id_pelanggan" value={p.id_pelanggan} />
                    <button type="submit" className="text-[#9A3324] hover:underline">Hapus</button>
                  </form>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={5} className="p-8 text-center text-[#8AA79E]">Belum ada data pelanggan.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {totalHalaman > 1 && (
        <div className="flex gap-2 mt-5">
          {Array.from({ length: totalHalaman }, (_, i) => i + 1).map((h) => (
            <a
              key={h}
              href={`?cari=${cari}&halaman=${h}`}
              className={`px-3.5 py-1.5 rounded-lg border text-sm ${
                h === halaman
                  ? 'bg-[#046B4F] text-white border-[#046B4F]'
                  : 'border-[#CBE0D5] text-[#3E5750] hover:bg-[#F3FAF6]'
              }`}
            >
              {h}
            </a>
          ))}
        </div>
      )}
    </main>
  );
}