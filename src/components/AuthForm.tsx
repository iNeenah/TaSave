"use client";

import { useState, useTransition, useEffect } from "react";
import { signin, signup } from "@/lib/actions/auth";
import Button from "./ui/Button";

interface AuthFormProps {
  mode: "signin" | "signup";
  onModeChange?: (mode: "signin" | "signup") => void;
}

export default function AuthForm({ mode, onModeChange }: AuthFormProps) {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<string | null>(null);

  // Simular localStorage check (en Next.js usamos cookies, pero mantenemos la lógica)
  useEffect(() => {
    // En Next.js, la verificación del token se hace server-side
    // Pero podemos agregar lógica client-side si es necesario
    const checkAuth = () => {
      // Aquí podrías hacer verificaciones adicionales del lado del cliente
      console.log("Checking authentication status...");
    };

    checkAuth();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar errores cuando el usuario empiece a escribir
    if (errors) setErrors(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null);

    // Validaciones del lado del cliente
    if (!formData.username || !formData.password) {
      setErrors("Username and password are required");
      return;
    }

    if (formData.username.length < 3) {
      setErrors("Username must be at least 3 characters long");
      return;
    }

    if (formData.password.length < 6) {
      setErrors("Password must be at least 6 characters long");
      return;
    }

    try {
      const formDataObj = new FormData();
      formDataObj.append("username", formData.username);
      formDataObj.append("password", formData.password);

      startTransition(async () => {
        try {
          if (mode === "signin") {
            await signin(formDataObj);
            // Si llegamos aquí, el login fue exitoso
            // El redirect se maneja en la server action
          } else {
            await signup(formDataObj);
            // Si llegamos aquí, el registro fue exitoso
            // El redirect se maneja en la server action
          }
        } catch (error) {
          setErrors(error instanceof Error ? error.message : "An error occurred");
        }
      });
    } catch (error) {
      setErrors(error instanceof Error ? error.message : "An error occurred");
    }
  };

  const isSignin = mode === "signin";

  return (
    <div className="max-w-md w-full space-y-8 relative z-10">
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-extrabold text-green-500 terminal-text">
          {isSignin ? "&gt; Access Terminal" : "&gt; Initialize Session"}
        </h2>
        <p className="mt-2 text-sm text-gray-400">
          {isSignin ? "Enter your credentials to access the system" : "Create a new account to get started"}
        </p>
      </div>

      {errors && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-red-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-400 text-sm">{errors}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <label htmlFor="username" className="sr-only">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              disabled={isPending}
              value={formData.username}
              onChange={handleInputChange}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-400 text-green-500 bg-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm disabled:opacity-50 transition-all duration-200"
              placeholder="Username"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              disabled={isPending}
              value={formData.password}
              onChange={handleInputChange}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-400 text-green-500 bg-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm disabled:opacity-50 transition-all duration-200"
              placeholder="Password"
            />
          </div>
        </div>

        <div>
          <Button
            type="submit"
            size="lg"
            className="group relative w-full flex justify-center"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isSignin ? "Signing in..." : "Creating account..."}
              </>
            ) : (
              isSignin ? "&gt; Sign in" : "&gt; Create Account"
            )}
          </Button>
        </div>

        {onModeChange && (
          <div className="text-center">
            <button
              type="button"
              onClick={() => onModeChange(isSignin ? "signup" : "signin")}
              className="text-sm text-gray-400 hover:text-green-400 transition-colors duration-200"
              disabled={isPending}
            >
              {isSignin 
                ? "Don't have an account? Initialize new session" 
                : "Already have an account? Access existing terminal"
              }
            </button>
          </div>
        )}
      </form>

      {/* Terminal-style info */}
      <div className="mt-6 p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
        <div className="text-xs text-gray-500 font-mono">
          <div className="text-green-400 mb-1">SYSTEM INFO:</div>
          <div>• Username: min 3 characters</div>
          <div>• Password: min 6 characters</div>
          <div>• Session: 7 days validity</div>
        </div>
      </div>
    </div>
  );
}