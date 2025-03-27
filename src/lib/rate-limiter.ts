type RateLimitStore = {
  [key: string]: {
    count: number;
    resetTime: number;
  };
};

const store: RateLimitStore = {};

export class RateLimiter {
  private readonly limit: number;
  private readonly windowMs: number;

  constructor(limit: number, windowMs: number) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  isRateLimited(key: string): boolean {
    const now = Date.now();
    const record = store[key];

    if (!record || now >= record.resetTime) {
      store[key] = {
        count: 1,
        resetTime: now + this.windowMs,
      };
      return false;
    }

    if (record.count >= this.limit) {
      return true;
    }

    record.count += 1;
    return false;
  }
} 