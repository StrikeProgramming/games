/*==================== INITIAL SETUP ====================*/

let timer, timeRemaining, lives, selectedNum, selectedTile, disableSelect;

/*==================== FUNCTIONS ====================*/

const startGame = () => {
  let board;
  // Set Difficulty
  if (id("diff-1").checked) board = easy[0];
  else if (id("diff-2").checked) board = medium[0];
  else board = hard[0];

  lives = 3;
  disableSelect = false;
  id("lives").textContent = "Lives Remaining: " + lives;

  generateBoard(board);
  startTimer();

  // Set Theme
  if (id("theme-1").checked) {
    qs("body").classList.remove("dark");
  } else {
    qs("body").classList.add("dark");
  }

  id("numberContainer").classList.remove("hidden");
};

function startTimer() {
  // Set Timer
  if (id("time-1").checked) timeRemaining = 300;
  else if (id("time-2").checked) timeRemaining = 600;
  else timeRemaining = 900;

  id("timer").textContent = timeConversion(timeRemaining);

  timer = setInterval(() => {
    timeRemaining--;
    if (timeRemaining === 0) endGame();
    id("timer").textContent = timeConversion(timeRemaining);
  }, 1000);
}

function timeConversion(time) {
  let mins = Math.floor(time / 60);
  if (mins < 10) mins = "0" + mins;
  let secs = time % 60;
  if (secs < 10) secs = "0" + secs;
  return "Time Remaining: " + mins + ":" + secs;
}

function generateBoard(board) {
  clearPrevious();

  let idCount = 0;

  //Create tiles
  for (let i = 0; i < 81; i++) {
    let tile = document.createElement("p");

    if (board.charAt(i) != "-") {
      tile.textContent = board.charAt(i);
    } else {
      tile.addEventListener("click", function () {
        if (!disableSelect) {
          if (tile.classList.contains("selected")) {
            tile.classList.remove("selected");
            selectedTile = null;
          } else {
            for (let i = 0; i < 81; i++) {
              qsa(".tile")[i].classList.remove("selected");
            }
            tile.classList.add("selected");
            selectedTile = tile;
            updateMove();
          }
        }
      });
    }

    tile.id = idCount;
    idCount++;
    tile.classList.add("tile");
    if ((tile.id > 17 && tile.id < 27) || (tile.id > 44 && tile.id < 54)) {
      tile.classList.add("bottom-border");
    }
    if ((tile.id + 1) % 9 == 3 || (tile.id + 1) % 9 == 6) {
      tile.classList.add("right-border");
    }

    id("board").appendChild(tile);
  }
}

function updateMove() {
  if (selectedTile && selectedNum) {
    selectedTile.textContent = selectedNum.textContent;

    if (checkCorrect(selectedTile)) {
      selectedTile.classList.remove("selected");
      selectedNum.classList.remove("selected");
      selectedNum = null;
      selectedTile = null;

      if (checkDone()) {
        endGame();
      }
    } else {
      disableSelect = true;
      selectedTile.classList.add("incorrect");

      setTimeout(() => {
        lives--;
        lives === 0
          ? endGame()
          : (id("lives").textContent = "Lives Remaining: " + lives);

        disableSelect = false;

        //Restore tile color
        selectedTile.classList.remove("incorrect");
        selectedTile.classList.remove("selected");
        selectedNum.classList.remove("selected");

        selectedTile.textContent = "";
        selectedTile = null;
        selectedNum = null;
      }, 1000);
    }
  }
}

function checkDone() {
  let tiles = qsa(".tile");
  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i].textContent === "") return false;
  }
  return true;
}

function endGame() {
  disableSelect = true;
  clearTimeout(timer);

  //Display Win or Loss message
  const isVictory = lives === 0 || timeRemaining === 0;
  const gameModal = qs(".game-modal");
  const modalText = isVictory
    ? "You failed! Try again!"
    : "You completed this game!";
  gameModal.querySelector("img").src = `images/${
    isVictory ? "lost" : "victory"
  }.gif`;
  gameModal.querySelector("h4").innerText = isVictory
    ? "Game Over!"
    : "Congrats!";
  gameModal.querySelector("p").innerHTML = `${modalText}`;
  gameModal.classList.add("show");

  qs(".play-again").addEventListener("click", function () {
    gameModal.classList.remove("show");
    clearGame();
  });
}

function clearGame() {
  clearPrevious();
  id("timer").textContent = "";
  id("lives").textContent = "";
  id("numberContainer").classList.add("hidden");
}

function checkCorrect(tile) {
  let solution;
  if (id("diff-1").checked) solution = easy[1];
  else if (id("diff-2").checked) solution = medium[1];
  else solution = hard[1];

  //If tile number equals solution
  if (solution.charAt(tile.id) === tile.textContent) return true;
  else return false;
}

function clearPrevious() {
  let tiles = qsa(".tile");

  for (let i = 0; i < tiles.length; i++) {
    tiles[i].remove();
  }

  if (timer) clearTimeout(timer);

  for (let i = 0; i < id("numberContainer").children.length; i++) {
    id("numberContainer").children[i].classList.remove("selected");
  }
  selectedTile = null;
  selectedNum = null;
}

window.onload = function () {
  id("startBtn").addEventListener("click", startGame);

  for (let i = 0; i < id("numberContainer").children.length; i++) {
    id("numberContainer").children[i].addEventListener("click", function () {
      //If selecting in not disabled
      if (!disableSelect) {
        //If number is selected
        if (this.classList.contains("selected")) {
          this.classList.remove("selected");
          selectedNum = null;
        } else {
          for (let i = 0; i < 9; i++) {
            id("numberContainer").children[i].classList.remove("selected");
          }
          this.classList.add("selected");
          selectedNum = this;
          updateMove();
        }
      }
    });
  }
};

/*==================== HELPER FUNCTIONS ====================*/

const id = (id) => {
  return document.getElementById(id);
};

const qs = (selector) => {
  return document.querySelector(selector);
};

const qsa = (selector) => {
  return document.querySelectorAll(selector);
};
