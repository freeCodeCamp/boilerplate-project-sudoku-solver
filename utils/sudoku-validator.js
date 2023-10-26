const Ut = require('../utils/utils');

class SudokuValidator {

    /**
    * 
    * @param {*} puzzleString 
    * @returns 
    */
    isValidPuzzleString(puzzleString) {
        return Ut.isStr(puzzleString) && /^[1-9.]{81}$/.test(puzzleString)
    }

    isValidCoordinate(val) {
        return Ut.isStr(val) && /^[A-Ia-i][1-9]$/.test(val)
    }

    /**
   * 
   * @param {*} val 
   * @returns 
   */
    isValidValue(val) {
        return Ut.isStr(val) && /^[1-9]{1}$/.test(val)
    }

    /**
     * 
     * @param {*} set 
     * @param {*} val 
     * @returns 
     */
    isRepeatedValue(set, val) {
        return set.includes(val);
    }

    /**
     * 
     * @param {*} pos 
     * @returns 
     */
    isValidPosition(pos) {
        return Ut.isNumber(pos) && 0 >= pos < 9
    }


    /**
     * 
     * @param {*} puzzleString 
     * @param {*} row 
     * @param {*} column 
     * @param {*} value 
     */
    isValidDataPlacement(puzzleString, row, column, value) {
        if (!this.isValidPuzzleString(puzzleString)) {
            throw new Error('Error: Invalid puzzle string')
        }
        if (!this.isValidPosition(row)) {
            throw new Error('Error: Invalid row number')
        }
        if (!this.isValidPosition(column)) {
            throw new Error('Error: Invalid column number')
        }
        if (!this.isValidValue(value)) {
            throw new Error('Error: Invalid puzzle value')
        }
    }

    /**
     * 
     * @param {*} dataSet 
     * @param {*} posValue 
     * @param {*} value 
     * @returns 
     */
    checkPlacement(dataSet, posValue, value) {
        const isExistantPositionValue = this.isValidValue(posValue)
        const isNotRepeated = !this.isRepeatedValue(dataSet, value)
        const isEqualToExistantValue = posValue === value
        return (isExistantPositionValue && isEqualToExistantValue)
            || (!isExistantPositionValue && isNotRepeated)
    }

    /**
   * Test if the updated solution is valid.
   * First test if solution is valid puzzle string.
   * Then compare the two puzzle strings,
   * and controls if no changes made on resolved positions.
   * A number can't be replaced by another.
   * @param {string} puzzleString The Sudoku Puzzle String to solve
   * @param {string} solution The solved Sudoku Puzzle String (partial or complete resolution)
   * @returns {boolean} Return true if the puzzle solution is valid
   */
    isValidSolution(puzzleString, solution) {
        return this.isValidPuzzleString(solution)
            && puzzleString
                .split('')
                .reduce((res, val, index) => {
                    if (val != '.' && val !== solution.slice(index, index + 1)) {
                        res = false
                    }
                    return res
                }, true)
    }

    /**
     * Test if the puzzle contain unresolved positions.
     * Do not control puzzle validity or result validity.
     * @param {string} puzzleString The Sudoku Puzzle String to solve
     * @returns {boolean} Return true if the puzzle is solved
     */
    isSolved(puzzleString) {
        return !puzzleString.includes('.')
    }
}

module.exports = {
    SudokuValidator: SudokuValidator
};