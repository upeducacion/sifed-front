import axios from 'axios';
import Cookies from 'js-cookie';
import { AUTH_COOKIE_NAME } from './auth-config';

const api = axios.create({
  // Aseguramos que la URL sea absoluta para evitar problemas en rutas dinámicas
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Interceptor para agregar el token automáticamente a cada petición
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    // Intentamos obtener el token de la cookie
    const token = Cookies.get(AUTH_COOKIE_NAME);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (process.env.NODE_ENV === 'development' && error.message === "Network Error") {
      console.warn(
        `[API] Sin conexión al backend: ${error.config?.method?.toUpperCase() ?? ''} ${error.config?.baseURL ?? ''}${error.config?.url ?? ''}`
      );
    }
    return Promise.reject(error);
  }
);

export default api;
