# Smoke Tests

Quick sanity checks to verify core functionality after deployment or updates.

**Time to complete**: ~5 minutes

---

## Pre-flight Checks

- [ ] Chrome browser open
- [ ] Extension loaded and enabled
- [ ] Internet connection active

---

## ST-001: Extension Loads

**Time**: 30 seconds

1. Go to `chrome://extensions`
2. Verify Review Intel is listed
3. Verify no error badges on the card

**Pass**: Extension visible, no errors

---

## ST-002: Worker Responds

**Time**: 30 seconds

1. Open new tab
2. Go to `https://review-intel-api.epitrove.workers.dev/health`
3. Verify response shows `{"status":"ok"}`

**Pass**: 200 OK with status ok

---

## ST-003: Context Menu Works

**Time**: 1 minute

1. Go to google.com
2. Select text "iPhone 15"
3. Right-click
4. Verify "Analyze" option appears

**Pass**: Context menu item visible

---

## ST-004: End-to-End Analysis

**Time**: 2 minutes

1. On any page, select "Sony WH-1000XM5"
2. Right-click → Analyze with Review Intel
3. Click extension icon
4. Wait for results

**Pass**: Score, sentiment, and summary display

---

## ST-005: Manual Input Works

**Time**: 1 minute

1. Click extension icon
2. Type "MacBook Pro" in input
3. Press Enter
4. Verify analysis runs

**Pass**: Results display for manual input

---

## Quick Results

| Test | Result |
|------|--------|
| ST-001 | Pass / Fail |
| ST-002 | Pass / Fail |
| ST-003 | Pass / Fail |
| ST-004 | Pass / Fail |
| ST-005 | Pass / Fail |

**Overall**: ___/5 Passed

**Date**: ____________

**Tester**: ____________

---

## If Any Test Fails

1. Check browser console for errors (F12 → Console)
2. Check service worker logs (chrome://extensions → Service worker)
3. Check worker logs: `npx wrangler tail`
4. See [Troubleshooting Guide](../../docs/installation.md#troubleshooting)
