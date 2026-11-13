'use client';
import { useActionState } from 'react';

const inputStyle = {
  width: '100%',
  minHeight: '44px',
  padding: '10px 12px',
  fontSize: '16px',
  color: '#1C1C1A',
  backgroundColor: '#FFFFFF',
  border: '1px solid #E4E4E0',
  borderRadius: '6px',
  outline: 'none',
  boxSizing: 'border-box',
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
        <label style={labelStyle}>
          Nama Pelanggan <span style={{ color: '#EF4444' }}>*</span>
        </label>
        <input
          name="nama_pelanggan"
          required
          minLength={3}
          maxLength={100}
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
        <label style={labelStyle}>
          No HP <span style={{ color: '#EF4444' }}>*</span>
        </label>
        <input
          name="no_hp"
          type="tel"
          pattern="0[0-9]{9,14}"
          inputMode="numeric"
          required
          minLength={10}
          maxLength={15}
          title="Nomor HP harus diawali 0 dan terdiri dari 10-15 digit angka"
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
        <label style={labelStyle}>
          Alamat <span style={{ color: '#EF4444' }}>*</span>
        </label>
        <textarea
          name="alamat"
          rows={3}
          required
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
      <div style={{ display: 'flex', gap: '10px', paddingTop: '4px', flexWrap: 'wrap' }}>
        <button
          type="submit"
          disabled={pending}
          className="primary-btn"
          style={{
            padding: '10px 20px',
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
          className="cancel-btn"
          style={{
            padding: '10px 16px',
            fontSize: '14px',
            fontWeight: 500,
            color: '#6B6B67',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E4E4E0',
            borderRadius: '6px',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Batal
        </a>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .primary-btn {
            min-height: 48px !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            flex: 1 1 auto !important;
          }
          .cancel-btn {
            min-height: 48px !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
        }
      `}</style>
    </form>
  );
}
