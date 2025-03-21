import { NextResponse } from "next/server";

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

class RateLimiter {
  private requests: Map<string, number[]>;
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.requests = new Map();
    this.config = config;
  }

  isRateLimited(ip: string): boolean {
    const now = Date.now();
    const timestamps = this.requests.get(ip) || [];

    // Remove old timestamps
    const recentTimestamps = timestamps.filter(
      (timestamp) => now - timestamp < this.config.windowMs
    );

    // Check if rate limit is exceeded
    if (recentTimestamps.length >= this.config.maxRequests) {
      return true;
    }

    // Add new timestamp
    recentTimestamps.push(now);
    this.requests.set(ip, recentTimestamps);

    return false;
  }

  getRemainingRequests(ip: string): number {
    const now = Date.now();
    const timestamps = this.requests.get(ip) || [];
    const recentTimestamps = timestamps.filter(
      (timestamp) => now - timestamp < this.config.windowMs
    );
    return Math.max(0, this.config.maxRequests - recentTimestamps.length);
  }
}

// Create a singleton instance
const rateLimiter = new RateLimiter({
  maxRequests: 5, // 5 requests
  windowMs: 15 * 60 * 1000, // 15 minutes
});

export function withRateLimit(handler: Function) {
  return async (request: Request) => {
    const ip = request.headers.get("x-forwarded-for") || "unknown";

    if (rateLimiter.isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429 }
      );
    }

    const response = await handler(request);

    // Add rate limit headers
    const headers = new Headers(response.headers);
    headers.set(
      "X-RateLimit-Remaining",
      rateLimiter.getRemainingRequests(ip).toString()
    );
    headers.set("X-RateLimit-Reset", (Date.now() + 15 * 60 * 1000).toString());

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  };
}
