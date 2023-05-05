const BOARD_SIZE = 8; // chess squares
const FILES = "ABCDEFGH";
const RANKS = "12345678";
const SQUARE_SIZE = 64; // px
const lightColor = "rgb(120, 120, 120)";
const darkColor = "rgb(60, 60, 60)";
const selectedColor = "rgb(0, 200, 0)";
export const ANIMATION_DELAY = 120;
const pieceTypes = ["p", "Q", "B", "N", "R", "K"];

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
        this.timesMoved = 0;
    }

    /* Returns true if the move obeys the rules of chess given the current
       game state and the target of the attempted move in x, y coordinates.  */
    obeysMoveRules(gameState, x, y) {
        /* NOTE: The case of x == selectedX && y == selectedY is covered elsewhere, and
           results in de-selection of the current square by default.  */
        let color = this.color;
        let selectedY = this.y;
        let selectedX = this.x;
        let timesMoved = this.timesMoved;
        if (color != gameState.turn) return false;
        let occupant = game.squares[y][x].occupant;
        /* TODO: No en passant, castling, or checks yet (in progress).  */
        function isAdjacentMoveOrCapture() {
            return Math.abs(selectedX - x) <= 1 && Math.abs(selectedY - y) <= 1 && (occupant == null || occupant.color != color);
        }
        function isBlocked(target, square, isTarget, occupied, sameSide) {
            return occupied && (sameSide || !isTarget); 
        }
        function isValidCaptureOrMove(target, square, isTarget, occupied, sameSide) {
            return isTarget && (!occupied || !sameSide);
        }
        function isDiagonalMoveOrCapture() {
            if (occupant != null && occupant.color == color) return false;
            let yDiff = selectedY - y;
            let xDiff = selectedX - x;
            if (yDiff == 0 || xDiff == 0) return false;
            function getNextOffsets(distance) {
                if (yDiff < 0 && xDiff < 0) { 
                    return {x: distance, y: distance};
                } else if (yDiff < 0 && xDiff > 0) { 
                    return {x: -distance, y: distance};
                } else if (yDiff > 0 && xDiff < 0) { 
                    return {x: distance, y: -distance};
                } else if (yDiff > 0 && xDiff > 0) { 
                    return {x: -distance, y: -distance};
                }
            }
            for (let distance = 1; distance <= Math.abs(yDiff); distance++) { 
                let offsets = getNextOffsets(distance);
                let target = {x: selectedX + offsets.x, y: selectedY + offsets.y};
                let square = gameState.squares[target.y][target.x];
                let isTarget = target.x == square.x && target.y == square.y;
                let occupied = square.occupant != null;
                let sameSide = square.occupant != null && occupant.color == color; 
                if (isBlocked(target, square, isTarget, occupied, sameSide)) return false;
                else if (isValidCaptureOrMove(target, square, isTarget, occupied, sameSide)) return true;
            }
            return false; 
        }
        function isStraightMoveOrCapture() { 
            if (occupant != null && occupant.color == color) return false;
            let yDiff = selectedY - y;
            let xDiff = selectedX - x;
            if (!(yDiff == 0 || xDiff == 0)) return false;
            function getNextOffsets(distance) { 
                if (yDiff == 0 && xDiff > 0) { 
                    return {x: -distance, y: 0};
                } else if (yDiff == 0 && xDiff < 0) { 
                    return {x: distance, y: 0};
                } else if (yDiff > 0 && xDiff == 0) { 
                    return {x: 0, y: -distance};
                } else if (yDiff < 0 && xDiff == 0) { 
                    return {x: 0, y: distance};
                }
            }
            for (let distance = 1; distance <= Math.max(Math.abs(yDiff), Math.abs(xDiff)); distance++) {
                let offsets = getNextOffsets(distance);
                let target = {x: selectedX + offsets.x, y: selectedY + offsets.y};
                let square = gameState.squares[target.y][target.x];
                let isTarget = target.x == square.x && target.y == square.y;
                let occupied = square.occupant != null;
                let sameSide = square.occupant != null && occupant.color == color; 
                if (isBlocked(target, square, isTarget, occupied, sameSide)) return false;
                else if (isValidCaptureOrMove(target, square, isTarget, occupied, sameSide)) return true;
            }
            return false;
        }
        function getForward() {
            var forward = 1;
            if (color == "white") forward *= -1;
            return forward;
        }
        function isPawnCapture() {
            let forward = getForward();
            return (y == selectedY + forward && Math.abs(selectedX - x) == 1 && occupant.color != color);
        }
        function isUnblockedForwardMovement() {
            let forward = getForward();
            return x == selectedX && occupant == null && (y == selectedY + forward || (y == selectedY + forward * 2 && timesMoved == 0));
        }
        function isKnightMoveOrCapture() {
            let xDiff = Math.abs(x - selectedX);
            let yDiff = Math.abs(y - selectedY);
            return (xDiff == 1 && yDiff == 2) || (xDiff == 2 && yDiff == 1);
        }
        if (this.type == "p") return isPawnCapture() || isUnblockedForwardMovement();
        else if (this.type == "N") return isKnightMoveOrCapture();
        else if (this.type == "Q") return isAdjacentMoveOrCapture() || isDiagonalMoveOrCapture() || isStraightMoveOrCapture();
        else if (this.type == "K") return isAdjacentMoveOrCapture();
        else if (this.type == "B") return isDiagonalMoveOrCapture();
        else if (this.type == "R") return isStraightMoveOrCapture();
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
                    x: x,
                    y: y
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
        this.moveList = []; // stores the record of each move
        this.flipped = false;
        this.moveNum = 1;
        this.turn = "white";
        this.selected = null; // `${FILE}${RANK}` or null
        // TODO: much more
    }
    toggleTurn() {
        if (this.turn == "white") this.turn = "black";
        else if (this.turn == "black") {
            this.turn = "white";
            this.moveNum++;
        }
    }
    flipBoard() { 
        this.flipped = !this.flipped;
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
    toCoords(squareString) {
        let file = squareString[0];
        let rank = squareString[1];
        let y = BOARD_SIZE - Number.parseInt(rank);
        let x = FILES.indexOf(file);
        return {x: x, y: y};
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

function updateHud(gameState) {
    function updateMoveLabel() {
        let moveNumButton = document.getElementById("moveNum");
        moveNumButton.textContent = `move #: ${gameState.moveNum}`;
    }
    function updateTurnLabel() {
        let turnButton = document.getElementById("turn");
        turnButton.textContent = `${gameState.turn} to move`;
    }
    updateMoveLabel();
    updateTurnLabel();
    // TODO: Much more
}

// The game state:
let game = new chessGameState();

// Event listener which responds to player clicking on canvas square
canvas.addEventListener("click", (event) => { 
    let wasFlipped = game.flipped;
    if (wasFlipped) game.flipBoard();
    var x = Math.floor((event.x - canvas.offsetLeft) / SQUARE_SIZE);
    var y = Math.floor((event.y - canvas.offsetTop) / SQUARE_SIZE);
    if (wasFlipped) {
        let xy = game.flippedCoords(x, y);
        x = xy.x;
        y = xy.y; 
    }
    let square = game.getSquare(x, y);
    if (game.selected == square) {
        game.selected = null;
    } else if (game.selected != null) {
        let selectedSquareCoords = game.toCoords(game.selected);
        let selectedOccupant = game.squares[selectedSquareCoords.y][selectedSquareCoords.x].occupant;
        let occupant = game.squares[y][x].occupant;
        let moveReport = {
            validMove: selectedOccupant.obeysMoveRules(game, x, y),
            capture: selectedOccupant != null && selectedOccupant.color != game.turn,
            // TODO: Notation string
        };
        if (moveReport.validMove) {
            game.moveList.push(moveReport);
            game.squares[selectedSquareCoords.y][selectedSquareCoords.x].occupant = null;
            selectedOccupant.timesMoved++;
            selectedOccupant.x = x;
            selectedOccupant.y = y;
            game.squares[y][x].occupant = selectedOccupant;
            game.selected = null;
            /* TODO: Castling check here, and a promotion check, as those are the only two situations in which
               the selected square might retain an occupant.  */
            // TODO: Capture checks, for the sake of metadata mostly.
            // TODO: Rules and effects for check(mate) & game over
            game.toggleTurn();
            updateHud(game);
        }
    } else {
        game.selected = square;
    }
    if (wasFlipped) game.flipBoard();
});

// Event listener for board flipping button
let flipButton = document.getElementById("flip");
flipButton.addEventListener("click", (event) => {
    game.flipped = !game.flipped;
});

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

