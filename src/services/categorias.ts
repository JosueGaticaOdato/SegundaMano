// Categorias.ts: Lógica para pedir la lista de categorías a Supabase

import { supabase } from '@/lib/supabase';

export async function getCategorias(rubroID: string) {
    const { data, error } = await supabase
        .from('categorias')
        .select('id, nombre, slug, rubroId:rubro_id, imagenFondo:imagen_fondo')
        .eq('rubro_id', rubroID)
        .order('nombre', { ascending: true }); // Los ordenamos alfabéticamente

    if (error) {
        console.error('Error al obtener categorias:', error);
        throw new Error('No se pudieron cargar las categorias');
    }

    return data;
}

export async function getCategoria(slug: string) {
    const { data, error } = await supabase
        .from('categorias')
        .select('id, nombre, slug, rubroId:rubro_id, imagenFondo:imagen_fondo')
        .eq('slug', slug)
        .maybeSingle(); // Retorna un objeto o null si no se encuentra
    if (error) {
        console.error('Error al obtener categoria por slug:', error);
        throw new Error('No se pudo cargar la categoria');
    }
    return data;
}