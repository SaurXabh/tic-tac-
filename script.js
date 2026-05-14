document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const statusDisplay = document.getElementById('current-player');
    const resetBtn = document.getElementById('reset-btn');
    const winOverlay = document.getElementById('win-overlay');
    const winMessage = document.getElementById('win-message');
    const overlayResetBtn = document.getElementById('overlay-reset-btn');

    let currentPlayer = 'X';
    let gameState = ["", "", "", "", "", "", "", "", ""];
    let gameActive = true;

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    function handleCellClick(clickedCellEvent) {
        const clickedCell = clickedCellEvent.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (gameState[clickedCellIndex] !== "" || !gameActive) {
            return;
        }

        handleCellPlayed(clickedCell, clickedCellIndex);
        handleResultValidation();
    }

    function handleCellPlayed(clickedCell, clickedCellIndex) {
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.innerText = currentPlayer;
        clickedCell.classList.add('taken');
        clickedCell.classList.add(currentPlayer === 'X' ? 'x-mark' : 'o-mark');
        
        // Show reset button once game starts
        resetBtn.classList.remove('hidden');
    }

    function handleResultValidation() {
        let roundWon = false;
        let winningLine = null;

        for (let i = 0; i <= 7; i++) {
            const winCondition = winningConditions[i];
            let a = gameState[winCondition[0]];
            let b = gameState[winCondition[1]];
            let c = gameState[winCondition[2]];
            
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                winningLine = winCondition;
                break;
            }
        }

        if (roundWon) {
            highlightWinningCells(winningLine);
            showWinOverlay(`${currentPlayer} Wins!`);
            gameActive = false;
            return;
        }

        let roundDraw = !gameState.includes("");
        if (roundDraw) {
            showWinOverlay("It's a Draw!");
            gameActive = false;
            return;
        }

        handlePlayerChange();
    }

    function handlePlayerChange() {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusDisplay.innerText = currentPlayer;
        statusDisplay.style.color = currentPlayer === 'X' ? 'var(--accent-blue)' : '#ff3b30';
    }

    function highlightWinningCells(line) {
        line.forEach(index => {
            cells[index].classList.add('win-highlight');
        });
    }

    function showWinOverlay(message) {
        setTimeout(() => {
            winMessage.innerText = message;
            winOverlay.classList.remove('hidden');
        }, 600);
    }

    function handleRestartGame() {
        console.log("Restarting game...");
        gameActive = true;
        currentPlayer = "X";
        gameState = ["", "", "", "", "", "", "", "", ""];
        
        // Reset Status
        statusDisplay.innerText = currentPlayer;
        statusDisplay.parentElement.style.opacity = "1";
        
        // Reset Cells
        cells.forEach(cell => {
            cell.innerText = "";
            cell.classList.remove('taken', 'x-mark', 'o-mark', 'win-highlight');
            cell.style.pointerEvents = "auto";
        });

        // Hide Overlays
        winOverlay.classList.add('hidden');
        resetBtn.classList.add('hidden');
    }

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetBtn.addEventListener('click', handleRestartGame);
    overlayResetBtn.addEventListener('click', handleRestartGame);
});
