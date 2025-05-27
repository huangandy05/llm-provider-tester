import { useState, useEffect } from "react";
import "./App.css";
import { validateApiKey, sendPromptToLLM } from "./lib/api";

function App() {
  // State for provider and model selection
  const [provider, setProvider] = useState<"openai" | "anthropic" | "gemini">(
    "openai"
  );
  const [model, setModel] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [savedApiKey, setSavedApiKey] = useState<string>("");
  const [isValidKey, setIsValidKey] = useState<boolean | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [validationMessage, setValidationMessage] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showApiKey, setShowApiKey] = useState<boolean>(false);

  // Model options based on provider
  const modelOptions = {
    openai: ["gpt-4", "gpt-4o", "o4-mini", "o3-mini"],
    anthropic: [
      "claude-3-5-haiku-20241022",
      "claude-3-7-sonnet-20250219",
      "claude-sonnet-4-20250514",
    ],
    gemini: ["gemini-1.5-pro", "gemini-2.0-flash", "gemini-1.0-pro"],
  };

  // Set default model when provider changes
  useEffect(() => {
    setModel(modelOptions[provider][0]);
  }, [provider]);

  // Function to validate API key
  const handleValidateApiKey = async () => {
    if (!apiKey.trim()) {
      setIsValidKey(false);
      setValidationMessage("API key cannot be empty");
      return;
    }

    setIsValidating(true);
    setValidationMessage("");

    try {
      const result = await validateApiKey(provider, apiKey);

      setIsValidKey(result.success);
      setValidationMessage(result.message || "");

      if (result.success) {
        setSavedApiKey(apiKey);
      }
    } catch (error) {
      setIsValidKey(false);
      setValidationMessage("Error validating API key");
      console.error("Validation error:", error);
    } finally {
      setIsValidating(false);
    }
  };

  // Function to send prompt to LLM
  const handleSendPrompt = async () => {
    if (!prompt.trim() || !savedApiKey) return;

    setIsLoading(true);
    setResponse("");
    setErrorMessage("");

    try {
      const result = await sendPromptToLLM(
        provider,
        model,
        savedApiKey,
        prompt
      );

      if (result.success && result.data) {
        setResponse(result.data);
      } else {
        setErrorMessage(result.message || "Unknown error occurred");
      }
    } catch (error) {
      setErrorMessage("Error sending prompt to LLM");
      console.error("Send prompt error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">
        LLM Provider Tester
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Provider Selection */}
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
              LLM Provider
            </label>
            <select
              className="w-full p-2 border rounded-md"
              value={provider}
              onChange={(e) =>
                setProvider(e.target.value as "openai" | "anthropic" | "gemini")
              }
            >
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
              <option value="gemini">Google Gemini</option>
            </select>
          </div>

          {/* Model Selection */}
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Model</label>
            <select
              className="w-full p-2 border rounded-md"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            >
              {modelOptions[provider].map((modelOption) => (
                <option key={modelOption} value={modelOption}>
                  {modelOption}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* API Key Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">API Key</label>
          <div className="flex gap-2 items-center">
            <input
              type={showApiKey ? "text" : "password"}
              className="flex-1 p-2 border rounded-md"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={`Enter your ${provider} API key`}
            />
            <button
              type="button"
              className="px-2 py-1 border rounded-md bg-gray-200 hover:bg-gray-300"
              onClick={() => setShowApiKey(!showApiKey)}
            >
              {showApiKey ? "Hide" : "Show"}
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                isValidating ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
              onClick={handleValidateApiKey}
              disabled={isValidating}
            >
              {isValidating ? "Validating..." : "Save"}
            </button>
          </div>

          {/* API Key Validation Indicator */}
          {validationMessage && (
            <div
              className={`mt-2 text-sm ${
                isValidKey ? "text-green-600" : "text-red-600"
              }`}
            >
              {isValidKey ? `✓ ${validationMessage}` : `✗ ${validationMessage}`}
            </div>
          )}
        </div>
      </div>

      {/* Prompt and Response Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Your Prompt</label>
          <textarea
            className="w-full p-2 border rounded-md h-32"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt here..."
          />
        </div>

        <div className="mb-4">
          <button
            className={`w-full py-2 rounded-md ${
              !savedApiKey || !prompt.trim() || isLoading
                ? "bg-gray-400"
                : "bg-green-600 hover:bg-green-700"
            } text-white`}
            onClick={handleSendPrompt}
            disabled={!savedApiKey || !prompt.trim() || isLoading}
          >
            {isLoading ? "Generating response..." : "Send to LLM"}
          </button>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 p-2 bg-red-100 border border-red-300 text-red-700 rounded-md">
            {errorMessage}
          </div>
        )}

        {/* Response Display */}
        <div>
          <label className="block text-sm font-medium mb-1">Response</label>
          <div className="w-full p-4 border rounded-md bg-gray-50 min-h-32 whitespace-pre-wrap">
            {response || "Response will appear here..."}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
