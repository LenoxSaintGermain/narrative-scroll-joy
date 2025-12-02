import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { VideoPlayer } from "@/components/story/VideoPlayer";

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading story...</div>
      </div>
    );
  }

  if (!story) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
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
          <section
            key={frame.id}
            className="min-h-screen flex items-center sticky top-0"
            style={{
              opacity: 1,
              transform: 'translateY(0)',
            }}
          >
            <div className="container">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {frame.media_url && (
                  <div className="order-1 md:order-1">
                    {frame.media_type === 'video' ? (
                      <VideoPlayer src={frame.media_url} className="rounded-2xl overflow-hidden" />
                    ) : (
                      <img
                        src={frame.media_url}
                        alt={`Frame ${index + 1}`}
                        className="w-full rounded-2xl object-cover"
                      />
                    )}
                  </div>
                )}
                
                <div className={`order-2 ${!frame.media_url ? 'md:col-span-2' : 'md:order-2'}`}>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-lg leading-relaxed whitespace-pre-wrap">
                      {frame.narrative_content || ''}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
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
    </div>
  );
}
