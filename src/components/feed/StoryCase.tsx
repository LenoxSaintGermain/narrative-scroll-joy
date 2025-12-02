import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { EngagementButtons } from './EngagementButtons';
import { Sparkles, RefreshCw } from 'lucide-react';

interface StoryCaseProps {
  id: string;
  title: string;
  description: string | null;
  coverImage?: string;
  genre?: string;
  index: number;
}

export const StoryCase = ({ id, title, description, coverImage, genre, index }: StoryCaseProps) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cover, setCover] = useState(coverImage);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasTriedGeneration, setHasTriedGeneration] = useState(false);

  // Generate cover if missing
  useEffect(() => {
    if (!cover && !isGenerating && !hasTriedGeneration) {
      generateCover();
    }
  }, [cover, isGenerating, hasTriedGeneration]);

  const generateCover = async () => {
    setIsGenerating(true);
    setHasTriedGeneration(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-story-cover', {
        body: { narrative_id: id, title, description }
      });
      
      if (data?.coverUrl) {
        setCover(data.coverUrl);
      }
    } catch (error) {
      console.error('Failed to generate cover:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClick = () => {
    if (isFlipped) {
      navigate(`/story/${id}`);
    } else {
      setIsFlipped(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsFlipped(false);
  };

  const genreColors: Record<string, string> = {
    'sci-fi': 'bg-cyan-500',
    'fantasy': 'bg-purple-500',
    'romance': 'bg-pink-500',
    'thriller': 'bg-red-500',
    'drama': 'bg-amber-500',
    'comedy': 'bg-yellow-500',
    'general': 'bg-blue-500',
  };

  return (
    <div
      className="group relative cursor-pointer"
      style={{ 
        animationDelay: `${index * 100}ms`,
        perspective: '1000px',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* 3D Case Container */}
      <div
        className={cn(
          "relative w-40 h-56 transition-all duration-500 ease-out",
          "transform-gpu",
          isHovered && !isFlipped && "translate-x-4 -translate-y-2 rotate-y-[-15deg]",
          isFlipped && "rotate-y-180"
        )}
        style={{ 
          transformStyle: 'preserve-3d',
          transform: isFlipped 
            ? 'rotateY(180deg)' 
            : isHovered 
              ? 'translateX(16px) translateY(-8px) rotateY(-15deg)' 
              : 'rotateY(0deg)',
        }}
      >
        {/* Front - DVD Case */}
        <div
          className={cn(
            "absolute inset-0 rounded-sm overflow-hidden",
            "bg-gradient-to-br from-slate-800 to-slate-900",
            "border-l-4 border-slate-700",
            "shadow-lg transition-shadow duration-300",
            isHovered && "shadow-2xl shadow-primary/20"
          )}
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Genre tape */}
          {genre && (
            <div 
              className={cn(
                "absolute top-2 -left-1 px-2 py-0.5 text-[10px] font-bold uppercase",
                "text-white rotate-[-5deg] z-10",
                genreColors[genre] || genreColors.general
              )}
              style={{ 
                clipPath: 'polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%)',
              }}
            >
              {genre}
            </div>
          )}

          {/* Cover Image or Generating State */}
          {isGenerating ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
              <Sparkles className="w-8 h-8 text-primary animate-pulse mb-2" />
              <span className="text-xs text-muted-foreground">AI Creating...</span>
              <div className="mt-2 w-16 h-1 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary animate-[shimmer_1.5s_ease-in-out_infinite] w-1/2" />
              </div>
            </div>
          ) : cover ? (
            <img 
              src={cover} 
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800 p-4">
              <div className="text-center">
                <p className="text-sm font-medium text-white line-clamp-3">{title}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setHasTriedGeneration(false);
                  generateCover();
                }}
                className="mt-2 p-1.5 rounded-full bg-primary/20 hover:bg-primary/40 transition-colors"
              >
                <RefreshCw className="w-3 h-3 text-primary" />
              </button>
            </div>
          )}

          {/* Shine effect on hover */}
          <div 
            className={cn(
              "absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent",
              "opacity-0 transition-opacity duration-300",
              isHovered && "opacity-100"
            )}
          />

          {/* Case spine shadow */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-r from-black/50 to-transparent" />
        </div>

        {/* Back - Story Info */}
        <div
          className={cn(
            "absolute inset-0 rounded-sm overflow-hidden p-3",
            "bg-gradient-to-br from-slate-900 to-slate-950",
            "border border-slate-700",
            "flex flex-col"
          )}
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <h3 className="text-sm font-bold text-white mb-1 line-clamp-2">{title}</h3>
          <p className="text-xs text-muted-foreground line-clamp-4 flex-1">
            {description || 'A captivating story awaits...'}
          </p>
          
          <div className="mt-auto pt-2 border-t border-slate-700">
            <EngagementButtons narrativeId={id} compact />
          </div>
          
          <div className="mt-2 text-center">
            <span className="text-xs text-primary font-medium">Click to Read →</span>
          </div>
        </div>
      </div>

      {/* Shelf shadow */}
      <div 
        className={cn(
          "absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-4",
          "bg-black/30 blur-md rounded-full",
          "transition-all duration-300",
          isHovered && "w-36 bg-black/40"
        )}
      />
    </div>
  );
};
