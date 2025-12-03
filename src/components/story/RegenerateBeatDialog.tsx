import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RegenerateBeatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  frameId: string;
  currentNarrative: string;
  currentVisualPrompt: string;
  onRegenerated: (newPrompt: string) => void;
}

export function RegenerateBeatDialog({
  open,
  onOpenChange,
  frameId,
  currentNarrative,
  currentVisualPrompt,
  onRegenerated,
}: RegenerateBeatDialogProps) {
  const { toast } = useToast();
  const [narrative, setNarrative] = useState(currentNarrative);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleRegenerate = async () => {
    setIsRegenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('regenerate-beat', {
        body: {
          frameId,
          modifications: {
            narrative: narrative !== currentNarrative ? narrative : undefined,
            additionalNotes: additionalNotes || undefined,
          }
        }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      onRegenerated(data.visual_prompt);
      
      toast({
        title: "Beat regenerated!",
        description: "Visual prompt has been updated."
      });

      onOpenChange(false);

    } catch (error: any) {
      console.error('Regenerate error:', error);
      toast({
        variant: "destructive",
        title: "Regeneration failed",
        description: error.message || 'Something went wrong'
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-primary" />
            Regenerate Visual Prompt
          </DialogTitle>
          <DialogDescription>
            Modify the narrative or add notes to guide the AI in creating a new visual prompt.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Current Visual Prompt Preview */}
          {currentVisualPrompt && (
            <div>
              <Label className="text-sm text-muted-foreground">Current Visual Prompt</Label>
              <div className="mt-1 p-3 rounded-md bg-muted/50 text-sm max-h-32 overflow-y-auto">
                {currentVisualPrompt.substring(0, 300)}
                {currentVisualPrompt.length > 300 && '...'}
              </div>
            </div>
          )}

          {/* Narrative Text */}
          <div>
            <Label htmlFor="narrative">Narrative Text</Label>
            <p className="text-xs text-muted-foreground mb-2">
              Edit the narrative to change what the AI visualizes
            </p>
            <Textarea
              id="narrative"
              value={narrative}
              onChange={(e) => setNarrative(e.target.value)}
              placeholder="The narrative text for this beat..."
              className="min-h-[80px]"
              disabled={isRegenerating}
            />
          </div>

          {/* Additional Notes */}
          <div>
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <p className="text-xs text-muted-foreground mb-2">
              Add specific instructions for the AI (e.g., "make it more dramatic", "add rain")
            </p>
            <Textarea
              id="notes"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="e.g., 'Focus on close-up of character's expression', 'Use warmer colors', 'Add motion blur'..."
              className="min-h-[60px]"
              disabled={isRegenerating}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isRegenerating}>
            Cancel
          </Button>
          <Button onClick={handleRegenerate} disabled={isRegenerating} className="gap-2">
            {isRegenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Regenerating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Regenerate Prompt
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
