const Ut = require('../utils/utils');
const { PuzzleGroup } = require('../utils/enums');
const { SudokuValidator } = require('../utils/sudoku-validator');

class SudokuHelper extends SudokuValidator {
    constructor() {
        super();
    }

    getValidSetValues() {
        return ['1', '2', '3', '4', '5', '6', '7', '8', '9']
    }

    /**
   * 
   * @param {*} puzzleString 
   * @param {*} row 
   * @returns 
   */
    getRowFromPuzzle(puzzleString, row) {
        const current = row * 9
        return puzzleString.slice(current, current + 9);
    }

    /**
     * 
     * @param {*} puzzleString 
     * @param {*} col 
     * @returns 
     */
    getColFromPuzzle(puzzleString, col) {
        let result = ''
        for (let i = 0; i < puzzleString.length; i += 9) {
            result += puzzleString.slice(col + i, col + i + 1);
        }
        return result;
    }

    /**
     * Get region string values from puzzle string.
     * @param {string} puzzleString The actual puzzle string to solve
     * @param {number} region The region number (0 >= region < 9)
     * @returns {string} The region values (str of 9 characters [1-9] and/or ".")
     */
    getRegionFromPuzzle(puzzleString, region) {
        const start = (Math.floor(region / 3) * 9 * 3) + (region % 3 * 3);
        const endLoop = Math.floor((3 * 9) + start);
        let result = '', i;
        for (i = start; i < endLoop; i += 9) {
            result += puzzleString.slice(i, i + 3);
        }
        return result;
    }

    /**
   * Get the position of a region from row/col coordinate.
   * A region is a square of 3x3 elements (9 values).
   * @param {number} row The row position
   * @param {number} col The column position
   * @returns {number} The position of a region (0 >= result < 9)
   */
    getRegionFromPosition(row, col) {
        const rowN = (Math.floor(row / 3) % 3);
        const colN = (Math.floor(col / 3) % 3);
        const region = (rowN * 3) + colN;
        return region;
    }


    /**
    * Get the character position of a region from row/col coordinate.
    * A region string is defined by nine characters, who represents the values of region.
    * A region is a square of 3x3 elements (9 values).
    * @example 
    *  - getRegionCharFromPosition(0, 0) return 0
    *  - getRegionCharFromPosition(0, 2) return 2
    *  - getRegionCharFromPosition(1, 0) return 3
    *  - getRegionCharFromPosition(1, 2) return 5
    *  - getRegionCharFromPosition(2, 0) return 6
    *  - getRegionCharFromPosition(2, 2) return 8
    * @param {number} row The row position
    * @param {number} col The column position
    * @returns {number} The character position of a region (0 >= result < 9)
    */
    getRegionCharFromPosition(row, col) {
        const rowN = (row % 3);
        const colN = (col % 3);
        const region = (rowN * 3) + colN;
        return region;
    }

    /**
     * 
     * @param {*} region 
     * @param {*} regionChar 
     * @returns 
     */
    getPositionFromRegion(region, regionChar) {
        const rowStart = Math.floor(region / 3) * 3
        const rowEnd = rowStart + 2
        const rChar = (Math.floor(regionChar / 3) * 3) % 9
        const row = rowStart + Math.floor(regionChar / 3)
        const col = ((region % 3) * 3) + regionChar % 3
        return { row: row, col: col }
    }

    /**
     * 
     * @param {*} dataSet 
     * @returns 
     */
    getMissingValues(dataSet) {
        const miss = this.getValidSetValues().filter(val => {
            return (!dataSet.includes(val)) ? val : false;
        })
        return miss;
    }

    /**
     * 
     * @param {*} puzzleString 
     * @returns 
     */
    getArrayRows(puzzleString) {
        let rows = [];
        for (let i = 0; i < 9; i++) {
            rows.push(this.getRowFromPuzzle(puzzleString, i));
        }
        return rows;
    }

    /**
     * 
     * @param {*} puzzleString 
     * @returns 
     */
    getArrayCols(puzzleString) {
        let rows = [];
        for (let i = 0; i < 9; i++) {
            rows.push(this.getColFromPuzzle(puzzleString, i));
        }
        return rows;
    }

    /**
     * 
     * @param {*} puzzleString 
     * @returns 
     */
    getArrayRegions(puzzleString) {
        let rows = [];
        for (let i = 0; i < 9; i++) {
            rows.push(this.getRegionFromPuzzle(puzzleString, i));
        }
        return rows;
    }

    /**
     * 
     * @param {*} puzzleString 
     * @param {*} group 
     * @returns 
     */
    getDataSet(puzzleString, group) {
        switch (group) {
            case PuzzleGroup.ROW:
                return this.getArrayRows(puzzleString)
            case PuzzleGroup.COLUMN:
                return this.getArrayCols(puzzleString)
            case PuzzleGroup.REGION:
                return this.getArrayRegions(puzzleString)
        }
    }

    /**
   * Farmat array of puzzle columns in puzzle string
   * @param {[{string}]} array Array of puzzle columns to format
   * @returns {string} Return a puzzle string.
   */
    arrayColsToString(array) {
        let rows = [];
        for (let i = 0; i < 9; i++) {
            rows[i] = array.reduce((res, val, index) => {
                res += val.slice(i, i + 1);
                return res
            }, '')
        }
        return rows.join('');
    }

    /**
     * Farmat array of puzzle regions in puzzle string
     * @param {[{string}]} array Array of puzzle regions to format
     * @returns {string} Return a puzzle string.
     */
    arrayRegionsToString(array) {
        let rows = [];
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const region = this.getRegionFromPosition(row, col)
                const regionChar = this.getRegionCharFromPosition(row, col)
                if (!Ut.isStr(rows[row])) {
                    rows[row] = '';
                }
                rows[row] += array[region].slice(regionChar, regionChar + 1)
            }
        }
        return rows.join('');
    }

    /**
     * Format a dataSets Group array to string.
     * A dataSets Group can be Rows, Columns or Regions.
     * @param {[{string}]} array A dataSets Group array
     * @param {*} group The dataSet Group to resolve
     * @returns {string} Return string dataSets Group.
     * @throws {Error} If invalid group is set
     */
    arrayDataSetToString(array, group) {
        switch (group) {
            case PuzzleGroup.ROW:
                return array.join('');
            case PuzzleGroup.COLUMN:
                return this.arrayColsToString(array);
            case PuzzleGroup.REGION:
                return this.arrayRegionsToString(array);
            default:
                return new Error('Fatal Error: Puzzle data group is not valid.')
        }
    }

    formatCoordinate(coordinate) {
        if(this.isValidCoordinate(coordinate)){
          coordinate = coordinate.toUpperCase()
          const coords = {
            row: coordinate.slice(0, 1),
            col: parseInt(coordinate.slice(1))-1
          }
          coords.row = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']
            .reduce((res, val, index) =>{
              if(val === coords.row){
                res = index
              }
              return res
            }, -1)
            return (this.isValidPosition(coords.row) && this.isValidPosition(coords.col)) ? coords : null;
        }
        return null;
      }
}

module.exports = {
    SudokuHelper: SudokuHelper
};