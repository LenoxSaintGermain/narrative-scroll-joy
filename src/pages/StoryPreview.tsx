import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { StoryFrame } from "@/components/story/StoryFrame";

interface Frame {
  id: string;
  narrative_content: string | null;
  order_index: number;
  media_url?: string;
  media_type?: string;
}

export default function StoryPreview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [story, setStory] = useState<any>(null);
  const [frames, setFrames] = useState<Frame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStory();
  }, [id]);

  const loadStory = async () => {
    if (!id) return;

    try {
      // Fetch narrative
      const { data: narrativeData, error: narrativeError } = await supabase
        .from('narratives')
        .select('*')
        .eq('id', id)
        .eq('is_public', true)
        .single();

      if (narrativeError) throw narrativeError;
      if (!narrativeData) {
        navigate('/');
        return;
      }

      setStory(narrativeData);

      // Fetch chapters
      const { data: chaptersData } = await supabase
        .from('chapters')
        .select('id')
        .eq('narrative_id', id)
        .order('order_index');

      if (!chaptersData || chaptersData.length === 0) {
        setLoading(false);
        return;
      }

      // Fetch frames with media
      const { data: framesData } = await supabase
        .from('frames')
        .select(`
          id,
          narrative_content,
          order_index,
          chapter_id
        `)
        .in('chapter_id', chaptersData.map(c => c.id))
        .order('chapter_id')
        .order('order_index');

      if (framesData) {
        // Fetch media for each frame
        const framesWithMedia = await Promise.all(
          framesData.map(async (frame) => {
            const { data: mediaData } = await supabase
              .from('media_assets')
              .select('media_url, media_type')
              .eq('frame_id', frame.id)
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle();

            return {
              ...frame,
              media_url: mediaData?.media_url,
              media_type: mediaData?.media_type,
            };
          })
        );

        setFrames(framesWithMedia);
      }
    } catch (error) {
      console.error('Error loading story:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-lg text-muted-foreground">Loading story...</div>
      </div>
    );
  }

  if (!story) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top fade gradient for cinematic effect */}
      <div className="fixed top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent z-40 pointer-events-none" />

      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="container py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Stories
          </Button>
          <div className="text-center">
            <h1 className="text-xl font-bold">{story.title}</h1>
          </div>
          <div className="w-24" />
        </div>
      </header>

      <main className="pt-20">
        {frames.map((frame, index) => (
          <StoryFrame key={frame.id} frame={frame} index={index} />
        ))}

        {frames.length === 0 && (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Story in Progress</h2>
              <p className="text-muted-foreground">This story doesn't have any frames yet.</p>
            </div>
          </div>
        )}
      </main>

      {/* Bottom fade gradient */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-40 pointer-events-none" />
    </div>
  );
}