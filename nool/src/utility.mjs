// Returns a random number within a range (start inclusive, end exclusive):
export function randInt(start, end) { 
    return Math.floor(Math.random() * (end - start)) + start;
}

// Returns a random element from an array:
export function randElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

