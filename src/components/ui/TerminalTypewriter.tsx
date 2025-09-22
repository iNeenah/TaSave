"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";

export default function TerminalTypewriter() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!terminalRef.current || !contentRef.current) return;

    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger, TextPlugin);

    // Clear initial content
    contentRef.current.textContent = "";

    // Create master timeline with infinite loop
    const masterTimeline = gsap.timeline({
      paused: true,
      repeat: -1,        // Bucle infinito
      repeatDelay: 15    // Pausa de 15 segundos entre ciclos
    });

    let currentText = "";

    // Función para agregar línea con efecto typewriter y velocidades variables
    const addTypingLine = (text: string, pauseAfter: number, speed: number = 0.05, isWarning: boolean = false) => {
      const newText = currentText + text + "\n";

      masterTimeline
        .to(contentRef.current, {
          duration: text.length * speed,
          text: {
            value: newText,
            delimiter: ""
          },
          ease: "none",
          onComplete: () => {
            // Agregar clases especiales para texto de advertencia
            if (isWarning && contentRef.current) {
              const lines = contentRef.current.textContent?.split('\n') || [];
              const lastLineIndex = lines.length - 2; // -2 porque la última línea está vacía
              if (lastLineIndex >= 0) {
                const spans = contentRef.current.querySelectorAll('span');
                if (spans.length > 0) {
                  spans[spans.length - 1].classList.add('terminal-warning');
                }
              }
            }
          }
        })
        .to({}, { duration: pauseAfter });

      currentText = newText;
    };

    // FASE 1: Ejecución del Exploit
    addTypingLine("> python3 db_extractor.py --target sv_tasave.local", 0.5, 0.04);
    addTypingLine("> Searching for vulnerabilities...", 1.0, 0.05);
    addTypingLine("> SQL Injection vulnerability found in 'login' portal.", 0.5, 0.05);
    addTypingLine("> Bypassing authentication... Access Granted.", 1.5, 0.06); // Más lento para dramatismo

    // FASE 2: Exfiltración de Datos (Mensaje Personalizado)
    addTypingLine("> WARNING: Database compromised. Extracting table 'users'...", 0.5, 0.07, true); // Más lento para dramatismo + warning
    addTypingLine("> [####################] 100% Complete.", 1.0, 0.04);
    addTypingLine("> Data extraction authorized by: Mauricio Duarte", 0.5, 0.05);
    addTypingLine("> Origin IP trace: Posadas, Misiones.", 2.0, 0.05);

    // FASE 3: Limpieza y Reinicio del Bucle
    addTypingLine("> Covering tracks... deleting logs...", 1.0, 0.05);

    // Agregar cursor parpadeante durante la secuencia
    masterTimeline.call(() => {
      if (contentRef.current) {
        const cursor = document.createElement('span');
        cursor.textContent = '_';
        cursor.className = 'terminal-cursor-loop text-green-400';
        contentRef.current.appendChild(cursor);
      }
    });

    // Pausa antes de limpiar (para que el usuario vea el resultado final)
    masterTimeline.to({}, { duration: 3 });

    // CRÍTICO: Limpieza de pantalla antes del repeatDelay
    masterTimeline.call(() => {
      if (contentRef.current) {
        // Efecto de "limpieza" gradual
        gsap.to(contentRef.current, {
          duration: 0.5,
          opacity: 0,
          onComplete: () => {
            if (contentRef.current) {
              // Limpiar todo el contenido para el siguiente ciclo
              contentRef.current.textContent = "";
              currentText = ""; // Reset del texto acumulado
              // Restaurar opacidad para el siguiente ciclo
              gsap.set(contentRef.current, { opacity: 1 });
            }
          }
        });
      }
    });

    // ScrollTrigger para activar cuando la terminal sea visible (sin once: true)
    ScrollTrigger.create({
      trigger: terminalRef.current,
      start: "top 80%",
      onEnter: () => {
        masterTimeline.play();
      }
      // Removido once: true para permitir el bucle continuo
    });

    return () => {
      masterTimeline.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={terminalRef} className="bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-lg p-8 shadow-2xl terminal-hacker">
      <div className="flex items-center mb-4">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="ml-4 text-gray-400 text-sm">terminal - hacking simulation</div>
      </div>

      <div
        ref={contentRef}
        className="text-sm font-mono text-green-500 whitespace-pre-line min-h-[200px] terminal-typewriter"
      >
        {/* Content will be typed here dynamically in infinite loop */}
      </div>
    </div>
  );
}