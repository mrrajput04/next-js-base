import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import connectDB from '@/lib/db/mongodb';
import { RateLimiter } from '@/lib/rate-limiter';
import { logger } from '@/lib/logger';

const rateLimiter = new RateLimiter(10, 60 * 1000); // 10 requests per minute

/**
 * @swagger
 * /api/validate-mongodb:
 *   post:
 *     tags:
 *       - Database
 *     summary: Validate MongoDB connection
 *     description: Attempts to connect to MongoDB using configured connection string
 *     responses:
 *       200:
 *         description: Successfully connected to MongoDB
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
 *         description: MongoDB connection failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to connect to MongoDB
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
    const conn = await connectDB();
    if (conn.readyState === 1) { // 1 = connected
      return NextResponse.json({ message: 'success' }, { status: 200 });
    } else {
      throw new Error('MongoDB connection not ready');
    }
  } catch (error) {
    logger.error('MongoDB validation failed:', error);
    return NextResponse.json(
      { error: 'Failed to connect to MongoDB' },
      { status: 500 }
    );
  }
} 