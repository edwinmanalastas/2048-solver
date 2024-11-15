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
}i

function updateTile(tile, num) {
    // clear the tile and classList "tile x2 x4 x8"
    tile.innerText = "";
    tile.classList.value = ""; 
    // update number passed in
    tile.classList.add("tile");

    if (num > 0) {
        tile.innerText = num;
        if (num <= 4096) {
            // add x2,4,8,..4096
            tile.classList.add("x"+num.toString());
        } else {
            tile.classList.add("x8192");
        }
    }
}