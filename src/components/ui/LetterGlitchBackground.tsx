"use client";

import { useRef, useEffect } from 'react';

interface LetterGlitchBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
  blur?: boolean;
}

const LetterGlitchBackground = ({
  intensity = 'low',
  blur = true
}: LetterGlitchBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const letters = useRef<
    {
      char: string;
      x: number;
      y: number;
      opacity: number;
      targetOpacity: number;
      speed: number;
    }[]
  >([]);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const lastUpdateTime = useRef(Date.now());

  // Green color palette
  const glitchColors = ['#00ff41', '#008f11', '#004400', '#00cc33', '#00aa22'];
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  const lettersAndSymbols = Array.from(characters);

  // Intensity settings
  const intensitySettings = {
    low: { letterCount: 50, updateSpeed: 150, fontSize: 14 },
    medium: { letterCount: 100, updateSpeed: 100, fontSize: 16 },
    high: { letterCount: 150, updateSpeed: 80, fontSize: 18 }
  };

  const settings = intensitySettings[intensity];

  const getRandomChar = () => {
    return lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)];
  };

  const getRandomColor = () => {
    return glitchColors[Math.floor(Math.random() * glitchColors.length)];
  };

  const initializeLetters = (width: number, height: number) => {
    letters.current = Array.from({ length: settings.letterCount }, () => ({
      char: getRandomChar(),
      x: Math.random() * width,
      y: Math.random() * height,
      opacity: Math.random() * 0.5 + 0.2, // Increased opacity for better visibility
      targetOpacity: Math.random() * 0.5 + 0.2,
      speed: Math.random() * 0.02 + 0.01
    }));
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = parent.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    if (context.current) {
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.current.font = `${settings.fontSize}px monospace`;
      context.current.textBaseline = 'top';
    }

    initializeLetters(rect.width, rect.height);
  };

  const drawLetters = () => {
    if (!context.current || letters.current.length === 0) return;
    const ctx = context.current;
    const { width, height } = canvasRef.current!.getBoundingClientRect();
    
    ctx.clearRect(0, 0, width, height);

    letters.current.forEach((letter) => {
      // Smooth opacity transition
      if (Math.abs(letter.opacity - letter.targetOpacity) > 0.01) {
        letter.opacity += (letter.targetOpacity - letter.opacity) * letter.speed;
      } else {
        letter.targetOpacity = Math.random() * 0.5 + 0.2;
      }

      const color = getRandomColor();
      ctx.fillStyle = `${color}${Math.floor(letter.opacity * 255).toString(16).padStart(2, '0')}`;
      ctx.fillText(letter.char, letter.x, letter.y);
    });
  };

  const updateLetters = () => {
    const now = Date.now();
    if (now - lastUpdateTime.current < settings.updateSpeed) return;

    // Update only a few letters at a time for better performance
    const updateCount = Math.max(1, Math.floor(letters.current.length * 0.1));
    
    for (let i = 0; i < updateCount; i++) {
      const index = Math.floor(Math.random() * letters.current.length);
      if (letters.current[index]) {
        letters.current[index].char = getRandomChar();
        
        // Occasionally move letters slightly
        if (Math.random() < 0.1) {
          const canvas = canvasRef.current;
          if (canvas) {
            const rect = canvas.getBoundingClientRect();
            letters.current[index].x = Math.random() * rect.width;
            letters.current[index].y = Math.random() * rect.height;
          }
        }
      }
    }

    lastUpdateTime.current = now;
  };

  const animate = () => {
    updateLetters();
    drawLetters();
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    context.current = canvas.getContext('2d');
    resizeCanvas();
    animate();

    let resizeTimeout: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        resizeCanvas();
        animate();
      }, 100);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [intensity, settings.letterCount, settings.updateSpeed, settings.fontSize, animate, resizeCanvas]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <canvas 
        ref={canvasRef} 
        className={`block w-full h-full ${blur ? 'blur-[1px]' : ''}`}
        style={{ opacity: 0.6 }}
      />
      {/* Additional blur overlay for depth */}
      {blur && (
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[0.5px]"></div>
      )}
    </div>
  );
};

export default LetterGlitchBackground;