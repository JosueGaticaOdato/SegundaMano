import { getNegocio } from "@/services/negocios";
import { CheckCircle2, ExternalLink, Globe, Mail, MapPin, MessageSquare, Phone, ShieldCheck, ThumbsUp } from "lucide-react";
import Link from "next/link";
import BackButton from "@/components/BackButton";
import FallbackImage from "@/components/FallbackImage";

export default async function Negocio({ params }: { params: { id: string } }) {
    const { id } = await params;

    // Obtengo el comercio
    const negocio = await getNegocio(id);

    if (!negocio) {
        return (
            <div className="max-w-[1440px] mx-auto px-4 md:px-16 py-24 text-center">
                <h1 className="font-headline text-3xl font-black uppercase text-on-background mb-4">Comercio no encontrado</h1>
                <p className="font-sans font-medium text-on-surface-variant mb-6">El negocio comercial o industrial solicitado no existe o fue removido.</p>
                <Link href="/" className="inline-block bg-primary text-white font-label text-sm font-bold border-2 border-on-background px-6 py-3 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 active:translate-y-1">
                    Volver al Inicio
                </Link>
            </div>
        )
    };

    // Mensaje de whatsapp
    const text = encodeURIComponent(`Hola ${negocio.nombre}, vi tu comercio verificado en la guía comercial de Chivilcoy CLASIFK2 y me gustaría realizar una consulta.`);
    
    // Limpiamos el número de teléfono para dejar solo dígitos, quitamos el 0 inicial si existe
    const cleanPhone = negocio.telefono ? negocio.telefono.replace(/[^\d]/g, '').replace(/^0+/, '') : "";
    // Aseguramos que empiece con el código de país 54 (Argentina) si no está presente
    const waUrl = cleanPhone ? `https://wa.me/${cleanPhone.startsWith('54') ? cleanPhone : '54' + cleanPhone}?text=${text}` : "";

    return (
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-16 py-12 flex flex-col gap-8">

            {/* Navigation & Header Actions Row */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <BackButton />
            </div>

            {/* Business Profile Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Content Area (Left/Center) */}
                <div className="lg:col-span-2 flex flex-col gap-8">

                    {/* Hero Image Card */}
                    <div className="bg-white border-4 border-on-background rounded-xl overflow-hidden brutal-shadow">
                        <div className="h-64 md:h-[450px] w-full relative border-b-4 border-on-background bg-slate-100">
                            <FallbackImage
                                src={negocio.imagen}
                                alt={negocio.nombre}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="p-8 bg-white">
                            <h1 className="font-headline text-3xl md:text-6xl font-black uppercase text-on-background break-words mb-4">
                                {negocio.nombre}
                            </h1>

                            {negocio.verificado && (
                                <div className="inline-flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-full border-2 border-on-background font-label text-xs font-bold uppercase tracking-wider mb-8 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                                    <ShieldCheck className="w-4 h-4" />
                                    Comercio Verificado
                                </div>
                            )}


                            {negocio.descripcion && (
                            <div className="prose max-w-none mb-8">
                                <h2 className="font-headline text-2xl md:text-3xl text-primary mb-4 uppercase font-black">
                                    Descripción
                                </h2>
                                <p className="font-sans text-base md:text-lg text-on-surface-variant leading-relaxed font-medium">
                                    {negocio.descripcion}
                                </p>
                            </div>
                            )}

                            {negocio.horario && (
                                <div className="bg-slate-100 border-2 border-on-background p-4 rounded-lg mt-8 font-label text-xs uppercase font-bold flex flex-col gap-1">
                                    <span className="text-primary">Horario de Atención</span>
                                    <span className="text-on-background text-sm">{negocio.horario}</span>
                                </div>
                            )}

                        </div>
                    </div>

                </div>

                {/* Sidebar Action Area (Right) */}
                <div className="flex flex-col gap-8">

                    {/* Contact Card */}
                    <div className="bg-white border-4 border-on-background rounded-xl p-8 brutal-shadow flex flex-col gap-6">
                        <h3 className="font-headline text-2xl text-on-background border-b-4 border-on-background pb-4 font-black uppercase">
                            Contacto
                        </h3>

                        {/* Address */}
                        <div className="flex items-start gap-4">
                            <div className="bg-secondary-fixed p-3 rounded-full border-2 border-on-background mt-1 flex-shrink-0">
                                <MapPin className="w-5 h-5 text-on-background" />
                            </div>
                            <div>
                                <p className="font-label text-xs text-on-surface-variant uppercase font-bold mb-1">Dirección</p>
                                <p className="font-sans text-base md:text-lg font-bold text-on-background">{negocio.direccion}</p>
                                <p className="font-sans text-sm text-on-surface-variant font-medium">{negocio.zona}</p>
                            </div>
                        </div>

                        {negocio.verificado && (
                            <>
                                {/* Phone (Optional) */}
                                {negocio.telefono && (
                                    <div className="flex items-start gap-4">
                                        <div className="bg-primary p-3 rounded-full border-2 border-on-background text-on-primary mt-1 flex-shrink-0 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-label text-xs text-on-surface-variant uppercase font-bold mb-1">Teléfono</p>
                                            <a href={`tel:${negocio.telefono}`} className="font-sans text-base md:text-lg font-bold text-on-background hover:underline">
                                                {negocio.telefono}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {/* Email (Optional) */}
                                {negocio.email && (
                                    <div className="flex items-start gap-4">
                                        <div className="bg-[#ff00ff] p-3 rounded-full border-2 border-on-background text-white mt-1 flex-shrink-0 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-label text-xs text-on-surface-variant uppercase font-bold mb-1">Correo Electrónico</p>
                                            <a href={`mailto:${negocio.email}`} className="font-sans text-sm md:text-base font-bold text-on-background hover:underline break-all">
                                                {negocio.email}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {/* Instagram (Optional) */}
                                {negocio.instagram && (
                                    <div className="flex items-start gap-4">
                                        <div className="bg-orange-300 p-3 rounded-full border-2 border-on-background text-on-primary mt-1 flex-shrink-0 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                                            <ThumbsUp className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-label text-xs text-on-surface-variant uppercase font-bold mb-1">Instagram</p>
                                            <a href={`https://instagram.com/${negocio.instagram}`} className="font-sans text-base md:text-lg font-bold text-on-background hover:underline">
                                                {negocio.instagram} 
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {/* Web (Optional) */}
                                {negocio.web && (
                                    <div className="flex items-start gap-4">
                                        <div className="bg-cyan-400 p-3 rounded-full border-2 border-on-background text-on-background mt-1 flex-shrink-0 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                                            <Globe className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-label text-xs text-on-surface-variant uppercase font-bold mb-1">Sitio Web</p>
                                            <a href={negocio.web} target="_blank" rel="noopener noreferrer" className="font-sans text-sm md:text-base font-bold text-on-background hover:underline flex items-center gap-1">
                                                {negocio.web.replace('https://', '')} <ExternalLink className="w-3.5 h-3.5" />
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {waUrl && (
                                    <a
                                        href={waUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full bg-whatsapp text-white border-4 border-on-background rounded-xl p-4 flex items-center justify-center gap-3 font-headline text-sm md:text-base font-black brutalist-shadow-sm hover:scale-105 active:translate-y-1 active:shadow-none transition-all mt-4 cursor-pointer text-center"
                                    >
                                        <MessageSquare className="w-6 h-6 fill-current" />
                                        CONTACTAR POR WHATSAPP
                                    </a>
                                )}
                            </>
                        )}
                    </div>
                </div>

            </div>

        </div >
    )
}