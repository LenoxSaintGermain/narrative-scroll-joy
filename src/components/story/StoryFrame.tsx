import { useEffect, useRef, useState } from "react";
import { VideoPlayer } from "./VideoPlayer";

interface StoryFrameProps {
  frame: {
    id: string;
    narrative_content: string | null;
    media_url?: string;
    media_type?: string;
  };
  index: number;
}

export function StoryFrame({ frame, index }: StoryFrameProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // Observer for media visibility
    const mediaObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setVisible(entry.isIntersecting));
      },
      { threshold: 0.2 }
    );

    // Observer for text (triggers later in scroll)
    const textObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setTextVisible(entry.isIntersecting));
      },
      { threshold: 0.5 }
    );

    mediaObserver.observe(el);
    textObserver.observe(el);
    
    return () => {
      mediaObserver.disconnect();
      textObserver.disconnect();
    };
  }, []);

  const hasMedia = !!frame.media_url;
  const isVideo = frame.media_type === 'video';
  const hasText = !!frame.narrative_content;

  return (
    <section ref={sectionRef} className="relative h-[180vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Full-screen Media Background */}
        {hasMedia && (
          <div
            className={`absolute inset-0 transition-all duration-700 ease-out ${
              visible ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
          >
            {isVideo ? (
              <VideoPlayer
                src={frame.media_url!}
                className="w-full h-full"
                visible={visible}
                autoPlay
              />
            ) : (
              <img
                src={frame.media_url}
                alt={`Frame ${index + 1}`}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        )}

        {/* Gradient Overlay for Text Legibility */}
        {hasText && (
          <div 
            className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-500 ${
              textVisible ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        {/* Text Overlay */}
        {hasText && (
          <div className="absolute inset-0 flex items-end justify-center pb-20 px-6">
            <div
              className={`max-w-3xl text-center transition-all duration-700 ease-out ${
                textVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
            >
              <div className="backdrop-blur-sm bg-black/30 rounded-2xl p-8 border border-white/10">
                <p className="text-xl md:text-2xl lg:text-3xl leading-relaxed whitespace-pre-wrap text-white drop-shadow-lg">
                  {frame.narrative_content}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Fallback for text-only frames */}
        {!hasMedia && hasText && (
          <div className="absolute inset-0 flex items-center justify-center bg-background">
            <div
              className={`max-w-3xl text-center px-6 transition-all duration-700 ease-out ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <p className="text-xl md:text-2xl lg:text-3xl leading-relaxed whitespace-pre-wrap text-foreground">
                {frame.narrative_content}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}