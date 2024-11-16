var board;
var score = 0;
var rows = 4;
var columns = 4;

window.onload = function() {
    setGame();
}

function setGame() {
    board = [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ]

    // Example Board
    // board = [
    //     [2,2,2,2],
    //     [2,2,2,2],
    //     [4,4,8,8],
    //     [4,4,8,8]
    // ]


    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            // creates a <div>"0-0"</div> tag
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            // update every slide
            updateTile(tile, num);
            // add to our board
            document.getElementById("board").append(tile);
        }
    }

    setTwoFour();
    setTwoFour();
}

// Return false if board is full
function hasEmptyTile() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) {
                return true
            }
        }
    }
    return false
}
// Implement Random Game (without example board)
// everytime we move tiles up,down,left,right.
// if theres empty open tile, we call this function
function setTwoFour() {
    // see if board if full
    if (!hasEmptyTile()) {
        return;
    }

    let found = false;
    // get 2 random indices from row/column. and check if empty
    // if so, place 2 there.
    while (!found) {
        // random r, c
        let r = Math.floor(Math.random() * rows); // (0-1 * 4) -> (0.15,3.24) -> (0,3)
        let c = Math.floor(Math.random() * columns);

        // if empty
        if (board[r][c] == 0) {
            // Determine whether to place a 2 or a 4 (90% chance for 2, 10% for 4)
            let num = Math.random() < 0.9 ? 2 : 4; // 90% chance for 2
            board[r][c] = num;

            // Update the HTML
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = num.toString();
            tile.classList.add("x" + num.toString());
            found = true;
        }
    }
}

function updateTile(tile, num) {
    // clear the tile and classList "tile x2 x4 x8"
    tile.innerText = "";
    tile.classList.value = ""; 
    // update number passed in
    tile.classList.add("tile");

    if (num > 0) {
        tile.innerText = num.toString();
        if (num <= 4096) {
            // add x2,4,8,..4096
            tile.classList.add("x"+num.toString());
        } else {
            tile.classList.add("x8192");
        }
    }
}

// Move arrow keys
// Implementation
// We first clear zeroes, merge, clear zeroes again, put zeroes back
// [2,2,2,0] -> [2,2,2] -> [4,0,2] -> [4,2] -> [4,2,0,0]

// When you type something and let go (keyup)
document.addEventListener("keyup", (e) => { //e is event
    if (e.code == "ArrowLeft") {
        slideLeft();
        setTwoFour();
    }
    else if (e.code == "ArrowRight") {
        slideRight();
        setTwoFour();
    }
    else if (e.code == "ArrowUp") {
        slideUp();
        setTwoFour();
    }
    else if (e.code == "ArrowDown") {
        slideDown();
        setTwoFour();
    }
    // Update Score
    document.getElementById("score").innerText = score;
})

function filterZero(row) {
    // create a new array like origina without zeroes
    // has to follow the conditions (take all nums except 0)
    return row.filter(num => num != 0);
}

function slide(row) {
    // [0,2,2,2] example
    row = filterZero(row); // get rid of zeroes -> [2,2,2]

    //slide
    for (let i=0; i < row.length-1; i++) { // -1 to not go out of bounds
        //check every 2
        if (row[i] == row[i+1]) { // if row equal to 1 ahead
            row[i] *= 2; // double it
            row[i+1] = 0; // second one becomes 0
            score += row[i]; // increment score by doubled value
        } // [2,2,2] -> [4,0 ,2]
    }
    // we want to filter out zero again. [4,0,2] -> [4,2]
    row = filterZero(row); 

    // add zeroes back
    while (row.length < columns) { // while row != 4
        row.push(0);
    } // [4,2] -> [4,2,0,0]
    return row;
}

// iterate through each row
function slideLeft() {
    for (let r=0; r < rows; r++) {
        let row = board[r];
        // call slide function, modifies array
        row = slide(row);
        // assign updated row back to that specific row
        board[r] = row;

        // update our HTML
        for (let c =0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString()); 
            let num = board[r][c];
            updateTile(tile,num)
        }
    }

} 

// if you reverse array, then slide Left, reverse it again
// it's basically slide right
function slideRight() {
    for (let r=0; r < rows; r++) {
        let row = board[r]; 
        row.reverse();
        row = slide(row);
        row.reverse();
        board[r] = row;

        for (let c =0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString()); 
            let num = board[r][c];
            updateTile(tile,num)
        }
    }
}

function slideUp() {
    for (let c=0; c < columns; c++) {
        // turn column into an array
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);
        // board[0][c] = row[0];
        // board[1][c] = row[1];
        // board[2][c] = row[2];
        // board[3][c] = row[3];

        for (let r =0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString()); 
            let num = board[r][c];
            updateTile(tile,num)
        }
    }
}

// similar to slideRight, we reverse
function slideDown() {
    for (let c=0; c < columns; c++) {
        // turn column into an array
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse()
        row = slide(row);
        row.reverse()
        // board[0][c] = row[0];
        // board[1][c] = row[1];
        // board[2][c] = row[2];
        // board[3][c] = row[3];

        for (let r =0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString()); 
            let num = board[r][c];
            updateTile(tile,num)
        }
    }
}