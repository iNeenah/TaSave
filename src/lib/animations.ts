// GSAP: GreenSock Animation Platform - librería profesional para animaciones web
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";

// SSR SAFETY: Verificar que estamos en el cliente antes de registrar plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, TextPlugin);
}

// CONFIGURATION OBJECT: Centralizar configuraciones para consistencia
export const ANIMATION_CONFIG = {
  duration: {
    fast: 0.3,
    normal: 0.6,
    slow: 1.2,
  },
  ease: {
    smooth: "power2.out",
    bounce: "back.out(1.7)",
    elastic: "elastic.out(1, 0.3)",
  },
  stagger: {
    cards: 0.15,
    text: 0.05,
  },
};

// FACTORY FUNCTION: Función que crea y retorna animaciones configurables
export const createRevealAnimation = (
  element: string | Element, // UNION TYPE: Acepta selector CSS o elemento DOM
  options: {
    delay?: number;
    duration?: number;
    y?: number;
    stagger?: number;
  } = {} // DEFAULT PARAMETER: Objeto vacío si no se pasan opciones
) => {
  // DESTRUCTURING WITH DEFAULTS: Extraer valores con fallbacks
  const {
    delay = 0,
    duration = ANIMATION_CONFIG.duration.normal,
    y = 30,
    stagger = 0,
  } = options;

  // GSAP TWEEN: fromTo define estados inicial y final de la animación
  return gsap.fromTo(
    element,
    {
      // INITIAL STATE: Propiedades CSS del estado inicial
      opacity: 0,
      y: y,
    },
    {
      // FINAL STATE: Propiedades CSS del estado final
      opacity: 1,
      y: 0,
      duration,
      delay,
      stagger, // STAGGER: Retraso entre elementos múltiples
      ease: ANIMATION_CONFIG.ease.smooth,
    }
  );
};

// Animación activada por scroll
export const createScrollReveal = (
  element: string | Element,
  options: {
    trigger?: string | Element;
    start?: string;
    end?: string;
    stagger?: number;
    y?: number;
  } = {}
) => {
  const {
    trigger = element,
    start = "top 80%",
    end = "bottom 20%",
    stagger = 0,
    y = 30,
  } = options;

  return gsap.fromTo(
    element,
    {
      opacity: 0,
      y: y,
    },
    {
      opacity: 1,
      y: 0,
      duration: ANIMATION_CONFIG.duration.normal,
      stagger,
      ease: ANIMATION_CONFIG.ease.smooth,
      scrollTrigger: {
        trigger,
        start,
        end,
        toggleActions: "play none none reverse",
      },
    }
  );
};

// HIGHER-ORDER FUNCTION: Función que retorna funciones de cleanup
export const createHoverGlow = (element: string | Element) => {
  // TYPE GUARD: Verificar tipo y convertir selector a elemento
  const el = typeof element === "string" ? document.querySelector(element) : element;
  if (!el) return; // EARLY RETURN: Salir si no se encuentra el elemento

  // CLOSURE: Función que mantiene acceso al scope externo
  const handleMouseEnter = () => {
    gsap.to(el, {
      boxShadow: "0 0 20px rgba(0, 255, 65, 0.3), 0 0 40px rgba(0, 255, 65, 0.1)",
      borderColor: "#00ff41",
      duration: ANIMATION_CONFIG.duration.fast,
      ease: ANIMATION_CONFIG.ease.smooth,
    });
  };

  const handleMouseLeave = () => {
    gsap.to(el, {
      boxShadow: "none",
      borderColor: "#374151", // gray-700
      duration: ANIMATION_CONFIG.duration.fast,
      ease: ANIMATION_CONFIG.ease.smooth,
    });
  };

  // EVENT LISTENERS: Registrar manejadores de eventos
  el.addEventListener("mouseenter", handleMouseEnter);
  el.addEventListener("mouseleave", handleMouseLeave);

  // CLEANUP FUNCTION: Retornar función para remover listeners (evitar memory leaks)
  return () => {
    el.removeEventListener("mouseenter", handleMouseEnter);
    el.removeEventListener("mouseleave", handleMouseLeave);
  };
};

// Animación de texto scramble (efecto hacker)
export const createScrambleAnimation = (
  element: string | Element,
  finalText: string,
  options: {
    duration?: number;
    delay?: number;
    chars?: string;
  } = {}
) => {
  const { duration = 1.5, delay = 0, chars = "!<>-_\\/[]{}—=+*^?#________" } = options;
  
  const el = typeof element === "string" ? document.querySelector(element) : element;
  if (!el) return gsap.timeline();

  const originalText = finalText;
  const textLength = originalText.length;
  
  const tl = gsap.timeline({ delay });
  
  // Scramble phase
  tl.to({}, {
    duration: duration * 0.7,
    ease: "none",
    onUpdate: function() {
      let scrambledText = "";
      const progress = this.progress();
      
      for (let i = 0; i < textLength; i++) {
        if (progress > i / textLength) {
          scrambledText += originalText[i];
        } else {
          scrambledText += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      
      el.textContent = scrambledText;
    }
  });
  
  // Final reveal
  tl.set(el, { textContent: originalText });
  
  return tl;
};

// Animación de máquina de escribir para terminal
export const createTypewriterAnimation = (
  element: string | Element,
  lines: string[],
  options: {
    speed?: number;
    delay?: number;
    pauseBetweenLines?: number;
  } = {}
) => {
  const { speed = 0.05, delay = 0, pauseBetweenLines = 0.5 } = options;
  
  const el = typeof element === "string" ? document.querySelector(element) : element;
  if (!el) return gsap.timeline();

  const tl = gsap.timeline({ delay });
  
  lines.forEach((line, index) => {
    // Add pause between lines (except for first line)
    if (index > 0) {
      tl.to({}, { duration: pauseBetweenLines });
    }
    
    // Type each character
    tl.to(el, {
      duration: line.length * speed,
      text: {
        value: (el.textContent || "") + line + "\n",
        delimiter: "",
      },
      ease: "none",
    });
  });
  
  // Add blinking cursor at the end
  tl.call(() => {
    const cursor = document.createElement('span');
    cursor.textContent = '_';
    cursor.className = 'animate-pulse';
    el.appendChild(cursor);
  });
  
  return tl;
};

// Typing animation
export const createTypingAnimation = (
  element: string | Element,
  text: string,
  options: {
    duration?: number;
    delay?: number;
    cursor?: boolean;
  } = {}
) => {
  const { duration = 2, delay = 0, cursor = true } = options;

  const tl = gsap.timeline({ delay });
  
  tl.to(element, {
    duration,
    text: {
      value: text,
      delimiter: "",
    },
    ease: "none",
  });

  if (cursor) {
    tl.to(element, {
      duration: 0.5,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
      onComplete: () => {
        // Add blinking cursor
        const el = typeof element === "string" ? document.querySelector(element) : element;
        if (el) {
          el.innerHTML += '<span class="animate-pulse">_</span>';
        }
      },
    });
  }

  return tl;
};