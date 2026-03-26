import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Creative Director step: Gemini 3 analyzes the user prompt and enhances it
 * with cinematic direction — shot composition, camera movement, lighting,
 * pacing — mirroring NotebookLM's multi-model pipeline.
 */
async function enhancePromptWithCreativeDirector(
  prompt: string,
  aspectRatio: string,
  duration: number,
  lovableApiKey: string
): Promise<string> {
  const directorSystemPrompt = `You are a cinematic creative director — the same role Gemini plays in Google's NotebookLM pipeline. 
Your job is to take a raw scene description and transform it into a production-ready video prompt optimized for Veo 3.1.

You must specify:
1. CAMERA: Exact camera movement (dolly, crane, steadicam, handheld, locked-off, orbital)
2. COMPOSITION: Frame composition, depth of field, focal length feel (wide, telephoto compression)
3. LIGHTING: Specific lighting setup (golden hour, Rembrandt, neon-noir, overcast diffusion, etc.)
4. MOTION: Subject motion and timing within the ${duration}-second clip
5. COLOR GRADE: Color palette and mood (teal-orange, desaturated, high-contrast, pastel)
6. TRANSITIONS: How the shot opens and closes (fade from black, rack focus, etc.)
7. ATMOSPHERE: Particles, fog, rain, dust motes, lens flares if appropriate

Aspect ratio: ${aspectRatio}
Duration: ${duration} seconds

Output ONLY the enhanced prompt as a single dense paragraph (200-350 words). No headers, no bullet points, no explanations.`;

  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${lovableApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-3-flash-preview',
      messages: [
        { role: 'system', content: directorSystemPrompt },
        { role: 'user', content: `Enhance this scene for cinematic video generation:\n\n${prompt}` }
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    console.warn('Creative director enhancement failed, using original prompt');
    return prompt;
  }

  const data = await response.json();
  const enhanced = data.choices?.[0]?.message?.content;
  return enhanced || prompt;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      prompt, 
      aspectRatio = '16:9', 
      duration = 6, 
      model = 'veo-3.1-generate-preview',
      skipDirector = false 
    } = await req.json();
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (![4, 6, 8].includes(duration)) {
      return new Response(
        JSON.stringify({ error: 'Duration must be 4, 6, or 8 seconds for Veo 3 models' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // ── Step 1: Creative Director enhancement (Gemini 3) ──
    let finalPrompt = prompt;
    if (!skipDirector && LOVABLE_API_KEY) {
      console.log('Step 1: Creative Director enhancing prompt with Gemini 3...');
      finalPrompt = await enhancePromptWithCreativeDirector(
        prompt, aspectRatio, duration, LOVABLE_API_KEY
      );
      console.log('Enhanced prompt length:', finalPrompt.length);
    } else {
      console.log('Skipping Creative Director step');
    }

    // ── Step 2: Video generation via Veo 3.1 ──
    console.log(`Step 2: Generating video with model: ${model}`);
    
    const generateResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:predictLongRunning?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instances: [{ prompt: finalPrompt }],
          parameters: {
            aspectRatio: aspectRatio,
            durationSeconds: duration,
            resolution: '720p',
            sampleCount: 1
          }
        }),
      }
    );

    if (!generateResponse.ok) {
      const errorText = await generateResponse.text();
      console.error('Video generation error:', generateResponse.status, errorText);
      throw new Error(`Video generation failed: ${errorText}`);
    }

    const operationData = await generateResponse.json();
    const operationName = operationData.name;
    console.log('Video generation started:', operationName);

    // ── Step 3: Poll for completion (max 5 minutes) ──
    let videoData = null;
    const maxAttempts = 60;
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const statusResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/${operationName}?key=${GEMINI_API_KEY}`
      );

      if (!statusResponse.ok) {
        console.error('Status check failed:', statusResponse.status);
        continue;
      }

      const statusData = await statusResponse.json();
      
      if (statusData.done) {
        if (statusData.error) {
          throw new Error(`Video generation failed: ${JSON.stringify(statusData.error)}`);
        }
        videoData = statusData.response;
        console.log('Video generation complete!');
        break;
      }
      
      console.log(`Polling attempt ${attempt + 1}/${maxAttempts}...`);
    }

    if (!videoData) {
      throw new Error('Video generation timed out or failed to return video data');
    }

    // ── Step 4: Download and upload to Supabase Storage ──
    const videoUri = videoData.generateVideoResponse?.generatedSamples?.[0]?.video?.uri;
    
    if (!videoUri) {
      console.error('Could not find video URI in response:', JSON.stringify(videoData, null, 2));
      throw new Error('No video URI returned from generation');
    }

    const downloadUrl = `${videoUri}&key=${GEMINI_API_KEY}`;
    console.log('Downloading video...');

    const downloadResponse = await fetch(downloadUrl);
    if (!downloadResponse.ok) {
      const errorText = await downloadResponse.text();
      console.error('Video download error:', downloadResponse.status, errorText);
      throw new Error(`Failed to download video: ${errorText}`);
    }

    const videoBuffer = new Uint8Array(await downloadResponse.arrayBuffer());
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const fileName = `${crypto.randomUUID()}.mp4`;
    
    const { error: uploadError } = await supabase.storage
      .from('story-media')
      .upload(fileName, videoBuffer, {
        contentType: 'video/mp4',
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error(`Failed to upload video: ${uploadError.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('story-media')
      .getPublicUrl(fileName);

    console.log('Video uploaded successfully:', publicUrl);

    return new Response(
      JSON.stringify({ 
        url: publicUrl,
        model,
        duration,
        aspectRatio,
        directorEnhanced: !skipDirector && !!LOVABLE_API_KEY
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-video:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
