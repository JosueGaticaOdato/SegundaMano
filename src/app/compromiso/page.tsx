import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Check, Users, ShieldAlert, BadgeCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Nuestro Compromiso - CLASIFK2',
  description: 'Conoce nuestros compromisos con el lector y el anunciante en CLASIFK2, el que busca encuentra.',
};

export default function CompromisoPage() {
  const lectorCompromisos = [
    'Publicar en nuestros clasificados virtuales y revistas lo que necesites vender.',
    'Señalar al comerciante amigo que premia con descuentos.',
    'No aconsejar al “lobo disfrazado de cordero”.',
    'Informarte con las últimas novedades sobre precios.'
  ];

  const anuncianteCompromisos = [
    'Informarle sobre los altibajos del mercado.',
    'Promocionar nuestra página web y revista para que su anuncio tenga mayores vistas.',
    'Cooperar en la promoción de su emprendimiento mediante: página web, revista, cartelería, redes sociales y Google.',
    'Promocionar sus ofertas incentivando descuentos para los lectores.',
    'Recomendarlo por sus precios competitivos.'
  ];

  return (
    <div className="w-full flex-grow bg-surface-container-low body-dot-bg pb-24">
      {/* Hero Header */}
      <header className="relative w-full overflow-hidden border-b-4 border-on-background purple-dot-bg py-16 md:py-24">
        {/* Neon decorative grid lines/dots overlay */}
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(#eaea00 2px, transparent 2px)', backgroundSize: '24px 24px' }}></div>
        
        <div className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-16 flex flex-col items-center justify-center text-center gap-6">
          <div className="bg-[#ff00ff] text-white brutal-border px-4 py-1.5 transform -rotate-1 inline-block">
            <h2 className="font-headline text-xs md:text-sm uppercase font-black tracking-widest">
              VALORES Y ÉTICA
            </h2>
          </div>
          
          <h1 className="font-headline text-4xl md:text-6xl drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] uppercase leading-none font-black tracking-tight text-white max-w-4xl">
            Nuestros Compromisos
          </h1>
          <p className="font-sans text-sm md:text-lg text-white max-w-2xl leading-relaxed font-semibold">
            Nuestra palabra frente a la comunidad: transparencia, cooperación y crecimiento mutuo.
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

        {/* Commitments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* COMPROMISO CON EL LECTOR */}
          <div className="bg-white border-4 border-on-background shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all duration-300 p-8 flex flex-col justify-between h-full relative overflow-hidden group">
            <div>
              {/* Header Badge */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#0099ff]/10 border-2 border-on-background flex items-center justify-center rounded-none shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                  <Users className="w-5 h-5 text-[#0099ff]" />
                </div>
                <div className="bg-[#0099ff] text-white font-headline text-xs font-bold uppercase px-3 py-1 border-2 border-on-background inline-block -rotate-1">
                  CON EL LECTOR
                </div>
              </div>
              
              <h3 className="font-headline text-2xl uppercase font-black mb-8">
                Fidelidad y Transparencia
              </h3>
              
              {/* Rows List */}
              <div className="flex flex-col gap-4">
                {lectorCompromisos.map((compromiso, idx) => (
                  <div 
                    key={idx} 
                    className="flex gap-4 items-start bg-slate-50 border-2 border-on-background p-4 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all"
                  >
                    <div className="mt-0.5 bg-secondary-fixed border border-on-background p-1 flex items-center justify-center rounded-none shadow-[1px_1px_0px_rgba(0,0,0,1)] flex-shrink-0">
                      <Check className="w-4 h-4 text-on-background stroke-[3px]" />
                    </div>
                    <p className="font-sans text-base text-on-background font-semibold leading-relaxed">
                      {compromiso}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-8 border-t-2 border-on-background/25 pt-4 text-xs font-label uppercase font-bold text-neutral-500">
              Cuidamos tu bolsillo y tu confianza
            </div>
          </div>

          {/* COMPROMISO CON EL ANUNCIANTE */}
          <div className="bg-white border-4 border-on-background shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all duration-300 p-8 flex flex-col justify-between h-full relative overflow-hidden group">
            <div>
              {/* Header Badge */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#ff00ff]/10 border-2 border-on-background flex items-center justify-center rounded-none shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                  <BadgeCheck className="w-5 h-5 text-[#ff00ff]" />
                </div>
                <div className="bg-[#ff00ff] text-white font-headline text-xs font-bold uppercase px-3 py-1 border-2 border-on-background inline-block rotate-1">
                  CON EL ANUNCIANTE
                </div>
              </div>
              
              <h3 className="font-headline text-2xl uppercase font-black mb-8">
                Crecimiento y Cooperación
              </h3>
              
              {/* Rows List */}
              <div className="flex flex-col gap-4">
                {anuncianteCompromisos.map((compromiso, idx) => (
                  <div 
                    key={idx} 
                    className="flex gap-4 items-start bg-slate-50 border-2 border-on-background p-4 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all"
                  >
                    <div className="mt-0.5 bg-[#ff00ff] border border-on-background p-1 flex items-center justify-center rounded-none shadow-[1px_1px_0px_rgba(0,0,0,1)] flex-shrink-0">
                      <Check className="w-4 h-4 text-white stroke-[3px]" />
                    </div>
                    <p className="font-sans text-base text-on-background font-semibold leading-relaxed">
                      {compromiso}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-8 border-t-2 border-on-background/25 pt-4 text-xs font-label uppercase font-bold text-neutral-500">
              Socios estratégicos en tu éxito comercial
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
