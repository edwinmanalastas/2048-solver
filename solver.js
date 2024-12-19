let solverRunning = false;
let solverSpeed = 100;
let solverInterval;

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
    document.querySelector(".score-box").classList.add("hidden");
    document.querySelector(".auto-button").innerText = "Stop"; // Change button text
    autoPlay(); // Start the solver
}

function stopSolver() {
    solverRunning = false;
    clearTimeout(solverInterval);
    score = 0; // Reset the score to 0
    document.getElementById("score").innerText = score; // Update the displayed score
    document.querySelector(".score-box").classList.remove("hidden");
    document.querySelector(".auto-button").innerText = "Auto-Solve"; // Change button text
}

function evaluateBoard(board) {
    let monotonicity = calculateMonotonicity(board);
    let smoothness = calculateSmoothness(board);
    let emptyTiles = countEmptyTiles(board);
    let cornerScore = calculateCornerScore(board);
    let maxTile = Math.max(...board.flat());
    let maxTileInTopLeft = board[0][0] === maxTile ? 100 : -100; 
    
    return (
        1 * monotonicity + 
        0.5 * smoothness + 
        5 * emptyTiles + 
        3 * cornerScore +
        3 * maxTileInTopLeft
    );
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
    if (depth === 0 || !hasEmptyTile() || !hasValidMoves(board)) {
        return evaluateBoard(board); // Evaluate board at leaf node or terminal state
    }

    if (isMaximizingPlayer) {
        let maxEval = -Infinity;
        for (let move of getPossibleMoves(board)) {
            let newBoard = makeMove(board, move);
            let eval = minimax(newBoard, depth - 1, false, alpha, beta);
            maxEval = Math.max(maxEval, eval);
            alpha = Math.max(alpha, eval);
            if (beta <= alpha) break; // Prune remaining branches
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        let possiblePlacements = getPossiblePlacements(board);
        for (let placement of possiblePlacements) {
            let newBoard = placeRandomTile(board, placement);
            let eval = minimax(newBoard, depth - 1, true, alpha, beta);
            minEval = Math.min(minEval, eval);
            beta = Math.min(beta, eval);
            if (beta <= alpha) break; // Prune remaining branches
        }
        return minEval;
    }
}

function iterativeDeepening(board, maxDepth) {
    let bestMove = null;
    let maxEval = -Infinity;

    for (let depth = 1; depth <= maxDepth; depth++) {
        let currentBestMove = null;
        let currentMaxEval = -Infinity;

        for (let move of getPossibleMoves(board)) {
            let newBoard = makeMove(board, move);
            let eval = minimax(newBoard, depth, false, -Infinity, Infinity);
            if (eval > currentMaxEval) {
                currentMaxEval = eval;
                currentBestMove = move;
            }
        }

        // Update best move only if a better evaluation is found
        if (currentMaxEval > maxEval) {
            maxEval = currentMaxEval;
            bestMove = currentBestMove;
        }
    }

    return bestMove;
}

function calculateCornerScore(board) {
    // Define a weight matrix that ensures the snake pattern
    const weightMatrix = [
        [15, 14, 13, 12],
        [8, 9, 10, 11],
        [7, 6, 5, 4], 
        [0, 1, 2, 3],
    ];

    let score = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            // Add weight for higher values in the desired positions
            score += board[r][c] * weightMatrix[r][c];
        }
    }
    return score;
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
    newBoard[placement.r][placement.c] = 2;
    return newBoard;
}

function autoPlay() {
    if (!solverRunning) return; // Exit if the solver has been stopped

    let maxDepth = 6; // Adjustable based on performance
    let bestMove = iterativeDeepening(board, maxDepth);

    if (bestMove) {
        let originalBoard = JSON.parse(JSON.stringify(board));

        if (bestMove == "left") slideLeft();
        if (bestMove == "right") slideRight();
        if (bestMove == "up") slideUp();
        if (bestMove == "down") slideDown();

        // if move occured
        if (isBoardChanged(originalBoard, board)) {
            setTwoFour(); 

            // Update Score
            document.getElementById("score").innerText = score;
            checkWin();
        }
    }
    

    if (hasEmptyTile() || hasValidMoves(board)) {
        solverInterval = setTimeout(autoPlay, solverSpeed); // Use the dynamic solverSpeed
    } else {
        stopSolver(); // Stop the solver if no moves are left
        alert("No more valid moves! Solver failed to solve.");
    }
}
