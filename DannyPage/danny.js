
document.getElementById('refreshButton').addEventListener('click', function () {
    // location.reload();
    renderPokemonCard(pokemon)
    fetchPokemonData(set, firstBaseNum, secondBaseNum);
});

let isDragging = false;
let startX = 0;
let rotateY = 0;
let currentPokemonData = null;

const pokeSets = ['base', 'bw', 'dp', 'dv', 'ecard', 'ex', 'gym', 'hgss', 'neo', 'pl', 'pop', 'sm', 'sv', 'swsh', 'xy', 'mcd', 'ru', 'si',];
const container = document.querySelector('.card-container');
const refreshButton = document.getElementById('refreshButton');

// Generate random card parameters
function getRandomCardParams() {
    return {
        set: pokeSets[Math.floor(Math.random() * pokeSets.length)],
        firstNum: Math.floor(Math.random() * 17),
        secondNum: Math.floor(Math.random() * 17)
    };
}

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
    e.preventDefault();
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
    snapRotation();
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
    snapRotation();
}

function snapRotation() {
    const normalizedRotation = ((rotateY % 360) + 360) % 360;
    rotateY = Math.round(normalizedRotation / 180) * 180;
    container.style.transform = `rotateY(${rotateY}deg)`;
}

async function fetchPokemonData(set, first, second) {
    try {
        document.getElementById('pokemon-card-front').innerHTML = `
            <div class="loading-container">
                <div class="pokeball"></div>
                <div style="color: #333;">Catching Pokemon...</div>
            </div>`;

        const response = await fetch(`https://api.pokemontcg.io/v2/cards/${set}${first}-${second}`);
        const data = await response.json();
        currentPokemonData = data;
        renderPokemonCard(data);
        return true;
    } catch (error) {
        console.log('Trying different card...');
        const newParams = getRandomCardParams();
        return fetchPokemonData(newParams.set, newParams.firstNum, newParams.secondNum);
    }
}

function renderPokemonCard(pokemon) {
    const price = pokemon.data.cardmarket?.prices?.averageSellPrice ||
        pokemon.data.tcgplayer?.prices?.holofoil?.market ||
        'N/A';

    const flavorText = pokemon.data.flavorText || 'The data didnt have this card entry my bad guys';

    const frontHTML = `
    
        <img class="pokemon-image" src="${pokemon.data.images.large}" alt="${pokemon.data.name}">
        <h1 style="color:red">$${typeof price === 'number' ? price.toFixed(2) : price}</h1>
    `;
    const backHTML = `
        <img class="back-image" src="cardback.png" alt="Pokemon Card Back"> 
    `;

    document.getElementById('pokemon-card-front').innerHTML = frontHTML;
    document.getElementById('pokemon-card-back').innerHTML = backHTML;

    // Reset rotation when new card is loaded
    rotateY = 0;
    container.style.transform = `rotateY(${rotateY}deg)`;
}

// Refresh button functionality
refreshButton.addEventListener('click', async () => {
    const newParams = getRandomCardParams();
    await fetchPokemonData(newParams.set, newParams.firstNum, newParams.secondNum);
});

// Initial load
const initialParams = getRandomCardParams();
fetchPokemonData(initialParams.set, initialParams.firstNum, initialParams.secondNum);