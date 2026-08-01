import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-tertiary text-on-tertiary border-t-4 border-on-background w-full py-12 px-4 md:px-16 mt-auto text-white">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <Link 
            href="/"
            className="font-headline text-2xl font-black text-on-tertiary italic tracking-tighter drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] uppercase cursor-pointer"
          >
            CLASIFK2
          </Link>
          <p className="mt-2 font-label text-xs uppercase tracking-wider opacity-90 max-w-xl">
            2026 CLASIFK2 - EL QUE BUSCA ENCUENTRA. <br/>
            GUÍA COMERCIAL Y DE SERVICIOS PARA LA CIUDAD DE CHIVILCOY.
          </p>
        </div>

        <div className="flex flex-col flex-wrap justify-center gap-4 font-label text-xs uppercase font-bold">
          <Link href="/quienes-somos" className="hover:text-secondary-fixed transition-colors">
              ¿Quienes somos?
          </Link>
          <Link href="/revista" className="hover:text-secondary-fixed transition-colors">
              ¿Donde conseguir la revista y web?
          </Link>
          <Link href="/donde-llega" className="hover:text-secondary-fixed transition-colors">
              ¿Hasta donde llega tu publicidad?
          </Link>
          <Link href="/compromiso" className="hover:text-secondary-fixed transition-colors">
              Compromiso
          </Link>
        </div>

      </div>
      
      <div className="flex justify-center max-w-[1440px] mx-auto border-t-2 border-on-background/20 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-label opacity-70">
        <p className='font-bold'>© 2026 CLASIFK2 Chivilcoy. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
