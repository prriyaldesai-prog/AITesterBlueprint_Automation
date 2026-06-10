import { FullConfig } from '@playwright/test';
import { MockServer } from '../mock/MockServer';

async function globalTeardown(config: FullConfig) {
  console.log('[GLOBAL TEARDOWN] Stopping mock server...');
  const server = (globalThis as any).__MOCK_SERVER__ as MockServer;
  
  if (server) {
    await server.stop();
    console.log('[GLOBAL TEARDOWN] Mock server successfully stopped.');
  } else {
    console.log('[GLOBAL TEARDOWN] No mock server instance found to stop.');
  }
}

export default globalTeardown;
