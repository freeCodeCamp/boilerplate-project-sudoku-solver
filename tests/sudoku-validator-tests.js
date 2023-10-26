const chai = require('chai');
const assert = chai.assert;
const {SudokuValidator} = require('../utils/sudoku-validator');
const {getGoodPuzzles} = require('./unit-test-data')
let uTstObj = new SudokuValidator();

suite('SudokuValidator Unit Tests', () => {
    suite('', ()=>{
        test('Test isRepeatedValue method', function (done) {

            assert.isTrue(uTstObj.isRepeatedValue('123456789', '9'), 
                'Complete set must return 0 missing values'
            )
            assert.isTrue(uTstObj.isRepeatedValue('12.4.6.89', '9'), 
                'Incomplete Set with 3 missing values must return 3'
            )
            assert.isFalse(uTstObj.isRepeatedValue('12.4.6.89', '3'), 
                'Incomplete Set with 3 missing values must return 3'
            )
            done();
        });

        test('Test isValidValue method', function (done) {

            assert.isTrue(uTstObj.isValidValue('9'), 
                'Complete set must return 0 missing values'
            )
            assert.isTrue(uTstObj.isValidValue('1'), 
                'Incomplete Set with 3 missing values must return 3'
            )
            assert.isFalse(uTstObj.isValidValue('0'), 
                'Incomplete Set with 3 missing values must return 3'
            )
            assert.isFalse(uTstObj.isValidValue('.'), 
                'Incomplete Set with 3 missing values must return 3'
            )
            done();
        });

        test('Test isValidSolution method', function (done) {
            const puzzle = getGoodPuzzles()[0]
            let isValidSolution = uTstObj.isValidSolution(
                '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                '135762984946381257728459613694517832812936745357824196473298561581673429269145378'
            )
            assert.isTrue(isValidSolution, 
                'Compare unreslved solution with resolved solution must return true (Only unresolved position can change)'
            )
            isValidSolution = uTstObj.isValidSolution(
                '135..2.84946381257.2..5.....9..1....8129367453.7.2..9.473..8..1581673429269145378',
                '135..2.84946381257.2..5.....9..1....8129367453.7.2..9.473..8..1581673429269145378'
            )
            assert.isTrue(isValidSolution, 
                'Compare same puzzleStrings must return true (no change is done)'
            )
            isValidSolution = uTstObj.isValidSolution(
                '135..2.84946381257.2..5.....9..1....8129367453.7.2..9.473..8..1581673429269145378',
                '835..2.84946381257.2..5.....9..1....8129367453.7.2..9.473..8..1581673429269145378'
            )
            assert.isFalse(isValidSolution, 
                'Only unresolved position can change marked by "." here "1" has changed from "8" and must return false.'
            )
            done();
        })

        test('Test isSolved method', function (done) {
            let isSolved = uTstObj.isSolved(getGoodPuzzles()[1])
            assert.isTrue(isSolved, 
                'Solved puzzle must return true'
            )
            isSolved = uTstObj.isSolved(getGoodPuzzles()[3])
            assert.isTrue(isSolved, 
                'Unsolved puzzle must return false'
            )
            done();
        })
    })
});