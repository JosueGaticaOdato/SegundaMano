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
    const body = await request.json();
    const {
      nombre,
      slug,
      descripcion,
      direccion,
      telefono,
      email,
      web,
      instagram,
      facebook,
      verificado,
      imagen,
      horario,
      rubroId,
      categoriaId,
    } = body;

    if (!nombre || !slug || !rubroId || !direccion) {
      return NextResponse.json(
        { error: 'Nombre, Slug, Rubro y Dirección son requeridos' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('negocios')
      .update({
        nombre,
        slug,
        descripcion: descripcion || '',
        direccion,
        telefono: telefono || null,
        email: email || null,
        web: web || null,
        instagram: instagram || null,
        facebook: facebook || null,
        verificado: !!verificado,
        imagen: imagen || null,
        horario: horario || null,
        rubro_id: rubroId,
        categoria_id: categoriaId || null,
      })
      .eq('id', id)
      .select(
        'id, nombre, slug, descripcion, direccion, telefono, email, web, instagram, facebook, verificado, imagen, horario, rubroId:rubro_id, categoriaId:categoria_id'
      )
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, negocio: data });
  } catch (error: any) {
    console.error('Error al actualizar negocio:', error);
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

    const { error } = await supabaseAdmin
      .from('negocios')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error al eliminar negocio:', error);
    return NextResponse.json({ error: error.message || 'Error del servidor' }, { status: 500 });
  }
}
