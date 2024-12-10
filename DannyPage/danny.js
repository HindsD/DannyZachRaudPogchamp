const burger = document.querySelector('.burger');
const navMenu = document.querySelector('.nav-menu');

burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    if (!burger.contains(e.target) && !navMenu.contains(e.target)) {
        burger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

let isDragging = false;
let startX = 0;
let rotateY = 0;

const pokeSets = ['base', 'bw', 'dp', 'ecard', 'ex', 'gym', 'hgss', 'neo', 'pl', 'pop', 'sm', 'sv', 'swsh', 'xy'];
let set = pokeSets[Math.floor(Math.random() * pokeSets.length)];
let firstBaseNum = Math.floor(Math.random() * 17);
let secondBaseNum = Math.floor(Math.random() * 17);

const container = document.querySelector('.card-container');

// Mouse Events
container.addEventListener('mousedown', startDragging);
document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', stopDragging);
container.addEventListener('mouseleave', stopDragging);

// Touch Events
container.addEventListener('touchstart', handleTouchStart);
document.addEventListener('touchmove', handleTouchMove);
document.addEventListener('touchend', handleTouchEnd);

function handleTouchStart(e) {
    e.preventDefault(); // Prevent scrolling while dragging
    isDragging = true;
    startX = e.touches[0].clientX;
    container.classList.add('dragging');
}

function handleTouchMove(e) {
    if (!isDragging) return;

    const deltaX = e.touches[0].clientX - startX;
    rotateY += deltaX * 0.5;
    container.style.transform = `rotateY(${rotateY}deg)`;
    startX = e.touches[0].clientX;
}

function handleTouchEnd() {
    if (!isDragging) return;
    isDragging = false;
    container.classList.remove('dragging');

    // Snap to front or back
    const normalizedRotation = ((rotateY % 360) + 360) % 360;
    rotateY = Math.round(normalizedRotation / 180) * 180;
    container.style.transform = `rotateY(${rotateY}deg)`;
}

function startDragging(e) {
    isDragging = true;
    startX = e.clientX;
    container.classList.add('dragging');
}

function drag(e) {
    if (!isDragging) return;

    const deltaX = e.clientX - startX;
    rotateY += deltaX * 0.5;
    container.style.transform = `rotateY(${rotateY}deg)`;
    startX = e.clientX;
}

function stopDragging() {
    if (!isDragging) return;
    isDragging = false;
    container.classList.remove('dragging');

    // Snap to front or back
    const normalizedRotation = ((rotateY % 360) + 360) % 360;
    rotateY = Math.round(normalizedRotation / 180) * 180;
    container.style.transform = `rotateY(${rotateY}deg)`;
}

async function fetchPokemonData(set, first, second) {
    try {
        const response = await fetch(`https://api.pokemontcg.io/v2/cards/${set}${first}-${second}`);
        const data = await response.json();
        renderPokemonCard(data);
    } catch (error) {
        location.reload();
    }
}

function renderPokemonCard(pokemon) {
    const frontHTML = `
        <img class="pokemon-image" src="${pokemon.data.images.large}" alt="${pokemon.data.name}">
    `;
    const backHTML = `
        <img class="back-image" src="cardback.png" alt="Pokemon Card Back"> 
    `;

    document.getElementById('pokemon-card-front').innerHTML = frontHTML;
    document.getElementById('pokemon-card-back').innerHTML = backHTML;
}

fetchPokemonData(set, firstBaseNum, secondBaseNum);