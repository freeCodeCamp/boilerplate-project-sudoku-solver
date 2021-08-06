'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      // validate
      // checkRowPlacement
      // checkColPlacement
      // checkRegionPlacement
      // solve
      const { puzzle, coordinate, value } = req.body;
      if (!puzzle || !coordinate | !value) {
        res.json({ error: 'Required field(s) missing' });
        return;
      }
      if (/[^aA]/g.test(puzzle)) {
        res.json({ error: 'Invalid coordinate' });
      }
      if (/[^0-9]/g.test(puzzle)) {
        res.json({ error: 'Invalid value' });
        return;
      }
      if (puzzle.length != 81) {
        res.json({ error: 'Expected puzzle to be 81 characters long' });
        return;
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;
      if (!puzzle) {
        res.json({ error: 'Required field missing' });
        return;
      }
      if (puzzle.length != 81) {
        res.json({ error: 'Expected puzzle to be 81 characters long' });
        return;
      }
      if (/[^0-9.]/g.test(puzzle)) {
        res.json({ error: 'Invalid characters in puzzle' });
        return;
      }
      let solvedString = solver.solve(puzzle);
      if (!solvedString) {
        res.json({ error: 'Puzzle cannot be solved' });
      } else {
        res.json({ solution: solvedString });
      }
      });
};
