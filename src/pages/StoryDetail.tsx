import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FrameEditor } from "@/components/story/FrameEditor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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
}

export default function StoryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [narrative, setNarrative] = useState<Narrative | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [frames, setFrames] = useState<Frame[]>([]);
  const [loading, setLoading] = useState(true);

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

      // Update order indices of frames after this one
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
      toast({ title: "Frame added successfully" });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error adding frame",
        description: error.message,
      });
    }
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
      toast({ title: "Status updated successfully" });
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
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
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
          </div>
        </div>
      </header>

      <main className="container py-8">
        {chapters.map((chapter) => {
          const chapterFrames = frames.filter(f => f.chapter_id === chapter.id);
          
          return (
            <div key={chapter.id} className="mb-12">
              <h2 className="text-xl font-semibold mb-6">{chapter.title}</h2>
              
              <div className="space-y-8">
                {chapterFrames.map((frame, index) => (
                  <div key={frame.id}>
                    <FrameEditor
                      frame={frame}
                      onUpdate={(content) => handleUpdateFrame(frame.id, content)}
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
    </div>
  );
}
