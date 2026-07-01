## 2026-07-02T00:26:20Z
You are the V2 Landing Page Builder. Your working directory is b:\AntiGravity\kaasipublic\.agents\worker_v2\.
Your task is to implement the V2 landing page requirements on the v2-rebuild branch, adhering to Vanilla JS, GSAP, and Tailwind CSS standalone.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Inputs:
- Working directory of project: b:\AntiGravity\kaasipublic
- Strategy report: b:\AntiGravity\kaasipublic\.agents\explorer_setup\handoff.md
- Math tool source in kaasibeta: b:\AntiGravity\kaasibeta\js\math-tool.js

Task Details:
1. Create a `.eleventyignore` file containing `.agents/` at the root of `kaasipublic`.
2. Update `_includes/layout.njk` to import the GSAP and GSAP ScrollTrigger libraries from CDN (specifically version 3.12.5):
   `<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>`
   `<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>`
3. Implement R1: Hero Scrollytelling Section in `index.njk` and `script.js`. Replace the static mockup image block with an HTML mockup structure that splits into sidebar, top-nav, content cards (balance card, chart card, list card) when scrolled, using GSAP ScrollTrigger.
4. Implement R2: Bento Cards Upgrades in `index.njk`, `script.js`, and `style.css`.
   - Add the inline math parser to `script.js` (ported from `kaasibeta`'s `evaluateMathExpression`). Add an interactive math input text field in Bento Card 4 so users can type expressions like `(100+50)*2` or `(3500*4)+1200` and see the result dynamically calculated in a small label below.
   - Enhance Bento Card 2 (Privacy) lock icon with padlock glowing CSS hovers and pulse effects in `style.css`.
5. Implement R3: Competitor Comparison Table in `index.njk` right after features section. Highlight Kaasi's power features (Offline-first privacy, PWA, Inline Math, Double Entry) vs typical apps and spreadsheets.
6. Implement R4: Read-Only Dummy Dashboard Sandbox in `index.njk` and `script.js`. Replicate the Monthly View experience where users can switch tabs between "Income", "Expenses", and "Debts", updating the transactions list, summary metrics, and donut chart layout on hover/click.
7. Run `npx @11ty/eleventy` to verify compilation succeeds without errors and files are outputted to `_site/`.
8. Document your changes and compile results in b:\AntiGravity\kaasipublic\.agents\worker_v2\handoff.md.

Please notify the orchestrator when the implementation and compilation are complete.
