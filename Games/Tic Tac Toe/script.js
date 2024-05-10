let playerText = document.getElementById("playerText"),
  restartBtn = document.getElementById("restartBtn"),
  boxes = Array.from(document.querySelectorAll(".box"));

let winnerIndicator = getComputedStyle(document.body).getPropertyValue(
  "--winning-blocks"
);

/*==================== INITIAL SETUP ====================*/

const O_TEXT = "O",
  X_TEXT = "X";
let currentPlayer = X_TEXT;
let spaces = Array(9).fill(null);

/*==================== FUNCTIONS ====================*/

const startGame = () => {
  boxes.forEach((box) => box.addEventListener("click", boxClicked));
};

function boxClicked(e) {
  if (playerHasWon() || spaces.every((space) => space !== null)) {
    return;
  }

  const id = e.target.id;

  if (!spaces[id]) {
    spaces[id] = currentPlayer;
    e.target.innerText = currentPlayer;

    if (playerHasWon()) {
      playerText.innerText = `${currentPlayer} has won!`;
      let winning_blocks = playerHasWon();

      winning_blocks.map(
        (box) => (boxes[box].style.backgroundColor = winnerIndicator)
      );
      return;
    }

    currentPlayer = currentPlayer == X_TEXT ? O_TEXT : X_TEXT;
  }
}

const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function playerHasWon() {
  for (const condition of winningCombos) {
    let [a, b, c] = condition;

    if (spaces[a] && spaces[a] == spaces[b] && spaces[a] == spaces[c]) {
      return [a, b, c];
    }
  }
  return false;
}

const restart = () => {
  spaces.fill(null);

  boxes.forEach((box) => {
    box.innerText = "";
    box.style.backgroundColor = "";
  });

  playerText.innerText = "Tic Tac Toe";

  currentPlayer = X_TEXT;
};

startGame();

/*==================== EVENT LISTENERS ====================*/

restartBtn.addEventListener("click", restart);
