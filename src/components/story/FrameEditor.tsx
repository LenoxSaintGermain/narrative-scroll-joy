import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MediaPanel } from "./MediaPanel";
import { NarrativePanel } from "./NarrativePanel";
import { FrameActions } from "./FrameActions";
import { RegenerateBeatDialog } from "./RegenerateBeatDialog";
import { cn } from "@/lib/utils";
import { 
  ChevronDown, 
  ChevronUp, 
  Image as ImageIcon, 
  Film, 
  Sparkles,
  Clock
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface Frame {
  id: string;
  chapter_id: string;
  order_index: number;
  narrative_content: string | null;
  beat_id: string | null;
  beat_title?: string | null;
  visual_prompt?: string | null;
  media_type?: string | null;
  duration?: number | null;
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
  const [visualPrompt, setVisualPrompt] = useState(frame.visual_prompt || '');
  const [isPromptExpanded, setIsPromptExpanded] = useState(false);
  const [showRegenerateDialog, setShowRegenerateDialog] = useState(false);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    onUpdate(newContent);
  };

  const handlePromptRegenerated = (newPrompt: string) => {
    setVisualPrompt(newPrompt);
  };

  const isVideo = frame.media_type === 'video';

  return (
    <>
      <Card className={cn(
        "overflow-hidden transition-all",
        isSelected && "ring-2 ring-primary shadow-lg"
      )}>
        {/* Header with frame number, beat title, and actions */}
        <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b">
          <div className="flex items-center gap-2 flex-wrap">
            {frameNumber && (
              <Badge variant="secondary" className="font-mono">
                Frame {frameNumber}
              </Badge>
            )}
            {frame.beat_title && (
              <Badge variant="outline" className="font-medium">
                {frame.beat_title}
              </Badge>
            )}
            {frame.media_type && (
              <Badge variant={isVideo ? "default" : "secondary"} className="gap-1">
                {isVideo ? (
                  <>
                    <Film className="w-3 h-3" />
                    Video
                    {frame.duration && frame.duration > 0 && (
                      <span className="ml-1 flex items-center gap-0.5">
                        <Clock className="w-3 h-3" />
                        {frame.duration}s
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-3 h-3" />
                    Image
                  </>
                )}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {frame.visual_prompt && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowRegenerateDialog(true)}
                className="gap-1.5 text-xs"
              >
                <Sparkles className="w-3 h-3" />
                Regenerate
              </Button>
            )}
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
        </div>

        {/* Visual Prompt Section (Collapsible) */}
        {visualPrompt && (
          <Collapsible open={isPromptExpanded} onOpenChange={setIsPromptExpanded}>
            <CollapsibleTrigger asChild>
              <button className="w-full px-4 py-2 flex items-center justify-between text-sm bg-primary/5 hover:bg-primary/10 transition-colors border-b">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Visual Prompt
                  <span className="text-xs">
                    ({visualPrompt.length} chars)
                  </span>
                </span>
                {isPromptExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-4 py-3 bg-muted/30 border-b">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {visualPrompt}
                </p>
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

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

      {/* Regenerate Dialog */}
      <RegenerateBeatDialog
        open={showRegenerateDialog}
        onOpenChange={setShowRegenerateDialog}
        frameId={frame.id}
        currentNarrative={content}
        currentVisualPrompt={visualPrompt}
        onRegenerated={handlePromptRegenerated}
      />
    </>
  );
}
