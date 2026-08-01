'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 bg-slate-200 text-on-background border-4 border-on-background px-6 py-3 rounded-xl font-label text-base font-bold brutalist-shadow-sm hover:scale-105 active:translate-y-1 active:shadow-none transition-all uppercase cursor-pointer"
        >
            <ArrowLeft className="w-5 h-5" />
            Volver Atrás
        </button>
    );
}
