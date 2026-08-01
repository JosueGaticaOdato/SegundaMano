import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session')?.value;
    if (token !== 'authenticated') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { nombre, slug, rubroId, imagenFondo } = await request.json();

    if (!nombre || !slug || !rubroId) {
      return NextResponse.json({ error: 'Nombre, Slug y Rubro son requeridos' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('categorias')
      .insert([
        {
          nombre,
          slug,
          rubro_id: rubroId,
          imagen_fondo: imagenFondo || '',
        },
      ])
      .select('id, nombre, slug, rubroId:rubro_id, imagenFondo:imagen_fondo')
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, categoria: data });
  } catch (error: any) {
    console.error('Error al crear categoría:', error);
    return NextResponse.json({ error: error.message || 'Error del servidor' }, { status: 500 });
  }
}
