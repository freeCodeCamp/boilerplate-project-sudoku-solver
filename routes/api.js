'use strict';
const Ut = require('../utils/utils');
const SudokuSolver = require('../controllers/sudoku-solver.js');
const { SudokuHelper } = require('../utils/sudoku-helper');
const {mid_puzzle} = require('../middlewares/mid-puzzle');
const {mid_position} = require('../middlewares/mid-position');

module.exports = function (app) {
  const sdh = new SudokuHelper();
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post([mid_puzzle, mid_position],
      (req, res) => {
        const puzzle = req.body.puzzle;
        const coords = res.locals.coords;
        const value = req.body.value;
        res.json(solver.checkPlacement(puzzle, coords.row, coords.col, value));
      });

  app.route('/api/solve')
    .post(mid_puzzle, (req, res) => {
      const puzzle = req.body.puzzle;
      const result = solver.solve(puzzle);
      if(sdh.isSolved(result)){
        res.json({ solution: result })
      }
      else{
        res.json({ "error": "Puzzle cannot be solved" })
      }
    });
};
