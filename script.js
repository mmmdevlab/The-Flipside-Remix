import * as GameData from "./data.js";

// console.log(GameData.levels);
// console.log(GameData.personas);
// console.log(GameData.buttonMenu);

/*-------------------------------- Constants --------------------------------*/

/*---------------------------- Variables (state) ----------------------------*/

let playerName = "Guest";

let currentLevel = 0;
let score = 0;
let totalScore = 0;
let moves = 0;
let timer = 0;
let timeLeft = 0;
let timerInterval = null;

let firstCard = null;
let secondCard = null;
let lockBoard = false;

let consecutiveMatches = 0;
let matchedPairs = 0;

/*------------------------ Cached Element References ------------------------*/

const screenStart = document.getElementById("screen-start");
const screenGame = document.getElementById("screen-game");
const gameGrid = document.getElementById("game-grid");

const inputName = document.getElementById("playerName");
const btnPlay = document.getElementById("btn-play");
const btnHow = document.getElementById("btn-how");

const btnHowHeader = document.getElementById("btn-how-header");
const btnReset = document.getElementById("btn-reset");
const btnHome = document.getElementById("btn-home");

const btnTryAgain = document.getElementById("btn-try-again");
const btnNextLevel = document.getElementById("btn-next-level");

const overlayHow = document.getElementById("overlay-instructions");
const btnCloseHow = document.getElementById("btn-close-instructions");

const levelDisplay = document.getElementById("level-display");
const timerDisplay = document.getElementById("timer-display");
const scoreDisplay = document.getElementById("score-display");
const movesDisplay = document.getElementById("moves-display");

const overlayLoss = document.getElementById("overlay-loss");
const lossScore = document.getElementById("loss-score");
const lossMoves = document.getElementById("loss-moves");
const winLevel = document.getElementById("win-level");
const winPlayerName = document.getElementById("win-player-name");

const overlayWin = document.getElementById("overlay-win");
const winScore = document.getElementById("win-score");
const winMoves = document.getElementById("win-moves");
const lossLevel = document.getElementById("loss-level");
const lossPlayerName = document.getElementById("loss-player-name");

const overlayVictory = document.getElementById("overlay-complete");
const completePlayerName = document.getElementById("complete-player-name");
const completeScore = document.getElementById("complete-score");
const completeMoves = document.getElementById("complete-moves");
const overlayResults = document.getElementById("overlay-persona");
const btnShowResults = document.getElementById("btn-show-results");

//? one thing to add on which i forgot - before the level game start i wanted to pop up stating the time they have to complete the level overlay.

/*---------------------------- Functions (Game) ----------------------------*/

/*shuffle function----------------------------*/
const shuffle = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[randomIndex]] = [newArray[randomIndex], newArray[i]];
  }
  return newArray;
};

/*flip card----------------------------*/
const flipCard = (event) => {
  const card = event.target.closest(".card");
  if (lockBoard) return;

  if (timerInterval === null) {
    // console.log("First card clicked! Starting the countdown");
    startCountdown(timeLeft);
  }

  if (!firstCard) {
    card.classList.add("flipped");
    firstCard = card;
    // console.log(firstCard.dataset.pairId);
    return;
  }
  if (card === firstCard) return;
  card.classList.add("flipped");
  secondCard = card;
  // console.log(secondCard.dataset.pairId);
  lockBoard = true;
  // console.log(lockBoard);
  checkForMatch();
};

/*check for match----------------------------*/
const checkForMatch = () => {
  if (firstCard.dataset.pairId === secondCard.dataset.pairId) {
    // console.log("matched", firstCard.dataset.pairId); // print match
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    matchedPairs++;
    updateScore();
    checkWin();
  } else {
    // console.log("no match", firstCard.dataset.pairId); // print no match
    consecutiveMatches = 0;
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      firstCard = null;
      secondCard = null;
      lockBoard = false;
    }, 1000);
  }

  updateMoves();
  // console.log("moves:", moves); // print the moves count
};

/*render the board----------------------------*/
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

/*start the game----------------------------*/
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
  stopTimer();
  timerInterval = null;
  matchedPairs = 0;
  consecutiveMatches = 0;
  score = 0;
  scoreDisplay.textContent = 0;
  // console.log(`You have ${timeLeft} seconds to complete this level`);

  const cards = [];

  GameData.levels[currentLevel].matchPairs.forEach((pair) => {
    cards.push({ type: "artist", value: pair.artist, pairId: pair.artist });
    cards.push({ type: "title", value: pair.title, pairId: pair.artist });
  });
  // console.log(cards);
  const shuffled = shuffle(cards);
  // console.log(shuffled);
  renderBoard(shuffled, level);

  moves = 0;
  movesDisplay.textContent = moves;
  levelDisplay.textContent = currentLevel + 1;
};

