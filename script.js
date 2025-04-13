document.addEventListener('DOMContentLoaded', () => {
    const chessboard = document.querySelector('.chessboard');
    const statusElement = document.querySelector('.status');
    const startBtn = document.getElementById('startBtn');
    const solutionCountElement = document.getElementById('solutionCount');
    const attemptCountElement = document.getElementById('attemptCount');

    let board = Array(8).fill().map(() => Array(8).fill(0));
    let solving = false;
    let solutionCount = 0;
    let attemptCount = 0;
    let delay = 100; // 动画延迟时间（毫秒）

    // 初始化棋盘
    function initializeBoard() {
        chessboard.innerHTML = '';
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const cell = document.createElement('div');
                cell.className = `cell ${(i + j) % 2 === 0 ? 'light' : 'dark'}`;
                const queen = document.createElement('div');
                queen.className = 'queen';
                cell.appendChild(queen);
                chessboard.appendChild(cell);
            }
        }
        board = Array(8).fill().map(() => Array(8).fill(0));
        solutionCount = 0;
        attemptCount = 0;
        updateCounters();
    }

    // 更新计数器显示
    function updateCounters() {
        solutionCountElement.textContent = solutionCount;
        attemptCountElement.textContent = attemptCount;
    }

    // 更新棋盘显示
    function updateBoard() {
        const queens = document.querySelectorAll('.queen');
        board.forEach((row, i) => {
            row.forEach((cell, j) => {
                const index = i * 8 + j;
                queens[index].classList.toggle('visible', cell === 1);
            });
        });
    }

    // 检查位置是否安全
    function isSafe(row, col) {
        // 检查同一行
        for (let j = 0; j < col; j++) {
            if (board[row][j] === 1) return false;
        }

        // 检查左上对角线
        for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
            if (board[i][j] === 1) return false;
        }

        // 检查左下对角线
        for (let i = row, j = col; i < 8 && j >= 0; i++, j--) {
            if (board[i][j] === 1) return false;
        }

        return true;
    }

    // 异步延迟函数
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 使用回溯法解决八皇后问题
    async function solveNQueens(col) {
        if (!solving) return false;

        if (col >= 8) {
            solutionCount++;
            updateCounters();
            await sleep(delay * 2); // 找到解法时多等待一会
            return true;
        }

        for (let i = 0; i < 8; i++) {
            attemptCount++;
            updateCounters();

            if (isSafe(i, col)) {
                board[i][col] = 1;
                updateBoard();
                statusElement.textContent = `当前状态：正在尝试第 ${col + 1} 列，第 ${i + 1} 行`;
                await sleep(delay);

                await solveNQueens(col + 1);

                board[i][col] = 0;
                updateBoard();
                await sleep(delay);
            }
        }

        return false;
    }

    // 开始求解
    startBtn.addEventListener('click', async () => {
        if (solving) return;
        solving = true;
        startBtn.disabled = true;
        statusElement.textContent = '当前状态：开始求解';
        await solveNQueens(0);
        statusElement.textContent = '当前状态：求解完成';
        solving = false;
        startBtn.disabled = false;
    });

    // 初始化
    initializeBoard();
});