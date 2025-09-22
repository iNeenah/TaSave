interface BackgroundVideoProps {
  src: string;
  opacity?: number;
  overlay?: boolean;
  className?: string;
}

export default function BackgroundVideo({ 
  src, 
  opacity = 0.1, 
  overlay = true,
  className = "" 
}: BackgroundVideoProps) {
  return (
    <div className={`absolute inset-0 z-0 ${className}`}>
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
        style={{ opacity }}
      >
        <source src={src} type="video/mp4" />
      </video>
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30" />
      )}
    </div>
  );
}