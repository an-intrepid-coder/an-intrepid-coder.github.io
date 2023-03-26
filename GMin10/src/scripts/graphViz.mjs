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

// Divides a by b and then returns a result rounded to the hundredths
function divideAndRound(a, b) {
    return ((a / b) * 100).toPrecision(4);
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
   on the X-Axis.  */ 
function lineGraph(datums, // list of strings which are also a property of the JSON objects in table
                           // and the value of that member needs to also be a number
                   legend, // string with the legend
                  ) {
    function isRatingGraph() {
        if (datums.length == 2) { 
            if (datums[0] == "rating" && datums[1] == "oppRating")
                return true;
        }
        return false;
    }

    let high = 0; 
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
            x += 1;
        }
    }
    // Legend:
    context.fillStyle = "white";
    context.fillText(legend, 10, 10);
    // Extra Labels:
    if (isRatingGraph()) {
        let results = {
            totalWins: 0,
            gamesHigher: 0,
            winsHigher: 0,
            gamesLowerOrSame: 0,
            winsLowerOrSame: 0,
            luckyWins: 0,
            totalLosses: 0,
            preventableLosses: 0,
            ratingChanges: [], 
            totalRatingDiff: table[table.length - 1].rating - table[0].rating,
        }
        // ^ NOTE: Assumes at least two games in the table, for now
        let lastGame = null;
        for (let game of table) {
            if (lastGame != null) {
                let diff = game.rating - lastGame.rating;
                results.ratingChanges.push(diff);
            }
            if (game.winLossDraw == "win") {
                results.totalWins++;
                if (game.oppRating > game.rating) results.winsHigher++;
                else results.winsLowerOrSame++;
                if (game.gotLucky) results.luckyWins++;
            }
            else { 
                results.totalLosses++;
                if (game.easilyPreventableLoss) results.preventableLosses++;
            }
            if (game.oppRating > game.rating) results.gamesHigher++;
            else results.gamesLowerOrSame++;

            lastGame = game;
        } 
        let eloChange = 0;
        for (let result of results.ratingChanges) {
            eloChange += result;
        }
        eloChange /= results.ratingChanges.length; 
        let gamesPer100 = 100 / eloChange; // will refine this part more (TODO)

        function plusOrNot(x) {
            if (x >= 0) return "+";
            else return "";
        }
        let bottom = canvas.height - 10; 
        context.fillText(`win % vs higher ELO: ${divideAndRound(results.winsHigher, results.gamesHigher)}%`, 0, bottom - 60);
        context.fillText(`win % vs less or same ELO: ${divideAndRound(results.winsLowerOrSame, results.gamesLowerOrSame)}%`, 0, bottom - 50);
        context.fillText(`rating +/- per game (avg): ${plusOrNot(eloChange)}${eloChange.toPrecision(2)}`, 0, bottom - 40);
        context.fillText(`rating change over ${numGames} games: ${plusOrNot(results.totalRatingDiff)}${results.totalRatingDiff}`, 0, bottom - 30);
        context.fillText(`about ${Math.round(gamesPer100)} games per +100 ELO at current rate`, 0, bottom - 20);
        context.fillText(`lucky wins: ${divideAndRound(results.luckyWins, results.totalWins)}% of wins`, 0, bottom - 10);
        context.fillText(`preventable losses: ${divideAndRound(results.preventableLosses, results.totalLosses)}% of losses`, 0, bottom);
    } // TODO: accuracy graph extra labels
}

/* TODO: Hovering labels instead of the current ones which can get in each
   others' way.  */
/* Draws a bar chart based on a single mutually-exclusive data category.  */
function barChart(datum, // string which is a property of the objects,
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
            gameRecord.total++;
            count.set(gameData, gameRecord);
        }
        let gameRecord = count.get(gameData);
        if (game.whiteOrBlack == "white") {
            gameRecord.whiteTotal++;
            if (game.winLossDraw == "win") {
                gameRecord.whiteWins++;
            }
        } else if (game.whiteOrBlack == "black") {
            gameRecord.blackTotal++;
            if (game.winLossDraw == "win") {
                gameRecord.blackWins++;
            }
        }
        count.set(gameData, gameRecord);
    }
    console.log(count);

    // Drawing the graph
    let dimensions = {high: 0, low: Infinity, 
                      tickX: canvas.width / count.size};
    for (let result of count.entries()) {
        let key = result[0]; 
        let value = result[1];
        if (value.total > dimensions.high) dimensions.high = value.total;
        else if (value.total < dimensions.low) dimensions.low = value.total;
    }
    dimensions.tickY =  canvas.height / dimensions.high;
    dimensions.yToPx = (y) => { return canvas.height - ((y - dimensions.low) * dimensions.tickY) };
    console.log(dimensions);

    clearCanvas();
    var x = 0;
    for (let result of count.entries()) {
        let key = result[0]; 
        let value = result[1];
        let topBuffer = 50;
        let y = dimensions.yToPx(value.total);
        context.fillStyle = randomColor();
        context.fillRect(x, y + 30, dimensions.tickX, canvas.height - 10);
        context.fillStyle = "white";
        context.fillText(`${key}: ${value.total}/${numGames} (${divideAndRound(value.total, numGames)}%)`, x, y - 30);
        context.fillText(`white: ${value.whiteTotal} (${divideAndRound(value.whiteWins, value.whiteTotal)}% wins)`, x, y - 20);
        context.fillText(`black: ${value.blackTotal} (${divideAndRound(value.blackWins, value.blackTotal)}% wins)`, x, y - 10);
        x += dimensions.tickX;
    }
    // Legend
    //context.textAlign = "left";
    context.fillStyle = "white";
    context.fillText(legend, 5, 10);
    context.fillText("(NaN% == no games fit that criteria)", 5, 20);
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
            gameRecord.total++;
            count.set(gameData, gameRecord);
        }
        let gameRecord = count.get(gameData);
        if (game.whiteOrBlack == "white") {
            gameRecord.whiteTotal++;
            if (game.winLossDraw == "win") {
                gameRecord.whiteWins++;
            }
        } else if (game.whiteOrBlack == "black") {
            gameRecord.blackTotal++;
            if (game.winLossDraw == "win") {
                gameRecord.blackWins++;
            }
        }
        count.set(gameData, gameRecord);
    }
    console.log(count);
    
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

// Graph openings used in a bar chart
let openingsBarButton = document.getElementById("openingsBar");
openingsBarButton.addEventListener("mouseup", event => {
    barChart("opening", "Openings Used"); 
});

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

// TODO: Graph correlating playing with higher accuracy and winning <-- Will require restructuring JSON and/or pieGraph()

// and many more to follow...!

