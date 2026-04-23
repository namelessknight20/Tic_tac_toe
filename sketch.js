// Tic Tac Toe AI with Minimax Algorithm
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/challenges/154-tic-tac-toe-minmax
// https://youtu.be/I64-UTORVfU
// https://editor.p5js.org/codingtrain/sketches/0zyUhZdJD

let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

let w;
let h;

let ai = 'X';
let human = 'O';
let currentPlayer = human;
let resultP;

// The Minimax algorithm with Alpha-Beta Pruning
function minimax(board, depth, isMaximizing, alpha, beta) {
    let result = checkWinner();
    if (result.winner !== null) {
        return scores[result.winner];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] == '') {
                    board[i][j] = ai;
                    let score = minimax(board, depth + 1, false, alpha, beta);
                    board[i][j] = '';
                    bestScore = max(score, bestScore);
                    alpha = max(alpha, bestScore);
                    if (beta <= alpha) {
                        break;
                    }
                }
            }
            if (beta <= alpha) {
                break;
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] == '') {
                    board[i][j] = human;
                    let score = minimax(board, depth + 1, true, alpha, beta);
                    board[i][j] = '';
                    bestScore = min(score, bestScore);
                    beta = min(beta, bestScore);
                    if (beta <= alpha) {
                        break;
                    }
                }
            }
            if (beta <= alpha) {
                break;
            }
        }
        return bestScore;
    }
}

let scores = {
    X: 10,
    O: -10,
    tie: 0
};

function bestMove() {
    // Check for a winner before the AI makes a move
    let result = checkWinner();
    if (result.winner != null) {
        return;
    }

    let bestScore = -Infinity;
    let move;
    let openSpots = 0;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] == '') {
                openSpots++;
            }
        }
    }
    
    // AI goes first if the board is empty
    if (openSpots === 9) {
        // Pick a random corner, for a less predictable start
        let corners = [{i: 0, j: 0}, {i: 0, j: 2}, {i: 2, j: 0}, {i: 2, j: 2}];
        move = random(corners);
    } else {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] == '') {
                    board[i][j] = ai;
                    let score = minimax(board, 0, false, -Infinity, Infinity);
                    board[i][j] = '';
                    if (score > bestScore) {
                        bestScore = score;
                        move = { i, j };
                    }
                }
            }
        }
    }
    
    if (move) {
        board[move.i][move.j] = ai;
        currentPlayer = human;
    }
}

function equals3(a, b, c) {
    return a == b && b == c && a != '';
}

// Check for a winner and return the winner and the winning line's coordinates
function checkWinner() {
    let winner = null;
    let line_coords = null;

    // horizontal
    for (let i = 0; i < 3; i++) {
        if (equals3(board[i][0], board[i][1], board[i][2])) {
            winner = board[i][0];
            line_coords = [{ i: i, j: 0 }, { i: i, j: 2 }];
        }
    }

    // Vertical
    for (let i = 0; i < 3; i++) {
        if (equals3(board[0][i], board[1][i], board[2][i])) {
            winner = board[0][i];
            line_coords = [{ i: 0, j: i }, { i: 2, j: i }];
        }
    }

    // Diagonal
    if (equals3(board[0][0], board[1][1], board[2][2])) {
        winner = board[0][0];
        line_coords = [{ i: 0, j: 0 }, { i: 2, j: 2 }];
    }
    if (equals3(board[2][0], board[1][1], board[0][2])) {
        winner = board[2][0];
        line_coords = [{ i: 2, j: 0 }, { i: 0, j: 2 }];
    }

    let openSpots = 0;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] == '') {
                openSpots++;
            }
        }
    }

    if (winner == null && openSpots == 0) {
        return { winner: 'tie', line_coords: null };
    } else {
        return { winner: winner, line_coords: line_coords };
    }
}

function mousePressed() {
    if (currentPlayer == human) {
        let i = floor(mouseX / w);
        let j = floor(mouseY / h);
        if (board[i][j] == '') {
            board[i][j] = human;
            currentPlayer = ai;
            bestMove();
        }
    }
}

// New function to draw the winning line
function drawWinningLine(line_coords) {
    strokeWeight(10);
    stroke(255, 0, 0); // Red color for the winning line

    let startX = w * line_coords[0].i + w / 2;
    let startY = h * line_coords[0].j + h / 2;
    let endX = w * line_coords[1].i + w / 2;
    let endY = h * line_coords[1].j + h / 2;

    line(startX, startY, endX, endY);
}

function setup() {
    let canvas = createCanvas(400, 400);
    canvas.parent('p5-canvas');
    w = width / 3;
    h = height / 3;
    resultP = select('#result');
    bestMove();
}

function draw() {
    background(255);
    strokeWeight(4);

    line(w, 0, w, height);
    line(w * 2, 0, w * 2, height);
    line(0, h, width, h);
    line(0, h * 2, width, h * 2);

    for (let j = 0; j < 3; j++) {
        for (let i = 0; i < 3; i++) {
            let x = w * i + w / 2;
            let y = h * j + h / 2;
            let spot = board[i][j];
            textSize(32);
            let r = w / 4;
            if (spot == human) {
                noFill();
                ellipse(x, y, r * 2);
            } else if (spot == ai) {
                line(x - r, y - r, x + r, y + r);
                line(x + r, y - r, x - r, y + r);
            }
        }
    }

    let result = checkWinner();
    if (result.winner != null) {
        noLoop();
        if (result.winner == 'tie') {
            resultP.html('Tie!');
        } else {
            resultP.html(`${result.winner} wins!`);
            // Draw the winning line
            drawWinningLine(result.line_coords);
        }
    }
}
