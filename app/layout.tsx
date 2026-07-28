import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Sidebar } from "@/components/sidebar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: { default: "Limbus Ops", template: "%s · Limbus Ops" },
  description: "Painel administrativo de licenças do Limbus.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Sidebar />
        <main className="min-h-screen pb-24 md:ml-64 md:pb-0">
          <div className="mx-auto w-full max-w-[1480px] px-4 py-6 sm:px-6 sm:py-9 lg:px-10 lg:py-12">{children}</div>
        </main>
      </body>
    </html>
  );
}
