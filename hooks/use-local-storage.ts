import { useSyncExternalStore } from "react";

/**
 * Hook seguro para leer localStorage usando useSyncExternalStore (React 18/19 Standard).
 * Evita errores de hidratación y renders en cascada.
 * 
 * @param key Clave del localStorage
 * @param initialValue Valor inicial si no existe
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Suscripción a eventos de storage (para sincronizar entre pestañas/componentes)
  const subscribe = (callback: () => void) => {
    window.addEventListener("storage", callback);
    window.addEventListener("local-storage", callback);
    return () => {
      window.removeEventListener("storage", callback);
      window.removeEventListener("local-storage", callback);
    };
  };

  // Lectura del valor (Snapshot)
  const getSnapshot = () => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? item : JSON.stringify(initialValue);
    } catch {
      return JSON.stringify(initialValue);
    }
  };

  // Valor para el servidor (SSR)
  const getServerSnapshot = () => JSON.stringify(initialValue);

  const store = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const value = JSON.parse(store) as T;

  // Setter envuelto para disparar eventos
  const setValue = (newValue: T) => {
    try {
      const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      
      // Disparar evento para notificar a otros hooks
      window.dispatchEvent(new Event("local-storage"));
    } catch {
    }
  };

  return [value, setValue];
}