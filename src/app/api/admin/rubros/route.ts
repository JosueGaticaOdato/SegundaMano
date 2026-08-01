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

    const { nombre, slug, descripcion, imagenFondo } = await request.json();

    if (!nombre || !slug) {
      return NextResponse.json({ error: 'Nombre y Slug son requeridos' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('rubros')
      .insert([
        {
          nombre,
          slug,
          descripcion: descripcion || '',
          imagen_fondo: imagenFondo || '',
        },
      ])
      .select('id, nombre, slug, descripcion, imagenFondo:imagen_fondo')
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, rubro: data });
  } catch (error: any) {
    console.error('Error al crear rubro:', error);
    return NextResponse.json({ error: error.message || 'Error del servidor' }, { status: 500 });
  }
}
