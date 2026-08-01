'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search as SearchIcon, ArrowRight } from 'lucide-react';

export default function Search() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/categoria?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form
      onSubmit={handleSearchSubmit}
      className="w-full max-w-3xl flex flex-col md:flex-row gap-4 bg-white p-4 brutal-border brutal-shadow"
    >
      <div className="flex-grow flex relative">
        <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-outline w-6 h-6" />
        <input
          type="text"
          placeholder="¿Qué estás buscando? (ej. Mecánico, Acopio, Pizza...)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
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
  );
}
