// Node stuff: commented out for the live site

/*

import {ChessGameData} from "./chessGameData.mjs";
import * as fs from "fs";
import {fileURLToPath} from "url";
import * as path from "path";

// Save a game to the system, by running a node command. 
function addGameToTable(game) {
    // Get and parse move list:
    let moveList = fs.readFileSync("<path_to_move_list_here>", "utf8").replace(/\n+/g, "");
    game.moveList = moveList;

    // Get the table:
    let oldTable = fs.readFileSync("/home/sgibber/Projects/GMin10/src/gameData/myGames20230319toPresent.json", "utf8");
    let table = JSON.parse(oldTable);

    // Push to table and re-write it:
    table.push(game);
    let newTable = JSON.stringify(table);
    fs.writeFileSync("../gameData/myGames20230319toPresent.json", newTable);
}

let game = new ChessGameData (
                "20230322", // YYYYMMDD string
                opponent, // string
                815, // int
                , // int
                whiteOrBlack, // string
                winLossDraw,  // string
                opening, // string
                acc, // float
                oppAcc, //float
                easilyPreventableLoss, // bool
                gotLucky, // bool
                numTurns, // int
                numBlunders, // int
                "rapid30", // string (e.g. "rapid30", "bullet1", etc.)
                remarks, // string
               );

addGameToTable(game);

*/

