// Node stuff: commented out for the live site

/*

import {ChessGameData} from "./chessGameData.mjs";
import * as fs from "fs";
import {fileURLToPath} from "url";
import * as path from "path";

// Save a game to the system, by running a node command. 
function addGameToTable(game, pathToMoveList) {
    // Get and parse move list:
    let moveList = fs.readFileSync(pathToMoveList, "utf8").replace(/\n+/g, "");
    game.moveList = moveList;

    // Get the table:
    let oldTable = fs.readFileSync("/home/sgibber/Projects/GMin10/src/gameData/myGames20230319toPresent.json", "utf8");
    let table = JSON.parse(oldTable);

    // Push to table and re-write it:
    table.push(game);
    let newTable = JSON.stringify(table);
    fs.writeFileSync("../gameData/myGames20230319toPresent.json", newTable);
}

let game9 = new ChessGameData(
                    "20230325", // YYYYMMDD string
                    opponent, // string
                    798, // int
                    oppRating, // int
                    whiteOrBlack, // string
                    winLossDraw,  // string
                    opening, // string
                    accuracy, // float
                    oppAccuracy, //float
                    easilyPreventableLoss, // bool
                    gotLucky, // bool
                    numTurns, // int
                    "rapid15|10", // string (e.g. "rapid30", "bullet1", etc.)
                    remarks, // string
               );
addGameToTable(game9, "./");

let game10 = new ChessGameData(
                    date, // YYYYMMDD string
                    opponent, // string
                    rating, // int
                    oppRating, // int
                    whiteOrBlack, // string
                    winLossDraw,  // string
                    opening, // string
                    accuracy, // float
                    oppAccuracy, //float
                    easilyPreventableLoss, // bool
                    gotLucky, // bool
                    numTurns, // int
                    timeControl, // string (e.g. "rapid30", "bullet1", etc.)
                    remarks, // string
               );
addGameToTable(game10, "./");

let game11 = new ChessGameData(
                    date, // YYYYMMDD string
                    opponent, // string
                    rating, // int
                    oppRating, // int
                    whiteOrBlack, // string
                    winLossDraw,  // string
                    opening, // string
                    accuracy, // float
                    oppAccuracy, //float
                    easilyPreventableLoss, // bool
                    gotLucky, // bool
                    numTurns, // int
                    timeControl, // string (e.g. "rapid30", "bullet1", etc.)
                    remarks, // string
               );
addGameToTable(game11, "./");

let game12 = new ChessGameData(
                    date, // YYYYMMDD string
                    opponent, // string
                    rating, // int
                    oppRating, // int
                    whiteOrBlack, // string
                    winLossDraw,  // string
                    opening, // string
                    accuracy, // float
                    oppAccuracy, //float
                    easilyPreventableLoss, // bool
                    gotLucky, // bool
                    numTurns, // int
                    timeControl, // string (e.g. "rapid30", "bullet1", etc.)
                    remarks, // string
               );
addGameToTable(game12, "./");

let game13 = new ChessGameData(
                    date, // YYYYMMDD string
                    opponent, // string
                    rating, // int
                    oppRating, // int
                    whiteOrBlack, // string
                    winLossDraw,  // string
                    opening, // string
                    accuracy, // float
                    oppAccuracy, //float
                    easilyPreventableLoss, // bool
                    gotLucky, // bool
                    numTurns, // int
                    timeControl, // string (e.g. "rapid30", "bullet1", etc.)
                    remarks, // string
               );
addGameToTable(game13 "./");
*/

