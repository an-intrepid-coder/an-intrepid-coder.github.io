/* Stuff to be used in an interactive node REPL during play and testing.  
   This means making it a self-contained script to handle .load properly.
   Will contain some basic dice rolling functions and some table-handling
   functions as the setting grows.  */

// Returns a random number within a range (start inclusive, end exclusive):
function randInt(start, end) { 
    return Math.floor(Math.random() * (end - start)) + start;
}

// Might make some much more complex ones later
function rollDice(numDice) {
    let results = [];
    let total = 0;
    for (let i = 0; i < numDice; i++) {
        let roll = randInt(1, 7);
        total += roll;
        results.push(roll);
    }
    return {total: total, rolls: results};
}

