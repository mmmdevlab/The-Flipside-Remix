import * as GameData from "./data.js";
import { playSound } from "./soundEffects.js";

/*-------------------------------- Constants --------------------------------*/

/*---------------------------- Variables (state) ----------------------------*/

let playerName = "Guest";

let currentLevel = 0;
let score = 0;
let totalScore = 0;
let moves = 0;
let totalMoves = 0;
let timeLeft = 0;
let timerInterval = null;
let totalTimeSaved = 0;

let firstCard = null;
let secondCard = null;
let lockBoard = false;

let consecutiveMatches = 0;
let matchedPairs = 0;

/*------------------------ Cached Element References ------------------------*/

const screenStart = document.getElementById("screen-start");
const screenGame = document.getElementById("screen-game");
const gameGrid = document.getElementById("game-grid");

const startForm = document.getElementById("start-form");
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

const overlayLevelStart = document.getElementById("overlay-level-start");
const startLevelName = document.getElementById("start-level-name");
const startTimeLimit = document.getElementById("start-time-limit");
const startPlayerName = document.getElementById("start-player-name");

const levelDisplay = document.getElementById("level-display");
const timerDisplay = document.getElementById("timer-display");
const scoreDisplay = document.getElementById("score-display");
const movesDisplay = document.getElementById("moves-display");

const overlayWin = document.getElementById("overlay-win");
const winScore = document.getElementById("win-score");
const winMoves = document.getElementById("win-moves");
const winLevel = document.getElementById("win-level");
const winTime = document.getElementById("win-time");
const winPlayerName = document.getElementById("win-player-name");
const winBonus = document.getElementById("win-bonus");

const overlayLoss = document.getElementById("overlay-loss");
const lossScore = document.getElementById("loss-score");
const lossMoves = document.getElementById("loss-moves");
const lossLevel = document.getElementById("loss-level");
const lossPlayerName = document.getElementById("loss-player-name");

const overlayVictory = document.getElementById("overlay-complete");
const completePlayerName = document.getElementById("complete-player-name");
const completeScore = document.getElementById("complete-score");
const completeMoves = document.getElementById("complete-moves");
const completeTimeSaved = document.getElementById("complete-time-saved");

const overlayResults = document.getElementById("overlay-persona");
const btnShowResults = document.getElementById("btn-show-results");

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
  if (card.classList.contains("matched")) return;

  playSound("click");

  if (timerInterval === null) {
    startCountdown(timeLeft);
  }

  if (!firstCard) {
    card.classList.add("flipped");
    firstCard = card;
    return;
  }

  if (card === firstCard) return;
  card.classList.add("flipped");
  secondCard = card;
  lockBoard = true;

  checkForMatch();
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
    cardFront.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#ffffff" viewBox="0 0 256 256">
  <path d="M212.92,17.69a8,8,0,0,0-6.86-1.45l-128,32A8,8,0,0,0,72,56V166.08A36,36,0,1,0,88,196V110.25l112-28v51.83A36,36,0,1,0,216,164V24A8,8,0,0,0,212.92,17.69ZM52,216a20,20,0,1,1,20-20A20,20,0,0,1,52,216ZM88,93.75V62.25l112-28v31.5ZM180,184a20,20,0,1,1,20-20A20,20,0,0,1,180,184Z"></path>
