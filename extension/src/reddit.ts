import type { RedditPost, RedditComment } from './types';

const REDDIT_SEARCH_URL = 'https://www.reddit.com/search.json';
const MAX_COMMENTS_PER_POST = 20;
const MAX_POSTS = 5;

interface RedditSearchResponse {
  data: {
    children: Array<{
      data: RedditPost;
    }>;
  };
}

interface RedditCommentsResponse {
  data: {
    children: Array<{
      kind: string;
      data: {
        body?: string;
        score?: number;
        subreddit?: string;
        replies?: RedditCommentsResponse;
      };
    }>;
  };
}

export async function searchReddit(query: string): Promise<RedditPost[]> {
  const params = new URLSearchParams({
    q: query,
    sort: 'relevance',
    t: 'all',
    limit: MAX_POSTS.toString(),
  });

  const response = await fetch(`${REDDIT_SEARCH_URL}?${params}`, {
    headers: {
      'User-Agent': 'ReviewIntel/0.1.0',
    },
  });

  if (!response.ok) {
    throw new Error(`Reddit search failed: ${response.status}`);
  }

  const data: RedditSearchResponse = await response.json();
  return data.data.children.map((child) => child.data);
}

export async function fetchPostComments(permalink: string): Promise<RedditComment[]> {
  const url = `https://www.reddit.com${permalink}.json?limit=${MAX_COMMENTS_PER_POST}`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'ReviewIntel/0.1.0',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch comments: ${response.status}`);
  }

  const data: RedditCommentsResponse[] = await response.json();

  // Comments are in the second element of the response array
  if (!data[1]?.data?.children) {
    return [];
  }

  return extractComments(data[1]);
}

function extractComments(commentsData: RedditCommentsResponse): RedditComment[] {
  const comments: RedditComment[] = [];

  for (const child of commentsData.data.children) {
    if (child.kind === 't1' && child.data.body) {
      comments.push({
        body: child.data.body,
        score: child.data.score ?? 0,
        subreddit: child.data.subreddit ?? '',
      });

      // Recursively extract nested replies
      if (child.data.replies && typeof child.data.replies === 'object') {
        comments.push(...extractComments(child.data.replies));
      }
    }
  }

  return comments;
}

export async function getCommentsForProduct(productName: string): Promise<string[]> {
  const posts = await searchReddit(productName);

  if (posts.length === 0) {
    return [];
  }

  const allComments: RedditComment[] = [];

  // Fetch comments from each post in parallel
  const commentPromises = posts.map((post) => fetchPostComments(post.permalink));
  const results = await Promise.allSettled(commentPromises);

  for (const result of results) {
    if (result.status === 'fulfilled') {
      allComments.push(...result.value);
    }
  }

  // Sort by score and return top comments as strings
  return allComments
    .sort((a, b) => b.score - a.score)
    .slice(0, 50)
    .map((c) => c.body);
}
