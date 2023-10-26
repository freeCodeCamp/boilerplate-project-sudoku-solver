const { SudokuHelper } = require('../utils/sudoku-helper');
const sdh = new SudokuHelper();

exports.mid_puzzle = (req, res, next) => {
  const puzzle = req.body.puzzle;
  if (puzzle === ''){
    res.json({ "error": "Required field missing" });
  }
  else if (puzzle.length != 81) {
    res.json({ "error": "Expected puzzle to be 81 characters long" });
  } else if (!sdh.isValidPuzzleString(puzzle)) {
    res.json({ "error": "Invalid characters in puzzle" });
  } else {
    next();
  }

}