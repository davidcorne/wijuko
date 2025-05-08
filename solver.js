'use strict'

function generateGrids () {
  const results = []

  function permute (arr, start = 0) {
    if (start === arr.length - 1) {
      results.push([...arr])
      return
    }
    for (let i = start; i < arr.length; i++) {
      [arr[start], arr[i]] = [arr[i], arr[start]]
      permute(arr, start + 1);
      [arr[start], arr[i]] = [arr[i], arr[start]] // backtrack
    }
  }

  permute([1, 2, 3, 4, 5, 6, 7, 8, 9])
  return results
}

/**
 * Return a grid
 * @param {Array} hints
 * @returns {Array}
 */
const solve = function (hints) {
  return bruteForceSolve(hints)
}

class Possibility {

  constructor () {
    this.possibilities = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  }

  length() {
    return this.possibilities.length
  }
  hint(hint) {
    if (hint === 17) {
      // Can only be 8, 9
      // this.possibilities.filter((item, index, array) =>)
        this.possibilities = [8, 9]
      }
    if (hint === 16) {
      // Can only be 7, 9
      this.possibilities = [7, 9]
    }
    if (hint === 15) {
      // Can be 6+
      this.possibilities = [6, 7, 8, 9]
    }
  }
}

const possibilitiesPermutations = function (options) {
  const result = [];

  function helper(current, index) {
    if (index === options.length) {
      result.push([...current]);
      return;
    }

    for (let val of options[index].possibilities) {
      current.push(val);
      helper(current, index + 1);
      current.pop();
    }
  }

  helper([], 0);
  return result;  
}

/**
 * An algorithm which examains the possible 
 * @param {Array} hints
 * @returns {Array}
 */
const possibilitySolve = function (options) {
  // Narrow down the possibilities
  return [[9, 7, 3, 6, 8, 5, 4, 1, 2]]
}


/**
 * Return a grid
 * @param {Array} hints
 * @returns {Array}
 */
const bruteForceSolve = function (hints) {
  // Generate all grids, check if any solve them
  // Note: this is NOT efficient
  const allGrids = generateGrids()
  const solutions = allGrids.filter((grid) => isSolution(grid, hints))
  return solutions
}

const isSolution = function (grid, hints) {
  if (hints[0] && hints[0] !== grid[0] + grid[1]) {
    return false
  }
  if (hints[1] && hints[1] !== grid[1] + grid[2]) {
    return false
  }
  if (hints[2] && hints[2] !== grid[0] + grid[3]) {
    return false
  }
  if (hints[3] && hints[3] !== grid[1] + grid[4]) {
    return false
  }
  if (hints[4] && hints[4] !== grid[2] + grid[5]) {
    return false
  }
  if (hints[5] && hints[5] !== grid[3] + grid[4]) {
    return false
  }
  if (hints[6] && hints[6] !== grid[4] + grid[5]) {
    return false
  }
  if (hints[7] && hints[7] !== grid[3] + grid[6]) {
    return false
  }
  if (hints[8] && hints[8] !== grid[4] + grid[7]) {
    return false
  }
  if (hints[9] && hints[9] !== grid[5] + grid[8]) {
    return false
  }
  if (hints[10] && hints[10] !== grid[6] + grid[7]) {
    return false
  }
  if (hints[11] && hints[11] !== grid[7] + grid[8]) {
    return false
  }
  return true
}

module.exports.solve = solve
module.exports.bruteForceSolve = bruteForceSolve
module.exports.isSolution = isSolution
module.exports.Possibility = Possibility
module.exports.possibilitiesPermutations = possibilitiesPermutations
module.exports.possibilitySolve = possibilitySolve
