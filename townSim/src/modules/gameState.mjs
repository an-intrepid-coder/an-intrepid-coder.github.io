import {randInRange, randomIndex, coinFlip} from "./utility.mjs";
import {MAP_SIZE} from "./constants.mjs";

let terrainTypes = ["unset", "grass", "trees", "dirt", "water"];

class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.terrain = "unset";
        // more to come (TODO)
    }
}

let interfaceModes = ["main"];

export class GameState {
    constructor() { 
        this.interfaceMode = "main"; 
        this.mapCellsHigh = MAP_SIZE;
        this.mapCellsWide = MAP_SIZE;
        this.cells = [];
        for (let y = 0; y < this.mapCellsHigh; y++) {
            for (let x = 0; x < this.mapCellsWide; x++) {
                this.cells.push(new Cell(x, y));
            }
        }
        // NOTE: terrain stamping must occur in this order:
        this.stampForests();
        this.stampLakes();
        this.stampRivers();
        this.stampGrass();
    }

    stampGrass() {
        for (let y = 0; y < this.mapCellsHigh; y++) {
            for (let x = 0; x < this.mapCellsWide; x++) {
                let index = y * this.mapCellsWide + x;
                let cell = this.cells[index];
                if (cell.terrain == "unset") cell.terrain = "grass";
            }
        }
    }

    stampForests() {
        for (let y = 0; y < this.mapCellsHigh; y++) {
            for (let x = 0; x < this.mapCellsWide; x++) {
                let index = y * this.mapCellsWide + x;
                let isForest = coinFlip();
                if (isForest) {
                    this.cells[index].terrain = "trees";
                }
            }
        }    
        let generations = 2;
        let threshold = 4;
        let nextGen = [];
        for (let y = 0; y < this.mapCellsHigh; y++) {
            for (let x = 0; x < this.mapCellsWide; x++) {
                let index = y * this.mapCellsWide + x;
                let newCell = new Cell(x, y);
                newCell.terrain = this.cells[index].terrain;
                nextGen.push(newCell);
            }
        }
        for (let i = 0; i < generations; i++) {
            for (let y = 0; y < this.mapCellsHigh; y++) {
                for (let x = 0; x < this.mapCellsWide; x++) {
                    let index = y * this.mapCellsWide + x;
                    let count = 0;
                    let neighbors = this.getCellNeighbors(x, y);
                    for (let cell of neighbors) {
                        if (cell.terrain == "trees") {
                            count++;
                        }
                    }
                    let cell = nextGen[index];
                    if (count >= threshold) {
                        cell.terrain = "trees";
                    } else {
                        cell.terrain = "unset";
                    }
                }
            }
        }
        this.cells = nextGen;
    }

    stampLakes() {
        for (let y = 1; y < this.mapCellsHigh - 1; y++) {
            for (let x = 1; x < this.mapCellsWide - 1; x++) {
                let index = y * this.mapCellsWide + x;
                let cell = this.cells[index];
                let isWater = Math.random() < .21;
                if (isWater && cell.terrain == "unset") {
                    this.cells[index].terrain = "water";
                }
            }
        }    
    }


    stampRivers() { // just one river for now
        let orientation = coinFlip() ? "vertical" : "horizontal";
        let current = {x: 0, y: 0};
        // Determine starting point:
        let offset = Math.floor(Math.random() * 33);
        if (coinFlip()) offset = offset * -1;
        if (orientation == "vertical") {
            current.x = Math.floor(this.mapCellsWide / 2) + offset;
        } else {
            current.y = Math.floor(this.mapCellsHigh / 2) + offset;
        }
        // wander drunkenly to far edge:
        for (;;) {
            if (orientation == "vertical" && current.y == this.mapCellsHigh) break;
            else if (orientation == "horizontal" && current.x == this.mapCellsWide) break;
            let splotchMax = 12;
            let splotchMin = 8;
            let splotchVolume = Math.floor(Math.random() * (splotchMax - splotchMin)) + splotchMin;
            let splotchHalf = Math.floor(splotchVolume / 2);
            let wander = randInRange(0, 3);
            if (coinFlip()) wander = wander * -1;
            if (orientation == "vertical") {
                for (let x = current.x - splotchHalf; x <= current.x + splotchHalf; x++) {
                    let cell = this.cells[current.y * this.mapCellsHigh + x];
                    cell.terrain = "water";
                }
                current.y++;
                current.x += wander;
            } else {
                for (let y = current.y - splotchHalf; y <= current.y + splotchHalf; y++) {
                    let cell = this.cells[y * this.mapCellsHigh + current.x];
                    console.log(`${y}, ${current.x}`);
                    cell.terrain = "water";
                }
                current.x++;
                current.y += wander;
            }
        }
        // smooth waterways with a CA:
        let generations = 3;
        let threshold = 4; 
        let nextGen = [];
        for (let y = 0; y < this.mapCellsHigh; y++) {
            for (let x = 0; x < this.mapCellsWide; x++) {
                let index = y * this.mapCellsWide + x;
                let newCell = new Cell(x, y);
                newCell.terrain = this.cells[index].terrain;
                nextGen.push(newCell);
            }
        }
        for (let i = 0; i < generations; i++) {
            for (let y = 1; y < this.mapCellsHigh - 1; y++) {
                for (let x = 1; x < this.mapCellsWide - 1; x++) {
                    let index = y * this.mapCellsWide + x;
                    let count = 0;
                    let neighbors = this.getCellNeighbors(x, y);
                    for (let cell of neighbors) {
                        if (cell.terrain == "water") {
                            count++;
                        }
                    }
                    let cell = nextGen[index];
                    if (count >= threshold) {
                        cell.terrain = "water";
                    } else if (cell.terrain != "trees") {
                        cell.terrain = "unset";
                    }
                }
            }
        }
        this.cells = nextGen;
    }

    getCellTerrain(x, y) {
        return this.cells[y * this.mapCellsWide + x].terrain;
    }

    getCellNeighbors(x, y) {
        let neighbors = [];
        for (let i = y - 1; i < y + 2; i++) {
            for (let j = x - 1; j < x + 2; j++) { 
                if (i > 0 && j > 0 && i < this.mapCellsHigh && j < this.mapCellsWide) {
                    let index = i * this.mapCellsWide + j;
                    neighbors.push(this.cells[index]);
                }
            }
        }
        return neighbors;
    }

}

