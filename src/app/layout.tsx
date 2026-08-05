import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: 'SEGUNDA MANO Chivilcoy - Guía Comercial',
  description: 'Guía comercial y de servicios de la ciudad de Chivilcoy.',
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="es" className={`h-full antialiased`}>
      <body className="min-h-screen bg-background text-on-background flex flex-col body-dot-bg font-sans selection:bg-secondary-fixed selection:text-on-background" suppressHydrationWarning>
        <Navbar/>
        <main className="flex-grow flex flex-col">
          {children}
        </main>
        <Footer/>
        
        {/* Sticker flotante animado */}
        <div className="floating-sticker">
          <img src="/imagen3.png" alt="Sticker clasifk2" />
        </div>
      </body>
    </html>
  );
}
