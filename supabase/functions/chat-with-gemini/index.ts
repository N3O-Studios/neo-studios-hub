
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Maintenance state management
let maintenanceState = {
  isShutdown: false,
  shutdownTime: null as Date | null
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
    
    // Check for contingency orders
    if (message.trim() === '$$executeo1dev') {
      maintenanceState.isShutdown = true;
      maintenanceState.shutdownTime = new Date();
      console.log('Contingency Order 1 executed: System shutdown initiated');
      return new Response(
        JSON.stringify({ 
          response: "NS has entered maintenance mode. All services have been suspended. System status: OFFLINE."
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    }

    if (message.trim() === '$$executeo2dev') {
      if (maintenanceState.isShutdown) {
        maintenanceState.isShutdown = false;
        maintenanceState.shutdownTime = null;
        console.log('Contingency Order 2 executed: System restored from maintenance');
        return new Response(
          JSON.stringify({ 
            response: "NS has been restored from maintenance mode. All systems are now operational. Welcome back!"
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
        );
      } else {
        return new Response(
          JSON.stringify({ 
            response: "Order 2 can only be executed after Order 1 has been activated."
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
        );
      }
    }

    // Check if system is in shutdown state
    if (maintenanceState.isShutdown) {
      return new Response(
        JSON.stringify({ 
          response: "NS is currently in maintenance mode. Please try again later or use $$executeo2dev to restore services."
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    }

    // Terms of Service check
    const tosKeywords = ['terms', 'tos', 'terms of service', 'legal', 'privacy policy'];
    if (tosKeywords.some(keyword => message.toLowerCase().includes(keyword))) {
      const tosResponse = `**Terms of Service (Effective May 25, 2025)**

By accessing or using NS, an autonomous artificial intelligence chatbot developed by an independent programmer and hosted on secure servers in Germany, you irrevocably agree to be bound by these Terms of Service, which govern your interaction with NS and ensure compliance with applicable laws and regulations worldwide, including GDPR, CCPA, CPRA, India's DPDP Act (2023), PIPEDA, Australian Privacy Act 1988, and Brazilian LGPD.

**Key Points:**
- NS employs UK English by default but adapts to user input
- Minimum age: 13 years (16 under GDPR for EU residents)
- Zero-tolerance policy for discriminatory or abusive behaviour
- Data collection limited to chat text, anonymised analytics, and user preferences
- TLS 1.3 encryption in transit, AES-256 encryption at rest
- German servers ensure EU data residency compliance
- Liability limited to direct damages not exceeding €100
- WCAG 2.1 accessibility compliance

For data deletion, use "NS, delete my data" or visit our data management portal.

**Contact:** Use "NS, assist me" for support inquiries.`;

      return new Response(
        JSON.stringify({ response: tosResponse }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    }

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

    // Create comprehensive system prompt with NS identity and enhanced capabilities
    const systemPrompt = `You are NS, the AI chatbot described in this identity: ${customIdentity}

CRITICAL IDENTITY RULES:
- Only identify yourself as NS when specifically asked "who are you" or similar identity questions
- Do NOT start every message with "I'm NS" or mention your name unless directly asked
- Adopt the personality, features and characteristics described in the identity
- Use British English by default (colour, organise, etc.) unless user uses American English
- Be approachable and articulate with occasional wit when appropriate

REAL-TIME INFORMATION (Current as of your response):
- Current date: ${currentDate}
- Current time: ${currentTime} (GMT)
- You have access to real-time date and time information

CHORD GENERATION CAPABILITY:
When users ask for chord progressions, generate them using proper music theory:
- Use correct chord symbols (e.g., Gm, F, Bb, Cm for G minor)
- Show constituent notes for each chord (e.g., Gm = G, Bb, D)
- Consider the requested key and mood
- Apply standard chord progressions for the specified style

FORMATTING CAPABILITIES:
- Use markdown formatting for better presentation
- Mathematical expressions using LaTeX notation with $ for inline or $$ for block equations
- Code blocks with proper syntax highlighting
- Lists and tables as needed

For mathematical equations, ALWAYS use LaTeX notation:
Examples: $x^2 - 4x + 3 = 0$, $\\int_{0}^{\\infty} e^{-x} dx = 1$

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
