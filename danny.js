const burger = document.querySelector('.burger');
const navMenu = document.querySelector('.nav-menu');

burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!burger.contains(e.target) && !navMenu.contains(e.target)) {
        burger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});