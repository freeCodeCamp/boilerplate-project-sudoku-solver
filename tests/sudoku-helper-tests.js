const chai = require('chai');
const assert = chai.assert;
const {SudokuHelper} = require('../utils/sudoku-helper');
const { PuzzleGroup } = require('../utils/enums');
const {getGoodPuzzles, badPuzzles} = require('./unit-test-data');
let uTstObj = new SudokuHelper();

suite('SudokuHelper Unit Tests', () => {
    suite('Get data from Puzzle string', ()=>{
        test('Test getRowFromPuzzle method', function (done) {
            let tmp = uTstObj.getRowFromPuzzle(
                getGoodPuzzles()[0]
                , 0)
            assert.isTrue(tmp === '1.5..2.84', 
                `Row 0 expect "1.5..2.84" => ${tmp}`
            )

            tmp = uTstObj.getRowFromPuzzle(
                getGoodPuzzles()[0]
                , 3)
            assert.isTrue(tmp === '.9..1....', 
                `Row 3 expect ".9..1...." => ${tmp}`
            )
            
            tmp = uTstObj.getRowFromPuzzle(
                getGoodPuzzles()[0]
                , 8)
            assert.isTrue(tmp === '26914.37.', 
                `Row 8 expect "26914.37." => ${tmp}`
            )
            
            done();
        })

        test('Test getColFromPuzzle method', function (done) {
            const puzzle = getGoodPuzzles()[0]
            let tmp = uTstObj.getColFromPuzzle(
                '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
                , 0)
            assert.isTrue(tmp === '.841.6.5.', 
                `Col 0 expect ".841.6.5." => ${tmp}`
            )

            tmp = uTstObj.getColFromPuzzle(
                '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
                , 3)
            assert.isTrue(tmp === '.4...7..3', 
                `Col 3 expect ".4...7..3" => ${tmp}`
            )
            
            tmp = uTstObj.getColFromPuzzle(
                '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
                , 7)
            assert.isTrue(tmp === '1..86.93.', 
                `Col 3 expect "1..86.93." => ${tmp}`
            )
            done();
        })

        test('Test getRegionFromPuzzle method', function (done) {
            const puzzle = getGoodPuzzles()[0]
            const tests = [
                {region: 0, res: '1.5..6.2.'},
                {region: 1, res: '..23.1.5.'},
                {region: 2, res: '.842.7...'},
                {region: 3, res: '.9.8.23.7'},
                {region: 4, res: '.1..36.2.'},
                {region: 5, res: '...74..9.'},
                {region: 6, res: '47...1269'},
                {region: 7, res: '..86..14.'},
                {region: 8, res: '..1..937.'},
            ]
            
            const res = tests.map(obj => {

                const tmp = uTstObj.getRegionFromPuzzle(puzzle, obj.region)

                return assert.isTrue(tmp === obj.res, 
                    `Col ${obj.region} expect ${obj.res} => ${tmp}`
                )
            })
            done();
        })
    })
    suite('Get Array Puzzle Strings', ()=>{
        test('Test getArrayRows method', function (done) {
            const tmp = uTstObj.getArrayRows(
                getGoodPuzzles()[0]
            )
            assert.isTrue(tmp.length === 9, 
                'Rows length Array must equal to 9'
            )
            
            done();
        })

        test('Test getArrayCols method', function (done) {
            const tmp = uTstObj.getArrayCols(
                getGoodPuzzles()[0]
            )
            assert.isTrue(tmp.length === 9, 
                'Rows length Array must equal to 9'
            )
            
            done();
        })

        test('Test getArrayRegions method', function (done) {
            const tmp = uTstObj.getArrayRegions(
                getGoodPuzzles()[0]
            )
            assert.isTrue(tmp.length === 9, 
                'Rows length Array must equal to 9'
            )
            
            done();
        })
    })
    suite('Test region translators', ()=>{
        test('Test getRegionFromPosition method', function (done) {
            const dataTest = [
                {row: 0, col: 0, res: 0},
                {row: 0, col: 1, res: 0},
                {row: 0, col: 2, res: 0},
                {row: 1, col: 0, res: 0},
                {row: 1, col: 1, res: 0},
                {row: 1, col: 2, res: 0},
                {row: 2, col: 0, res: 0},
                {row: 2, col: 1, res: 0},
                {row: 2, col: 2, res: 0},
                {row: 0, col: 3, res: 1},
                {row: 2, col: 5, res: 1},
                {row: 0, col: 6, res: 2},
                {row: 2, col: 8, res: 2},
                {row: 3, col: 0, res: 3},
                {row: 5, col: 2, res: 3},
                {row: 3, col: 3, res: 4},
                {row: 5, col: 5, res: 4},
                {row: 3, col: 6, res: 5},
                {row: 5, col: 8, res: 5},
                {row: 6, col: 0, res: 6},
                {row: 8, col: 2, res: 6},
                {row: 6, col: 3, res: 7},
                {row: 8, col: 5, res: 7},
                {row: 6, col: 6, res: 8},
                {row: 8, col: 8, res: 8},
            ]
            dataTest.map(obj=>{
                const tmp = uTstObj.getRegionFromPosition(
                    obj.row,
                    obj.col
                )
                return assert.isTrue(tmp === obj.res, 
                    `Translation of row ${obj.row}, col ${obj.col} must return region of ${obj.res} not ${tmp}`
                )
            })

            
            done();
        })

        test('Test getRegionCharFromPosition method', function (done) {
            const dataTest = [
                {row: 0, col: 0, res: 0},
                {row: 0, col: 1, res: 1},
                {row: 0, col: 2, res: 2},
                {row: 1, col: 0, res: 3},
                {row: 1, col: 1, res: 4},
                {row: 1, col: 2, res: 5},
                {row: 2, col: 0, res: 6},
                {row: 2, col: 1, res: 7},
                {row: 2, col: 2, res: 8},
                {row: 0, col: 3, res: 0},
                {row: 2, col: 5, res: 8},
                {row: 0, col: 6, res: 0},
                {row: 2, col: 8, res: 8},
                {row: 3, col: 0, res: 0},
                {row: 5, col: 2, res: 8},
                {row: 3, col: 3, res: 0},
                {row: 5, col: 5, res: 8},
                {row: 3, col: 6, res: 0},
                {row: 5, col: 8, res: 8},
                {row: 6, col: 0, res: 0},
                {row: 8, col: 2, res: 8},
                {row: 6, col: 3, res: 0},
                {row: 8, col: 5, res: 8},
                {row: 6, col: 6, res: 0},
                {row: 8, col: 8, res: 8},
            ]
            dataTest.map(obj=>{
                const tmp = uTstObj.getRegionCharFromPosition(
                    obj.row,
                    obj.col
                )
                return assert.isTrue(tmp === obj.res, 
                    `Translation of row ${obj.row}, col ${obj.col} must return region char of ${obj.res} not ${tmp}`
                )
            })

            
            done();
        })

        test('Test getPositionFromRegion method', function (done) {
            const dataTest = [
                {row: 0, col: 0, region: 0, regionChar: 0},
                {row: 0, col: 1, region: 0, regionChar: 1},
                {row: 0, col: 2, region: 0, regionChar: 2},
                {row: 1, col: 0, region: 0, regionChar: 3},
                {row: 1, col: 1, region: 0, regionChar: 4},
                {row: 1, col: 2, region: 0, regionChar: 5},
                {row: 2, col: 0, region: 0, regionChar: 6},
                {row: 2, col: 1, region: 0, regionChar: 7},
                {row: 2, col: 2, region: 0, regionChar: 8},
                {row: 0, col: 3, region: 1, regionChar: 0},
                {row: 2, col: 5, region: 1, regionChar: 8},
                {row: 0, col: 6, region: 2, regionChar: 0},
                {row: 2, col: 8, region: 2, regionChar: 8},
                {row: 3, col: 0, region: 3, regionChar: 0},
                {row: 5, col: 2, region: 3, regionChar: 8},
                {row: 3, col: 3, region: 4, regionChar: 0},
                {row: 5, col: 5, region: 4, regionChar: 8},
                {row: 3, col: 6, region: 5, regionChar: 0},
                {row: 5, col: 8, region: 5, regionChar: 8},
                {row: 6, col: 0, region: 6, regionChar: 0},
                {row: 8, col: 2, region: 6, regionChar: 8},
                {row: 6, col: 3, region: 7, regionChar: 0},
                {row: 8, col: 5, region: 7, regionChar: 8},
                {row: 6, col: 6, region: 8, regionChar: 0},
                {row: 8, col: 8, region: 8, regionChar: 8},
            ]
            dataTest.map(obj=>{
                const tmp = uTstObj.getPositionFromRegion(
                    obj.region,
                    obj.regionChar
                )
                return assert.isTrue(tmp.row === obj.row && tmp.col === obj.col, 
                    `Translation of region ${obj.region}, regionChar ${obj.regionChar} must return row/col of ${obj.row}/${obj.col} not ${tmp.row}/${tmp.col}`
                )
            })

            
            done();
        })
    })

    suite('Test helpers methods',()=>{
        
        test('Test getMissingValues', function (done) {

            assert.isTrue(uTstObj.getMissingValues(
                ['1', '2', '3', '4', '5', '6', '7', '8', '9']
                ).length === 0, 
                'Complete set must return null'
            )
            const tmp = uTstObj.getMissingValues(
                ['1', '2', '.', '4', '.', '6', '.', '8', '9']
                )
            assert.isTrue(tmp.length === 3, 
                'Incomplete set "12.4.6.89" must return an array'
            )
            assert.isTrue(tmp.length === 3, 
                'Incomplete set "12.4.6.89" must return an array of length 3'
            )
            assert.isTrue(tmp[0] === '3', 
                'Incomplete set "12.4.6.89" must return an array and array[0] = 3'
            )
            assert.isTrue(tmp[1] === '5', 
                'Incomplete set "12.4.6.89" must return an array and array[1] = 5'
            )
            assert.isTrue(tmp[2] === '7', 
                'Incomplete set "12.4.6.89" must return an array and array[2] = 7'
            )
            done();
        })

    } )

    suite('Test Array dataSet To Puzzle String Methods', ()=>{

        test('Test arrayColsToString method', function (done) {
            let tmp = uTstObj.arrayColsToString(
                uTstObj.getDataSet(getGoodPuzzles()[0], PuzzleGroup.COLUMN)
            )
            assert.isTrue(tmp === getGoodPuzzles()[0], 
                'An array of puzzle columns must return a valid puzzle string.'
            )
            done();
        })

        test('Test arrayRegionsToString method', function (done) {
            let tmp = uTstObj.arrayRegionsToString(
                uTstObj.getDataSet(getGoodPuzzles()[0], PuzzleGroup.REGION)
            )
            assert.isTrue(tmp === getGoodPuzzles()[0], 
                'An array of puzzle regions must return a valid puzzle string.'
            )
            done();
        })

        test('Test arrayDataSetToString method', function (done) {
            let tmp = uTstObj.arrayDataSetToString(
                uTstObj.getDataSet(getGoodPuzzles()[0], PuzzleGroup.ROW),
                PuzzleGroup.ROW
            )
            assert.isTrue(tmp === getGoodPuzzles()[0], 
                'An array of puzzle rows must return a valid puzzle string.'
            )

            tmp = uTstObj.arrayDataSetToString(
                uTstObj.getDataSet(getGoodPuzzles()[0], PuzzleGroup.COLUMN),
                PuzzleGroup.COLUMN
            )
            assert.isTrue(tmp === getGoodPuzzles()[0], 
                'An array of puzzle columns must return a valid puzzle string.'
            )
            
            tmp = uTstObj.arrayDataSetToString(
                uTstObj.getDataSet(getGoodPuzzles()[0], PuzzleGroup.REGION),
                PuzzleGroup.REGION
            )
            assert.isTrue(tmp === getGoodPuzzles()[0], 
                'An array of puzzle regions must return a valid puzzle string.'
            )
            done();
        })
    })
});