</svg>`;

    const cardBack = document.createElement("div");
    cardBack.classList.add("card-back");
    cardBack.textContent = card.value;

    if (card.type === "artist") {
      cardElement.classList.add("card-artist");
      cardBack.classList.add("card-artist");
    } else {
      cardElement.classList.add("card-title");
      cardBack.classList.add("card-title");
    }

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
  playerName = typedName !== "" ? typedName : "Guest";

  const level = GameData.levels[currentLevel];
  timeLeft = level.timeLimit;

  screenStart.classList.add("hidden");
  screenGame.classList.remove("hidden");

  levelDisplay.textContent = currentLevel + 1;
  score = 0;
  timerDisplay.textContent = timeLeft;
  scoreDisplay.textContent = score;
  moves = 0;
  movesDisplay.textContent = moves;

  stopTimer();
  timerInterval = null;
  matchedPairs = 0;
  consecutiveMatches = 0;
  lockBoard = true;

  const cards = [];
  level.matchPairs.forEach((pair) => {
    cards.push({ type: "artist", value: pair.artist, pairId: pair.artist });
    cards.push({ type: "title", value: pair.title, pairId: pair.artist });
  });

  renderBoard(shuffle(cards), level);

  startLevelName.textContent = `Level ${currentLevel + 1}`;
  startTimeLimit.textContent = level.timeLimit;
  startPlayerName.textContent = playerName;
  overlayLevelStart.showModal();

  setTimeout(() => {
    overlayLevelStart.close();
    setTimeout(() => {
      lockBoard = false;
    }, 100);
  }, 2000);
};

/*check for match----------------------------*/
const checkForMatch = () => {
  updateMoves();

  if (firstCard.dataset.pairId === secondCard.dataset.pairId) {
    //match
    matchedPairs++;
    playSound("match");
    updateScore();

    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);

    const matchedFirst = firstCard;
    const matchedSecond = secondCard;

    setTimeout(() => {
      matchedFirst.classList.add("matched");
      matchedSecond.classList.add("matched");
    }, 100);

    firstCard = null;
    secondCard = null;
    lockBoard = false;

    checkWin();
  } else {
    //no match
    consecutiveMatches = 0;
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      firstCard = null;
      secondCard = null;
      lockBoard = false;
    }, 1000);
  }
};

/*win&loss condition----------------------------*/
const checkWin = () => {
  const totalPairs = GameData.levels[currentLevel].matchPairs.length;
  if (matchedPairs === totalPairs) {
    stopTimer();

    const bonus = calEfficiencyBonus();
    // const baseScore = score;

    winBonus.textContent = `+${bonus}`;
    score += bonus;
    winScore.textContent = score;
    scoreDisplay.textContent = score;

    setTimeout(() => {
      if (currentLevel + 1 >= GameData.levels.length) {
        playSound("victory");
        totalScore += score;
        totalMoves += moves;
        totalTimeSaved += timeLeft;
        showFinalVictory();
      } else {
        playSound("winLevel");
        showWin();
      }
    }, 600);
  }
};

const showWin = () => {
  winPlayerName.textContent = playerName;
  winLevel.textContent = `Level ${currentLevel + 1}`;
  winMoves.textContent = moves;
  winTime.textContent = timeLeft;
  overlayWin.showModal();
};

const showLoss = () => {
  lossPlayerName.textContent = playerName;
  lossLevel.textContent = `Level ${currentLevel + 1}`;
  lossScore.textContent = score;
  lossMoves.textContent = moves;
  overlayLoss.showModal();
};

const nextLevel = () => {
  totalScore += score;
  totalMoves += moves;
  totalTimeSaved += timeLeft;

  currentLevel++;
  overlayWin.close();
  startGame();
};

/*score panel----------------------------*/
const resetState = () => {
  currentLevel = 0;
  totalScore = 0;
  totalMoves = 0;
  totalTimeSaved = 0;
  firstCard = null;
  secondCard = null;
  lockBoard = false;
};

const resetGame = () => {
  if (overlayWin.open) overlayWin.close();
  if (overlayLoss.open) overlayLoss.close();
  resetState();
  startGame();
};

const tryAgain = () => {
  if (overlayLoss.open) overlayLoss.close();

  firstCard = null;
  secondCard = null;
  lockBoard = false;
  timerInterval = null;
  consecutiveMatches = 0;

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

    const levelData = GameData.levels[currentLevel];

    if (levelData.hasShuffle) {
      if (currentLevel === 1 && timeLeft === 45) {
        midGameShuffle();
      }
      if (currentLevel === 2) {
        if (timeLeft === 80 || timeLeft === 40) {
          midGameShuffle();
        }
      }
    }
    if (timeLeft <= 0) {
      stopTimer();
      lockBoard = true;
      playSound("loss");
      showLoss();
    }
  }, 1000);
};

const stopTimer = () => {
  window.clearInterval(timerInterval);
  timerInterval = null;
};

//moves
const updateMoves = () => {
  moves++;
  movesDisplay.textContent = moves;
};

//score
const updateScore = () => {
  consecutiveMatches++;
  let points = GameData.scoringRules.pointPerMatch;
  const level = GameData.levels[currentLevel];

  if (level.hasCombo && consecutiveMatches > 1) {
    points = points * GameData.scoringRules.comboMultiplier;
  }

  score += points;
  scoreDisplay.textContent = score;
};

//get total max score
const maxPossibleScore = () => {
  let max = 0;
  GameData.levels.forEach((level) => {
    const pairs = level.matchPairs.length;
    const ppm = GameData.scoringRules.pointPerMatch;
    const combo = GameData.scoringRules.comboMultiplier;

    if (level.hasCombo) {
      max += ppm + (pairs - 1) * ppm * combo;
    } else {
      max += pairs * ppm;
    }

    max += GameData.scoringRules.efficiencyBonus.perfect;
  });
  return max;
};

const calEfficiencyBonus = () => {
  const level = GameData.levels[currentLevel];
  const minMoves = level.matchPairs.length;

  const extraMoves = moves - minMoves;
  const { efficiencyBonus, efficiencyThresholds } = GameData.scoringRules;

  if (extraMoves <= efficiencyThresholds.perfect)
    return efficiencyBonus.perfect;
  if (extraMoves <= efficiencyThresholds.great) return efficiencyBonus.great;
  if (extraMoves <= efficiencyThresholds.good) return efficiencyBonus.good;

  return 0;
};

//victory
const showFinalVictory = () => {
  completePlayerName.textContent = playerName;

  document.getElementById("complete-level-score").textContent = score;
  document.getElementById("complete-level-moves").textContent = moves;
  document.getElementById("complete-level-time").textContent = timeLeft;

  completeScore.textContent = totalScore;
  completeMoves.textContent = totalMoves;
  completeTimeSaved.textContent = totalTimeSaved;

  overlayVictory.showModal();
};

//check score to persona
const getPersona = (totalScore) => {
  const maxScore = maxPossibleScore();
  const percentage = (totalScore / maxScore) * 100;

  const sorted = [...GameData.personas].sort(
    (a, b) => b.minPercentage - a.minPercentage,
  );
  return sorted.find((persona) => percentage >= persona.minPercentage);
};

//overlay persona
const showPersona = () => {
  const persona = getPersona(totalScore);

  const resultsContainer = document.getElementById("results-points");
  resultsContainer.innerHTML = "";

  const personaCard = document.createElement("div");
  personaCard.classList.add("persona-card");

  const personaName = document.createElement("h4");
  personaName.classList.add("persona-label");
  personaName.textContent = persona.name;

  const personaImg = document.createElement("img");
  personaImg.classList.add("persona-img");
  personaImg.src = persona.img;
  personaImg.alt = persona.name;

  const personaMessage = document.createElement("p");
  personaMessage.classList.add("persona-message");
  personaMessage.textContent = persona.message;

  const personaDescription = document.createElement("p");
  personaDescription.classList.add("persona-description");
  personaDescription.textContent = persona.description;

  personaCard.appendChild(personaImg);
  personaCard.appendChild(personaName);
  personaCard.appendChild(personaMessage);
  personaCard.appendChild(personaDescription);

  resultsContainer.appendChild(personaCard);
};

/*mid-game shuffle feature----------------------------*/

const midGameShuffle = () => {
  const allCards = Array.from(document.querySelectorAll(".card"));

  const eligibleCards = allCards.filter(
    (card) =>
      !card.classList.contains("matched") &&
      card !== firstCard &&
      card !== secondCard,
  );
  for (let i = eligibleCards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    const tempNextSibling = eligibleCards[i].nextSibling;
    eligibleCards[i].parentNode.insertBefore(
      eligibleCards[i],
      eligibleCards[j],
    );
    eligibleCards[j].parentNode.insertBefore(eligibleCards[j], tempNextSibling);
  }

  eligibleCards.forEach((card) => {
    card.classList.add("shuffling");
    setTimeout(() => card.classList.remove("shuffling"), 500);
  });
};

/*----------------------------- Event Listeners -----------------------------*/

startForm.addEventListener("submit", (event) => {
  event.preventDefault();
  startGame();
});

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
  resetState();
  playerName = "Guest";
  inputName.value = "";
  screenGame.classList.add("hidden");
  screenStart.classList.remove("hidden");
});
