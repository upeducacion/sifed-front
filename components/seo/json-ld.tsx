import { unidadPosgradoApi } from "@/lib/api/unidad-posgrado";

/**
 * Genera el JSON-LD para la Organización (Unidad de Posgrado).
 * Se integra en el layout principal para mejorar el SEO local y organizacional.
 */
export async function getOrganizationJsonLd() {
  let phone = "51949260658"; // Fallback por defecto
  
  try {
    const unidadData = await unidadPosgradoApi.getPublic();
    if (unidadData?.admision_json?.whatsapp_contacto) {
      phone = unidadData.admision_json.whatsapp_contacto;
    }
  } catch (error) {
    console.error("Error fetching phone for JSON-LD:", error);
  }

  // Limpiar el teléfono para el formato tel: (eliminar espacios o símbolos si los hay)
  const cleanPhone = phone.replace(/\s+/g, '');
  const formattedPhone = cleanPhone.startsWith('+') ? cleanPhone : `+${cleanPhone}`;

  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Unidad de Posgrado de la Facultad de Educación - UNCP",
    "alternateName": "UP Educación UNCP",
    "url": "https://upeducacion-uncp.edu.pe",
    "logo": "https://upeducacion-uncp.edu.pe/icon-512.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": formattedPhone,
      "contactType": "customer service",
      "areaServed": "PE",
      "availableLanguage": "Spanish"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Avenida Mariscal Castilla No 3809-4089, El Tambo",
      "addressLocality": "Huancayo",
      "addressRegion": "Junín",
      "postalCode": "12000",
      "addressCountry": "PE"
    },
    "sameAs": [
      "https://www.facebook.com/upgeducacionuncp/?locale=es_LA"
    ],
    "email": "unidaddeposgradoeducacion@gmail.com"
  };
}

/**
 * Genera el JSON-LD para el Buscador del Sitio (Sitelinks Searchbox).
 */
export function getWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://upeducacion-uncp.edu.pe",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://upeducacion-uncp.edu.pe/noticias?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };
}
