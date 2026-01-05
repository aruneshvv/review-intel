/**
 * Cloudflare Worker Tests
 *
 * Run: npx vitest tests/worker.test.ts
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock environment
const mockEnv = {
  ANTHROPIC_API_KEY: 'test-api-key',
  ENVIRONMENT: 'test',
};

// Mock fetch for Claude API calls
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Worker API', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('POST /analyze', () => {
    it('should return sentiment analysis for valid request', async () => {
      const mockClaudeResponse = {
        content: [
          {
            text: JSON.stringify({
              score: 0.75,
              sentiment: 'positive',
              summary: 'Users love this product',
              positives: ['Great quality', 'Good value'],
              negatives: ['Slow shipping'],
            }),
          },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockClaudeResponse),
      });

      const request = new Request('http://localhost/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: 'Test Product',
          comments: ['Great product!', 'Love it'],
        }),
      });

      // Import and call worker handler
      const { default: worker } = await import('../worker/src/index');
      const response = await worker.fetch(request, mockEnv);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.score).toBe(0.75);
      expect(data.sentiment).toBe('positive');
      expect(data.positives).toContain('Great quality');
    });

    it('should return 400 for missing product', async () => {
      const request = new Request('http://localhost/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comments: ['test'],
        }),
      });

      const { default: worker } = await import('../worker/src/index');
      const response = await worker.fetch(request, mockEnv);

      expect(response.status).toBe(400);
    });

    it('should return 400 for empty comments', async () => {
      const request = new Request('http://localhost/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: 'Test',
          comments: [],
        }),
      });

      const { default: worker } = await import('../worker/src/index');
      const response = await worker.fetch(request, mockEnv);

      expect(response.status).toBe(400);
    });

    it('should return 500 on Claude API error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: () => Promise.resolve('Internal error'),
      });

      const request = new Request('http://localhost/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: 'Test',
          comments: ['test comment'],
        }),
      });

      const { default: worker } = await import('../worker/src/index');
      const response = await worker.fetch(request, mockEnv);

      expect(response.status).toBe(500);
    });
  });

  describe('GET /health', () => {
    it('should return ok status', async () => {
      const request = new Request('http://localhost/health', {
        method: 'GET',
      });

      const { default: worker } = await import('../worker/src/index');
      const response = await worker.fetch(request, mockEnv);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.status).toBe('ok');
    });
  });

  describe('CORS', () => {
    it('should handle OPTIONS preflight request', async () => {
      const request = new Request('http://localhost/analyze', {
        method: 'OPTIONS',
      });

      const { default: worker } = await import('../worker/src/index');
      const response = await worker.fetch(request, mockEnv);

      expect(response.status).toBe(200);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(response.headers.get('Access-Control-Allow-Methods')).toContain('POST');
    });

    it('should include CORS headers in responses', async () => {
      const request = new Request('http://localhost/health', {
        method: 'GET',
      });

      const { default: worker } = await import('../worker/src/index');
      const response = await worker.fetch(request, mockEnv);

      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
    });
  });

  describe('404 handling', () => {
    it('should return 404 for unknown routes', async () => {
      const request = new Request('http://localhost/unknown', {
        method: 'GET',
      });

      const { default: worker } = await import('../worker/src/index');
      const response = await worker.fetch(request, mockEnv);

      expect(response.status).toBe(404);
    });
  });
});
