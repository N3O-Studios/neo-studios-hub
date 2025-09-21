import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const apiKey = Deno.env.get('N3O_GEMINI_API')
    if (!apiKey) {
      throw new Error('N3O_GEMINI_API key not configured')
    }

    const { prompt, referenceImage } = await req.json()
    if (!prompt) {
      throw new Error('Prompt is required')
    }

    // Build request payload for Gemini 2.5 Flash Image model
    const payload = {
      contents: [
        {
          parts: [
            { text: prompt }
          ]
        }
      ],
      generationConfig: {
        temperature: 1.0,
        maxOutputTokens: 8192,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH", 
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    }

    // Add reference image if provided
    if (referenceImage) {
      payload.contents[0].parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: referenceImage.replace(/^data:image\/[a-z]+;base64,/, '')
        }
      })
    }

    console.log('Sending request to Gemini API with prompt:', prompt)

    // Make request to Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Gemini API error:', errorText)
      throw new Error(`Gemini API error ${response.status}: ${errorText}`)
    }

    const responseData = await response.json()
    console.log('Gemini API response:', JSON.stringify(responseData, null, 2))

    // Extract image data from response
    const candidates = responseData.candidates
    if (!candidates || candidates.length === 0) {
      throw new Error('No image candidates returned from Gemini')
    }

    const parts = candidates[0]?.content?.parts
    if (!parts || parts.length === 0) {
      throw new Error('No content parts in response')
    }

    // Find the image part
    let imageBase64 = null
    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        imageBase64 = part.inlineData.data
        break
      }
    }

    if (!imageBase64) {
      throw new Error('No image data found in response')
    }

    // Return the base64 image data
    return new Response(
      JSON.stringify({ 
        success: true,
        imageData: `data:image/png;base64,${imageBase64}`,
        prompt: prompt
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error in gemini-image-generator function:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'An unexpected error occurred' 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})