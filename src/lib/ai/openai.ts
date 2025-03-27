import OpenAI from 'openai';
import { logger } from '../logger';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL;

if (!OPENAI_API_KEY) {
  logger.warn('OPENAI_API_KEY is not set. OpenAI features will be disabled.');
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function generateChatCompletion(
  messages: ChatMessage[],
  options: {
    maxTokens?: number;
    temperature?: number;
    model?: string;
  } = {}
): Promise<string> {
  try {
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    const {
      maxTokens = 1000,
      temperature = 0.7,
      model = OPENAI_MODEL || 'gpt-4-turbo-preview',
    } = options;

    const response = await openai.chat.completions.create({
      model,
      messages,
      max_tokens: maxTokens,
      temperature,
    });

    return response.choices[0].message.content || '';
  } catch (error) {
    if (error instanceof Error && error.message.includes('model')) {
      logger.error('Invalid model name specified:', error);
      throw new Error('Invalid AI model name. Please check your configuration.');
    }
    logger.error('Error generating OpenAI response:', error);
    throw error;
  }
}

export async function validateOpenAIConnection(): Promise<boolean> {
  try {
    if (!OPENAI_API_KEY) {
      logger.warn('OPENAI_API_KEY is not set');
      return false;
    }

    // Test the connection with a minimal request
    await openai.chat.completions.create({
      model: OPENAI_MODEL || 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: 'test' }],
      max_tokens: 1
    });

    return true;
  } catch (error) {
    if (error instanceof Error) {
      // Log the full error response first
      logger.debug('OpenAI API response:', error);
      
      // Check for quota exceeded error
      if (error.message.toLowerCase().includes('quota')) {
        logger.warn('OpenAI API quota exceeded. Please check your billing status and limits.');
        throw error; // Throw the original error to preserve the full error details
      }
      
      if (error.message.includes('API key')) {
        logger.warn('Invalid OpenAI API key');
      } else if (error.message.includes('model')) {
        logger.warn(`Invalid model configuration: ${OPENAI_MODEL}`);
      } else {
        logger.warn('OpenAI connection failed:', error.message);
      }
    }
    return false;
  }
}

export default openai;