# Manual Test Cases

## Test Environment Setup

### Prerequisites
- Chrome browser (latest version)
- Review Intel extension loaded
- Worker deployed and accessible
- Internet connection

### Test Data
Use these products for consistent testing:
- **Popular product**: "Sony WH-1000XM5"
- **Niche product**: "Focusrite Scarlett 2i2"
- **Non-existent product**: "XYZ123FakeProduct999"

---

## TC-001: Extension Installation

**Objective**: Verify extension loads correctly in Chrome

**Steps**:
1. Open Chrome and navigate to `chrome://extensions`
2. Enable Developer mode
3. Click "Load unpacked"
4. Select the `extension` folder

**Expected Results**:
- [ ] Extension appears in the extensions list
- [ ] Extension icon appears in the toolbar
- [ ] No errors shown on the extension card
- [ ] Service worker status shows as "Active"

**Severity**: Critical

---

## TC-002: Context Menu Appears

**Objective**: Verify context menu item appears on text selection

**Steps**:
1. Open any webpage (e.g., https://www.amazon.com)
2. Select any text (e.g., "Sony WH-1000XM5")
3. Right-click on the selection

**Expected Results**:
- [ ] Context menu appears
- [ ] "Analyze 'Sony WH-1000XM5' with Review Intel" option is visible
- [ ] Menu item shows the selected text in quotes

**Severity**: Critical

---

## TC-003: Basic Analysis - Popular Product

**Objective**: Verify end-to-end analysis works for a popular product

**Steps**:
1. Open any webpage
2. Select text: "Sony WH-1000XM5"
3. Right-click → "Analyze with Review Intel"
4. Click the extension icon in toolbar

**Expected Results**:
- [ ] Loading spinner appears with product name
- [ ] Results display within 10 seconds
- [ ] Score shows as percentage (0-100%)
- [ ] Sentiment label shows (positive/mixed/negative)
- [ ] Summary text is displayed
- [ ] At least 1 positive point listed
- [ ] At least 1 negative point listed
- [ ] Sample size shows number of comments

**Severity**: Critical

---

## TC-004: Analysis - No Results Found

**Objective**: Verify proper error handling when no Reddit discussions exist

**Steps**:
1. Open any webpage
2. Select text: "XYZ123FakeProduct999"
3. Right-click → "Analyze with Review Intel"
4. Click the extension icon

**Expected Results**:
- [ ] Loading spinner appears
- [ ] Error state displays
- [ ] Error message: "No Reddit discussions found for this product"
- [ ] Retry button is visible

**Severity**: High

---

## TC-005: Manual Input Analysis

**Objective**: Verify analysis works via manual input in popup

**Steps**:
1. Click the extension icon (with no prior analysis)
2. Enter "MacBook Pro M3" in the input field
3. Click "Analyze" button

**Expected Results**:
- [ ] Input field accepts text
- [ ] Analyze button is clickable
- [ ] Loading state appears
- [ ] Results display with sentiment data

**Severity**: High

---

## TC-006: Manual Input - Enter Key

**Objective**: Verify Enter key triggers analysis

**Steps**:
1. Click the extension icon
2. Enter "iPhone 15 Pro" in the input field
3. Press Enter key

**Expected Results**:
- [ ] Analysis starts on Enter keypress
- [ ] Loading state appears
- [ ] Results display correctly

**Severity**: Medium

---

## TC-007: Keyboard Shortcut

**Objective**: Verify Ctrl+Shift+R keyboard shortcut works

**Steps**:
1. Open any webpage
2. Select text: "Nintendo Switch"
3. Press Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
4. Click the extension icon

**Expected Results**:
- [ ] Analysis starts without right-clicking
- [ ] Results display in popup

**Severity**: Medium

---

## TC-008: Retry After Error

**Objective**: Verify retry button works after an error

**Steps**:
1. Trigger an error (use fake product name)
2. Wait for error state to display
3. Click "Try Again" button

**Expected Results**:
- [ ] Loading state appears again
- [ ] New analysis attempt is made
- [ ] Same error or results display

**Severity**: Medium

---

## TC-009: State Persistence

**Objective**: Verify results persist when reopening popup

**Steps**:
1. Perform a successful analysis
2. Close the popup (click elsewhere)
3. Click extension icon again

**Expected Results**:
- [ ] Previous results still display
- [ ] No loading state (cached results shown)
- [ ] All data intact (score, summary, lists)

**Severity**: Medium

---

## TC-010: Long Product Name

**Objective**: Verify handling of long product names

**Steps**:
1. Select long text: "Apple MacBook Pro 16-inch with M3 Max chip 48GB RAM 1TB SSD Space Black"
2. Right-click → Analyze with Review Intel
3. View results in popup

**Expected Results**:
- [ ] Context menu shows truncated product name or full name
- [ ] Analysis completes successfully
- [ ] Product name displays properly in popup (may be truncated)

**Severity**: Low

---

## TC-011: Special Characters in Product Name

**Objective**: Verify handling of special characters

**Steps**:
1. Select text with special chars: "Sony α7 IV"
2. Right-click → Analyze with Review Intel

**Expected Results**:
- [ ] Analysis attempts to run
- [ ] Either finds results or shows "no discussions" error
- [ ] No JavaScript errors in console

**Severity**: Low

---

## TC-012: Multiple Rapid Analyses

**Objective**: Verify handling of rapid successive analyses

**Steps**:
1. Select "Sony WH-1000XM5" → Right-click → Analyze
2. Immediately select "iPhone 15" → Right-click → Analyze
3. Immediately select "MacBook Pro" → Right-click → Analyze
4. Open popup

**Expected Results**:
- [ ] Only the last analysis result shows
- [ ] No UI glitches or errors
- [ ] Loading state shows for latest product

**Severity**: Medium

---

## TC-013: Popup UI - Score Circle Colors

**Objective**: Verify score circle displays correct colors

**Steps**:
1. Analyze a product that returns positive sentiment (>70%)
2. Note the score circle color
3. Analyze a product with mixed sentiment (40-69%)
4. Note the color
5. Analyze a product with negative sentiment (<40%)
6. Note the color

**Expected Results**:
- [ ] Positive: Green circle
- [ ] Mixed: Yellow circle
- [ ] Negative: Red circle
- [ ] Sentiment label matches color

**Severity**: Medium

---

## TC-014: Empty Selection

**Objective**: Verify handling when no text is selected

**Steps**:
1. Click on a webpage without selecting any text
2. Right-click

**Expected Results**:
- [ ] "Analyze with Review Intel" option does NOT appear
- [ ] Or if it appears, it's disabled/grayed out

**Severity**: Low

---

## TC-015: Whitespace-Only Selection

**Objective**: Verify handling of whitespace-only selection

**Steps**:
1. Select only spaces or tabs on a webpage
2. Right-click → Analyze (if option appears)

**Expected Results**:
- [ ] Either context menu doesn't appear
- [ ] Or error message: "No product name provided"

**Severity**: Low

---

## TC-016: Worker Health Check

**Objective**: Verify worker is responding

**Steps**:
1. Open browser
2. Navigate to: `https://review-intel-api.epitrove.workers.dev/health`

**Expected Results**:
- [ ] Response: `{"status":"ok"}`
- [ ] HTTP status: 200

**Severity**: Critical

---

## TC-017: Network Error Handling

**Objective**: Verify behavior when network is unavailable

**Steps**:
1. Disconnect from internet (disable WiFi/Ethernet)
2. Select a product name
3. Right-click → Analyze with Review Intel
4. Check popup

**Expected Results**:
- [ ] Error state displays
- [ ] Meaningful error message shown
- [ ] Retry button available

**Severity**: High

---

## TC-018: Worker Timeout

**Objective**: Verify behavior when worker takes too long

**Steps**:
1. This may require simulating slow network
2. Analyze a product
3. Wait for response

**Expected Results**:
- [ ] Loading state shows during wait
- [ ] Either results display or timeout error after ~30s
- [ ] No infinite loading state

**Severity**: Medium

---

## TC-019: Cross-Site Analysis

**Objective**: Verify extension works across different websites

**Test Sites**:
- Amazon.com
- BestBuy.com
- Wikipedia.org
- Reddit.com
- Google.com (search results page)

**Steps**:
1. Visit each site
2. Select a product name
3. Analyze with Review Intel

**Expected Results**:
- [ ] Context menu appears on all sites
- [ ] Analysis works regardless of source site
- [ ] No CORS or permission errors

**Severity**: High

---

## TC-020: Popup Responsive Design

**Objective**: Verify popup displays correctly at different content lengths

**Steps**:
1. Analyze product with many positives/negatives
2. Analyze product with few points
3. Analyze product with very long summary

**Expected Results**:
- [ ] Popup scrolls if content exceeds height
- [ ] No text overflow or cutoff
- [ ] All content is readable

**Severity**: Low

---

## Test Execution Log

| TC ID | Date | Tester | Result | Notes |
|-------|------|--------|--------|-------|
| TC-001 | | | Pass/Fail | |
| TC-002 | | | Pass/Fail | |
| TC-003 | | | Pass/Fail | |
| TC-004 | | | Pass/Fail | |
| TC-005 | | | Pass/Fail | |
| TC-006 | | | Pass/Fail | |
| TC-007 | | | Pass/Fail | |
| TC-008 | | | Pass/Fail | |
| TC-009 | | | Pass/Fail | |
| TC-010 | | | Pass/Fail | |
| TC-011 | | | Pass/Fail | |
| TC-012 | | | Pass/Fail | |
| TC-013 | | | Pass/Fail | |
| TC-014 | | | Pass/Fail | |
| TC-015 | | | Pass/Fail | |
| TC-016 | | | Pass/Fail | |
| TC-017 | | | Pass/Fail | |
| TC-018 | | | Pass/Fail | |
| TC-019 | | | Pass/Fail | |
| TC-020 | | | Pass/Fail | |
