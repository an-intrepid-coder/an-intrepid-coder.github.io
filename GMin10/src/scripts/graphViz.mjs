import {ChessGameData} from "./chessGameData.mjs";
import * as data from "../gameData/myGames20230319toPresent.json" assert {type: 'json'};

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 600;
const BACKGROUND_COLOR = "rgb(0, 0, 0)";

function randomColor() {
    function randRgb() {
        return Math.round(Math.random() * 255);
    }
    return `rgb(${randRgb()}, ${randRgb()}, ${randRgb()})`;
}

function divideAndRound(a, b) {
    return Math.round(a / b * 10000) / 100;
}

// canvas stuff
let canvas = document.getElementById("canvas");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

let context = canvas.getContext("2d");

// Table of games
let table = data.default;
let numGames = table.length;

// clear canvas of previous graph, if any
function clearCanvas() {
    context.fillStyle = BACKGROUND_COLOR;
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}
clearCanvas();

// An object with the adjusted dimensions to include buffer space.
// Will eventually be more dynamic.
class bufferedDimensions {
    constructor() {
        this.bufferLeft = 100;
        this.bufferBottom = 50;
        this.bufferTop = 50;
        this.canvasWidth = CANVAS_WIDTH - this.bufferLeft;
        this.canvasHeight = CANVAS_HEIGHT - this.bufferBottom - this.bufferTop;
    }
}

/* Graphing function currently assumes the Y-Axis is being measured against games in chronological order 
   on the X-Axis.  */ // duh, this is algebra. hehe
function lineGraph(datums, // list of strings which are also a property of the JSON objects in table
                           // and the value of that member needs to also be a number
                   legend, // string with the legend
                  ) {
    let high = 0; // TODO: Re-work BufferedDimensions class
    let low = Infinity;
    for (let game of table) {
        for (let datum of datums) {
            if (game[datum] < low) low = game[datum];
            else if (game[datum] > high) high = game[datum];
        }
    } 
    let dimensions = {high: high, low: low,
                      cells: {x: numGames, y: high - low}, 
                      px: {x: canvas.width, y: canvas.height}};
    dimensions.tickX = dimensions.px.x / dimensions.cells.x;
    dimensions.tickY = dimensions.px.y / dimensions.cells.y;
    dimensions.xToPx = (x) => { return x * dimensions.tickX; };
    dimensions.yToPx = (y) => { return dimensions.px.y - ((y - low) * dimensions.tickY) };

    // Draw graph
    clearCanvas();
    context.beginPath();
    for (let datum of datums) {
        context.beginPath();
        context.strokeStyle = randomColor();
        let x = 0;
        let first = true;
        for (let game of table) {
            let xPx = dimensions.xToPx(x);
            let y = game[datum];
            let yPx = dimensions.yToPx(y);
            if (first) {
                context.moveTo(xPx, yPx);
                first = false;
                context.fillStyle = "white";
                context.fillText(datum, xPx, yPx + 10);
            }
            context.lineTo(xPx, yPx);
            context.stroke();
            // draw highest and lowest labels, if found
            context.fillStyle = "white";
            if (y == high) 
                context.fillText(y, xPx, yPx + 10);
            else if (y == low) 
                context.fillText(y, xPx, yPx - 10);
            // draw 10% of other labels:
            else if (Math.random() < .1 && !first)
                context.fillText(y, xPx, yPx);
            //console.log(`x=${xPx}, y=${yPx}`);
            x += 1;
        }
    }
    // Legend:
    context.fillStyle = "white";
    context.fillText(legend, 10, dimensions.px.y - 10);
}

/* TODO: Hovering labels instead of the current ones which can get in each
   others' way.  */
