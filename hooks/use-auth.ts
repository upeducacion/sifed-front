import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { USER_COOKIE_NAME } from "@/lib/auth-config";

export interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
  foto_url?: string;
  estado: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = () => {
      try {
        // Leemos de la cookie que configuramos como no-HttpOnly
        const storedUser = Cookies.get(USER_COOKIE_NAME);

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error parsing user data from cookies", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const logout = async () => {
    try {
      // Llamamos al route handler para limpiar cookies en el servidor
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return { user, loading, logout };
}
