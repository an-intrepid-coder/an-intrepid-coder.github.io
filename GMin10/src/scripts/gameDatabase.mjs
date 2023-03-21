import {ChessGameData} from "./chessGameData.mjs";
import * as data from "../gameData/myGames20230319toPresent.json" assert {type: 'json'};

let table = data.default;

let numGames = table.length;

// Generate the labels for the games
let gameLabels = []
for (let game of table) {
    let gameLabel = `${game.date}_${game.opponent} | ${game.winLossDraw}`;
    gameLabels.push(gameLabel);
}

// Clears the html body element of child nodes
function clearBody() { 
    for (;;) { 
        let child = document.body.firstChild;
        if (child == null) break;
        document.body.removeChild(child);
    }
}

/* NOTE: The following two functions will get much fancier over time  */

// Display all the data for the selected game
function generateGameViewMode(game) {
    // header with opponent name
    let h2 = document.createElement("h2");
    let title = document.createTextNode(`sgibber2018 vs ${game.opponent}`);
    h2.appendChild(title);
    document.body.appendChild(h2);
    // back button
    let backButton = document.createElement("button");
    backButton.type = "button";
    backButton.addEventListener("click", () => {
        clearBody();
        generateGameSelectionMode();
    });
    let backButtonText = document.createTextNode("return to selection");
    backButton.appendChild(backButtonText);
    let backButtonP = document.createElement("p");
    backButtonP.appendChild(backButton);
    document.body.appendChild(backButtonP);
    // Date 
    let dateP = document.createElement("p");
    let dateText = document.createTextNode(`Date: ${game.date}`);
    dateP.appendChild(dateText);
    document.body.appendChild(dateP);
    // ELO
    let eloP = document.createElement("p");
    let eloText = document.createTextNode(`ELO: sgibber2018: ${game.rating} | ${game.opponent}: ${game.oppRating}`);
    eloP.appendChild(eloText);
    document.body.appendChild(eloP);
    // Side
    let sideP = document.createElement("p");
    let sideText = document.createTextNode(`Playing As: ${game.whiteOrBlack}`);
    sideP.appendChild(sideText);
    document.body.appendChild(sideP);
    // Win/Loss/Draw
    let wldP = document.createElement("p");
    let wldText = document.createTextNode(`Game Result: ${game.winLossDraw}`);
    wldP.appendChild(wldText);
    document.body.appendChild(wldP);
    // Opening
    let openingP = document.createElement("p");
    let openingText = document.createTextNode(`Opening Played: ${game.opening}`);
    openingP.appendChild(openingText);
    document.body.appendChild(openingP);
    // Accuracy
    let accuracyP = document.createElement("p");
    let accuracyText = document.createTextNode(`Move Accuracy: sgibber2018: ${game.accuracy}% | ${game.opponent}: ${game.oppAccuracy}%`);
    accuracyP.appendChild(accuracyText);
    document.body.appendChild(accuracyP);
    // EPL
    let elpP = document.createElement("p");
    let elpText = document.createTextNode(`Easily Preventable Loss: ${game.gotLucky}`);
    elpP.appendChild(elpText);
    document.body.appendChild(elpP);
    // numTurns
    let numTurnsP = document.createElement("p");
    let numTurnsText = document.createTextNode(`The game lasted for ${game.numTurns} moves.`);
    numTurnsP.appendChild(numTurnsText);
    document.body.appendChild(numTurnsP);
    // Lucky
    let gotLuckyP = document.createElement("p");
    let gotLuckyText = document.createTextNode(`Got Lucky: ${game.gotLucky}.`);
    gotLuckyP.appendChild(gotLuckyText);
    document.body.appendChild(gotLuckyP);
    // Blunders
    let blundersP = document.createElement("p");
    let blundersText = document.createTextNode(`# Blunders: ${game.numBlunders}.`);
    blundersP.appendChild(blundersText);
    document.body.appendChild(blundersP);
    // Time Control
    let timeControlP = document.createElement("p");
    let timeControlText = document.createTextNode(`Time Control: ${game.timeControl}.`);
    timeControlP.appendChild(timeControlText);
    document.body.appendChild(timeControlP);
    // Remarks
    let remarksP = document.createElement("p");
    let remarksText = document.createTextNode(`Remarks: ${game.remarks}`);
    remarksP.appendChild(remarksText);
    document.body.appendChild(remarksP);

    // Notes
    let br = document.createElement("br");
    document.body.appendChild(br);
    let borderP = document.createElement("p");
    let borderText = document.createTextNode("~-~-~-~-~-~-~-~-");
    borderP.appendChild(borderText);
    document.body.appendChild(borderP);
    // on ELO
    let eloNoteP = document.createElement("p");
    let eloNote = document.createTextNode("\nNote: ELO ratings are from before the match, most of the time.");
    eloNoteP.appendChild(eloNote);
    document.body.appendChild(eloNoteP);
    // on Openings
    let openingNoteP = document.createElement("p");
    let openingNote = document.createTextNode("\nNote: Openings are sometimes categorized with the name of the specific variation, and sometimes more general. I will eventually want to take a more nuanced approach to categorizing openings played.");
    openingNoteP.appendChild(openingNote);
    document.body.appendChild(openingNoteP);
    // On accuracy
    let accuracyNoteP = document.createElement("p");
    let accuracyNote = document.createTextNode("\nNote: Move accuracy as reported in the post-game analysis of the chess.com app");
    accuracyNoteP.appendChild(accuracyNote);
    document.body.appendChild(accuracyNoteP);
    // On ELP
    let elpNoteP = document.createElement("p");
    let elpNote = document.createTextNode("\nNote: An easily preventable loss is a game which I would have won if I had not made an obvious mistake (hanging a piece, etc.). Often classified as a 'giveaway' game in the chess.com database, but not always.");
    elpNoteP.appendChild(elpNote);
    document.body.appendChild(elpNoteP);
    // On gotLucky
    let gotLuckyNoteP = document.createElement("p");
    let gotLuckyNote = document.createTextNode("\nNote: 'Got Lucky' is the inverse of an easily preventable loss. These are games where the opponent made a serious blunder which decided the game, or missed a very bad move on part which allowed me to win.");
    gotLuckyNoteP.appendChild(gotLuckyNote);
    document.body.appendChild(gotLuckyNoteP);

}

/* Generates the DOM as a list of buttons for each game in the table,
   which each have a generated function to re-draw the DOM in gameView mode
   for that game when clicked.  */
function generateGameSelectionMode() {
    let h2 = document.createElement("h2");
    let title = document.createTextNode("List of Games (click on one to view)");
    h2.appendChild(title);
    let p = document.createElement("p");
    let a = document.createElement("a");
    let backText = document.createTextNode("back to index");
    a.href = "./index.html";
    a.appendChild(backText);
    p.appendChild(a);
    document.body.appendChild(h2);
    document.body.appendChild(p);
    for (let i = 0; i < table.length; i++) {
        let p = document.createElement("p");
        let button = document.createElement("button");
        button.type = "button";
        let text = document.createTextNode(gameLabels[i]);
        button.appendChild(text);
        button.value = gameLabels[i];
        button.addEventListener("click", () => {
            clearBody(); 
            generateGameViewMode(table[i]); // TODO: test
        });
        p.appendChild(button);
        document.body.appendChild(p);
    }
}

// Initialize the page in "gameSelection" mode
generateGameSelectionMode();

