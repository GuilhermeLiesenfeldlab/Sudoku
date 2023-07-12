// Function to solve the Sudoku using brute force
async function solveSudoku(board) {
    const size = 9;
    const emptyCell = [0, 0]; // Placeholder for empty cells
  
    // Find empty cell in the board
    function findEmptyCell(board) {
      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          if (board[row][col] === 0) {
            emptyCell[0] = row;
            emptyCell[1] = col;
            return true;
          }
        }
      }
      return false;
    }
  
    // Check if a number can be placed in a specific cell
    function isValid(board, row, col, num) {
      // Check row
      for (let i = 0; i < size; i++) {
        if (board[row][i] === num) {
          return false;
        }
      }
  
      // Check column
      for (let i = 0; i < size; i++) {
        if (board[i][col] === num) {
          return false;
        }
      }
  
      // Check 3x3 box
      const boxRow = Math.floor(row / 3) * 3;
      const boxCol = Math.floor(col / 3) * 3;
      for (let i = boxRow; i < boxRow + 3; i++) {
        for (let j = boxCol; j < boxCol + 3; j++) {
          if (board[i][j] === num) {
            return false;
          }
        }
      }
  
      return true;
    }
  
    // Solve the Sudoku recursively
    async function solve(board) {
      if (!findEmptyCell(board)) {
        return true; // No more empty cells, Sudoku is solved
      }
  
      const [row, col] = emptyCell;
  
      for (let num = 1; num <= size; num++) {
        if (isValid(board, row, col, num)) {
          board[row][col] = num;
  
          // Animate cell change
          const cell = document.getElementById(`cell-${row}-${col}`);
          cell.classList.add('animation');
          await sleep(100);
  
          if (await solve(board)) {
            return true;
          }
  
          board[row][col] = 0; // Backtrack
          cell.textContent = '';
          await sleep(100);
  
          // Remove animation class
          cell.classList.remove('animation');
        }
      }
  
      return false;
    }
  
    // Make a deep copy of the board
    function copyBoard(board) {
      return board.map(row => [...row]);
    }
  
    // Sleep function for animation delay
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  
    // Solve the Sudoku board
    const solution = copyBoard(board);
    await solve(solution);
    return solution;
  }
  
  // Function to parse CSV data into a Sudoku board
  function parseCSV(csvData) {
    const lines = csvData.split('\n');
    const board = [];
  
    for (let i = 0; i < 9; i++) {
      const row = lines[i].split(',').map(Number);
      board.push(row);
    }
  
    return board;
  }
  
  // Function to display the Sudoku board on the webpage
  function displayBoard(board) {
    const table = document.getElementById('sudokuBoard');
    table.innerHTML = '';
  
    for (let row = 0; row < 9; row++) {
      const tr = document.createElement('tr');
  
      for (let col = 0; col < 9; col++) {
        const td = document.createElement('td');
        td.id = `cell-${row}-${col}`;
        td.textContent = board[row][col] === 0 ? '' : board[row][col];
        tr.appendChild(td);
      }
  
      table.appendChild(tr);
    }
  }
  
  // Handle file input change event
  document.getElementById('csvFileInput').addEventListener('change', (event) => {
    const file = event.target.files[0];
  
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csvData = e.target.result;
        const board = parseCSV(csvData);
        displayBoard(board);
      };
      reader.readAsText(file);
    }
  });
  
  // Handle solve button click event
  document.getElementById('solveButton').addEventListener('click', async () => {
    const table = document.getElementById('sudokuBoard');
    const rows = table.getElementsByTagName('tr');
    const board = [];
  
    for (let row = 0; row < 9; row++) {
      const cols = rows[row].getElementsByTagName('td');
      const rowData = [];
  
      for (let col = 0; col < 9; col++) {
        const cellValue = cols[col].textContent;
        const num = cellValue === '' ? 0 : parseInt(cellValue, 10);
        rowData.push(num);
      }
  
      board.push(rowData);
    }
  
    const solution = await solveSudoku(board);
    displayBoard(solution);
  });
  