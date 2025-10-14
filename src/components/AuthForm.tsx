"use client";

// CLIENT COMPONENT: "use client" indica que este componente se ejecuta en el navegador
import { useState, useTransition, useEffect } from "react";
// SERVER ACTIONS: Funciones que se ejecutan en el servidor pero se pueden llamar desde el cliente
import { signin, signup } from "@/lib/actions/auth";
import { HackerButton, GlowCard, Badge, GlitchText } from "./ui";
import { Terminal, Shield, AlertTriangle } from "lucide-react";

// TYPESCRIPT INTERFACE: Define la estructura de las props del componente
interface AuthFormProps {
  mode: "signin" | "signup"; // Union type: solo acepta estos dos valores
  onModeChange?: (mode: "signin" | "signup") => void; // Optional prop con callback
}

export default function AuthForm({ mode, onModeChange }: AuthFormProps) {
  // useTransition: Hook para manejar transiciones de estado sin bloquear la UI
  const [isPending, startTransition] = useTransition();

  // useState: Hook fundamental para estado local del componente
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // Estado para manejo de errores con tipo union (string o null)
  const [errors, setErrors] = useState<string | null>(null);

  // useEffect se ejecuta cuando el componente se monta (aparece en pantalla)
  useEffect(() => {
    // En Next.js, la verificación del token se hace en el servidor
    // Pero podemos agregar verificaciones adicionales del lado del cliente si es necesario
    const checkAuth = () => {
      // Aquí podríamos verificar si el usuario ya está autenticado
      console.log("Verificando estado de autenticación...");
    };

    checkAuth();
  }, []); // El array vacío significa que solo se ejecuta una vez al montar el componente

  // EVENT HANDLER: Función que maneja eventos del DOM
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // DESTRUCTURING: Extraer propiedades específicas del objeto event.target
    const { name, value } = e.target;

    // FUNCTIONAL UPDATE: Usar función en setState para evitar problemas de concurrencia
    setFormData(prev => ({
      ...prev, // SPREAD OPERATOR: Mantener propiedades existentes
      [name]: value // COMPUTED PROPERTY: Usar variable como key del objeto
    }));

    // CONDITIONAL LOGIC: Limpiar errores cuando el usuario interactúa
    if (errors) setErrors(null);
  };

  // Función que se ejecuta cuando el usuario envía el formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evitamos que la página se recargue al enviar el formulario
    setErrors(null); // Limpiamos cualquier error anterior

    // Validaciones del lado del cliente (antes de enviar al servidor)
    if (!formData.username || !formData.password) {
      setErrors("El nombre de usuario y la contraseña son obligatorios");
      return;
    }

    if (formData.username.length < 3) {
      setErrors("El nombre de usuario debe tener al menos 3 caracteres");
      return;
    }

    if (formData.password.length < 6) {
      setErrors("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      // Creamos un objeto FormData para enviar los datos al servidor
      const formDataObj = new FormData();
      formDataObj.append("username", formData.username);
      formDataObj.append("password", formData.password);

      // CONCURRENT FEATURES: startTransition marca actualizaciones como no urgentes
      startTransition(async () => {
        try {
          if (mode === "signin") {
            // SERVER ACTION: Función que se ejecuta en el servidor
            await signin(formDataObj);
            // REDIRECT: Se maneja automáticamente en el servidor
          } else {
            await signup(formDataObj);
          }
        } catch (error) {
          // TYPE NARROWING: Verificar tipo antes de acceder a propiedades
          setErrors(error instanceof Error ? error.message : "Ocurrió un error");
        }
      });
    } catch (error) {
      // Capturamos cualquier error inesperado
      setErrors(error instanceof Error ? error.message : "Ocurrió un error");
    }
  };

  // Variable para saber si estamos en modo login o registro
  const isSignin = mode === "signin";

  return (
    // GlowCard es nuestro componente personalizado que crea una tarjeta con efecto de brillo
    <GlowCard className="max-w-md w-full space-y-8 relative z-10">
      {/* Sección del encabezado con título e icono */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          {/* Mostramos diferentes iconos según el modo */}
          {isSignin ? (
            <Terminal className="w-12 h-12 text-[#00ff41]" /> // Icono de terminal para login
          ) : (
            <Shield className="w-12 h-12 text-[#00ff41]" /> // Icono de escudo para registro
          )}
        </div>
        {/* Título principal con efecto glitch */}
        <h2 className="text-3xl font-extrabold text-[#00ff41] terminal-text mb-2">
          <GlitchText trigger="hover" intensity="low">
            {isSignin ? "Acceso Terminal" : "Inicializar Sesión"}
          </GlitchText>
        </h2>

        {/* Descripción del formulario */}
        <p className="text-sm text-gray-400">
          {isSignin ? "Ingresa tus credenciales para acceder al sistema" : "Crea una nueva cuenta para comenzar"}
        </p>

        {/* Badge que muestra el modo actual */}
        <div className="flex justify-center mt-2">
          <Badge variant={isSignin ? "info" : "success"}>
            {isSignin ? "MODO LOGIN" : "MODO REGISTRO"}
          </Badge>
        </div>
      </div>

      {/* Sección de errores - solo se muestra si hay errores */}
      {errors && (
        <GlowCard glowColor="#ff6b6b" intensity="medium" className="bg-red-900/20 border-red-500/50">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
            <p className="text-red-400 text-sm">{errors}</p>
          </div>
        </GlowCard>
      )}

      {/* Formulario principal */}
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {/* Contenedor de los campos de entrada */}
        <div className="rounded-md shadow-sm -space-y-px">
          {/* Campo de nombre de usuario */}
          <div>
            <label htmlFor="username" className="sr-only">
              Nombre de usuario
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              disabled={isPending} // Se desactiva mientras se procesa el formulario
              value={formData.username}
              onChange={handleInputChange} // Se ejecuta cada vez que el usuario escribe
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-400 text-green-500 bg-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm disabled:opacity-50 transition-all duration-200"
              placeholder="Nombre de usuario"
            />
          </div>
          {/* Campo de contraseña */}
          <div>
            <label htmlFor="password" className="sr-only">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              disabled={isPending} // Se desactiva mientras se procesa el formulario
              value={formData.password}
              onChange={handleInputChange} // Se ejecuta cada vez que el usuario escribe
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-400 text-green-500 bg-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm disabled:opacity-50 transition-all duration-200"
              placeholder="Contraseña"
            />
          </div>
        </div>

        {/* Botón principal del formulario */}
        <div>
          <HackerButton
            type="submit"
            variant={isSignin ? "matrix" : "default"} // Diferentes estilos según el modo
            size="lg"
            className="w-full"
            disabled={isPending} // Se desactiva mientras se procesa
            glitchEffect={!isPending} // Efecto glitch solo cuando no está procesando
          >
            {isPending ? (
              // Contenido del botón mientras se procesa (con spinner de carga)
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isSignin ? "Accediendo..." : "Inicializando..."}
              </>
            ) : (
              // Contenido normal del botón
              <>
                {isSignin ? (
                  <Terminal className="w-4 h-4 mr-2" />
                ) : (
                  <Shield className="w-4 h-4 mr-2" />
                )}
                {isSignin ? "Acceder al Sistema" : "Crear Cuenta"}
              </>
            )}
          </HackerButton>
        </div>

        {/* Botón para cambiar entre modo login y registro (solo si se proporciona la función) */}
        {onModeChange && (
          <div className="text-center">
            <HackerButton
              variant="ghost" // Estilo fantasma (más sutil)
              onClick={() => onModeChange(isSignin ? "signup" : "signin")} // Cambia al modo opuesto
              disabled={isPending} // Se desactiva mientras se procesa
              className="text-sm"
            >
              {isSignin
                ? "Inicializar nueva sesión"
                : "Acceder a terminal existente"
              }
            </HackerButton>
          </div>
        )}
      </form>

      {/* Información del sistema en estilo terminal */}
      <GlowCard intensity="low" className="bg-gray-900/30">
        <div className="text-xs text-gray-400 font-mono">
          <div className="text-[#00ff41] mb-2 flex items-center">
            <Terminal className="w-3 h-3 mr-1" />
            REQUISITOS DEL SISTEMA:
          </div>
          <div className="space-y-1">
            <div>• Usuario: mínimo 3 caracteres</div>
            <div>• Contraseña: mínimo 6 caracteres</div>
            <div>• Sesión: validez de 7 días</div>
            <div className="text-yellow-400 mt-2">• Admin por defecto: admin / admin123</div>
          </div>
        </div>
      </GlowCard>
    </GlowCard>
  );
}