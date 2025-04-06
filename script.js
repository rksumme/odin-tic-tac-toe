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

// Manages DOM elements added 
function manageOutput() {
    playerFunctions = GameController();
    players = playerFunctions.getPlayers();

    const optionsElement = document.querySelector('.game-options');
    optionsElement.innerHTML = '';
    const restartBtn = document.createElement('button');
    restartBtn.textContent = "Restart Round";
    const resetBtn = document.createElement('button');
    resetBtn.textContent = "Reset Game";
    optionsElement.appendChild(restartBtn);
    optionsElement.appendChild(resetBtn);

    // Event listeners for added buttons
    restartBtn.addEventListener('click', () => {
        GameControllerInstance.restartGame();
    });

    resetBtn.addEventListener('click', () => {
        GameControllerInstance.resetGame();
    })
}

// Controls overall flow of the game
function GameController() {
    // Calls Grid functions and builds 2D grid
    const board = Grid();

    // Assigns players to either X or O 
    let players = [
        {
            name: '',
            identity: "X",
            index: 0,
            score: 0
        },
        {
            name: '',
            identity: "O",
            index: 1,
            score: 0
        }
    ];

    const getPlayers = () => players;

    // Player X goes first
    let activePlayer = players[0];

    // Updates turn display with current player
    const updateTurnDisplay = () => {
        const turnElement = document.querySelector('.turn-keeper');
        if (turnElement) {
            turnElement.innerHTML = '';
            const turnKeeper = document.createElement('h3');
            turnKeeper.classList.add('turn-title');
            
            const displayName = activePlayer.name || activePlayer.identity;
            turnKeeper.textContent = `${displayName}'s turn`;
            turnElement.appendChild(turnKeeper);
        }
    };

    // Process player name form submission
    const startGame = () => {
        const player1 = document.getElementById('p1-name').value;
        const player2 = document.getElementById('p2-name').value;

        players[0].name = player1;
        players[1].name = player2;

        document.getElementById('player-entry').style.display = 'none';

        updateTurnDisplay();
    }

    // Changes player from current to the other
    const switchTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
        updateTurnDisplay();
    };

    // Allows other functions to access the current player
    const getActivePlayer = () => activePlayer;

    // Updates grid with player's choice
    const printNewRound = () => {
        board.printGrid();
    }

    // Restart game, but keep player names (and eventually scores)
    const restartGame = () => {
        const newBoard = Grid();
        Object.assign(board, newBoard);

        activePlayer = players[0];

        printNewRound();
        updateTurnDisplay();
        winDisplay.textContent = '';
    }

    // Resets game, names, and eventually scores
    const resetGame = () => {
        players[0].name = '';
        players[1].name = '';

        document.getElementById('player-entry').style.display = 'block';
        document.getElementById('board').style.display = 'none';

        restartGame();
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

        // Updates board with player's choice
        printNewRound();

        // Checks win conditions
        const gameStatus = checkGameStatus(board);

        if (gameStatus.status === 'win') {
            const winner = players.find(p => p.identity === gameStatus.winner);
            const winnerName = winner.name || winner.identity;
            
            winner.score = (winner.score || 0) + 1;
            
            updateScoreDisplay();

            displayRoundWinner(gameStatus);
            return;

            // if (winner.score <= 5) {
            //     // finalScore();
            //     restartGame();
            // } else {
            //     displayRoundWinner(winnerName);
            // }

            // return;
        }
        else if (gameStatus.status === 'draw') {
            displayRoundWinner(gameStatus);
            return;
        }

        switchTurn();
    }

    const updateScoreDisplay = () => {
        const scoreElement = document.querySelector('.score-keeper');
        if (scoreElement) {
            scoreElement.innerHTML = '';

            const player1Score = document.createElement('p');
            player1Score.textContent = `${players[0].name || "Player X"}: ${players[0].score}`;
            scoreElement.appendChild(player1Score);

            const player2Score = document.createElement('p');
            player2Score.textContent = `${players[1].name || "Player O"}: ${players[1].score}`;
            scoreElement.appendChild(player2Score);
        }
    }

    const displayRoundWinner = (gameStatus) => {
        const winElement = document.querySelector('.win-condition');
        winElement.innerHTML = '';

        const winDisplay = document.createElement('div');

        if (gameStatus.status === 'win') {
            const winner = players.find(p => p.identity === gameStatus.winner);
            const winnerName = winner.name || winner.identity;
            winDisplay.textContent = `${winnerName} wins this round!`
        } else if (gameStatus === 'draw') {
            winDisplay.textContent = `It's a draw... No points`;
        } else {
            return;
        }

        winElement.appendChild(winDisplay);
    }

    const initFormListener = () => {
        const form = document.getElementById('player-entry');
        if (form) {
            form.addEventListener('submit', function(event) {
                event.preventDefault();
                startGame();
            });
        } else {
            console.error('Try again stinky')
        }
    }

    return {
        getPlayers,
        getActivePlayer,
        printNewRound,
        playRound,
        initFormListener,
        restartGame,
        resetGame,
        updateTurnDisplay,
        updateScoreDisplay
    };
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
    window.GameControllerInstance = GameController()
    GameControllerInstance.printNewRound();
    GameControllerInstance.initFormListener();
    GameControllerInstance.updateTurnDisplay();
    manageOutput();
}

// Starts game when page is loaded
window.addEventListener('DOMContentLoaded', initGame);
