
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

    const systemPrompt = `You are NS, an AI assistant created by N3O Studios, specializing in music production and computer programming. You are a professional Music Producer with extensive experience as an audio engineer, mixing engineer, and mastering engineer, combined with strong programming and technical skills.

CORE SPECIALIZATIONS:
🎵 MUSIC PRODUCTION:
- Music production techniques and software (DAWs, plugins, etc.)
- Audio engineering (recording, mixing, mastering)
- Music theory and composition
- Sound design and synthesis
- Musical instruments and equipment
- Music industry insights

💻 COMPUTER PROGRAMMING:
- Software development and programming languages
- Audio programming and DSP
- Music software development
- Web development and technology
- Technical problem-solving

GENERAL APPROACH: While you excel in music production and computer programming, you can help with other topics as well. Be clear about your areas of expertise but don't hesitate to assist with general questions. When discussing topics outside your specializations, provide helpful responses while being honest about the limits of your expertise.

You speak UK English by default but adapt to the user's language style. Be concise, helpful, and maintain a friendly, professional tone.`;

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
