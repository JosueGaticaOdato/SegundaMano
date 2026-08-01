import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Map, Globe, Landmark, Anchor } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cobertura de Publicidad - CLASIFK2',
  description: 'Descubre hasta dónde llega tu publicidad con la cobertura de distribución de CLASIFK2 en Buenos Aires, CABA y Costa Atlántica.',
};

export default function DondeLlegaPage() {
  const ciudades = [
    'Alberti', 'Suipacha', 'Mercedes', 'Luján', 'Bragado', 
    'Riestra', 'Pedernales', 'Chacabuco', 'Junín', '25 de Mayo', 'Chivilcoy'
  ];

  const pueblos = [
    'Pla', 'Villa Moll', 'San Sebastián', 'Moquehuá', 'Gorostiaga', 
    'La Rica', 'Ramón Biaus', 'Henry Bell', 'Coronel Mom', 'Palemón Huergo', 
    'Ayarza', 'Rawson', 'Las Marianas', 'O\'Higgins', 'Indacochea', 'Benítez'
  ];

  const mayoristas = [
    'Once', 'Constitución', 'Liniers', 'Flores', 'La Salada'
  ];

  const costa = [
    'Las Toninas', 'Santa Teresita', 'San Clemente', 'Mar del Tuyú', 
    'Costa del Este', 'La Lucila', 'Costa Azul', 'Aguas Verdes', 
    'San Bernardo', 'Mar de Ajó', 'Atlantis'
  ];

  return (
    <div className="w-full flex-grow bg-surface-container-low body-dot-bg pb-24">
      {/* Hero Header */}
      <header className="relative w-full overflow-hidden border-b-4 border-on-background hero-gradient py-16 md:py-24">
        {/* Neon decorative grid lines/dots overlay */}
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(#eaea00 2px, transparent 2px)', backgroundSize: '24px 24px' }}></div>
        
        <div className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-16 flex flex-col items-center justify-center text-center gap-6">
          <div className="bg-secondary-fixed text-on-background brutal-border px-4 py-1.5 transform -rotate-1 inline-block">
            <h2 className="font-headline text-xs md:text-sm uppercase font-black tracking-widest">
              ZONA DE INFLUENCIA
            </h2>
          </div>
          
          <h1 className="font-headline text-4xl md:text-6xl drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] uppercase leading-none font-black tracking-tight text-white max-w-4xl">
            ¿Hasta dónde llega tu publicidad?
          </h1>
          <p className="font-sans text-sm md:text-lg text-white max-w-2xl leading-relaxed font-semibold">
            Unificamos más de 20 ciudades y pueblos conectando el comercio local, el campo y la ciudad.
          </p>
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

        {/* Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* CIUDADES (Covers 7 cols on desktop) */}
          <div className="lg:col-span-7 bg-white border-4 border-on-background shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all duration-300 p-8 flex flex-col justify-between h-full relative overflow-hidden group">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#0099ff]/10 border-2 border-on-background flex items-center justify-center rounded-none shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                  <Map className="w-5 h-5 text-[#0099ff]" />
                </div>
                <div className="bg-[#0099ff] text-white font-headline text-xs font-bold uppercase px-3 py-1 border-2 border-on-background inline-block -rotate-1">
                  CIUDADES PRINCIPALES
                </div>
              </div>
              <h3 className="font-headline text-2xl md:text-3xl uppercase font-black mb-6">
                Centros Urbanos Conectados
              </h3>
              
              {/* Badge/Tag Cloud */}
              <div className="flex flex-wrap gap-3">
                {ciudades.map((ciudad) => (
                  <span 
                    key={ciudad} 
                    className="bg-white text-on-background font-label text-xs md:text-sm font-bold border-2 border-on-background px-3 py-1.5 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:bg-[#0099ff]/10 transition-all uppercase cursor-default"
                  >
                    {ciudad}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mt-8 border-t-2 border-on-background/25 pt-4 text-xs font-label uppercase font-bold text-neutral-500">
              Distribución estratégica de revistas y web
            </div>
          </div>

          {/* CENTROS MAYORISTAS CABA (Covers 5 cols on desktop) */}
          <div className="lg:col-span-5 bg-white border-4 border-on-background shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all duration-300 p-8 flex flex-col justify-between h-full relative overflow-hidden group">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#ff00ff]/10 border-2 border-on-background flex items-center justify-center rounded-none shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                  <Landmark className="w-5 h-5 text-[#ff00ff]" />
                </div>
                <div className="bg-[#ff00ff] text-white font-headline text-xs font-bold uppercase px-3 py-1 border-2 border-on-background inline-block rotate-1">
                  PUNTOS MAYORISTAS
                </div>
              </div>
              <h3 className="font-headline text-2xl md:text-3xl uppercase font-black mb-6">
                Centros CABA
              </h3>
              
              {/* Badge/Tag Cloud */}
              <div className="flex flex-wrap gap-3">
                {mayoristas.map((mayorista) => (
                  <span 
                    key={mayorista} 
                    className="bg-white text-on-background font-label text-xs md:text-sm font-bold border-2 border-on-background px-3 py-1.5 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:bg-[#ff00ff]/10 transition-all uppercase cursor-default"
                  >
                    {mayorista}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mt-8 border-t-2 border-on-background/25 pt-4 text-xs font-label uppercase font-bold text-neutral-500">
              Conexión directa con la capital
            </div>
          </div>

          {/* PUEBLOS DE CAMPAÑA (Covers 12 cols - Full width for readability) */}
          <div className="lg:col-span-12 bg-white border-4 border-on-background shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all duration-300 p-8 relative overflow-hidden group">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-secondary-fixed/20 border-2 border-on-background flex items-center justify-center rounded-none shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <div className="bg-secondary-fixed text-on-background font-headline text-xs font-bold uppercase px-3 py-1 border-2 border-on-background inline-block -rotate-1">
                ZONAS AGROPECUARIAS Y LOCALIDADES
              </div>
            </div>
            <h3 className="font-headline text-2xl md:text-3xl uppercase font-black mb-6">
              Pueblos de Campaña
            </h3>
            
            {/* Badge/Tag Cloud */}
            <div className="flex flex-wrap gap-3">
              {pueblos.map((pueblo) => (
                <span 
                  key={pueblo} 
                  className="bg-white text-on-background font-label text-xs md:text-sm font-bold border-2 border-on-background px-3 py-1.5 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:bg-secondary-fixed/20 transition-all uppercase cursor-default"
                >
                  {pueblo}
                </span>
              ))}
            </div>
            
            <div className="mt-8 border-t-2 border-on-background/25 pt-4 text-xs font-label uppercase font-bold text-neutral-500">
              Integración de más de 20 pueblos de la producción agrícola
            </div>
          </div>

          {/* COSTA ATLÁNTICA (Covers 12 cols - Full width for readability) */}
          <div className="lg:col-span-12 bg-white border-4 border-on-background shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all duration-300 p-8 relative overflow-hidden group">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#25d366]/10 border-2 border-on-background flex items-center justify-center rounded-none shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                <Anchor className="w-5 h-5 text-[#25d366]" />
              </div>
              <div className="bg-[#25d366] text-white font-headline text-xs font-bold uppercase px-3 py-1 border-2 border-on-background inline-block rotate-1">
                TEMPORADA & TURISMO
              </div>
            </div>
            <h3 className="font-headline text-2xl md:text-3xl uppercase font-black mb-6">
              Costa Atlántica
            </h3>
            
            {/* Badge/Tag Cloud */}
            <div className="flex flex-wrap gap-3">
              {costa.map((balneario) => (
                <span 
                  key={balneario} 
                  className="bg-white text-on-background font-label text-xs md:text-sm font-bold border-2 border-on-background px-3 py-1.5 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:bg-[#25d366]/10 transition-all uppercase cursor-default"
                >
                  {balneario}
                </span>
              ))}
            </div>
            
            <div className="mt-8 border-t-2 border-on-background/25 pt-4 text-xs font-label uppercase font-bold text-neutral-500">
              Máximo alcance en puntos de turismo costeros
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
