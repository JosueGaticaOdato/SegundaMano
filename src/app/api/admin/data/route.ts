import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session')?.value;

    if (token !== 'authenticated') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Fetch Rubros
    const { data: rubros, error: errRubros } = await supabaseAdmin
      .from('rubros')
      .select('id, nombre, slug, descripcion, imagenFondo:imagen_fondo')
      .order('nombre', { ascending: true });

    if (errRubros) throw errRubros;

    // Fetch Categorías
    const { data: categorias, error: errCategorias } = await supabaseAdmin
      .from('categorias')
      .select('id, nombre, slug, rubroId:rubro_id, imagenFondo:imagen_fondo')
      .order('nombre', { ascending: true });

    if (errCategorias) throw errCategorias;

    // Fetch Negocios
    const { data: negocios, error: errNegocios } = await supabaseAdmin
      .from('negocios')
      .select(
        'id, nombre, slug, descripcion, direccion, telefono, email, web, instagram, facebook, verificado, imagen, horario, rubroId:rubro_id, categoriaId:categoria_id'
      )
      .order('nombre', { ascending: true });

    if (errNegocios) throw errNegocios;

    return NextResponse.json({
      rubros,
      categorias,
      negocios,
    });
  } catch (error: any) {
    console.error('Error en API de Datos Administrativos:', error);
    return NextResponse.json(
      { error: 'Error del servidor al obtener datos', details: error.message },
      { status: 500 }
    );
  }
}
