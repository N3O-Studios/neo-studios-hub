
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const geminiApiKey = Deno.env.get('gemini_api_key');
    const customIdentity = Deno.env.get('cb_ident') || 'I\'m NS, an AI assistant.';
    
    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    }

    // Get the request body
    const { message, chatHistory, useCustomIdentity } = await req.json();
    
    // Format previous messages for the Gemini API
    const formattedHistory = chatHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Create system prompt with enhanced capabilities including advanced math
    const systemPrompt = `${customIdentity} 
You can use markdown formatting:
- **bold text** for emphasis
- *italic text* for emphasis
- # Headers of different levels
- Mathematical expressions using LaTeX notation like $E=mc^2$
- Code blocks with \`\`\`language\ncode\n\`\`\`
- Lists and tables

For mathematical equations, please use LaTeX notation within $ for inline equations or $$ for block equations. 
Examples:
- Simple equations: $x^2 + 2x + 1 = 0$
- Complex integrals: $$\\int_{0}^{\\infty} e^{-x} dx = 1$$
- Matrices: $$\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}$$
- Fractions: $\\frac{1}{2} + \\frac{1}{3} = \\frac{5}{6}$
- Greek symbols: $\\alpha, \\beta, \\gamma, \\Delta, \\sum_{i=0}^{n}$
- Limits: $\\lim_{x \\to 0} \\frac{\\sin(x)}{x} = 1$

Please render mathematical equations properly and format your responses appropriately.`;

    // Add system message to the beginning if there's no history
    if (formattedHistory.length === 0) {
      formattedHistory.push({
        role: "model",
        parts: [{ text: systemPrompt }]
      });
    }

    // Call the Gemini API with the correct endpoint
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            ...formattedHistory,
            {
              role: 'user',
              parts: [{ text: message }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1000,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_ONLY_HIGH"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_ONLY_HIGH"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_ONLY_HIGH"
            },
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_ONLY_HIGH"
            }
          ]
        }),
      }
    );

    const data = await response.json();
    
    // Handle error responses from Gemini
    if (data.error) {
      console.error('Gemini API error:', data.error);
      return new Response(
        JSON.stringify({ response: "Error" }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    }

    // Extract the response text
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Error";
    
    // Return the formatted response
    return new Response(
      JSON.stringify({ 
        response: responseText
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error in chat-with-gemini function:', error);
    return new Response(
      JSON.stringify({ response: "Error" }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
    );
  }
});
