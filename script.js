// Creates tic tac toe 2D object
function Grid() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell())
        }
    }

    // Allows other functions to call the board as needed
    const getGrid = () => board;

    // Prints 2D object as a grid in HTML
    const printGrid = () => {
        const boardElement = document.querySelector('.board');
        boardElement.innerHTML = '';

        board.forEach((row, rowIndex) => {
            const rowElement = document.createElement('div');
            rowElement.classList.add('row');

            row.forEach((cell, colIndex) => {
                const cellElement = document.createElement('div');
                cellElement.classList.add('cell');
                cellElement.dataset.row = rowIndex;
                cellElement.dataset.col = colIndex;
                if (cell.getValue() === 1) {
                    cellElement.textContent = '';
                }
                else if (cell.getValue() !== 1) {
                    cellElement.textContent = cell.getValue();
                }
                
                cellElement.addEventListener('click', () => {
                    GameControllerInstance.playRound(rowIndex, colIndex);
                })

                rowElement.appendChild(cellElement);
            })

            boardElement.appendChild(rowElement);
        })
    };

    return {getGrid, printGrid}
}

// Manages cell changes
function Cell() {
    // Arbitrary placeholder value
    let value = 1;

    // Assigns cell value based on which player clicks on it
    const addValue = (player) => {
        value = player;
    }

    // Allows other functions to get the value of a cell
    const getValue = () => value;

    return {addValue, getValue};
}

// Controls overall flow of the game
function GameController(playerOne="Player One", playerTwo = "Player Two") {
    // Calls Grid functions and builds 2D grid
    const board = Grid();

    // Assigns players to either X or O 
    const players = [
        {
            name: playerOne,
            identity: "X"
        },
        {
            name: playerTwo,
            identity: "O"
        }
    ];

    // Player X goes first
    let activePlayer = players[0];

    // Changes player from current to the other
    const switchTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    // Allows other functions to access the current player
    const getActivePlayer = () => activePlayer;

    // Updates grid with player's choice
    const printNewRound = () => {
        board.printGrid();
    }

    // Controls how player makes choice in the game
    const playRound = (row, columns) => {
        const currentBoard = board.getGrid();

        // Validates if the current cell has already been chosen in this round
        if (currentBoard[row][columns].getValue() !== 1) {
            console.log("Cell is already taken");
            return;
        }

        // Assigns value based on player identity
        currentBoard[row][columns].addValue(activePlayer.identity);

        // Checks win conditions
        const gameStatus = checkGameStatus(board);

        if (gameStatus.status === 'win') {
            printNewRound();
            console.log(`${gameStatus.winner} wins!`);
            return;
        }
        else if (gameStatus.status === 'draw') {
            printNewRound();
            console.log("It's a draw!");
            return;
        }

        // Changes players
        switchTurn();
        // Updates board with players choice
        printNewRound();
    }
    return {getActivePlayer, printNewRound, playRound}
}

function checkGameStatus(board) {
    // Gets most recent version of the grid
    const currentBoard = board.getGrid();
    // Assigns values in grid to another 2D object
    const gridValues = currentBoard.map(row => row.map(cell => cell.getValue()));

    // Loops through each row and checks for matching values
    for (let i = 0; i < 3; i++) {
        if (gridValues[i][0] !== 1 &&
            gridValues[i][0] === gridValues[i][1] &&
            gridValues[i][0] === gridValues[i][2]) {
                return {status: 'win', winner: gridValues[i][0]};
            }
    }

    // Loops through each column and checks for matching values
    for (let j = 0; j < 3; j++) {
        if (gridValues[0][j] !== 1 &&
            gridValues[0][j] === gridValues[1][j] &&
            gridValues[1][j] === gridValues[2][j]) {
                return {status: 'win', winner: gridValues[0][j]};
            }
    }

    // Checks forward and backwards diagonals for matching values
    if (gridValues[0][0] !== 1 &&
        gridValues[0][0] === gridValues[1][1] &&
        gridValues[1][1] === gridValues[2][2]) {
            return {status: 'win', winner: gridValues[0][0]};
        }

    if (gridValues[0][2] !== 1 &&
        gridValues[0][2] === gridValues[1][1] &&
        gridValues[1][1] === gridValues[2][0]) {
            return {status: 'win', winner: gridValues[0][2]};
        }

    // Checks if all cells have values, only runs if no win condition is triggered
    const isDraw = gridValues.every(row => row.every(cell => cell !== 1));
    if (isDraw) {
        return {status: 'draw'};
    }

    // Continues the game if not a draw or if no win condition is triggered
    return {status: 'ongoing'};
}

// Initializes the game in the window and starts a round
function initGame() {
    console.log("Game initializing...")
    window.GameControllerInstance = GameController("Player X", "Player O")
    GameControllerInstance.printNewRound();
}

// Starts game when page is loaded
window.addEventListener('DOMContentLoaded', initGame);
