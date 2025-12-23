/**
 * Ollama API Client
 * Provides integration with local Ollama instance
 */

const OLLAMA_BASE_URL =
  process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.2";

/**
 * Generate content using Ollama API
 * @param {string} prompt - The prompt to send to the model
 * @param {Object} options - Additional options
 * @param {string} options.model - Override default model
 * @param {number} options.temperature - Temperature for generation (0.0 to 1.0)
 * @param {boolean} options.stream - Whether to stream the response
 * @returns {Promise<{response: {text: () => string}}>} - Response object compatible with Gemini format
 */
export async function generateContent(prompt, options = {}) {
  const model = options.model || OLLAMA_MODEL;
  const temperature = options.temperature || 0.7;

  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: temperature,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `Ollama API error: ${response.status} - ${errorData}`
      );
    }

    const data = await response.json();

    // Return object in Gemini-compatible format
    return {
      response: {
        text: () => data.response,
      },
    };
  } catch (error) {
    console.error("Error calling Ollama API:", error);
    throw new Error(`Failed to generate content: ${error.message}`);
  }
}

/**
 * Check if Ollama is running and the model is available
 * @returns {Promise<boolean>}
 */
export async function checkOllamaHealth() {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
    if (!response.ok) return false;

    const data = await response.json();
    const modelExists = data.models?.some((m) => m.name.includes(OLLAMA_MODEL));

    return modelExists;
  } catch (error) {
    console.error("Ollama health check failed:", error);
    return false;
  }
}

/**
 * Create a model wrapper compatible with Gemini's interface
 * @returns {Object} - Model object with generateContent method
 */
export function getGenerativeModel() {
  return {
    generateContent: async (prompt) => {
      return await generateContent(prompt);
    },
  };
}
