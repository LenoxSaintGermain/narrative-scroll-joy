import { useEffect, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { GripVertical, Image, FileText, Video } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FrameActions } from "./FrameActions";

interface Frame {
  id: string;
  chapter_id: string;
  order_index: number;
  narrative_content: string | null;
}

interface FrameCardProps {
  frame: Frame;
  frameNumber: number;
  chapterTitle: string;
  onDelete: () => void;
  onDuplicate: () => void;
  onSelect: () => void;
}

export function FrameCard({ 
  frame, 
  frameNumber, 
  chapterTitle, 
  onDelete, 
  onDuplicate,
  onSelect 
}: FrameCardProps) {
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<string | null>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: frame.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    loadMedia();
  }, [frame.id]);

  const loadMedia = async () => {
    const { data } = await supabase
      .from('media_assets')
      .select('media_url, media_type')
      .eq('frame_id', frame.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (data) {
      setMediaUrl(data.media_url);
      setMediaType(data.media_type);
    }
  };

  const hasNarrative = !!frame.narrative_content?.trim();
  const narrativePreview = frame.narrative_content?.slice(0, 60) || '';

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative overflow-hidden transition-all cursor-pointer",
        "hover:shadow-lg hover:border-primary/50",
        isDragging && "opacity-50 shadow-2xl z-50"
      )}
      onClick={onSelect}
    >
      {/* Media Preview */}
      <div className="aspect-video bg-muted relative overflow-hidden">
        {mediaUrl ? (
          mediaType === 'video' ? (
            <div className="absolute inset-0 flex items-center justify-center bg-secondary">
              <Video className="w-12 h-12 text-muted-foreground" />
            </div>
          ) : (
            <img 
              src={mediaUrl} 
              alt="" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          )
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Image className="w-12 h-12 text-muted-foreground/30" />
          </div>
        )}

        {/* Drag Handle */}
        <div
          className={cn(
            "absolute top-2 left-2 p-1 rounded bg-background/80 backdrop-blur",
            "opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
          )}
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </div>

        {/* Frame Number Badge */}
        <Badge 
          variant="secondary" 
          className="absolute top-2 right-2 bg-background/80 backdrop-blur"
        >
          #{frameNumber}
        </Badge>

        {/* Status Indicators */}
        <div className="absolute bottom-2 right-2 flex gap-1">
          {mediaUrl && (
            <div className="w-2 h-2 rounded-full bg-emerald-500" title="Has media" />
          )}
          {hasNarrative && (
            <div className="w-2 h-2 rounded-full bg-primary" title="Has narrative" />
          )}
        </div>
      </div>

      {/* Content Preview */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="text-xs">
            {chapterTitle}
          </Badge>
          
          <div 
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <FrameActions
              onDelete={onDelete}
              onDuplicate={onDuplicate}
            />
          </div>
        </div>

        {hasNarrative ? (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {narrativePreview}...
          </p>
        ) : (
          <p className="text-sm text-muted-foreground/50 italic">
            No narrative content
          </p>
        )}
      </div>
    </Card>
  );
}
