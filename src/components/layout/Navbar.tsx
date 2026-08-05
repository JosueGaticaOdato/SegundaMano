'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      <header className="bg-primary text-on-primary border-b-4 border-on-background shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sticky top-0 z-50 w-full transition-all duration-300">
        <div className="max-w-[1440px] mx-auto flex flex-wrap justify-between items-center px-4 md:px-16 py-4 md:py-6">
          {/* Brand/Logo */}
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="hover:scale-105 transition-transform duration-200 cursor-pointer"
            >
              <img 
                src="/imagen1.png" 
                alt="Segunda Mano" 
                className="h-12 md:h-20 w-a uto object-contain drop-shadow-[3px_3px_0px_rgba(0,0,0,1)]" 
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 font-label text-sm uppercase text-white font-black text-xs">
            <Link 
              href="/quienes-somos"
              className={`cursor-pointer transition-colors pb-1 hover:text-secondary-fixed ${pathname === '/quienes-somos' ? 'text-secondary-fixed font-bold border-b-4 border-secondary-fixed' : 'text-on-primary'}`}
            >
              ¿Quienes somos?
            </Link>
            <Link 
              href="/revista"
              className={`cursor-pointer transition-colors pb-1 hover:text-secondary-fixed ${pathname === '/revista' ? 'text-secondary-fixed font-bold border-b-4 border-secondary-fixed' : 'text-on-primary'}`}
            >
              ¿Donde conseguir la revista y web?
            </Link>
            <Link 
              href="/donde-llega"
              className={`cursor-pointer transition-colors pb-1 hover:text-secondary-fixed ${pathname === '/donde-llega' ? 'text-secondary-fixed font-bold border-b-4 border-secondary-fixed' : 'text-on-primary'}`}
            >
              ¿Hasta donde llega tu publicidad?
            </Link>
            <Link 
              href="/compromiso"
              className={`cursor-pointer transition-colors pb-1 hover:text-secondary-fixed ${pathname === '/compromiso' ? 'text-secondary-fixed font-bold border-b-4 border-secondary-fixed' : 'text-on-primary'}`}
            >
              Compromiso
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
