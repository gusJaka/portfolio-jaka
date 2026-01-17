// Simple Scroll Reveal Effect
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        const top = section.getBoundingClientRect().top;
        if (top < window.innerHeight - 100) {
            section.style.opacity = "1";
            section.style.transform = "translateY(0)";
        }
    });
});

// Mock Repository Loader
const loadRepos = () => {
    const repoList = document.getElementById('repo-list');
    const repos = [
        { name: "Awesome-App", lang: "JavaScript" },
        { name: "Data-Visualizer", lang: "Python" },
        { name: "Portfolio-Template", lang: "HTML/CSS" }
    ];

    repoList.innerHTML = repos.map(repo => `
        <div class="card">
            <h3>${repo.name}</h3>
            <p>Language: <span class="highlight">${repo.lang}</span></p>
            <a href="#" style="color: var(--primary)">View on GitHub</a>
        </div>
    `).join('');
};

// Typing animation
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function typeLoop(el, phrases, typeSpeed = 80, backSpeed = 40, pause = 1500) {
    let index = 0;
    while (true) {
        const phrase = phrases[index];
        // type in
        for (let i = 1; i <= phrase.length; i++) {
            el.textContent = phrase.slice(0, i);
            await sleep(typeSpeed);
        }
        await sleep(pause);
        // delete
        for (let i = phrase.length; i >= 0; i--) {
            el.textContent = phrase.slice(0, i);
            await sleep(backSpeed);
        }
        index = (index + 1) % phrases.length;
    }
}

function startTyping() {
    const el = document.getElementById('typed');
    if (!el) return;
    const phrases = [
        'Full Stack Developer',
        'Creative Problem Solver',
        'Graphic Designer'
    ];
    typeLoop(el, phrases);
}

// Setup smooth scrolling that accounts for fixed header
function updateScrollOffset() {
    const nav = document.querySelector('nav');
    const offset = nav ? nav.offsetHeight + 16 : 88;
    document.documentElement.style.setProperty('--scroll-offset', `${offset}px`);
    // ensure all sections adjust for the header
    document.querySelectorAll('section[id]').forEach(s => s.style.scrollMarginTop = `${offset}px`);
}

function initSmoothScrolling() {
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;
        const href = link.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--scroll-offset')) || 0;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
        // update hash without jumping
        history.pushState(null, '', href);
    });
}

/* Parallax for hero: move card left and image right as user scrolls */
function initParallax() {
    const section = document.getElementById('hero');
    if (!section) return;
    const card = section.querySelector('.hero-card');
    const imageWrap = section.querySelector('.hero-image');
    if (!card || !imageWrap) return;

    let ticking = false;

    function update() {
        const rect = section.getBoundingClientRect();
        const vh = window.innerHeight;
        const sh = rect.height;
        const top = rect.top;

        // ease in only when section scrolls UP and out of view
        // when top = 0 (section at top of viewport): ease = 0, no movement
        // when top = -sh (section completely scrolled past): ease = 1, full movement
        let ease = 0;
        if (top < 0) {
            ease = Math.min(1, Math.abs(top) / sh);
        }

        // smooth easing curve
        ease = Math.sin(ease * Math.PI / 2);

        // compute dynamic max offsets (but limit movement so they only move about halfway)
        const cardRect = card.getBoundingClientRect();
        const imageRect = imageWrap.getBoundingClientRect();
        // distance to move card fully out to the left: right edge distance plus width
        const maxCard = Math.max(cardRect.right + cardRect.width, 300);
        // distance to move image fully out to the right: space to right edge plus its width
        const maxImage = Math.max(window.innerWidth - imageRect.left + imageRect.width, 300);

        // limit movement to a fraction so elements only slide part-way (e.g., 50%)
        const movementFactor = 0.5; // 0.0 - 1.0 (smaller => less slide)

        // soften easing curve slightly so motion feels less aggressive
        const eased = Math.pow(ease, 0.85);

        // translate card left and image right (eased 0..1)
        const cardX = -maxCard * movementFactor * eased;
        const imageX = maxImage * movementFactor * eased;

        // apply transforms
        card.style.transform = `translateX(${cardX.toFixed(2)}px)`;
        imageWrap.style.transform = `translateX(${imageX.toFixed(2)}px)`;

        // fade out as they move: use a gentler fade so elements don't disappear too quickly
        const fadeMultiplier = 1.0; // 1.0 = linear fade based on eased progress
        const cardOpacity = Math.max(0, 1 - eased * fadeMultiplier);
        const imageOpacity = Math.max(0, 1 - eased * fadeMultiplier);

        card.style.opacity = cardOpacity.toFixed(3);
        imageWrap.style.opacity = imageOpacity.toFixed(3);
    }

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                update();
                ticking = false;
            });
            ticking = true;
        }
    }

    // reset on resize
    function onResize() { update(); }

    // initial
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
}


window.addEventListener('load', () => {
    loadRepos();
    startTyping();
    updateScrollOffset();
    initSmoothScrolling();
    initParallax();

    // flip-card: support click/tap toggle and keyboard activation for accessibility
    const flipCards = Array.from(document.querySelectorAll('.flip-card'));
    flipCards.forEach(card => {
        // log front/back image sources for debugging
        const frontImg = card.querySelector('.flip-card-front img');
        const backImg = card.querySelector('.flip-card-back img');
        console.debug('flip-card images:', { front: frontImg ? frontImg.src : null, back: backImg ? backImg.src : null });

        card.addEventListener('click', () => {
            const pressed = card.getAttribute('aria-pressed') === 'true';
            card.setAttribute('aria-pressed', (!pressed).toString());
            card.classList.toggle('flipped');
            console.debug('flip-card toggled:', card.classList.contains('flipped'));
        });
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });

    // Auto-flip once on load for a quick visual check (then revert) so you can see the back image
    if (flipCards.length) {
        setTimeout(() => {
            flipCards.forEach(card => card.classList.add('flipped'));
            setTimeout(() => { flipCards.forEach(card => card.classList.remove('flipped')); }, 900);
        }, 400);
    }
});

window.addEventListener('resize', updateScrollOffset);