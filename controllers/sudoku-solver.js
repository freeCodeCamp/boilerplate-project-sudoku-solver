const Ut = require('../utils/utils');
const {PuzzleGroup} = require('../utils/enums');
const {SudokuHelper} = require('../utils/sudoku-helper');
const sdh = new SudokuHelper();

class SudokuSolver {
  

  /**
   * 
   * @param {*} puzzleString 
   * @returns 
   */
  validate(puzzleString) {
    return sdh.isValidPuzzleString(puzzleString)
  }

  /**
   * 
   * @param {*} puzzleString 
   * @param {*} row 
   * @param {*} column 
   * @param {*} value 
   * @returns 
   */
  checkRowPlacement(puzzleString, row, column, value) {
    sdh.isValidDataPlacement(puzzleString, row, column, value)
    const set = sdh.getRowFromPuzzle(puzzleString, row)
    const posValue = set.slice(column, column + 1);
    return sdh.checkPlacement(set, posValue, value)
  }

  /**
   * Todo: Remove from here
   * @param {*} dataSet 
   * @param {*} row 
   * @param {*} value 
   * @returns 
   */
  checkDataSetColPlacement(dataSet, row, value){
    const posValue = dataSet.slice(row, row + 1);
    return sdh.checkPlacement(dataSet, posValue, value)
  }

  /**
   * 
   * @param {*} puzzleString 
   * @param {*} row 
   * @param {*} column 
   * @param {*} value 
   * @returns 
   */
  checkColPlacement(puzzleString, row, column, value) {
    sdh.isValidDataPlacement(puzzleString, row, column, value)
    const dataSet = sdh.getColFromPuzzle(puzzleString, column)
    const posValue = dataSet.slice(row, row + 1);
    return sdh.checkPlacement(dataSet, posValue, value)
  }
  
  /**
   * Test if is valid region placement value.
   * A region is a square of 3x3 elements (9 values).
   * @param {string} puzzleString The actual puzzle string to solve
   * @param {number} row The row number to evaluate the value
   * @param {number} column The column number to evaluate the value
   * @param {string} value The value to evaluate
   * @returns {boolean} Return true if value is valid on those coordinates
   * @throws Error if:
   *  - puzzleString is not valid (81 chars of [1-9] and/or ".")
   *  - row is out of bounds (0 >= row < 9)
   *  - column is out of bounds (0 >= column < 9)
   *  - value is not valid string ([1-9])
   */
  checkRegionPlacement(puzzleString, row, column, value) {
    sdh.isValidDataPlacement(puzzleString, row, column, value);
    const region = sdh.getRegionFromPosition(row, column);
    const regionChar = sdh.getRegionCharFromPosition(row, column);
    const dataSet = sdh.getRegionFromPuzzle(puzzleString, region);
    const posValue = dataSet.slice(regionChar, regionChar + 1);
    return sdh.checkPlacement(dataSet, posValue, value);
  }

  checkPlacement(puzzleString, row, column, value){
    let res = {
      valid: false,
      conflict: []
    }
    const checkRow = this.checkRowPlacement(puzzleString, row, column, value);
    const checkCol = this.checkColPlacement(puzzleString, row, column, value);
    const checkRegion = this.checkRegionPlacement(puzzleString, row, column, value);
    if(checkRow && checkCol && checkRegion){
      res = {
        valid: true
      }
    }else{
      if(!checkRow){
        res.conflict.push("row")
      }

      if(!checkCol){
        res.conflict.push("column")
      }

      if(!checkRegion){
        res.conflict.push("region")
      }
    }
    return res;
  }

  checkRowsPossibilities(puzzleString, arraySet, row, missValue){
    const t = this;
    return arraySet.reduce((res, val, col)=>{
      if(val==='.'){
        const checkCols = t.checkColPlacement(puzzleString, row, col, missValue),
          checkRegion = t.checkRegionPlacement(puzzleString, row, col, missValue)
        if(checkCols && checkRegion){
          res.push(col)
        }
      }
      return res
    }, [])
  }

  checkColsPossibilities(puzzleString, arraySet, col, missValue){
    const t = this;
    return arraySet.reduce((res, val, row)=>{
      if(val==='.'){
        const checkRows = t.checkRowPlacement(puzzleString, row, col, missValue),
          checkRegion = t.checkRegionPlacement(puzzleString, row, col, missValue)
        if(checkRows && checkRegion){
          res.push(row)
        }
      }
      return res
    }, [])
  }

