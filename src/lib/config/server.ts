// Server-side only configuration
export const getServerConfig = () => ({
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  openaiApiKey: process.env.OPENAI_API_KEY,
  mongodbUri: process.env.MONGODB_URI,
}); 