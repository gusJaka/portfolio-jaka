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

window.addEventListener('load', () => {
    loadRepos();
    startTyping();
    updateScrollOffset();
    initSmoothScrolling();
});

window.addEventListener('resize', updateScrollOffset);