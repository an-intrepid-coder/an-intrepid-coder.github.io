/* This script contains name and word generators. Starting with a default
   one and then with some tuning parameters to encourage this or that sort
   of fantasy or sci-fi word. Meant to be used in the node REPL.  */

// Returns a random number within a range (start inclusive, end exclusive):
function randInt(start, end) { 
    return Math.floor(Math.random() * (end - start)) + start;
}

// Returns a random element from an array:
function randElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/* randomNoolWord results in a variety of names and words which are appropriate for fantasy
   but obviously have no real-world etymology. Eventually, there will be multiple types of
   word generators for different cultures encountered in the game world. This very basic
   generator represents the Nool culture (the first the players encounter), and its name
   was chosen from among the words it generates.  */
function randomNoolWord() {
    let consonants = ["q", "w", "r", "t", "p", "s", "d", "f", "g", "h", 
                      "j", "k", "l", "z", "x", "c", "v", "b", "n", "m", "zh", "gh", "kh"];
    let vowels = ["a", "ae", "e", "ei", "i", "o", "u", "uu", "oo", "y"];
    var word = "";
    let numConsonants = randInt(2, 4);
    for (let i = 0; i < numConsonants; i++) {
        var consonant = randElement(consonants);
        if (i == 0) {
            if (consonant.length == 2) 
                consonant = `${consonant[0].toUpperCase()}${consonant[1]}`;
            else 
                consonant = consonant.toUpperCase();
        }
        word = word.concat(consonant);
        if (i < numConsonants - 1) 
            word = word.concat(randElement(vowels));
    } 
    return word;
}