const nextLevel = () => {
  if (currentLevel + 1 >= GameData.levels.length) {
    overlayWin.close();
    overlayVictory.showModal();
    return;
  }
  currentLevel++;
  overlayWin.close();
  startGame();
};

/*win&loss condition----------------------------*/
const checkWin = () => {
  const totalPairs = GameData.levels[currentLevel].matchPairs.length;
  if (matchedPairs === totalPairs) {
    stopTimer();

    if (currentLevel + 1 >= GameData.levels.length) {
      showVictory();
    } else {
      showWin();
    }
  }
};

const showWin = () => {
  winPlayerName.textContent = playerName;
  winLevel.textContent = `Level ${currentLevel + 1}`;
  winScore.textContent = score;
  winMoves.textContent = moves;
  overlayWin.showModal();
};

const showLoss = () => {
  lossPlayerName.textContent = playerName;
  lossLevel.textContent = `Level ${currentLevel + 1}`;
  lossScore.textContent = score;
  lossMoves.textContent = moves;
  overlayLoss.showModal();
};

/*score panel----------------------------*/

const resetGame = () => {
  if (overlayWin.open) overlayWin.close();
  if (overlayLoss.open) overlayLoss.close();

  currentLevel = 0;
  totalScore = 0;

  firstCard = null;
  secondCard = null;
  lockBoard = false;

  startGame();
};

const tryAgain = () => {
  if (overlayLoss.open) overlayLoss.close();
  totalScore -= score;

  firstCard = null;
  secondCard = null;
  lockBoard = false;

  startGame();
};

/*stats update----------------------------*/

//timer
const startCountdown = (seconds) => {
  timeLeft = seconds;

  timerDisplay.textContent = timeLeft;

  timerInterval = window.setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      stopTimer();
      lockBoard = true;
      showLoss();
    }
  }, 1000);
};
const stopTimer = () => {
  window.clearInterval(timerInterval);
};

//moves
const updateMoves = () => {
  moves++;
  movesDisplay.textContent = moves;
  // console.log(updateMoves);
};

//score
const updateScore = () => {
  consecutiveMatches++;

  let points = GameData.scoringRules.pointPerMatch;

  const level = GameData.levels[currentLevel];

  if (level.hasCombo && consecutiveMatches > 1) {
    points = points * GameData.scoringRules.comboMultiplier;
    // console.log("Combo! 2X points");
  }
  score += points;
  totalScore += points;
  scoreDisplay.textContent = score;
  // console.log(updateScore);
};
//get total max score
const maxPossibleScore = () => {
  let totalPairs = 0;
  GameData.levels.forEach((level) => {
    totalPairs += level.matchPairs.length;
  });
  return totalPairs * GameData.scoringRules.pointPerMatch;
};

//victory
const showVictory = () => {
  completePlayerName.textContent = playerName;
  completeScore.textContent = totalScore;
  completeMoves.textContent = moves;
  overlayVictory.showModal();
};

//check score to persona
const getPersona = (totalScore) => {
  const maxScore = maxPossibleScore();
  const percentage = (totalScore / maxScore) * 100;

  return GameData.personas.find(
    (persona) => percentage >= persona.minPercentage,
  );
};

//overlay persona
const showPersona = () => {
  const persona = getPersona(totalScore);

  const resultsContainer = document.getElementById("results-points");
  resultsContainer.innerHTML = "";

  const personaCard = document.createElement("div");
  personaCard.classList.add("persona-card");

  const personaImg = document.createElement("img");
  personaImg.classList.add("persona-img");
  personaImg.src = persona.img;
  personaImg.alt = persona.name;

  const personaName = document.createElement("h4");
  personaName.classList.add("persona-label");
  personaName.textContent = persona.name;

  const personaMessage = document.createElement("p1");
  personaMessage.classList.add("persona-message");
  personaMessage.textContent = persona.message;

  const personaDescription = document.createElement("p2");
  personaDescription.classList.add("persona-description");
  personaDescription.textContent = persona.description;

  personaCard.appendChild(personaImg);
  personaCard.appendChild(personaName);
  personaCard.appendChild(personaMessage);
  personaCard.appendChild(personaDescription);

  resultsContainer.appendChild(personaCard);
};
// to add a stoptimer() when a win happens before the time runs out

/*mid-game shuffle feature----------------------------*/

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
btnHowHeader.addEventListener("click", () => {
  overlayHow.showModal();
});

btnReset.addEventListener("click", resetGame);

btnTryAgain.addEventListener("click", tryAgain);
btnNextLevel.addEventListener("click", nextLevel);

btnShowResults.addEventListener("click", () => {
  overlayVictory.close();
  showPersona();
  overlayResults.showModal();
});

btnHome.addEventListener("click", () => {
  overlayResults.close();
  currentLevel = 0;
  totalScore = 0;
  screenGame.classList.add("hidden");
  screenStart.classList.remove("hidden");
});
