import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Image, Sparkles, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AIGenerateDialog } from "./AIGenerateDialog";

interface MediaAsset {
  id: string;
  media_url: string;
  media_type: string;
  generation_prompt: string | null;
}

interface MediaPanelProps {
  frameId: string;
}

export function MediaPanel({ frameId }: MediaPanelProps) {
  const { toast } = useToast();
  const [media, setMedia] = useState<MediaAsset | null>(null);
  const [loading, setLoading] = useState(false);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);

  useEffect(() => {
    loadMedia();
  }, [frameId]);

  const loadMedia = async () => {
    try {
      const { data, error } = await supabase
        .from('media_assets')
        .select('*')
        .eq('frame_id', frameId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setMedia(data);
    } catch (error: any) {
      console.error('Error loading media:', error);
    }
  };

  const handleGenerate = async (prompt: string, aspectRatio: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt, aspectRatio }
      });

      if (error) throw error;

      // Create media asset record
      const { data: mediaData, error: mediaError } = await supabase
        .from('media_assets')
        .insert({
          frame_id: frameId,
          media_url: data.url,
          media_type: 'image',
          generation_prompt: prompt,
          generation_model: data.model,
        })
        .select()
        .single();

      if (mediaError) throw mediaError;

      setMedia(mediaData);
      toast({ title: "Image generated successfully!" });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error generating image",
        description: error.message,
      });
    } finally {
      setLoading(false);
      setShowGenerateDialog(false);
    }
  };

  return (
    <div className="relative bg-muted/30 min-h-[400px] flex items-center justify-center p-6">
      {media ? (
        <div className="relative w-full h-full">
          <img
            src={media.media_url}
            alt="Frame media"
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute bottom-4 right-4 flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setShowGenerateDialog(true)}
              disabled={loading}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Regenerate
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <Image className="w-16 h-16 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No media yet</p>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowGenerateDialog(true)}
              disabled={loading}
              className="gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Generate Image
            </Button>
            <Button variant="outline" disabled className="gap-2">
              <Upload className="w-4 h-4" />
              Upload
            </Button>
          </div>
        </div>
      )}

      <AIGenerateDialog
        open={showGenerateDialog}
        onOpenChange={setShowGenerateDialog}
        onGenerate={handleGenerate}
        loading={loading}
      />
    </div>
  );
}