  checkRegionPossibilities(puzzleString, arraySet, region, missValue){
    const t = this;
    return arraySet.reduce((res, val, regionChar)=>{
      if(val==='.'){
        const pos = sdh.getPositionFromRegion(region, regionChar)
        const checkRows = t.checkRowPlacement(puzzleString, pos.row, pos.col, missValue),
        checkCols = t.checkColPlacement(puzzleString, pos.row, pos.col, missValue)
        if(checkRows && checkCols){
          res.push(regionChar)
        }
      }
      return res
    }, [])
  }

  /**
   * Check a dataSet Group mmising value with other groups
   * @param {string} puzzleString 
   * @param {[{string}]} arraySet 
   * @param {string} missValue 
   * @param {number} groupIndex The group related index (row, column or region index)
   * @param {PuzzleGroup} group The dataSet Group to resolve
   * @returns 
   */
  checkPossibilities(puzzleString, arraySet, missValue, groupIndex, group){
    switch(group){
      case PuzzleGroup.ROW:
        return this.checkRowsPossibilities(puzzleString, arraySet, groupIndex, missValue);
      case PuzzleGroup.COLUMN:
        return this.checkColsPossibilities(puzzleString, arraySet, groupIndex, missValue);
      case PuzzleGroup.REGION:
        return this.checkRegionPossibilities(puzzleString, arraySet, groupIndex, missValue);
      default:
        return new Error('Fatal Error: Puzzle data group is not valid.')
    }
  }

  

  /**
   * Resolve all possible positions on single dataSet Group.
   * A dataSet Group can be single Row, single Column or single Region.
   * To solve a position, we check every position who have only one possible value.
   * 
   * @param {string} puzzleString The Sudoku Puzzle String to solve
   * @param {string} dataSet Single Row, single Column or single Region to solve
   * @param {number} groupIndex The group related index (row, column or region index)
   * @param {PuzzleGroup} group The dataSet Group to resolve
   * @returns {string} Return resolved dataSet Group with all possibles solutions.
   */
  resolveDataSet(puzzleString, dataSet, groupIndex, group){
    const missingValues = sdh.getMissingValues(dataSet),
      nb_missing = missingValues.length;
    if(nb_missing > 0){
      let arraySet = dataSet.split(''),
        loops = 0,
        missKey = 0,
        nbResolved=0
      while(loops < nb_missing * nb_missing){
        const missValue = missingValues[missKey]
        const possibilities = this.checkPossibilities(
          puzzleString, 
          arraySet,
          missValue,
          groupIndex, 
          group
        )
        if(possibilities.length === 1){
          arraySet[possibilities[0]] = missValue;
          nbResolved++;
          if(nbResolved == nb_missing){
            break;
          }
        }
        loops++;
        missKey = (missKey < nb_missing-1) ? missKey+1 : 0;
      }
      return arraySet.join('')
    }
    return dataSet;
      
  }

  /**
   * Resolve all possible positions on dataSets Group.
   * A dataSets Group can be Rows, Columns or Regions.
   * 
   * @param {string} puzzleString The Sudoku Puzzle String to solve
   * @param {PuzzleGroup} group The dataSet Group to resolve
   * @returns {string} Returns The Sudoku Puzzle String,
   *   with all possibles positions resolved on related on dataSet Group
   */
  resolveDataSets(puzzleString, group){
    const dataSets = sdh.getDataSet(puzzleString, group),
      nbDataSets = dataSets.length
    let i = 0,
      pos = 0;
    while(i < 9){
      dataSets[pos] = this.resolveDataSet(
        puzzleString, 
        dataSets[pos], 
        pos, 
        group
      );
      pos = (pos < nbDataSets-1) ? pos+1 : 0;
      i++;
    }
    return sdh.arrayDataSetToString(dataSets, group)
  }

  /**
   * Solve Sudoku Puzzle
   * @param {string} puzzleString The Sudoku Puzzle String to solve
   * @returns {string} The solved Sudoku Puzzle String
   * @throws {Error} if an invalid solution is returned in loop by resolveDataSets method
   */
  solve(puzzleString) {
    if(!this.validate(puzzleString)){
      return '';
    }
    const groups = [
      PuzzleGroup.ROW, 
      PuzzleGroup.COLUMN, 
      PuzzleGroup.REGION
    ],
      nbGroups = groups.length,
      t = this;
    let i = 0,
    groupIndex = 0;
    while(i < 6){
      const group = groups[groupIndex]
      const tmp = t.resolveDataSets(puzzleString, group);
      if(sdh.isValidSolution(puzzleString, tmp)){
        puzzleString = tmp;
        if(sdh.isSolved(puzzleString)){
          break;
        }
      }else{
        throw new Error('Fatal error: Only unresolved position can change. Solver has intented modify original resolved position on the puzzle.')
      }
      i++;
      groupIndex = (groupIndex < nbGroups-1) ? groupIndex+1 : 0;
    }
    return puzzleString
  }
}

module.exports = SudokuSolver;