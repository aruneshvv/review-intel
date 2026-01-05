import type { AnalysisState, SentimentResult } from '../types';

// DOM Elements
const idleState = document.getElementById('idle-state')!;
const loadingState = document.getElementById('loading-state')!;
const successState = document.getElementById('success-state')!;
const errorState = document.getElementById('error-state')!;

const productInput = document.getElementById('product-input') as HTMLInputElement;
const analyzeBtn = document.getElementById('analyze-btn')!;
const retryBtn = document.getElementById('retry-btn')!;

const loadingProduct = document.getElementById('loading-product')!;
const resultProduct = document.getElementById('result-product')!;
const scoreCircle = document.getElementById('score-circle')!;
const scoreValue = document.getElementById('score-value')!;
const sentimentLabel = document.getElementById('sentiment-label')!;
const summary = document.getElementById('summary')!;
const positivesList = document.getElementById('positives-list')!;
const negativesList = document.getElementById('negatives-list')!;
const sampleSize = document.getElementById('sample-size')!;
const errorMessage = document.getElementById('error-message')!;

// State
let lastProduct = '';

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  // Load saved state
  const stored = await chrome.storage.local.get('analysisState');
  if (stored.analysisState) {
    updateUI(stored.analysisState);
  }

  // Also check with background script for latest state
  chrome.runtime.sendMessage({ type: 'GET_STATE' }, (response: AnalysisState) => {
    if (response) {
      updateUI(response);
    }
  });
});

// Listen for state updates
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'STATE_UPDATE') {
    updateUI(message.state);
  }
});

// Event handlers
analyzeBtn.addEventListener('click', () => {
  const product = productInput.value.trim();
  if (product) {
    lastProduct = product;
    chrome.runtime.sendMessage({ type: 'ANALYZE_SELECTION', text: product });
  }
});

productInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    analyzeBtn.click();
  }
});

retryBtn.addEventListener('click', () => {
  if (lastProduct) {
    chrome.runtime.sendMessage({ type: 'ANALYZE_SELECTION', text: lastProduct });
  } else {
    showState('idle');
  }
});

function showState(state: 'idle' | 'loading' | 'success' | 'error'): void {
  idleState.classList.toggle('hidden', state !== 'idle');
  loadingState.classList.toggle('hidden', state !== 'loading');
  successState.classList.toggle('hidden', state !== 'success');
  errorState.classList.toggle('hidden', state !== 'error');
}

function updateUI(state: AnalysisState): void {
  if (state.product) {
    lastProduct = state.product;
  }

  switch (state.status) {
    case 'idle':
      showState('idle');
      break;

    case 'loading':
      showState('loading');
      loadingProduct.textContent = `Analyzing "${state.product}"...`;
      break;

    case 'success':
      showState('success');
      if (state.result) {
        renderResult(state.product || '', state.result);
      }
      break;

    case 'error':
      showState('error');
      errorMessage.textContent = state.error || 'Something went wrong';
      break;
  }
}

function renderResult(product: string, result: SentimentResult): void {
  resultProduct.textContent = product;

  // Score
  const percentage = Math.round(result.score * 100);
  scoreValue.textContent = `${percentage}%`;

  // Sentiment styling
  scoreCircle.className = `score-circle ${result.sentiment}`;
  sentimentLabel.className = `sentiment-label ${result.sentiment}`;
  sentimentLabel.textContent = result.sentiment;

  // Summary
  summary.textContent = result.summary;

  // Positives
  positivesList.innerHTML = result.positives
    .map((p) => `<li>${escapeHtml(p)}</li>`)
    .join('');

  // Negatives
  negativesList.innerHTML = result.negatives
    .map((n) => `<li>${escapeHtml(n)}</li>`)
    .join('');

  // Sample size
  sampleSize.textContent = `Based on ${result.sampleSize} Reddit comments`;
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
