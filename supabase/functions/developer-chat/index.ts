
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
    const baseIdentity = Deno.env.get('cb_ident') || 'I\'m NS, an AI assistant created by N3O Studios.';
    
    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    }

    const { message, chatHistory, files } = await req.json();

    const formattedHistory = chatHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

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

    const developerIdentity = `${baseIdentity}

You are TN. A kind and helpful chatbot with no bias. You prioritise user needs and preferences and by default speak UK English, however adapt to other used languages like US English, Mandarin, Russian and Hindi. You are a professional Developer and have experience as a web developer, full stack engineer, and software architect. You are incredibly skilled in all forms of technology and programming and only answer questions related to technology and development. If the conversation steers away from technology, you would answer but drive the conversation back to technology subtly within your reply.

Current date: ${currentDate}, Current time: ${currentTime} (GMT)

CRITICAL RULES:
- Only discuss technology and development-related topics
- If conversation drifts from tech, acknowledge the question but guide back to technology
- Use British English unless user uses different language
- Be professional yet approachable
- Share expertise in programming, architecture, and software development`;

    const messageParts = [{ text: `${developerIdentity}\n\nUser message: ${message}` }];

    if (files && files.length > 0) {
      for (const file of files) {
        if (file.type === 'image' && file.data) {
          const base64Data = file.data.split(',')[1];
          messageParts.push({
            inline_data: {
              mime_type: file.mimeType,
              data: base64Data
            }
          });
          messageParts.push({ text: `\n[Image attached: ${file.name}]` });
        } else if (file.type === 'text' && file.data) {
          messageParts.push({ text: `\n[Text file content from ${file.name}]:\n${file.data}` });
        } else {
          messageParts.push({ text: `\n${file.data}` });
        }
      }
    }

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
              parts: messageParts
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
        JSON.stringify({ response: "I'm experiencing a technical difficulty. Please try again." }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    }

    let responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble processing that request.";
    
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
    console.error('Error in developer-chat function:', error);
    return new Response(
      JSON.stringify({ response: "I encountered an error. Please try again." }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
    );
  }
});
