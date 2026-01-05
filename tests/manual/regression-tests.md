# Regression Tests

Comprehensive test suite to run before releases.

**Time to complete**: ~30 minutes

---

## 1. Installation & Setup

### RT-001: Fresh Installation
| Step | Action | Expected | Result |
|------|--------|----------|--------|
| 1 | Remove extension from Chrome | Extension removed | |
| 2 | Load unpacked from `extension/` folder | Extension loads | |
| 3 | Check for errors in chrome://extensions | No errors | |
| 4 | Verify icon in toolbar | Icon visible | |

### RT-002: Extension Update
| Step | Action | Expected | Result |
|------|--------|----------|--------|
| 1 | Make code change | - | |
| 2 | Run `npm run build --workspace=extension` | Build succeeds | |
| 3 | Click refresh in chrome://extensions | Extension reloads | |
| 4 | Perform basic analysis | Works correctly | |

---

## 2. Context Menu

### RT-003: Text Selection
| Step | Action | Expected | Result |
|------|--------|----------|--------|
| 1 | Select single word | Context menu shows word | |
| 2 | Select multiple words | Context menu shows phrase | |
| 3 | Select paragraph | Context menu shows truncated | |
| 4 | No selection + right-click | No analyze option | |

### RT-004: Different Sites
| Site | Select Text | Right-click | Analyze Works | Result |
|------|-------------|-------------|---------------|--------|
| amazon.com | Product title | Yes | Yes/No | |
| bestbuy.com | Product title | Yes | Yes/No | |
| reddit.com | Any text | Yes | Yes/No | |
| google.com | Search text | Yes | Yes/No | |
| wikipedia.org | Any text | Yes | Yes/No | |

---

## 3. Analysis Flow

### RT-005: Successful Analysis
| Step | Action | Expected | Result |
|------|--------|----------|--------|
| 1 | Select "Sony WH-1000XM5" | Text highlighted | |
| 2 | Right-click → Analyze | Menu appears | |
| 3 | Click extension icon | Popup opens | |
| 4 | Observe loading state | Spinner + product name | |
| 5 | Wait for results | Results in <10s | |
| 6 | Check score | 0-100% displayed | |
| 7 | Check sentiment | positive/mixed/negative | |
| 8 | Check summary | 1-2 sentences | |
| 9 | Check positives | At least 1 item | |
| 10 | Check negatives | At least 1 item | |
| 11 | Check sample size | Number shown | |

### RT-006: No Results
| Step | Action | Expected | Result |
|------|--------|----------|--------|
| 1 | Select "ZZZFAKEPRODUCT123" | - | |
| 2 | Analyze | - | |
| 3 | Open popup | Error state | |
| 4 | Check message | "No discussions found" | |
| 5 | Click retry | Loading state | |

### RT-007: Network Error
| Step | Action | Expected | Result |
|------|--------|----------|--------|
| 1 | Disable internet | - | |
| 2 | Analyze a product | - | |
| 3 | Open popup | Error state | |
| 4 | Re-enable internet | - | |
| 5 | Click retry | Analysis works | |

---

## 4. Popup UI

### RT-008: Idle State
| Check | Expected | Result |
|-------|----------|--------|
| Instructions visible | Yes | |
| Input field present | Yes | |
| Analyze button present | Yes | |
| Input placeholder text | "Or enter product name..." | |

### RT-009: Loading State
| Check | Expected | Result |
|-------|----------|--------|
| Spinner visible | Yes | |
| Product name shown | "Analyzing [product]..." | |
| Other states hidden | Yes | |

### RT-010: Success State
| Check | Expected | Result |
|-------|----------|--------|
| Product name displayed | Yes | |
| Score circle visible | Yes | |
| Score percentage shown | 0-100% | |
| Correct color (positive) | Green | |
| Correct color (mixed) | Yellow | |
| Correct color (negative) | Red | |
| Sentiment label matches | Yes | |
| Summary readable | Yes | |
| Positives list | 1-4 items | |
| Negatives list | 1-4 items | |
| Sample size shown | Yes | |

### RT-011: Error State
| Check | Expected | Result |
|-------|----------|--------|
| Error icon visible | Yes | |
| Error message shown | Yes | |
| Retry button present | Yes | |
| Retry button works | Yes | |

---

## 5. Manual Input

### RT-012: Input Field
| Action | Expected | Result |
|--------|----------|--------|
| Type product name | Text appears | |
| Click Analyze | Analysis starts | |
| Press Enter | Analysis starts | |
| Empty input + Analyze | Error or no action | |
| Whitespace only + Analyze | Error or no action | |

---

## 6. Keyboard Shortcut

### RT-013: Ctrl+Shift+R
| Step | Action | Expected | Result |
|------|--------|----------|--------|
| 1 | Select text | - | |
| 2 | Press Ctrl+Shift+R | Analysis starts | |
| 3 | Open popup | Results shown | |

---

## 7. State Management

### RT-014: Persistence
| Step | Action | Expected | Result |
|------|--------|----------|--------|
| 1 | Complete analysis | Results shown | |
| 2 | Close popup | - | |
| 3 | Reopen popup | Same results shown | |
| 4 | Navigate to new page | - | |
| 5 | Reopen popup | Same results shown | |

### RT-015: State Transitions
| From | To | Trigger | Result |
|------|-----|---------|--------|
| Idle | Loading | Start analysis | |
| Loading | Success | Analysis complete | |
| Loading | Error | Analysis failed | |
| Error | Loading | Retry clicked | |
| Success | Loading | New analysis | |

---

## 8. Edge Cases

### RT-016: Special Characters
| Input | Expected | Result |
|-------|----------|--------|
| "Sony α7 IV" | Handles Greek letter | |
| "iPhone 15 Pro (128GB)" | Handles parentheses | |
| "MacBook Pro 14\"" | Handles quotes | |
| "Product - Model" | Handles dash | |
| "日本語製品" | Handles non-Latin | |

### RT-017: Long Inputs
| Input | Expected | Result |
|-------|----------|--------|
| 200+ character selection | Truncated or handled | |
| Very long product name | UI doesn't break | |

### RT-018: Rapid Actions
| Action | Expected | Result |
|--------|----------|--------|
| Analyze → Analyze → Analyze quickly | Last one wins | |
| Click retry multiple times | No duplicate requests | |
| Open/close popup rapidly | No UI glitches | |

---

## 9. Worker API

### RT-019: Health Endpoint
| Check | Expected | Result |
|-------|----------|--------|
| GET /health | {"status":"ok"} | |
| Status code | 200 | |

### RT-020: Analyze Endpoint
| Check | Expected | Result |
|-------|----------|--------|
| Valid request | Sentiment response | |
| Missing product | 400 error | |
| Empty comments | 400 error | |
| CORS headers | Present | |

---

## Sign-off

| Section | Pass/Fail | Notes |
|---------|-----------|-------|
| 1. Installation | | |
| 2. Context Menu | | |
| 3. Analysis Flow | | |
| 4. Popup UI | | |
| 5. Manual Input | | |
| 6. Keyboard Shortcut | | |
| 7. State Management | | |
| 8. Edge Cases | | |
| 9. Worker API | | |

**Overall Result**: ____________

**Version Tested**: ____________

**Date**: ____________

**Tester**: ____________

**Notes**:
