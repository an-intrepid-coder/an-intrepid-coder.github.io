const BOARD_SIZE = 8; // chess squares
const FILES = "ABCDEFGH";
const RANKS = "12345678";
const SQUARE_SIZE = 64; // px
const lightColor = "rgb(120, 120, 120)";
const darkColor = "rgb(60, 60, 60)";
const selectedColor = "rgb(0, 200, 0)";
export const ANIMATION_DELAY = 120;
const pieceTypes = ["p", "Q", "B", "N", "R", "K"];

// TODO: Implement basic chess rules && 2-player hotseat
/* ^ Steps: 
    1. Two-step select->target click with valid move checks.
    2. Return move in algebraic notation.
    3. Affect board state correctly.  */

// TODO: Human vs. AI play

// TODO: Animated game replays

// canvas stuff
let canvas = document.getElementById("canvas");
canvas.width = SQUARE_SIZE * BOARD_SIZE;
canvas.height= SQUARE_SIZE * BOARD_SIZE;
let context = canvas.getContext("2d");

class Piece {
    constructor(type, color, x, y) {
        this.type = type;
        this.color = color;
        this.x = x;
        this.y = y;
    }
}

// The object which represents the game state
class chessGameState {
    constructor() {
        this.squares = [];
        var lightOrDark = "light";
        function toggleLightOrDark() {
            if (lightOrDark == "light") lightOrDark = "dark";
            else if (lightOrDark == "dark") lightOrDark = "light";
        }
        // initialize the board itself
        /* NOTE: 0, 0 == A8 by default  */
        for (let y = 0; y < BOARD_SIZE; y++) {
            this.squares.push([]);
            for (let x = 0; x < BOARD_SIZE; x++) {
                let square = {
                    rank: Array.from(RANKS).reverse()[y],
                    file: FILES[x],
                    lightOrDark: lightOrDark,
                    occupant: null, 
                };
                this.squares[y].push(square); 
                toggleLightOrDark();
            }
            toggleLightOrDark();
        }
        // initialize the black pieces
        for (let y = 0; y < 2; y++) {
            for (let x = 0; x < BOARD_SIZE; x++) {
                if (y == 1) {
                    this.squares[y][x].occupant = new Piece("p", "black", x, y);
                } else {
                    if (x == 0 || x == 7) {
                        this.squares[y][x].occupant = new Piece("R", "black", x, y);
                    } else if (x == 1 || x == 6) {
                        this.squares[y][x].occupant = new Piece("N", "black", x, y);
                    } else if (x == 2 || x == 5) {
                        this.squares[y][x].occupant = new Piece("B", "black", x, y);
                    } else if (x == 3) {
                        this.squares[y][x].occupant = new Piece("Q", "black", x, y);
                    } else {
                        this.squares[y][x].occupant = new Piece("K", "black", x, y);
                    }
                }
            }
        }
        // initialize the white pieces
        for (let y = BOARD_SIZE - 2; y < BOARD_SIZE; y++) {
            for (let x = 0; x < BOARD_SIZE; x++) {
                if (y == BOARD_SIZE - 2) {
                    this.squares[y][x].occupant = new Piece("p", "white", x, y);
                } else {
                    if (x == 0 || x == 7) {
                        this.squares[y][x].occupant = new Piece("R", "white", x, y);
                    } else if (x == 1 || x == 6) {
                        this.squares[y][x].occupant = new Piece("N", "white", x, y);
                    } else if (x == 2 || x == 5) {
                        this.squares[y][x].occupant = new Piece("B", "white", x, y);
                    } else if (x == 3) {
                        this.squares[y][x].occupant = new Piece("Q", "white", x, y);
                    } else {
                        this.squares[y][x].occupant = new Piece("K", "white", x, y);
                    }
                }
            }
        } 
        // initialize the game stats
        this.moveList = []; // stores the move list in algebraic notation
        this.flipped = false;
        this.moveNum = 0;
        this.turn = "white";
        this.selected = null; // `${FILE}${RANK}` or null
        // TODO: much more
    }
    /* Returns the string of the square based on the x, y coordinates of a square.  */
    getSquare(x, y) {  
        if (!this.flipped) {
            let rank = Array.from(RANKS).reverse()[y];
            let file = FILES[x];
            return `${file}${rank}`;
        } else {
            let rank = RANKS[y];
            let file = Array.from(FILES).reverse()[x];
            return `${file}${rank}`;
        }
    }
    flippedCoords(x, y) {
        return {x: BOARD_SIZE - 1 - x, y: BOARD_SIZE - 1 - y};
    }
    incMoveNum() {
        this.moveNum++;
    }
}

// Draws the board state
function renderBoardState(gameState) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    // Board layer
    for (let y = 0; y < BOARD_SIZE; y++) {
        for (let x = 0; x < BOARD_SIZE; x++) { 
            var ty = y;
            var tx = x;
            if (gameState.flipped) {
                let flippedCoords = gameState.flippedCoords(x, y);
                ty = flippedCoords.y;
                tx = flippedCoords.x;
            }
            let squareString = gameState.getSquare(tx, ty);
            let lightOrDark = gameState.squares[ty][tx].lightOrDark;
            if (squareString == gameState.selected) context.fillStyle = selectedColor;
            else if (lightOrDark == "light") context.fillStyle = lightColor;
            else if (lightOrDark == "dark") context.fillStyle = darkColor;
            context.fillRect(tx * SQUARE_SIZE, ty * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
        }
    }
    // Pieces layer
    for (let y = 0; y < BOARD_SIZE; y++) {
        for (let x = 0; x < BOARD_SIZE; x++) { 
            var ty = y;
            var tx = x;
            if (gameState.flipped) {
                let flippedCoords = gameState.flippedCoords(x, y);
                ty = flippedCoords.y;
                tx = flippedCoords.x;
            }
            let occupant = gameState.squares[ty][tx].occupant; 
            if (occupant != null) {
                // placeholder: simple text (TODO: custom shapes, properly centered)
                context.font = `bold ${SQUARE_SIZE / 2}px serif`;
                context.fillStyle = occupant.color;
                context.fillText(occupant.type, x * SQUARE_SIZE + SQUARE_SIZE / 2, y * SQUARE_SIZE + SQUARE_SIZE / 2);
            }
        }
    }
}

// The game state:
let game = new chessGameState();
let start = Date.now();

// Event listener which responds to player clicking on canvas square
canvas.addEventListener("click", (event) => { 
    let x = Math.floor((event.x - canvas.offsetLeft) / SQUARE_SIZE);
    let y = Math.floor((event.y - canvas.offsetTop) / SQUARE_SIZE);
    let square = game.getSquare(x, y);
    console.log(`clicked: (${x}, ${y}) / ${square}`);
    if (game.selected == square) game.selected = null;
    else game.selected = square;
});

// Event listener for board flipping button
let flipButton = document.getElementById("flip");
flipButton.addEventListener("click", (event) => {
    game.flipped = !game.flipped;
});

function updateMoveLabel(gameState) {
    let moveNumButton = document.getElementById("moveNum");
    moveNumButton.textContent = `Move: ${gameState.moveNum}`;
}

function animate() {
    let start = Date.now();
    renderBoardState(game);
    requestAnimationFrame(_ => {
        let end = Date.now();
        let dt = end - start;
        setTimeout(() => {
            animate();
        }, ANIMATION_DELAY - dt);
    });
}

animate();

