/**
 * Test Data for Amazon Auth API Testing
 */

export const loginTestData = {
  // Successful authentication inputs
  validCredentials: {
    email: 'valid_user@amazon.in',
    password: 'password123'
  },

  // Negative credentials scenarios
  invalidCredentials: [
    {
      description: 'Invalid password with registered email',
      payload: { email: 'valid_user@amazon.in', password: 'wrongPassword' },
      expectedError: 'Invalid credentials. Password or email is incorrect.'
    },
    {
      description: 'Non-existent email address',
      payload: { email: 'nonexistent@amazon.in', password: 'password123' },
      expectedError: 'Invalid credentials. Password or email is incorrect.'
    },
    {
      description: 'Empty credentials fields',
      payload: { email: '', password: '' },
      expectedError: 'Invalid credentials. Password or email is incorrect.'
    }
  ],

  // Parameter tampering scenarios (missing required parameters)
  tamperedPayloads: [
    {
      description: 'Missing password field entirely',
      payload: { email: 'valid_user@amazon.in' },
      expectedStatus: 400,
      expectedError: 'Missing email or password parameter.'
    },
    {
      description: 'Missing email field entirely',
      payload: { password: 'password123' },
      expectedStatus: 400,
      expectedError: 'Missing email or password parameter.'
    }
  ],

  // Security test cases (SQL Injection inputs)
  securityPayloads: [
    {
      description: 'SQL injection payload in email',
      payload: { email: "valid_user@amazon.in' OR '1'='1", password: 'password123' },
      expectedStatus: 403,
      expectedError: 'Security violation: Potential SQL Injection attempt detected.'
    },
    {
      description: 'SQL injection payload in password',
      payload: { email: 'valid_user@amazon.in', password: "' OR 1=1 --" },
      expectedStatus: 403,
      expectedError: 'Security violation: Potential SQL Injection attempt detected.'
    }
  ],

  // Rate limit testing inputs
  rateLimitEmail: 'ratelimit@amazon.in',

  // Bearer Token scenarios for protected profile routes
  tokens: {
    valid: 'valid_jwt_token_xyz_123',
    expired: 'expired_jwt_token_abc_456',
    invalid: 'invalid_and_tampered_jwt_token_789'
  },

  // Token refresh scenarios
  refreshTokens: {
    valid: 'refresh_token_999',
    expired: 'expired_refresh_token',
    invalid: 'invalid_refresh_token_xyz'
  }
};
