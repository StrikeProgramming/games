const gridContainer = document.querySelector(".grid-container");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = document.querySelector(".play-again");

/*==================== SET INITIAL ====================*/

let cards = [];
let firstCard, secondCard, timerInterval;
let lockBoard = false;
let score = 0;
let maxScore = 90;
let timer;

document.querySelector(".score").textContent = score;

/*================= FETCHING DATA FROM JSON FILE =================*/

fetch("./data/cards.json")
  .then((res) => res.json())
  .then((data) => {
    cards = [...data, ...data];
    shuffleCards();
    generateCards();
    startTimer();
  });

/*==================== FUNCTION ====================*/

// Timer Funtions
const updateTimerDisplay = () => {
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  const timerDisplay = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
  document.querySelector(".timer").textContent = timerDisplay;
};

const startTimer = () => {
  timer = 120;
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    timer--;
    updateTimerDisplay();
    if (timer <= 0) return gameOver(false);
  }, 1000);
};

//Card Functions
const shuffleCards = () => {
  let currentIndex = cards.length,
    randomIndex,
    temporaryValue;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
};

const generateCards = () => {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
      <div class="front">
        <img class="front-image" src=${card.image} />
      </div>
      <div class="back"></div>
    `;
    gridContainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
  }
};

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  document.querySelector(".score").textContent = score;
  lockBoard = true;

  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;

  if (isMatch) {
    score += 10;
    document.querySelector(".score").textContent = score;
    disableCards();
    if (score === maxScore) return gameOver(true);
  } else {
    unflipCards();
  }
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  resetBoard();
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

// END GAME FUNCTIONS
const gameOver = (isVictory) => {
  setTimeout(() => {
    const modalText = isVictory
      ? `You found all the matching cards!`
      : `You ran out of time. Try again!`;
    gameModal.querySelector("img").src = `assets/${
      isVictory ? "victory" : "lost"
    }.gif`;
    gameModal.querySelector("h4").innerText = isVictory
      ? "Congrats!"
      : "Game Over!";
    gameModal.querySelector("p").innerHTML = `${modalText}`;
    gameModal.classList.add("show");
    clearInterval(timerInterval);
    lockBoard = true;
  }, 300);
};

const restart = () => {
  resetBoard();
  shuffleCards();
  startTimer();
  score = 0;
  document.querySelector(".score").textContent = score;
  gridContainer.innerHTML = "";
  generateCards();
  gameModal.classList.remove("show");
};

/*==================== EVENT LISTENERS ====================*/

playAgainBtn.addEventListener("click", restart);
