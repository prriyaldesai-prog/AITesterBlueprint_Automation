import * as http from 'http';

export class MockServer {
  private server: http.Server | null = null;
  private port: number;
  private rateLimitMap = new Map<string, number>();

  constructor(port: number = 3001) {
    this.port = port;
  }

  /**
   * Starts the local mock HTTP server
   */
  start(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server = http.createServer((req, res) => {
        // CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (req.method === 'OPTIONS') {
          res.writeHead(204);
          res.end();
          return;
        }

        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });

        req.on('end', () => {
          try {
            this.handleRequest(req, res, body);
          } catch (error) {
            console.error('Mock server error:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error', message: (error as Error).message }));
          }
        });
      });

      this.server.listen(this.port, '127.0.0.1', () => {
        console.log(`[MOCK SERVER] Started running on http://127.0.0.1:${this.port}`);
        resolve();
      });

      this.server.on('error', (err) => {
        reject(err);
      });
    });
  }

  /**
   * Stops the local mock HTTP server
   */
  stop(): Promise<void> {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => {
          console.log('[MOCK SERVER] Stopped running.');
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  /**
   * Handles incoming requests and matches endpoints
   */
  private handleRequest(req: http.IncomingMessage, res: http.ServerResponse, bodyString: string) {
    const url = req.url || '';
    const headers = req.headers;

    // Route: Reset Rate Limit
    if (url === '/ap/reset-rate-limit' && req.method === 'POST') {
      this.rateLimitMap.clear();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'success', message: 'Rate limit map cleared.' }));
      return;
    }

    // 1. Rate Limiting Logic for brute-force simulation on Sign-in
    if (url === '/ap/signin' && req.method === 'POST') {
      const clientIp = headers['x-forwarded-for'] as string || req.socket.remoteAddress || 'unknown';
      const hits = (this.rateLimitMap.get(clientIp) || 0) + 1;
      this.rateLimitMap.set(clientIp, hits);

      // Trigger HTTP 429 (Too Many Requests) if IP hit exceeds 5 requests
      if (hits > 5) {
        res.writeHead(429, { 'Content-Type': 'application/json', 'Retry-After': '60' });
        res.end(JSON.stringify({
          error: 'Too Many Requests',
          message: 'Rate limit exceeded. Too many login attempts. Please try again after 60 seconds.',
          retryAfter: 60
        }));
        return;
      }
    }

    // 2. Parse JSON body where applicable
    let body: any = {};
    if (bodyString && headers['content-type']?.includes('application/json')) {
      try {
        body = JSON.parse(bodyString);
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Bad Request', message: 'Malformed JSON payload.' }));
        return;
      }
    }

    // 3. Route Handlers
    // Route: Sign In
    if (url === '/ap/signin' && req.method === 'POST') {
      // Validate Content-Type
      if (!headers['content-type']?.includes('application/json')) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Bad Request', message: 'Content-Type must be application/json.' }));
        return;
      }

      const { email, password } = body;

      // Tampering Check: Missing required body parameters
      if (email === undefined || password === undefined) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Bad Request', message: 'Missing email or password parameter.' }));
        return;
      }

      // Security Check: SQL Injection Detection
      const sqliPattern = /('|--|#|union|select|insert|delete|drop|update)/i;
      if (sqliPattern.test(email) || sqliPattern.test(password)) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Forbidden', message: 'Security violation: Potential SQL Injection attempt detected.' }));
        return;
      }

      // Explicit rate limit endpoint check (DDT-based testing)
      if (email === 'ratelimit@amazon.in') {
        res.writeHead(429, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Too Many Requests', message: 'Account locked due to too many failed attempts.' }));
        return;
      }

      // Normal Login Logic
      if (email === 'valid_user@amazon.in' && password === 'password123') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'success',
          token: 'valid_jwt_token_xyz_123',
          refreshToken: 'refresh_token_999',
          user: { email: 'valid_user@amazon.in', name: 'Priyal Desai' }
        }));
      } else {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Unauthorized', message: 'Invalid credentials. Password or email is incorrect.' }));
      }
      return;
    }

    // Route: Refresh Token / Token Validation
    if (url === '/ap/token' && req.method === 'POST') {
      const { refreshToken } = body;

      if (!refreshToken) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Bad Request', message: 'Missing refreshToken parameter.' }));
        return;
      }

      if (refreshToken === 'refresh_token_999') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'success',
          token: 'valid_jwt_token_xyz_123_refreshed'
        }));
      } else if (refreshToken === 'expired_refresh_token') {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Unauthorized', message: 'Refresh token has expired.' }));
      } else {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Forbidden', message: 'Invalid refresh token.' }));
      }
      return;
    }

    // Route: Secure Profile (Requires Bearer token authorization)
    if (url === '/ap/secure-profile' && req.method === 'GET') {
      const authHeader = headers['authorization'];

      if (!authHeader) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Unauthorized', message: 'Missing Authorization header.' }));
        return;
      }

      if (!authHeader.startsWith('Bearer ')) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Bad Request', message: 'Invalid Authorization header format. Must start with Bearer.' }));
        return;
      }

      const token = authHeader.split(' ')[1];

      if (token === 'valid_jwt_token_xyz_123' || token === 'valid_jwt_token_xyz_123_refreshed') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'success',
          profile: {
            customerId: 'AMZN-987654321',
            name: 'Priyal Desai',
            email: 'valid_user@amazon.in',
            membershipType: 'Amazon Prime',
            shippingAddress: {
              street: '123 Prime Way',
              city: 'Mumbai',
              zipCode: '400001',
              country: 'India'
            }
          }
        }));
      } else if (token === 'expired_jwt_token_abc_456') {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Unauthorized', message: 'Authorization token has expired.' }));
      } else {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Forbidden', message: 'Access denied: Invalid authentication token.' }));
      }
      return;
    }

    // Fallback: 404 Not Found
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found', message: 'The requested resource does not exist on this server.' }));
  }
}
