import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: Request) {
  try {
    // 1. Verificar autenticación del administrador
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session')?.value;
    if (token !== 'authenticated') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // 2. Extraer datos del FormData
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const bucket = formData.get('bucket') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No se recibió ningún archivo' }, { status: 400 });
    }

    if (!bucket || !['rubros', 'categorias', 'negocios'].includes(bucket)) {
      return NextResponse.json({ error: 'Bucket no válido o no especificado' }, { status: 400 });
    }

    // 3. Procesar archivo a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 4. Generar nombre de archivo único
    const originalName = file.name || 'image.jpg';
    const lastDotIndex = originalName.lastIndexOf('.');
    const ext = lastDotIndex !== -1 ? originalName.substring(lastDotIndex) : '.jpg';
    const baseName = lastDotIndex !== -1 ? originalName.substring(0, lastDotIndex) : 'image';
    
    // Sanitizar nombre base del archivo para evitar caracteres problemáticos en URLs
    const sanitizedBase = baseName.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    const uniqueId = Math.random().toString(36).substring(2, 8);
    const fileName = `${Date.now()}-${sanitizedBase}-${uniqueId}${ext}`;

    // 5. Subir a Supabase Storage usando supabaseAdmin para omitir RLS restrictivas en escritura
    const { error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .upload(fileName, buffer, {
        contentType: file.type || 'image/jpeg',
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error(`Error al subir imagen a bucket ${bucket}:`, uploadError);
      return NextResponse.json(
        { error: `Error de Supabase: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // 6. Obtener URL pública
    const { data: urlData } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(fileName);

    if (!urlData || !urlData.publicUrl) {
      return NextResponse.json(
        { error: 'No se pudo generar la URL pública del archivo subido.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      fileName,
    });
  } catch (error: any) {
    console.error('Error en API de subida de imágenes:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
