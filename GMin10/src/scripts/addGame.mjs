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

