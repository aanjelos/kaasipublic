# V2 Landing Page Strategy & Explorer Handoff Report

## 1. Observation
This section records the exact files, build tools, configurations, and scripts analyzed during the exploration phase.

### Build Verification & Configs
- **Command Run**: `cmd /c npx @11ty/eleventy` in `b:\AntiGravity\kaasipublic`.
- **Output**: 
  ```text
  [11ty] Writing ./_site/index.html from ./index.njk
  [11ty] Copied 25 Wrote 24 files in 0.66 seconds (v3.1.6)
  ```
- **Configuration (`.eleventy.js` lines 1-24)**:
  ```javascript
  module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("img");
    eleventyConfig.addPassthroughCopy("blog/img");
    eleventyConfig.addPassthroughCopy("style.css");
    eleventyConfig.addPassthroughCopy("script.js");
    eleventyConfig.addPassthroughCopy("CNAME");
    eleventyConfig.addPassthroughCopy("robots.txt");
    ...
  ```
- **Package Manifest (`package.json` lines 20-22)**:
  ```json
  "devDependencies": {
    "@11ty/eleventy": "^3.1.6"
  }
  ```

### Math Engine Code (`kaasibeta/js/math-tool.js` lines 5-60)
- **Function definition**:
  ```javascript
  function evaluateMathExpression(inputStr) {
    let expr = inputStr.trim();
    expr = expr.replace(/,/g, '');
    if (expr.endsWith("=")) {
      expr = expr.slice(0, -1);
    }
    expr = expr.replace(/×/g, "*").replace(/÷/g, "/");

    if (!/^[\d\.\+\-\*\/\(\)\s]+$/.test(expr)) return null;
    if (!/[\+\-\*\/]/.test(expr)) return null;
    ...
  ```

### Current Hero Layout (`kaasipublic/index.njk` lines 34-47)
- **Mockup Container**:
  ```html
  <div class="mt-20 animate-fade-in-up" style="--delay: 0.3s">
    <div id="mockup-container" class="relative mx-auto w-full max-w-4xl">
      ...
      <img
        id="mockup-image"
        src="img/dash.png"
        ...
  ```

---

## 2. Logic Chain
The steps from observation to the V2 strategy are detailed below:

1. **Build Status**: The site compiles correctly under Eleventy `v3.1.6`. However, because `.agents` folders are not excluded, Eleventy compiles agent briefings and request files to the output directory `_site/.agents`. To remedy this, a `.eleventyignore` file containing `.agents/` should be introduced.
2. **GSAP Hero (R1)**: A static dashboard mockup image (`img/dash.png`) cannot be cleanly exploded into individual components (sidebar, top-nav, content cards). Therefore, the mockup container must be replaced by a live CSS/HTML grid-styled dashboard mockup. We can then target specific DOM elements with GSAP and ScrollTrigger.
3. **Bento Card Upgrades (R2)**:
   - *Math Input*: The `evaluateMathExpression` function in `kaasibeta` is written in vanilla JavaScript and is fully self-contained. It can be copied directly to the landing page script and bound to an interactive demo text field in Bento Card 4.
   - *Glowing Padlock*: The FontAwesome lock icon in Bento Card 2 can be enhanced with an absolute positioned `.padlock-glow` element styled with a radial gradient. By adding CSS hover rules, this element scales up and pulses when the user hovers over the parent card.
4. **Competitor Comparison Table (R3)**: Adding a dedicated comparison table immediately after the features section visually highlights Kaasi's key pillars: Offline-first privacy, PWA flexibility, and the custom Inline Math engine, while contrasting them against traditional cloud apps and general-purpose spreadsheets.
5. **Read-Only Sandbox Dashboard (R4)**: To showcase the core app's Monthly View experience, we can construct an interactive replica in a sandbox section. Clicking tabs like "Income", "Expenses", and "Debts" will dynamically swap visual HTML elements, update SVG charts (e.g., a circle-dasharray donut chart), and display custom tooltip details on segment hovers.

---

## 3. Caveats
- **GSAP CDN Dependency**: The scrollytelling feature relies on external GSAP and ScrollTrigger libraries. If they fail to load, the mockup dashboard should fall back gracefully to a standard stacked mockup view.
- **Tailwind Recompiling**: If styling custom layout classes is done inside Nunjucks templates, Tailwind's CDN compilation (currently loaded in `layout.njk` line 51) will resolve it automatically during runtime. However, if using Tailwind CLI, care should be taken to ensure classes are scanned correctly.

