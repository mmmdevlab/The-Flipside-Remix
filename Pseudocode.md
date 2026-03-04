/-------------------------------- Data Layer (data.js) --------------------------------/
// Arrays for levels, cards, personas
// Level Configs: Cards per level, time limits
// - Level 1 — 4x3 grid, 12 cards, 60s, no shuffle
// - Level 2 — 6x3 grid, 18 cards, 90s, shuffle enabled
// - Level 3 — 7x4 grid, 28 cards, 120s, shuffle + streak bonus
// Persona Objects — 4 personas, each with name, message, image, score threshold
// - Persona 1 — Soundwave Sage
// - Persona 2 — Beat Devotee
// - Persona 3 — Rhythm Rover
// - Persona 4 — Silent Mode Starter
// Scoring Rules — points per match, streak bonus
/-------------------------------- Constants --------------------------------/
// minScore — lowest possible score across all levels
// maxScore — highest possible score across all levels
/---------------------------- Variables (state) ----------------------------/
// Player name — default "Guest"
// Current level
// Score, moves, time left
// Timer interval reference
// Total score, total moves, total bonus, total time saved
// First card, second card
// Lock board — prevents clicking during match check
// Consecutive matches — tracks streak
// Matched pairs — count of successful matches
/------------------------ Cached Element References ------------------------/
// Grab screens — start, game
// Grab game grid
// Grab start form and player name input
// Grab all buttons
// Grab score panel displays — level, timer, score, moves
// Grab all overlay dialogs and their text elements
/---------------------------- Functions (Game) ----------------------------/
// shuffle(array) — returns new randomly ordered array using Fisher-Yates
// minPossibleScore() — calculates score floor across all levels
// maxPossibleScore() — calculates score ceiling across all levels
// getPersona(totalScore, maxScore, minScore) — normalises score, returns matching persona
// renderBoard(cards, level) — clears grid, creates and appends card elements
// midGameShuffle() — repositions unmatched cards in DOM, plays animation
// startGame() — resets state, builds cards array, renders board, shows level start overlay
// flipCard(event) — handles card click, manages first/second card state
// checkForMatch() — compares pairId on both cards, handles match and mismatch logic
// checkWin() — checks if all pairs found, accumulates totals, routes to win or final victory
// showWin(levelBonus) — populates and opens win overlay
// showLoss() — populates and opens loss overlay
// showFinalVictory(levelBonus) — populates and opens final victory overlay
// showPersona() — builds and displays persona result card
// resetState() — resets all state variables to starting values
// resetGame() — closes overlays, resets state, restarts game
// nextLevel() — increments level, calls startGame
// tryAgain() — resets card state, calls startGame on same level
// startCountdown(seconds) — starts setInterval, ticks every 1000ms, triggers shuffle and loss
// stopTimer() — clears interval, sets timerInterval to null
// updateMoves() — increments moves, updates display
// updateScore() — awards points, applies streak bonus if consecutive match
/----------------------------- Event Listeners -----------------------------/
// Start form submit — startGame
// How to play buttons — open instructions overlay
// Close instructions — close overlay
// Reset button — resetGame
// Try again — tryAgain
// Next level — nextLevel
// Show results — showPersona, open persona overlay
// Home button — reset state, return to start screen
