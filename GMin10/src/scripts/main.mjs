/* Node stuff: commented out for the live site

import {ChessGameData} from "./chessGameData.mjs";
import * as fs from "fs";
import {fileURLToPath} from "url";
import * as path from "path";

// to the system, by running a node command. 
function addGameToTable(game) {
    let oldTable = fs.readFileSync("/home/sgibber/Projects/GMin10/src/gameData/myGames20230319toPresent.json", "utf8");
    let table = JSON.parse(oldTable);
    table.push(game);
    let newTable = JSON.stringify(table);
    fs.writeFileSync("../gameData/myGames20230319toPresent.json", newTable);
}

let game = new ChessGameData (
                date, // YYYYMMDD string
                opponent, // string
                rating, // int
                oppRating, // int
                whiteOrBlack, // string
                winLossDraw,  // string
                opening, // string
                acc, // float
                oppAcc, //float
                easilyPreventableLoss, // bool
                gotLucky, // bool
                numTurns, // int
                numBlunders, // int
                timeControl, // string (e.g. "rapid30", "bullet1", etc.)
                remarks, // string
               );

addGameToTable(game);
*/
