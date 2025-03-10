document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const targetId = event.target.getAttribute('href').slice(1);
        document.getElementById(targetId).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// Scroll-Based Animation for Sections
const sections = document.querySelectorAll('header, nav, footer');
const observerOptions = {
    threshold: 0.2
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

sections.forEach(section => sectionObserver.observe(section));

// Hover Effects for the "menu buttons"
document.querySelector("#__hover")

// Select the container for the background
const bgContainer = document.querySelector('.animated-bg');

// Generate 50 floating lines
for (let i = 0; i < 50; i++) {
    const span = document.createElement('span');

    // Randomize position and rotation
    span.style.setProperty('--random-x', Math.random()); // 0 to 1 for horizontal position
    span.style.setProperty('--random-y', Math.random()); // 0 to 1 for vertical position
    span.style.setProperty('--random-rotation', Math.random()); // Random rotation

    // Append the span (line) to the container
    bgContainer.appendChild(span);
}