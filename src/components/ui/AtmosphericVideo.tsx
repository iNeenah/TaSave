"use client";

import { useEffect, useRef } from "react";

interface AtmosphericVideoProps {
  src: string;
  className?: string;
}

export default function AtmosphericVideo({ src, className = "" }: AtmosphericVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Ensure video plays on mobile devices
    const playVideo = async () => {
      try {
        await video.play();
      } catch (error) {
        console.log("Atmospheric video autoplay failed:", error);
        // Hide video if it fails to play
        video.style.display = 'none';
      }
    };

    // Handle video error
    const handleVideoError = () => {
      console.log("Atmospheric video failed to load");
      video.style.display = 'none';
    };

    video.addEventListener('error', handleVideoError);
    video.addEventListener('loadeddata', playVideo);

    return () => {
      video.removeEventListener('error', handleVideoError);
      video.removeEventListener('loadeddata', playVideo);
      if (video) {
        video.pause();
      }
    };
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Video Background - Hidden by default, shown if loads successfully */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          filter: "blur(5px)",
          zIndex: -2,
          display: 'none' // Hidden by default
        }}
        onLoadedData={() => {
          if (videoRef.current) {
            videoRef.current.style.display = 'block';
          }
        }}
        onError={() => {
          if (videoRef.current) {
            videoRef.current.style.display = 'none';
          }
        }}
      >
        <source src={src} type="video/mp4" />
      </video>
      
      {/* Dark Overlay for Legibility */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          zIndex: -1
        }}
      />
    </div>
  );
}