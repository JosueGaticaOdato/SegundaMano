"use client";

import Link from 'next/link';
import { ArrowLeft, BookOpen, MapPin } from 'lucide-react';

export default function QuienesSomos() {
  return (
    <div className="w-full flex-grow bg-surface-container-low body-dot-bg pb-24">
      {/* Hero Header */}
      <header className="relative w-full overflow-hidden border-b-4 border-on-background purple-dot-bg py-16 md:py-24">
        {/* Neon decorative grid lines/dots */}
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(#eaea00 2px, transparent 2px)', backgroundSize: '24px 24px' }}></div>
        
        <div className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-16 flex flex-col items-center justify-center text-center gap-6">
          {/* Animated / Stylized Logo Badge */}
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-secondary-fixed border-4 border-on-background shadow-[8px_8px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center transform -rotate-3 hover:rotate-3 transition-transform duration-300 group">
            {/* Logo image overlay (hidden if not loaded, fallback to stylised text) */}
            <img 
              src="/LogoP.png" 
              alt="CLASIFK2 Logo" 
              className="absolute inset-0 w-full h-full object-contain p-4 opacity-100 transition-opacity duration-300 z-10"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="text-center p-2">
              <span className="font-headline text-2xl md:text-3xl font-black text-on-background italic block tracking-tighter leading-none">CLASIFK2</span>
              <span className="font-label text-[10px] uppercase tracking-widest font-black mt-1 block bg-black text-white px-2 py-0.5 border border-black rounded">PUBLICIDAD</span>
            </div>
          </div>
          
          <h1 className="font-headline text-4xl md:text-7xl drop-shadow-[5px_5px_0px_rgba(0,0,0,1)] uppercase leading-none font-black tracking-tight text-white mt-4">
            ¿Quiénes Somos?
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

        {/* Content Section - Asymmetric Brutalist Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Card 1: Principal - Publicidad (Covers 7 columns on desktop) */}
          <div className="lg:col-span-7 bg-white border-4 border-on-background shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all duration-300 p-8 flex flex-col justify-between h-full relative overflow-hidden group">
            {/* Corner decorator */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#ff00ff] border-l-4 border-b-4 border-on-background flex items-center justify-center text-white font-headline text-2xl font-black rotate-12 translate-x-4 -translate-y-4 group-hover:rotate-45 transition-transform duration-300">
              ⚡
            </div>
            
            <div>
              <div className="bg-primary text-white font-headline text-xs font-bold uppercase px-3 py-1 border-2 border-on-background inline-block mb-6 -rotate-1">
                NUESTRO CORE
              </div>
              <h2 className="font-headline text-3xl md:text-5xl uppercase font-black tracking-tight leading-none mb-6">
                CREAMOS <span className="bg-secondary-fixed px-2 py-0.5 border-2 border-on-background inline-block rotate-1">COMUNICACIÓN</span> CON IMPACTO
              </h2>
              <p className="font-sans text-lg md:text-xl text-on-background leading-relaxed font-semibold">
                Somos una empresa de publicidad que además de crear contenido en redes,
                páginas web, publicidad en Google, gráfica e impresiones.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 mt-8 border-t-4 border-on-background pt-6">
              <span className="font-label text-xs uppercase font-bold bg-[#0099ff] text-white px-3 py-1 border-2 border-on-background shadow-[2px_2px_0px_rgba(0,0,0,1)]">Redes</span>
              <span className="font-label text-xs uppercase font-bold bg-[#ff00ff] text-white px-3 py-1 border-2 border-on-background shadow-[2px_2px_0px_rgba(0,0,0,1)]">Webs</span>
              <span className="font-label text-xs uppercase font-bold bg-secondary-fixed text-on-background px-3 py-1 border-2 border-on-background shadow-[2px_2px_0px_rgba(0,0,0,1)]">Google Ads</span>
              <span className="font-label text-xs uppercase font-bold bg-[#25d366] text-white px-3 py-1 border-2 border-on-background shadow-[2px_2px_0px_rgba(0,0,0,1)]">Gráfica</span>
            </div>
          </div>

          {/* Right Column (Covers 5 columns on desktop, holds two stacked cards) */}
          <div className="lg:col-span-5 flex flex-col gap-8 justify-between">
            
            {/* Card 2: Revistas (bg-secondary-fixed - yellow) */}
            <div className="bg-secondary-fixed border-4 border-on-background shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all duration-300 p-8 relative overflow-hidden group flex-grow">
              <div className="absolute top-4 right-4 text-on-background opacity-20 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-16 h-16" />
              </div>
              
              <div className="bg-tertiary text-white font-headline text-xs font-bold uppercase px-3 py-1 border-2 border-on-background inline-block mb-4 rotate-1">
                EDITORIAL
              </div>
              <h3 className="font-headline text-2xl md:text-3xl uppercase font-black mb-3 text-on-background">
                También hacemos revistas
              </h3>
              <p className="font-sans text-base text-on-background font-semibold leading-relaxed">
                Fusionamos el poder de la tinta con el alcance digital. Creamos medios impresos que la gente realmente quiere leer y coleccionar.
              </p>
            </div>

            {/* Card 3: Zona Oeste (bg-white with custom styling) */}
            <div className="bg-white border-4 border-on-background shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all duration-300 p-8 relative overflow-hidden group flex-grow">
              <div className="absolute top-4 right-4 text-[#0099ff] opacity-20 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="w-16 h-16" />
              </div>
              
              <div className="bg-[#0099ff] text-white font-headline text-xs font-bold uppercase px-3 py-1 border-2 border-on-background inline-block mb-4 -rotate-1">
                PROPÓSITO ZONA OESTE
              </div>
              <h3 className="font-headline text-2xl md:text-3xl uppercase font-black mb-3 text-on-background">
                El campo y la ciudad
              </h3>
              <p className="font-sans text-base text-on-surface-variant font-semibold leading-relaxed">
                Una guía para unificar más de 20 ciudades y pueblos de zona oeste, donde el campo le venda a la ciudad y viceversa. Un canal de comercialización directo y dinámico.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
