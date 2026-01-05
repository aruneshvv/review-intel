/**
 * Reddit API Client Tests
 *
 * Run: npx vitest tests/reddit.test.ts
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Import after mocking
import { searchReddit, fetchPostComments, getCommentsForProduct } from '../extension/src/reddit';

describe('Reddit API Client', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('searchReddit', () => {
    it('should return posts from Reddit search', async () => {
      const mockResponse = {
        data: {
          children: [
            {
              data: {
                title: 'Sony WH-1000XM5 Review',
                selftext: 'Great headphones',
                subreddit: 'headphones',
                permalink: '/r/headphones/comments/abc123/sony_review',
                score: 150,
                num_comments: 45,
              },
            },
          ],
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const posts = await searchReddit('Sony WH-1000XM5');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('reddit.com/search.json'),
        expect.objectContaining({
          headers: { 'User-Agent': 'ReviewIntel/0.1.0' },
        })
      );
      expect(posts).toHaveLength(1);
      expect(posts[0].title).toBe('Sony WH-1000XM5 Review');
    });

    it('should throw error on failed request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
      });

      await expect(searchReddit('test')).rejects.toThrow('Reddit search failed: 429');
    });

    it('should handle empty results', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: { children: [] } }),
      });

      const posts = await searchReddit('nonexistent product xyz');
      expect(posts).toHaveLength(0);
    });
  });

  describe('fetchPostComments', () => {
    it('should extract comments from post', async () => {
      const mockResponse = [
        { data: {} }, // Post data
        {
          data: {
            children: [
              {
                kind: 't1',
                data: {
                  body: 'Great product!',
                  score: 50,
                  subreddit: 'headphones',
                },
              },
              {
                kind: 't1',
                data: {
                  body: 'Not worth the price',
                  score: 25,
                  subreddit: 'headphones',
                },
              },
            ],
          },
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const comments = await fetchPostComments('/r/headphones/comments/abc');

      expect(comments).toHaveLength(2);
      expect(comments[0].body).toBe('Great product!');
      expect(comments[0].score).toBe(50);
    });

    it('should handle nested replies', async () => {
      const mockResponse = [
        { data: {} },
        {
          data: {
            children: [
              {
                kind: 't1',
                data: {
                  body: 'Parent comment',
                  score: 100,
                  subreddit: 'test',
                  replies: {
                    data: {
                      children: [
                        {
                          kind: 't1',
                          data: {
                            body: 'Reply comment',
                            score: 20,
                            subreddit: 'test',
                          },
                        },
                      ],
                    },
                  },
                },
              },
            ],
          },
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const comments = await fetchPostComments('/r/test/comments/xyz');

      expect(comments).toHaveLength(2);
      expect(comments[0].body).toBe('Parent comment');
      expect(comments[1].body).toBe('Reply comment');
    });
  });

  describe('getCommentsForProduct', () => {
    it('should aggregate comments from multiple posts', async () => {
      // Mock search
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              children: [
                { data: { permalink: '/r/test/comments/1' } },
                { data: { permalink: '/r/test/comments/2' } },
              ],
            },
          }),
      });

      // Mock comments for each post
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve([
            { data: {} },
            {
              data: {
                children: [
                  { kind: 't1', data: { body: 'Comment 1', score: 10, subreddit: 'test' } },
                ],
              },
            },
          ]),
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve([
            { data: {} },
            {
              data: {
                children: [
                  { kind: 't1', data: { body: 'Comment 2', score: 20, subreddit: 'test' } },
                ],
              },
            },
          ]),
      });

      const comments = await getCommentsForProduct('test product');

      expect(comments).toHaveLength(2);
      // Should be sorted by score (highest first)
      expect(comments[0]).toBe('Comment 2');
      expect(comments[1]).toBe('Comment 1');
    });

    it('should return empty array when no posts found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: { children: [] } }),
      });

      const comments = await getCommentsForProduct('nonexistent');
      expect(comments).toHaveLength(0);
    });
  });
});
