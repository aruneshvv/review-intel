// Content script for product detection and selection handling

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_SELECTION') {
    const selection = window.getSelection()?.toString().trim() || '';
    sendResponse({ selection });
    return true;
  }

  return false;
});

// Optional: Add keyboard shortcut support
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + Shift + R to analyze selection
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'R') {
    const selection = window.getSelection()?.toString().trim();
    if (selection) {
      chrome.runtime.sendMessage({
        type: 'ANALYZE_SELECTION',
        text: selection,
      });
    }
  }
});
