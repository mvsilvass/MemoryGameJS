const canvas = document.getElementById("game")
const ctx = canvas.getContext("2d")

const back_card = document.createElement('img');
back_card.src = 'assets/cards/back_card.png';

const selectClickSound = new Audio('assets/sounds/select_click.wav');
const gameOverSound = new Audio('assets/sounds/gameover.wav');

selectClickSound.volume = 0.2;
gameOverSound.volume = 1;

let gameOverSoundPlayed = false;

const MARGIN = 4;
const CANVAS_WIDTH = canvas.width - 2 * MARGIN;
const CANVAS_HEIGHT = canvas.height - 2 * MARGIN;

const COORDINATE_IMAGE = {
    'column1': [[MARGIN, MARGIN], [MARGIN + 138, MARGIN], [MARGIN + 276, MARGIN], [MARGIN + 414, MARGIN], [MARGIN + 552, MARGIN], [MARGIN + 690, MARGIN]],
    'column2': [[MARGIN, MARGIN + 138], [MARGIN + 138, MARGIN + 138], [MARGIN + 276, MARGIN + 138], [MARGIN + 414, MARGIN + 138], [MARGIN + 552, MARGIN + 138], [MARGIN + 690, MARGIN + 138]],
    'column3': [[MARGIN, MARGIN + 276], [MARGIN + 138, MARGIN + 276], [MARGIN + 276, MARGIN + 276], [MARGIN + 414, MARGIN + 276], [MARGIN + 552, MARGIN + 276], [MARGIN + 690, MARGIN + 276]],
    'column4': [[MARGIN, MARGIN + 414], [MARGIN + 138, MARGIN + 414], [MARGIN + 276, MARGIN + 414], [MARGIN + 414, MARGIN + 414], [MARGIN + 552, MARGIN + 414], [MARGIN + 690, MARGIN + 414]],
    'column5': [[MARGIN, MARGIN + 552], [MARGIN + 138, MARGIN + 552], [MARGIN + 276, MARGIN + 552], [MARGIN + 414, MARGIN + 552], [MARGIN + 552, MARGIN + 552], [MARGIN + 690, MARGIN + 552]]
};

const images = [];
for (let i = 1; i <= 15; i++) {
    const img = document.createElement('img');
    img.src = `assets/matching/${i}.png`;
    img.id = `img-${i}`;
    images.push(img);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function draw() {
    if (matchedCards.length === 30) {
        ctx.fillStyle = "steelblue";
        ctx.fillRect(0, 0, canvas.width, canvas.height); 
        
        if(!gameOverSoundPlayed){
            gameOverSound.play();
            gameOverSoundPlayed = true;
        }

        const victoryText = document.getElementById('victoryText');
        victoryText.style.display = 'block';
        
        showEndGameButtons();
    } else {
        ctx.fillStyle = "steelblue";
        ctx.fillRect(0, 0, canvas.width, canvas.height); 

        for (let column in COORDINATE_IMAGE) {
            COORDINATE_IMAGE[column].forEach(coord => {
                ctx.drawImage(back_card, coord[0], coord[1]);
            });
        }

        for (const card of cards) {
            if (card.revealed) { 
                ctx.drawImage(card.image, card.position[0], card.position[1]);
            }
        }
    }
    requestAnimationFrame(draw);
}

function initCards(shuffledImages) {
    let cards = [];

    let index = 0;
    for (let column in COORDINATE_IMAGE) {
        COORDINATE_IMAGE[column].forEach(coordinate => {
            let card = {
                image: shuffledImages[index],
                position: coordinate,
                revealed: false,
                matched: false,
                rect: { 
                    x: coordinate[0],
                    y: coordinate[1],
                    width: 125, 
                    height: 125
                }
            };
            index++;
            cards.push(card);
        });
    }
    return cards;
}

canvas.addEventListener('click', function (event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left; 
    const mouseY = event.clientY - rect.top; 

    for (const card of cards) {
        if (mouseX >= card.rect.x && mouseX <= card.rect.x + card.rect.width &&
            mouseY >= card.rect.y && mouseY <= card.rect.y + card.rect.height &&
            !card.revealed && !card.matched && flippedCards.length < 2) {
            card.revealed = true; 
            flippedCards.push(card); 
            checkMatch(); 

            selectClickSound.currentTime = 0;
            selectClickSound.play(); 
        }
    }
});

function checkMatch() {
    if (flippedCards.length === 2) {
        if (flippedCards[0].image.id === flippedCards[1].image.id) {
            flippedCards[0].matched = true;
            flippedCards[1].matched = true;
            matchedCards.push(flippedCards[0]);
            matchedCards.push(flippedCards[1]);
            flippedCards = [];

        } else {
            setTimeout(() => {
                for (const card of flippedCards) {
                    card.revealed = false;
                }
                flippedCards = [];
            }, 500);
        }
    }
}

function showEndGameButtons() {
    const restartButton = document.getElementById('restartButton');
    const homeButton = document.getElementById('homeButton');

    restartButton.style.display = 'block';
    homeButton.style.display = 'block';

    restartButton.style.left = `${canvas.offsetLeft + CANVAS_WIDTH / 2 - 50}px`;
    restartButton.style.top = `${canvas.offsetTop + CANVAS_HEIGHT / 2 + 70}px`;

    homeButton.style.left = `${canvas.offsetLeft + CANVAS_WIDTH / 2 + 50}px`;
    homeButton.style.top = `${canvas.offsetTop + CANVAS_HEIGHT / 2 + 70}px`;

    restartButton.addEventListener('click', () => {
        location.reload(); 
    });

    homeButton.addEventListener('click', () => {
        window.location.href = 'teste.html'; // colocar a 
    });
}

let flippedCards = [];
let matchedCards = [];
const duplicatedImages = [...images, ...images];
const shuffledImages = shuffle(duplicatedImages);
const cards = initCards(shuffledImages); 

draw();