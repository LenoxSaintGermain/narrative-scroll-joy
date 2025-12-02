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

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setVisible(entry.isIntersecting));
      },
      { threshold: 0.35 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const hasMedia = !!frame.media_url;
  const isVideo = frame.media_type === 'video';

  return (
    <section ref={sectionRef} className="relative h-[180vh]">
      <div className="sticky top-0 grid h-screen place-items-center">
        <div className="container">
          <div className={`grid items-center gap-10 ${hasMedia ? 'md:grid-cols-2' : ''}`}>
            {/* Media Panel */}
            {hasMedia && (
              <div
                className={`transition-all duration-700 ease-out ${
                  visible
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-95 translate-y-8"
                }`}
              >
                {isVideo ? (
                  <VideoPlayer
                    src={frame.media_url!}
                    className="rounded-2xl overflow-hidden shadow-2xl"
                  />
                ) : (
                  <img
                    src={frame.media_url}
                    alt={`Frame ${index + 1}`}
                    className="w-full rounded-2xl object-cover shadow-2xl"
                  />
                )}
              </div>
            )}

            {/* Narrative Panel */}
            <div
              className={`${!hasMedia ? 'max-w-3xl mx-auto text-center' : 'max-w-xl'} transition-all duration-700 ease-out delay-100 ${
                visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <p className="text-xl md:text-2xl leading-relaxed whitespace-pre-wrap text-foreground/90">
                {frame.narrative_content || ''}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
