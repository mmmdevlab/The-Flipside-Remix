import * as GameData from "./data.js";

// console.log(GameData.levels);
// console.log(GameData.personas);
// console.log(GameData.buttonMenu);

/*-------------------------------- Constants --------------------------------*/

/*---------------------------- Variables (state) ----------------------------*/

let playerName = "Guest";

let currentLevel = 0;
let score = 0;
let moves = 0;
let timer = 0;
let timeLeft = null;
let timerInterval = null;

let firstCard = null;
let secondCard = null;
let lockBoard = false;

let consecutiveMatches = 0;

/*------------------------ Cached Element References ------------------------*/

const screenStart = document.getElementById("screen-start");
// console.log("start Screen", screenStart);
const screenGame = document.getElementById("screen-game");
// console.log("Game Screen", screenGame);
const gameGrid = document.getElementById("game-grid");
//console.log("grid")

const inputName = document.getElementById("playerName");
// console.log("input", inputName);
const btnPlay = document.getElementById("btn-play");
// console.log("play button", btnPlay);
const btnHow = document.getElementById("btn-how");
// console.log("how to play button", btnHow);

const overlayHow = document.getElementById("overlay-instructions");
// console.log(overlayHow);
const btnCloseHow = document.getElementById("btn-close-instructions");
// console.log(btnCloseHow);

const levelDisplay = document.getElementById("level-display");
console.log(levelDisplay);
const timerDisplay = document.getElementById("timer-display");
console.log(timerDisplay);
const scoreDisplay = document.getElementById("score-display");
console.log(scoreDisplay);
const movesDisplay = document.getElementById("moves-display");
console.log(movesDisplay);

//? Grab all the Screens (win Overlay, loss overlay, victory (all levels complete overlay, persona overlay))
//? one thing to add on which i forgot - before the level game start i wanted to pop up stating the time they have to complete the level overlay.

/*---------------------------- Functions (Game) ----------------------------*/

/*----------------------------shuffle function----------------------------*/
const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
  }
  return array;
};

/*----------------------------flip card----------------------------*/
const flipCard = (event) => {
  const card = event.target.closest(".card");
  if (lockBoard) return;

  if (timerInterval === null) {
    console.log("First card clicked! Starting the countdown");
    startCountdown(timeLeft);
  }

  if (!firstCard) {
    card.classList.add("flipped");
    firstCard = card;
    // console.log(firstCard.dataset.pairId);
    return;
  }

  card.classList.add("flipped");
  secondCard = card;
  // console.log(secondCard.dataset.pairId);
  lockBoard = true;
  // console.log(lockBoard);
  checkForMatch();
};

/*----------------------------check for match----------------------------*/
const checkForMatch = () => {
  if (firstCard.dataset.pairId === secondCard.dataset.pairId) {
    // console.log("matched", firstCard.dataset.pairId); // print match
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);
    firstCard = null;
    secondCard = null;
    lockBoard = false;
  } else {
    // console.log("no match", firstCard.dataset.pairId); // print no match
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      firstCard = null;
      secondCard = null;
      lockBoard = false;
    }, 1000);
  }
  moves++;
  console.log("moves:", moves); // print the moves count
};

/*----------------------------render the board----------------------------*/
const renderBoard = (cards, level) => {
  gameGrid.innerHTML = "";
  gameGrid.style.gridTemplateColumns = `repeat(${level.cols}, 1fr)`;
  gameGrid.style.gridTemplateRows = `repeat(${level.rows}, 1fr)`;

  cards.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.dataset.pairId = card.pairId;

    const cardFront = document.createElement("div");
    cardFront.classList.add("card-front");
    cardFront.innerHTML = `<svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        fill="#ffffff"
        viewBox="0 0 256 256"
      >
        <path d="M212.92,17.69a8,8,0,0,0-6.86-1.45l-128,32A8,8,0,0,0,72,56V166.08A36,36,0,1,0,88,196V110.25l112-28v51.83A36,36,0,1,0,216,164V24A8,8,0,0,0,212.92,17.69ZM52,216a20,20,0,1,1,20-20A20,20,0,0,1,52,216ZM88,93.75V62.25l112-28v31.5ZM180,184a20,20,0,1,1,20-20A20,20,0,0,1,180,184Z"></path>
      </svg>`;

    const cardBack = document.createElement("div");
    cardBack.classList.add("card-back");
    cardBack.textContent = card.value;

    cardElement.appendChild(cardFront);
    cardElement.appendChild(cardBack);
    gameGrid.appendChild(cardElement);
    // console.log(cardElement);
    cardElement.addEventListener("click", flipCard);
  });
};

/*----------------------------start the game----------------------------*/
const startGame = () => {
  const typedName = inputName.value.trim();
  if (typedName !== "") {
    playerName = typedName;
  } else {
    playerName = "Guest";
  }
  // console.log(playerName);

  screenStart.classList.add("hidden");
  screenGame.classList.remove("hidden");

  // console.log(GameData.levels[0]); // does level 1 print?
  // console.log(GameData.levels[0].matchPairs); // do the pairs print?

  const level = GameData.levels[currentLevel];
  // console.log(currentLevel);
  timeLeft = level.timeLimit;
  timerDisplay.textContent = timeLeft;
  timerInterval = null;
  console.log(`You have ${timeLeft} seconds to complete this level`);

  const cards = [];

  GameData.levels[currentLevel].matchPairs.forEach((pair) => {
    cards.push({ type: "artist", value: pair.artist, pairId: pair.artist });
    cards.push({ type: "title", value: pair.title, pairId: pair.artist });
  });
  // console.log(cards);
  const shuffled = shuffle(cards);
  // console.log(shuffled);
  renderBoard(shuffled, level);
};

/*----------------------------score panel----------------------------*/
//timer
const startCountdown = (seconds) => {
  timeLeft = seconds;

  timerDisplay.textContent = timeLeft;

  timerInterval = window.setInterval(() => {
    timeLeft = timeLeft - 1;
    timerDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      stopTimer();
      console.log("GameOver"); // update with my dialog loss overlay
    }
  }, 1000);
};
const stopTimer = () => {
  window.clearInterval(timerInterval);
};

//moves

//score

//
/*----------------------------win/loss condition----------------------------*/

// to add a stoptimer() when a win happens before the time runs out

/*----------------------------stats update----------------------------*/
/*----------------------------mid-game shuffle feature----------------------------*/

//? add audio object [cardClick, correctMatch, winLevelSound, lossLevelSound,]
//? help function called playSound to trigger when interacted -

/*----------------------------- Event Listeners -----------------------------*/

/* adding click to 'PLAY' button */
btnPlay.addEventListener("click", startGame);
inputName.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    startGame();
  }
});

/* adding click to 'HOW TO PLAY' button  */
btnHow.addEventListener("click", () => {
  overlayHow.showModal();
});
btnCloseHow.addEventListener("click", () => {
  overlayHow.close();
});

//? Button Triggers:
//? Board Triggers:
