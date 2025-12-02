import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function NewStory() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [frameworks, setFrameworks] = useState<any[]>([]);
  const [selectedFramework, setSelectedFramework] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadFrameworks();
  }, []);

  const loadFrameworks = async () => {
    const { data, error } = await supabase
      .from("story_frameworks")
      .select("*")
      .eq("is_active", true)
      .order("name");

    if (!error && data) {
      setFrameworks(data);
      if (data.length > 0) {
        setSelectedFramework(data[0].id);
      }
    }
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your story",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Create narrative
      const { data: narrative, error: narrativeError } = await supabase
        .from("narratives")
        .insert({
          user_id: user.id,
          title,
          description,
          framework_id: selectedFramework || null,
        })
        .select()
        .single();

      if (narrativeError) throw narrativeError;

      // Create initial chapter
      const { data: chapter, error: chapterError } = await supabase
        .from("chapters")
        .insert({
          narrative_id: narrative.id,
          title: "Chapter 1",
          description: "The beginning",
          order_index: 0,
        })
        .select()
        .single();

      if (chapterError) throw chapterError;

      // Create initial frame
      const { error: frameError } = await supabase
        .from("frames")
        .insert({
          chapter_id: chapter.id,
          narrative_content: "",
          order_index: 0,
        });

      if (frameError) throw frameError;

      toast({
        title: "Story created!",
        description: "Your narrative journey begins now",
      });

      navigate(`/stories/${narrative.id}`);
    } catch (error: any) {
      toast({
        title: "Error creating story",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-4">
      <div className="container max-w-2xl mx-auto py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/stories")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Stories
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Create New Story</CardTitle>
            <CardDescription>
              Set up your narrative framework and begin your storytelling journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Story Title</Label>
              <Input
                id="title"
                placeholder="The Hero's Journey"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="A brief description of your story..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="framework">Narrative Framework</Label>
              <Select value={selectedFramework} onValueChange={setSelectedFramework}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a framework" />
                </SelectTrigger>
                <SelectContent>
                  {frameworks.map((framework) => (
                    <SelectItem key={framework.id} value={framework.id}>
                      <div>
                        <div className="font-medium">{framework.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {framework.description}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              className="w-full"
              onClick={handleCreate}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Story"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}