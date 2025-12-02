import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MediaPanel } from "./MediaPanel";
import { NarrativePanel } from "./NarrativePanel";
import { FrameActions } from "./FrameActions";
import { cn } from "@/lib/utils";

interface Frame {
  id: string;
  chapter_id: string;
  order_index: number;
  narrative_content: string | null;
  beat_id: string | null;
}

interface FrameEditorProps {
  frame: Frame;
  frameNumber?: number;
  isSelected?: boolean;
  onUpdate: (content: string) => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

export function FrameEditor({ 
  frame, 
  frameNumber,
  isSelected,
  onUpdate,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  canMoveUp = true,
  canMoveDown = true,
}: FrameEditorProps) {
  const [content, setContent] = useState(frame.narrative_content || '');

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    onUpdate(newContent);
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all",
      isSelected && "ring-2 ring-primary shadow-lg"
    )}>
      {/* Header with frame number and actions */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b">
        <div className="flex items-center gap-2">
          {frameNumber && (
            <Badge variant="secondary" className="font-mono">
              Frame {frameNumber}
            </Badge>
          )}
        </div>
        
        {(onDelete || onDuplicate) && (
          <FrameActions
            onDelete={onDelete || (() => {})}
            onDuplicate={onDuplicate || (() => {})}
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            canMoveUp={canMoveUp}
            canMoveDown={canMoveDown}
          />
        )}
      </div>

      {/* Main content */}
      <div className="grid md:grid-cols-2 gap-0">
        <MediaPanel frameId={frame.id} />
        <NarrativePanel
          content={content}
          onChange={handleContentChange}
          frameId={frame.id}
        />
      </div>
    </Card>
  );
}
