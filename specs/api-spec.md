# API Specification

## Cloudflare Worker API

Base URL: `https://review-intel-api.epitrove.workers.dev`

### Endpoints

---

### POST /analyze

Analyzes sentiment of Reddit comments about a product using Claude Haiku.

#### Request

```http
POST /analyze
Content-Type: application/json
```

```json
{
  "product": "Sony WH-1000XM5",
  "comments": [
    "Best noise cancelling I've ever used",
    "Sound quality is amazing but build feels cheap",
    "Overpriced for what you get",
    "..."
  ]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| product | string | Yes | Product name for context |
| comments | string[] | Yes | Array of Reddit comments (max 50) |

#### Response

**Success (200)**
```json
{
  "score": 0.65,
  "sentiment": "mixed",
  "summary": "Generally positive for sound quality and ANC, but concerns about build quality and price.",
  "positives": [
    "Excellent noise cancellation",
    "Great sound quality",
    "Comfortable for long sessions"
  ],
  "negatives": [
    "Build quality concerns",
    "High price point",
    "Touch controls unreliable"
  ],
  "sampleSize": 47
}
```

| Field | Type | Description |
|-------|------|-------------|
| score | number | Sentiment score from 0 (negative) to 1 (positive) |
| sentiment | string | Category: "positive", "mixed", or "negative" |
| summary | string | 1-2 sentence summary of overall sentiment |
| positives | string[] | Top 2-4 positive points mentioned |
| negatives | string[] | Top 2-4 negative points/complaints |
| sampleSize | number | Number of comments analyzed |

**Error (400)**
```json
{
  "error": "Missing product or comments"
}
```

**Error (500)**
```json
{
  "error": "Analysis failed"
}
```

---

### GET /health

Health check endpoint.

#### Response

**Success (200)**
```json
{
  "status": "ok"
}
```

---

## Reddit API (Public)

Used by the extension to fetch discussions.

### Search Posts

```http
GET https://www.reddit.com/search.json?q={query}&sort=relevance&t=all&limit=5
```

| Param | Description |
|-------|-------------|
| q | Search query (product name) |
| sort | Sort order (relevance) |
| t | Time period (all) |
| limit | Max results (5) |

### Fetch Comments

```http
GET https://www.reddit.com{permalink}.json?limit=20
```

| Param | Description |
|-------|-------------|
| permalink | Post permalink from search results |
| limit | Max comments per post |

---

## Extension Messages (Internal)

### ANALYZE_SELECTION
Triggers product analysis.

```typescript
{
  type: 'ANALYZE_SELECTION',
  text: string  // Selected product name
}
```

### GET_STATE
Requests current analysis state.

```typescript
{
  type: 'GET_STATE'
}
```

### STATE_UPDATE
Broadcasts state changes.

```typescript
{
  type: 'STATE_UPDATE',
  state: {
    status: 'idle' | 'loading' | 'success' | 'error',
    product?: string,
    result?: SentimentResult,
    error?: string
  }
}
```
