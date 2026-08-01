// Negocios.ts: Lógica para pedir la lista de negocios a Supabase

import { supabase } from '@/lib/supabase';

export async function getNegocios(categoriaID: string) {

    const { data, error } = await supabase
        .from('negocios')
        .select('id, nombre, descripcion, direccion, telefono')
        .eq('categoria_id', categoriaID)
        .order('nombre', { ascending: true }); // Los ordenamos alfabéticamente

    if (error) {
        console.error('Error al obtener negocios:', error);
        throw new Error('No se pudieron cargar los negocios');
    }

    //console.log("data", data);

    return data;
}

export async function getNegociosByRubro(rubroID: string) {
    const { data, error } = await supabase
        .from('negocios')
        .select('id, nombre, descripcion, direccion, telefono, rubro_id, categoria_id')
        .eq('rubro_id', rubroID)
        .order('nombre', { ascending: true }); // Los ordenamos alfabéticamente

    if (error) {
        console.error('Error al obtener negocios por rubro:', error);
        throw new Error('No se pudieron cargar los negocios por rubro');
    }

    return data;
}

export async function getNegocio(id: string){
    const { data, error } = await supabase
        .from('negocios')
        .select('*')
        .eq('id', id)
        .maybeSingle(); // Retorna un objeto o null si no se encuentra
    if (error) {
        console.error('Error al obtener negocio:', error);
        throw new Error('No se pudo cargar el negocio');
    }

    return data;
}