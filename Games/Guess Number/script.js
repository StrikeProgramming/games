//BUTTONS
const startBtn = document.querySelector(".start-btn"),
  easy = document.getElementById("easy"),
  medium = document.getElementById("medium"),
  hard = document.getElementById("hard"),
  difficultyBtn = document.querySelectorAll(".difficulty-btn"),
  guessField = document.getElementById("guessField"),
  guessSubmit = document.querySelector(".guess-btn"),
  restartBtn = document.querySelector(".restart-btn");

//CONTAINERS
const container = document.querySelector(".container"),
  startContainer = document.querySelector(".start-container"),
  difficultyContainer = document.querySelector(".difficulty-container"),
  gameContainer = document.querySelector(".game-container"),
  messageContainer = document.querySelector(".message-container");

//MESSAGES
const numBetween = document.getElementById("numBetween"),
  result = document.getElementById("result"),
  successMessage = document.getElementById("successMessage"),
  failedMessage = document.getElementById("failedMessage"),
  almostMessage = document.getElementById("almostMessage");

/*=============== SET INITIAL ===============*/

let guessCount = 0;
let attempts;
let maxNumber;
let randomNumber;
let gameEnded = false;

/*=============== FUNCTIONS ===============*/

const handleGameStart = () => {
  startContainer.style.display = "none";
  difficultyContainer.style.display = "block";
};

const handleClick = (e) => {
  container.style.height = "500px";
  difficultyContainer.style.display = "none";
  gameContainer.style.display = "flex";
  messageContainer.style.display = "flex";

  // Difficulty
  const btn = e.target;
  if (btn === easy) {
    attempts = 10;
    maxNumber = 100;
    randomNumber = Math.floor(Math.random() * 100) + 1;
    numBetween.innerHTML = `Guess a number between 1 and ${maxNumber}:`;

    almostMessage.style.display = "block";
    almostMessage.innerHTML = `You have <span class="attempts">${attempts}</span> attempts`;
  } else if (btn === medium) {
    attempts = 12;
    maxNumber = 500;
    randomNumber = Math.floor(Math.random() * 500) + 1;
    numBetween.innerHTML = `Guess a number between 1 and ${maxNumber}:`;

    almostMessage.style.display = "block";
    almostMessage.innerHTML = `You have <span class="attempts">${attempts}</span> attempts`;
  } else if (btn === hard) {
    attempts = 15;
    maxNumber = 1000;
    randomNumber = Math.floor(Math.random() * 1000) + 1;
    numBetween.innerHTML = `Guess a number between 1 and ${maxNumber}:`;

    almostMessage.style.display = "block";
    almostMessage.innerHTML = `You have <span class="attempts">${attempts}</span> attempts`;
  }
};

checkGuess();

function checkGuess() {
  if (gameEnded) return;
  let userGuess = Number(guessField.value);
  guessCount++;
  attempts--;

  if (userGuess === randomNumber) {
    win();
  } else if (attempts <= 0) {
    lose();
  } else if (userGuess < randomNumber || userGuess > randomNumber) {
    result.textContent = userGuess < randomNumber ? `Too Low!` : `Too High!`;
    almostMessage.style.display = "block";

    almostMessage.innerHTML = `You have <span class="attempts">${attempts}</span> attempts left`;

    result.style.color = "red";
  }
  guessField.value = "";
  guessField.focus();
}

function win() {
  result.textContent = `Congratulations!`;
  gameContainer.style.display = "none";
  successMessage.style.display = "block";
  almostMessage.style.display = "none";
  restartBtn.style.display = "block";

  successMessage.innerHTML = `You guessed the correct number in <span class="guess-count">${
    guessCount - 1
  }</span> attempts!`;

  result.style.color = "green";

  guessField.disabled = true;
  guessSubmit.disabled = true;
  gameEnded = true;
  removeDifficultyBtnListeners();
}

function lose() {
  result.textContent = `Game Over!`;
  failedMessage.style.display = "block";
  almostMessage.style.display = "none";

  failedMessage.innerHTML = `The correct number was <span class="failed">${randomNumber}!</span>`;

  result.style.color = "red";

  guessField.disabled = true;
  guessSubmit.disabled = true;
  gameEnded = true;
  removeDifficultyBtnListeners();
}

function removeDifficultyBtnListeners() {
  difficultyBtn.forEach((btn) => {
    btn.removeEventListener("click", handleClick);
  });
}

const handleGameRestart = () => {
  location.reload();
};

/*=============== EVENT LISTENERS ===============*/

startBtn.addEventListener("click", handleGameStart);

difficultyBtn.forEach((btn) => {
  btn.addEventListener("click", handleClick);
});

guessSubmit.addEventListener("click", checkGuess);

restartBtn.addEventListener("click", handleGameRestart);
