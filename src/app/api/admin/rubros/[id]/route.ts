import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session')?.value;
    if (token !== 'authenticated') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const { nombre, slug, descripcion, imagenFondo } = await request.json();

    if (!nombre || !slug) {
      return NextResponse.json({ error: 'Nombre y Slug son requeridos' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('rubros')
      .update({
        nombre,
        slug,
        descripcion: descripcion || '',
        imagen_fondo: imagenFondo || '',
      })
      .eq('id', id)
      .select('id, nombre, slug, descripcion, imagenFondo:imagen_fondo')
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, rubro: data });
  } catch (error: any) {
    console.error('Error al actualizar rubro:', error);
    return NextResponse.json({ error: error.message || 'Error del servidor' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session')?.value;
    if (token !== 'authenticated') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;

    // Check if there are categories linked to this rubro
    const { count, error: errCheck } = await supabaseAdmin
      .from('categorias')
      .select('*', { count: 'exact', head: true })
      .eq('rubro_id', id);

    if (errCheck) throw errCheck;

    if (count && count > 0) {
      return NextResponse.json(
        {
          error: 'No se puede eliminar este rubro porque tiene categorías asociadas.',
        },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('rubros')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error al eliminar rubro:', error);
    return NextResponse.json({ error: error.message || 'Error del servidor' }, { status: 500 });
  }
}
