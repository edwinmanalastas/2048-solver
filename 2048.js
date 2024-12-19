var board;
var score = 0;
var rows = 4;
var columns = 4;
let hasWon = false
/* swipe gestures */
let touchStartX = 0; 
let touchStartY = 0; 
let touchEndX = 0;   
let touchEndY = 0; 

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

    // console.log("Board After Initial Tiles:", board);
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

            //let num = Math.random() < 0.9 ? 2 : 4; // 90% chance for 2
            //board[r][c] = num;
            
            board[r][c] = 2; // Always spawn a 2 (for now)

            // Update the HTML
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            
            // 90% chance for 2, 4 otherwise
            //tile.innerText = num.toString();
            //tile.classList.add("x" + num.toString());
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
    let moved = false;
    let originalBoard = JSON.parse(JSON.stringify(board)); // Clone the board

    if (e.code == "ArrowLeft") {
        slideLeft();
    }
    else if (e.code == "ArrowRight") {
        slideRight();
    }
    else if (e.code == "ArrowUp") {
        slideUp();
    }
    else if (e.code == "ArrowDown") {
        slideDown();
    }

    // Check if the board actually changed
    if (isBoardChanged(originalBoard, board)) {
        moved = true;
    }

    if (moved) {
        setTwoFour(); // Generate a new tile only if the move was valid
         // Update Score
        document.getElementById("score").innerText = score;
        // Check for win condition
        checkWin();
    }
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
    // const beforeSlide = JSON.parse(JSON.stringify(board));
    // console.log("Before Slide Left:", beforeSlide);

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
    // console.log("After Slide Left:", board);
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
    // console.log("After Slide Right:", board);
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
    //console.log("After Slide Up:", board);
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
    // console.log("After Slide Down:", board);
}

/* prevent tile generation when theres an invalid move */
function isBoardChanged(originalBoard, newBoard) {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (originalBoard[r][c] !== newBoard[r][c]) {
                return true; // Board changed
            }
        }
    }
    return false; // No changes
}


function checkWin() {
    if (hasWon) return;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 2048) {
                hasWon = true; 
                // Stop the solver if it's running
                if (solverRunning) {
                    stopSolver();
                }
                // Display the pop-up
                setTimeout(() => {
                    if (confirm("You won! Continue playing?")) {
                        // Continue playing (do nothing)
                        hasWon = true
                    } else {
                        // Reset the game
                        resetGame();
                    }
                }, 100); // Small delay to ensure DOM updates
                return;
            }
        }
    }
}

function resetGame() {
    if (solverRunning) {
        stopSolver();
    }

    score = 0;
    hasWon=false;
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    document.getElementById("score").innerText = score;

    // Clear the board visually
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            updateTile(tile, 0);
        }
    }

    // Add two starting tiles
    setTwoFour();
    setTwoFour();
}

// newGame button
document.addEventListener("DOMContentLoaded", function() {
    const newGameButton = document.querySelector(".newgame-button");
    
    newGameButton.addEventListener("click", function() {
        resetGame();
    });
});


/* swipe gestures */
// Add touchstart and touchend event listeners

document.addEventListener("touchstart", function(e) {
    // Get starting X and Y-coordinate
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener("touchend", function(e) {
    // Get ending X and Y-coordinate
    touchEndX = e.changedTouches[0].clientX; 
    touchEndY = e.changedTouches[0].clientY;
    handleSwipe();
});

// Prevent scrolling during touchmove
document.addEventListener("touchmove", function(e) {
    e.preventDefault();
}, { passive: false });

function handleSwipe() {
    // Calculate horizonta/vertical distance
    let deltaX = touchEndX - touchStartX; 
    let deltaY = touchEndY - touchStartY;

    // Clone the board to compare later
    let originalBoard = JSON.parse(JSON.stringify(board)); // Deep copy of the board

    // Determine if the swipe is primarily horizontal or vertical
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
            slideRight();
        } else {
            slideLeft();
        }
    } else {
        if (deltaY > 0) {
            slideDown();
        } else {
            slideUp();
        }
    }

    // Check if the board state has changed
    if (isBoardChanged(originalBoard, board)) {
        setTwoFour(); // Generate a new tile only if a move occurred
        document.getElementById("score").innerText = score;

        // Check win condition only once
        if (!hasWon) {
            checkWin();
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const speedSlider = document.getElementById("speed-slider");
    const speedValueDisplay = document.getElementById("speed-value");

    // Update solverSpeed when slider changes
    speedSlider.addEventListener("input", function () {
        solverSpeed = parseInt(speedSlider.value, 10); // Convert value to an integer (base 10)
        speedValueDisplay.innerText = `${solverSpeed}`; // Update displayed speed
    });
});

//Disable slider if on mobile device
function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
}

window.onload = function () {
    setGame();
    if (isMobileDevice()) {
        const sliderContainer = document.getElementById("slider-container");
        sliderContainer.classList.add("hidden");
    }
};
