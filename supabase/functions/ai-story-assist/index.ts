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
    const { 
      narrativeId,
      currentBeat,
      previousFrames,
      userPrompt 
    } = await req.json();

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Build context from previous frames
    let contextText = '';
    if (previousFrames && previousFrames.length > 0) {
      contextText = 'Story so far:\n' + previousFrames.map((frame: any, idx: number) => 
        `Frame ${idx + 1}: ${frame.narrative_content}`
      ).join('\n\n');
    }

    // Build beat guidance context
    let beatGuidance = '';
    if (currentBeat) {
      beatGuidance = `\n\nCurrent story beat: ${currentBeat.beat_name}\nGuidance: ${currentBeat.guidance_text}`;
    }

    const systemPrompt = `You are an expert storytelling assistant helping a writer craft their narrative. 
Your role is to provide suggestions that:
- Align with the current story beat and framework
- Maintain consistency with previous story elements
- Enhance emotional impact and narrative flow
- Respect the writer's creative vision

Provide concise, actionable suggestions that the writer can build upon.`;

    const messages = [
      { role: 'system', content: systemPrompt }
    ];

    if (contextText) {
      messages.push({ role: 'user', content: contextText });
    }

    if (beatGuidance) {
      messages.push({ role: 'user', content: beatGuidance });
    }

    messages.push({ 
      role: 'user', 
      content: `Writer's prompt: ${userPrompt}\n\nProvide creative suggestions for developing this scene.` 
    });

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('AI gateway error');
    }

    const data = await response.json();
    const suggestion = data.choices?.[0]?.message?.content || '';

    return new Response(
      JSON.stringify({ suggestion }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-story-assist:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});