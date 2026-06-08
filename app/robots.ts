import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/plataforma/', '/api/'],
    },
    sitemap: 'https://info.upeducacion-uncp.edu.pe/sitemap.xml',
  }
}
