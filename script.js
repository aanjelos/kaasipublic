// Kaasi Landing Page - script.js (v3 - Patched)

const THREE_CONFIG = {
  lineCount: 5,
  pointsPerLine: 400,
  color: 0x2a2a2a,
  opacity: 0.6,
};

/**
 * Handles the glassmorphism effect on the header when scrolling.
 */
const setupHeaderScroll = () => {
  const header = document.getElementById("header");
  if (!header) return;

  const handleScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 30);
  };
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll(); // Initial check
};

/**
 * Adds a glowing effect that follows the mouse on bento grid cards.
 */
const setupBentoGlow = () => {
  const bentoCards = document.querySelectorAll(".bento-card");
  bentoCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });
};

/**
 * Applies a 3D tilt effect to the hero mockup image based on global mouse position.
 */
const setupInteractiveMockup = () => {
  const image = document.getElementById("mockup-image");

  if (!image) return;

  const intensity = 5; // How much the image should tilt. Higher is more.
  let targetRotateX = 0;
  let targetRotateY = 0;
  let currentRotateX = 0;
  let currentRotateY = 0;
  const lerpFactor = 0.1;

  // Listen for mouse movement on the entire window
  window.addEventListener("mousemove", (e) => {
    const { innerWidth, innerHeight } = window;

    // Calculate mouse position from the center of the window (-1 to 1 range)
    const mouseX = (e.clientX / innerWidth) * 2 - 1;
    const mouseY = (e.clientY / innerHeight) * 2 - 1;

    targetRotateY = mouseX * intensity;
    targetRotateX = -mouseY * intensity;
  }, { passive: true });

  const animate = () => {
    currentRotateX += (targetRotateX - currentRotateX) * lerpFactor;
    currentRotateY += (targetRotateY - currentRotateY) * lerpFactor;
    image.style.transform = `perspective(1500px) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;
    requestAnimationFrame(animate);
  };
  animate();
};

/**
 * Sets up a fallback for scroll animations using IntersectionObserver
 * for browsers that don't support CSS scroll-driven animations.
 */
const setupScrollAnimationFallback = () => {
  const supportsScrollTimeline =
    window.CSS && CSS.supports("animation-timeline", "view()");
  if (supportsScrollTimeline) return;

  const animatedElements = document.querySelectorAll(".animate-on-scroll");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = "running";
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  animatedElements.forEach((el) => observer.observe(el));
};

/**
 * Initializes the subtle Three.js "flow field" background animation.
 */
const initFlowFieldBackground = () => {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas || typeof THREE === "undefined") {
    if (typeof THREE === "undefined")
      console.warn(
        "Three.js library not found. Animated background will not be rendered."
      );
    return;
  }

  let scene, camera, renderer, lines, clock;
  const lineCount = THREE_CONFIG.lineCount;
  const pointsPerLine = THREE_CONFIG.pointsPerLine;

  scene = new THREE.Scene();
  clock = new THREE.Clock();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const createLines = () => {
    const material = new THREE.LineBasicMaterial({
      color: THREE_CONFIG.color,
      transparent: true,
      opacity: THREE_CONFIG.opacity,
    });
    const group = new THREE.Group();
    for (let j = 0; j < lineCount; j++) {
      const points = [];
      for (let i = 0; i < pointsPerLine; i++) {
        points.push(new THREE.Vector3((i / pointsPerLine - 0.5) * 20, 0, 0));
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, material);
      line.position.y = (Math.random() - 0.5) * 10;
      group.add(line);
    }
    return group;
  };

  lines = createLines();
  scene.add(lines);

  const animate = () => {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    lines.children.forEach((line, lineIndex) => {
      const positions = line.geometry.attributes.position.array;
      for (let i = 0; i < pointsPerLine; i++) {
        const i3 = i * 3;
        positions[i3 + 1] =
          Math.sin(positions[i3] * 0.5 + t + lineIndex * 2.0) * 0.5;
        positions[i3 + 2] =
          Math.cos(positions[i3] * 0.5 + t + lineIndex * 2.0) * 0.5;
      }
      line.geometry.attributes.position.needsUpdate = true;
    });
    renderer.render(scene, camera);
  };
  animate();

  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };
  window.addEventListener("resize", onWindowResize, { passive: true });
};

/**
 * Handles the functionality for the donation modal.
 */
const setupDonateModal = () => {
  const modal = document.getElementById("donate-modal");
  const openButton = document.getElementById("donate-button");
  const closeButton = document.getElementById("close-modal-button");

  if (!modal || !openButton || !closeButton) return;

  const openModal = () => modal.classList.remove("hidden");
  const closeModal = () => modal.classList.add("hidden");

  openButton.addEventListener("click", openModal);
  closeButton.addEventListener("click", closeModal);

  // Close modal if user clicks on the background overlay
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
};

/**
 * Handles the copy to clipboard functionality across the site
 */
const setupCopyButtons = () => {
  const copyButtons = document.querySelectorAll(".copy-button");
  copyButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const textToCopy = button.dataset.copyText;

      try {
        await navigator.clipboard.writeText(textToCopy);
        
        const originalHTML = button.innerHTML;
        
        button.textContent = "Copied!";
        button.classList.add("copied");
        
        setTimeout(() => {
          button.innerHTML = originalHTML;
          button.classList.remove("copied");
        }, 2000);
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
    });
  });
};

/**
 * Handles the "Go to Top" button visibility and click action.
 */
const setupGoToTopButton = () => {
  const button = document.getElementById("go-to-top-button");
  if (!button) return;

  // Show or hide the button based on scroll position
  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 400) {
        // Show button after scrolling 400px
        button.classList.remove("opacity-0", "pointer-events-none");
        button.classList.add("opacity-100", "pointer-events-auto");
      } else {
        button.classList.remove("opacity-100", "pointer-events-auto");
        button.classList.add("opacity-0", "pointer-events-none");
      }
    },
    { passive: true }
  );

  // Smooth scroll to top on click
  button.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
};

/**
 * Updates a progress bar based on scroll position within an article.
 */
const setupReadingProgressBar = () => {
  const progressBar = document.getElementById("progress-bar");
  const article = document.querySelector("article"); // The main article container

  // If these elements don't exist (i.e., we are not on the blog post page), do nothing.
  if (!progressBar || !article) {
    return;
  }

  const updateProgressBar = () => {
    const articleTop = article.offsetTop;
    const articleHeight = article.offsetHeight;
    const windowHeight = window.innerHeight;

    // Total scrollable distance within the article
    const scrollableHeight = articleHeight - windowHeight;

    // How far the user has scrolled from the top of the article
    const scrollDistance = window.scrollY - articleTop;

    // Calculate the percentage scrolled through the article
    let progress = 0;
    if (scrollDistance > 0 && scrollableHeight > 0) {
      progress = (scrollDistance / scrollableHeight) * 100;
    }

    // Ensure the value is between 0 and 100
    progress = Math.max(0, Math.min(100, progress));

    progressBar.style.width = `${progress}%`;
  };

  window.addEventListener("scroll", updateProgressBar, { passive: true });
  updateProgressBar(); // Run on page load to set initial state
};

/**
 * Handles the functionality for the privacy policy modal.
 */
const setupPrivacyModal = () => {
  const modal = document.getElementById("privacy-policy-modal");
  const openButton = document.getElementById("open-privacy-policy");
  const closeButton = document.getElementById("close-privacy-modal-button");

  // Only run if the modal elements exist on the page (i.e., on index.html)
  if (!modal || !openButton || !closeButton) {
    return;
  }

  const openModal = () => modal.classList.remove("hidden");
  const closeModal = () => modal.classList.add("hidden");

  openButton.addEventListener("click", openModal);
  closeButton.addEventListener("click", closeModal);

  // Close modal if user clicks on the background overlay
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
};

/**
 * Highlights the active navigation link based on scroll position.
 */
const setupScrollSpy = () => {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  if (sections.length === 0 || navLinks.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      let anyIntersecting = false;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          anyIntersecting = true;
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            link.classList.remove("active");
            const href = link.getAttribute("href");
            if (href === `/#${id}` || href === `#${id}`) {
              link.classList.add("active");
            }
          });
        }
      });
    },
    { rootMargin: "-30% 0px -70% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
};

