interface Env {
  ANTHROPIC_API_KEY: string;
  ENVIRONMENT: string;
}

interface AnalyzeRequest {
  product: string;
  comments: string[];
}

interface SentimentResult {
  score: number;
  sentiment: 'positive' | 'mixed' | 'negative';
  summary: string;
  positives: string[];
  negatives: string[];
  sampleSize: number;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);

    if (url.pathname === '/analyze' && request.method === 'POST') {
      return handleAnalyze(request, env);
    }

    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok' }), {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    return new Response('Not Found', { status: 404, headers: CORS_HEADERS });
  },
};

async function handleAnalyze(request: Request, env: Env): Promise<Response> {
  try {
    const body: AnalyzeRequest = await request.json();

    if (!body.product || !body.comments || body.comments.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Missing product or comments' }),
        { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }

    const result = await analyzeSentiment(body.product, body.comments, env.ANTHROPIC_API_KEY);

    return new Response(JSON.stringify(result), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return new Response(
      JSON.stringify({ error: 'Analysis failed' }),
      { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }
}

async function analyzeSentiment(
  product: string,
  comments: string[],
  apiKey: string
): Promise<SentimentResult> {
  const commentsText = comments.slice(0, 30).join('\n---\n');

  const prompt = `Analyze the sentiment of these Reddit comments about "${product}".

Comments:
${commentsText}

Provide a JSON response with:
1. "score": A number from 0 to 1 (0 = very negative, 0.5 = mixed, 1 = very positive)
2. "sentiment": One of "positive", "mixed", or "negative"
3. "summary": A 1-2 sentence summary of the overall sentiment
4. "positives": Array of 2-4 most mentioned positive points
5. "negatives": Array of 2-4 most mentioned negative points/complaints

Respond ONLY with valid JSON, no other text.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Anthropic API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const content = data.content[0]?.text;

  if (!content) {
    throw new Error('No response from Claude');
  }

  // Parse the JSON response
  const result = JSON.parse(content);

  return {
    score: result.score,
    sentiment: result.sentiment,
    summary: result.summary,
    positives: result.positives || [],
    negatives: result.negatives || [],
    sampleSize: comments.length,
  };
}
