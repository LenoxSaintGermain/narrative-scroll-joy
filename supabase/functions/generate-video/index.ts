import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { prompt, aspectRatio = '16:9', duration = 6, model = 'veo-3.1-generate-preview' } = await req.json();
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate duration is one of the allowed values for Veo 3 models (4, 6, or 8 seconds)
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

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    console.log(`Starting video generation with model: ${model}`);
    
    // Start video generation (async operation)
    const generateResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:predictLongRunning?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instances: [
            {
              prompt: prompt
            }
          ],
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

    // Poll for completion (max 5 minutes)
    let videoData = null;
    const maxAttempts = 60; // 5 minutes (5 second intervals)
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      
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

    if (!videoData || !videoData.video) {
      throw new Error('Video generation timed out or failed to return video data');
    }

    // Get base64 video data
    const videoBase64 = videoData.video.videoData;
    if (!videoBase64) {
      throw new Error('No video data returned from generation');
    }

    // Convert base64 to blob
    const videoBuffer = Uint8Array.from(atob(videoBase64), c => c.charCodeAt(0));
    
    // Upload to Supabase Storage
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const fileName = `${crypto.randomUUID()}.mp4`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('story-media')
      .upload(fileName, videoBuffer, {
        contentType: 'video/mp4',
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error(`Failed to upload video: ${uploadError.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('story-media')
      .getPublicUrl(fileName);

    console.log('Video uploaded successfully:', publicUrl);

    return new Response(
      JSON.stringify({ 
        url: publicUrl,
        model: model,
        duration: duration,
        aspectRatio: aspectRatio
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