/* --- Interactive Bento Logic --- */

// Math Parser
function evaluateMathExpression(inputStr) {
  let expr = inputStr.trim();
  expr = expr.replace(/,/g, '');
  if (expr.endsWith("=")) expr = expr.slice(0, -1);
  expr = expr.replace(/×/g, "*").replace(/÷/g, "/");

  if (!/^[\d\.\+\-\*\/\(\)\s]+$/.test(expr)) return null;
  if (!/[\+\-\*\/]/.test(expr)) return null;

  try {
    const tokens = expr.match(/([0-9\.]+)|([\+\-\*\/\(\)])/g);
    if (!tokens) return null;
    
    let pos = 0;
    function parseExpression() {
      let value = parseTerm();
      while (pos < tokens.length && (tokens[pos] === '+' || tokens[pos] === '-')) {
        let op = tokens[pos++];
        let nextTerm = parseTerm();
        value = op === '+' ? value + nextTerm : value - nextTerm;
      }
      return value;
    }
    function parseTerm() {
      let value = parseFactor();
      while (pos < tokens.length && (tokens[pos] === '*' || tokens[pos] === '/')) {
        let op = tokens[pos++];
        let nextFactor = parseFactor();
        value = op === '*' ? value * nextFactor : value / nextFactor;
      }
      return value;
    }
    function parseFactor() {
      if (pos >= tokens.length) throw new Error("Unexpected end");
      let token = tokens[pos++];
      if (token === '(') {
        let value = parseExpression();
        if (pos >= tokens.length || tokens[pos++] !== ')') throw new Error("Missing )");
        return value;
      }
      if (token === '-') return -parseFactor();
      if (token === '+') return parseFactor();
      return parseFloat(token);
    }
    
    const result = parseExpression();
    if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
      return parseFloat(result.toFixed(2));
    }
  } catch (e) {
    return null;
  }
  return null;
}

