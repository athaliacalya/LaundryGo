'use client';
import { useActionState } from 'react';

export default function PelangganForm({ action, initialData, submitLabel }) {
  const [state, formAction, pending] = useActionState(action, { errors: {} });

  return (
    <form action={formAction} className="space-y-5 max-w-md">
      {state?.errors?.umum && (
        <div className="text-sm text-[#9A3324] bg-[#FBEAE8] border border-[#F0C7C1] rounded-lg px-4 py-2.5">
          {state.errors.umum}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-[#16323A] mb-1.5">Nama Pelanggan</label>
        <input
          name="nama_pelanggan"
          defaultValue={initialData?.nama_pelanggan}
          className="w-full border border-[#CBE0D5] rounded-lg px-4 py-2.5 text-[#16323A] focus:outline-none focus:ring-2 focus:ring-[#046B4F]"
        />
        {state?.errors?.nama_pelanggan && <p className="text-xs text-[#9A3324] mt-1">{state.errors.nama_pelanggan}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-[#16323A] mb-1.5">No HP</label>
        <input
          name="no_hp"
          defaultValue={initialData?.no_hp}
          className="w-full border border-[#CBE0D5] rounded-lg px-4 py-2.5 text-[#16323A] focus:outline-none focus:ring-2 focus:ring-[#046B4F]"
        />
        {state?.errors?.no_hp && <p className="text-xs text-[#9A3324] mt-1">{state.errors.no_hp}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-[#16323A] mb-1.5">Alamat</label>
        <textarea
          name="alamat"
          rows={3}
          defaultValue={initialData?.alamat}
          className="w-full border border-[#CBE0D5] rounded-lg px-4 py-2.5 text-[#16323A] focus:outline-none focus:ring-2 focus:ring-[#046B4F]"
        />
        {state?.errors?.alamat && <p className="text-xs text-[#9A3324] mt-1">{state.errors.alamat}</p>}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="bg-[#046B4F] hover:bg-[#035940] disabled:opacity-60 text-white font-medium px-5 py-2.5 rounded-lg"
      >
        {pending ? 'Menyimpan...' : submitLabel}
      </button>
    </form>
  );
}