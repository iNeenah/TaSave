"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "./ui/Button";

interface User {
  id: number;
  username: string;
}

export default function ClientNavigation() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      setUser(null);
      
      // Usar Page Transition API si está disponible
      if ('startViewTransition' in document) {
        (document as any).startViewTransition(() => {
          router.push('/');
        });
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      setUser(null);
      router.push('/');
    }
  };

  const handleNavigation = (href: string) => {
    if ('startViewTransition' in document) {
      (document as any).startViewTransition(() => {
        router.push(href);
      });
    } else {
      router.push(href);
    }
  };

  if (isLoading) {
    return (
      <nav className="bg-black border-b border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-green-500 terminal-text">
                TaSave
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="animate-pulse bg-gray-700 h-8 w-16 rounded"></div>
              <div className="animate-pulse bg-gray-700 h-8 w-16 rounded"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-black border-b border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={() => handleNavigation('/')}
              className="text-2xl font-bold text-green-500 terminal-text hover:text-green-400 transition-colors"
            >
              TaSave
            </button>
            {user && (
              <div className="ml-10 flex items-baseline space-x-4">
                <button
                  onClick={() => handleNavigation('/dashboard')}
                  className="nav-link text-green-500 hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-800"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => handleNavigation('/favorites')}
                  className="nav-link text-green-500 hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-800"
                >
                  Favorites
                </button>
                <button
                  onClick={() => handleNavigation('/todos')}
                  className="nav-link text-green-500 hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-800"
                >
                  Todo List
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-green-500">
                  Welcome, <span className="text-green-400">{user.username}</span>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="hover:bg-red-900/20 hover:text-red-400 transition-colors"
                >
                  &gt; Logout
                </Button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNavigation('/signin')}
                  className="text-green-500 hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-800"
                >
                  Sign in
                </button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleNavigation('/signup')}
                >
                  Sign up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}