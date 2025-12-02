import { useState } from "react";
import { Card } from "@/components/ui/card";
import { MediaPanel } from "./MediaPanel";
import { NarrativePanel } from "./NarrativePanel";

interface Frame {
  id: string;
  chapter_id: string;
  order_index: number;
  narrative_content: string | null;
  beat_id: string | null;
}

interface FrameEditorProps {
  frame: Frame;
  onUpdate: (content: string) => void;
}

export function FrameEditor({ frame, onUpdate }: FrameEditorProps) {
  const [content, setContent] = useState(frame.narrative_content || '');

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    onUpdate(newContent);
  };

  return (
    <Card className="overflow-hidden">
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
