"use client";

import { useEffect, useState } from "react";

interface TerminalEffectProps {
  text: string;
  speed?: number;
  className?: string;
}

export default function TerminalEffect({ text, speed = 50, className = "" }: TerminalEffectProps) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <span className={`font-mono ${className}`}>
      {displayText}
      <span className="animate-pulse">_</span>
    </span>
  );
}