import { getCommentsForProduct } from './reddit';
import type { AnalysisState, SentimentResult, MessageType } from './types';

const WORKER_URL = 'https://review-intel-api.epitrove.workers.dev/analyze';

let currentState: AnalysisState = { status: 'idle' };

// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'analyze-selection',
    title: 'Analyze "%s" with Review Intel',
    contexts: ['selection'],
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'analyze-selection' && info.selectionText) {
    await analyzeProduct(info.selectionText);
  }
});

// Handle messages from popup and content scripts
chrome.runtime.onMessage.addListener((message: MessageType, sender, sendResponse) => {
  if (message.type === 'GET_STATE') {
    sendResponse(currentState);
    return true;
  }

  if (message.type === 'ANALYZE_SELECTION') {
    analyzeProduct(message.text);
    sendResponse({ status: 'started' });
    return true;
  }

  return false;
});

async function analyzeProduct(productName: string): Promise<void> {
  const trimmedName = productName.trim();

  if (!trimmedName) {
    updateState({ status: 'error', error: 'No product name provided' });
    return;
  }

  updateState({ status: 'loading', product: trimmedName });

  try {
    // Fetch comments from Reddit
    const comments = await getCommentsForProduct(trimmedName);

    if (comments.length === 0) {
      updateState({
        status: 'error',
        product: trimmedName,
        error: 'No Reddit discussions found for this product',
      });
      return;
    }

    // Send to worker for sentiment analysis
    const response = await fetch(WORKER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product: trimmedName,
        comments: comments,
      }),
    });

    if (!response.ok) {
      throw new Error(`Analysis failed: ${response.status}`);
    }

    const result: SentimentResult = await response.json();

    updateState({
      status: 'success',
      product: trimmedName,
      result,
    });
  } catch (error) {
    updateState({
      status: 'error',
      product: trimmedName,
      error: error instanceof Error ? error.message : 'Analysis failed',
    });
  }
}

function updateState(newState: AnalysisState): void {
  currentState = newState;

  // Store in chrome.storage for persistence
  chrome.storage.local.set({ analysisState: currentState });

  // Notify popup if open
  chrome.runtime.sendMessage({ type: 'STATE_UPDATE', state: currentState }).catch(() => {
    // Popup not open, ignore
  });
}
