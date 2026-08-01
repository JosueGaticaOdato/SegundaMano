import CardNegocio from "@/components/cards/CardNegocio";
import { getCategoria } from "@/services/categorias";
import { getNegocios, getNegociosByRubro } from "@/services/negocios";
import { getRubro, getRubroBySlug } from "@/services/rubros";
import { ArrowLeft, Search, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Categoria({ params }: { params: { slug: string } }) {
    const { slug } = await params;

    // 1. Intentamos obtener la categoría por slug
    const categoria = await getCategoria(slug);
    let negocios = [];
    let title = "";
    let backLink = "/";
    let backLinkLabel = "Volver al Inicio";

    if (categoria) {
        // Si existe la categoría, traemos sus negocios
        negocios = await getNegocios(categoria.id);
        title = categoria.nombre;

        // Obtenemos el rubro para volver atrás a las categorías de ese rubro
        if (categoria.rubro_id) {
            const rubro = await getRubro(categoria.rubro_id);
            if (rubro) {
                backLink = `/rubro/${rubro.slug}`;
                backLinkLabel = `Volver a ${rubro.nombre}`;
            }
        }
    } else {
        // 2. Si no es una categoría, verificamos si es un rubro (redirección directa)
        const rubro = await getRubroBySlug(slug);
        if (!rubro) {
            // Si tampoco es un rubro, 404
            notFound();
        }

        // Si es un rubro, traemos los negocios de ese rubro directamente
        negocios = await getNegociosByRubro(rubro.id);
        title = rubro.nombre;
        backLink = "/";
        backLinkLabel = "Volver a Rubros";
    }

    return (
        <main className="w-full max-w-[1440px] mx-auto px-4 md:px-16 py-12">

            {/* Buscador */}
            <section className="mb-12">
                <h1 className="font-headline text-3xl md:text-5xl font-black mb-6 uppercase leading-tight text-on-background">
                    Resultados para:{' '}
                    <span className="text-primary drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] py-1">
                        {title}
                    </span>
                </h1>

                <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <Link
                        href={backLink}
                        className="bg-secondary-fixed text-on-secondary-fixed font-label text-sm font-bold border-4 border-on-background shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] px-6 py-4 hover:translate-y-1 hover:shadow-none transition-all uppercase flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {backLinkLabel}
                    </Link>

                    <div className="flex-grow flex items-center bg-white border-4 border-on-background shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] px-6 py-4">
                        <Search className="text-primary mr-4 w-6 h-6" />
                        <div className="text-on-background font-headline text-lg uppercase font-black">
                            {negocios.length} {negocios.length === 1 ? 'comercio encontrado' : 'comercios encontrados'} en Chivilcoy
                        </div>
                    </div>
                </div>
            </section>

            {/* Grid layout Categorias */}
            <section className="flex flex-col lg:flex-row gap-8">

                {/* Filtros */}
                {/* <FiltrosLaterales 
                    selectedZones={selectedZones}
                    zoneOptions={zoneOptions}
                    onZoneToggle={handleZoneToggle}
                /> */}

                {/* Resultados */}
                <ul className="w-full lg:w-3/4">
                    {negocios.length === 0 ? (
                        <div className="bg-white border-4 border-on-background shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-12 text-center brutal-border">
                            <p className="font-headline text-lg uppercase font-black text-on-background mb-4">No se encontraron comercios registrados</p>
                            <p className="font-sans font-medium text-on-surface-variant mb-6">Pronto tendremos novedades en este sector comercial.</p>
                            <Link href="/" className="inline-block bg-[#ff00ff] text-white font-label text-sm font-bold border-2 border-on-background px-6 py-3 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 active:translate-y-1">
                                Explorar otros rubros
                            </Link>
                        </div>
                    ) : (
                        <li className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {negocios.map((negocio) => (
                                <CardNegocio key={negocio.id} negocio={negocio} />
                            ))}
                        </li>
                    )}

                </ul>


            </section>
        </main>
    );
}