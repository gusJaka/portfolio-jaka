// Keep the footer current without making the page dependent on JavaScript.
document.getElementById('year').textContent = new Date().getFullYear();

// Indicate which section is currently being explored.
const navigationLinks = document.querySelectorAll('nav a[href^="#"]');
if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            navigationLinks.forEach(link => {
                if (link.hash === `#${entry.target.id}`) {
                    link.setAttribute('aria-current', 'location');
                } else {
                    link.removeAttribute('aria-current');
                }
            });
        }
    }, { rootMargin: '-10% 0px -55% 0px', threshold: 0 });
    document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
}
