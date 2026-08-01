import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Phone, ShoppingBag, MapPin, Truck } from 'lucide-react';

export const metadata: Metadata = {
  title: '¿Dónde conseguir la revista? - CLASIFK2',
  description: 'Encuentra la revista CLASIFK2 de forma gratuita, compra local o pídelo a domicilio.',
};

export default function RevistaPage() {
  return (
    <div className="w-full flex-grow bg-surface-container-low body-dot-bg pb-24">
      {/* Hero Header */}
      <header className="relative w-full overflow-hidden border-b-4 border-on-background dot-bg py-16 md:py-24">
        {/* Neon decorative grid lines/dots overlay */}
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(#8000c6 2px, transparent 2px)', backgroundSize: '24px 24px' }}></div>
        
        <div className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-16 flex flex-col items-center justify-center text-center gap-6">
          <div className="bg-primary text-white brutal-border px-4 py-1.5 transform -rotate-1 inline-block">
            <h2 className="font-headline text-xs md:text-sm uppercase text-white font-black tracking-widest">
              EDICIONES IMPRESA & DIGITAL
            </h2>
          </div>
          
          <h1 className="font-headline text-4xl md:text-6xl drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] uppercase leading-none font-black tracking-tight text-white max-w-4xl">
            ¿Dónde conseguir la revista y web?
          </h1>
        </div>
      </header>

      {/* Main container */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-16 py-12 flex flex-col gap-10">
        
        {/* Navigation / Volver */}
        <div className="flex justify-start">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-secondary-fixed text-on-background font-label text-sm font-black px-6 py-3 border-4 border-on-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all uppercase group cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Volver
          </Link>
        </div>

        {/* Content - 3-Column Brutalist Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* Card 1: Gratis (Green / Whatsapp theme) */}
          <div className="bg-white border-4 border-on-background shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all duration-300 p-8 flex flex-col justify-between h-full relative overflow-hidden group">
            {/* Top banner tag */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#25d366] border-l-4 border-b-4 border-on-background flex items-center justify-center text-white font-headline text-base font-black rotate-12 translate-x-4 -translate-y-4">
              ¡GRATIS!
            </div>
            
            <div className="flex-grow flex flex-col gap-6">
              <div className="w-12 h-12 bg-[#25d366]/10 border-2 border-on-background flex items-center justify-center rounded-none shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                <MapPin className="w-6 h-6 text-[#25d366]" />
              </div>
              
              <div>
                <h3 className="font-headline text-2xl uppercase font-black mb-4">
                  Salas de Espera
                </h3>
                <p className="font-sans text-base text-on-surface-variant font-semibold leading-relaxed">
                  La podés conseguir gratuitamente en las salas de espera de nuestros anunciantes locales.
                </p>
              </div>
            </div>
            
            <div className="mt-8 border-t-2 border-on-background/25 pt-4">
              <span className="font-label text-xs uppercase font-bold text-neutral-500">
                Puntos seleccionados
              </span>
            </div>
          </div>

          {/* Card 2: Compra Local (Magenta theme) */}
          <div className="bg-white border-4 border-on-background shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all duration-300 p-8 flex flex-col justify-between h-full relative overflow-hidden group">
            {/* Top price label */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#ff00ff] border-l-4 border-b-4 border-on-background flex items-center justify-center text-white font-headline text-base font-black rotate-12 translate-x-4 -translate-y-4">
              PUNTOS
            </div>
            
            <div className="flex-grow flex flex-col gap-6">
              <div className="w-12 h-12 bg-[#ff00ff]/10 border-2 border-on-background flex items-center justify-center rounded-none shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                <ShoppingBag className="w-6 h-6 text-[#ff00ff]" />
              </div>
              
              <div>
                <h3 className="font-headline text-2xl uppercase font-black mb-4">
                  Almacenes, Kioscos y Librerías
                </h3>
                <p className="font-sans text-base text-on-surface-variant font-semibold leading-relaxed">
                  También la podés comprar de forma directa en comercios adheridos, almacenes, kioscos y librerías habituales.
                </p>
              </div>
            </div>
            
            <div className="mt-8 border-t-2 border-on-background/25 pt-4">
              <div className="inline-block bg-secondary-fixed text-on-background font-label text-[10px] uppercase font-black px-2 py-0.5 border border-on-background shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                Próximamente lista de comercios
              </div>
            </div>
          </div>

          {/* Card 3: Delivery / Delivery Directo (Purple theme) */}
          <div className="bg-white border-4 border-on-background shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all duration-300 p-8 flex flex-col justify-between h-full relative overflow-hidden group">
            {/* Delivery tag */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary border-l-4 border-b-4 border-on-background flex items-center justify-center text-white font-headline text-xs font-black rotate-12 translate-x-4 -translate-y-4 text-center leading-none px-2 uppercase">
              A domicilio
            </div>
            
            <div className="flex-grow flex flex-col gap-6">
              <div className="w-12 h-12 bg-primary/10 border-2 border-on-background flex items-center justify-center rounded-none shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                <Truck className="w-6 h-6 text-primary" />
              </div>
              
              <div>
                <h3 className="font-headline text-2xl uppercase font-black mb-4">
                  Envío a Domicilio
                </h3>
                <p className="font-sans text-base text-on-surface-variant font-semibold leading-relaxed mb-4">
                  Te la enviamos directamente junto con el link de acceso a la versión web. ¡Pedila ya!
                </p>
                
                {/* Phone Link Block */}
                <a 
                  href="tel:1130177771"
                  className="inline-flex items-center gap-2 bg-[#25d366] text-white font-label text-base font-black px-4 py-2 border-2 border-on-background shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-[3px] active:shadow-none transition-all uppercase mb-2"
                >
                  <Phone className="w-5 h-5 fill-white" />
                  11 3017 7771
                </a>
              </div>
            </div>
            
            <div className="mt-8 border-t-2 border-on-background/25 pt-4">
              <span className="font-label text-xs uppercase font-bold text-neutral-500">
                Delivery directo
              </span>
            </div>
          </div>

        </div>

        {/* Cost Tag - Mega Brutalist Banner */}
        <div className="bg-secondary-fixed border-4 border-on-background shadow-[8px_8px_0px_rgba(0,0,0,1)] p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-6 mt-4 relative overflow-hidden group">
          {/* Diagonal stripes on side as brutalist visual */}
          <div className="absolute top-0 right-0 w-24 h-full bg-[#171717]/5 -skew-x-12 pointer-events-none"></div>
          
          <div className="flex flex-col gap-2 text-center md:text-left">
            <span className="font-headline text-sm uppercase tracking-widest font-black text-primary">
              Valor del material impreso
            </span>
            <h2 className="font-headline text-3xl md:text-5xl uppercase font-black leading-none">
              Costo de cada ejemplar
            </h2>
          </div>
          
          <div className="bg-white border-4 border-on-background px-8 py-4 shadow-[6px_6px_0px_rgba(0,0,0,1)] rotate-2 group-hover:rotate-0 transition-transform duration-300">
            <span className="font-headline text-4xl md:text-5xl font-black text-primary">
              $5.000
            </span>
            <span className="font-label text-xs uppercase font-bold block text-center mt-1 text-on-surface-variant">
              ARS (Pesos Argentinos)
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
