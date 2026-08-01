// Negocios.ts: Lógica para pedir la lista de negocios a Supabase

import { supabase } from '@/lib/supabase';

export async function getNegocios(categoriaID: string) {

    const { data, error } = await supabase
        .from('negocios')
        .select('id, nombre, descripcion, direccion, telefono, verificado, imagen')
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
        .select('id, nombre, descripcion, direccion, telefono, rubro_id, categoria_id, imagen')
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

export async function searchNegocios(queryText: string) {
    // 1. Buscamos categorías que coincidan con la búsqueda
    const { data: categoriasMatching } = await supabase
        .from('categorias')
        .select('id')
        .ilike('nombre', `%${queryText}%`);

    const categoriaIds = categoriasMatching?.map(c => c.id) || [];

    // 2. Buscamos rubros que coincidan con la búsqueda
    const { data: rubrosMatching } = await supabase
        .from('rubros')
        .select('id')
        .ilike('nombre', `%${queryText}%`);

    const rubroIds = rubrosMatching?.map(r => r.id) || [];

    // 3. Buscamos negocios por su nombre, descripción, o que pertenezcan a las categorías o rubros encontrados
    let queryBuilder = supabase
        .from('negocios')
        .select('id, nombre, descripcion, direccion, telefono, verificado, rubro_id, categoria_id, imagen')
        .order('nombre', { ascending: true });

    // Armamos la condición OR
    const orConditions = [
        `nombre.ilike.%${queryText}%`,
        `descripcion.ilike.%${queryText}%`
    ];

    if (categoriaIds.length > 0) {
        orConditions.push(`categoria_id.in.(${categoriaIds.join(',')})`);
    }

    if (rubroIds.length > 0) {
        orConditions.push(`rubro_id.in.(${rubroIds.join(',')})`);
    }

    const { data, error } = await queryBuilder.or(orConditions.join(','));

    if (error) {
        console.error('Error al buscar negocios:', error);
        throw new Error('No se pudieron buscar los negocios');
    }

    return data;
}