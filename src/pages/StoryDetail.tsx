import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FrameEditor } from "@/components/story/FrameEditor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ViewModeToggle, ViewMode } from "@/components/story/ViewModeToggle";
import { TimelineView } from "@/components/story/TimelineView";
import { GridView } from "@/components/story/GridView";
import { TooltipProvider } from "@/components/ui/tooltip";

interface Narrative {
  id: string;
  title: string;
  description: string | null;
  framework_id: string | null;
  status: 'draft' | 'published' | 'archived';
  is_public: boolean;
}

interface Chapter {
  id: string;
  title: string;
  order_index: number;
}

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

export default function StoryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [narrative, setNarrative] = useState<Narrative | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [frames, setFrames] = useState<Frame[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('build');
  const [selectedFrameId, setSelectedFrameId] = useState<string | undefined>();
  
  const frameRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    loadStory();
  }, [id]);

  const loadStory = async () => {
    if (!id) return;
    
    try {
      const { data: narrativeData, error: narrativeError } = await supabase
        .from('narratives')
        .select('*')
        .eq('id', id)
        .single();

      if (narrativeError) throw narrativeError;
      setNarrative(narrativeData as Narrative);

      const { data: chaptersData, error: chaptersError } = await supabase
        .from('chapters')
        .select('*')
        .eq('narrative_id', id)
        .order('order_index');

      if (chaptersError) throw chaptersError;
      setChapters(chaptersData || []);

      const { data: framesData, error: framesError } = await supabase
        .from('frames')
        .select('*')
        .in('chapter_id', chaptersData?.map(c => c.id) || [])
        .order('chapter_id')
        .order('order_index');

      if (framesError) throw framesError;
      setFrames(framesData || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading story",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddFrame = async (chapterId: string, afterIndex: number) => {
    try {
      const { data, error } = await supabase
        .from('frames')
        .insert({
          chapter_id: chapterId,
          order_index: afterIndex + 1,
          narrative_content: '',
        })
        .select()
        .single();

      if (error) throw error;

      const framesToUpdate = frames
        .filter(f => f.chapter_id === chapterId && f.order_index > afterIndex)
        .map(f => ({ ...f, order_index: f.order_index + 1 }));

      if (framesToUpdate.length > 0) {
        await Promise.all(
          framesToUpdate.map(f =>
            supabase.from('frames').update({ order_index: f.order_index }).eq('id', f.id)
          )
        );
      }

      loadStory();
      toast({ title: "Frame added" });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error adding frame",
        description: error.message,
      });
    }
  };

  const handleDeleteFrame = async (frameId: string) => {
    try {
      // First delete associated media assets
      await supabase
        .from('media_assets')
        .delete()
        .eq('frame_id', frameId);

      const { error } = await supabase
        .from('frames')
        .delete()
        .eq('id', frameId);

      if (error) throw error;

      setFrames(frames.filter(f => f.id !== frameId));
      toast({ title: "Frame deleted" });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting frame",
        description: error.message,
      });
    }
  };

  const handleDuplicateFrame = async (frame: Frame) => {
    try {
      const { data, error } = await supabase
        .from('frames')
        .insert({
          chapter_id: frame.chapter_id,
          order_index: frame.order_index + 1,
          narrative_content: frame.narrative_content,
          beat_id: frame.beat_id,
        })
        .select()
        .single();

      if (error) throw error;

      // Update order indices of frames after the duplicated one
      const framesToUpdate = frames
        .filter(f => f.chapter_id === frame.chapter_id && f.order_index > frame.order_index)
        .map(f => ({ ...f, order_index: f.order_index + 1 }));

      if (framesToUpdate.length > 0) {
        await Promise.all(
          framesToUpdate.map(f =>
            supabase.from('frames').update({ order_index: f.order_index }).eq('id', f.id)
          )
        );
      }

      loadStory();
      toast({ title: "Frame duplicated" });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error duplicating frame",
        description: error.message,
      });
    }
  };

  const handleReorderFrames = async (reorderedFrames: Frame[]) => {
    try {
      // Optimistically update UI
      setFrames(reorderedFrames);

      // Update all frames in database
      await Promise.all(
        reorderedFrames.map((frame, index) =>
          supabase
            .from('frames')
            .update({ order_index: index })
            .eq('id', frame.id)
        )
      );

      toast({ title: "Frames reordered" });
    } catch (error: any) {
      // Revert on error
      loadStory();
      toast({
        variant: "destructive",
        title: "Error reordering frames",
        description: error.message,
      });
    }
  };

  const handleMoveFrame = async (frameId: string, direction: 'up' | 'down') => {
    const frameIndex = frames.findIndex(f => f.id === frameId);
    if (frameIndex === -1) return;

    const newIndex = direction === 'up' ? frameIndex - 1 : frameIndex + 1;
    if (newIndex < 0 || newIndex >= frames.length) return;

    const newFrames = [...frames];
    [newFrames[frameIndex], newFrames[newIndex]] = [newFrames[newIndex], newFrames[frameIndex]];
    
    const reorderedFrames = newFrames.map((f, idx) => ({ ...f, order_index: idx }));
    await handleReorderFrames(reorderedFrames);
  };

  const handleUpdateFrame = async (frameId: string, content: string) => {
    try {
      const { error } = await supabase
        .from('frames')
        .update({ narrative_content: content })
        .eq('id', frameId);

      if (error) throw error;

      setFrames(frames.map(f => 
        f.id === frameId ? { ...f, narrative_content: content } : f
      ));
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating frame",
        description: error.message,
      });
    }
  };

  const handleSelectFrame = (frameId: string) => {
    setSelectedFrameId(frameId);
    if (viewMode === 'grid') {
      setViewMode('build');
    }
    // Scroll to frame in build view
    setTimeout(() => {
      frameRefs.current[frameId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!narrative) return;
    
    const typedStatus = newStatus as 'draft' | 'published' | 'archived';
    
    try {
      const { error } = await supabase
        .from('narratives')
        .update({ status: typedStatus })
        .eq('id', narrative.id);

      if (error) throw error;

      setNarrative({ ...narrative, status: typedStatus });
      toast({ title: "Status updated" });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating status",
        description: error.message,
      });
    }
  };

  const handlePublicToggle = async (isPublic: boolean) => {
    if (!narrative) return;
    
    try {
      const { error } = await supabase
        .from('narratives')
        .update({ is_public: isPublic })
        .eq('id', narrative.id);

      if (error) throw error;

      setNarrative({ ...narrative, is_public: isPublic });
      toast({ title: isPublic ? "Story is now public" : "Story is now private" });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating visibility",
        description: error.message,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading story...</div>
      </div>
    );
  }

  if (!narrative) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Story not found</div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b">
          <div className="container py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => navigate('/stories')}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <div>
                  <h1 className="text-2xl font-bold">{narrative.title}</h1>
                  {narrative.description && (
                    <p className="text-sm text-muted-foreground">{narrative.description}</p>
                  )}
                </div>
              </div>
              
              <ViewModeToggle value={viewMode} onChange={setViewMode} />
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Label htmlFor="status" className="text-sm">Status:</Label>
                <Select value={narrative.status} onValueChange={handleStatusChange}>
                  <SelectTrigger id="status" className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <Switch 
                  id="public" 
                  checked={narrative.is_public} 
                  onCheckedChange={handlePublicToggle}
                />
                <Label htmlFor="public" className="text-sm">Make Public</Label>
              </div>
              
              <div className="text-sm text-muted-foreground ml-auto">
                {frames.length} frame{frames.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </header>

        {/* Timeline (always visible in build mode) */}
        {viewMode === 'build' && frames.length > 0 && (
          <TimelineView
            chapters={chapters}
            frames={frames}
            selectedFrameId={selectedFrameId}
            onSelectFrame={handleSelectFrame}
          />
        )}

        {/* Grid View */}
        {viewMode === 'grid' && (
          <main className="container py-4">
            <GridView
              chapters={chapters}
              frames={frames}
              onReorder={handleReorderFrames}
              onDeleteFrame={handleDeleteFrame}
              onDuplicateFrame={handleDuplicateFrame}
              onSelectFrame={handleSelectFrame}
            />
          </main>
        )}

        {/* Timeline-only View */}
        {viewMode === 'timeline' && (
          <main className="container py-8">
            <div className="text-center text-muted-foreground mb-8">
              <p>Click on a frame thumbnail to jump to it in Build view</p>
            </div>
            <TimelineView
              chapters={chapters}
              frames={frames}
              selectedFrameId={selectedFrameId}
              onSelectFrame={handleSelectFrame}
            />
          </main>
        )}

        {/* Build View */}
        {viewMode === 'build' && (
          <main className="container py-8">
            {chapters.map((chapter) => {
              const chapterFrames = frames.filter(f => f.chapter_id === chapter.id);
              
              return (
                <div key={chapter.id} className="mb-12">
                  <h2 className="text-xl font-semibold mb-6">{chapter.title}</h2>
                  
                  <div className="space-y-8">
                    {chapterFrames.map((frame, index) => (
                      <div 
                        key={frame.id}
                        ref={(el) => { frameRefs.current[frame.id] = el; }}
                      >
                        <FrameEditor
                          frame={frame}
                          frameNumber={frames.findIndex(f => f.id === frame.id) + 1}
                          isSelected={frame.id === selectedFrameId}
                          onUpdate={(content) => handleUpdateFrame(frame.id, content)}
                          onDelete={() => handleDeleteFrame(frame.id)}
                          onDuplicate={() => handleDuplicateFrame(frame)}
                          onMoveUp={() => handleMoveFrame(frame.id, 'up')}
                          onMoveDown={() => handleMoveFrame(frame.id, 'down')}
                          canMoveUp={index > 0 || chapters.findIndex(c => c.id === chapter.id) > 0}
                          canMoveDown={index < chapterFrames.length - 1 || chapters.findIndex(c => c.id === chapter.id) < chapters.length - 1}
                        />
                        
                        <div className="flex justify-center my-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAddFrame(chapter.id, frame.order_index)}
                            className="gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Add Frame
                          </Button>
                        </div>
                      </div>
                    ))}

                    {chapterFrames.length === 0 && (
                      <div className="text-center py-8">
                        <Button
                          onClick={() => handleAddFrame(chapter.id, -1)}
                          className="gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add First Frame
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </main>
        )}
      </div>
    </TooltipProvider>
  );
}
