import { cn } from '@/lib/utils';
import { useStoryEngagement } from '@/hooks/useStoryEngagement';
import { BookMarked, HandMetal, Eye } from 'lucide-react';
import { useState } from 'react';

interface EngagementButtonsProps {
  narrativeId: string;
  compact?: boolean;
}

export const EngagementButtons = ({ narrativeId, compact = false }: EngagementButtonsProps) => {
  const { counts, userEngagements, toggleEngagement, isLoading } = useStoryEngagement(narrativeId);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleOvation = async () => {
    if (!userEngagements.has('ovation')) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1000);
    }
    await toggleEngagement('ovation');
  };

  if (isLoading) {
    return (
      <div className={cn("flex gap-2", compact ? "justify-center" : "justify-start")}>
        <div className="w-12 h-6 bg-muted/50 animate-pulse rounded" />
        <div className="w-12 h-6 bg-muted/50 animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className={cn(
      "flex items-center gap-2",
      compact ? "justify-center" : "justify-start"
    )}>
      {/* Shelve It Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleEngagement('shelve');
        }}
        className={cn(
          "group/btn flex items-center gap-1 px-2 py-1 rounded-full",
          "transition-all duration-200",
          "hover:bg-primary/10",
          userEngagements.has('shelve') 
            ? "bg-primary/20 text-primary" 
            : "bg-muted/30 text-muted-foreground"
        )}
      >
        <BookMarked 
          className={cn(
            "transition-transform duration-200",
            compact ? "w-3 h-3" : "w-4 h-4",
            userEngagements.has('shelve') && "fill-primary",
            "group-hover/btn:scale-110"
          )} 
        />
        <span className={cn("font-medium", compact ? "text-[10px]" : "text-xs")}>
          {counts.shelves}
        </span>
      </button>

      {/* Standing Ovation Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleOvation();
        }}
        className={cn(
          "group/btn relative flex items-center gap-1 px-2 py-1 rounded-full",
          "transition-all duration-200",
          "hover:bg-amber-500/10",
          userEngagements.has('ovation') 
            ? "bg-amber-500/20 text-amber-500" 
            : "bg-muted/30 text-muted-foreground"
        )}
      >
        <HandMetal 
          className={cn(
            "transition-all duration-200",
            compact ? "w-3 h-3" : "w-4 h-4",
            userEngagements.has('ovation') && "fill-amber-500",
            "group-hover/btn:scale-110 group-hover/btn:rotate-12"
          )} 
        />
        <span className={cn("font-medium", compact ? "text-[10px]" : "text-xs")}>
          {counts.ovations}
        </span>

        {/* Confetti effect */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <span
                key={i}
                className="absolute w-1 h-1 rounded-full animate-confetti"
                style={{
                  left: '50%',
                  top: '50%',
                  backgroundColor: ['#fbbf24', '#f59e0b', '#d97706', '#92400e'][i % 4],
                  animationDelay: `${i * 50}ms`,
                  '--tx': `${(Math.random() - 0.5) * 40}px`,
                  '--ty': `${-Math.random() * 30 - 10}px`,
                } as React.CSSProperties}
              />
            ))}
          </div>
        )}
      </button>

      {/* View count (display only) */}
      {!compact && (
        <div className="flex items-center gap-1 px-2 py-1 text-muted-foreground">
          <Eye className="w-4 h-4" />
          <span className="text-xs">{counts.views}</span>
        </div>
      )}
    </div>
  );
};
