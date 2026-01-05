# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Review-Intel is a browser extension that compares public hype with real user sentiment from Reddit. It scrapes Reddit discussions about products and uses Claude Haiku to analyze sentiment, helping users identify when influencer praise doesn't match real user experiences.

## Build & Development Commands

```bash
# Install all dependencies (from root)
npm install

# Build extension
npm run build --workspace=extension

# Watch mode for extension development
npm run dev:extension

# Run Cloudflare Worker locally
npm run dev:worker

# Deploy worker to Cloudflare
npm run deploy:worker
```

### First-time Setup

1. Get Claude API key from console.anthropic.com
2. Set worker secret: `cd worker && npx wrangler secret put ANTHROPIC_API_KEY`
3. Build extension: `npm run build --workspace=extension`
4. Load in Chrome: chrome://extensions → Developer mode → Load unpacked → select `extension/` folder

## Architecture

```
extension/          Chrome extension (Manifest V3)
├── src/
│   ├── background.ts    Service worker - context menu, orchestration
│   ├── content.ts       Content script - keyboard shortcut handler
│   ├── reddit.ts        Reddit API client - search + comment fetching
│   ├── popup/           Extension popup UI
│   └── types.ts         Shared TypeScript types
└── dist/                Built output (load this in Chrome)

worker/             Cloudflare Worker
└── src/index.ts    Sentiment analysis endpoint using Claude Haiku
```

### Data Flow

1. User selects product text → right-click → "Analyze with Review Intel"
2. Extension fetches Reddit search results + comments (client-side)
3. Comments sent to Cloudflare Worker → Claude Haiku analyzes sentiment
4. Popup displays: score (0-100%), sentiment, positives, negatives, summary

### Key APIs

- **Reddit**: Public JSON API (`reddit.com/search.json`, `{permalink}.json`)
- **Claude**: Haiku model via Anthropic API for sentiment analysis
- **Worker endpoint**: `POST /analyze` with `{ product, comments[] }`
