// Perfiles de calidad según el objetivo de la imagen
export const IMAGE_INTENT = {
  HERO: 0.90,       // Alta calidad (Banners principales, mucha visibilidad)
  GALLERY: 0.85,    // Calidad media-alta (Fotos de galería donde los detalles importan)
  CONTENT: 0.80,    // Calidad estándar (Imágenes dentro de noticias, portadas de documentos)
  AVATAR: 0.75,     // Mayor compresión (Fotos de plana docente, miniaturas pequeñas)
} as const;

export type ImageIntent = keyof typeof IMAGE_INTENT;

/**
 * Convierte cualquier imagen (File) a formato WebP conservando sus dimensiones originales,
 * pero aplicando una compresión inteligente basada en la intención de uso.
 * 
 * @param file Archivo de imagen original (JPG, PNG, etc.)
 * @param intent El propósito de la imagen para determinar la agresividad de la compresión
 * @returns Una Promesa que resuelve en un nuevo File tipo 'image/webp'
 */
export async function convertToWebP(file: File, intent: ImageIntent = 'CONTENT'): Promise<File> {
  return new Promise((resolve, reject) => {
    // Si el archivo no es una imagen, lo devolvemos tal cual (safety check)
    if (!file.type.startsWith('image/')) {
      return resolve(file);
    }

    const reader = new FileReader();
    
    reader.onload = (event) => {
      const img = new Image();
      
      img.onload = () => {
        // Crear un canvas con las mismas dimensiones que la imagen original
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('No se pudo obtener el contexto del canvas'));
        }
        //Prevencion para fondos transparentes
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Dibujar la imagen original en el canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Extraer la imagen como WebP con la calidad definida por el intent
        const quality = IMAGE_INTENT[intent];
        
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error('Fallo al convertir la imagen a Blob'));
            }
            
            // Reconstruir el nombre del archivo para que termine en .webp
            const originalName = file.name;
            const newName = originalName.substring(0, originalName.lastIndexOf('.')) + '.webp';
            
            // Crear el nuevo objeto File
            const webpFile = new File([blob], newName, {
              type: 'image/webp',
              lastModified: Date.now(),
            });
            
            resolve(webpFile);
          },
          'image/webp',
          quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('Error al cargar la imagen en memoria'));
      };
      
      img.src = event.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo original'));
    };
    
    reader.readAsDataURL(file);
  });
}
