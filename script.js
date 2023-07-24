async function solveSudoku(board) {
  const size = 9;
  const emptyCell = [0, 0]; 
  let totalAttempts = 0; 
  let startTime; 
 
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

  
  function isValid(board, row, col, num) {
  
    for (let i = 0; i < size; i++) {
      if (board[row][i] === num) {
        return false;
      }
    }

    // Verifica coluna
    for (let i = 0; i < size; i++) {
      if (board[i][col] === num) {
        return false;
      }
    }

    // verifica o quadrante
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

 
  async function solve(board) {
    if (!findEmptyCell(board)) {
      return true; // se não tiver mais espaços vazios, o sudoku estará resolvido aqui.
    }

    const [row, col] = emptyCell;

    for (let num = 1; num <= size; num++) {
      if (isValid(board, row, col, num)) {
        board[row][col] = num;
        totalAttempts++; // adiciona o total de tentativas na variavel

        const cell = document.getElementById(`cell-${row}-${col}`);
        cell.classList.add('animation');
        cell.textContent = num;
        await sleep(0.5); 

        if (await solve(board)) {
          return true;
        }

        board[row][col] = 0; // Backtrack
        cell.textContent = '';
        await sleep(0.5); 

        cell.classList.remove('animation');
      }
    }

    return false;
  }

  function copyBoard(board) {
    return board.map(row => [...row]);
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const solution = copyBoard(board);
  startTime = performance.now(); 
  await solve(solution);
  const endTime = performance.now();

  // Calcular o tempo empregado, em segundos.
  const timeInSeconds = (endTime - startTime) / 1000;

  return { solution, totalAttempts, timeInSeconds };
}

function parseCSV(csvData) {
  const lines = csvData.split('\n');
  const board = [];

  for (let i = 0; i < 9; i++) {
    const row = lines[i].split(',').map(Number);
    board.push(row);
  }

  return board;
}

function displayBoard(board) {
  const table = document.getElementById('sudokuBoard');
  table.innerHTML = '';

  for (let row = 0; row < 9; row++) {
    const tr = document.createElement('tr');

    for (let col = 0; col < 9; col++) {
      const td = document.createElement('td');
      td.id = `cell-${row}-${col}`;
      td.textContent = board[row][col] === 0 ? '' : board[row][col];

      if (board[row][col] !== 0) {
        td.classList.add('filled');
      }

      tr.appendChild(td);
    }

    table.appendChild(tr);
  }
}

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

  const { solution, totalAttempts, timeInSeconds } = await solveSudoku(board);
  displayBoard(solution);

  // tempo e total de tentativas
  const attemptsCountElement = document.getElementById('attemptsCount');
  attemptsCountElement.textContent = `Total de tentativas: ${totalAttempts}`;
  
  const timeElement = document.getElementById('timeTaken');
  timeElement.textContent = `Tempo empregado: ${timeInSeconds.toFixed(2)} segundos`;
});
