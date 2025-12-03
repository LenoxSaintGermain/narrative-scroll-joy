import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, LogOut, Book, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Stories() {
  const [user, setUser] = useState<any>(null);
  const [narratives, setNarratives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
    loadNarratives();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    setUser(session.user);
  };

  const loadNarratives = async () => {
    try {
      const { data, error } = await supabase
        .from("narratives")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setNarratives(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading stories",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleNewStory = () => {
    navigate("/stories/new");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Book className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Narrative Studio</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Your Stories</h2>
            <p className="text-muted-foreground">
              Create and manage your narrative journeys
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => navigate("/stories/generate")} size="lg" variant="outline" className="gap-2">
              <Sparkles className="h-5 w-5" />
              AI Generate
            </Button>
            <Button onClick={handleNewStory} size="lg">
              <Plus className="h-5 w-5 mr-2" />
              New Story
            </Button>
          </div>
        </div>

        {narratives.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Book className="h-16 w-16 text-muted-foreground mb-4" />
              <CardTitle className="mb-2">No stories yet</CardTitle>
              <CardDescription className="mb-4 text-center max-w-md">
                Start your storytelling journey by creating your first narrative
              </CardDescription>
              <Button onClick={handleNewStory}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Story
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {narratives.map((narrative) => (
              <Card
                key={narrative.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/stories/${narrative.id}`)}
              >
                <CardHeader>
                  <CardTitle>{narrative.title}</CardTitle>
                  <CardDescription>{narrative.description || "No description"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="capitalize">{narrative.status}</span>
                    <span>
                      {new Date(narrative.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}