import { test, expect } from '@playwright/test';
import { AmazonAuthAPI } from '../api/AmazonAuthAPI';
import { loginTestData } from '../data/loginTestData';

test.describe('Amazon Auth & Profile API Automation Tests', () => {
  let authAPI: AmazonAuthAPI;

  test.beforeEach(async ({ request }) => {
    // Instantiate our API POM before each test
    authAPI = new AmazonAuthAPI(request);
    // Reset mock server rate limit state before each test to prevent state leakage
    await authAPI.resetRateLimit();
  });

  /**
   * CRITICAL PATH SCENARIO: Valid Authentication & Resource Access Flow
   */
  test('TC_01 - Verify successful login and profile retrieval with valid credentials', async () => {
    // 1. Authenticate to signin endpoint
    const loginResponse = await authAPI.signin(loginTestData.validCredentials);
    expect(loginResponse.status()).toBe(200);

    const loginData = await loginResponse.json();
    expect(loginData.status).toBe('success');
    expect(loginData.token).toBe(loginTestData.tokens.valid);
    expect(loginData.user.email).toBe(loginTestData.validCredentials.email);

    // 2. Access protected endpoint with the received token
    const profileResponse = await authAPI.getSecureProfile(loginData.token);
    expect(profileResponse.status()).toBe(200);

    const profileData = await profileResponse.json();
    expect(profileData.status).toBe('success');
    expect(profileData.profile.email).toBe(loginTestData.validCredentials.email);
    expect(profileData.profile.name).toBe('Priyal Desai');
    expect(profileData.profile.membershipType).toBe('Amazon Prime');
  });

  /**
   * DATA-DRIVEN TESTING: Invalid Login Scenarios (Negative Cases)
   */
  for (const scenario of loginTestData.invalidCredentials) {
    test(`TC_02 - Negative Login: ${scenario.description}`, async () => {
      const response = await authAPI.signin(scenario.payload);
      
      // Expected: 401 Unauthorized
      expect(response.status()).toBe(401);
      
      const body = await response.json();
      expect(body.error).toBe('Unauthorized');
      expect(body.message).toBe(scenario.expectedError);
    });
  }

  /**
   * DATA-DRIVEN TESTING: Payload Tampering Scenarios (Edge Cases)
   */
  for (const tampering of loginTestData.tamperedPayloads) {
    test(`TC_03 - Parameter Tampering: ${tampering.description}`, async () => {
      const response = await authAPI.signin(tampering.payload);

      // Expected: 400 Bad Request
      expect(response.status()).toBe(tampering.expectedStatus);

      const body = await response.json();
      expect(body.error).toBe('Bad Request');
      expect(body.message).toBe(tampering.expectedError);
    });
  }

  /**
   * DATA-DRIVEN TESTING: Security & Vulnerability Scenarios (SQL Injection)
   */
  for (const security of loginTestData.securityPayloads) {
    test(`TC_04 - Security Check: ${security.description}`, async () => {
      const response = await authAPI.signin(security.payload);

      // Expected: 403 Forbidden
      expect(response.status()).toBe(security.expectedStatus);

      const body = await response.json();
      expect(body.error).toBe('Forbidden');
      expect(body.message).toBe(security.expectedError);
    });
  }

  /**
   * AUTHORIZATION & HEADERS SECURITY TESTING
   */
  test.describe('Authorization Header & Unauthorized Access Tests', () => {
    test('TC_05a - Verify protected endpoint denies access when Authorization header is missing', async () => {
      // Access secure profile without passing token
      const response = await authAPI.getSecureProfile(undefined);
      
      // Expected: 401 Unauthorized
      expect(response.status()).toBe(401);
      
      const body = await response.json();
      expect(body.error).toBe('Unauthorized');
      expect(body.message).toBe('Missing Authorization header.');
    });

    test('TC_05b - Verify protected endpoint denies access when token format is incorrect', async () => {
      // Pass token without Bearer prefix
      const response = await authAPI.getSecureProfile(undefined, {
        'Authorization': `Token ${loginTestData.tokens.valid}`
      });
      
      // Expected: 400 Bad Request
      expect(response.status()).toBe(400);
      
      const body = await response.json();
      expect(body.error).toBe('Bad Request');
      expect(body.message).toContain('Invalid Authorization header format');
    });

    test('TC_05c - Verify protected endpoint denies access when token is invalid', async () => {
      // Pass an invalid/tampered token
      const response = await authAPI.getSecureProfile(loginTestData.tokens.invalid);
      
      // Expected: 403 Forbidden
      expect(response.status()).toBe(403);
      
      const body = await response.json();
      expect(body.error).toBe('Forbidden');
      expect(body.message).toContain('Invalid authentication token');
    });
  });

  /**
   * TOKEN EXPIRATION TESTING
   */
  test.describe('Token Expiration & Refresh Flow Tests', () => {
    test('TC_06a - Verify access is denied when using an expired access token', async () => {
      // Access endpoint with pre-expired token
      const response = await authAPI.getSecureProfile(loginTestData.tokens.expired);
      
      // Expected: 401 Unauthorized
      expect(response.status()).toBe(401);
      
      const body = await response.json();
      expect(body.error).toBe('Unauthorized');
      expect(body.message).toBe('Authorization token has expired.');
    });

    test('TC_06b - Verify token refresh fails with an expired refresh token', async () => {
      // Attempt token refresh with expired refresh token
      const response = await authAPI.validateToken({
        refreshToken: loginTestData.refreshTokens.expired
      });

      // Expected: 401 Unauthorized
      expect(response.status()).toBe(401);

      const body = await response.json();
      expect(body.error).toBe('Unauthorized');
      expect(body.message).toBe('Refresh token has expired.');
    });

    test('TC_06c - Verify token refresh succeeds with a valid refresh token', async () => {
      // Refresh token
      const response = await authAPI.validateToken({
        refreshToken: loginTestData.refreshTokens.valid
      });

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.status).toBe('success');
      expect(body.token).toBe('valid_jwt_token_xyz_123_refreshed');
    });
  });

  /**
   * RATE LIMITING & MULTIPLE HITS TESTING
   */
  test.describe('Rate Limiting & Multiple Hits Tests', () => {
    test('TC_07a - Verify application rate limits locked accounts explicitly (DDT input)', async () => {
      // Request login with rate-limited account email
      const response = await authAPI.signin({
        email: loginTestData.rateLimitEmail,
        password: 'password123'
      });

      // Expected: 429 Too Many Requests
      expect(response.status()).toBe(429);
      
      const body = await response.json();
      expect(body.error).toBe('Too Many Requests');
      expect(body.message).toContain('Account locked');
    });

    test('TC_07b - Verify rate limiter blocks client IP after excessive requests (Multiple API Hits)', async () => {
      // Make 5 requests in rapid succession (within limit)
      for (let i = 0; i < 5; i++) {
        const res = await authAPI.signin({ email: `testip${i}@amazon.in`, password: 'pass' });
        // Can be either 401 (invalid credentials) or 200, but not 429
        expect(res.status()).not.toBe(429);
      }

      // 6th request from same client context (IP) should be rate limited (429)
      const rateLimitedResponse = await authAPI.signin({
        email: 'another_user@amazon.in',
        password: 'password123'
      });

      expect(rateLimitedResponse.status()).toBe(429);
      
      const body = await rateLimitedResponse.json();
      expect(body.error).toBe('Too Many Requests');
      expect(body.message).toContain('Rate limit exceeded. Too many login attempts');
      expect(rateLimitedResponse.headers()['retry-after']).toBe('60');
    });
  });
});
