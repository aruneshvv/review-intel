# Product Requirements Document

## Problem Statement

Online reviews are increasingly unreliable:
- Influencer reviews are sponsored
- Marketplace reviews are manipulated
- Video reviews are affiliate-driven

Buyers don't know what to trust.

## Solution

A browser extension that compares public hype with private sentiment by:
1. Scraping Reddit and community forums
2. Comparing influencer praise with real user complaints
3. Outputting a simple sentiment gap score

## Target Users

- Online shoppers
- Buyers of high-ticket products
- Users tired of sponsored opinions

## User Stories

### US-1: Analyze Product via Context Menu
**As a** shopper browsing a product page
**I want to** right-click on a product name and analyze sentiment
**So that** I can see what real users think before purchasing

**Acceptance Criteria:**
- Context menu appears on text selection
- Analysis starts immediately on click
- Results display in extension popup

### US-2: Manual Product Search
**As a** user
**I want to** manually enter a product name in the extension
**So that** I can analyze products not visible on the current page

**Acceptance Criteria:**
- Text input field in popup
- Enter key or button triggers analysis
- Same results format as context menu analysis

### US-3: View Sentiment Analysis
**As a** user
**I want to** see a clear sentiment breakdown
**So that** I can quickly decide if a product is worth buying

**Acceptance Criteria:**
- Numerical score (0-100%)
- Sentiment label (positive/mixed/negative)
- List of top positives and negatives
- Summary sentence
- Sample size indicator

### US-4: Keyboard Shortcut
**As a** power user
**I want to** use a keyboard shortcut to analyze selected text
**So that** I can work faster without right-clicking

**Acceptance Criteria:**
- Ctrl+Shift+R triggers analysis on selection
- Works on any webpage

## MVP Scope

### In Scope
- Chrome extension (Manifest V3)
- Reddit as primary data source
- Claude Haiku for sentiment analysis
- Basic positive/negative scoring
- Context menu integration
- Simple popup UI

### Out of Scope (Future)
- Firefox/Safari support
- Additional forums (HackerNews, specialized forums)
- Historical sentiment tracking
- Price comparison
- Browser notifications
- User accounts/preferences
