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
let timeLeft = 0;

let firstCard = null;
let secondCard = null;
let lockBoard = false;

/*------------------------ Cached Element References ------------------------*/

const screenStart = document.getElementById("screen-start");
// console.log("start Screen", screenStart);
const screenGame = document.getElementById("screen-game");
// console.log("Game Screen", screenGame);

const inputName = document.getElementById("playerName");
// console.log("input", inputName);
const btnPlay = document.getElementById("btn-play");
// console.log("play button", btnPlay);
const btnHow = document.getElementById("btn-how");
// console.log("how to play button", btnHow);

const gameGrid = document.getElementById("game-grid");
//console.log("grid")

const overlayHow = document.getElementById("overlay-instructions");
// console.log(overlayHow);
const btnCloseHow = document.getElementById("btn-close-instructions");
// console.log(btnCloseHow);

//? Grab the Grid Container
//? Grab the Dashboard items (Timer, Score, Moves displays)
//? Grab all the Screens (Start, Game, Overlays)

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
  if (lockBoard) return;
  event.target.classList.add("flipped");

  if (!firstCard) {
    firstCard = event.target;
    // console.log(firstCard.dataset.pairId);
    return;
  }
  secondCard = event.target;
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
    cardElement.dataset.type = card.type;
    cardElement.textContent = card.value;
    gameGrid.appendChild(cardElement);
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

/*----------------------------win/loss condition----------------------------*/
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
