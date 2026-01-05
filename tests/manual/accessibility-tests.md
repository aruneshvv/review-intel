# Accessibility Tests

Verify the extension is usable by people with different abilities.

---

## Keyboard Navigation

### AT-001: Popup Keyboard Access
| Step | Action | Expected | Result |
|------|--------|----------|--------|
| 1 | Click extension icon | Popup opens | |
| 2 | Press Tab | Focus moves to input | |
| 3 | Press Tab | Focus moves to Analyze button | |
| 4 | Press Enter on button | Analysis starts | |
| 5 | Press Escape | Popup closes | |

### AT-002: Focus Visibility
| Element | Focus Ring Visible | Result |
|---------|-------------------|--------|
| Input field | Yes | |
| Analyze button | Yes | |
| Retry button | Yes | |

---

## Screen Reader Compatibility

### AT-003: Popup Labels
| Element | Has Label/ARIA | Result |
|---------|---------------|--------|
| Input field | placeholder or label | |
| Analyze button | Button text | |
| Score value | Readable number | |
| Sentiment label | Text content | |
| Positives list | List semantics | |
| Negatives list | List semantics | |

### AT-004: State Announcements
| State Change | Should Announce | Result |
|--------------|-----------------|--------|
| Loading starts | "Analyzing [product]" | |
| Results ready | Score and sentiment | |
| Error occurs | Error message | |

---

## Color & Contrast

### AT-005: Text Contrast
| Element | Background | Text Color | Ratio ≥ 4.5:1 | Result |
|---------|------------|------------|---------------|--------|
| Body text | #1a1a2e | #eee | Yes | |
| Hint text | #1a1a2e | #888 | Check | |
| Input text | #252540 | #fff | Yes | |
| Button text | #4f46e5 | #fff | Yes | |

### AT-006: Color Independence
| Information | Color Only | Alternative | Result |
|-------------|------------|-------------|--------|
| Positive sentiment | Green | "positive" label | |
| Mixed sentiment | Yellow | "mixed" label | |
| Negative sentiment | Red | "negative" label | |
| Positives list | Green + | "+" prefix | |
| Negatives list | Red - | "-" prefix | |

---

## Text Scaling

### AT-007: Browser Zoom
| Zoom Level | Popup Readable | No Overflow | Result |
|------------|---------------|-------------|--------|
| 100% | Yes | Yes | |
| 125% | Yes | Yes | |
| 150% | Yes | Yes | |
| 200% | Yes | Check | |

---

## Motion & Animation

### AT-008: Reduced Motion
| Animation | Respects prefers-reduced-motion | Result |
|-----------|--------------------------------|--------|
| Loading spinner | Should reduce/remove | |

**To test**: Set `prefers-reduced-motion: reduce` in OS settings

---

## Error Handling

### AT-009: Error Messages
| Check | Expected | Result |
|-------|----------|--------|
| Error message is text (not just icon) | Yes | |
| Error is descriptive | Yes | |
| Recovery action is clear | "Try Again" button | |

---

## Recommendations for Improvement

### High Priority
- [ ] Add `aria-live` regions for state changes
- [ ] Add `role="status"` for loading indicator
- [ ] Add `role="alert"` for error messages

### Medium Priority
- [ ] Add skip link in popup
- [ ] Improve focus trap in popup
- [ ] Add high contrast mode support

### Low Priority
- [ ] Add keyboard shortcut hint in UI
- [ ] Support browser dark/light mode

---

## Test Results Summary

| Category | Pass | Fail | N/A |
|----------|------|------|-----|
| Keyboard Navigation | | | |
| Screen Reader | | | |
| Color & Contrast | | | |
| Text Scaling | | | |
| Motion | | | |
| Error Handling | | | |

**Date**: ____________

**Tester**: ____________

**Tools Used**:
- [ ] Keyboard only
- [ ] Screen reader (specify: _________)
- [ ] Color contrast checker
- [ ] Browser zoom
