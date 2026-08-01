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
    const { nombre, slug, rubroId, imagenFondo } = await request.json();

    if (!nombre || !slug || !rubroId) {
      return NextResponse.json({ error: 'Nombre, Slug y Rubro son requeridos' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('categorias')
      .update({
        nombre,
        slug,
        rubro_id: rubroId,
        imagen_fondo: imagenFondo || '',
      })
      .eq('id', id)
      .select('id, nombre, slug, rubroId:rubro_id, imagenFondo:imagen_fondo')
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, categoria: data });
  } catch (error: any) {
    console.error('Error al actualizar categoría:', error);
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

    // Check if there are businesses linked to this category
    const { count, error: errCheck } = await supabaseAdmin
      .from('negocios')
      .select('*', { count: 'exact', head: true })
      .eq('categoria_id', id);

    if (errCheck) throw errCheck;

    if (count && count > 0) {
      return NextResponse.json(
        {
          error: 'No se puede eliminar esta categoría porque tiene negocios asociados.',
        },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('categorias')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error al eliminar categoría:', error);
    return NextResponse.json({ error: error.message || 'Error del servidor' }, { status: 500 });
  }
}
