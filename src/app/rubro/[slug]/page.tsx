import Link from "next/link";
import { getCategorias } from "@/services/categorias";
import { getRubroBySlug } from "@/services/rubros";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import FallbackImage from "@/components/FallbackImage";

export default async function Rubro({ params }: { params: { slug: string } }) {
    const { slug } = await params;

    // 1. Obtener rubro por slug
    const rubro = await getRubroBySlug(slug);

    // Si el rubro no existe, manejamos el error
    if (!rubro) {
        return (
            <main className="max-w-[1440px] mx-auto px-4 md:px-16 py-24 text-center">
                <h1 className="font-headline text-3xl font-black uppercase text-on-background mb-4">Rubro no encontrado</h1>
                <p className="font-sans font-medium text-on-surface-variant mb-6">El sector comercial solicitado no existe en nuestros registros actuales.</p>
                <Link href="/" className="inline-block bg-primary text-white font-label text-sm font-bold border-2 border-on-background px-6 py-3 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 active:translate-y-1">
                    Volver al Inicio
                </Link>
            </main>
        );
    }

    // 2. Obtener categoria usando el id del rubro obtenido
    const categorias = await getCategorias(rubro.id);

    if (!categorias || categorias.length === 0) {
        redirect(`/categoria/${slug}`);
    }

    return (
        <main className="w-full max-w-[1440px] mx-auto px-4 md:px-16 py-12 flex flex-col gap-8 pb-32 md:pb-12">
            {/* Header y navegacion */}
            <header className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-4">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 bg-[#ff00ff] text-white font-label text-sm font-bold px-6 py-3 border-2 border-on-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all uppercase group cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Volver a Rubros
                </Link>

                <h1 className="bg-[#0099ff] text-white font-headline text-lg md:text-2xl px-8 py-3.5 border-4 border-on-background shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] italic uppercase tracking-tight font-black">
                    Categorías en {rubro?.nombre}
                </h1>
            </header>

            {/* Categorias */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {categorias.map((categoria) => {
                    return (
                        <Link
                            key={categoria.id}
                            href={`/categoria/${categoria.slug}`}
                            className={`group flex flex-col bg-white border-4 border-on-background shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all duration-300 relative overflow-hidden h-full text-left cursor-pointer
                                }`}
                        >
                            <figure className="w-full aspect-square border-b-4 border-on-background overflow-hidden relative bg-surface-variant">
                                <FallbackImage
                                    alt={categoria.nombre}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    src={categoria.imagenFondo}
                                />
                                <div className="absolute inset-0 bg-primary/10 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </figure>

                            <article className="p-6 flex flex-col items-center justify-center text-center flex-grow bg-white group-hover:bg-secondary-fixed/10 transition-colors">
                                <h2 className="font-headline text-xl leading-tight font-black text-on-background mb-2 uppercase">
                                    {categoria.nombre}
                                </h2>
                                {/* <p className="font-sans text-sm text-on-surface-variant font-bold">
                                    {categoria.totalComercios} {categoria.totalComercios === 1 ? 'opción' : 'opciones'}
                                </p> */}
                            </article>

                            {/* Action Badge */}
                            <footer className="absolute top-4 right-4 bg-secondary-fixed text-on-background font-label text-xs font-bold px-3 py-1 border-2 border-on-background shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rotate-3 group-hover:rotate-6 transition-transform">
                                VER MÁS
                            </footer>
                        </Link>
                    );
                })}
            </section>
        </main>
    )
}