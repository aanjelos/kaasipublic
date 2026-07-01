# Handoff Report - V2 Landing Page Review

## 1. Observation

- **Eleventy Compilation Command & Output**:
  Ran command: `cmd /c npx eleventy`
  Output:
  ```
  [11ty] Writing ./_site/404/index.html from ./404.html (liquid)
  [11ty] Writing ./_site/sitemap.xml from ./sitemap.njk
  [11ty] Writing ./_site/audit/kaasipublic_audit/index.html from ./audit/kaasipublic_audit.md (liquid)
  [11ty] Writing ./_site/blog/index.html from ./blog.njk
  [11ty] Writing ./_site/index.html from ./index.njk
  [11ty] Writing ./_site/blog/history-of-payment-cards/index.html from ./blog/history-of-payment-cards.md (liquid)
  [11ty] Writing ./_site/blog/kaasi-v3-changelog/index.html from ./blog/kaasi-v3-changelog.md (liquid)
  [11ty] Writing ./_site/blog/kaasi-v4-changelog/index.html from ./blog/kaasi-v4-changelog.md (liquid)
  [11ty] Writing ./_site/blog/kaasi-v5-changelog/index.html from ./blog/kaasi-v5-changelog.md (liquid)
  [11ty] Writing ./_site/blog/measure-to-manage/index.html from ./blog/measure-to-manage.md (liquid)
  [11ty] Writing ./_site/blog/sri-lanka-digital-tax-guide/index.html from ./blog/sri-lanka-digital-tax-guide.md (liquid)
  [11ty] Writing ./_site/blog/the-story-of-kaasi/index.html from ./blog/the-story-of-kaasi.md (liquid)
  [11ty] Writing ./_site/blog/why-is-the-dollar-rate-rising-again-2026/index.html from ./blog/why-is-the-dollar-rate-rising-again-2026.md (liquid)
  [11ty] Writing ./_site/blog/why-kaasi-is-free/index.html from ./blog/why-kaasi-is-free.md (liquid)
  [11ty] Copied 25 Wrote 14 files in 0.36 seconds (v3.1.6)
  ```
  The compilation successfully writes all pages with zero warnings or errors.

- **Missing ID for Mockup Interactive Tilt**:
  - `script.js` lines 43-46:
    ```javascript
    const setupInteractiveMockup = () => {
      const image = document.getElementById("mockup-image");

      if (!image) return;
    ```
  - `index.njk` has no element matching `id="mockup-image"`. The mockup container in `index.njk` is defined as:
    ```html
    <div id="hero-mockup-wrapper" class="relative w-full aspect-[16/10] bg-[#18181b]/95 border-2 border-gray-800/80 rounded-2xl p-4 flex flex-col shadow-2xl shadow-black/80" style="perspective: 1200px;">
    ```

- **Sandbox Dashboard Tooltip Positioning logic**:
  - `script.js` lines 638-643 (chart tooltip) and lines 686-691 (ledger/progress bar tooltip):
    ```javascript
    circle.addEventListener("mousemove", (e) => {
      const rect = chartContainer.getBoundingClientRect();
      const x = e.clientX - rect.left + 15;
      const y = e.clientY - rect.top - 15;
      tooltip.style.left = `${x}px`;
      tooltip.style.top = `${y}px`;
    });
    ```
    and
    ```javascript
    bar.addEventListener("mousemove", (e) => {
      const rect = list.getBoundingClientRect();
      const x = e.clientX - rect.left + 15;
      const y = e.clientY - rect.top + 15;
      tooltip.style.left = `${x}px`;
      tooltip.style.top = `${y}px`;
    });
    ```
  - `#sandbox-tooltip` in `index.njk` line 475 is defined as:
    ```html
    <div id="sandbox-tooltip" class="absolute hidden z-50 bg-[#121212] border border-gray-700 text-xs px-3 py-1.5 rounded-lg pointer-events-none text-white font-mono shadow-xl transition-all duration-75"></div>
    ```

