import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LaundryGo — Sistem Informasi Laundry",
  description: "Kelola data pelanggan, layanan, dan transaksi laundry.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className="h-full">
      <body className={`${poppins.className} min-h-full`}>{children}</body>
    </html>
  );
}
