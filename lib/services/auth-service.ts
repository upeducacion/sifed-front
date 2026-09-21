import axios from "axios";

interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
  foto_url?: string;
  estado: string;
}

interface LoginResponse {
  success: boolean;
  user: User;
  message?: string;
}

export const AuthService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    // Llamamos a nuestro propio Route Handler de Next.js
    const { data } = await axios.post<LoginResponse>('/api/auth/login', { email, password });
    return data;
  },

  logout: async (): Promise<void> => {
    // Llamamos a nuestro propio Route Handler de Logout
    await axios.post('/api/auth/logout');
    // Forzamos recarga para que el middleware actúe
    window.location.href = "/login";
  },

};