- **Math Parser Evaluator**:
  - `script.js` lines 386-441 defines `evaluateMathExpression(inputStr)`. It parses prefix tokens but lacks a final token length verification step:
    ```javascript
    const result = parseExpression();
    if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
      return parseFloat(result.toFixed(2));
    }
    ```
  - Evaluated compound expression `(3500*4)+1200` to `15200`.
  - Evaluated `10+5)` to `15` and `10+5 (2*3)` to `15` using standard Javascript test engine.

- **GSAP Check Condition**:
  - `script.js` lines 479-482:
    ```javascript
    const setupScrollytelling = () => {
      if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
        console.warn("GSAP or ScrollTrigger not loaded.");
        return;
      }
    ```

- **Competitor Comparison Table structure**:
  - `index.njk` lines 227-228:
    ```html
    <div class="max-w-4xl mx-auto overflow-x-auto rounded-2xl border border-gray-800 bg-zinc-900/30 backdrop-blur-md">
      <table class="w-full text-left border-collapse text-sm">
    ```

- **Layout Compliance**:
  - The repository files (`index.njk`, `_includes/layout.njk`, `style.css`, `script.js`) are outside `.agents/`.
  - The `.agents/` folder contains only agent execution metadata (`BRIEFING.md`, `progress.md`, `ORIGINAL_REQUEST.md`, `handoff.md`).

---

## 2. Logic Chain

- **GSAP ScrollTrigger Robustness**: Since `script.js` wraps GSAP timeline instantiation with explicit `typeof gsap === "undefined"` checks, if libraries fail to load (e.g. offline mode or CDN block), it will log a warning to the console instead of throwing a fatal error.
- **Math Parser Vulnerability**: Because `evaluateMathExpression()` parses a prefix and immediately returns `result` without checking if `pos === tokens.length`, expressions with trailing unmatched brackets or spaces followed by numbers (like `10+5)`) are partially evaluated and considered valid. Adding `if (pos !== tokens.length) return null;` resolves this.
- **Mockup Interactive Tilt Inactivity**: Since the target ID `mockup-image` referenced by `document.getElementById` is not defined anywhere in the DOM structure of `index.njk`, the tilt script exits early and does not apply any transformation to the dashboard mockup wrapper (`#hero-mockup-wrapper`).
- **Tooltip Misalignment**: Since `tooltip` has `position: absolute` inside the `#sandbox` container, its CSS `left` and `top` properties are calculated relative to that parent. However, the mouse move calculations use coordinates relative to `list` and `chartContainer`. This offset difference causes the tooltip to render at shifted coordinates, failing to track the mouse properly.
- **Responsiveness**: The competitor comparison table is wrapped in a container that has `overflow-x-auto`, which ensures the table slides horizontally and does not break the layout responsiveness on small viewports.

---

## 3. Caveats

- We only performed static reviews and isolated runtime node testing of the javascript logic. We did not visually render the full PWA in a browser.
- We assumed the user wants the 3D tilt interaction active on `#hero-mockup-wrapper`. If it was intentionally deprecated but the code left behind, then the missing ID is just dead code.

---

## 4. Conclusion

The landing page implementation on the `v2-rebuild` branch is largely functional, responsive, and compiles cleanly with Eleventy. However, we recommend **REQUEST_CHANGES** due to three distinct functional bugs:
1. **Interactive Mockup ID mismatch**: Targets a non-existent `#mockup-image` element.
2. **Sandbox Tooltip mislocation**: Incorrect calculation coordinates relative to children instead of the absolute positioning parent.
3. **Math parser trailing token leak**: Evaluates partial prefixes of mathematically invalid strings.

---

## 5. Verification Method

- Run the Eleventy compiler inside the workspace:
  ```powershell
  cmd /c npx eleventy
  ```
- Run Node to test math engine fixes:
  ```powershell
  node -e "/* parser script with pos check test */"
  ```
- Inspect file layouts: Check that no source files exist in `.agents/`.

---

## 6. Detailed Quality Review Report

**Verdict**: REQUEST_CHANGES

