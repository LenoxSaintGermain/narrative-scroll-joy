import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Film, BookOpen } from "lucide-react";
import { StoryShelf } from "@/components/feed/StoryShelf";

interface PublicStory {
  id: string;
  title: string;
  description: string | null;
  coverImage?: string;
  genre?: string;
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
        .select('id, title, description, thumbnail_url, genre')
        .eq('status', 'published')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (narrativesData) {
        const storiesWithCovers = narrativesData.map((narrative: any) => ({
          id: narrative.id,
          title: narrative.title,
          description: narrative.description,
          coverImage: narrative.thumbnail_url,
          genre: narrative.genre || 'general',
        }));
        setStories(storiesWithCovers);
      }
    } catch (error) {
      console.error('Error loading public stories:', error);
    } finally {
      setLoading(false);
    }
  };

  // Categorize stories by genre
  const featuredStories = stories.slice(0, 8);
  const sciFiStories = stories.filter(s => s.genre === 'sci-fi');
  const fantasyStories = stories.filter(s => s.genre === 'fantasy');
  const recentStories = stories.slice(0, 6);

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section - Cinematic */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
          
          {/* Film strip decoration */}
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-r from-transparent via-primary/5 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-r from-transparent via-primary/5 to-transparent" />
        </div>

        <div className="container relative z-10 text-center px-4">
          {/* Logo/Brand */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Film className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">Narrative Studio</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
            <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
              Stories Come
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">
              Alive Here
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            AI-powered storytelling meets cinematic presentation. Create, share, and discover 
            narratives that captivate — with covers generated on the fly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')} 
              className="gap-2 px-8 py-6 text-lg rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
            >
              <Sparkles className="w-5 h-5" />
              Start Creating
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate('/stories')}
              className="gap-2 px-8 py-6 text-lg rounded-full"
            >
              <BookOpen className="w-5 h-5" />
              My Stories
            </Button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i}
              className="w-2 h-2 rounded-full bg-primary/30 animate-pulse"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
      </section>

      {/* Story Shelves - Blockbuster Style */}
      {loading ? (
        <section className="py-12 px-8">
          <div className="space-y-8">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-8 w-48 bg-muted rounded mb-6" />
                <div className="flex gap-6">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <div key={j} className="w-40 h-56 bg-muted rounded" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : stories.length > 0 ? (
        <section className="py-8 space-y-4">
          {/* Featured Stories */}
          <StoryShelf 
            title="Featured Stories" 
            icon="🔥" 
            stories={featuredStories} 
          />

          {/* Genre-specific shelves */}
          {sciFiStories.length > 0 && (
            <StoryShelf 
              title="Sci-Fi Adventures" 
              icon="🚀" 
              stories={sciFiStories} 
            />
          )}

          {fantasyStories.length > 0 && (
            <StoryShelf 
              title="Fantasy Realms" 
              icon="🏰" 
              stories={fantasyStories} 
            />
          )}

          {/* Recent additions */}
          <StoryShelf 
            title="Fresh Arrivals" 
            icon="✨" 
            stories={recentStories} 
          />
        </section>
      ) : (
        <section className="py-20">
          <div className="container text-center">
            {/* Empty state - Invitation to create */}
            <div className="max-w-md mx-auto">
              <div className="w-24 h-32 mx-auto mb-6 rounded bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center border-l-4 border-muted-foreground/30">
                <BookOpen className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-3">The Shelves Are Empty</h2>
              <p className="text-muted-foreground mb-8">
                Be the first to stock our shelves with your stories. 
                Create something amazing and share it with the world.
              </p>
              <Button onClick={() => navigate('/auth')} className="gap-2">
                <Sparkles className="w-4 h-4" />
                Create the First Story
              </Button>
            </div>
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
