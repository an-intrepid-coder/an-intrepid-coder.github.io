import {ChessGameData} from "./chessGameData.mjs";
import * as data from "../gameData/myGames20230319toPresent.json" assert {type: 'json'};

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 600;
const BACKGROUND_COLOR = "rgb(170, 170, 170)";

let canvas = document.getElementById("canvas");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

let context = canvas.getContext("2d");

context.fillStyle = BACKGROUND_COLOR;
context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

let table = data.default;

let numGames = table.length;

// Graphing functions
function lineGraph(datums, // list of strings which are also a property of the JSON objects in table
                           // and the value of that member needs to also be a number
                   legend, // string with the bottom legend
    ) { 
    // clear canvas of previous graph, if any
    context.fillStyle = BACKGROUND_COLOR;
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    context.fillStyle = "black";
    context.strokeStyle = "black";

    let lineColors = ["black", "red", "blue", "green", "magenta"];

    // dimensional stuff
    let bufferLeft = 100;
    let bufferBottom = 50;
    let bufferTop = 10;

    let canvasWidth = CANVAS_WIDTH - bufferLeft;
    let canvasHeight = CANVAS_HEIGHT - bufferBottom - bufferTop;

    // get x-axis distance increment 
    let xAxisInc = canvasWidth / numGames; 

    // y-axis scale and values
    /* TODO: The scaling of the Y-Axis values could be better.  */
    var yAxisValues = new Set();
    var low = Infinity;
    var high = 0;
    for (let game of table) {
        for (let datum of datums) {
            let value = game[datum];
            yAxisValues.add(value);
            if (value < low) low = value;
            if (value > high) high = value;
        }
    }
    // Sorting the Set:
    let temp = Array.from(yAxisValues);
    temp.sort((a, b) => {
        if (a < b) return 1;
        else if (a > b) return -1;
        else return 0; 
    });
    yAxisValues = new Set(temp);

    // Grab y-values in pixels based on the pre-collected positional data
    let yPositions = [];
    function getYExact(y) {
        for (let pos of yPositions) {
            if (pos.data === y) return pos.px;
        }
    }

    // Draw left-side labels
    let interval = canvasHeight / yAxisValues.size;
    var yCount = bufferTop;
    for (let val of yAxisValues) {
        yPositions.push({data: val, px: yCount});
        context.fillText(`${val}`, 0, yCount);
        yCount += interval;
    } // TODO: ^ Stagger the labels so that when there are potentially hundreds it only displays 5-10.

    // Draw bottom legend
    context.fillText(legend, bufferLeft, CANVAS_HEIGHT - 5);

    // Draw graph
    var fillIndex = 0;
    for (let datum of datums) {
        context.fillStyle = lineColors[fillIndex];
        context.strokeStyle = lineColors[fillIndex];
        var currentX = bufferLeft;
        context.beginPath();
        context.moveTo(currentX, getYExact(table[0][datum]));
        for (let game of table) {
            let value = game[datum];
            context.lineWidth = 1;
            let currentY = getYExact(value); 
            // Draw the line to the next point:
            context.lineTo(currentX, currentY);
            context.stroke(); 
            context.moveTo(currentX, currentY);
            // Draw the point for the current datum
            context.arc(currentX, currentY, 3, 0, Math.PI * 2);
            context.fill();
            currentX += xAxisInc;
        }
        fillIndex = (fillIndex + 1) % lineColors.length;
    }
}

/* A series of buttons to create unique graphs based on certain data points.  */

// Graphs the number of turns per game over time in a line graph
let numTurnsButton = document.getElementById("numTurns");
numTurnsButton.addEventListener("mouseup", event => {
    lineGraph(["numTurns"], "Y-Axis: # Turns/game | X-Axis: Games Played");
});

// Blunders per game over time line graph
let numBlundersButton = document.getElementById("numBlunders");
numBlundersButton.addEventListener("mouseup", event => {
    lineGraph(["numBlunders"], "Y-Axis: # Blunders/game | X-Axis: Games Played");
});

// Accuracy per game (including opp. accuracy)
let accButton = document.getElementById("acc");
accButton.addEventListener("mouseup", event => {
    lineGraph(["accuracy", "oppAccuracy"], "Y-Axis: Move Accuracy | X-Axis: Games Played | Black=Self, Red=Opponent");
});

// Rating per game (including opp. accuracy)
let ratingButton = document.getElementById("rating");
ratingButton.addEventListener("mouseup", event => {
    lineGraph(["rating", "oppRating"], "Y-Axis: Chess.com ELO | X-Axis: Games Played | Black=Self, Red=Opponent");
});

// TODO: Win/loss comparison by opening.

// TODO: Pie Graph of openings played

// TODO: Graph correlating playing with higher accuracy and winning

// and many more to follow...!

