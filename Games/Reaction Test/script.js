/*==================== START CONTAINER ====================*/

const container = document.querySelector(".container"),
  startBtn = document.querySelector(".start-btn");

/*==================== RESULTS CONTAINER ====================*/

const resultsWrapper = document.querySelector(".results-wrapper");

/*==================== SHAPE CONTAINER ====================*/

const shapeWrapper = document.querySelector(".shape-wrapper"),
  totalTime = document.querySelector(".time-taken"),
  shape = document.getElementById("shape");

/*==================== INITIAL SETUP ====================*/

let clicks = 0,
  score = 0,
  startTime = 0,
  start;

/*==================== FUNCTIONS ====================*/

const getRandomColor = () => {
  const color = "0123456789ABCDEF".split("");
  let hex = "#";

  for (let i = 0; i < 6; i++) {
    hex += color[Math.floor(Math.random() * 16)];
  }

  return hex;
};

const makeShapeAppear = () => {
  const top = Math.random() * 500,
    left = Math.random() * 600,
    width = Math.random() * 200 + 100;

  if (Math.random() > 0.5) {
    shape.style.borderRadius = "50%";
  } else {
    shape.style.borderRadius = "0";
  }

  shape.style.backgroundColor = getRandomColor();
  shape.style.top = top + "px";
  shape.style.left = left + "px";
  shape.style.width = width + "px";
  shape.style.height = width + "px";
  shape.style.display = "block";

  start = new Date().getTime();
};

const gameStart = () => {
  container.style.display = "none";
  shapeWrapper.style.display = "block";
  totalTime.style.display = "block";

  const appearAfterDelay = () => {
    setTimeout(() => {
      clicks < 10 ? makeShapeAppear() : endGame();
    }, Math.random() * 2000);
  };

  appearAfterDelay();

  shape.onclick = () => {
    const end = new Date().getTime();
    const yourTime = (end - start) / 1000;
    const timeTaken = document.getElementById("timeTaken");

    shape.style.display = "none";
    clicks++;

    timeTaken.innerHTML = yourTime + "s";

    if (yourTime < 0.5) {
      timeTaken.style.color = "green";
      score += 20;
    } else if (yourTime < 1) {
      timeTaken.style.color = "orange";
      score += 10;
    } else {
      timeTaken.style.color = "red";
    }

    appearAfterDelay();
  };
};

const endGame = () => {
  const yourScore = document.getElementById("yourScore");

  shapeWrapper.style.display = "none";
  resultsWrapper.style.display = "flex";
  yourScore.innerHTML = `${score}`;
  yourScore.style.color = "green";

  resetTimeout();
};

const resetPage = () => {
  container.style.display = "flex";
  resultsWrapper.style.display = "none";
  shapeWrapper.style.display = "none";

  clicks = 0;
  score = 0;
};

const resetTimeout = () => {
  setTimeout(resetPage, 5000);
};

/*==================== EVENT LISTENERS ====================*/

startBtn.addEventListener("click", gameStart);
