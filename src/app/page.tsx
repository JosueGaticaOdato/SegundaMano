import { getRubros } from '@/services/rubros';
import { ArrowRight, Grid, Search } from 'lucide-react';
import Link from 'next/link';

export default async function Home() {

  const rubros = await getRubros();

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
          <form
            // onSubmit={handleSearchSubmit}
            className="w-full max-w-3xl flex flex-col md:flex-row gap-4 bg-white p-4 brutal-border brutal-shadow"
          >
            <div className="flex-grow flex relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-outline w-6 h-6" />
              <input
                type="text"
                placeholder="¿Qué estás buscando? (ej. Mecánico, Acopio, Pizza...)"
                // value={query}
                // onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-surface-container-lowest brutal-border-sm py-4 pl-12 pr-4 font-sans text-base md:text-lg text-on-background focus:outline-none focus:border-primary focus:ring-0 placeholder:font-label placeholder:text-outline"
              />
            </div>
            <button
              type="submit"
              className="bg-secondary-fixed text-on-background brutal-border-sm py-4 px-8 font-headline text-lg uppercase font-bold hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-0 active:shadow-none flex items-center justify-center gap-2 cursor-pointer"
            >
              Buscar <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      </header>

      {/* Busqueda de directorios */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-16 py-16 bg-surface-container-low body-dot-bg">

        {/* Titulo: Explorar directorio */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b-4 border-on-background pb-6">
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

          {rubros?.map((rubro) => (
            <Link
              key={rubro.id}
              href={`/rubro/${rubro.slug}`}
              className='"group text-left block bg-white brutal-border brutal-shadow hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 relative overflow-hidden cursor-pointer"'
            >
              {/* Header */}
              <header className="h-44 w-full relative border-b-4 border-on-background overflow-hidden">
                {/* <img
                  src={rubro?.imagenFondo || ""}
                  alt={rubro?.nombre}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                /> */}
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


      </section>
    </div>
  );
}
