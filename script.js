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

        // compute dynamic max offsets so elements can move fully out of frame
        const cardRect = card.getBoundingClientRect();
        const imageRect = imageWrap.getBoundingClientRect();
        // distance to move card fully out to the left: right edge distance plus width
        const maxCard = Math.max(cardRect.right + cardRect.width, 300);
        // distance to move image fully out to the right: space to right edge plus its width
        const maxImage = Math.max(window.innerWidth - imageRect.left + imageRect.width, 300);

        // translate card left and image right (ease = 0..1)
        const cardX = -maxCard * ease;
        const imageX = maxImage * ease;

        card.style.transform = `translateX(${cardX.toFixed(2)}px)`;
        imageWrap.style.transform = `translateX(${imageX.toFixed(2)}px)`;
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
    document.querySelectorAll('.flip-card').forEach(card => {
        card.addEventListener('click', () => {
            const pressed = card.getAttribute('aria-pressed') === 'true';
            card.setAttribute('aria-pressed', (!pressed).toString());
            card.classList.toggle('flipped');
        });
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });
});

window.addEventListener('resize', updateScrollOffset);