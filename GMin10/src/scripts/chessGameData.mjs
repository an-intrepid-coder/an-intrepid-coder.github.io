/* A data object for chess games played online, and another object to act as a table containing them. 
   Eventually this will support a lot of different kinds of analysis.  */

// TODO: Rename to ChessGameMetadata
export class ChessGameData {
    constructor(date, // YYYYMMDD string
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
                moveList = null, // string, but usually parsed and added separately after construction
               ){ // more to come!
        this.date = date;
        this.opponent = opponent;
        this.rating = rating;
        this.oppRating = oppRating;
        this.whiteOrBlack = whiteOrBlack;
        this.winLossDraw = winLossDraw;
        this.opening = opening;
        this.accuracy = accuracy;
        this.oppAccuracy = oppAccuracy;
        this.easilyPreventableLoss = easilyPreventableLoss;
        this.gotLucky = gotLucky;
        this.numTurns = numTurns;
        this.timeControl = timeControl;
        this.remarks = remarks;
    }
}

