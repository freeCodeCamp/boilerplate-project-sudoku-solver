class SudokuSolver {

  validate(puzzleString) {
  }

  checkRowPlacement(puzzleString, row, column, value) {

  }

  checkColPlacement(puzzleString, row, column, value) {

  }

  checkRegionPlacement(puzzleString, row, column, value) {

  }


solveSuduko(grid, row, col) {
  if (row == 9 - 1 && col == 9)
    return true;

  if (col == 9) {
    row++;
    col = 0;
  }

  if (grid[row][col] != 0)
    return solveSuduko(grid, row, col + 1);

  for (let num = 1; num < 10; num++) {

    if (isSafe(grid, row, col, num)) {
      grid[row][col] = num;

      if (solveSuduko(grid, row, col + 1))
      return true;
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


  solve(puzzleString) {

  }
}

module.exports = SudokuSolver;
