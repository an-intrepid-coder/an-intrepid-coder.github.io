import {ChessGameData} from "./chessGameData.mjs";
import * as data from "../gameData/myGames20230319toPresent.json" assert {type: 'json'};

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 600;
const BACKGROUND_COLOR = "rgb(170, 170, 170)";

// TODO: Small bug where viewing the pie charts will mess up the left-side
// labels of the line graphs when you go back to them. Refreshing page
// fixes in the meantime.

// TODO: Encapsulate all the line colors stuff into a class, including
//       the fillIndex stuff

const lineColors = ["black", "red", "blue", "green", "magenta"];

// canvas stuff
let canvas = document.getElementById("canvas");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

let context = canvas.getContext("2d");

context.fillStyle = BACKGROUND_COLOR;
context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

// Table of games
let table = data.default;
let numGames = table.length;

// clear canvas of previous graph, if any
function clearCanvas() {
    context.fillStyle = BACKGROUND_COLOR;
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    context.fillStyle = "black";
    context.strokeStyle = "black";
}

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

// Graphing functions
function lineGraph(datums, // list of strings which are also a property of the JSON objects in table
                           // and the value of that member needs to also be a number
                   legend, // string with the bottom legend
    ) { 
    clearCanvas();

    let dimensions = new bufferedDimensions();

    // get x-axis distance increment 
    let xAxisInc = dimensions.canvasWidth / numGames; 

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
    let interval = dimensions.canvasHeight / yAxisValues.size;
    var yCount = dimensions.bufferTop;
    for (let val of yAxisValues) {
        yPositions.push({data: val, px: yCount});
        context.fillText(`${val}`, 0, yCount);
        yCount += interval;
    } // TODO: ^ Stagger the labels so that when there are potentially hundreds it only displays 5-10.

    // Draw bottom legend
    context.fillText(legend, dimensions.bufferLeft, CANVAS_HEIGHT - 5);

    // Draw graph
    var fillIndex = 0;
    for (let datum of datums) {
        context.fillStyle = lineColors[fillIndex];
        context.strokeStyle = lineColors[fillIndex];
        var currentX = dimensions.bufferLeft;
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

// TODO: pie charts requiring other datums such as gotLucky vs. 
// easilyAvoidedLoss will have to be structured differently,
// or, I'll want to restructure how that data is organized
// (preferable), with a node script on the db.

/* Draws a pie chart based on a single mutually-exclusive data category.  */
function pieChart(datum,  // string which is a property of the objects,
                           // containing mutually exclusive possibilities
                  legend   // string containing the legend
                 ) {
    // Gathering the results
    let categories = new Set();
    let count = new Map();
    for (let game of table) {
        categories.add(game[datum]);
    }
    for (let category of categories) {
        count.set(category, 0);
    }
    for (let game of table) {
        if (count.has(game[datum])) {
            let value = count.get(game[datum]);
            count.set(game[datum], value + 1);
        }
    }

    // drawing the graph
    clearCanvas();
    let dimensions = new bufferedDimensions();
    let center = {x: dimensions.canvasWidth / 2 + dimensions.bufferTop + dimensions.bufferLeft,
                  y: dimensions.canvasHeight / 2 + dimensions.bufferTop};
    let angle = -0.5 * Math.PI;
    var fillIndex = 0;
    for (let result of count.entries()) {
        let key = result[0];
        let value = result[1];
        // Pie Slice
        let nextAngle = (value / numGames) * 2 * Math.PI;
        let radius = dimensions.canvasHeight * .50; 
        context.beginPath();
        context.arc(center.x, center.y, radius, angle, angle + nextAngle);
        context.lineTo(center.x, center.y);
        context.fillStyle = lineColors[fillIndex];
        context.fill();
        // Label
        let labelAngle = angle + 0.5 * nextAngle; 
        let labelX = Math.cos(labelAngle) * (radius + 20) + center.x;
        let labelY = Math.sin(labelAngle) * (radius + 20) + center.y;
        context.fillStyle = "black";
        let x = Math.cos(labelAngle); // * radius;
        if (x < 0) {
            context.textAlign = "right";
        } else {
            context.textAlign = "left";
        }
        context.fillText(`${key}: ${value}/${numGames}`, labelX, labelY);
        angle += nextAngle; 
        fillIndex = (fillIndex + 1) % lineColors.length;
    }
    // Legend
    context.fillText(legend, dimensions.bufferLeft, dimensions.bufferTop);
}

/* A series of buttons to create unique graphs based on certain data points.  */

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
// TODO: Pie Graph of got lucky / easily preventable loss / neither

// TODO: Graph correlating playing with higher accuracy and winning

// and many more to follow...!

