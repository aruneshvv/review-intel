# Technical Specification

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Chrome Extension                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Popup     │  │  Content    │  │    Background           │  │
│  │   (UI)      │  │  Script     │  │    Service Worker       │  │
│  │             │  │             │  │                         │  │
│  │ - Display   │  │ - Keyboard  │  │ - Context menu          │  │
│  │   results   │  │   shortcuts │  │ - Reddit API client     │  │
│  │ - Manual    │  │ - Selection │  │ - State management      │  │
│  │   input     │  │   handling  │  │ - Worker communication  │  │
│  └─────────────┘  └─────────────┘  └───────────┬─────────────┘  │
│                                                 │                 │
└─────────────────────────────────────────────────┼─────────────────┘
                                                  │
                                                  ▼
                                    ┌─────────────────────────┐
                                    │   Cloudflare Worker     │
                                    │                         │
                                    │ - POST /analyze         │
                                    │ - Claude Haiku API      │
                                    │ - Sentiment extraction  │
                                    └─────────────────────────┘
```

## Component Specifications

### 1. Chrome Extension

#### manifest.json
- Manifest Version: 3
- Permissions: contextMenus, storage, activeTab
- Host Permissions: reddit.com

#### background.ts (Service Worker)
```typescript
// Responsibilities:
// - Register context menu on install
// - Handle context menu clicks
// - Fetch Reddit comments
// - Send to worker for analysis
// - Store and broadcast state

// State Machine:
// idle -> loading -> success | error
```

#### content.ts (Content Script)
```typescript
// Responsibilities:
// - Listen for keyboard shortcut (Ctrl+Shift+R)
// - Get selected text
// - Send to background for analysis
```

#### popup/ (Extension Popup)
```typescript
// Components:
// - Idle state: instructions + manual input
// - Loading state: spinner + product name
// - Success state: score, sentiment, details
// - Error state: message + retry button
```

#### reddit.ts (Reddit Client)
```typescript
// Functions:
// - searchReddit(query): RedditPost[]
// - fetchPostComments(permalink): RedditComment[]
// - getCommentsForProduct(name): string[]

// API Endpoints:
// - GET reddit.com/search.json?q={query}
// - GET reddit.com{permalink}.json
```

### 2. Cloudflare Worker

#### Endpoint: POST /analyze
```typescript
// Request:
{
  product: string;
  comments: string[];
}

// Response:
{
  score: number;        // 0-1
  sentiment: string;    // positive | mixed | negative
  summary: string;      // 1-2 sentences
  positives: string[];  // Top 2-4 positives
  negatives: string[];  // Top 2-4 negatives
  sampleSize: number;   // Comment count
}
```

#### Claude Integration
- Model: claude-3-haiku-20240307
- Max tokens: 500
- Prompt: Structured JSON output request

## Data Flow

### Analysis Flow
1. User selects product text
2. Right-click → "Analyze with Review Intel"
3. Background script receives product name
4. State → loading, broadcast to popup
5. Search Reddit for product discussions
6. Fetch top 5 posts' comments
7. Extract top 50 comments by score
8. POST comments to Cloudflare Worker
9. Worker sends to Claude Haiku with prompt
10. Parse Claude's JSON response
11. State → success, broadcast to popup
12. Popup displays results

### Error Handling
- No Reddit results → Show "No discussions found"
- Worker API error → Show generic error + retry
- Claude API error → Log, return 500 to extension

## Security Considerations

- API key stored as Cloudflare secret (not in code)
- CORS headers restrict to extension origin
- No user data stored server-side
- Reddit requests use public JSON API (no auth)

## Performance Targets

| Metric | Target |
|--------|--------|
| Reddit fetch | < 2s |
| Worker analysis | < 3s |
| Total time | < 5s |
| Extension size | < 50KB |

## Rate Limits

- Reddit: ~60 requests/minute (per IP)
- Claude Haiku: Based on API tier
- Cloudflare Worker: 100k requests/day (free tier)
