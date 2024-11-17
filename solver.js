let solverRunning = false;

document.addEventListener("DOMContentLoaded", function() {
    const autoButton = document.querySelector(".auto-button");

    autoButton.addEventListener("click", function() {
        if (solverRunning) {
            stopSolver(); // Stop the solver
        } else {
            startSolver(); // Start the solver
        }
    });
});

function startSolver() {
    solverRunning = true;
    document.querySelector(".auto-button").innerText = "Stop"; // Change button text
    autoPlay(); // Start the solver
}

function stopSolver() {
    solverRunning = false;
    document.querySelector(".auto-button").innerText = "Auto-Solve"; // Change button text
}


function startAutoPlay() {
    autoPlay();
}

function evaluateBoard(board) {
    let monotonicity = calculateMonotonicity(board);
    let smoothness = calculateSmoothness(board);
    let emptyTiles = countEmptyTiles(board);
    let cornerScore = calculateCornerScore(board); // New component for corner tiles
    
    return 1.0 * monotonicity + 0.5 * smoothness + 2.0 * emptyTiles + 1.5 * cornerScore;
}

function calculateCornerScore(board) {
    const corners = [
        board[0][0], board[0][columns - 1],
        board[rows - 1][0], board[rows - 1][columns - 1]
    ];
    return Math.max(...corners); // Favor high-value tiles in corners
}


function calculateMonotonicity(board) {
    let score = 0;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 1; c++) {
            if (board[r][c] > 0 && board[r][c + 1] > 0) {
                score -= Math.abs(board[r][c] - board[r][c + 1]);
            }
        }
    }

    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 1; r++) {
            if (board[r][c] > 0 && board[r + 1][c] > 0) {
                score -= Math.abs(board[r][c] - board[r + 1][c]);
            }
        }
    }

    return score;
}

function calculateSmoothness(board) {
    let score = 0;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 1; c++) {
            if (board[r][c] == board[r][c + 1]) {
                score += board[r][c];
            }
        }
    }

    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 1; r++) {
            if (board[r][c] == board[r + 1][c]) {
                score += board[r][c];
            }
        }
    }

    return score;
}

function countEmptyTiles(board) {
    return board.flat().filter(tile => tile == 0).length;
}

function minimax(board, depth, isMaximizingPlayer, alpha, beta) {
    if (depth == 0 || !hasEmptyTile()) {
        return evaluateBoard(board);
    }

    if (isMaximizingPlayer) {
        let maxEval = -Infinity;
        for (let move of getPossibleMoves(board)) {
            let newBoard = makeMove(board, move);
            let eval = minimax(newBoard, depth - 1, false, alpha, beta);
            maxEval = Math.max(maxEval, eval);
            alpha = Math.max(alpha, eval);
            if (beta <= alpha) break;
        }
        return maxEval;
    } else {
        // Simulate the computer placing a random tile
        let minEval = Infinity;
        let possiblePlacements = getPossiblePlacements(board);
        for (let placement of possiblePlacements) {
            let newBoard = placeRandomTile(board, placement);
            let eval = minimax(newBoard, depth - 1, true, alpha, beta);
            minEval = Math.min(minEval, eval);
            beta = Math.min(beta, eval);
            if (beta <= alpha) break;
        }
        return minEval;
    }
}

function canMove(board, direction) {
    if (direction === "left") {
        for (let r = 0; r < rows; r++) {
            for (let c = 1; c < columns; c++) {
                // Check if the current tile can move left
                if (board[r][c] > 0 && (board[r][c - 1] === 0 || board[r][c - 1] === board[r][c])) {
                    return true;
                }
            }
        }
    } else if (direction === "right") {
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns - 1; c++) {
                // Check if the current tile can move right
                if (board[r][c] > 0 && (board[r][c + 1] === 0 || board[r][c + 1] === board[r][c])) {
                    return true;
                }
            }
        }
    } else if (direction === "up") {
        for (let c = 0; c < columns; c++) {
            for (let r = 1; r < rows; r++) {
                // Check if the current tile can move up
                if (board[r][c] > 0 && (board[r - 1][c] === 0 || board[r - 1][c] === board[r][c])) {
                    return true;
                }
            }
        }
    } else if (direction === "down") {
        for (let c = 0; c < columns; c++) {
            for (let r = 0; r < rows - 1; r++) {
                // Check if the current tile can move down
                if (board[r][c] > 0 && (board[r + 1][c] === 0 || board[r + 1][c] === board[r][c])) {
                    return true;
                }
            }
        }
    }
    return false;
}

function hasValidMoves(board) {
    return getPossibleMoves(board).length > 0;
}



function getPossibleMoves(board) {
    return ["left", "right", "up", "down"].filter(move => canMove(board, move));
}

function makeMove(board, move) {
    let newBoard = JSON.parse(JSON.stringify(board)); // Deep copy

    if (move === "left") {
        for (let r = 0; r < rows; r++) {
            newBoard[r] = slide(newBoard[r]);
        }
    } else if (move === "right") {
        for (let r = 0; r < rows; r++) {
            newBoard[r] = slide(newBoard[r].reverse()).reverse();
        }
    } else if (move === "up") {
        for (let c = 0; c < columns; c++) {
            let col = [newBoard[0][c], newBoard[1][c], newBoard[2][c], newBoard[3][c]];
            col = slide(col);
            for (let r = 0; r < rows; r++) {
                newBoard[r][c] = col[r];
            }
        }
    } else if (move === "down") {
        for (let c = 0; c < columns; c++) {
            let col = [newBoard[0][c], newBoard[1][c], newBoard[2][c], newBoard[3][c]];
            col = slide(col.reverse()).reverse();
            for (let r = 0; r < rows; r++) {
                newBoard[r][c] = col[r];
            }
        }
    }
    return newBoard;
}


function getPossiblePlacements(board) {
    let placements = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) placements.push({ r, c });
        }
    }
    return placements;
}

function placeRandomTile(board, placement) {
    let newBoard = JSON.parse(JSON.stringify(board)); // Deep copy
    newBoard[placement.r][placement.c] = Math.random() < 0.9 ? 2 : 4;
    return newBoard;
}

function autoPlay() {
    if (!solverRunning) return;

    let depth = 3; // Higher depth
    let bestMove = null;
    let maxEval = -Infinity;

    const moves = ["left", "down", "up", "right"]; // Prefer left and down first
    for (let move of moves) {
        if (canMove(board, move)) {
            let newBoard = makeMove(board, move);
            let eval = minimax(newBoard, depth, false, -Infinity, Infinity);
            if (eval > maxEval) {
                maxEval = eval;
                bestMove = move;
            }
        }
    }

    if (bestMove) {
        if (bestMove == "left") slideLeft();
        if (bestMove == "right") slideRight();
        if (bestMove == "up") slideUp();
        if (bestMove == "down") slideDown();
        setTwoFour();
        document.getElementById("score").innerText = score;
        checkWin();
    }

    if (hasEmptyTile() || hasValidMoves(board)) {
        setTimeout(autoPlay, 1);
    } else {
        stopSolver();
        alert("No more valid moves! Solver stopped.");
    }
}
