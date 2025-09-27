"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createScrollReveal, createHoverGlow } from "@/lib/animations";

interface AnimatedPageProps {
  children: React.ReactNode;
  enablePageTransition?: boolean;
}

export default function AnimatedPage({ children, enablePageTransition = true }: AnimatedPageProps) {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    gsap.registerPlugin(ScrollTrigger);

    // Setup Page Transition API if available and enabled
    if (enablePageTransition && 'startViewTransition' in document) {
      setupPageTransitions();
    }

    const ctx = gsap.context(() => {
      // Page entrance animation
      gsap.fromTo(
        pageRef.current,
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.6, 
          ease: "power2.out"
        }
      );

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

      // Auth form animations
      gsap.fromTo(
        ".auth-form",
        { opacity: 0, y: 30, scale: 0.95 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: 0.8, 
          ease: "power2.out",
          delay: 0.2
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

      // Machine details animations
      createScrollReveal(".machine-features", {
        start: "top 85%",
      });

      createScrollReveal(".reviews-grid", {
        start: "top 85%",
      });

      // Add hover glow to interactive elements
      const interactiveElements = document.querySelectorAll(
        ".feature-card, button, .nav-link, .glass-card"
      );
      
      interactiveElements.forEach((el) => {
        createHoverGlow(el);
      });

    }, pageRef);

    return () => ctx.revert();
  }, [enablePageTransition]);

  const setupPageTransitions = () => {
    // Add CSS for page transitions
    if (!document.querySelector('#page-transition-styles')) {
      const style = document.createElement('style');
      style.id = 'page-transition-styles';
      style.textContent = `
        ::view-transition-old(root) {
          animation: slide-out-left 0.3s ease-in-out;
        }
        
        ::view-transition-new(root) {
          animation: slide-in-right 0.3s ease-in-out;
        }
        
        @keyframes slide-out-left {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(-100px);
            opacity: 0;
          }
        }
        
        @keyframes slide-in-right {
          from {
            transform: translateX(100px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        /* Auth form specific transitions */
        .auth-form {
          view-transition-name: auth-form;
        }

        ::view-transition-old(auth-form) {
          animation: fade-scale-out 0.4s ease-in-out;
        }
        
        ::view-transition-new(auth-form) {
          animation: fade-scale-in 0.4s ease-in-out;
        }

        @keyframes fade-scale-out {
          from {
            transform: scale(1);
            opacity: 1;
          }
          to {
            transform: scale(0.9);
            opacity: 0;
          }
        }
        
        @keyframes fade-scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        /* Machine details transitions */
        .machine-features {
          view-transition-name: machine-features;
        }

        .reviews-grid {
          view-transition-name: reviews-grid;
        }
      `;
      document.head.appendChild(style);
    }

    // Intercept navigation for smooth transitions
    const handleNavigation = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.tagName === 'A' && target.href && !target.href.startsWith('mailto:') && !target.href.startsWith('tel:')) {
        const url = new URL(target.href);
        if (url.origin === window.location.origin) {
          e.preventDefault();
          
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if ('startViewTransition' in document && typeof (document as any).startViewTransition === 'function') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (document as any).startViewTransition(() => {
              window.location.href = target.href;
            });
          } else {
            window.location.href = target.href;
          }
        }
      }
    };

    document.addEventListener('click', handleNavigation);
    
    return () => {
      document.removeEventListener('click', handleNavigation);
    };
  };

  return (
    <div ref={pageRef} className="animated-page page-transition">
      {children}
    </div>
  );
}