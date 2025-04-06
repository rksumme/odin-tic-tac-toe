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

    const getGrid = () => board;

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
                cellElement.textContent = cell.getValue();

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

function Cell() {
    let value = undefined;

    const addValue = (player) => {
        value = player;
    }

    const getValue = () => value;

    return {addValue, getValue};
}

function GameController(playerOne="Player One", playerTwo = "Player Two") {
    const board = Grid();

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

    let activePlayer = players[0];

    const switchTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printGrid();
    }

    const playRound = (row, columns) => {
        const currentBoard = board.getGrid();

        if (currentBoard[row][columns].getValue() !== undefined) {
            console.log("Cell is already taken");
            return;
        }

        currentBoard[row][columns].addValue(activePlayer.identity);

        const gameStatus = checkGameStatus(board);

        if (gameStatus.status === 'win') {
            printNewRound();
            console.log(`${activePlayer.identity} wins!`);
            return;
        }
        else if (gameStatus.status === 'draw') {
            printNewRound();
            console.log("It's a draw!");
            return;
        }

        switchTurn();
        printNewRound();
    }
    return {getActivePlayer, printNewRound, playRound}
}

function checkGameStatus(board) {
    const currentBoard = board.getGrid();
    const gridValues = currentBoard.map(row => row.map(cell => cell.getValue()));

    for (let i = 0; i < 3; i++) {
        if (gridValues[i][0] !== undefined &&
            gridValues[i][0] === gridValues[i][1] &&
            gridValues[i][0] === gridValues[i][2]) {
                return {staus: "win", winner: gridValues[i][0]};
            }
    }

    for (let j = 0; j < 3; j++) {
        if (gridValues[0][j] !== undefined &&
            gridValues[0][j] === gridValues[1][j] &&
            gridValues[1][j] === gridValues[2][j]) {
                return {staus: "win", winner: gridValues[0][j]};
            }
    }

    if (gridValues[0][0] !== undefined &&
        gridValues[0][0] === gridValues[1][1] &&
        gridValues[1][1] === gridValues[2][2]) {
            return {status: "win", winner: gridValues[0][0]};
        }

    if (gridValues[0][2] !== undefined &&
        gridValues[0][2] === gridValues[1][1] &&
        gridValues[1][1] === gridValues[2][0]) {
            return {status: 'win', winner: gridValues[0][2]};
        }

    const isDraw = gridValues.every(row => row.every(cell => cell !== undefined));
    if (isDraw) {
        return {status: 'draw'};
    }

    return {status: 'ongoing'};
}

function initGame() {
    console.log("Game initializing...")
    window.GameControllerInstance = GameController("Player X", "Player O")
    GameControllerInstance.printNewRound();
}

window.addEventListener('DOMContentLoaded', initGame);
