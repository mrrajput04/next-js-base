import Anthropic from '@anthropic-ai/sdk';
import { logger } from '../logger';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL;

if (!ANTHROPIC_API_KEY) {
  logger.warn('ANTHROPIC_API_KEY is not set. Anthropic features will be disabled.');
}

const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
});

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function generateClaudeResponse(
  messages: ClaudeMessage[],
  options: {
    maxTokens?: number;
    temperature?: number;
    model?: string;
  } = {}
): Promise<string> {
  try {
    if (!ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not set');
    }

    const {
      maxTokens = 1000,
      temperature = 0.7,
      model = ANTHROPIC_MODEL || 'claude-3-sonnet-20240229',
    } = options;

    const response = await anthropic.messages.create({
      model,
      max_tokens: maxTokens,
      temperature,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    return response.content[0].text;
  } catch (error) {
    if (error instanceof Error && error.message.includes('model')) {
      logger.error('Invalid model name specified:', error);
      throw new Error('Invalid AI model name. Please check your configuration.');
    }
    logger.error('Error generating Claude response:', error);
    throw error;
  }
}

export async function validateAnthropicConnection(): Promise<boolean> {
  try {
    if (!ANTHROPIC_API_KEY) {
      logger.warn('ANTHROPIC_API_KEY is not set');
      return false;
    }

    // Test the connection with a minimal request
    await anthropic.messages.create({
      model: ANTHROPIC_MODEL || 'claude-3-sonnet-20240229',
      max_tokens: 1,
      messages: [{ role: 'user', content: 'test' }]
    });

    return true;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        logger.warn('Invalid Anthropic API key');
      } else if (error.message.includes('model')) {
        logger.warn(`Invalid model configuration: ${ANTHROPIC_MODEL}`);
      } else {
        logger.warn('Anthropic connection failed:', error.message);
      }
      // Log the full error response
      logger.debug('Anthropic API response:', error);
    }
    return false;
  }
}

export default anthropic; 