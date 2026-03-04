import * as GameData from "./data.js";
import { playSound } from "./soundEffects.js";

let playerName = "Guest";

let currentLevel = 0;
let score = 0;
let moves = 0;
let timeLeft = 0;
let timerInterval = null;

let totalScore = 0;
let totalMoves = 0;
let totalBonus = 0;
let totalTimeSaved = 0;

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let consecutiveMatches = 0;
let matchedPairs = 0;

const screenStart = document.getElementById("screen-start");
const screenGame = document.getElementById("screen-game");
const gameGrid = document.getElementById("game-grid");

const startForm = document.getElementById("start-form");
const inputName = document.getElementById("playerName");
const btnHow = document.getElementById("btn-how");

const btnHowHeader = document.getElementById("btn-how-header");
const btnReset = document.getElementById("btn-reset");
const btnHome = document.getElementById("btn-home");

const btnTryAgain = document.getElementById("btn-try-again");
const btnNextLevel = document.getElementById("btn-next-level");

const levelDisplay = document.getElementById("level-display");
const timerDisplay = document.getElementById("timer-display");
const scoreDisplay = document.getElementById("score-display");
const movesDisplay = document.getElementById("moves-display");

const overlayHow = document.getElementById("overlay-instructions");
const btnCloseHow = document.getElementById("btn-close-instructions");

const overlayLevelStart = document.getElementById("overlay-level-start");
const startLevelName = document.getElementById("start-level-name");
const startTimeLimit = document.getElementById("start-time-limit");
const startPlayerName = document.getElementById("start-player-name");

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
const completeScore = document.getElementById("complete-score");
const completeMoves = document.getElementById("complete-moves");
const completeBonus = document.getElementById("complete-bonus");
const completePlayerName = document.getElementById("complete-player-name");
const completeTimeSaved = document.getElementById("complete-time-saved");

const overlayResults = document.getElementById("overlay-persona");
const btnShowResults = document.getElementById("btn-show-results");

const shuffle = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[randomIndex]] = [newArray[randomIndex], newArray[i]];
  }
  return newArray;
};

const minPossibleScore = () => {
  return GameData.levels.reduce((total, level) => {
    return (
      total + level.matchPairs.length * GameData.scoringRules.pointPerMatch
    );
  }, 0);
};

const maxPossibleScore = () => {
  let max = 0;
  GameData.levels.forEach((level) => {
    const pairs = level.matchPairs.length;
    const ppm = GameData.scoringRules.pointPerMatch;
    const bonus = GameData.scoringRules.streakBonus;
    max += pairs * ppm;
    max += (pairs - 1) * bonus;
  });
  return max;
};
const minScore = minPossibleScore();
const maxScore = maxPossibleScore();

const getPersona = (totalScore, maxScore, minScore) => {
  const range = maxScore - minScore;
  const percentage = Math.round(((totalScore - minScore) / range) * 100);
  const sorted = [...GameData.personas].sort(
    (a, b) => b.minPercentage - a.minPercentage,
  );
  return sorted.find((persona) => percentage >= persona.minPercentage);
};

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
    cardElement.addEventListener("click", flipCard);
  });
};

const midGameShuffle = () => {
  lockBoard = true;

  if (firstCard && firstCard.classList) {
    firstCard.classList.remove("flipped");
  }
  if (secondCard && secondCard.classList) {
    secondCard.classList.remove("flipped");
  }

  firstCard = null;
  secondCard = null;

  const allCards = Array.from(document.querySelectorAll(".card"));

  const eligibleCards = allCards.filter(
    (card) => card && !card.classList.contains("matched"),
  );
  for (let i = eligibleCards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    const tempNode = document.createElement("div");
    eligibleCards[i].parentNode.insertBefore(tempNode, eligibleCards[i]);
    eligibleCards[j].parentNode.insertBefore(
      eligibleCards[i],
      eligibleCards[j],
    );
    tempNode.parentNode.insertBefore(eligibleCards[j], tempNode);
    tempNode.remove();
  }

  eligibleCards.forEach((card) => {
    card.classList.add("shuffling");
    setTimeout(() => {
      card.classList.remove("shuffling");
      lockBoard = false;
    }, 500);
  });
};

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

