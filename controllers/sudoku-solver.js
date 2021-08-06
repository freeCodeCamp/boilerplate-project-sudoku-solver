class SudokuSolver {


  // CHECK SUDOKU

  validate(puzzle) {

  }

  letterToNumber(row) {
    switch (row.toUpperCase()) {
      case 'A':
        return 1;
      case 'B':
        return 2;
      case 'C':
        return 3;
      case 'D':
        return 4;
      case 'E':
        return 5;
      case 'F':
        return 6;
      case 'G':
        return 7;
      case 'H':
        return 8;
      case 'I':
        return 9;
      default:
        return 'none';
    }
  }

  checkRowPlacement(puzzleString, row, col, value) {
    let grid = this.stringToGrid(puzzleString);
    row = this.letterToNumber(row);

    if (grid[row - 1][col - 1] !== 0) return false;

    for (let i = 0; i < 9; i++) {
      // allow if same spot
      let isCol = i == col - 1;
      if (grid[row - 1][i] == value && !isCol) return false;
    }

    return true;
  }

  checkColPlacement(puzzleString, row, col, value) {
    let grid = this.stringToGrid(puzzleString);
    row = this.letterToNumber(row);

    if (grid[row - 1][col - 1] !== 0) return false;

    for (let i = 0; i < 9; i++) {
      // allow if same spot
      let isRow = i == row - 1;
      if (grid[i][col - 1] == value && !isRow) return false;
    }

    return true;
  }

  checkRegPlacement(puzzleString, row, col, value) {
    let grid = this.stringToGrid(puzzleString);
    row = this.letterToNumber(row);

    if (grid[row - 1][col - 1] !== 0) return false;

    let startRow = row - row % 3,
      startCol = col - col % 3;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // allow if same spot
        let isRow = i + startRow == row - 1;
        let isCol = j + startCol == col - 1;
        if (grid[i + startRow][j + startCol] == value && !isRow && !isCol) return false;
      }
    }

    return true;
  }


  // SOLVE SUDOKU

  solveSudoku(grid, row, col) {
    if (row == 9 - 1 && col == 9) return grid;

    if (col == 9) {
      row++;
      col = 0;
    }

    if (grid[row][col] != 0) return this.solveSudoku(grid, row, col + 1);

    for (let num = 1; num < 10; num++) {

      if (this.isSafe(grid, row, col, num)) {
        grid[row][col] = num;

        if (this.solveSudoku(grid, row, col + 1)) return grid;
      }

      grid[row][col] = 0;
    }
    return false;
  }

  isSafe(grid, row, col, num) {

    for (let x = 0; x < 9; x++) {
      if (grid[row][x] == num) return false;
    }

    for (let x = 0; x < 9; x++) {
      if (grid[x][col] == num) return false;
    }

    let startRow = row - row % 3,
      startCol = col - col % 3;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[i + startRow][j + startCol] == num) return false;
      }
    }

    return true;
  }

  stringToGrid(puzzleString) {
    let grid = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];

    let row = -1;
    let col = 0;
    for (let i = 0; i < puzzleString.length; i++) {
      if (i % 9 == 0) row++;

      if (col % 9 == 0) col=0;

      grid[row][col] = puzzleString[i] === "." ? 0 : +puzzleString[i];
      col++;
    }

    return grid;
  }

  gridToString(grid) {
    return grid.flat().join("");
  }

  solve(puzzleString) {
    let grid = this.stringToGrid(puzzleString);
    let solved = this.solveSudoku(grid, 0, 0);
    if (!solved) return false;

    let solvedString = this.gridToString(solved);
    return solvedString;
  }

}


module.exports = SudokuSolver;