---

## 4. Conclusion
The proposed V2 architecture is fully feasible and can be implemented directly within `index.njk`, `script.js`, and `style.css`. Below is the complete implementation design and technical strategy.

### Implementation Blueprint

#### Step 1: Add Libraries in `_includes/layout.njk`
Include the GSAP and ScrollTrigger CDN links right before `/script.js`:
```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
<script src="/script.js"></script>
```

#### Step 2: R1 - Scrollytelling Hero (`index.njk` & `script.js`)
Replace the static hero image with an HTML mockup structure:
```html
<!-- index.njk Hero Area -->
<div id="hero-scroll-container" class="relative h-[200vh] w-full">
  <div class="sticky top-0 h-screen flex flex-col justify-center items-center overflow-hidden">
    <!-- Intro Header Fades out on scroll -->
    <div id="hero-header-text" class="text-center mb-10 max-w-4xl px-6">
      <h1 class="text-5xl md:text-7xl font-bold text-white mb-6">The Finance Engine for Serious Sri Lankans</h1>
      <p class="text-lg text-gray-400">Offline-first, with no ads and no compromises.</p>
    </div>
    
    <!-- Exploding Dashboard Mockup -->
    <div id="hero-mockup-wrapper" class="relative w-full max-w-4xl aspect-[16/10] bg-[#18181b] border border-gray-800 rounded-xl p-4 flex flex-col shadow-2xl" style="perspective: 1200px;">
      <!-- Title Bar -->
      <div id="mock-title-bar" class="flex gap-1.5 pb-3 border-b border-gray-900 mb-2">
        <span class="w-3 h-3 rounded-full bg-red-500/80"></span>
        <span class="w-3 h-3 rounded-full bg-yellow-500/80"></span>
        <span class="w-3 h-3 rounded-full bg-green-500/80"></span>
      </div>
      
      <div class="flex flex-1 gap-4 overflow-hidden relative">
        <!-- Sidebar -->
        <div id="mock-sidebar" class="w-1/5 bg-[#121212] border border-gray-800/80 rounded-lg p-3 flex flex-col gap-3">
          <div class="w-8 h-8 rounded bg-orange-500/20 flex items-center justify-center text-orange-500 font-bold">K</div>
          <div class="space-y-2 mt-4">
            <div class="h-3 w-3/4 bg-zinc-800 rounded"></div>
            <div class="h-3 w-1/2 bg-zinc-800 rounded"></div>
          </div>
        </div>
        
        <!-- Main Panel -->
        <div class="flex-1 flex flex-col gap-4">
          <!-- Top Nav -->
          <div id="mock-topnav" class="h-12 bg-[#121212] border border-gray-800/80 rounded-lg px-4 flex items-center justify-between">
            <div class="h-4 w-24 bg-zinc-800 rounded"></div>
            <div class="h-6 w-16 bg-orange-500/20 border border-orange-500/30 rounded"></div>
          </div>
          
          <!-- Content cards -->
          <div class="flex-1 grid grid-cols-3 gap-4">
            <!-- Balance Card -->
            <div id="mock-card-balance" class="bg-[#121212] border border-gray-800/80 rounded-lg p-3">
              <div class="h-3 w-12 bg-zinc-800 rounded mb-2"></div>
              <div class="h-5 w-20 bg-zinc-700 rounded"></div>
            </div>
            
            <!-- Chart Card -->
            <div id="mock-card-chart" class="col-span-2 bg-[#121212] border border-gray-800/80 rounded-lg p-3 flex flex-col justify-between">
              <div class="h-3 w-20 bg-zinc-800 rounded"></div>
              <svg id="mock-chart-line" viewBox="0 0 100 30" class="w-full h-16 stroke-orange-500 fill-orange-500/10 stroke-[1.5]">
                <path d="M0,25 Q15,10 30,18 T60,5 T90,15 T100,10 L100,30 L0,30 Z" />
              </svg>
            </div>
          </div>
          
          <!-- List Card -->
          <div id="mock-card-list" class="h-28 bg-[#121212] border border-gray-800/80 rounded-lg p-3 flex flex-col justify-between">
            <div class="h-3 w-28 bg-zinc-800 rounded mb-2"></div>
            <div class="space-y-2" id="mock-list-items">
              <div class="flex justify-between items-center"><div class="h-2.5 w-24 bg-zinc-800 rounded"></div><div class="h-2.5 w-12 bg-red-500/20 rounded"></div></div>
              <div class="flex justify-between items-center"><div class="h-2.5 w-20 bg-zinc-800 rounded"></div><div class="h-2.5 w-12 bg-green-500/20 rounded"></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

Set up the GSAP ScrollTrigger timeline in `script.js`:
```javascript
const setupScrollytelling = () => {
  gsap.registerPlugin(ScrollTrigger);

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#hero-scroll-container",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      pin: true,
    }
  });

  // Fade out hero intro text as scroll progresses
  tl.to("#hero-header-text", { opacity: 0, y: -50, duration: 0.3 }, 0);

  // Explode dashboard pieces outward
  tl.to("#mock-sidebar", { x: -180, y: -20, z: -100, rotateY: -35, opacity: 0.4, duration: 1 }, 0.1);
  tl.to("#mock-topnav", { y: -90, z: -120, rotateX: 30, opacity: 0.4, duration: 1 }, 0.1);
  tl.to("#mock-card-balance", { x: 120, y: -70, z: 80, rotateX: -15, rotateY: 15, duration: 1 }, 0.15);
  tl.to("#mock-card-chart", { x: -100, y: 90, z: 150, rotateX: 15, rotateY: -15, duration: 1 }, 0.15);
  tl.to("#mock-card-list", { x: 140, y: 120, z: 60, rotateX: 20, rotateY: 20, duration: 1 }, 0.15);

  // Animate inner graphic layers
  tl.to("#mock-chart-line path", { stroke: "#3b82f6", scaleY: 1.3, transformOrigin: "bottom", duration: 1 }, 0.2);
  tl.to("#mock-list-items > div", { stagger: 0.1, y: 15, opacity: 0.6, duration: 0.8 }, 0.2);
};
```

#### Step 3: R2 - Bento Upgrades (`index.njk`, `script.js`, `style.css`)
- **Padlock Glowing Animation (Card 2)**:
  Modify CSS in `style.css`:
  ```css
  .padlock-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    margin: 1.5rem auto 0;
  }
  .padlock-glow {
    position: absolute;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(74, 222, 128, 0.4) 0%, transparent 70%);
    opacity: 0;
    transform: scale(0.8);
    transition: all 0.5s ease;
    filter: blur(6px);
  }
  .bento-card:hover .padlock-glow {
    opacity: 1;
    transform: scale(1.6);
  }
  .padlock-icon {
    color: rgba(74, 222, 128, 0.5);
    transition: color 0.5s ease, transform 0.5s ease;
  }
  .bento-card:hover .padlock-icon {
    color: rgba(74, 222, 128, 1);
    transform: scale(1.15) rotate(-5deg);
  }
  ```

- **Interactive Math Input (Card 4)**:
  Embed input field in Card 4:
  ```html
  <div class="mt-4 space-y-2">
    <input type="text" id="bento-math-input" class="w-full bg-[#121212] border border-gray-800 rounded-lg px-4 py-2 text-white font-mono placeholder-gray-500 focus:outline-none focus:border-orange-500 text-sm" placeholder="Type (3500*4)+1200 here...">
    <div id="bento-math-result" class="text-xs text-gray-500 font-mono">Type an expression and press Enter or =</div>
  </div>
  ```

  Integrate the math evaluation engine logic in `script.js` and bind event handlers:
  ```javascript
  // Copied evaluateMathExpression logic from kaasibeta/js/math-tool.js
  const setupInteractiveMathDemo = () => {
    const mathInput = document.getElementById("bento-math-input");
    const mathResult = document.getElementById("bento-math-result");
    if (!mathInput || !mathResult) return;

    mathInput.addEventListener("input", (e) => {
      const expr = e.target.value;
      if (!expr.trim()) {
        mathResult.textContent = "Type an expression (e.g., 3500 * 4 + 1200)";
        mathResult.className = "text-xs text-gray-500 font-mono";
        return;
      }
      const res = evaluateMathExpression(expr);
      if (res !== null) {
        mathResult.textContent = `= LKR ${res.toLocaleString()}`;
        mathResult.className = "text-xs text-green-400 font-mono font-bold";
      } else {
        mathResult.textContent = "Calculating...";
        mathResult.className = "text-xs text-gray-500 font-mono";
      }
    });

    mathInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === "=") {
        const res = evaluateMathExpression(mathInput.value);
        if (res !== null) {
          e.preventDefault();
          mathInput.value = res;
          mathResult.textContent = "Evaluated successfully!";
          mathResult.className = "text-xs text-green-400 font-mono";
        }
      }
    });
  };
  ```

#### Step 4: R3 - Competitor Comparison Table (`index.njk`)
Add the comparison table section after the bento section:
```html
<section id="comparison" class="py-24 border-t border-gray-800/60 bg-gray-900/10">
  <div class="container mx-auto px-6">
    <div class="text-center mb-16">
      <h2 class="text-4xl font-bold text-white mb-4 animate-on-scroll">How Kaasi Compares</h2>
      <p class="text-lg text-gray-400 max-w-2xl mx-auto">Comparison against traditional apps and spreadsheets.</p>
    </div>
    
    <div class="max-w-4xl mx-auto overflow-x-auto rounded-2xl border border-gray-800 bg-zinc-900/30 backdrop-blur-md">
      <table class="w-full text-left border-collapse text-sm">
        <thead>
          <tr class="border-b border-gray-800 bg-zinc-950/40">
            <th class="p-5 text-white font-bold">Feature</th>
            <th class="p-5 text-orange-500 font-bold">Kaasi</th>
            <th class="p-5 text-gray-400 font-semibold">Standard Apps</th>
            <th class="p-5 text-gray-400 font-semibold">Spreadsheets</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-800/30 text-gray-300">
          <tr>
            <td class="p-5 font-medium text-white">Offline-first & Private</td>
            <td class="p-5 text-green-400 font-medium"><i class="fas fa-check-circle mr-2"></i> Yes (100% Local)</td>
            <td class="p-5 text-red-500/70"><i class="fas fa-times-circle mr-2"></i> No (Cloud Required)</td>
            <td class="p-5 text-green-400 font-medium"><i class="fas fa-check-circle mr-2"></i> Yes (Local Files)</td>
          </tr>
          <tr>
            <td class="p-5 font-medium text-white">PWA (Installable)</td>
            <td class="p-5 text-green-400 font-medium"><i class="fas fa-check-circle mr-2"></i> Yes (No App Store)</td>
            <td class="p-5 text-red-500/70"><i class="fas fa-times-circle mr-2"></i> No (Native Stores)</td>
            <td class="p-5 text-red-500/70"><i class="fas fa-times-circle mr-2"></i> No</td>
          </tr>
          <tr>
            <td class="p-5 font-medium text-white">Inline Math Input</td>
            <td class="p-5 text-green-400 font-medium"><i class="fas fa-check-circle mr-2"></i> Yes (Integrated)</td>
            <td class="p-5 text-red-500/70"><i class="fas fa-times-circle mr-2"></i> No</td>
            <td class="p-5 text-green-400 font-medium"><i class="fas fa-check-circle mr-2"></i> Yes (Via formulas)</td>
          </tr>
          <tr>
            <td class="p-5 font-medium text-white">No Ads / Free</td>
            <td class="p-5 text-green-400 font-medium"><i class="fas fa-check-circle mr-2"></i> Yes (100% Ad-Free)</td>
            <td class="p-5 text-red-500/70"><i class="fas fa-times-circle mr-2"></i> No (Subs/Ads)</td>
            <td class="p-5 text-green-400 font-medium"><i class="fas fa-check-circle mr-2"></i> Yes</td>
          </tr>
          <tr>
            <td class="p-5 font-medium text-white">Double Entry Complexity</td>
            <td class="p-5 text-gray-400"><i class="fas fa-minus-circle mr-2"></i> No (Simple expense flow)</td>
            <td class="p-5 text-gray-400"><i class="fas fa-check-circle mr-2"></i> Yes (Often complex)</td>
            <td class="p-5 text-red-500/70"><i class="fas fa-times-circle mr-2"></i> No (Manual templates)</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</section>
