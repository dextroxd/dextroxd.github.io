const navToggle = document.querySelector('.mobile-nav-toggle');
const body = document.querySelector('body');
const navMobile = document.querySelector('.mobile-nav');
const linksInsideNav = document.querySelectorAll(".mobile-nav-items");
navToggle.addEventListener('click', () => {
    const visible = navToggle.getAttribute('data-visible');
    if (visible === 'false') {
        navToggle.setAttribute('data-visible', 'true');
        navMobile.setAttribute('data-visible', 'true');
        navToggle.textContent = '✕';
        body.style.overflow = 'hidden';

    }
    else {
        navToggle.setAttribute('data-visible', 'false');
        navMobile.setAttribute('data-visible', 'false');
        navToggle.textContent = '☰';
        body.style.overflow = 'auto';
    }
});
linksInsideNav.forEach(item => {
    item.addEventListener('click', (_) => {
        navToggle.setAttribute('data-visible', 'false');
        navMobile.setAttribute('data-visible', 'false');
        navToggle.textContent = '☰';
        body.style.overflow = 'auto';
    });
});
