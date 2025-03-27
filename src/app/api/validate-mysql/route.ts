import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import connectMySQL from '@/lib/db/mysql';
import { RateLimiter } from '@/lib/rate-limiter';
import { logger } from '@/lib/logger';

const rateLimiter = new RateLimiter(10, 60 * 1000); // 10 requests per minute

/**
 * @swagger
 * /api/validate-mysql:
 *   post:
 *     tags:
 *       - Database
 *     summary: Validate MySQL connection
 *     description: Attempts to connect to MySQL using configured connection string
 *     responses:
 *       200:
 *         description: Successfully connected to MySQL
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
 *       501:
 *         description: Not implemented
 */
export async function POST(request: NextRequest) {
  // Get client IP for rate limiting
  const headersList = headers();
  const ip = headersList.get('x-forwarded-for') || 'unknown';

  // Check rate limit
  if (rateLimiter.isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }

  try {
    await connectMySQL();
    return NextResponse.json({ message: 'success' }, { status: 200 });
  } catch (error) {
    logger.error('MySQL validation failed:', error);
    return NextResponse.json(
      { error: 'MySQL connection not implemented' },
      { status: 501 }
    );
  }
} 