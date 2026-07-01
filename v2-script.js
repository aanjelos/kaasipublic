// v2-script.js - Custom Scripts for the V2 Landing Page

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize GSAP ScrollTrigger for the Scrollytelling Hero
    gsap.registerPlugin(ScrollTrigger);

    const initHeroAnimation = () => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".hero-sticky-container",
                start: "top top",
                end: "bottom bottom",
                scrub: 1, // Smooth scrubbing
            }
        });

        // The hero text fades out early
        tl.to(".hero-text-content", {
            opacity: 0,
            y: -50,
            duration: 0.2
        }, 0);

        // Base mockup scales up
        tl.to("#mockup-base", {
            scale: 1.1,
            y: 50,
            duration: 1
        }, 0);

        // Chart layer slides out left and scales
        tl.to("#mockup-layer-chart", {
            x: -250,
            y: -100,
            scale: 1.2,
            rotation: -5,
            opacity: 1,
            duration: 1
        }, 0.1);

        // List layer slides out right and scales
        tl.to("#mockup-layer-list", {
            x: 250,
            y: 100,
            scale: 1.2,
            rotation: 5,
            opacity: 1,
            duration: 1
        }, 0.2);
    };

    // Only run complex hero animations on desktop to save battery/performance on mobile
    if (window.innerWidth > 768) {
        initHeroAnimation();
    }

    // 2. Interactive Math Parser for Bento Card
    const setupMathParser = () => {
        const input = document.getElementById('bento-math-input');
        const output = document.getElementById('bento-math-result');

        if (!input || !output) return;

        // Ported Recursive Descent Parser
        function evaluateExpression(expr) {
            expr = expr.replace(/\s+/g, '');
            if (!expr) return null;
            if (/[^0-9+\-*/().]/.test(expr)) return null;

            let pos = 0;

            function parseNumber() {
                let start = pos;
                while (pos < expr.length && /[0-9.]/.test(expr[pos])) pos++;
                if (start === pos) return NaN;
                return parseFloat(expr.slice(start, pos));
            }

            function parseFactor() {
                if (expr[pos] === '(') {
                    pos++;
                    let val = parseExpression();
                    if (expr[pos] === ')') pos++;
                    return val;
                }
                return parseNumber();
            }

            function parseTerm() {
                let val = parseFactor();
                while (pos < expr.length) {
                    let op = expr[pos];
                    if (op !== '*' && op !== '/') break;
                    pos++;
                    let next = parseFactor();
                    if (op === '*') val *= next;
                    else val /= next;
                }
                return val;
            }

            function parseExpression() {
                let val = parseTerm();
                while (pos < expr.length) {
                    let op = expr[pos];
                    if (op !== '+' && op !== '-') break;
                    pos++;
                    let next = parseTerm();
                    if (op === '+') val += next;
                    else val -= next;
                }
                return val;
            }

            try {
                let res = parseExpression();
                if (pos !== expr.length) return null; // trailing invalid chars
                if (typeof res === 'number' && !isNaN(res) && isFinite(res)) {
                    return parseFloat(res.toFixed(2));
                }
            } catch (e) {
                return null;
            }
            return null;
        }

        input.addEventListener('input', (e) => {
            const val = e.target.value;
            if (!val) {
                output.textContent = "Type an expression (e.g. 100+50*2)";
                output.className = "text-xs text-gray-500 font-mono";
                return;
            }

            const result = evaluateExpression(val);
            if (result !== null) {
                output.textContent = `= Rs. ${result.toLocaleString('en-US')}`;
                output.className = "text-sm text-green-400 font-bold font-mono";
            } else {
                output.textContent = "Invalid expression";
                output.className = "text-xs text-red-500 font-mono";
            }
        });
    };

    setupMathParser();
});
