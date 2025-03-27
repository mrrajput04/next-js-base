import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Explicitly set Node.js runtime
export const runtime = 'nodejs';

export function middleware(request: NextRequest) {
    return NextResponse.next();
}

// Configure middleware to run only on API routes
export const config = {
    matcher: '/api/:path*',
}; 