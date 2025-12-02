import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Image, FileText, Video } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Frame {
  id: string;
  chapter_id: string;
  order_index: number;
  narrative_content: string | null;
}

interface Chapter {
  id: string;
  title: string;
  order_index: number;
}

interface MediaAsset {
  frame_id: string;
  media_type: string;
  media_url: string;
}

interface TimelineViewProps {
  chapters: Chapter[];
  frames: Frame[];
  selectedFrameId?: string;
  onSelectFrame: (frameId: string) => void;
}

export function TimelineView({ chapters, frames, selectedFrameId, onSelectFrame }: TimelineViewProps) {
  const [mediaAssets, setMediaAssets] = useState<Record<string, MediaAsset>>({});

  useEffect(() => {
    loadMediaAssets();
  }, [frames]);

  const loadMediaAssets = async () => {
    if (frames.length === 0) return;
    
    const { data } = await supabase
      .from('media_assets')
      .select('frame_id, media_type, media_url')
      .in('frame_id', frames.map(f => f.id));
    
    if (data) {
      const mediaMap: Record<string, MediaAsset> = {};
      data.forEach(asset => {
        mediaMap[asset.frame_id] = asset;
      });
      setMediaAssets(mediaMap);
    }
  };

  const getFrameNumber = (frame: Frame) => {
    return frames.findIndex(f => f.id === frame.id) + 1;
  };

  const chapterColors = [
    'bg-primary',
    'bg-emerald-500',
    'bg-amber-500',
    'bg-rose-500',
    'bg-violet-500',
  ];

  return (
    <div className="bg-card border-b sticky top-[73px] z-10">
      <ScrollArea className="w-full">
        <div className="flex gap-6 p-4 min-w-max">
          {chapters.map((chapter, chapterIndex) => {
            const chapterFrames = frames.filter(f => f.chapter_id === chapter.id);
            const colorClass = chapterColors[chapterIndex % chapterColors.length];
            
            return (
              <div key={chapter.id} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", colorClass)} />
                  <span className="text-xs font-medium text-muted-foreground truncate max-w-[120px]">
                    {chapter.title}
                  </span>
                </div>
                
                <div className="flex gap-1">
                  {chapterFrames.map((frame) => {
                    const hasMedia = !!mediaAssets[frame.id];
                    const hasNarrative = !!frame.narrative_content?.trim();
                    const isSelected = frame.id === selectedFrameId;
                    const media = mediaAssets[frame.id];
                    const isVideo = media?.media_type === 'video';
                    
                    return (
                      <Tooltip key={frame.id}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => onSelectFrame(frame.id)}
                            className={cn(
                              "relative w-12 h-12 rounded-lg border-2 transition-all overflow-hidden",
                              "hover:scale-110 hover:shadow-md",
                              isSelected 
                                ? "border-primary ring-2 ring-primary/30" 
                                : "border-border hover:border-primary/50",
                              !hasMedia && !hasNarrative && "bg-muted"
                            )}
                          >
                            {hasMedia && media?.media_url ? (
                              isVideo ? (
                                <div className="absolute inset-0 bg-secondary flex items-center justify-center">
                                  <Video className="w-5 h-5 text-muted-foreground" />
                                </div>
                              ) : (
                                <img 
                                  src={media.media_url} 
                                  alt="" 
                                  className="absolute inset-0 w-full h-full object-cover"
                                />
                              )
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xs font-medium text-muted-foreground">
                                  {getFrameNumber(frame)}
                                </span>
                              </div>
                            )}
                            
                            {/* Status indicators */}
                            <div className="absolute bottom-0.5 right-0.5 flex gap-0.5">
                              {hasMedia && (
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              )}
                              {hasNarrative && (
                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                              )}
                            </div>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-[200px]">
                          <p className="font-medium">Frame {getFrameNumber(frame)}</p>
                          <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                            {hasMedia && <span className="flex items-center gap-1"><Image className="w-3 h-3" /> Media</span>}
                            {hasNarrative && <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> Text</span>}
                            {!hasMedia && !hasNarrative && <span>Empty</span>}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                  
                  {chapterFrames.length === 0 && (
                    <div className="w-12 h-12 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">—</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
