/**
 * Comprime una imagen en el cliente utilizando Canvas API.
 * Reduce las dimensiones si exceden el límite máximo y exporta a formato JPEG con calidad ajustada.
 * 
 * @param file El archivo original seleccionado por el usuario.
 * @param maxDimension Dimensión máxima en píxeles (ancho o alto). Por defecto 1200px.
 * @param quality Calidad de compresión de 0 a 1. Por defecto 0.8.
 * @returns Promesa que resuelve a un objeto con el archivo comprimido y los tamaños original/comprimido.
 */
export async function compressImage(
  file: File,
  maxDimension = 1200,
  quality = 0.8
): Promise<{ compressedFile: File; originalSize: number; compressedSize: number }> {
  return new Promise((resolve, reject) => {
    // Validar que sea un archivo de tipo imagen
    if (!file.type.startsWith('image/')) {
      return reject(new Error('El archivo seleccionado no es una imagen válida.'));
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calcular nuevas dimensiones manteniendo la relación de aspecto
        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('No se pudo obtener el contexto 2D del Canvas para la compresión.'));
        }

        // Dibujar la imagen en el canvas con las nuevas dimensiones
        ctx.drawImage(img, 0, 0, width, height);

        // Convertir el canvas a Blob en formato JPEG
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error('Error al procesar la conversión de la imagen.'));
            }

            // Sanitizar nombre de archivo y cambiar extensión a .jpg
            const lastDotIndex = file.name.lastIndexOf('.');
            const baseName = lastDotIndex !== -1 ? file.name.substring(0, lastDotIndex) : file.name;
            const cleanName = baseName.replace(/[^a-zA-Z0-9_-]/g, '_') + '.jpg';

            const compressedFile = new File([blob], cleanName, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });

            resolve({
              compressedFile,
              originalSize: file.size,
              compressedSize: compressedFile.size,
            });
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => {
        reject(new Error('Error al cargar el archivo de imagen en memoria.'));
      };
    };

    reader.onerror = () => {
      reject(new Error('Error al leer el archivo de origen.'));
    };
  });
}
