class SudokuSolver {

  validate(puzzleString) {
  }

  checkRowPlacement(puzzleString, row, column, value) {

  }

  checkColPlacement(puzzleString, row, column, value) {

  }

  checkRegionPlacement(puzzleString, row, column, value) {

  }

  solveSudoku(grid, row, col) {
    if (row == 9 - 1 && col == 9)
      return grid;

    if (col == 9) {
      row++;
      col = 0;
    }

    if (grid[row][col] != 0)
      return this.solveSudoku(grid, row, col + 1);

    for (let num = 1; num < 10; num++) {

      if (this.isSafe(grid, row, col, num)) {
        grid[row][col] = num;

        if (this.solveSudoku(grid, row, col + 1))
        return grid;
      }

      grid[row][col] = 0;
    }
    return false;
  }

  isSafe(grid, row, col, num) {

    for (let x = 0; x < 9; x++)
      if (grid[row][x] == num)
        return false;

    for (let x = 0; x < 9; x++)
      if (grid[x][col] == num)
        return false;

    let startRow = row - row % 3,
      startCol = col - col % 3;

    for (let i = 0; i < 3; i++)
      for(let j = 0; j < 3; j++)
        if (grid[i + startRow][j + startCol] == num)
          return false;

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
    for (let i = 0; i < puzzleString; ++i) {
      if (i % 9 == 0) {
        ++row;
      }
      if (col % 9 == 0) {
        col=0;
      }

      grid[row][col] = puzzleString[i] === "." ? 0 : +puzzleString[i];
      ++col;
    }

    return grid;
  }

  gridToString(grid) {
    return grid.flat().join("");
  }

  solve(puzzleString) {
    let grid = this.stringToGrid(puzzleString);
    let solved = this.solveSudoku(grid, 0, 0);
    // console.log('solved :>>', solved);
    if (!solved) {
      return false;
    }
    let solvedString = this.gridToString(solved);
    // console.log("solvedString :>>", solvedString)
    return solvedString;
  }
}

module.exports = SudokuSolver;
