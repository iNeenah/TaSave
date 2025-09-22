"use client";

import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    gsap.registerPlugin(TextPlugin);

    const tl = gsap.timeline({
      onComplete: () => {
        setIsLoading(false);
      },
    });

    // Add scramble effect to preloader title
    const scrambleChars = "!<>-_\\/[]{}—=+*^?#________";
    const finalText = "TaSave";
    
    tl.to({}, {
      duration: 1,
      ease: "none",
      onUpdate: function() {
        const titleEl = document.querySelector('.preloader-title');
        if (titleEl) {
          let scrambledText = "";
          const progress = this.progress();
          
          for (let i = 0; i < finalText.length; i++) {
            if (progress > i / finalText.length) {
              scrambledText += finalText[i];
            } else {
              scrambledText += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
            }
          }
          
          titleEl.textContent = scrambledText;
        }
      },
      onComplete: () => {
        const titleEl = document.querySelector('.preloader-title');
        if (titleEl) titleEl.textContent = finalText;
      }
    });

    // Terminal boot sequence
    tl.to(".boot-text", {
      duration: 0.05,
      text: "Initializing TaSave...",
      ease: "none",
    }, "-=0.5")
      .to(".progress-bar", {
        duration: 1.5,
        width: "100%",
        ease: "power2.out",
      }, "-=0.5")
      .to(".boot-text", {
        duration: 0.05,
        text: "Loading security modules...",
        ease: "none",
      }, "-=1")
      .to(".boot-text", {
        duration: 0.05,
        text: "Docker containers ready...",
        ease: "none",
      }, "-=0.5")
      .to(".boot-text", {
        duration: 0.05,
        text: "System online. Welcome to TaSave_",
        ease: "none",
      }, "-=0.2")
      .to(".preloader", {
        duration: 0.8,
        opacity: 0,
        ease: "power2.out",
        delay: 0.5,
      });

    return () => {
      tl.kill();
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="preloader fixed inset-0 z-50 bg-black flex items-center justify-center">
      <div className="text-center">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="preloader-title text-4xl font-bold text-green-500 font-mono mb-2">
            TaSave
          </h1>
          <div className="text-green-400 text-sm font-mono">
            <span className="animate-pulse">_</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-1 bg-gray-800 rounded-full mb-4 overflow-hidden">
          <div className="progress-bar h-full bg-green-500 rounded-full w-0"></div>
        </div>

        {/* Boot Text */}
        <div className="boot-text text-green-400 font-mono text-sm h-6">
          Initializing...
        </div>

        {/* Matrix-like background effect */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="matrix-rain"></div>
        </div>
      </div>
    </div>
  );
}