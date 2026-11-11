export default function Logo({ textColor = '#FFFFFF', className = '' }) {
  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      {/* Lambang pintu mesin cuci */}
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
        aria-hidden="true"
      >
        {/* Lingkaran luar */}
        <circle cx="18" cy="18" r="16" stroke="#F2D94E" strokeWidth="2" />
        {/* Lingkaran dalam */}
        <circle cx="18" cy="18" r="10" stroke="#F2D94E" strokeWidth="2" />
        {/* Satu tetes air kecil di tengah */}
        <path
          d="M18 13.5 C18 13.5 20.8 16.2 20.8 18.2 A2.8 2.8 0 0 1 15.2 18.2 C15.2 16.2 18 13.5 18 13.5 Z"
          fill="#F2D94E"
          stroke="#F2D94E"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>

      {/* Wordmark LaundryGo */}
      <span
        style={{
          fontSize: '22px',
          lineHeight: 1,
          letterSpacing: '-0.3px',
          userSelect: 'none',
        }}
      >
        <span style={{ fontWeight: 500, color: textColor }}>Laundry</span>
        <span style={{ fontWeight: 700, color: '#F2D94E' }}>Go</span>
      </span>
    </div>
  );
}

