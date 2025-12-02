import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface PublicStory {
  id: string;
  title: string;
  description: string | null;
  coverImage?: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [stories, setStories] = useState<PublicStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPublicStories();
  }, []);

  const loadPublicStories = async () => {
    try {
      const { data: narrativesData } = await supabase
        .from('narratives')
        .select('id, title, description')
        .eq('status', 'published')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (narrativesData) {
        // Fetch cover images (first frame's media) for each story
        const storiesWithCovers = await Promise.all(
          narrativesData.map(async (narrative) => {
            const { data: chaptersData } = await supabase
              .from('chapters')
              .select('id')
              .eq('narrative_id', narrative.id)
              .order('order_index')
              .limit(1);

            if (chaptersData && chaptersData.length > 0) {
              const { data: framesData } = await supabase
                .from('frames')
                .select('id')
                .eq('chapter_id', chaptersData[0].id)
                .order('order_index')
                .limit(1);

              if (framesData && framesData.length > 0) {
                const { data: mediaData } = await supabase
                  .from('media_assets')
                  .select('media_url')
                  .eq('frame_id', framesData[0].id)
                  .eq('media_type', 'image')
                  .order('created_at', { ascending: false })
                  .limit(1)
                  .maybeSingle();

                return {
                  ...narrative,
                  coverImage: mediaData?.media_url,
                };
              }
            }

            return narrative;
          })
        );

        setStories(storiesWithCovers);
      }
    } catch (error) {
      console.error('Error loading public stories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading stories...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background" />
        <div className="container relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Narrative Studio
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            AI-powered storytelling tool for creators. Craft compelling narratives with visual media and guided frameworks.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/auth')} className="gap-2">
              Create Your Story
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/stories')}>
              My Stories
            </Button>
          </div>
        </div>
      </section>

      {/* Public Stories Showcase */}
      {stories.length > 0 ? (
        <section className="py-20">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Featured Stories
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {stories.map((story) => (
                <div
                  key={story.id}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/story/${story.id}`)}
                >
                  <div className="relative overflow-hidden rounded-xl mb-4 aspect-video bg-muted">
                    {story.coverImage ? (
                      <img
                        src={story.coverImage}
                        alt={story.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-muted-foreground">No preview</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {story.title}
                  </h3>
                  {story.description && (
                    <p className="text-muted-foreground line-clamp-2">
                      {story.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="py-20">
          <div className="container text-center">
            <h2 className="text-2xl font-semibold mb-4">No Published Stories Yet</h2>
            <p className="text-muted-foreground mb-8">
              Be the first to share your story with the world!
            </p>
            <Button onClick={() => navigate('/auth')}>
              Get Started
            </Button>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border/40 py-10 text-center text-sm text-muted-foreground">
        <p>© 2024 Narrative Studio. Craft stories that matter.</p>
      </footer>
    </main>
  );
};

export default Index;
