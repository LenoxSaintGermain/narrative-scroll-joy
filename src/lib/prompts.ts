// AI Story Generation Prompt Templates

export const STORY_STRUCTURE_PROMPT = `You are a master storyteller creating a scrollytelling experience.

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

export const VISUAL_PROMPT_TEMPLATE = `You are a professional cinematographer and visual director creating detailed prompts for AI image/video generation.

Story Context: {storyTitle} - {storyDescription}
Visual Style: {visualStyle}
Target Audience: {targetAudience}

Beat Details:
- Number: {beatNumber} of {totalBeats}
- Title: {beatTitle}
- Narrative: {narrativeText}
- Type: {mediaType}
- Visual Concept: {visualConcept}

Previous Beat Summary: {previousBeat}
Next Beat Summary: {nextBeat}

Generate a complete standalone prompt (200-400 words) that includes:
1. Full scene description with environment and atmosphere
2. Character details with consistency notes (appearance, clothing, expressions)
3. Camera work (angles, movement, framing - use cinematic terminology)
4. Lighting and color palette (specific colors, mood lighting)
5. Art style and technical specifications
6. For videos: timing breakdown and motion description

CRITICAL RULES:
- This prompt will be sent in isolation, so include ALL context needed
- Maintain visual consistency with the overall style: {visualStyle}
- Use specific, descriptive language - avoid vague terms
- Include aspect ratio: 16:9
- For {targetAudience} audience, ensure appropriate tone and imagery

Output the prompt as plain text, no JSON wrapping, no markdown formatting.`;

export const FRAMEWORK_BEAT_GUIDES: Record<string, string[]> = {
  "Hero's Journey": [
    "Ordinary World - Establish the hero in their normal life",
    "Call to Adventure - Something disrupts the status quo",
    "Refusal of the Call - Hero hesitates or fears change",
    "Meeting the Mentor - A guide appears with wisdom",
    "Crossing the Threshold - Hero commits to the journey",
    "Tests, Allies, Enemies - Challenges and new relationships",
    "Approach to the Inmost Cave - Preparation for major challenge",
    "Ordeal - The hero faces their greatest fear",
    "Reward - Victory and gaining something valuable",
    "The Road Back - Beginning the return journey",
    "Resurrection - Final test and transformation",
    "Return with the Elixir - Hero returns changed"
  ],
  "Three-Act Structure": [
    "Setup - Introduce world and characters",
    "Inciting Incident - Event that starts the story",
    "Rising Action - Complications increase",
    "Midpoint - Major revelation or shift",
    "Escalation - Stakes get higher",
    "Crisis - Everything falls apart",
    "Climax - Final confrontation",
    "Resolution - New equilibrium"
  ],
  "Five-Act Structure": [
    "Exposition - World and character introduction",
    "Rising Action - Conflict develops",
    "Climax - Peak of tension",
    "Falling Action - Consequences unfold",
    "Resolution - Story concludes"
  ],
  "Save the Cat": [
    "Opening Image - Visual that sets the tone",
    "Theme Stated - Hint at the story's message",
    "Setup - Establish the world",
    "Catalyst - The event that changes everything",
    "Debate - Hero questions what to do",
    "Break into Two - Decision to act",
    "B Story - Subplot begins",
    "Fun and Games - The promise of the premise",
    "Midpoint - False victory or defeat",
    "Bad Guys Close In - Opposition strengthens",
    "All Is Lost - Lowest point",
    "Dark Night of the Soul - Despair before breakthrough",
    "Break into Three - Solution discovered",
    "Finale - Final battle/confrontation",
    "Final Image - Mirror of opening, showing change"
  ],
  "Freeform": [
    "Opening - Set the scene",
    "Development - Build the narrative",
    "Climax - Peak moment",
    "Conclusion - Wrap up the story"
  ]
};

export const AUDIENCE_STYLE_HINTS: Record<string, string> = {
  "Kids": "bright colors, friendly characters, simple compositions, wonder and magic, safe and warm atmosphere",
  "Teens": "dynamic angles, bold contrasts, relatable emotions, contemporary style, energetic mood",
  "Adults": "sophisticated compositions, nuanced lighting, complex emotions, cinematic quality",
  "Therapeutic": "calming colors, soft lighting, safe spaces, gentle transitions, peaceful atmosphere",
  "Corporate": "professional aesthetic, clean lines, confident postures, modern environments, aspirational tone"
};
