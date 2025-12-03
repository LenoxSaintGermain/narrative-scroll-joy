import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, ArrowLeft, Loader2, Wand2, BookOpen, Film } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const TARGET_AUDIENCES = [
  { value: "Kids", label: "Kids", description: "Bright, friendly, magical" },
  { value: "Teens", label: "Teens", description: "Dynamic, bold, relatable" },
  { value: "Adults", label: "Adults", description: "Sophisticated, nuanced" },
  { value: "Therapeutic", label: "Therapeutic", description: "Calming, gentle, safe" },
  { value: "Corporate", label: "Corporate", description: "Professional, aspirational" },
];

const STORY_LENGTHS = [
  { value: "Short (5-7 beats)", label: "Short", beats: "5-7 beats", duration: "~2-3 min" },
  { value: "Medium (8-12 beats)", label: "Medium", beats: "8-12 beats", duration: "~4-6 min" },
  { value: "Long (13-20 beats)", label: "Long", beats: "13-20 beats", duration: "~8-12 min" },
];

const VISUAL_STYLE_SUGGESTIONS = [
  "Pixar-style 3D animation",
  "Cinematic realism",
  "Anime/manga style",
  "Watercolor illustration",
  "Claymation",
  "Noir film aesthetic",
  "Vintage photography",
  "Minimalist vector art",
];

type GenerationStep = 'idle' | 'structure' | 'prompts' | 'saving' | 'complete' | 'error';