```

#### Step 5: R4 - Read-Only Sandbox Dashboard (`index.njk` & `script.js`)
Add the interactive Sandbox replica section:
```html
<!-- Sandbox section in index.njk -->
<section id="sandbox" class="py-24 bg-zinc-950/20 border-t border-gray-800/60">
  <div class="container mx-auto px-6">
    <div class="text-center mb-12">
      <h2 class="text-4xl font-bold text-white mb-4">Try the Finance Engine</h2>
      <p class="text-lg text-gray-400">Click tabs to view the dummy dashboard sandbox replica.</p>
    </div>
    
    <!-- Sandbox container -->
    <div class="max-w-4xl mx-auto bg-[#18181B]/80 border border-gray-800 rounded-2xl p-6 shadow-2xl relative">
      <!-- Tooltip -->
      <div id="sandbox-tooltip" class="absolute hidden z-50 bg-[#121212] border border-gray-700 text-xs px-3 py-1.5 rounded-lg pointer-events-none text-white font-mono shadow-xl"></div>
      
      <!-- Tab Navigation -->
      <div class="flex border-b border-gray-800 mb-6 gap-2">
        <button class="sandbox-tab px-4 py-2 border-b-2 border-orange-500 text-orange-500 font-bold" data-tab="income">Income</button>
        <button class="sandbox-tab px-4 py-2 border-b-2 border-transparent text-gray-400 hover:text-white" data-tab="expenses">Expenses</button>
        <button class="sandbox-tab px-4 py-2 border-b-2 border-transparent text-gray-400 hover:text-white" data-tab="debts">Debts</button>
      </div>
      
      <!-- Summary Grid -->
      <div id="sandbox-summary" class="grid grid-cols-3 gap-4 mb-6">
        <!-- Injected via JavaScript -->
      </div>
      
      <!-- Content Split Grid -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-6">
        <!-- Transaction List -->
        <div class="md:col-span-3 bg-[#121212] border border-gray-800/60 rounded-xl p-4">
          <h4 class="text-white font-bold mb-4">Recent Ledger</h4>
          <div id="sandbox-list" class="space-y-3">
            <!-- Injected via JavaScript -->
          </div>
        </div>
        
        <!-- Chart Graphic -->
        <div class="md:col-span-2 bg-[#121212] border border-gray-800/60 rounded-xl p-4 flex flex-col justify-center items-center min-h-[220px]">
          <h4 class="text-white font-bold mb-4 self-start">Visual Share</h4>
          <div id="sandbox-chart-container" class="relative w-40 h-40 flex items-center justify-center">
            <!-- Injected via JavaScript -->
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

