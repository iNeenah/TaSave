"use client";

import { useState, useTransition, useEffect } from "react";
import { signin, signup } from "@/lib/actions/auth";
import { HackerButton, GlowCard, Badge, GlitchText } from "./ui";
import { Terminal, Shield, AlertTriangle } from "lucide-react";

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
    <GlowCard className="max-w-md w-full space-y-8 relative z-10">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          {isSignin ? (
            <Terminal className="w-12 h-12 text-[#00ff41]" />
          ) : (
            <Shield className="w-12 h-12 text-[#00ff41]" />
          )}
        </div>
        <h2 className="text-3xl font-extrabold text-[#00ff41] terminal-text mb-2">
          <GlitchText trigger="hover" intensity="low">
            {isSignin ? "Access Terminal" : "Initialize Session"}
          </GlitchText>
        </h2>
        <p className="text-sm text-gray-400">
          {isSignin ? "Enter your credentials to access the system" : "Create a new account to get started"}
        </p>
        <div className="flex justify-center mt-2">
          <Badge variant={isSignin ? "info" : "success"}>
            {isSignin ? "LOGIN MODE" : "REGISTER MODE"}
          </Badge>
        </div>
      </div>

      {errors && (
        <GlowCard glowColor="#ff6b6b" intensity="medium" className="bg-red-900/20 border-red-500/50">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
            <p className="text-red-400 text-sm">{errors}</p>
          </div>
        </GlowCard>
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
          <HackerButton
            type="submit"
            variant={isSignin ? "matrix" : "default"}
            size="lg"
            className="w-full"
            disabled={isPending}
            glitchEffect={!isPending}
          >
            {isPending ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isSignin ? "Accessing..." : "Initializing..."}
              </>
            ) : (
              <>
                {isSignin ? (
                  <Terminal className="w-4 h-4 mr-2" />
                ) : (
                  <Shield className="w-4 h-4 mr-2" />
                )}
                {isSignin ? "Access System" : "Create Account"}
              </>
            )}
          </HackerButton>
        </div>

        {onModeChange && (
          <div className="text-center">
            <HackerButton
              variant="ghost"
              onClick={() => onModeChange(isSignin ? "signup" : "signin")}
              disabled={isPending}
              className="text-sm"
            >
              {isSignin 
                ? "Initialize new session" 
                : "Access existing terminal"
              }
            </HackerButton>
          </div>
        )}
      </form>

      {/* Terminal-style info */}
      <GlowCard intensity="low" className="bg-gray-900/30">
        <div className="text-xs text-gray-400 font-mono">
          <div className="text-[#00ff41] mb-2 flex items-center">
            <Terminal className="w-3 h-3 mr-1" />
            SYSTEM REQUIREMENTS:
          </div>
          <div className="space-y-1">
            <div>• Username: minimum 3 characters</div>
            <div>• Password: minimum 6 characters</div>
            <div>• Session: 7 days validity</div>
            <div className="text-yellow-400 mt-2">• Default admin: admin / admin123</div>
          </div>
        </div>
      </GlowCard>
    </GlowCard>
  );
}