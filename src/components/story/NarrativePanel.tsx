import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface NarrativePanelProps {
  content: string;
  onChange: (content: string) => void;
  frameId: string;
}

export function NarrativePanel({ content, onChange, frameId }: NarrativePanelProps) {
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);

  const handleAIAssist = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-text', {
        body: {
          prompt: content || "Continue the narrative",
          context: content,
          type: 'narrative'
        }
      });

      if (error) throw error;

      onChange(data.generatedText);
      toast({ title: "AI generated narrative!" });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error generating text",
        description: error.message,
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="p-6 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Narrative Content</h3>
        <Button
          size="sm"
          variant="outline"
          onClick={handleAIAssist}
          disabled={generating}
          className="gap-2"
        >
          <Sparkles className="w-4 h-4" />
          AI Assist
        </Button>
      </div>
      
      <Textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write your narrative here... or use AI to help you get started."
        className="flex-1 min-h-[320px] resize-none"
      />
    </div>
  );
}
