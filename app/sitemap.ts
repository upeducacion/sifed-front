import { MetadataRoute } from 'next'
import { NoticiaService } from '@/lib/services/noticia-service'
import { programasApi } from '@/lib/api/programas'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://info.upeducacion-uncp.edu.pe'

  // 1. Rutas Estáticas
  const staticRoutes = [
    '',
    '/posgrado',
    '/posgrado/maestrias',
    '/posgrado/doctorados',
    '/posgrado/diplomados',
    '/posgrado/cursos',
    '/posgrado/formacion-continua',
    '/posgrado/talleres',
    '/posgrado/nosotros',
    '/posgrado/plana-docente',
    '/noticias',
    '/galeria-fotos',
    '/documentos-normativos',
    '/biblioteca-virtual',
    '/portales-institucionales',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))

  // 2. Rutas Dinámicas: Noticias
  let newsRoutes: MetadataRoute.Sitemap = []
  try {
    const newsResponse = await NoticiaService.getAllPublic(1)
    newsRoutes = newsResponse.data.map((news) => ({
      url: `${baseUrl}/noticias/${news.slug}`,
      lastModified: news.updated_at || new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  } catch (error) {
    console.error('Error fetching news for sitemap:', error)
  }

  // 3. Rutas Dinámicas: Programas (Maestrías y Doctorados)
  let programRoutes: MetadataRoute.Sitemap = []
  try {
    const programs = await programasApi.getPublicAll()
    programRoutes = programs.map((program) => {
      const typePath = program.tipo === 'maestria' ? 'maestrias' : 'doctorados'
      return {
        url: `${baseUrl}/posgrado/${typePath}/${program.slug}`,
        lastModified: program.updated_at || new Date().toISOString(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }
    })
  } catch (error) {
    console.error('Error fetching programs for sitemap:', error)
  }

  return [...staticRoutes, ...newsRoutes, ...programRoutes]
}
