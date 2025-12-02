import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { narrative_id, title, description } = await req.json();
    
    if (!narrative_id) {
      throw new Error('narrative_id is required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch story details if not provided
    let storyTitle = title;
    let storyDescription = description;
    
    if (!storyTitle || !storyDescription) {
      const { data: narrative } = await supabase
        .from('narratives')
        .select('title, description')
        .eq('id', narrative_id)
        .single();
      
      storyTitle = storyTitle || narrative?.title || 'Untitled Story';
      storyDescription = storyDescription || narrative?.description || '';
    }

    console.log('Generating cover for:', storyTitle);

    // Generate a cinematic movie poster prompt using AI
    const promptResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a creative director for movie posters. Generate a vivid, cinematic image prompt for an AI image generator. 
Focus on:
- Dramatic lighting and atmosphere
- Iconic visual metaphors
- Bold color palettes
- Emotional resonance
Keep the prompt under 200 words. Output ONLY the image prompt, no explanations.`
          },
          {
            role: 'user',
            content: `Create a cinematic movie poster prompt for this story:
Title: ${storyTitle}
Description: ${storyDescription || 'A compelling narrative adventure'}`
          }
        ],
      }),
    });

    if (!promptResponse.ok) {
      const errorText = await promptResponse.text();
      console.error('Prompt generation failed:', errorText);
      throw new Error('Failed to generate cover prompt');
    }

    const promptData = await promptResponse.json();
    const coverPrompt = promptData.choices?.[0]?.message?.content || 
      `Cinematic movie poster for "${storyTitle}", dramatic lighting, bold typography, atmospheric`;

    console.log('Generated prompt:', coverPrompt);

    // Generate the image using Gemini Flash Image
    const imageResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: `Create a vertical movie poster (2:3 aspect ratio) with this concept: ${coverPrompt}. 
Style: Cinematic, dramatic, professional movie poster quality. No text or titles on the image.`
          }
        ],
        modalities: ['image', 'text'],
      }),
    });

    if (!imageResponse.ok) {
      if (imageResponse.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded, try again later' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (imageResponse.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits depleted' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error('Image generation failed');
    }

    const imageData = await imageResponse.json();
    const base64Image = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!base64Image) {
      throw new Error('No image generated');
    }

    // Extract base64 data and upload to storage
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const imageBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    const fileName = `covers/${narrative_id}_${Date.now()}.png`;
    
    const { error: uploadError } = await supabase.storage
      .from('story-media')
      .upload(fileName, imageBytes, {
        contentType: 'image/png',
        upsert: true,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error('Failed to upload cover image');
    }

    const { data: { publicUrl } } = supabase.storage
      .from('story-media')
      .getPublicUrl(fileName);

    // Update narrative with new cover
    const { error: updateError } = await supabase
      .from('narratives')
      .update({ 
        thumbnail_url: publicUrl,
        ai_cover_prompt: coverPrompt 
      })
      .eq('id', narrative_id);

    if (updateError) {
      console.error('Update error:', updateError);
    }

    console.log('Cover generated successfully:', publicUrl);

    return new Response(JSON.stringify({ 
      coverUrl: publicUrl,
      prompt: coverPrompt 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-story-cover:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
