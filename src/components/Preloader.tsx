"use client";

import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const preloaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(TextPlugin);
    
    const preloader = preloaderRef.current;
    if (!preloader) return;

    // Create timeline for preloader animation
    const tl = gsap.timeline({
      onComplete: () => {
        setIsLoading(false);
      }
    });

    // Animate the preloader
    tl.to(".preloader-title", {
      duration: 0.5,
      opacity: 1,
      scale: 1,
      ease: "back.out(1.7)"
    })
    .to(".preloader-text", {
      duration: 0.3,
      opacity: 1,
      y: 0,
      ease: "power2.out"
    }, "-=0.2")
    .to(".progress-bar", {
      duration: 1.5,
      width: "100%",
      ease: "power2.out"
    }, "-=0.1")
    .to(".preloader-text", {
      duration: 0.05,
      text: "System ready...",
      ease: "none"
    }, "-=0.5")
    .to(preloader, {
      duration: 0.8,
      opacity: 0,
      ease: "power2.out",
      delay: 0.3
    });

    return () => {
      tl.kill();
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div 
      ref={preloaderRef}
      className="preloader fixed inset-0 bg-black flex items-center justify-center"
      style={{ zIndex: 9999 }}
    >
      <div className="text-center">
        <h1 className="preloader-title text-5xl font-bold text-green-500 font-mono mb-6 terminal-text opacity-0 scale-75">
          TaSave
        </h1>
        
        <div className="preloader-text text-green-400 text-lg font-mono mb-6 opacity-0 translate-y-4">
          Initializing system...
        </div>
        
        {/* Progress bar */}
        <div className="w-80 h-2 bg-gray-800 rounded-full overflow-hidden mb-4">
          <div className="progress-bar h-full bg-green-500 rounded-full w-0 shadow-lg shadow-green-500/50"></div>
        </div>
        
        {/* Matrix-like effect */}
        <div className="text-green-500 font-mono text-xs opacity-30">
          [████████████████████████████████] 100%
        </div>
      </div>
    </div>
  );
}