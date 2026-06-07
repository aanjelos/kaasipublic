// Kaasi Landing Page - script.js (v3 - Patched)

document.addEventListener("DOMContentLoaded", () => {
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

    // Listen for mouse movement on the entire window
    window.addEventListener("mousemove", (e) => {
      const { innerWidth, innerHeight } = window;

      // Calculate mouse position from the center of the window (-1 to 1 range)
      const mouseX = (e.clientX / innerWidth) * 2 - 1;
      const mouseY = (e.clientY / innerHeight) * 2 - 1;

      const rotateY = mouseX * intensity;
      const rotateX = -mouseY * intensity;

      // Use requestAnimationFrame for a smoother animation
      requestAnimationFrame(() => {
        image.style.transform = `perspective(1500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
    });
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
    const lineCount = 5;
    const pointsPerLine = 400;

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
        color: 0x2a2a2a,
        transparent: true,
        opacity: 0.6,
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
      button.addEventListener("click", () => {
        const textToCopy = button.dataset.copyText;

        // Create a temporary textarea to perform the copy command
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand("copy");
          // Visual feedback
          const originalIcon = button.innerHTML;
          if (button.querySelector('i')) {
              button.innerHTML = '<i class="fas fa-check"></i>';
          } else {
              button.textContent = "Copied!";
          }
          button.classList.add("copied");
          setTimeout(() => {
            if (button.querySelector('i')) {
                button.innerHTML = originalIcon;
            } else {
                button.textContent = "Copy";
            }
            button.classList.remove("copied");
          }, 2000);
        } catch (err) {
          console.error("Failed to copy text: ", err);
        }
        document.body.removeChild(textArea);
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
});
