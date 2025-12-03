import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const STORY_STRUCTURE_PROMPT = `You are a master storyteller creating a scrollytelling experience.

Theme: {theme}
Audience: {targetAudience}
Framework: {framework}
Length: {storyLength} beats

Generate a compelling story with the following requirements:
1. Follow the {framework} narrative structure
2. Create exactly {storyLength} distinct beats
3. Each beat should have punchy, evocative narrative text (1-2 sentences max)
4. Recommend whether each beat should be IMAGE or VIDEO based on action/emotion
5. For video beats, suggest duration (4, 6, or 8 seconds only)

Return ONLY valid JSON in this exact format:
{
  "story_title": "Compelling title here",
  "story_description": "2-3 sentence story description",
  "beats": [
    {
      "beat_number": 1,
      "title": "Beat title",
      "narrative_text": "1-2 sentence narrative",
      "media_type": "IMAGE" or "VIDEO",
      "duration_seconds": 0,
      "visual_concept": "Brief 1-sentence visual concept"
    }
  ]
}`;

const VISUAL_PROMPT_TEMPLATE = `You are a professional cinematographer creating detailed prompts for AI image/video generation.

Story: {storyTitle} - {storyDescription}
Visual Style: {visualStyle}
Audience: {targetAudience}

Beat {beatNumber}/{totalBeats}: {beatTitle}
Narrative: {narrativeText}
Type: {mediaType}
Concept: {visualConcept}

Previous: {previousBeat}
Next: {nextBeat}

Generate a complete standalone prompt (200-400 words) including:
1. Full scene description with environment
2. Character details (appearance, clothing, expressions)
3. Camera work (angles, movement, framing)
4. Lighting and color palette
5. Art style specifications
6. For videos: motion description

Use 16:9 aspect ratio. Output plain text only.`;

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

    const { theme, targetAudience, framework, storyLength, visualStyle } = await req.json();

    if (!theme || !targetAudience || !framework || !storyLength) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Rate limiting: check generations in last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from('generation_logs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('operation_type', 'story_structure')
      .gte('created_at', twentyFourHoursAgo);

    if (count && count >= 10) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded. Max 10 story generations per day.' }), {
        status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Parse story length
    const lengthMap: Record<string, number> = {
      'Short (5-7 beats)': 6,
      'Medium (8-12 beats)': 10,
      'Long (13-20 beats)': 15
    };
    const beatCount = lengthMap[storyLength] || 8;

    // Step 1: Generate story structure
    console.log('Step 1: Generating story structure...');
    const structurePrompt = STORY_STRUCTURE_PROMPT
      .replace(/{theme}/g, theme)
      .replace(/{targetAudience}/g, targetAudience)
      .replace(/{framework}/g, framework)
      .replace(/{storyLength}/g, String(beatCount));

    const structureResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are a master storyteller. Return ONLY valid JSON, no markdown.' },
          { role: 'user', content: structurePrompt }
        ],
        temperature: 0.8,
      }),
    });

    if (!structureResponse.ok) {
      const errorText = await structureResponse.text();
      console.error('Structure generation failed:', errorText);
      throw new Error(`AI gateway error: ${structureResponse.status}`);
    }

    const structureData = await structureResponse.json();
    let storyStructure;
    
    try {
      const content = structureData.choices[0].message.content;
      // Extract JSON from potential markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      storyStructure = JSON.parse(jsonMatch[1].trim());
    } catch (e) {
      console.error('Failed to parse story structure:', e);
      throw new Error('Failed to parse AI response');
    }

    // Log structure generation
    await supabase.from('generation_logs').insert({
      user_id: user.id,
      operation_type: 'story_structure',
      model_used: 'google/gemini-2.5-flash',
      prompt_preview: theme.substring(0, 200)
    });

    // Step 2: Generate visual prompts for each beat
    console.log('Step 2: Generating visual prompts...');
    const visualPrompts: string[] = [];
    
    for (let i = 0; i < storyStructure.beats.length; i++) {
      const beat = storyStructure.beats[i];
      const prevBeat = i > 0 ? storyStructure.beats[i - 1].visual_concept : 'None (this is the first beat)';
      const nextBeat = i < storyStructure.beats.length - 1 ? storyStructure.beats[i + 1].visual_concept : 'None (this is the final beat)';

      const visualPrompt = VISUAL_PROMPT_TEMPLATE
        .replace(/{storyTitle}/g, storyStructure.story_title)
        .replace(/{storyDescription}/g, storyStructure.story_description)
        .replace(/{visualStyle}/g, visualStyle || 'Cinematic, high quality')
        .replace(/{targetAudience}/g, targetAudience)
        .replace(/{beatNumber}/g, String(i + 1))
        .replace(/{totalBeats}/g, String(storyStructure.beats.length))
        .replace(/{beatTitle}/g, beat.title)
        .replace(/{narrativeText}/g, beat.narrative_text)
        .replace(/{mediaType}/g, beat.media_type)
        .replace(/{visualConcept}/g, beat.visual_concept)
        .replace(/{previousBeat}/g, prevBeat)
        .replace(/{nextBeat}/g, nextBeat);

      const visualResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: 'You are a professional cinematographer. Output plain text prompts only, no markdown or JSON.' },
            { role: 'user', content: visualPrompt }
          ],
          temperature: 0.7,
        }),
      });

      if (!visualResponse.ok) {
        console.error(`Visual prompt ${i + 1} failed`);
        visualPrompts.push(`Scene ${i + 1}: ${beat.visual_concept}`);
        continue;
      }

      const visualData = await visualResponse.json();
      visualPrompts.push(visualData.choices[0].message.content);
    }

    // Log visual prompt generation
    await supabase.from('generation_logs').insert({
      user_id: user.id,
      operation_type: 'visual_prompts',
      model_used: 'google/gemini-2.5-flash',
      prompt_preview: `${storyStructure.beats.length} beats generated`
    });

    // Step 3: Create narrative, chapter, and frames in database
    console.log('Step 3: Saving to database...');
    
    // Create narrative
    const { data: narrative, error: narrativeError } = await supabase
      .from('narratives')
      .insert({
        user_id: user.id,
        title: storyStructure.story_title,
        description: storyStructure.story_description,
        status: 'draft',
        generated_by: 'ai',
        generation_prompt: theme,
        target_audience: targetAudience,
        visual_style: visualStyle || null,
        generation_metadata: {
          framework,
          story_length: storyLength,
          beat_count: storyStructure.beats.length,
          generated_at: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (narrativeError) {
      console.error('Narrative creation failed:', narrativeError);
      throw new Error('Failed to create narrative');
    }

    // Create default chapter
    const { data: chapter, error: chapterError } = await supabase
      .from('chapters')
      .insert({
        narrative_id: narrative.id,
        title: 'Chapter 1',
        order_index: 0
      })
      .select()
      .single();

    if (chapterError) {
      console.error('Chapter creation failed:', chapterError);
      throw new Error('Failed to create chapter');
    }

    // Create frames for each beat
    const framesData = storyStructure.beats.map((beat: any, index: number) => ({
      chapter_id: chapter.id,
      order_index: index,
      narrative_content: beat.narrative_text,
      beat_title: beat.title,
      visual_prompt: visualPrompts[index] || beat.visual_concept,
      media_type: beat.media_type.toLowerCase(),
      duration: beat.media_type === 'VIDEO' ? (beat.duration_seconds || 6) : 0
    }));

    const { error: framesError } = await supabase
      .from('frames')
      .insert(framesData);

    if (framesError) {
      console.error('Frames creation failed:', framesError);
      throw new Error('Failed to create frames');
    }

    console.log('Story generation complete!');

    return new Response(JSON.stringify({
      success: true,
      narrative_id: narrative.id,
      title: storyStructure.story_title,
      beat_count: storyStructure.beats.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Generate story error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