/* Draws a pie chart based on a single mutually-exclusive data category.  */
function pieChart(datum, // string which is a property of the objects,
                         // containing mutually exclusive possibilities
                  legend, // string containing the legend
                 ) {
    // Gathering the results
    // Correlates all data with win/loss ratio by piece.
    let count = new Map();
    for (let game of table) {
        let gameData = game[datum];
        if (!count.has(gameData)) {
            let gameRecord = {total: 1, whiteWins: 0, whiteTotal: 0, 
                              blackWins: 0, blackTotal: 0};
            count.set(gameData, gameRecord);
        } else {
            let gameRecord = count.get(gameData);
            gameRecord.total = gameRecord.total + 1;
            count.set(gameData, gameRecord);
        }
        let gameRecord = count.get(gameData);
        if (game.whiteOrBlack == "white") {
            gameRecord.whiteTotal = gameRecord.whiteTotal + 1;
            if (game.winLossDraw == "win") {
                gameRecord.whiteWins = gameRecord.whiteWins + 1;
            }
        } else if (game.whiteOrBlack == "black") {
            gameRecord.blackTotal = gameRecord.blackTotal + 1;
            if (game.winLossDraw == "win") {
                gameRecord.blackWins = gameRecord.blackWins + 1;
            }
        }
        count.set(gameData, gameRecord);
    }

    // drawing the graph
    clearCanvas();
    let dimensions = new bufferedDimensions();
    let center = {x: dimensions.canvasWidth / 2 + dimensions.bufferTop + dimensions.bufferLeft,
                  y: dimensions.canvasHeight / 2 + dimensions.bufferTop};
    let angle = -0.5 * Math.PI;
    for (let result of count.entries()) {
        let key = result[0]; 
        let value = result[1];
        // Pie Slice
        let nextAngle = (value.total / numGames) * 2 * Math.PI;
        let radius = dimensions.canvasHeight * .50; 
        context.beginPath();
        context.arc(center.x, center.y, radius, angle, angle + nextAngle);
        context.lineTo(center.x, center.y);
        context.fillStyle = randomColor();
        context.fill();
        // Label
        let labelAngle = angle + 0.5 * nextAngle; 
        let labelX = Math.cos(labelAngle) * (radius + 20) + center.x;
        let labelY = Math.sin(labelAngle) * (radius + 20) + center.y;
        context.fillStyle = "white";
        let x = Math.cos(labelAngle); 
        if (x < 0) {
            context.textAlign = "right";
        } else {
            context.textAlign = "left";
        }
        context.fillText(`${key}: ${value.total}/${numGames} (${divideAndRound(value.total, numGames)}%)`, labelX, labelY);
        context.fillText(`as white: ${value.whiteTotal} (${divideAndRound(value.whiteWins, value.whiteTotal)}% wins)`, labelX, labelY + 10);
        context.fillText(`as black: ${value.blackTotal} (${divideAndRound(value.blackWins, value.blackTotal)}% wins)`, labelX, labelY + 20);

        angle += nextAngle; 
    }
    // Legend
    context.textAlign = "left";
    context.fillStyle = "white";
    context.fillText(legend, 30, dimensions.bufferTop);
    context.fillText("(NaN% == no games fit that criteria)", 30, dimensions.bufferTop + 15);
}

/* A series of buttons to create unique graphs based on certain data points.  */

// Graphs the timeControl used in each game as a pie chart
let timeControlButton = document.getElementById("timeControl");
timeControlButton.addEventListener("mouseup", event => {
    pieChart("timeControl", "Time Controls Used");
});

// Graphs the openings used in each game as a pie chart
let openingsButton = document.getElementById("openings");
openingsButton.addEventListener("mouseup", event => {
    pieChart("opening", "All Openings Played");
});

// Graphs wins/draws/losses in a pie chart
let wldButton = document.getElementById("wld");
wldButton.addEventListener("mouseup", event => {
    pieChart("winLossDraw", "Won / Lost / Drawn");
});

// Graphs the number of turns per game over time in a line graph
let numTurnsButton = document.getElementById("numTurns");
numTurnsButton.addEventListener("mouseup", event => {
    lineGraph(["numTurns"], "Y-Axis: # Turns/game | X-Axis: Games Played");
});

// Accuracy per game (including opp. accuracy)
let accButton = document.getElementById("acc");
accButton.addEventListener("mouseup", event => {
    lineGraph(["accuracy", "oppAccuracy"], "Y-Axis: Move Accuracy | X-Axis: Games Played");
});

// Rating per game (including opp. accuracy)
let ratingButton = document.getElementById("rating");
ratingButton.addEventListener("mouseup", event => {
    lineGraph(["rating", "oppRating"], "Y-Axis: Chess.com ELO | X-Axis: Games Played");
});

// TODO: Pie Graph of got lucky / easily preventable loss / neither <-- Will require restructuring JSON

// TODO: Graph correlating playing with higher accuracy and winning <-- Will require restructuring JSON and/or pieGraph()

// and many more to follow...!

