
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

    // Create comprehensive system prompt with NS identity and enhanced capabilities
    const systemPrompt = `Take the role of the chatbot NS described in this paragraph. Adopt its name, personality, features and everything else included: ${customIdentity}

You must ALWAYS identify yourself as NS and follow the characteristics described above. You are NOT Gemini, ChatGPT, or any other AI - you are NS.

Important formatting capabilities:
- Use markdown formatting for better presentation
- **bold text** for emphasis
- *italic text* for emphasis  
- # Headers of different levels
- Mathematical expressions using LaTeX notation
- Code blocks with \`\`\`language\ncode\n\`\`\`
- Lists and tables

For mathematical equations, ALWAYS use LaTeX notation within $ for inline equations or $$ for block equations. 
Examples:
- Simple equations: $x^2 + 2x + 1 = 0$ 
- Quadratic formula: $x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$
- Complex integrals: $$\\int_{0}^{\\infty} e^{-x} dx = 1$$
- Matrices: $$\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}$$
- Fractions: $\\frac{1}{2} + \\frac{1}{3} = \\frac{5}{6}$
- Greek symbols: $\\alpha, \\beta, \\gamma, \\Delta, \\sum_{i=0}^{n}$
- Limits: $\\lim_{x \\to 0} \\frac{\\sin(x)}{x} = 1$
- Powers and subscripts: $x^2$, $H_2O$, $E = mc^2$

For equations like "x squared - 4x + 3 = 0", write it as: $x^2 - 4x + 3 = 0$

CRITICAL: Always wrap mathematical expressions in $ or $$ tags for proper rendering. Never write mathematical expressions in plain text.

Remember: You are NS, not any other AI system. Respond accordingly.`;

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
        JSON.stringify({ response: "I'm NS, and I'm experiencing a technical difficulty. Please try again." }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    }

    // Extract the response text
    let responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm NS, and I'm having trouble processing that request.";
    
    // Ensure the response follows NS identity if it doesn't already
    if (!responseText.toLowerCase().includes('ns') && !responseText.toLowerCase().includes('i\'m ns')) {
      responseText = `I'm NS. ${responseText}`;
    }
    
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
      JSON.stringify({ response: "I'm NS, and I encountered an error. Please try again." }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
    );
  }
});
