
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

    const systemPrompt = `You are a professional software developer. Generate clean, production-ready code based on the user's prompt.

Format your response as JSON with:
- "heading": A descriptive title based on the prompt
- "code": The generated code as a string

The code should:
- Be well-commented and follow best practices
- Be production-ready and efficient
- Include proper error handling where appropriate
- Use modern syntax and conventions

Example format:
{
  "heading": "React Authentication Component",
  "code": "import React, { useState } from 'react';\n\nconst AuthComponent = () => {\n  // Component code here\n};\n\nexport default AuthComponent;"
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
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 800,
          }
        }),
      }
    );

    const data = await response.json();
    
    if (data.error) {
      console.error('Gemini API error:', data.error);
      return new Response(
        JSON.stringify({ 
          heading: "Error generating code",
          code: "// Please try again"
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
          heading: `Code: ${prompt}`,
          code: "// Code generation failed, please try again"
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    }
  } catch (error) {
    console.error('Error in generate-code function:', error);
    return new Response(
      JSON.stringify({ 
        heading: "Error",
        code: "// Please try again"
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
    );
  }
});