Add the dashboard engine inside `script.js`:
```javascript
const mockSandboxData = {
  income: {
    stats: { primary: "LKR 185,000", primaryLabel: "Total Income", secondary: "LKR 112,400", secondaryLabel: "Total Expense", net: "LKR 72,600", netLabel: "Net Flow" },
    transactions: [
      { name: "Salary (TechCorp Ltd)", category: "Salary", amount: "LKR 150,000", badgeColor: "bg-green-500/20 text-green-400" },
      { name: "Freelance UI Project", category: "Freelance", amount: "LKR 35,000", badgeColor: "bg-blue-500/20 text-blue-400" }
    ],
    chart: [
      { label: "Salary", value: 150000, pct: 81, color: "#22c55e", offset: 0 },
      { label: "Freelance", value: 35000, pct: 19, color: "#3b82f6", offset: 81 }
    ]
  },
  expenses: {
    stats: { primary: "LKR 112,400", primaryLabel: "Total Expense", secondary: "LKR 185,000", secondaryLabel: "Total Income", net: "LKR 72,600", netLabel: "Net Savings" },
    transactions: [
      { name: "Rent & Housing dues", category: "Rent", amount: "LKR 45,000", badgeColor: "bg-red-500/20 text-red-400" },
      { name: "Sampath Credit Card payment", category: "Financial", amount: "LKR 42,500", badgeColor: "bg-orange-500/20 text-orange-400" },
      { name: "Keells Supermarket run", category: "Groceries", amount: "LKR 12,400", badgeColor: "bg-yellow-500/20 text-yellow-400" },
      { name: "Ceypetco Fuel refill", category: "Transport", amount: "LKR 8,000", badgeColor: "bg-blue-500/20 text-blue-400" },
      { name: "Dialog Broadband bill", category: "Bills", amount: "LKR 4,500", badgeColor: "bg-purple-500/20 text-purple-400" }
    ],
    chart: [
      { label: "Rent", value: 45000, pct: 40, color: "#ef4444", offset: 0 },
      { label: "Credit Card", value: 42500, pct: 38, color: "#f97316", offset: 40 },
      { label: "Groceries", value: 12400, pct: 11, color: "#eab308", offset: 78 },
      { label: "Transport", value: 8000, pct: 7, color: "#3b82f6", offset: 89 },
      { label: "Bills", value: 4500, pct: 4, color: "#a855f7", offset: 96 }
    ]
  },
  debts: {
    stats: { primary: "LKR 15,000", primaryLabel: "You Owe सुरेश", secondary: "LKR 25,000", secondaryLabel: "Owed by Amaya", net: "LKR 10,000", netLabel: "Debt Net Credit" },
    transactions: [
      { name: "Loan from Suresh (Camera)", type: "Owe", progress: 33, amount: "LKR 15,000", paid: "LKR 5,000", badgeColor: "bg-red-500/20 text-red-400" },
      { name: "Borrowing by Amaya (Freelance)", type: "Owed", progress: 60, amount: "LKR 25,000", paid: "LKR 15,000", badgeColor: "bg-green-500/20 text-green-400" }
    ]
  }
};

const setupSandboxDashboard = () => {
  const tabs = document.querySelectorAll(".sandbox-tab");
  const summary = document.getElementById("sandbox-summary");
  const list = document.getElementById("sandbox-list");
  const chartContainer = document.getElementById("sandbox-chart-container");
  const tooltip = document.getElementById("sandbox-tooltip");

  if (!tabs.length || !summary || !list || !chartContainer) return;

  const renderTab = (tabName) => {
    // 1. Update Tabs visual
    tabs.forEach(tab => {
      if (tab.dataset.tab === tabName) {
        tab.className = "sandbox-tab px-4 py-2 border-b-2 border-orange-500 text-orange-500 font-bold";
      } else {
        tab.className = "sandbox-tab px-4 py-2 border-b-2 border-transparent text-gray-400 hover:text-white";
      }
    });

    const data = mockSandboxData[tabName];

    // 2. Render Summary cards
    summary.innerHTML = `
      <div class="bg-[#121212] border border-gray-800/80 rounded-xl p-4 text-center">
        <p class="text-xs text-gray-500 mb-1">${data.stats.primaryLabel}</p>
        <p class="text-lg font-bold text-white font-mono">${data.stats.primary}</p>
      </div>
      <div class="bg-[#121212] border border-gray-800/80 rounded-xl p-4 text-center">
        <p class="text-xs text-gray-500 mb-1">${data.stats.secondaryLabel}</p>
        <p class="text-lg font-bold text-white font-mono">${data.stats.secondary}</p>
      </div>
      <div class="bg-[#121212] border border-gray-800/80 rounded-xl p-4 text-center">
        <p class="text-xs text-gray-500 mb-1">${data.stats.netLabel}</p>
        <p class="text-lg font-bold text-orange-500 font-mono">${data.stats.net}</p>
      </div>
    `;

    // 3. Render List and Charts
    if (tabName === 'income' || tabName === 'expenses') {
      // Render Ledger Items
      list.innerHTML = data.transactions.map(t => `
        <div class="flex justify-between items-center bg-zinc-900/30 p-3 rounded-lg border border-gray-900">
          <div class="flex items-center gap-3">
            <span class="text-xs px-2 py-0.5 rounded ${t.badgeColor}">${t.category}</span>
            <span class="text-white text-sm font-medium">${t.name}</span>
          </div>
          <span class="text-sm font-bold text-white font-mono">${t.amount}</span>
        </div>
      `).join('');

      // Render Donut Chart SVG
      let svgCircles = '';
      data.chart.forEach(c => {
        // Radius of 15.91549430918954 gives a circumference of exactly 100
        const strokeDashOffset = 100 - c.pct;
        const rotateVal = (c.offset / 100) * 360 - 90;
        svgCircles += `
          <circle cx="21" cy="21" r="15.91549430918954" 
                  fill="transparent" 
                  stroke="${c.color}" 
                  stroke-width="4.2" 
                  stroke-dasharray="${c.pct} ${strokeDashOffset}" 
                  stroke-dashoffset="0"
                  transform="rotate(${rotateVal} 21 21)"
                  class="cursor-pointer transition-all duration-300 hover:stroke-[5.5]"
                  data-label="${c.label}"
                  data-value="LKR ${c.value.toLocaleString()}"
                  data-pct="${c.pct}%" />
        `;
      });

      chartContainer.innerHTML = `
        <svg viewBox="0 0 42 42" class="w-full h-full transform -scale-x-100">
          ${svgCircles}
        </svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span class="text-[10px] text-gray-500">Net savings</span>
          <span class="text-xs font-bold text-orange-500 font-mono">72,600</span>
        </div>
      `;

      // Set up hovers
      const segments = chartContainer.querySelectorAll("circle");
      segments.forEach(circle => {
        circle.addEventListener("mouseenter", (e) => {
          const lbl = e.target.dataset.label;
          const val = e.target.dataset.value;
          const pct = e.target.dataset.pct;
          tooltip.innerHTML = `<strong>${lbl}</strong><br/>${val} (${pct})`;
          tooltip.classList.remove("hidden");
        });
        circle.addEventListener("mousemove", (e) => {
          const rect = chartContainer.getBoundingClientRect();
          const x = e.clientX - rect.left + 15;
          const y = e.clientY - rect.top - 15;
          tooltip.style.left = `${x}px`;
          tooltip.style.top = `${y}px`;
        });
        circle.addEventListener("mouseleave", () => {
          tooltip.classList.add("hidden");
        });
      });

    } else if (tabName === 'debts') {
      // Render Repayments Progress Bars
      list.innerHTML = data.transactions.map(t => `
        <div class="bg-zinc-900/30 p-3 rounded-lg border border-gray-900 space-y-2">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-3">
              <span class="text-xs px-2 py-0.5 rounded ${t.badgeColor}">${t.type}</span>
              <span class="text-white text-sm font-medium">${t.name}</span>
            </div>
            <span class="text-sm font-bold text-white font-mono">${t.amount}</span>
          </div>
          <div class="w-full bg-zinc-800 h-2 rounded-full overflow-hidden relative progress-bar-hover" 
               data-tooltip="${t.paid} paid of ${t.amount}">
            <div class="bg-orange-500 h-full rounded-full" style="width: ${t.progress}%"></div>
          </div>
          <div class="flex justify-between text-[10px] text-gray-500">
            <span>Paid: ${t.paid}</span>
            <span>${t.progress}% complete</span>
          </div>
        </div>
      `).join('');

      chartContainer.innerHTML = `
        <div class="text-center">
          <i class="fas fa-hand-holding-usd text-4xl text-orange-500/80 mb-2"></i>
          <p class="text-xs text-gray-400">Total active credit</p>
          <p class="text-sm font-bold text-white font-mono">LKR 40,000</p>
        </div>
      `;

      // Hover on progress bars
      const bars = list.querySelectorAll(".progress-bar-hover");
      bars.forEach(bar => {
        bar.addEventListener("mouseenter", (e) => {
          tooltip.innerHTML = e.currentTarget.dataset.tooltip;
          tooltip.classList.remove("hidden");
        });
        bar.addEventListener("mousemove", (e) => {
          const rect = list.getBoundingClientRect();
          const x = e.clientX - rect.left + 15;
          const y = e.clientY - rect.top + 15;
          tooltip.style.left = `${x}px`;
          tooltip.style.top = `${y}px`;
        });
        bar.addEventListener("mouseleave", () => {
          tooltip.classList.add("hidden");
        });
      });
    }
  };

  // Bind tabs click event
  tabs.forEach(tab => {
    tab.addEventListener("click", () => renderTab(tab.dataset.tab));
  });

  // Render initial tab
  renderTab("income");
};
```

---

## 5. Verification Method
Verify that the implementation satisfies the objectives and does not degrade building of the static pages:

1. **Verify Compilation**: Run `cmd /c npx @11ty/eleventy` from the workspace directory. If successful, it compiles without errors and populates files in `_site/`.
2. **Exclude `.agents/` Verification**: Verify that adding `.agents/` to `.eleventyignore` stops files under `.agents` from appearing in the `_site/` directory.
3. **Verify Math Input**: Set `#bento-math-input` value to `1000 + 2500` and assert that `#bento-math-result` yields `LKR 3,500`.
4. **Layout check**: Ensure all new sections look clean on both desktop and mobile screens by checking responsiveness and hover animations.
