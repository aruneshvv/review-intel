# Development Guide

Technical guide for contributing to Review Intel.

## Project Structure

```
review-intel/
├── extension/           # Chrome extension
│   ├── manifest.json    # Extension manifest (v3)
│   ├── src/
│   │   ├── background.ts    # Service worker
│   │   ├── content.ts       # Content script
│   │   ├── reddit.ts        # Reddit API client
│   │   ├── types.ts         # TypeScript types
│   │   └── popup/           # Popup UI
│   │       ├── popup.html
│   │       ├── popup.css
│   │       └── popup.ts
│   └── dist/            # Built files
├── worker/              # Cloudflare Worker
│   ├── src/
│   │   └── index.ts     # API endpoint
│   └── wrangler.toml    # Cloudflare config
├── tests/               # Test files
├── specs/               # Specifications
└── docs/                # Documentation
```

## Development Workflow

### 1. Start the Worker Locally

```bash
npm run dev:worker
```

Runs at `http://localhost:8787`.

### 2. Update Extension for Local Development

Edit `extension/src/background.ts`:

```typescript
const WORKER_URL = 'http://localhost:8787/analyze';
```

### 3. Build and Watch Extension

```bash
npm run dev:extension
```

### 4. Load Extension in Chrome

1. Go to `chrome://extensions`
2. Enable Developer mode
3. Load unpacked → select `extension/` folder

### 5. Make Changes

- Edit source files in `extension/src/` or `worker/src/`
- Extension auto-rebuilds on save
- Refresh extension in Chrome to see changes
- Worker hot-reloads automatically

## Code Style

### TypeScript

- Strict mode enabled
- Use explicit types for function parameters
- Prefer `interface` over `type` for objects
- Use `const` assertions for string literals

```typescript
// Good
interface SentimentResult {
  score: number;
  sentiment: 'positive' | 'mixed' | 'negative';
}

// Avoid
type SentimentResult = {
  score: number;
  sentiment: string;
}
```

### Naming Conventions

- Files: `kebab-case.ts`
- Functions: `camelCase`
- Types/Interfaces: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`

### Error Handling

```typescript
// Always catch and handle errors appropriately
try {
  const result = await riskyOperation();
} catch (error) {
  console.error('Operation failed:', error);
  // Return meaningful error to user
  return { error: 'Something went wrong' };
}
```

## Testing

### Run Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

### Writing Tests

Tests are in `tests/` using Vitest:

```typescript
import { describe, it, expect, vi } from 'vitest';

describe('myFunction', () => {
  it('should do something', () => {
    const result = myFunction('input');
    expect(result).toBe('expected');
  });
});
```

### Mocking

```typescript
// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

mockFetch.mockResolvedValueOnce({
  ok: true,
  json: () => Promise.resolve({ data: 'value' }),
});
```

## Architecture Decisions

### Why Manifest V3?

- Required for new Chrome extensions
- Better security model
- Service workers instead of background pages

### Why Cloudflare Workers?

- Generous free tier (100k requests/day)
- Global edge deployment
- No cold starts
- Simple deployment

### Why Claude Haiku?

- Fast response times (~1-2s)
- Cheap ($0.25/1M input tokens)
- Good at structured output
- Understands nuance and sarcasm

### Why Client-Side Reddit Scraping?

- Avoids proxy costs
- User's IP for rate limiting
- Reddit's public JSON API is free
- No authentication required

## API Flow

```
User Action
    │
    ▼
Content Script / Popup
    │
    ▼ chrome.runtime.sendMessage
    │
Background Service Worker
    │
    ├──▶ Reddit API (fetch comments)
    │
    ▼
Cloudflare Worker
    │
    ├──▶ Claude Haiku API
    │
    ▼
Background Service Worker
    │
    ▼ chrome.storage + chrome.runtime.sendMessage
    │
Popup UI (display results)
```

## Adding New Features

### Adding a New Data Source

1. Create a new client in `extension/src/` (e.g., `hackernews.ts`)
2. Export a function like `getCommentsForProduct(name: string): Promise<string[]>`
3. Import and call in `background.ts`
4. Merge results with existing Reddit comments

### Adding New Analysis Types

1. Update the worker prompt in `worker/src/index.ts`
2. Add new fields to response interface
3. Update `extension/src/types.ts`
4. Update popup UI to display new data

### Adding Browser Support

1. Create browser-specific manifest files
2. Abstract browser APIs in a compatibility layer
3. Add build targets for each browser

## Deployment

### Deploy Worker

```bash
npm run deploy:worker
```

### Prepare Extension for Store

1. Update version in `manifest.json`
2. Build: `npm run build --workspace=extension`
3. Zip the `extension/` folder
4. Submit to Chrome Web Store

## Debugging

### Extension Logs

1. Go to `chrome://extensions`
2. Find Review Intel
3. Click "Service worker" link
4. View console output

### Worker Logs

```bash
cd worker
npx wrangler tail
```

### Common Issues

**"Cannot read property 'x' of undefined"**
- Check if Reddit response format changed
- Verify API responses in network tab

**"CORS error"**
- Verify worker is deployed
- Check CORS headers in worker response

**"Rate limited"**
- Reddit limits ~60 requests/minute
- Add caching to reduce requests
