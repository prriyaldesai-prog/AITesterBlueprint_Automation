import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseAPI } from './BaseAPI';

export class AmazonAuthAPI extends BaseAPI {
  constructor(request: APIRequestContext) {
    // Pass APIRequestContext and base path for authentication endpoints
    super(request, '');
  }

  /**
   * Performs a signin request using credentials
   * @param body Payload containing email, password, and optional clientToken
   * @param customHeaders Optional custom headers to test tampering/missing-headers
   */
  async signin(body: any, customHeaders?: Record<string, string>): Promise<APIResponse> {
    return this.post('/ap/signin', {
      data: body,
      headers: customHeaders
    });
  }

  /**
   * Refreshes or validates a token
   * @param body Payload containing refreshToken or authToken
   * @param customHeaders Optional headers override
   */
  async validateToken(body: any, customHeaders?: Record<string, string>): Promise<APIResponse> {
    return this.post('/ap/token', {
      data: body,
      headers: customHeaders
    });
  }

  /**
   * Fetches user profile from a protected route requiring Bearer authentication
   * @param token Authentication token
   * @param customHeaders Headers override (e.g. omitting authorization to test unauthorized access)
   */
  async getSecureProfile(token?: string, customHeaders?: Record<string, string>): Promise<APIResponse> {
    const headers: Record<string, string> = { ...customHeaders };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return this.get('/ap/secure-profile', {
      headers
    });
  }

  /**
   * Resets the rate limiter counters on the mock server
   */
  async resetRateLimit(): Promise<APIResponse> {
    return this.post('/ap/reset-rate-limit');
  }
}
