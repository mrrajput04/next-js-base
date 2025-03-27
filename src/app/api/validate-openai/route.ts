import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { validateOpenAIConnection } from '@/lib/ai/openai';
import { RateLimiter } from '@/lib/rate-limiter';
import { logger } from '@/lib/logger';

const rateLimiter = new RateLimiter(10, 60 * 1000); // 10 requests per minute

/**
 * @swagger
 * /api/validate-openai:
 *   post:
 *     tags:
 *       - AI Providers
 *     summary: Validate OpenAI connection
 *     description: Attempts to connect to OpenAI using configured API key and model
 *     responses:
 *       200:
 *         description: Successfully connected to OpenAI
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Rate limit exceeded
 *       500:
 *         description: OpenAI connection failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to connect to OpenAI
 */
export async function POST(request: NextRequest) {
  const headersList = headers();
  const ip = headersList.get('x-forwarded-for') || 'unknown';

  if (rateLimiter.isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Local rate limit exceeded' },
      { status: 429 }
    );
  }

  try {
    const isValid = await validateOpenAIConnection();
    if (!isValid) {
      return NextResponse.json(
        { error: 'Failed to connect to OpenAI' },
        { status: 500 }
      );
    }
    return NextResponse.json({ message: 'success' }, { status: 200 });
  } catch (error) {
    logger.error('OpenAI validation failed:', error);
    // Check if it's a quota exceeded error
    if (error instanceof Error && error.message.includes('quota')) {
      return NextResponse.json(
        { error: 'OpenAI API quota exceeded. Please check your billing status and limits.' },
        { status: 429 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to connect to OpenAI' },
      { status: 500 }
    );
  }
} 