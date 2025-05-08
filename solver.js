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

  filter (predicate) {
    this.possibilities = this.possibilities.filter((item, index, array) => predicate(item))
  }

  hint (hint) {
    if (hint === 17) {
      // Can only be 8, 9
      this.filter(item => item === 8 || item === 9)
    }
    if (hint === 16) {
      // Can only be 7, 9
      this.filter(item => item === 7 || item === 9)
    }
    if (hint === 15) {
      // Can be 6+
      this.filter(item => item >= 6)
    }
    if (hint === 14) {
      // [5, 9], [6, 8]
      this.filter(item => item === 5 || item === 9 || item === 6 || item === 8)
    }
    if (hint === 13) {
      // [4, 9], [5, 8], [6, 7]
      this.filter(item => item === 4 || item === 9 || item === 5 || item === 8 || item === 6 || item === 7)
    }
    if (hint === 12) {
      // [3, 9], [4, 8], [5, 7]
      this.filter(item => item === 3 || item === 9 || item === 4 || item === 8 || item === 5 || item === 7)
    }
    if (hint === 11) {
      // [2, 9], [3, 8], [4, 7], [5, 6]
      // i.e. can't be 1
      this.filter(item => item !== 1)
    }
    if (hint === 10) {
      // Can't be 5
      this.filter(item => item !== 5)
    }
    if (hint === 9) {
      // Can't be 9
      this.filter(item => item !== 9)
    }
    if (hint === 8) {
      // Under 8, can't be 4
      this.filter(item => item === 1 || item === 2 || item === 3 || item === 5 || item === 6 || item === 7)
    }
    if (hint === 7) {
      // [1, 6], [2, 5], [3, 4]
      this.filter(item => item <= 6)
    }
    if (hint === 6) {
      // Under 6, can't be 3
      this.filter(item => item === 1 || item === 2 || item === 4 || item === 5)
    }
    if (hint === 5) {
      this.filter(item => item <= 4)
    }
    if (hint === 4) {
      this.filter(item => item === 1 || item === 3)
    }
    if (hint === 3) {
      this.filter(item => item === 1 || item === 2)
    }
  }
}

const possibilitiesPermutations = function (possibilities) {
  const result = []

  function helper (current, index) {
    if (index === possibilities.length) {
      result.push([...current])
      return
    }

    for (const val of possibilities[index].possibilities) {
      current.push(val)
      helper(current, index + 1)
      current.pop()
    }
  }

  helper([], 0)
  return result
}

const prunePossibilities = function (possibilities) {
  const restarted = new Set()
  for (let i = 0; i < possibilities.length; ++i) {
    if (possibilities[i].possibilities.length === 1) {
      const value = possibilities[i].possibilities[0]
      if (restarted.has(value)) {
        continue
      }
      restarted.add(value)
      // The value must be this possiblity, so remove it from the others
      for (let j = 0; j < possibilities.length; ++j) {
        if (i !== j) {
          possibilities[j].filter(item => item !== value)
        }
      }
      // Restart this loop in case we've changed a [a,b] to [a] before this
      i = -1
      continue
    }
  }
}

const generatePossibilities = function (hints) {
  const possibilities = []
  for (let i = 0; i < 9; i++) {
    possibilities.push(new Possibility())
  }
  if (hints[0]) {
    possibilities[0].hint(hints[0])
    possibilities[1].hint(hints[0])
  }
  if (hints[1]) {
    possibilities[1].hint(hints[1])
    possibilities[2].hint(hints[1])
  }
  if (hints[2]) {
    possibilities[0].hint(hints[2])
    possibilities[3].hint(hints[2])
  }
  if (hints[3]) {
    possibilities[1].hint(hints[3])
    possibilities[4].hint(hints[3])
  }
  if (hints[4]) {
    possibilities[2].hint(hints[4])
    possibilities[5].hint(hints[4])
  }
  if (hints[5]) {
    possibilities[3].hint(hints[5])
    possibilities[4].hint(hints[5])
  }
  if (hints[6]) {
    possibilities[4].hint(hints[6])
    possibilities[5].hint(hints[6])
  }
  if (hints[7]) {
    possibilities[3].hint(hints[7])
    possibilities[6].hint(hints[7])
  }
  if (hints[8]) {
    possibilities[4].hint(hints[8])
    possibilities[7].hint(hints[8])
  }
  if (hints[9]) {
    possibilities[5].hint(hints[9])
    possibilities[8].hint(hints[9])
  }
  if (hints[10]) {
    possibilities[6].hint(hints[10])
    possibilities[7].hint(hints[10])
  }
  if (hints[11]) {
    possibilities[7].hint(hints[11])
    possibilities[8].hint(hints[11])
  }
  prunePossibilities(possibilities)
  return possibilities
}

/**
 * An algorithm which examains the possible
 * @param {Array} hints
 * @returns {Array}
 */
const possibilitySolve = function (hints) {
  // Narrow down the possibilities
  const possibilities = generatePossibilities(hints)
  const possibleGrids = possibilitiesPermutations(possibilities)
  const solutions = possibleGrids.filter((grid) => isSolution(grid, hints))
  return solutions
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
  // Check there's exactly one of each number, by summing them to 45
  const sum = grid.reduce((a, b) => a + b, 0)
  if (sum !== 45) {
    return false
  }

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
module.exports.generatePossibilities = generatePossibilities
module.exports.prunePossibilities = prunePossibilities
