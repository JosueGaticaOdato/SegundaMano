// Rubros.ts: Lógica para pedir la lista de rubros a Supabase

import { supabase } from '@/lib/supabase';

export async function getRubros() {
    // let data = [{
    //     "id": "1",
    //     "nombre": "a",
    //     "slug": "b",
    //     "icono": "a",
        
    // }];
    const { data, error } = await supabase
        .from('rubros')
        .select('id, nombre, slug')
        .order('nombre', { ascending: true }); // Los ordenamos alfabéticamente

    if (error) {
        console.error('Error al obtener rubros:', error);
        throw new Error('No se pudieron cargar los rubros');
    }
    //console.log("data", data);

    return data;
}

export async function getRubro(rubroID: string) {

    const { data, error } = await supabase
        .from('rubros')
        .select('id, nombre, slug')
        .eq('id', rubroID)
        .maybeSingle(); // Retorna un objeto o null si no se encuentra

    if (error) {
        console.error('Error al obtener rubros:', error);
        throw new Error('No se pudieron cargar los rubros');
    }
    //console.log("data", data);

    return data;
}

export async function getRubroBySlug(slug: string) {
    const { data, error } = await supabase
        .from('rubros')
        .select('id, nombre, slug')
        .eq('slug', slug)
        .maybeSingle(); // Retorna un objeto o null si no se encuentra
    if (error) {
        console.error('Error al obtener rubro por slug:', error);
        throw new Error('No se pudo cargar el rubro');
    }
    return data;
}