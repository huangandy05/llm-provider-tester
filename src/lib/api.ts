// API integration for LLM providers

// Interface for API responses
interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

// Function to validate API keys
export const validateApiKey = async (
  provider: 'openai' | 'anthropic' | 'gemini',
  apiKey: string
): Promise<ApiResponse> => {
  try {
    if (!apiKey.trim()) {
      return { success: false, message: 'API key cannot be empty' };
    }

    // Different validation endpoints based on provider
    if (provider === 'openai') {
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        return { success: true, message: 'OpenAI API key is valid' };
      } else {
        const error = await response.json();
        return { 
          success: false, 
          message: `Invalid OpenAI API key: ${error.error?.message || 'Unknown error'}` 
        };
      }
    } else if (provider === 'anthropic') {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-3-5-haiku-20241022',
          max_tokens: 1,
          messages: [{ role: 'user', content: 'Hello' }],
        }),
      });

      if (response.ok) {
        return { success: true, message: 'Anthropic API key is valid' };
      } else {
        const error = await response.json();
        return { 
          success: false, 
          message: `Invalid Anthropic API key: ${error.error?.message || 'Unknown error'}` 
        };
      }
    } else if (provider === 'gemini') {
      // Gemini API validation
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + apiKey, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        return { success: true, message: 'Gemini API key is valid' };
      } else {
        const error = await response.json();
        return { 
          success: false, 
          message: `Invalid Gemini API key: ${error.error?.message || 'Unknown error'}` 
        };
      }
    }

    return { success: false, message: 'Unknown provider' };
  } catch (error) {
    console.error('API key validation error:', error);
    return { 
      success: false, 
      message: `Error validating API key: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
};

// Function to send prompts to LLM providers
export const sendPromptToLLM = async (
  provider: 'openai' | 'anthropic' | 'gemini',
  model: string,
  apiKey: string,
  prompt: string
): Promise<ApiResponse> => {
  try {
    if (!apiKey.trim()) {
      return { success: false, message: 'API key is required' };
    }

    if (!prompt.trim()) {
      return { success: false, message: 'Prompt cannot be empty' };
    }

    if (provider === 'openai') {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return { 
          success: true, 
          data: data.choices[0].message.content 
        };
      } else {
        const error = await response.json();
        return { 
          success: false, 
          message: `OpenAI API error: ${error.error?.message || 'Unknown error'}` 
        };
      }
    } else if (provider === 'anthropic') {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return { 
          success: true, 
          data: data.content[0].text 
        };
      } else {
        const error = await response.json();
        return { 
          success: false, 
          message: `Anthropic API error: ${error.error?.message || 'Unknown error'}` 
        };
      }
    } else if (provider === 'gemini') {
      // Gemini API integration
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Extract text from Gemini response format
        return { 
          success: true, 
          data: data.candidates[0].content.parts[0].text 
        };
      } else {
        const error = await response.json();
        return { 
          success: false, 
          message: `Gemini API error: ${error.error?.message || 'Unknown error'}` 
        };
      }
    }

    return { success: false, message: 'Unknown provider' };
  } catch (error) {
    console.error('LLM API error:', error);
    return { 
      success: false, 
      message: `Error sending prompt: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
};
