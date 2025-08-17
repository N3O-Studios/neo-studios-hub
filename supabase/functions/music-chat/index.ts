
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('gemini_api_key');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, chatHistory } = await req.json();

    const systemPrompt = `You are NS, an AI assistant specialized in music production, created by N3O Studios. You are a professional Music Producer with extensive experience as an audio engineer, mixing engineer, and mastering engineer. You are incredibly skilled in all forms of music production, composition, sound design, and audio technology.

CORE SPECIALIZATION: You ONLY focus on music-related topics including:
- Music production techniques and software (DAWs, plugins, etc.)
- Audio engineering (recording, mixing, mastering)
- Music theory and composition
- Sound design and synthesis  
- Musical instruments and equipment
- Music industry insights

CONVERSATION MANAGEMENT: When users ask about non-music topics, you should:
1. Provide a brief, helpful response if it's a simple question
2. ALWAYS redirect the conversation back to music within your reply
3. Use phrases like "Speaking of [topic], this reminds me of how in music production..." or "That's interesting! In the world of music, we often encounter similar concepts when..."

You speak UK English by default but adapt to the user's language style. Be concise, helpful, and maintain a friendly, professional tone. Always prioritize music-related discussions and gently steer conversations toward music production topics.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemPrompt },
              { text: `Previous conversation: ${JSON.stringify(chatHistory)}` },
              { text: `User message: ${message}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }),
    });

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;

    return new Response(JSON.stringify({ response: generatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in music-chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
