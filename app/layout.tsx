import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LaundryGo — Sistem Informasi Laundry",
  description: "Kelola data pelanggan, layanan, dan transaksi laundry.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
