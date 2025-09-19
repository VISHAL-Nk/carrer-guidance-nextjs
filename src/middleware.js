import { NextResponse } from 'next/server';

const allowedOrigins = new Set([
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:8000',
  'http://127.0.0.1:8000',
  'http://localhost:8080',
  'http://127.0.0.1:8080',
]);

export function middleware(request) {
  const origin = request.headers.get('origin') || '';
  const isAllowed = allowedOrigins.has(origin);
  const response = NextResponse.next();

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  // Build a CSP with dev-friendly connect-src when not in production
  const isProd = process.env.NODE_ENV === 'production';
  const connectSrc = [
    "'self'",
    // Enable websockets for Next dev server and React refresh
    ...(isProd ? [] : ['ws:', 'wss:']),
    // Allow local Python/Flask backend during development
    ...(isProd
      ? []
      : ['http://localhost:8080', 'http://127.0.0.1:8080'])
  ].join(' ');

  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      // Allow Next.js scripts and development tools
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      // Allow inline styles for Next.js and Tailwind
      "style-src 'self' 'unsafe-inline'",
      // Allow images from self, data URLs, and HTTPS sources
      "img-src 'self' data: https:",
      // Allow fonts from self and data URLs
      "font-src 'self' data:",
      // Allow connections
      `connect-src ${connectSrc}`,
      // Allow media from self
      "media-src 'self'",
      // Block object and frame sources for security
      "object-src 'none'",
      "frame-src 'none'",
    ].join('; ')
  );

  // CORS headers for API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    if (isAllowed) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    }
    response.headers.set('Vary', 'Origin');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 204, headers: response.headers });
    }
  }

  return response;
}

export const config = {
  // Apply to all routes so CSP headers affect pages/components (Mermaid)
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
