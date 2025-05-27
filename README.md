# LLM Provider Tester - Local Setup Guide

This application allows you to test different LLM providers (OpenAI, Anthropic, and Google Gemini) with various models and your own API keys.

## Features

- Support for multiple LLM providers:
  - OpenAI (gpt-4, gpt-4o, o4-mini, o3-mini)
  - Anthropic (claude-3-5-haiku-20241022, claude-3-7-sonnet-20250219, claude-sonnet-4-20250514)
  - Google Gemini (gemini-1.5-pro, gemini-1.5-flash, gemini-1.0-pro)
- API key validation
- Simple prompt/response interface
- Error handling and feedback

## Prerequisites

- Node.js (v16 or higher)
- npm, yarn, or pnpm package manager

## Local Setup Instructions

1. **Extract the zip file** to your preferred location

2. **Navigate to the project directory**
   ```bash
   cd llm-tester
   ```

3. **Install dependencies**
   ```bash
   # Using npm
   npm install

   # OR using yarn
   yarn install

   # OR using pnpm
   pnpm install
   ```

4. **Start the development server**
   ```bash
   # Using npm
   npm run dev

   # OR using yarn
   yarn dev

   # OR using pnpm
   pnpm run dev
   ```

5. **Open your browser** and navigate to `http://localhost:5173`

## Building for Production

If you want to build the application for production:

```bash
# Using npm
npm run build

# OR using yarn
yarn build

# OR using pnpm
pnpm run build
```

The build output will be in the `dist` directory, which you can serve using any static file server.

## API Keys

You'll need to provide your own API keys for the LLM providers:

- **OpenAI**: Get your API key from [OpenAI Platform](https://platform.openai.com/account/api-keys)
- **Anthropic**: Get your API key from [Anthropic Console](https://console.anthropic.com/)
- **Google Gemini**: Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

## Notes

- This application runs entirely in the browser and your API keys are never stored on any server
- API requests are made directly from your browser to the respective LLM providers
- Rate limits and usage costs are based on your account with each provider
