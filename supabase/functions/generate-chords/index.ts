
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const geminiApiKey = Deno.env.get('gemini_api_key');
    
    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    }

    const { prompt } = await req.json();

    const systemPrompt = `You are a professional music theory expert. Generate exactly 5 chord progressions based on the user's prompt. 

Format your response as JSON with:
- "heading": A descriptive title based on the prompt (e.g., "Chord Progressions: Mellow intro in A major")
- "chords": An array of exactly 5 chord progression strings

Each chord progression should:
- Use proper chord notation (e.g., Am7, F#dim, C6/9, etc.)
- Be musically logical and sound good together
- Include various chord types (major, minor, 7th, 9th, augmented, diminished, etc.)
- Be appropriate for the mood/style described in the prompt

Example format:
{
  "heading": "Chord Progressions: Bittersweet in G minor",
  "chords": [
    "Gm - Bb - F - C7",
    "Gm - Eb - Bb - F",
    "Gm7 - Cm - F7 - Bb",
    "Gm - D7 - Eb - Bb/D",
    "Gm - F#dim - Gm/Bb - C7"
  ]
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nUser prompt: ${prompt}` }]
            }
          ],
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 400,
          }
        }),
      }
    );

    const data = await response.json();
    
    if (data.error) {
      console.error('Gemini API error:', data.error);
      return new Response(
        JSON.stringify({ 
          heading: "Error generating chords",
          chords: ["Please try again"]
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    }

    let responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    try {
      const cleanJson = responseText.replace(/```json\n?|\n?```/g, '').trim();
      const result = JSON.parse(cleanJson);
      
      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    } catch (parseError) {
      return new Response(
        JSON.stringify({ 
          heading: `Chord Progressions: ${prompt}`,
          chords: [
            "Am - F - C - G",
            "Em - C - G - D",
            "Dm - Bb - F - C",
            "Gm - Eb - Bb - F",
            "F#m - D - A - E"
          ]
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    }
  } catch (error) {
    console.error('Error in generate-chords function:', error);
    return new Response(
      JSON.stringify({ 
        heading: "Error",
        chords: ["Please try again"]
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
    );
  }
});
