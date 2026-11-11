'use client';

import { useActionState } from 'react';
import Link from 'next/link';

export default function LayananForm({ action, initialData, isEdit = false }) {
  const [state, formAction, isPending] = useActionState(action, null);
  const errors = state?.errors || {};

  return (
    <form action={formAction} style={{ maxWidth: '480px' }}>
      {errors.umum && (
        <div
          style={{
            padding: '10px 14px',
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '6px',
            color: '#B91C1C',
            fontSize: '13px',
            marginBottom: '16px',
          }}
        >
          {errors.umum}
        </div>
      )}

      {/* Nama Layanan */}
      <div style={{ marginBottom: '16px' }}>
        <label
          htmlFor="nama_layanan"
          style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#1C1C1A', marginBottom: '6px' }}
        >
          Nama Layanan <span style={{ color: '#EF4444' }}>*</span>
        </label>
        <input
          id="nama_layanan"
          name="nama_layanan"
          type="text"
          required
          defaultValue={initialData?.nama_layanan || ''}
          placeholder="contoh: Cuci Setrika, Bed Cover"
          style={{
            width: '100%',
            padding: '9px 12px',
            fontSize: '14px',
            color: '#1C1C1A',
            backgroundColor: '#FFFFFF',
            border: `1px solid ${errors.nama_layanan ? '#EF4444' : '#E4E4E0'}`,
            borderRadius: '6px',
            outline: 'none',
          }}
        />
        {errors.nama_layanan && (
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#EF4444' }}>{errors.nama_layanan}</p>
        )}
      </div>

      {/* Satuan */}
      <div style={{ marginBottom: '16px' }}>
        <label
          htmlFor="satuan"
          style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#1C1C1A', marginBottom: '6px' }}
        >
          Satuan Hitung <span style={{ color: '#EF4444' }}>*</span>
        </label>
        <select
          id="satuan"
          name="satuan"
          required
          defaultValue={initialData?.satuan || 'kg'}
          style={{
            width: '100%',
            padding: '9px 12px',
            fontSize: '14px',
            color: '#1C1C1A',
            backgroundColor: '#FFFFFF',
            border: `1px solid ${errors.satuan ? '#EF4444' : '#E4E4E0'}`,
            borderRadius: '6px',
            outline: 'none',
          }}
        >
          <option value="kg">kg (Kilogram)</option>
          <option value="pcs">pcs (Satuan / Potong)</option>
          <option value="m2">m2 (Meter Persegi)</option>
        </select>
        {errors.satuan && (
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#EF4444' }}>{errors.satuan}</p>
        )}
      </div>

      {/* Harga */}
      <div style={{ marginBottom: '16px' }}>
        <label
          htmlFor="harga"
          style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#1C1C1A', marginBottom: '6px' }}
        >
          Harga per Satuan (Rp) <span style={{ color: '#EF4444' }}>*</span>
        </label>
        <input
          id="harga"
          name="harga"
          type="number"
          min="100"
          step="100"
          required
          defaultValue={initialData?.harga ?? ''}
          placeholder="contoh: 7000"
          style={{
            width: '100%',
            padding: '9px 12px',
            fontSize: '14px',
            color: '#1C1C1A',
            backgroundColor: '#FFFFFF',
            border: `1px solid ${errors.harga ? '#EF4444' : '#E4E4E0'}`,
            borderRadius: '6px',
            outline: 'none',
          }}
        />
        {errors.harga && (
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#EF4444' }}>{errors.harga}</p>
        )}
      </div>

      {/* Estimasi Hari */}
      <div style={{ marginBottom: '24px' }}>
        <label
          htmlFor="estimasi_hari"
          style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#1C1C1A', marginBottom: '6px' }}
        >
          Estimasi Pengerjaan (Hari) <span style={{ color: '#EF4444' }}>*</span>
        </label>
        <input
          id="estimasi_hari"
          name="estimasi_hari"
          type="number"
          min="1"
          max="30"
          required
          defaultValue={initialData?.estimasi_hari ?? 2}
          placeholder="contoh: 2"
          style={{
            width: '100%',
            padding: '9px 12px',
            fontSize: '14px',
            color: '#1C1C1A',
            backgroundColor: '#FFFFFF',
            border: `1px solid ${errors.estimasi_hari ? '#EF4444' : '#E4E4E0'}`,
            borderRadius: '6px',
            outline: 'none',
          }}
        />
        {errors.estimasi_hari && (
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#EF4444' }}>{errors.estimasi_hari}</p>
        )}
      </div>

      {/* Tombol aksi */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          type="submit"
          disabled={isPending}
          style={{
            padding: '9px 18px',
            fontSize: '14px',
            fontWeight: 600,
            color: '#FFFFFF',
            backgroundColor: isPending ? '#0D9488' : '#0F766E',
            border: 'none',
            borderRadius: '6px',
            cursor: isPending ? 'not-allowed' : 'pointer',
          }}
        >
          {isPending ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Layanan'}
        </button>

        <Link
          href="/admin/layanan"
          style={{
            padding: '9px 16px',
            fontSize: '14px',
            fontWeight: 500,
            color: '#6B6B67',
            backgroundColor: 'transparent',
            border: '1px solid #E4E4E0',
            borderRadius: '6px',
            textDecoration: 'none',
          }}
        >
          Batal
        </Link>
      </div>
    </form>
  );
}

