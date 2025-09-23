"use client";

import { useEffect, useRef, useState } from "react";

interface LazyVideoProps {
  src: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  onEnded?: () => void;
  style?: React.CSSProperties;
}

export default function LazyVideo({
  src,
  className = "",
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  onEnded,
  style,
}: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Intersection Observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(video);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isInView) return;

    const handleLoadedData = () => {
      setIsLoaded(true);
      if (autoPlay) {
        video.play().catch(console.error);
      }
    };

    const handleEnded = () => {
      if (onEnded) {
        onEnded();
      }
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('ended', handleEnded);

    // Start loading the video
    video.load();

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('ended', handleEnded);
    };
  }, [isInView, autoPlay, onEnded]);

  return (
    <video
      ref={videoRef}
      className={`multimedia-transition ${className} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      autoPlay={false} // Controlled manually
      loop={loop}
      muted={muted}
      playsInline={playsInline}
      style={style}
    >
      {isInView && <source src={src} type="video/mp4" />}
    </video>
  );
}