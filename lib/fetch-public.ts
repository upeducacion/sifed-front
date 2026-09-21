export async function fetchPublic<T>(
  endpoint: string,
  options?: RequestInit & { params?: Record<string, string | number | boolean> }
): Promise<T> {
  const API_URL = typeof window === 'undefined'
    ? process.env.NEXT_PUBLIC_BACKEND_URL + '/api'
    : process.env.NEXT_PUBLIC_API_URL;

  let url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  // Procesar parámetros de query
  if (options?.params) {
    const searchParams = new URLSearchParams();
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const isServer = typeof window === 'undefined';

  // Configurar las opciones por defecto para On-Demand Revalidation
  const fetchOptions: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options?.headers,
    },
    // En desarrollo evitamos servir datos viejos después de cambios administrativos.
    // En producción los documentos se actualizan mediante revalidación por tags.
    cache: isServer
      ? (process.env.NODE_ENV === 'development' ? 'no-store' : (options?.cache ?? 'force-cache'))
      : 'default',
    ...(isServer && {
      next: {
        ...options?.next,
      },
    }),
  };

  try {
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`[fetchPublic] Error en petición a ${url}:`, error);
    throw error;
  }
}
