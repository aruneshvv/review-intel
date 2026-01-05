/**
 * Test Setup
 *
 * Global setup for all tests
 */

import { vi } from 'vitest';

// Mock fetch globally
global.fetch = vi.fn();

// Mock Chrome APIs
const mockChrome = {
  runtime: {
    onInstalled: { addListener: vi.fn() },
    onMessage: { addListener: vi.fn() },
    sendMessage: vi.fn().mockImplementation(() => Promise.resolve()),
  },
  contextMenus: {
    create: vi.fn(),
    onClicked: { addListener: vi.fn() },
  },
  storage: {
    local: {
      get: vi.fn().mockImplementation(() => Promise.resolve({})),
      set: vi.fn().mockImplementation(() => Promise.resolve()),
    },
  },
};

// @ts-ignore
global.chrome = mockChrome;

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});
