"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import AtmosphericVideo from "@/components/ui/AtmosphericVideo";
import AnimatedPage from "@/components/AnimatedPage";

export default function AuthPageContent() {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  useEffect(() => {
    const modeParam = searchParams.get("mode");
    if (modeParam === "signup" || modeParam === "signin") {
      setMode(modeParam);
    }
  }, [searchParams]);

  const handleModeChange = (newMode: "signin" | "signup") => {
    setMode(newMode);
    
    // Actualizar la URL sin recargar la página
    const newUrl = `/auth?mode=${newMode}`;
    
    // Usar Page Transition API si está disponible (sin tipos estrictos)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ('startViewTransition' in document && typeof (document as any).startViewTransition === 'function') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (document as any).startViewTransition(() => {
        window.history.pushState({}, '', newUrl);
      });
    } else {
      window.history.pushState({}, '', newUrl);
    }
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <AtmosphericVideo src="/videos/1.mp4" />
        
        {/* Terminal-style background grid */}
        <div className="absolute inset-0 bg-black/50">
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 via-transparent to-green-900/10"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 65, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 65, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}></div>
        </div>

        <div className="auth-form relative z-10">
          <AuthForm mode={mode} onModeChange={handleModeChange} />
        </div>

        {/* Terminal-style decorations */}
        <div className="absolute top-4 left-4 text-green-500/30 font-mono text-xs">
          <div>SYSTEM: TaSave Authentication Terminal</div>
          <div>STATUS: {mode === "signin" ? "LOGIN_MODE" : "REGISTER_MODE"}</div>
          <div>SECURITY: ENCRYPTED</div>
        </div>

        <div className="absolute bottom-4 right-4 text-green-500/30 font-mono text-xs">
          <div>CONNECTION: SECURE</div>
          <div>PROTOCOL: HTTPS</div>
          <div>SESSION: ACTIVE</div>
        </div>

        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-green-500/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>
    </AnimatedPage>
  );
}