export default function GenerateStory() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [theme, setTheme] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [framework, setFramework] = useState("");
  const [storyLength, setStoryLength] = useState("");
  const [visualStyle, setVisualStyle] = useState("");
  const [frameworks, setFrameworks] = useState<{ id: string; name: string; description: string }[]>([]);
  
  const [generationStep, setGenerationStep] = useState<GenerationStep>('idle');
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Check auth
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        navigate('/auth');
      }
    });

    // Load frameworks
    supabase.from('story_frameworks')
      .select('id, name, description')
      .then(({ data }) => {
        if (data) {
          setFrameworks(data);
        }
      });
  }, [navigate]);

  const handleGenerate = async () => {
    if (!theme || !targetAudience || !framework || !storyLength) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill in all required fields."
      });
      return;
    }

    setGenerationStep('structure');
    setErrorMessage("");

    try {
      const { data, error } = await supabase.functions.invoke('generate-story', {
        body: {
          theme,
          targetAudience,
          framework,
          storyLength,
          visualStyle: visualStyle || undefined
        }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      setGenerationStep('complete');
      
      toast({
        title: "Story generated!",
        description: `"${data.title}" created with ${data.beat_count} beats.`
      });

      // Redirect to edit the new story
      setTimeout(() => {
        navigate(`/stories/${data.narrative_id}`);
      }, 1000);

    } catch (error: any) {
      console.error('Generation error:', error);
      setGenerationStep('error');
      setErrorMessage(error.message || 'Failed to generate story');
      
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: error.message || 'Something went wrong'
      });
    }
  };

  const isGenerating = ['structure', 'prompts', 'saving'].includes(generationStep);
  const canGenerate = theme && targetAudience && framework && storyLength && !isGenerating;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16 px-4">
          <Button variant="ghost" onClick={() => navigate('/stories')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Stories
          </Button>
          <h1 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Story Generator
          </h1>
          <div className="w-24" />
        </div>
      </header>

      <main className="container max-w-3xl px-4 py-8">
        <Card className="mb-8">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl flex items-center justify-center gap-3">
              <Wand2 className="w-6 h-6 text-primary" />
              Create Your Story
            </CardTitle>
            <CardDescription>
              Describe your story concept and let AI craft the narrative structure and visual prompts
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="space-y-6">
          {/* Theme Input */}
          <Card>
            <CardContent className="pt-6">
              <Label htmlFor="theme" className="text-base font-medium">
                Story Theme / Concept *
              </Label>
              <p className="text-sm text-muted-foreground mb-3">
                Describe your story idea in a few sentences. Be specific about characters, setting, and conflict.
              </p>
              <Textarea
                id="theme"
                placeholder="A lonely robot on Mars discovers a mysterious garden growing in an abandoned research station. As it tends to the plants, it begins to experience something like hope for the first time..."
                value={theme}
                onChange={(e) => setTheme(e.target.value.slice(0, 500))}
                className="min-h-[120px] resize-none"
                disabled={isGenerating}
              />
              <p className="text-xs text-muted-foreground mt-2 text-right">
                {theme.length}/500 characters
              </p>
            </CardContent>
          </Card>

          {/* Target Audience */}
          <Card>
            <CardContent className="pt-6">
              <Label className="text-base font-medium">Target Audience *</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Who is this story for? This affects tone, complexity, and visual style.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {TARGET_AUDIENCES.map((audience) => (
                  <button
                    key={audience.value}
                    onClick={() => setTargetAudience(audience.value)}
                    disabled={isGenerating}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      targetAudience === audience.value
                        ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/50'
                    } disabled:opacity-50`}
                  >
                    <div className="font-medium">{audience.label}</div>
                    <div className="text-xs text-muted-foreground">{audience.description}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Narrative Framework */}
          <Card>
            <CardContent className="pt-6">
              <Label className="text-base font-medium flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Narrative Framework *
              </Label>
              <p className="text-sm text-muted-foreground mb-3">
                Choose a storytelling structure to guide the narrative arc.
              </p>
              <Select value={framework} onValueChange={setFramework} disabled={isGenerating}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a framework..." />
                </SelectTrigger>
                <SelectContent>
                  {frameworks.map((fw) => (
                    <SelectItem key={fw.id} value={fw.name}>
                      <div>
                        <span className="font-medium">{fw.name}</span>
                        {fw.description && (
                          <span className="text-muted-foreground ml-2">— {fw.description}</span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                  <SelectItem value="Freeform">
                    <span className="font-medium">Freeform</span>
                    <span className="text-muted-foreground ml-2">— No specific structure</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Story Length */}
          <Card>
            <CardContent className="pt-6">
              <Label className="text-base font-medium flex items-center gap-2">
                <Film className="w-4 h-4" />
                Story Length *
              </Label>
              <p className="text-sm text-muted-foreground mb-3">
                How many beats (scenes/frames) should your story have?
              </p>
              <div className="grid grid-cols-3 gap-3">
                {STORY_LENGTHS.map((length) => (
                  <button
                    key={length.value}
                    onClick={() => setStoryLength(length.value)}
                    disabled={isGenerating}
                    className={`p-4 rounded-lg border text-center transition-all ${
                      storyLength === length.value
                        ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/50'
                    } disabled:opacity-50`}
                  >
                    <div className="font-semibold text-lg">{length.label}</div>
                    <div className="text-sm text-muted-foreground">{length.beats}</div>
                    <div className="text-xs text-muted-foreground mt-1">{length.duration}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Visual Style (Optional) */}
          <Card>
            <CardContent className="pt-6">
              <Label htmlFor="visualStyle" className="text-base font-medium">
                Visual Style (Optional)
              </Label>
              <p className="text-sm text-muted-foreground mb-3">
                Describe the visual aesthetic for generated images and videos.
              </p>
              <Input
                id="visualStyle"
                placeholder="e.g., Pixar-style 3D animation, watercolor illustration..."
                value={visualStyle}
                onChange={(e) => setVisualStyle(e.target.value)}
                disabled={isGenerating}
              />
              <div className="flex flex-wrap gap-2 mt-3">
                {VISUAL_STYLE_SUGGESTIONS.map((style) => (
                  <button
                    key={style}
                    onClick={() => setVisualStyle(style)}
                    disabled={isGenerating}
                    className="px-3 py-1 text-xs rounded-full border border-border hover:border-primary/50 hover:bg-primary/5 transition-all disabled:opacity-50"
                  >
                    {style}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Generate Button */}
          <div className="pt-4">
            {generationStep === 'error' && (
              <div className="mb-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
                <p className="font-medium">Generation Failed</p>
                <p className="text-sm">{errorMessage}</p>
              </div>
            )}

            {isGenerating && (
              <Card className="mb-4">
                <CardContent className="py-6">
                  <div className="flex items-center justify-center gap-4">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <div>
                      <p className="font-medium">
                        {generationStep === 'structure' && 'Generating story structure...'}
                        {generationStep === 'prompts' && 'Creating visual prompts...'}
                        {generationStep === 'saving' && 'Saving your story...'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        This may take 30-60 seconds
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {generationStep === 'complete' && (
              <Card className="mb-4 border-green-500/50 bg-green-500/10">
                <CardContent className="py-6 text-center">
                  <p className="font-medium text-green-600">✓ Story generated successfully!</p>
                  <p className="text-sm text-muted-foreground">Redirecting to editor...</p>
                </CardContent>
              </Card>
            )}

            <Button
              size="lg"
              className="w-full h-14 text-lg gap-3"
              onClick={handleGenerate}
              disabled={!canGenerate}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Story Draft
                </>
              )}
            </Button>
            
            <p className="text-center text-xs text-muted-foreground mt-3">
              Press <kbd className="px-1.5 py-0.5 rounded bg-muted border text-xs">Cmd/Ctrl + Enter</kbd> to generate
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
