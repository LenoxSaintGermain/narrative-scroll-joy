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
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { frameId, modifications } = await req.json();

    if (!frameId) {
      return new Response(JSON.stringify({ error: 'Missing frame ID' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Fetch frame with context
    const { data: frame, error: frameError } = await supabase
      .from('frames')
      .select(`
        *,
        chapter:chapters!inner(
          narrative:narratives!inner(
            id, title, description, visual_style, target_audience, user_id
          )
        )
      `)
      .eq('id', frameId)
      .single();

    if (frameError || !frame) {
      return new Response(JSON.stringify({ error: 'Frame not found' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Verify ownership
    if (frame.chapter.narrative.user_id !== user.id) {
      return new Response(JSON.stringify({ error: 'Not authorized' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get adjacent frames for context
    const { data: allFrames } = await supabase
      .from('frames')
      .select('id, order_index, beat_title, narrative_content')
      .eq('chapter_id', frame.chapter_id)
      .order('order_index');

    const currentIndex = allFrames?.findIndex(f => f.id === frameId) ?? -1;
    const prevFrame = currentIndex > 0 ? allFrames![currentIndex - 1] : null;
    const nextFrame = currentIndex < (allFrames?.length ?? 0) - 1 ? allFrames![currentIndex + 1] : null;

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const narrative = frame.chapter.narrative;
    const prompt = `You are a professional cinematographer creating detailed prompts for AI image/video generation.

Story: ${narrative.title} - ${narrative.description || ''}
Visual Style: ${narrative.visual_style || 'Cinematic, high quality'}
Audience: ${narrative.target_audience || 'General'}

Current Beat: ${frame.beat_title || `Frame ${frame.order_index + 1}`}
Narrative: ${modifications?.narrative || frame.narrative_content || ''}
Type: ${frame.media_type || 'image'}

Previous Beat: ${prevFrame ? `${prevFrame.beat_title}: ${prevFrame.narrative_content}` : 'None (first beat)'}
Next Beat: ${nextFrame ? `${nextFrame.beat_title}: ${nextFrame.narrative_content}` : 'None (final beat)'}

${modifications?.additionalNotes ? `Additional Notes: ${modifications.additionalNotes}` : ''}

Generate a complete standalone prompt (200-400 words) including:
1. Full scene description with environment
2. Character details (appearance, clothing, expressions)
3. Camera work (angles, movement, framing)
4. Lighting and color palette
5. Art style specifications
${frame.media_type === 'video' ? '6. Motion and timing description' : ''}

Use 16:9 aspect ratio. Output plain text only.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are a professional cinematographer. Output plain text prompts only.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const newVisualPrompt = data.choices[0].message.content;

    // Update frame with new visual prompt
    const { error: updateError } = await supabase
      .from('frames')
      .update({
        visual_prompt: newVisualPrompt,
        narrative_content: modifications?.narrative || frame.narrative_content,
        ai_prompt_history: [
          ...(frame.ai_prompt_history || []),
          {
            timestamp: new Date().toISOString(),
            prompt: newVisualPrompt,
            modifications
          }
        ]
      })
      .eq('id', frameId);

    if (updateError) {
      throw new Error('Failed to update frame');
    }

    // Log generation
    await supabase.from('generation_logs').insert({
      user_id: user.id,
      narrative_id: narrative.id,
      operation_type: 'regenerate_beat',
      model_used: 'google/gemini-2.5-flash',
      prompt_preview: (modifications?.narrative || frame.narrative_content || '').substring(0, 200)
    });

    return new Response(JSON.stringify({
      success: true,
      visual_prompt: newVisualPrompt
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Regenerate beat error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
