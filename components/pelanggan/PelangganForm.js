'use client';
import { useActionState } from 'react';

const inputStyle = {
  width: '100%',
  padding: '9px 12px',
  fontSize: '14px',
  color: '#1C1C1A',
  backgroundColor: '#FFFFFF',
  border: '1px solid #E4E4E0',
  borderRadius: '6px',
  outline: 'none',
  fontFamily: "'Plus Jakarta Sans', sans-serif",
};

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 500,
  color: '#1C1C1A',
  marginBottom: '6px',
};

const errorStyle = {
  fontSize: '12px',
  color: '#DC2626',
  marginTop: '4px',
};

export default function PelangganForm({ action, initialData, submitLabel }) {
  const [state, formAction, pending] = useActionState(action, { errors: {} });

  return (
    <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '440px' }}>
      {/* Error umum */}
      {state?.errors?.umum && (
        <div
          style={{
            padding: '10px 14px',
            fontSize: '13px',
            color: '#991B1B',
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '6px',
          }}
        >
          {state.errors.umum}
        </div>
      )}

      {/* Nama */}
      <div>
        <label style={labelStyle}>Nama Pelanggan</label>
        <input
          name="nama_pelanggan"
          defaultValue={initialData?.nama_pelanggan}
          placeholder="Contoh: Budi Santoso"
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = '#0F766E')}
          onBlur={(e) => (e.target.style.borderColor = '#E4E4E0')}
        />
        {state?.errors?.nama_pelanggan && (
          <p style={errorStyle}>{state.errors.nama_pelanggan}</p>
        )}
      </div>

      {/* No HP */}
      <div>
        <label style={labelStyle}>No HP</label>
        <input
          name="no_hp"
          defaultValue={initialData?.no_hp}
          placeholder="Contoh: 081234567890"
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = '#0F766E')}
          onBlur={(e) => (e.target.style.borderColor = '#E4E4E0')}
        />
        {state?.errors?.no_hp && (
          <p style={errorStyle}>{state.errors.no_hp}</p>
        )}
      </div>

      {/* Alamat */}
      <div>
        <label style={labelStyle}>Alamat</label>
        <textarea
          name="alamat"
          rows={3}
          defaultValue={initialData?.alamat}
          placeholder="Jl. Contoh No. 1, Kota..."
          style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.5' }}
          onFocus={(e) => (e.target.style.borderColor = '#0F766E')}
          onBlur={(e) => (e.target.style.borderColor = '#E4E4E0')}
        />
        {state?.errors?.alamat && (
          <p style={errorStyle}>{state.errors.alamat}</p>
        )}
      </div>

      {/* Submit */}
      <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
        <button
          type="submit"
          disabled={pending}
          style={{
            padding: '9px 20px',
            fontSize: '14px',
            fontWeight: 600,
            color: '#FFFFFF',
            backgroundColor: pending ? '#5EADA8' : '#0F766E',
            border: 'none',
            borderRadius: '6px',
            cursor: pending ? 'not-allowed' : 'pointer',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            transition: 'background-color 0.15s',
          }}
        >
          {pending ? 'Menyimpan...' : submitLabel}
        </button>
        <a
          href="/admin/pelanggan"
          style={{
            padding: '9px 16px',
            fontSize: '14px',
            fontWeight: 500,
            color: '#6B6B67',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E4E4E0',
            borderRadius: '6px',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          Batal
        </a>
      </div>
    </form>
  );
}
