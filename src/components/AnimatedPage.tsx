"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createScrollReveal, createHoverGlow } from "@/lib/animations";

interface AnimatedPageProps {
  children: React.ReactNode;
}

export default function AnimatedPage({ children }: AnimatedPageProps) {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Hero section animations (excluding title which has its own scramble animation)
      gsap.fromTo(
        ".hero-subtitle",
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          ease: "power2.out",
          delay: 2.2 // After scramble animation completes
        }
      );

      gsap.fromTo(
        ".hero-description",
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.6, 
          ease: "power2.out",
          delay: 2.5 
        }
      );

      gsap.fromTo(
        ".hero-buttons",
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.6, 
          ease: "power2.out",
          delay: 2.8 
        }
      );

      // Features section scroll reveal
      createScrollReveal(".features-title", {
        start: "top 85%",
      });

      createScrollReveal(".features-subtitle", {
        start: "top 85%",
      });

      // Feature cards with enhanced stagger animation
      ScrollTrigger.create({
        trigger: ".features-container",
        start: "top 80%",
        onEnter: () => {
          gsap.fromTo(
            ".feature-card",
            { 
              opacity: 0, 
              y: 30,
              scale: 0.95
            },
            { 
              opacity: 1, 
              y: 0,
              scale: 1,
              duration: 0.6,
              stagger: 0.2, // Increased stagger as requested
              ease: "power2.out"
            }
          );
        },
        once: true,
      });

      // Add hover glow to interactive elements
      const interactiveElements = document.querySelectorAll(
        ".feature-card, button, .nav-link"
      );
      
      interactiveElements.forEach((el) => {
        createHoverGlow(el);
      });

    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="animated-page">
      {children}
    </div>
  );
}