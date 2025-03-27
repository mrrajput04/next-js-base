import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { validateAnthropicConnection } from '@/lib/ai/claude';
import { RateLimiter } from '@/lib/rate-limiter';
import { logger } from '@/lib/logger';

const rateLimiter = new RateLimiter(10, 60 * 1000); // 10 requests per minute

/**
 * @swagger
 * /api/validate-anthropic:
 *   post:
 *     tags:
 *       - AI Providers
 *     summary: Validate Anthropic connection
 *     description: Attempts to connect to Anthropic using configured API key and model
 *     responses:
 *       200:
 *         description: Successfully connected to Anthropic
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
 *         description: Anthropic connection failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to connect to Anthropic
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
    const isValid = await validateAnthropicConnection();
    if (!isValid) {
      return NextResponse.json(
        { error: 'Failed to connect to Anthropic' },
        { status: 500 }
      );
    }
    return NextResponse.json({ message: 'success' }, { status: 200 });
  } catch (error) {
    logger.error('Anthropic validation failed:', error);
    return NextResponse.json(
      { error: 'Failed to connect to Anthropic' },
      { status: 500 }
    );
  }
} 