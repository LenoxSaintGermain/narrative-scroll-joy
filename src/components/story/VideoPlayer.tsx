import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Maximize, Volume2, VolumeX } from "lucide-react";

interface VideoPlayerProps {
  src: string;
  className?: string;
  visible?: boolean;
  autoPlay?: boolean;
}

export function VideoPlayer({ src, className = "", visible = false, autoPlay = false }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);

  // Auto-play/pause based on visibility
  useEffect(() => {
    if (!videoRef.current || !autoPlay) return;
    
    if (visible) {
      videoRef.current.play().catch(() => {
        // Autoplay blocked, user needs to interact
      });
    } else {
      videoRef.current.pause();
    }
  }, [visible, autoPlay]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <div 
      className={`relative ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        loop
        muted={isMuted}
        playsInline
        className="w-full h-full object-cover"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      {/* Controls overlay */}
      <div 
        className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex gap-3">
          <Button
            size="icon"
            variant="secondary"
            onClick={togglePlay}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border-0"
          >
            {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
          </Button>
          
          <Button
            size="icon"
            variant="secondary"
            onClick={toggleMute}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border-0"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
          </Button>
          
          <Button
            size="icon"
            variant="secondary"
            onClick={toggleFullscreen}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border-0"
          >
            <Maximize className="w-5 h-5 text-white" />
          </Button>
        </div>
      </div>

      {/* Persistent mute indicator when playing */}
      {isPlaying && isMuted && !showControls && (
        <button
          onClick={toggleMute}
          className="absolute bottom-4 right-4 p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors"
        >
          <VolumeX className="w-5 h-5 text-white" />
        </button>
      )}
    </div>
  );
}