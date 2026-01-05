export interface RedditPost {
  title: string;
  selftext: string;
  subreddit: string;
  permalink: string;
  score: number;
  num_comments: number;
}

export interface RedditComment {
  body: string;
  score: number;
  subreddit: string;
}

export interface SentimentResult {
  score: number;
  sentiment: 'positive' | 'mixed' | 'negative';
  summary: string;
  positives: string[];
  negatives: string[];
  sampleSize: number;
}

export interface AnalyzeRequest {
  product: string;
  comments: string[];
}

export interface AnalysisState {
  status: 'idle' | 'loading' | 'success' | 'error';
  product?: string;
  result?: SentimentResult;
  error?: string;
}

export type MessageType =
  | { type: 'ANALYZE_SELECTION'; text: string }
  | { type: 'GET_STATE' }
  | { type: 'STATE_UPDATE'; state: AnalysisState };
