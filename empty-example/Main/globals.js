// GLOBAL VARIABLES
let player;
let obstacles = [];
let roadSpeed = 4;
let spawnRate = 90;
let timer = 0;
let gameOver = false;
let distance = 0;
let stage = 1;
let stageMessageTimer = 0;
let playerName = "";
let nameInput, playButton;

// Game state: start, enterName, playing, gameOver, showLeaderboard
let gameState = "start";

// Assets
let playerImg;
let carImgs = [];
let themeSound;

// Stage goals
let stageGoals = [0, 500, 1000, 2000];
