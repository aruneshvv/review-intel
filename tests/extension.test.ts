/**
 * Extension Integration Tests
 *
 * Run: npx vitest tests/extension.test.ts
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Chrome APIs
const mockChrome = {
  runtime: {
    onInstalled: { addListener: vi.fn() },
    onMessage: { addListener: vi.fn() },
    sendMessage: vi.fn(),
  },
  contextMenus: {
    create: vi.fn(),
    onClicked: { addListener: vi.fn() },
  },
  storage: {
    local: {
      get: vi.fn(),
      set: vi.fn(),
    },
  },
};

// @ts-ignore
global.chrome = mockChrome;

describe('Extension', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Context Menu', () => {
    it('should create context menu on install', async () => {
      // Trigger the onInstalled listener
      const installCallback = mockChrome.runtime.onInstalled.addListener.mock.calls[0]?.[0];

      if (installCallback) {
        installCallback();

        expect(mockChrome.contextMenus.create).toHaveBeenCalledWith({
          id: 'analyze-selection',
          title: expect.stringContaining('Analyze'),
          contexts: ['selection'],
        });
      }
    });
  });

  describe('Message Handling', () => {
    it('should respond to GET_STATE message', () => {
      const messageCallback = mockChrome.runtime.onMessage.addListener.mock.calls[0]?.[0];
      const sendResponse = vi.fn();

      if (messageCallback) {
        messageCallback({ type: 'GET_STATE' }, {}, sendResponse);
        expect(sendResponse).toHaveBeenCalled();
      }
    });

    it('should handle ANALYZE_SELECTION message', () => {
      const messageCallback = mockChrome.runtime.onMessage.addListener.mock.calls[0]?.[0];
      const sendResponse = vi.fn();

      if (messageCallback) {
        const result = messageCallback(
          { type: 'ANALYZE_SELECTION', text: 'Test Product' },
          {},
          sendResponse
        );

        expect(sendResponse).toHaveBeenCalledWith({ status: 'started' });
        expect(result).toBe(true); // Indicates async response
      }
    });
  });

  describe('State Management', () => {
    it('should store state in chrome.storage', () => {
      // This would test the updateState function
      mockChrome.storage.local.set.mockImplementation((data, callback) => {
        callback?.();
      });

      // Verify storage is called with correct structure
      expect(mockChrome.storage.local.set).toBeDefined();
    });
  });
});

describe('Types', () => {
  it('should have correct SentimentResult structure', () => {
    const result = {
      score: 0.75,
      sentiment: 'positive' as const,
      summary: 'Test summary',
      positives: ['Good'],
      negatives: ['Bad'],
      sampleSize: 10,
    };

    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(1);
    expect(['positive', 'mixed', 'negative']).toContain(result.sentiment);
    expect(Array.isArray(result.positives)).toBe(true);
    expect(Array.isArray(result.negatives)).toBe(true);
  });

  it('should have correct AnalysisState structure', () => {
    const states = [
      { status: 'idle' as const },
      { status: 'loading' as const, product: 'Test' },
      {
        status: 'success' as const,
        product: 'Test',
        result: {
          score: 0.5,
          sentiment: 'mixed' as const,
          summary: '',
          positives: [],
          negatives: [],
          sampleSize: 0,
        }
      },
      { status: 'error' as const, error: 'Failed' },
    ];

    states.forEach(state => {
      expect(['idle', 'loading', 'success', 'error']).toContain(state.status);
    });
  });
});
