"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  username: string;
}

// CUSTOM HOOK: Patrón de React para reutilizar lógica de estado entre componentes
// Los hooks personalizados siempre empiezan con "use" y pueden usar otros hooks internamente
export function useAuth() {
  // useState: Hook que maneja estado local del componente, devuelve [valor, setter]
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // useRouter: Hook de Next.js para navegación programática
  const router = useRouter();

  // useEffect: Hook para efectos secundarios (side effects)
  // Se ejecuta después del render, el array vacío [] significa que solo se ejecuta una vez
  useEffect(() => {
    checkAuthStatus();
  }, []); // Dependency array vacío = solo se ejecuta al montar el componente

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);

      // Fetch API: Método moderno para hacer peticiones HTTP
      // credentials: 'include' envía cookies automáticamente (necesario para JWT)
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Función async/await: Manejo moderno de operaciones asíncronas
  const login = async (username: string, password: string) => {
    try {
      // POST request con JSON body para enviar credenciales
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Actualizar múltiples estados relacionados
        setUser(data.user);
        setIsAuthenticated(true);

        // Progressive Enhancement: Usar nueva API si está disponible, fallback si no
        if ('startViewTransition' in document) {
          document.startViewTransition(() => {
            router.push('/dashboard');
          });
        } else {
          router.push('/dashboard');
        }

        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.message };
      }
    } catch (error) {
      // Type narrowing: Verificar tipo antes de acceder a propiedades
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed'
      };
    }
  };

  const register = async (username: string, password: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsAuthenticated(true);

        // Usar Page Transition API si está disponible
        if ('startViewTransition' in document) {
          document.startViewTransition(() => {
            router.push('/dashboard');
          });
        } else {
          router.push('/dashboard');
        }

        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.message };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed'
      };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      setUser(null);
      setIsAuthenticated(false);

      // Usar Page Transition API si está disponible
      if ('startViewTransition' in document) {
        document.startViewTransition(() => {
          router.push('/');
        });
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      // Aún así, limpiar el estado local
      setUser(null);
      setIsAuthenticated(false);
      router.push('/');
    }
  };

  // Return object: El hook devuelve un objeto con estado y funciones
  // Esto permite que los componentes accedan solo a lo que necesitan
  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuthStatus,
  };
}