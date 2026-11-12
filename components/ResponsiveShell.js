'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Logo from '@/components/Logo';

export default function ResponsiveShell({ sidebar, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Otomatis menutup drawer jika rute berpindah
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Menutup drawer bila link menu atau tombol di dalam sidebar diklik
  function handleSidebarClick(e) {
    if (e.target.closest('a') || e.target.closest('button')) {
      setIsOpen(false);
    }
  }

  return (
    <div className="app-shell-root">
      {/* Top Bar untuk layar mobile (< 768px) */}
      <header className="app-topbar no-print">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Logo textColor="#12161C" />
        </div>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
          style={{
            width: '48px',
            height: '48px',
            minWidth: '48px',
            minHeight: '48px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            color: '#1C1C1A',
            padding: 0,
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </header>

      {/* Overlay Gelap (Drawer Backdrop) */}
      <div
        className={`app-overlay no-print ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      <div className="app-shell-body">
        {/* Sidebar / Drawer */}
        <aside
          className={`app-sidebar no-print ${isOpen ? 'open' : ''}`}
          onClick={handleSidebarClick}
        >
          {sidebar}
        </aside>

        {/* Konten Utama */}
        <main className="app-shell-main">
          {children}
        </main>
      </div>

      {/* Styling Responsif, Layout, & Print */}
      <style>{`
        .app-shell-root {
          min-height: 100vh;
          background-color: #F7F7F5;
          font-family: 'Plus Jakarta Sans', sans-serif;
          display: flex;
          flex-direction: column;
          overflow-x: hidden;
          width: 100%;
        }

        .app-shell-body {
          display: flex;
          flex: 1;
          min-width: 0;
          width: 100%;
          position: relative;
        }

        /* Desktop (>= 768px) */
        @media (min-width: 768px) {
          .app-topbar {
            display: none !important;
          }
          .app-overlay {
            display: none !important;
          }
          .app-sidebar {
            width: 220px !important;
            flex-shrink: 0;
            background-color: #FFFFFF;
            border-right: 1px solid #E4E4E0;
            display: flex !important;
            flex-direction: column;
            padding: 20px 12px;
            position: sticky;
            top: 0;
            height: 100vh;
            overflow-y: auto;
            transform: none !important;
            box-shadow: none !important;
            z-index: 10;
          }
          .app-shell-main {
            flex: 1;
            min-width: 0;
          }
        }

        /* Mobile (< 768px) */
        @media (max-width: 767px) {
          .app-topbar {
            display: flex;
            align-items: center;
            justifyContent: space-between;
            height: 56px;
            padding: 0 12px 0 16px;
            background-color: #FFFFFF;
            border-bottom: 1px solid #E4E4E0;
            position: sticky;
            top: 0;
            z-index: 30;
            width: 100%;
            box-sizing: border-box;
          }

          .app-overlay {
            display: none;
            position: fixed;
            inset: 0;
            background-color: rgba(0, 0, 0, 0.45);
            z-index: 40;
            backdrop-filter: blur(2px);
          }
          .app-overlay.open {
            display: block;
          }

          .app-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            width: 240px;
            max-width: 80vw;
            background-color: #FFFFFF;
            border-right: 1px solid #E4E4E0;
            display: flex;
            flex-direction: column;
            padding: 20px 12px;
            z-index: 50;
            overflow-y: auto;
            transform: translateX(-100%);
            transition: transform 0.25s ease-in-out;
            box-shadow: none;
            box-sizing: border-box;
          }
          .app-sidebar.open {
            transform: translateX(0);
            box-shadow: 4px 0 24px rgba(0, 0, 0, 0.2);
          }

          .app-shell-main {
            flex: 1;
            width: 100%;
            min-width: 0;
            max-width: 100vw;
            overflow-x: hidden;
            box-sizing: border-box;
          }

          /* Hilangkan scroll horizontal di layar 360px */
          .app-shell-main > div {
            padding: 16px !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
          }

          /* Header halaman agar bisa wrap di layar kecil */
          .page-header,
          .app-shell-main div[style*="justify-content: space-between"] {
            flex-wrap: wrap !important;
            gap: 12px !important;
          }

          /* Bar pencarian & filter turun baris dan memenuhi lebar di layar kecil */
          .search-form {
            width: 100% !important;
            margin-bottom: 16px !important;
          }
          .search-form input,
          .search-input {
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
          }

          .report-filter-form {
            width: 100% !important;
            flex-wrap: wrap !important;
            gap: 10px !important;
          }
          .report-filter-form > div {
            flex: 1 1 130px !important;
            min-width: 130px !important;
          }
          .report-filter-form input {
            width: 100% !important;
            box-sizing: border-box !important;
          }
          .report-filter-form button {
            width: 100% !important;
            margin-top: 4px !important;
          }

          /* Input / select tidak melebihi lebar layar */
          .app-shell-main input,
          .app-shell-main select {
            max-width: 100% !important;
            box-sizing: border-box !important;
          }

          /* Wadah tabel scroll horizontal di dalam wadah tanpa melebarkan halaman */
          .table-container {
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch;
            width: 100% !important;
            max-width: 100% !important;
          }

          /* Grid kartu ringkasan dashboard: 2 kolom di < 768px */
          .dashboard-grid {
            grid-template-columns: 1fr 1fr !important;
          }

          .laporan-summary-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }

        /* Layar sangat kecil (< 480px): Grid kartu ringkasan jadi 1 kolom */
        @media (max-width: 479px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
          .laporan-summary-grid {
            grid-template-columns: 1fr !important;
          }
        }

        /* Efek hover link sidebar */
        .sidebar-link:hover {
          background-color: #F0FDF9;
          color: #0F766E;
        }
        .sidebar-link:hover span {
          color: #0F766E;
        }

        /* Aturan Cetak (Print) */
        @media print {
          .no-print,
          .app-sidebar,
          .app-topbar,
          .app-overlay {
            display: none !important;
          }
          .app-shell-main {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}

