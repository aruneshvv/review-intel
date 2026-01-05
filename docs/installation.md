# Installation Guide

This guide walks you through setting up Review Intel for development and production use.

## Prerequisites

- **Node.js** 18+ ([download](https://nodejs.org/))
- **npm** 9+ (comes with Node.js)
- **Chrome** browser
- **Cloudflare account** (free tier) - [sign up](https://dash.cloudflare.com/sign-up)
- **Anthropic API key** - [get one](https://console.anthropic.com/)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/aruneshvv/review-intel.git
cd review-intel
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Cloudflare Worker

#### Login to Cloudflare

```bash
cd worker
npx wrangler login
```

This opens a browser window. Authorize the application.

#### Set Your Anthropic API Key

```bash
npx wrangler secret put ANTHROPIC_API_KEY
```

Paste your API key when prompted.

#### Deploy the Worker

```bash
npx wrangler deploy
```

Note the deployed URL (e.g., `https://review-intel-api.YOUR-SUBDOMAIN.workers.dev`).

### 4. Configure the Extension

Update the worker URL in `extension/src/background.ts`:

```typescript
const WORKER_URL = 'https://review-intel-api.YOUR-SUBDOMAIN.workers.dev/analyze';
```

### 5. Build the Extension

```bash
cd ..
npm run build --workspace=extension
```

### 6. Load in Chrome

1. Open Chrome and go to `chrome://extensions`
2. Enable **Developer mode** (toggle in top right)
3. Click **Load unpacked**
4. Select the `extension` folder (not `extension/dist`)
5. The Review Intel icon appears in your toolbar

## Verify Installation

1. Go to any product page (e.g., Amazon)
2. Select a product name
3. Right-click → **"Analyze with Review Intel"**
4. Click the extension icon to see results

## Development Setup

### Run Worker Locally

```bash
npm run dev:worker
```

The worker runs at `http://localhost:8787`. Update `background.ts` to use this URL during development.

### Watch Mode for Extension

```bash
npm run dev:extension
```

After making changes, go to `chrome://extensions` and click the refresh icon on the Review Intel card.

### Run Tests

```bash
npm test
```

## Troubleshooting

### "No Reddit discussions found"

- The product name might be too specific or obscure
- Try a more general search term
- Check if Reddit is accessible from your network

### Extension not loading

- Ensure you selected the `extension` folder, not `extension/dist`
- Check for errors in `chrome://extensions`
- Look at the service worker console for errors

### Worker returning errors

- Verify the API key is set: `npx wrangler secret list`
- Check worker logs: `npx wrangler tail`
- Ensure the worker is deployed: `npx wrangler deploy`

### CORS errors

- The worker should return proper CORS headers
- Check browser console for specific error messages
- Verify the worker URL in `background.ts` is correct

## Updating

### Update Extension

```bash
git pull
npm install
npm run build --workspace=extension
```

Then refresh the extension in `chrome://extensions`.

### Update Worker

```bash
git pull
npm install
npx wrangler deploy
```
