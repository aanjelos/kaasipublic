# Project: Kaasipublic V2 Rebuild

## Architecture
- SSG built with Eleventy compiling `index.njk` to `_site/index.html`.
- Libraries used: GSAP + ScrollTrigger, Three.js, Tailwind CSS (via CDN).
- Code Layout:
  - `index.njk` contains the page structure.
  - `_includes/layout.njk` defines the base HTML wrap, CSS, JS scripts import.
  - `script.js` holds the client-side logic.
  - `style.css` contains custom visual styling.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Setup & Build Verification | Build project locally, run Eleventy to verify baseline compilation. | None | DONE |
| 2 | R1: GSAP Scrollytelling Hero | Animate app mockup components splitting on scroll. | M1 | DONE |
| 3 | R2: Bento Card Math Parser & padlocks | Implement math engine input + interactive hover padlock. | M1 | DONE |
| 4 | R3: Competitor Comparison Table | Build high-contrast comparison table. | M1 | DONE |
| 5 | R4: Read-Only Dummy Dashboard | Embed replica of Monthly View with tabs. | M1 | DONE |
| 6 | E2E Verification & Audit | Audit integrity, check build on v2-rebuild. | M2, M3, M4, M5 | DONE |

## Interface Contracts
- Math Parser: `evaluateMathExpression(inputStr)` -> returns calculated number or `null`.
- Scroll Triggering: GSAP ScrollTrigger registered, target animations bound to scroll bounds.
