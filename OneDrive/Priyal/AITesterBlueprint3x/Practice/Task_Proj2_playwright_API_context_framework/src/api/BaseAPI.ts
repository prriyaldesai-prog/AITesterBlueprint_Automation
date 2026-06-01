import { APIRequestContext, APIResponse } from '@playwright/test';

export class BaseAPI {
  protected request: APIRequestContext;
  protected contextPath: string;

  constructor(request: APIRequestContext, contextPath: string = '') {
    this.request = request;
    this.contextPath = contextPath;
  }

  /**
   * Helper to construct the full URI
   */
  protected getUrl(endpoint: string): string {
    return `${this.contextPath}${endpoint}`;
  }

  /**
   * Safe wrapper for POST requests with built-in logging
   */
  protected async post(endpoint: string, options?: Parameters<APIRequestContext['post']>[1]): Promise<APIResponse> {
    const url = this.getUrl(endpoint);
    console.log(`[API REQUEST] POST ${url}`);
    if (options?.data) {
      console.log(`[API REQUEST BODY]`, JSON.stringify(options.data, null, 2));
    }
    if (options?.headers) {
      console.log(`[API REQUEST HEADERS]`, JSON.stringify(options.headers, null, 2));
    }

    const response = await this.request.post(url, options);
    await this.logResponse(response);
    return response;
  }

  /**
   * Safe wrapper for GET requests with built-in logging
   */
  protected async get(endpoint: string, options?: Parameters<APIRequestContext['get']>[1]): Promise<APIResponse> {
    const url = this.getUrl(endpoint);
    console.log(`[API REQUEST] GET ${url}`);
    if (options?.headers) {
      console.log(`[API REQUEST HEADERS]`, JSON.stringify(options.headers, null, 2));
    }

    const response = await this.request.get(url, options);
    await this.logResponse(response);
    return response;
  }

  /**
   * Unified response logger
   */
  private async logResponse(response: APIResponse): Promise<void> {
    console.log(`[API RESPONSE] Status: ${response.status()} ${response.statusText()}`);
    
    try {
      const contentType = response.headers()['content-type'] || '';
      if (contentType.includes('application/json')) {
        const body = await response.json();
        console.log(`[API RESPONSE BODY]`, JSON.stringify(body, null, 2));
      } else {
        const text = await response.text();
        console.log(`[API RESPONSE BODY] (Plaintext/HTML): ${text.substring(0, 500)}${text.length > 500 ? '...' : ''}`);
      }
    } catch (e) {
      console.log(`[API RESPONSE] Could not parse response body:`, (e as Error).message);
    }
  }
}
