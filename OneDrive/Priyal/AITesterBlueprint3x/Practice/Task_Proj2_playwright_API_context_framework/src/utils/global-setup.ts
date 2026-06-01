import { FullConfig } from '@playwright/test';
import { MockServer } from '../mock/MockServer';

async function globalSetup(config: FullConfig) {
  console.log('[GLOBAL SETUP] Starting local mock server...');
  const server = new MockServer(3001);
  await server.start();
  
  // Save server instance in globalThis to access it during globalTeardown
  (globalThis as any).__MOCK_SERVER__ = server;
}

export default globalSetup;
