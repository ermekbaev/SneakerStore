// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { CartProvider } from "@/components/providers/CartProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SneakerStore - Премиальные кроссовки",
  description: "Интернет-магазин оригинальных кроссовок от ведущих мировых брендов. Быстрая доставка, гарантия качества.",
  keywords: "кроссовки, спортивная обувь, Nike, Adidas, Jordan, интернет-магазин",
};

export default function RootLayout({
  children, 
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-white flex flex-col`}
      >
      <ToastProvider>
        <CartProvider>
          <Header />
            <main className="flex-1 bg-white">
              {children}
            </main>
          <Footer />
        </CartProvider>
      </ToastProvider>
      </body>
    </html>
  );
}