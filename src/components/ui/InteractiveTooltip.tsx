"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface InteractiveTooltipProps {
  children: React.ReactNode;
  content: {
    title: string;
    stat: string;
    icon: string;
  };
  className?: string;
}

export default function InteractiveTooltip({
  children,
  content,
  className = "",
}: InteractiveTooltipProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const tooltip = tooltipRef.current;
    
    if (!container || !tooltip) return;

    let mouseX = 0;
    let mouseY = 0;
    let tooltipX = 0;
    let tooltipY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
      gsap.to(tooltip, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: "back.out(1.7)",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(tooltip, {
        opacity: 0,
        scale: 0.8,
        duration: 0.2,
        ease: "power2.out",
        onComplete: () => setIsVisible(false),
      });
    };

    // Smooth tooltip following
    const updateTooltipPosition = () => {
      tooltipX += (mouseX - tooltipX) * 0.1;
      tooltipY += (mouseY - tooltipY) * 0.1;
      
      gsap.set(tooltip, {
        x: tooltipX + 20,
        y: tooltipY - 40,
      });
      
      if (isVisible) {
        requestAnimationFrame(updateTooltipPosition);
      }
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    if (isVisible) {
      updateTooltipPosition();
    }

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {children}
      
      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="absolute pointer-events-none z-50 opacity-0 scale-75"
        style={{ transform: "translate3d(0, 0, 0)" }}
      >
        <div className="bg-gray-900 border border-green-500 rounded-lg p-3 shadow-lg backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{content.icon}</span>
            <div>
              <div className="text-green-400 font-mono text-xs font-semibold">
                {content.title}
              </div>
              <div className="text-green-500 font-mono text-sm font-bold">
                {content.stat}
              </div>
            </div>
          </div>
          
          {/* Arrow */}
          <div className="absolute -bottom-1 left-4 w-2 h-2 bg-gray-900 border-r border-b border-green-500 transform rotate-45"></div>
        </div>
      </div>
    </div>
  );
}