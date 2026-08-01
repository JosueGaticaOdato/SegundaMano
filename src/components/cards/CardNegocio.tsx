"use client";

import Link from 'next/link';
import { ShieldCheck, MapPin, MessageSquare, Phone } from 'lucide-react';
import FallbackImage from '@/components/FallbackImage';

export default function Cardnegocio({ negocio }: any) {
  return (
    <article 
      className="bg-white border-4 border-on-background shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] cursor-default flex flex-col hover:-translate-y-2 transition-transform duration-300 group"
    >
      {/* Header Image */}
      <div className="h-48 border-b-4 border-on-background relative overflow-hidden bg-surface-container">
        <FallbackImage 
          src={negocio.imagen} 
          alt={negocio.nombre} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Featured / Verified Badges */}
        {negocio.destacado && (
          <div className="absolute top-4 left-4 bg-tertiary text-on-tertiary font-label text-[10px] font-bold px-3 py-1 border-2 border-on-background shadow-[2px_2px_0px_rgba(0,0,0,1)] uppercase z-10">
            DESTACADO
          </div>
        )}
        
        {negocio.verificado && (
          <div className="absolute top-4 right-4 bg-primary text-on-primary font-label text-[10px] font-bold px-2 py-1 border-2 border-on-background shadow-[2px_2px_0px_rgba(0,0,0,1)] uppercase flex items-center gap-1 z-10">
            <ShieldCheck className="w-3.5 h-3.5" /> Verificado
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-headline text-xl font-bold leading-tight uppercase line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {negocio.nombre}
        </h3>
        <p className="font-sans text-xs text-on-surface-variant mb-4 line-clamp-2 font-medium">
          {negocio.descripcion}
        </p>

        <div className="mt-auto space-y-2 mb-6 font-label text-xs font-bold">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="line-clamp-1">{negocio.direccion}</span>
          </div>
          {/* <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-whatsapp shrink-0" />
            <span className="line-clamp-1">{negocio.telefono}</span>
          </div> */}
        </div>

        {/* CTA Action Buttons */}
        <div className="flex flex-col gap-2 mt-auto">          
          <Link 
            href={`/negocio/${negocio.id}`}
            className="w-full bg-secondary-fixed text-on-background font-label text-xs font-bold border-2 border-on-background py-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] hover:shadow-none transition-all uppercase flex items-center justify-center gap-2 cursor-pointer text-center"
          >
            VER DETALLES
          </Link>
        </div>
      </div>
    </article>
  );
}
