import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { StoryCase } from './StoryCase';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Story {
  id: string;
  title: string;
  description: string | null;
  coverImage?: string;
  genre?: string;
}

interface StoryShelfProps {
  title: string;
  icon?: string;
  stories: Story[];
}

export const StoryShelf = ({ title, icon, stories }: StoryShelfProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 300);
    }
  };

  if (stories.length === 0) return null;

  return (
    <div className="relative py-8">
      {/* Section Title */}
      <h2 className="text-2xl font-bold text-foreground mb-6 px-8 flex items-center gap-2">
        {icon && <span>{icon}</span>}
        {title}
      </h2>

      {/* Shelf Container */}
      <div className="relative group">
        {/* Navigation Arrows */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className={cn(
              "absolute left-2 top-1/2 -translate-y-1/2 z-20",
              "w-10 h-10 rounded-full bg-background/90 shadow-lg",
              "flex items-center justify-center",
              "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
              "hover:bg-background hover:scale-110"
            )}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 z-20",
              "w-10 h-10 rounded-full bg-background/90 shadow-lg",
              "flex items-center justify-center",
              "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
              "hover:bg-background hover:scale-110"
            )}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Wooden Shelf Background */}
        <div className="relative">
          {/* Cases Row */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className={cn(
              "flex gap-6 px-8 pb-8 pt-4 overflow-x-auto scrollbar-hide",
              "scroll-smooth"
            )}
            style={{
              perspective: '1000px',
              perspectiveOrigin: 'center center',
            }}
          >
            {stories.map((story, index) => (
              <StoryCase
                key={story.id}
                id={story.id}
                title={story.title}
                description={story.description}
                coverImage={story.coverImage}
                genre={story.genre}
                index={index}
              />
            ))}
          </div>

          {/* Shelf Board */}
          <div 
            className={cn(
              "absolute bottom-0 left-0 right-0 h-4",
              "bg-gradient-to-b from-amber-900/80 to-amber-950",
              "rounded-sm shadow-lg",
              "border-t border-amber-700/50"
            )}
            style={{
              boxShadow: '0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
          />
          
          {/* Shelf Edge */}
          <div 
            className={cn(
              "absolute bottom-0 left-0 right-0 h-2",
              "bg-gradient-to-b from-amber-800 to-amber-900",
              "transform translate-y-full"
            )}
          />

          {/* Wood grain texture overlay */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-4 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `repeating-linear-gradient(
                90deg,
                transparent,
                transparent 50px,
                rgba(0,0,0,0.1) 50px,
                rgba(0,0,0,0.1) 51px
              )`,
            }}
          />
        </div>

        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
      </div>
    </div>
  );
};
