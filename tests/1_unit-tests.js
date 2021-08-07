const chai = require('chai');
const SudokuSolver = require('../controllers/sudoku-solver.js');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new SudokuSolver();

const validPuzzle = "769..5.1.8514....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
const solution =    "769235418851496372432178956174569283395842761628713549283657194516924837947381625";

suite('UnitTests', () => {

  suite('solver tests', function () {

    test("Logic handles a valid puzzle string of 81 characters", function done() {
      assert.equal(solver.solve(validPuzzle), solution);
      done();
    })

    test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", function done() {
      const invalidPuzzle = "x69..5.1.8514....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
      assert.equal(solver.solve(invalidPuzzle), false);
      done();
    })

    test("Logic handles a puzzle string that is not 81 characters in length", function done() {
      const invalidPuzzle = "69..5.1.8514....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
      assert.equal(solver.solve(invalidPuzzle), false);
      done();
    })

    test("Logic handles a valid row placement", function done() {
      assert.equal(solver.checkRowPlacement(validPuzzle, 'I', '1', '7'), true);
    })

    test("Logic handles an invalid row placement", function done() {
      assert.equal(solver.checkRowPlacement(validPuzzle, 'A', '2', '1'), false);
    })

    test("Logic handles a valid column placement", function done() {
      assert.equal(solver.checkColPlacement(validPuzzle, 'A', '1', '7'), true);
    })

    test("Logic handles an invalid column placement", function done() {
      assert.equal(solver.checkColPlacement(validPuzzle, 'A', '1', '6'), false);
    })

    test("Logic handles a valid region(3x3 grid) placement", function done() {
      assert.equal(solver.checkRegPlacement(validPuzzle, 'A', '1', '7'), true);
    })

    test("Logic handles an invalid region(3x3 grid) placement", function done() {
      assert.equal(solver.checkRegPlacement(validPuzzle, 'A', '1', '2'), false);
    })

    test("Valid puzzle strings pass the solver", function done() {
      assert.equal(solver.solve(solution), solution);
    })

    test("Invalid puzzle strings fail the solver", function done() {
      const invalidPuzzle = "169235418851496372432178956174569283395842761628713549283657194516924837947381625";
      assert.equal(solver.solve(invalidPuzzle), false);
    })

    test("Solver returns the expected solution for an incomplete puzzle", function done() {
      assert.equal(solver.solve(validPuzzle), solution);
    })


  })


});