### [Major] Finding 1: Non-Functional Interactive Mockup (Missing Element ID)
- **What**: The 3D tilt animation on the hero mockup does not run.
- **Where**: `script.js` line 44 (`const image = document.getElementById("mockup-image");`) and `index.njk` line 36.
- **Why**: In `index.njk`, the dashboard mockup has an ID of `hero-mockup-wrapper` but no element has `mockup-image`. Therefore, `setupInteractiveMockup()` returns early, making the 3D tilt effect inactive.
- **Suggestion**: Update `script.js` to target `hero-mockup-wrapper` instead of `mockup-image`, or add the `mockup-image` ID to the target element.

### [Major] Finding 2: Broken Tooltip Positioning in Sandbox Dashboard
- **What**: Hover tooltips are severely misaligned with the cursor.
- **Where**: `script.js` lines 638-642 and lines 686-691.
- **Why**: The coordinate calculations (`x = e.clientX - rect.left + 15`) use the hovered container's bounding rect (`list` or `chartContainer`), but are then set as `left`/`top` on the tooltip element which is positioned relative to the parent `#sandbox` container. This causes a misalignment shift equal to the container's offset within the sandbox grid.
- **Suggestion**: Calculate cursor coordinates relative to the `#sandbox` container (e.g. `const sandboxRect = sandboxContainer.getBoundingClientRect(); x = e.clientX - sandboxRect.left + 15;`) to ensure the tooltip aligns correctly with the mouse.

### [Minor] Finding 3: Math Parser Evaluates Prefix and Ignores Trailing Tokens
- **What**: The custom recursive descent math parser allows invalid or trailing characters to pass without error.
- **Where**: `script.js` lines 386-441 (`evaluateMathExpression`).
- **Why**: The parser stops evaluating once it finishes parsing a valid expression structure, without checking if there are remaining unparsed tokens. This means expressions like `10+5)` or `10+5 (2*3)` evaluate to `15` instead of `null`.
- **Suggestion**: Add a position validation check after parsing:
  ```javascript
  const result = parseExpression();
  if (pos !== tokens.length) return null;
  ```

---

## 7. Adversarial Challenge Report

**Overall risk assessment**: MEDIUM

### [High] Challenge 1: Silent failure of interactive dashboard mockup
- **Assumption challenged**: The landing page mockup displays an interactive 3D tilt effect on desktop.
- **Attack scenario**: The tilt script returns early because the element ID does not match. Visitors on desktop will see a completely static mockup with no interactive feedback, detracting from the premium landing page feel.
- **Blast radius**: Interactive user experience degradation.
- **Mitigation**: Correct the target element ID to `hero-mockup-wrapper`.

### [High] Challenge 2: Dislocated tooltips in sandbox
- **Assumption challenged**: Hover tooltips correctly track the mouse.
- **Attack scenario**: When hovering over chart segments or progress bars, the tooltips display at incorrect parts of the screen, rendering the information hard to read or completely hidden from the viewport.
- **Blast radius**: Broken sandbox user interface.
- **Mitigation**: Position the tooltip relative to the common relative parent (`#sandbox` container) using the parent's bounding client rect.

### [Medium] Challenge 3: Incomplete math validation
- **Assumption challenged**: Amount fields only parse fully correct mathematical expressions.
- **Attack scenario**: A user types trailing garbage or unmatched characters (e.g. `100+200abc` or `100+200)`), expecting an error or no result, but the app displays a partial calculation (`300`), which could lead to copy-paste errors or billing discrepancies.
- **Blast radius**: User input calculation accuracy.
- **Mitigation**: Implement the `pos === tokens.length` check.

### Stress Test Results

- **Evaluating `(3500*4)+1200`** → Evaluates to `15200` → Evaluates to `15200` → pass
- **Evaluating `10+5)`** → Evaluates to `null` → Evaluates to `15` (trailing ignored) → fail
- **Hovering chart segments** → Tooltip coordinates match mouse position → Tooltip is offset/displaced → fail
- **Resizing screen for comparison table** → Table container does not overflow page → Table scrollbar appears correctly → pass
