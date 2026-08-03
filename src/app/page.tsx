import { getRubros } from '@/services/rubros';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Search from '@/components/Search';
import FallbackImage from '@/components/FallbackImage';
import { getPaginationRange } from '@/utils/pagination';


export default async function Home({ searchParams }: { searchParams?: Promise<{ page?: string }> }) {

  const rubros = await getRubros();
  const resolvedSearchParams = await searchParams;
  const currentPage = resolvedSearchParams?.page ? parseInt(resolvedSearchParams.page) : 1;

  const itemsPerPage = 6;
  const totalItems = rubros?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const activePage = Math.max(1, Math.min(currentPage, totalPages || 1));
  const paginatedRubros = rubros
    ? rubros.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage)
    : [];

  const getPageHref = (pageNumber: number) => {
    return `/?page=${pageNumber}`;
  };

  return (
    <div className='w-full'>

      {/* Home principal */}
      <header className="relative w-full overflow-hidden border-b-4 border-on-background hero-gradient py-16 md:py-24">
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(#eaea00 2px, transparent 2px)', backgroundSize: '24px 24px' }}></div>
        <div className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-16 flex flex-col items-center justify-center text-center">

          {/* Titulos principales */}
          <div className="bg-secondary-fixed brutal-border px-4 py-1.5 mb-6 transform -rotate-1 inline-block">
            <h2 className="font-headline text-sm md:text-lg uppercase text-on-background font-black tracking-widest">
              El que busca encuentra
            </h2>
          </div>

          <h1 className="font-headline text-4xl md:text-7xl drop-shadow-[5px_5px_0px_rgba(0,0,0,1)] uppercase mb-6 leading-none font-black tracking-tight max-w-1xl text-white">
            Buscador de <br />
            <span className="text-secondary-fixed">Rubros y Categorías</span>
          </h1>

          <p className="font-sans text-base md:text-xl text-white bg-on-background px-6 py-2.5 mb-10 brutal-border-sm inline-block font-semibold bg-black">
            CABA • ZONA OESTE • CHIVILCOY
          </p>

          {/* Buscador */}
          <Search />
        </div>
      </header>

      {/* Busqueda de directorios */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-16 py-16 bg-surface-container-low body-dot-bg flex flex-col gap-12">

        {/* Titulo: Explorar directorio */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-4 border-on-background pb-6">
          <div>
            <h2 className="font-headline text-3xl md:text-5xl uppercase text-on-background font-black tracking-tight">
              Explorar Directorio
            </h2>
            <p className="font-sans text-sm md:text-base text-on-surface-variant mt-2 font-medium">
              Encuentra los mejores comercios, industrias y servicios de la ciudad de Chivilcoy.
            </p>
          </div>
        </div>


        {/* Rubros */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {paginatedRubros?.map((rubro) => (
            <Link
              key={rubro.id}
              href={`/rubro/${rubro.slug}`}
              className='"group text-left block bg-white brutal-border brutal-shadow hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 relative overflow-hidden cursor-pointer"'
            >
              {/* Header */}
              <header className="h-44 w-full relative border-b-4 border-on-background overflow-hidden">
                <FallbackImage
                    alt={rubro.nombre}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    src={rubro.imagenFondo}
                />
                <div className="absolute inset-0 bg-primary/50 group-hover:opacity-30 transition-opacity"></div>

                {/* Cantidad de anuncios */}
                {/* <div className="absolute top-4 right-4 bg-secondary-fixed brutal-border-sm px-2.5 py-1 font-label text-xs text-on-background uppercase font-bold shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                  +{rubro?.totalAnuncios} Anuncios
                </div> */}
              </header>

              {/* Card */}
              <section className="p-6">
                <h3 className="font-headline text-2xl uppercase text-on-background mb-2 group-hover:text-primary transition-colors font-black">
                  {rubro.nombre}
                </h3>
                <p className="font-sans text-sm text-on-surface-variant mb-4 font-medium leading-relaxed">
                  {rubro?.descripcion}
                </p>
                <div className="flex items-center gap-1 font-label text-xs font-black text-primary group-hover:translate-x-1 transition-transform uppercase">
                  Ver categorías <ArrowRight className="w-4 h-4 inline" />
                </div>
              </section>
            </Link>
          ))}

        </div>

        {/* Paginación simple adaptada a la estética brutalista */}
        {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-4">
                {/* Flecha anterior */}
                {activePage > 1 ? (
                    <Link
                        href={getPageHref(activePage - 1)}
                        className="bg-white text-on-background border-4 border-on-background shadow-[4px_4px_0px_rgba(0,0,0,1)] w-12 h-12 flex items-center justify-center font-headline text-lg font-black hover:scale-105 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                    >
                        &lt;
                    </Link>
                ) : (
                    <span className="bg-slate-100 text-slate-400 border-4 border-slate-300 w-12 h-12 flex items-center justify-center font-headline text-lg font-black opacity-50 cursor-not-allowed">
                        &lt;
                    </span>
                )}

                {/* Números de página */}
                {getPaginationRange(activePage, totalPages).map((pageNum, idx) => {
                    if (pageNum === '...') {
                        return (
                            <span
                                key={`ellipsis-${idx}`}
                                className="w-12 h-12 flex items-center justify-center font-headline text-lg font-black cursor-default select-none text-on-surface-variant"
                            >
                                ...
                            </span>
                        );
                    }

                    const isActive = pageNum === activePage;
                    return isActive ? (
                        <span
                            key={pageNum}
                            className="bg-secondary-fixed text-on-background border-4 border-on-background shadow-[4px_4px_0px_rgba(0,0,0,1)] w-12 h-12 flex items-center justify-center font-headline text-lg font-black cursor-default"
                        >
                            {pageNum}
                        </span>
                    ) : (
                        <Link
                            key={pageNum}
                            href={getPageHref(pageNum as number)}
                            className="bg-white text-on-background border-4 border-on-background shadow-[4px_4px_0px_rgba(0,0,0,1)] w-12 h-12 flex items-center justify-center font-headline text-lg font-black hover:scale-105 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                        >
                            {pageNum}
                        </Link>
                    );
                })}

                {/* Flecha siguiente */}
                {activePage < totalPages ? (
                    <Link
                        href={getPageHref(activePage + 1)}
                        className="bg-white text-on-background border-4 border-on-background shadow-[4px_4px_0px_rgba(0,0,0,1)] w-12 h-12 flex items-center justify-center font-headline text-lg font-black hover:scale-105 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                    >
                        &gt;
                    </Link>
                ) : (
                    <span className="bg-slate-100 text-slate-400 border-4 border-slate-300 w-12 h-12 flex items-center justify-center font-headline text-lg font-black opacity-50 cursor-not-allowed">
                        &gt;
                    </span>
                )}
            </div>
        )}

      </section>
    </div>
  );
}