// Math Toolbar Setup
const mathToolbar = document.createElement("div");
mathToolbar.className = "math-toolbar";
mathToolbar.innerHTML = `
  <div class="math-btn" data-op="+">+</div>
  <div class="math-btn" data-op="-">-</div>
  <div class="math-btn" data-op="*">×</div>
  <div class="math-btn" data-op="/">÷</div>
  <div class="math-btn math-btn-equal" data-op="=">=</div>
`;
document.body.appendChild(mathToolbar);

let activeCalcInput = null;

function positionMathToolbar(inputEl) {
  const parent = inputEl.parentElement;
  if (!parent.classList.contains("relative")) {
    parent.classList.add("relative");
  }
  if (!parent.contains(mathToolbar)) {
    parent.appendChild(mathToolbar);
  }
  mathToolbar.style.left = 'auto';
  mathToolbar.style.right = '0';
  mathToolbar.style.top = '100%';
  mathToolbar.style.marginTop = '4px';
}

function showMathToolbar(inputEl) {
  activeCalcInput = inputEl;
  positionMathToolbar(inputEl);
  mathToolbar.classList.add("visible");
}

function hideMathToolbar() {
  mathToolbar.classList.remove("visible");
  activeCalcInput = null;
}

function handleMathToolbarInteraction(e) {
  e.preventDefault();
  const btn = e.target.closest(".math-btn");
  if (!btn || !activeCalcInput) return;

  const op = btn.dataset.op;
  if (op === "=") {
    const result = evaluateMathExpression(activeCalcInput.value);
    if (result !== null) {
      if (typeof gtag === 'function') gtag('event', 'math_eval', { event_category: 'engagement', event_label: 'Math Result Success' });
      activeCalcInput.value = result;
      activeCalcInput.style.borderColor = "#22c55e";
      setTimeout(() => { activeCalcInput.style.borderColor = ""; }, 500);
    } else {
      activeCalcInput.style.borderColor = "#ef4444";
      setTimeout(() => { activeCalcInput.style.borderColor = ""; }, 500);
    }
    hideMathToolbar();
  } else {
    activeCalcInput.value += op;
  }
  activeCalcInput.focus();
}

mathToolbar.addEventListener("mousedown", handleMathToolbarInteraction);

const setupMathInput = () => {
  const input = document.getElementById("demo-math-input");
  const toggleBtn = document.querySelector("#demo-math-input + button");
  if (!input || !toggleBtn) return;

  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (mathToolbar.classList.contains("visible")) {
      hideMathToolbar();
    } else {
      showMathToolbar(input);
    }
  });

  input.addEventListener("focus", () => {
    showMathToolbar(input);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const result = evaluateMathExpression(input.value);
      if (result !== null) {
        if (typeof gtag === 'function') gtag('event', 'math_eval', { event_category: 'engagement', event_label: 'Math Result Success (Keyboard)' });
        input.value = result;
        input.style.borderColor = "#22c55e";
        setTimeout(() => { input.style.borderColor = ""; }, 500);
      } else {
        input.style.borderColor = "#ef4444";
        setTimeout(() => { input.style.borderColor = ""; }, 500);
      }
      hideMathToolbar();
    }
  });

  document.addEventListener("click", (e) => {
    if (!mathToolbar.contains(e.target) && e.target !== input && e.target !== toggleBtn && !toggleBtn.contains(e.target)) {
      hideMathToolbar();
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  // --- INITIALIZE ALL SCRIPTS ---
  setupHeaderScroll();
  setupBentoGlow();
  setupInteractiveMockup();
  setupScrollAnimationFallback();
  initFlowFieldBackground();
  setupDonateModal();
  setupCopyButtons();
  setupPrivacyModal();
  setupGoToTopButton();
  setupReadingProgressBar();
  setupScrollSpy();
  setupMathInput();
  setupAnalytics();
});

function setupAnalytics() {
  if (typeof gtag !== 'function') return;

  const ctaButtons = document.querySelectorAll('.cta-button, .cta-button-large');
  ctaButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      let location = "Unknown";
      const container = btn.closest('header, section, .prose, footer');
      if (container) {
        if (container.tagName.toLowerCase() === 'header') location = "Header";
        else if (container.tagName.toLowerCase() === 'footer') location = "Footer";
        else if (container.classList.contains('prose')) location = "Blog Post";
        else location = container.id ? `Section: ${container.id}` : "Page Body";
      }

      gtag('event', 'click_cta', { 
        event_category: 'engagement', 
        event_label: `${btn.innerText.trim() || 'CTA'} - [${location}]` 
      });
    });
  });

  const privacyBtn = document.getElementById("open-privacy-policy");
  if (privacyBtn) {
    privacyBtn.addEventListener("click", () => {
      gtag('event', 'open_privacy', { event_category: 'engagement', event_label: 'Privacy Policy Modal' });
    });
  }

  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      gtag('event', 'click_nav', { event_category: 'navigation', event_label: link.innerText });
    });
  });
}
