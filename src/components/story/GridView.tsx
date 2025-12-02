import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { FrameCard } from "./FrameCard";

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

interface GridViewProps {
  chapters: Chapter[];
  frames: Frame[];
  onReorder: (frames: Frame[]) => void;
  onDeleteFrame: (frameId: string) => void;
  onDuplicateFrame: (frame: Frame) => void;
  onSelectFrame: (frameId: string) => void;
}

export function GridView({ 
  chapters, 
  frames, 
  onReorder, 
  onDeleteFrame, 
  onDuplicateFrame,
  onSelectFrame 
}: GridViewProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = frames.findIndex(f => f.id === active.id);
      const newIndex = frames.findIndex(f => f.id === over.id);
      
      const newFrames = arrayMove(frames, oldIndex, newIndex).map((frame, index) => ({
        ...frame,
        order_index: index,
      }));
      
      onReorder(newFrames);
    }
  };

  const getChapterTitle = (chapterId: string) => {
    return chapters.find(c => c.id === chapterId)?.title || 'Unknown Chapter';
  };

  const getFrameNumber = (frame: Frame) => {
    return frames.findIndex(f => f.id === frame.id) + 1;
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={frames.map(f => f.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
          {frames.map((frame) => (
            <FrameCard
              key={frame.id}
              frame={frame}
              frameNumber={getFrameNumber(frame)}
              chapterTitle={getChapterTitle(frame.chapter_id)}
              onDelete={() => onDeleteFrame(frame.id)}
              onDuplicate={() => onDuplicateFrame(frame)}
              onSelect={() => onSelectFrame(frame.id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
