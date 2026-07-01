# Original User Request

## 2026-07-02T00:23:45Z
Rebuild the Kaasipublic landing page (V2) with premium GSAP scroll animations, interactive glassmorphism components (including a live inline math parser), a competitor comparison table, and a live dummy dashboard, using Vanilla JS and Eleventy.

Working directory: b:\AntiGravity\kaasipublic
Integrity mode: demo

## Requirements

### R1. GSAP Scrollytelling Hero
Implement a high-performance scroll-driven hero section using GSAP and ScrollTrigger where the app mockup dynamically breaks apart into its core UI components on scroll.

### R2. Interactive Playground Bento Cards
Build glassmorphism-styled feature cards. Include a functioning inline math input (porting the recursive descent parser from kaasibeta) and interactive hover states (e.g., a glowing privacy padlock).

### R3. Competitor Comparison Table
Create a high-contrast comparison table highlighting Kaasi's power-user features (Offline-first, PWA, Inline Math, Double Entry) against typical ad-supported, cloud-locked apps.

### R4. Read-Only Dummy Dashboard
Embed a simplified, read-only HTML replica of the Kaasi Monthly View that users can interact with (switch tabs, hover charts) without leaving the landing page.

## Acceptance Criteria

### Technical Build
- [ ] `npx @11ty/eleventy` compiles the site without errors on the `v2-rebuild` branch.
- [ ] No front-end frameworks (React/Vue) are used; strictly Vanilla JS, GSAP, and Tailwind CSS standalone.

### Functional Interactivity
- [ ] The math engine bento card successfully parses and calculates compound expressions (e.g., `(100+50)*2`) directly on the page.
- [ ] GSAP ScrollTrigger animations trigger predictably on vertical scroll.

### Aesthetics & Brand
- [ ] The design adheres to Kaasi's dark theme (`#121212` backgrounds, `#18181B` cards, orange `#e67e26` accents).
- [ ] Interactive cards utilize Tailwind's `backdrop-blur` for glassmorphism effects over subtle radial gradients.