const checkForMatch = () => {
  updateMoves();

  if (firstCard.dataset.pairId === secondCard.dataset.pairId) {
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
    consecutiveMatches = 0;

    const cardOne = firstCard;
    const cardTwo = secondCard;

    firstCard = null;
    secondCard = null;

    setTimeout(() => {
      cardOne.classList.remove("flipped");
      cardTwo.classList.remove("flipped");
      lockBoard = false;
    }, 1100);
  }
};

const checkWin = () => {
  const totalPairs = GameData.levels[currentLevel].matchPairs.length;

  if (matchedPairs === totalPairs) {
    stopTimer();

    setTimeout(() => {
      const basePoints = totalPairs * GameData.scoringRules.pointPerMatch;
      const levelStreakBonus = score - basePoints;

      totalScore += score;
      totalMoves += moves;
      totalTimeSaved += timeLeft;
      totalBonus += levelStreakBonus;

      if (currentLevel + 1 >= GameData.levels.length) {
        playSound("victory");
        showFinalVictory(levelStreakBonus);
      } else {
        playSound("winLevel");
        showWin(levelStreakBonus);
      }
    }, 600);
  }
};

const showWin = (levelBonus) => {
  winPlayerName.textContent = playerName;
  winLevel.textContent = `Level ${currentLevel + 1}`;
  winScore.textContent = score;
  winBonus.textContent = `+${levelBonus}`;
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

const showFinalVictory = (levelBonus) => {
  completePlayerName.textContent = playerName;

  document.getElementById("complete-level-score").textContent = score;
  document.getElementById("complete-level-bonus").textContent =
    `+${levelBonus}`;
  document.getElementById("complete-level-moves").textContent = moves;
  document.getElementById("complete-level-time").textContent = timeLeft;

  completeScore.textContent = totalScore;
  completeMoves.textContent = totalMoves;
  completeTimeSaved.textContent = totalTimeSaved;
  completeBonus.textContent = `+${totalBonus}`;

  overlayVictory.showModal();
};

const showPersona = () => {
  const persona = getPersona(totalScore, maxScore, minScore);
  if (!persona) return;
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

const resetState = () => {
  currentLevel = 0;
  totalScore = 0;
  totalMoves = 0;
  totalTimeSaved = 0;
  totalBonus = 0;
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  consecutiveMatches = 0;
};

const resetGame = () => {
  if (overlayWin.open) overlayWin.close();
  if (overlayLoss.open) overlayLoss.close();
  resetState();
  startGame();
};

const nextLevel = () => {
  overlayWin.close();
  currentLevel++;
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

const startCountdown = (seconds) => {
  timeLeft = seconds;
  timerDisplay.textContent = timeLeft;
  timerInterval = window.setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    const levelData = GameData.levels[currentLevel];

    if (levelData.hasShuffle) {
      if (currentLevel === 1) {
        if (timeLeft === 30 || timeLeft === 60) {
          midGameShuffle();
        }
      }
      if (currentLevel === 2) {
        if (timeLeft === 30 || timeLeft === 60 || timeLeft === 90) {
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

const updateMoves = () => {
  moves++;
  movesDisplay.textContent = moves;
};

const updateScore = () => {
  consecutiveMatches++;

  let points = GameData.scoringRules.pointPerMatch;

  if (consecutiveMatches > 1) {
    points += GameData.scoringRules.streakBonus;
  }

  score += points;
  scoreDisplay.textContent = score;
};

startForm.addEventListener("submit", (event) => {
  event.preventDefault();
  startGame();
});

btnHow.addEventListener("click", () => overlayHow.showModal());
btnCloseHow.addEventListener("click", () => overlayHow.close());
btnHowHeader.addEventListener("click", () => overlayHow.showModal());

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
