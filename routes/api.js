'use strict';

const { reporters } = require('mocha');
const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;
      if (!puzzle || !coordinate | !value) {
        res.json({ error: 'Required field(s) missing' });
        return;
      }

      let validCoordinate = solver.checkCoordinate(coordinate);
      let validValue = solver.checkValue(value);
      let validLength = solver.checkLength(puzzle);
      let validCharacters = solver.checkCharacters(puzzle);

      if (!validCoordinate) {
        res.json({ error: 'Invalid coordinate' });
        return;
      }
      if (!validValue) {
        res.json({ error: 'Invalid value' });
        return;
      }
      if (!validLength) {
        res.json({ error: 'Expected puzzle to be 81 characters long' });
        return;
      }
      if (!validCharacters) {
        res.json({ error: 'Invalid characters in puzzle' });
        return;
      }

      let row = coordinate.split('')[0];
      let col = coordinate.split('')[1];
      let validRow = solver.checkRowPlacement(puzzle, row, col, value);
      let validCol = solver.checkColPlacement(puzzle, row, col, value);
      let validReg = solver.checkRegPlacement(puzzle, row, col, value);
      let conflicts = [];

      if (validRow && validCol && validReg) {
        res.json({ valid: true });
      } else {
        if (!validRow) {
          conflicts.push("row");
        }
        if (!validCol) {
          conflicts.push("column");
        }
        if (!validReg) {
          conflicts.push("region");
        }

        res.json({ valid: false, conflict: conflicts });
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

      let solution = solver.solve(puzzle);
      if (!solution) {
        res.json({ error: 'Puzzle cannot be solved' });
        return;
      }

      res.json({ solution });
    });
};
