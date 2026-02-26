import * as GameData from "./data.js";

console.log(GameData.levels);
console.log(GameData.personas);
console.log(GameData.buttonMenu);

/*-------------------------------- Constants --------------------------------*/

//deck array for my cards

/*---------------------------- Variables (state) ----------------------------*/

let playerName = "Guest";
let currentLevel = 0;
let score = 0;
let moves = 0;
let timer = 0;
let timeLeft = 0;

//? Active Cards: First card clicked, Second card clicked (to compare them)
//? Lock Board: Boolean to prevent clicking a 3rd card during a match check
//? Game Started: Boolean to check if the timer should begin

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

//? Grab the Grid Container
//? Grab the Dashboard items (Timer, Score, Moves displays)
//? Grab all the Screens (Start, Game, Overlays)

/*---------------------------- Functions (Game) ----------------------------*/

//? create board:
//? start game :
//? card click:
//? check match:
//? add audio object [cardClick, correctMatch, winLevelSound, lossLevelSound,]
//? help function called playSound to trigger when interacted -

/*----------------------------- Event Listeners -----------------------------*/

//? Button Triggers :
//? Board Triggers:
