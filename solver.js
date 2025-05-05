'use strict'

/**
 * Return a grid
 * @param {Array} hints
 * @returns {Array}
 */
const solve = function (hints) {

}

const isSolution = function (grid, hints) {
    if(hints[0] && hints[0] !== grid[0] + grid[1]) {
        console.log(0)
        return false
    }
    if(hints[1] && hints[1] !== grid[1] + grid[2]) {
        console.log(1)
        return false
    }
    if(hints[2] && hints[2] !== grid[0] + grid[3]) {
        console.log(2)
        return false
    }
    if(hints[3] && hints[3] !== grid[1] + grid[4]) {
        console.log(3)
        return false
    }
    if(hints[4] && hints[4] !== grid[2] + grid[5]) {
        console.log(4)
        return false
    }
    if(hints[5] && hints[5] !== grid[3] + grid[4]) {
        console.log(5)
        return false
    }
    if(hints[6] && hints[6] !== grid[4] + grid[5]) {
        console.log(6)
        return false
    }
    if(hints[7] && hints[7] !== grid[3] + grid[6]) {
        console.log(7)
        return false
    }
    if(hints[8] && hints[8] !== grid[4] + grid[7]) {
        console.log(8)
        return false
    }
    if(hints[9] && hints[9] !== grid[5] + grid[8]) {
        console.log(9)
        return false
    }
    if(hints[10] && hints[10] !== grid[6] + grid[7]) {
        console.log(10)
        return false
    }
    if(hints[11] && hints[11] !== grid[7] + grid[8]) {
        console.log(11)
        return false
    }
    return true
}

module.exports.solve = solve
module.exports.isSolution = isSolution
