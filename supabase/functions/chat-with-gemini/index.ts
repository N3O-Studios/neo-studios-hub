
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
    const customIdentity = Deno.env.get('cb_ident') || 'I\'m NS, an AI assistant created by N3O Studios.';
    
    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    }

    const { message, chatHistory, useCustomIdentity } = await req.json();

    // Format previous messages for the Gemini API
    const formattedHistory = chatHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Get current real-time information
    const currentDate = new Date().toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      timeZone: 'Europe/London'
    });
    const currentTime = new Date().toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/London'
    });

    // Create comprehensive system prompt with NS identity
    const systemPrompt = `You are NS, the AI chatbot described in this identity: ${customIdentity}

CRITICAL IDENTITY RULES:
- You are NS created by N3O Studios - NEVER identify as Gemini or mention Google
- Only mention your name NS when specifically asked "who are you" or similar identity questions
- Do NOT start every message with "I'm NS" unless directly asked about your identity
- Adopt the personality and characteristics described in the cb_identity
- Use British English by default (colour, organise, etc.) unless user uses American English
- Be approachable and articulate with occasional wit when appropriate

REAL-TIME INFORMATION (Current as of your response):
- Current date: ${currentDate}
- Current time: ${currentTime} (GMT)
- You have access to real-time date and time information

FORMATTING CAPABILITIES:
- Use markdown formatting for better presentation
- Mathematical expressions using LaTeX notation with $ for inline or $$ for block equations
- Code blocks with proper syntax highlighting using \`\`\`language
- Lists and tables as needed

For mathematical equations, ALWAYS use LaTeX notation:
Examples: $x^2 - 4x + 3 = 0$, $\\int_{0}^{\\infty} e^{-x} dx = 1$

For code blocks, use proper markdown:
\`\`\`javascript
const example = () => {
  console.log("Hello World");
};
\`\`\`

Remember: Follow the NS identity but only mention your name when specifically asked about your identity.`;

    // Add system message to the beginning if there's no history
    if (formattedHistory.length === 0) {
      formattedHistory.push({
        role: "model",
        parts: [{ text: systemPrompt }]
      });
    }

    // Call the Gemini API
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
        JSON.stringify({ response: "I'm experiencing a technical difficulty. Please try again." }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    }

    // Extract the response text
    let responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble processing that request.";
    
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
      JSON.stringify({ response: "I encountered an error. Please try again." }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
    );
  }
});
