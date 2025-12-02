import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Image as ImageIcon, Video } from "lucide-react";

interface AIGenerateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (prompt: string, aspectRatio: string, mediaType: 'image' | 'video', options?: { duration?: number; model?: string }) => void;
  loading: boolean;
}

export function AIGenerateDialog({
  open,
  onOpenChange,
  onGenerate,
  loading,
}: AIGenerateDialogProps) {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [duration, setDuration] = useState(6);
  const [videoModel, setVideoModel] = useState("veo-3.1-generate-preview");

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    
    if (mediaType === 'video') {
      onGenerate(prompt, aspectRatio, 'video', { duration, model: videoModel });
    } else {
      onGenerate(prompt, aspectRatio, 'image');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Generate Media with AI</DialogTitle>
          <DialogDescription>
            {mediaType === 'image' 
              ? "Describe the image you want to create."
              : "Describe the video scene you want to generate. This may take 1-3 minutes."
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Tabs value={mediaType} onValueChange={(v) => setMediaType(v as 'image' | 'video')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="image" className="gap-2">
                <ImageIcon className="w-4 h-4" />
                Image
              </TabsTrigger>
              <TabsTrigger value="video" className="gap-2">
                <Video className="w-4 h-4" />
                Video
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-2">
            <Label htmlFor="prompt">
              {mediaType === 'image' ? 'Image' : 'Video'} Description
            </Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                mediaType === 'image'
                  ? "A majestic sunset over snow-capped mountains, golden hour lighting, cinematic composition..."
                  : "A robot walking through a futuristic city at night, neon lights reflecting on wet streets..."
              }
              className="min-h-[120px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="aspect-ratio">Aspect Ratio</Label>
            <Select value={aspectRatio} onValueChange={setAspectRatio}>
              <SelectTrigger id="aspect-ratio">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                {mediaType === 'image' && (
                  <>
                    <SelectItem value="1:1">1:1 (Square)</SelectItem>
                    <SelectItem value="4:3">4:3 (Standard)</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          {mediaType === 'video' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Select value={duration.toString()} onValueChange={(v) => setDuration(parseInt(v))}>
                  <SelectTrigger id="duration">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4">4 seconds</SelectItem>
                    <SelectItem value="6">6 seconds</SelectItem>
                    <SelectItem value="8">8 seconds</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="video-model">Model</Label>
                <Select value={videoModel} onValueChange={setVideoModel}>
                  <SelectTrigger id="video-model">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="veo-3.1-generate-preview">Veo 3.1 (Quality)</SelectItem>
                    <SelectItem value="veo-3.1-fast-generate-preview">Veo 3.1 Fast (Speed)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} disabled={loading || !prompt.trim()} className="gap-2">
            <Sparkles className="w-4 h-4" />
            {loading ? (mediaType === 'video' ? "Generating video..." : "Generating...") : "Generate"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
