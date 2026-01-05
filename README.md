# Review Intel

> Compare public hype with real user sentiment

A Chrome extension that cuts through sponsored reviews and reveals what actual users think about products. It scrapes Reddit discussions and uses AI to analyze sentiment, giving you a clear picture before you buy.

## The Problem

Online reviews are broken:
- Influencer reviews are sponsored
- Marketplace reviews are manipulated
- Video reviews are affiliate-driven

**You don't know what to trust.**

## The Solution

Review Intel compares public hype with private sentiment:

1. Select any product name on a webpage
2. Right-click → "Analyze with Review Intel"
3. Get a sentiment score based on real Reddit discussions

```
Influencers love it  →  Score: 32%
Reddit hates it      →  Avoid
```

## Features

- **Context Menu Analysis** - Right-click on any product name
- **Keyboard Shortcut** - Ctrl+Shift+R for power users
- **Sentiment Score** - 0-100% based on real discussions
- **Key Points** - Top positives and negatives mentioned
- **AI Summary** - Quick overview of user sentiment

## Quick Start

### Prerequisites

- Node.js 18+
- Chrome browser
- [Cloudflare account](https://dash.cloudflare.com/sign-up) (free)
- [Anthropic API key](https://console.anthropic.com/)

### Installation

```bash
# Clone the repo
git clone https://github.com/aruneshvv/review-intel.git
cd review-intel

# Install dependencies
npm install

# Set up Cloudflare Worker
cd worker
npx wrangler login
npx wrangler secret put ANTHROPIC_API_KEY  # Paste your key
npx wrangler deploy
cd ..

# Build extension
npm run build --workspace=extension
```

### Load in Chrome

1. Go to `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `extension` folder

## Usage

### Analyze a Product

1. Go to any product page (Amazon, Best Buy, etc.)
2. Select the product name
3. Right-click → **"Analyze with Review Intel"**
4. Click the extension icon to see results

### Understanding Results

| Score | Meaning |
|-------|---------|
| 70-100% | **Positive** - Users recommend it |
| 40-69% | **Mixed** - Divided opinions |
| 0-39% | **Negative** - Many complaints |

## Development

```bash
# Run worker locally
npm run dev:worker

# Watch extension files
npm run dev:extension

# Run tests
npm test
```

See [Development Guide](docs/development.md) for details.

## Architecture

```
┌─────────────────────┐     ┌──────────────────────┐
│  Chrome Extension   │     │  Cloudflare Worker   │
│                     │     │                      │
│  - Context menu     │────▶│  - Claude Haiku API  │
│  - Reddit scraping  │     │  - Sentiment analysis│
│  - Popup UI         │◀────│  - JSON response     │
└─────────────────────┘     └──────────────────────┘
```

**Tech Stack:**
- Extension: TypeScript, Chrome Manifest V3
- Backend: Cloudflare Workers
- AI: Claude 3 Haiku
- Data: Reddit public API

## Documentation

- [Installation Guide](docs/installation.md)
- [Usage Guide](docs/usage.md)
- [Development Guide](docs/development.md)
- [API Specification](specs/api-spec.md)
- [Technical Specification](specs/technical-spec.md)

## Roadmap

- [ ] Firefox support
- [ ] Additional sources (HackerNews, forums)
- [ ] Historical sentiment tracking
- [ ] Price comparison integration
- [ ] Browser notifications for price drops

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Submit a pull request

## License

MIT

## Disclaimer

This tool analyzes publicly available Reddit discussions. It does not guarantee accuracy and should be used as one of many factors in purchasing decisions. Always do your own research.
