// Categorias.ts: Lógica para pedir la lista de rubros a Supabase

import { supabase } from '@/lib/supabase';

export async function getCategorias(rubroID: string) {

    const { data, error } = await supabase
        .from('categorias')
        .select('id, nombre, slug, rubro_id')
        .eq('rubro_id', rubroID)
        .order('nombre', { ascending: true }); // Los ordenamos alfabéticamente

    if (error) {
        console.error('Error al obtener categorias:', error);
        throw new Error('No se pudieron cargar las categorias');
    }

    //console.log("data", data);

    return data;
}

export async function getCategoria(slug: string) {
    const { data, error } = await supabase
        .from('categorias')
        .select('id, nombre, slug, rubro_id')
        .eq('slug', slug)
        .maybeSingle(); // Retorna un objeto o null si no se encuentra
    if (error) {
        console.error('Error al obtener categoria por slug:', error);
        throw new Error('No se pudo cargar la categoria');
    }
    return data;
}