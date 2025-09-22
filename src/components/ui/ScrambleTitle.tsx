"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { createScrambleAnimation } from "@/lib/animations";

interface ScrambleTitleProps {
  text: string;
  className?: string;
  delay?: number;
}

export default function ScrambleTitle({ 
  text, 
  className = "", 
  delay = 0.5 
}: ScrambleTitleProps) {
  const titleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!titleRef.current) return;

    const tl = gsap.timeline();
    
    // Initial setup
    gsap.set(titleRef.current, { opacity: 1 });
    
    // Scramble animation
    tl.add(createScrambleAnimation(titleRef.current, text, { delay, duration: 1.5 }));
    
    // Add blinking cursor after scramble completes
    tl.call(() => {
      if (titleRef.current) {
        const cursor = document.createElement('span');
        cursor.textContent = '_';
        cursor.className = 'animate-pulse text-green-400 ml-1';
        titleRef.current.appendChild(cursor);
      }
    });

    return () => {
      tl.kill();
    };
  }, [text, delay]);

  return (
    <span 
      ref={titleRef}
      className={`inline-block ${className}`}
    >
      {text}
    </span>
  );
}