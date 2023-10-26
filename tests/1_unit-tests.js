const chai = require('chai');
const assert = chai.assert;
const SudokuSolver = require('../controllers/sudoku-solver');
const {SudokuHelper} = require('../utils/sudoku-helper');
const {PuzzleGroup} = require('../utils/enums')
const {getGoodPuzzles, badPuzzles, getUnresolvablePuzzles} = require('./unit-test-data')
let solver = new SudokuSolver();
const sdh = new SudokuHelper();
suite('Unit Tests', () => {
    suite('fcc logic unit testing', () => {
        test('Logic handles a valid puzzle string of 81 characters', function (done) {
            assert.isTrue(solver.validate(getGoodPuzzles()[0]), 
                'Valid puzzle string of 81 characters must return true'
            )
            
            done();
        })

        test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function (done) {
            assert.isFalse(solver.validate(badPuzzles[2].str), 
                'Puzzle string with invalid characters (not 1-9 or .) must return false'
            )
            
            done();
        })

        test('Logic handles a puzzle string that is not 81 characters in length', function (done) {
            assert.isFalse(solver.validate(badPuzzles[0].str), 
                'Puzzle string that is not 81 characters in length must return false'
            )
            
            done();
        })

        test('Logic handles a valid row placement', function (done) {
            assert.isTrue(solver.checkRowPlacement(getGoodPuzzles()[0], 0, 1, '3'), 
                'Check valid row placement must return true'
            )
            
            done();
        })

        test('Logic handles an invalid row placement', function (done) {
            assert.isFalse(solver.checkRowPlacement(getGoodPuzzles()[0], 0, 1, '8'), 
                'Check invalid row placement must return false'
            )
            
            done();
        })

        test('Logic handles a valid column placement', function (done) {
            assert.isTrue(solver.checkColPlacement(getGoodPuzzles()[0], 0, 1, '3'), 
                'Check valid column placement must return true'
            )
            
            done();
        })

        test('Logic handles an invalid column placement', function (done) {
            assert.isFalse(solver.checkColPlacement(getGoodPuzzles()[0], 0, 1, '2'), 
                'Check invalid column placement must return false'
            )
            
            done();
        })

        test('Logic handles a valid region placement', function (done) {
            assert.isTrue(solver.checkRegionPlacement(getGoodPuzzles()[0], 0, 1, '3'), 
                'Check valid region placement must return true'
            )
            
            done();
        })

        test('Logic handles an invalid region placement', function (done) {
            assert.isFalse(solver.checkRegionPlacement(getGoodPuzzles()[0], 0, 1, '2'), 
                'Check invalid region placement must return false'
            )
            
            done();
        })

        test('Valid puzzle strings pass the solver', function (done) {
            assert.isTrue(solver.solve(getGoodPuzzles()[0]) === getGoodPuzzles()[1], 
                'Valid puzzle strings pass the solver'
            )
            
            done();
        })

        test('Invalid puzzle strings fail the solver', function (done) {
            assert.isTrue(solver.solve(badPuzzles[0].str) === '', 
                'Invalid puzzle strings fail the solver'
            )
            
            done();
        })

        test('Solver returns the expected solution for an incomplete puzzle', function (done) {
            assert.isTrue(solver.solve(getUnresolvablePuzzles()[0]) === getUnresolvablePuzzles()[1], 
                'Solver returns the expected solution for an incomplete puzzle'
            )
            
            done();
        })

    })
    suite('Test string validation', () => {
        test('Test Validate string', function (done) {
            getGoodPuzzles().map(val=>{
                return assert.isTrue(solver.validate(val), 
                    `validate must return true for valid puzzle string`
                )
            })
            
            badPuzzles.map(obj=>{
                return assert.isFalse(solver.validate(obj.str), 
                    `validate must return false with bad : ${obj.msg}`
                )
            })
            done();
        });
    })
    
    suite('Test checkRowPlacement', ()=>{

        test('Test checkRowPlacement method', function (done) {
            const puzzle = getGoodPuzzles()[0]
            assert.isTrue(solver.checkRowPlacement(
                puzzle, 0, 0, '1'
                ), 
                'Valid existant row placement must return true'
            )

            assert.isTrue(solver.checkRowPlacement(
                puzzle, 0, 1, '3'
                ), 
                'Valid unexistant row placement must return true'
            )

            assert.isFalse(solver.checkRowPlacement(
                puzzle, 0, 0, '3'
                ), 
                'Invalid existant row placement must return false'
            )

            assert.isFalse(solver.checkRowPlacement(
                puzzle, 0, 1, '5'
                ), 
                'Invalid unexistant row placement must return false'
            )
            
            done();
        })
        


        
    })

    suite('Test checkColPlacement', ()=>{
        test('Test checkColPlacement method', function (done) {
            const puzzle = getGoodPuzzles()[0]
            assert.isTrue(solver.checkColPlacement(
                    puzzle, 0, 0, '1'
                ), 
                'Valid existant col placement must return true'
            )

            assert.isTrue(solver.checkColPlacement(
                    puzzle, 1, 0, '5'
                ), 
                'Valid unexistant col placement must return true'
            )

            assert.isFalse(solver.checkColPlacement(
                    puzzle, 0, 0, '3'
                ), 
                'Invalid existant col placement must return false'
            )

            assert.isFalse(solver.checkColPlacement(
                    puzzle, 1, 0, '8'
                ), 
                'Invalid unexistant col placement must return false'
            )
            
            done();
        })
    })
    suite('Test checkRegionPlacement', ()=>{

        test('Test checkRegionPlacement method', function (done) {
            const puzzle = getGoodPuzzles()[0]
            assert.isTrue(solver.checkRegionPlacement(
                puzzle, 0, 0, '1'
                ), 
                'Valid existant col placement must return true'
            )

            assert.isTrue(solver.checkRegionPlacement(
                puzzle, 1, 0, '4'
                ), 
                'Valid unexistant col placement must return true'
            )

            assert.isFalse(solver.checkRegionPlacement(
                puzzle, 0, 0, '3'
                ), 
                'Invalid existant col placement must return false'
            )

            assert.isFalse(solver.checkRegionPlacement(
                puzzle, 1, 0, '6'
                ), 
                'Invalid unexistant col placement must return false'
            )
            
            done();
        })
    })

    suite('Test  Methods', ()=>{

    })

    suite('Test Check position possibilities Methods', ()=>{

    })

    suite('Test solve methods.', ()=>{
        test('Test resolveDataSet method', function (done) {
            const puzzle = getGoodPuzzles()[0]
            let row = sdh.getRowFromPuzzle(puzzle, 8)
            let solvedRow = solver.resolveDataSet(
                puzzle,
                row,
                8,
                PuzzleGroup.ROW
            )
            assert.isTrue(solvedRow === '269145378', 
                'Solved row must be solved'
            )

            row = sdh.getRowFromPuzzle(puzzle, 0)
            solvedRow = solver.resolveDataSet(
                puzzle,
                row,
                0,
                PuzzleGroup.ROW
            )
            assert.isTrue(solvedRow === '135..2.84', 
                'Solved row must be solved'
            )
            
            done();
        })

        test('Test resolveDataSets method', function (done) {
            const puzzle = getGoodPuzzles()[0]
            let solvedRows = solver.resolveDataSets(puzzle, PuzzleGroup.ROW)
            assert.isTrue(solvedRows === '135..2.84946381257.2..5.....9..1....8129367453.7.2..9.473..8..1581673429269145378', 
                'Valid existant col placement must return true'
            )
            solvedRows = solver.resolveDataSets(puzzle, PuzzleGroup.COLUMN)
            assert.isTrue(solvedRows === '1.5.62.849.6381257728.59.13694.17.328.2.367453.7.24.96473298.615.1673429269145378', 
                'Valid existant col placement must return true'
            )

            solvedRows = solver.resolveDataSets(puzzle, PuzzleGroup.REGION)
            assert.isTrue(solvedRows === '1.5.62.849.63.125772..5....69..1....8.293674.3.7.2.19.473298..15816734.9269145378', 
                'Valid existant col placement must return true'
            )
            
            done();
        })

        test('Test solve method', function (done) {
            let puzzle = getGoodPuzzles()[0]
            let solvedRows = solver.solve(puzzle)
            assert.isTrue(solvedRows === getGoodPuzzles()[1], 
                'Unable to solve example puzzle 0'
            )

            puzzle = getGoodPuzzles()[2]
            solvedRows = solver.solve(puzzle)
            assert.isTrue(solvedRows === getGoodPuzzles()[3], 
                'Valid existant col placement must return true'
            )

            puzzle = getGoodPuzzles()[4]
            solvedRows = solver.solve(puzzle)
            assert.isTrue(solvedRows === getGoodPuzzles()[5], 
                'Valid existant col placement must return true'
            )

            puzzle = getGoodPuzzles()[6]
            solvedRows = solver.solve(puzzle)
            assert.isTrue(solvedRows === getGoodPuzzles()[7], 
                'Valid existant col placement must return true'
            )

            puzzle = getGoodPuzzles()[8]
            solvedRows = solver.solve(puzzle)
            assert.isTrue(solvedRows === getGoodPuzzles()[9], 
                'Valid existant col placement must return true'
            )
            
            done();
        })

    })
});
