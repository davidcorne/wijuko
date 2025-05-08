'use strict'
/* global describe, it */
const chai = require('chai')
const assert = chai.assert

const wijuko = require('./wijuko')
const solver = require('./solver')

describe('generate', function () {
  it('generateGridArray Math.random', function () {
    // Test the generated grid using Math.random 1000 times and ensure it has exactly 1-9
    for (let i = 0; i < 1000; i++) {
      const grid = wijuko.generateGridArray(Math.random)
      assert.strictEqual(9, grid.length)
      const set = new Set(grid)
      assert.ok(set.has(1))
      assert.ok(set.has(2))
      assert.ok(set.has(3))
      assert.ok(set.has(4))
      assert.ok(set.has(5))
      assert.ok(set.has(6))
      assert.ok(set.has(7))
      assert.ok(set.has(8))
      assert.ok(set.has(9))
    }
  })
  it('generate Math.random', function () {
    const puzzle = wijuko.generate(Math.random)
    assert.strictEqual(9, puzzle.grid.length)
  })
})

describe('solve', function () {
  it('isSolution', function () {
    const grid = [9, 7, 3, 6, 8, 5, 4, 1, 2]
    const hints1 = [16, 10, 15, 15, undefined, undefined, undefined, 10, undefined, undefined, 5, 3]
    assert.ok(solver.isSolution(grid, hints1))

    const hints2 = [17, 10, 15, 15, undefined, undefined, undefined, 10, undefined, undefined, 5, 3]
    assert.ok(!solver.isSolution(grid, hints2))

    const hints3 = [16, 10, 15, 15, undefined, undefined, undefined, 10, undefined, undefined, 5, 2]
    assert.ok(!solver.isSolution(grid, hints3))
  })
  it('bruteForceSolve', function () {
    const hints = [16, 10, 15, 15, undefined, undefined, undefined, 10, undefined, undefined, 5, 3]
    const solutions = solver.bruteForceSolve(hints)
    // There should only be one solution
    assert.strictEqual(solutions.length, 1)
    assert.deepEqual(solutions[0], [9, 7, 3, 6, 8, 5, 4, 1, 2])
  })
  it('solve', function () {
    const hints = [16, 10, 15, 15, undefined, undefined, undefined, 10, undefined, undefined, 5, 3]
    const solutions = solver.solve(hints)
    // There should only be one solution
    assert.strictEqual(solutions.length, 1)
    assert.deepEqual(solutions[0], [9, 7, 3, 6, 8, 5, 4, 1, 2])
  })
  it('possibilities', function () {
    const pos = new solver.Possibility()
    assert.strictEqual(pos.possibilities.length, 9)
  })
  it('possibillity array permutations', function () {
    const possibilities = [
      { possibilities: [1, 2] },
      { possibilities: [3] },
      { possibilities: [4, 5] }
    ]
    const grids = solver.possibilitiesPermutations(possibilities)
    const expected = [[1, 3, 4], [1, 3, 5], [2, 3, 4], [2, 3, 5]]
    // Sort both arrays to avoid order issues
    const sortFn = (a, b) => a.join(',').localeCompare(b.join(','))
    grids.sort(sortFn)
    expected.sort(sortFn)

    assert.deepStrictEqual(grids, expected)
  })
  it('possibility prune', function () {
    const possibilities = [
      new solver.Possibility(),
      new solver.Possibility(),
      new solver.Possibility(),
      new solver.Possibility(),
      new solver.Possibility(),
      new solver.Possibility(),
      new solver.Possibility(),
      new solver.Possibility(),
      new solver.Possibility(),
    ]
    possibilities[0].possibilities = [1]
    possibilities[1].possibilities = [1, 2]
    possibilities[2].possibilities = [3]
    possibilities[3].possibilities = [3, 4]
    possibilities[4].possibilities = [3, 5]
    possibilities[5].possibilities = [3, 6]
    possibilities[6].possibilities = [3, 7]
    possibilities[7].possibilities = [3, 8]
    possibilities[8].possibilities = [3, 9]

    solver.prunePossibilities(possibilities)
    assert.deepEqual(possibilities[0].possibilities, [1])
    assert.deepEqual(possibilities[1].possibilities, [2])
    assert.deepEqual(possibilities[2].possibilities, [3])
    assert.deepEqual(possibilities[3].possibilities, [4])
    assert.deepEqual(possibilities[4].possibilities, [5])
    assert.deepEqual(possibilities[5].possibilities, [6])
    assert.deepEqual(possibilities[6].possibilities, [7])
    assert.deepEqual(possibilities[7].possibilities, [8])
    assert.deepEqual(possibilities[8].possibilities, [9])
  })
  it('possibility narrow', function () {
    const pos1 = new solver.Possibility()
    pos1.hint(17)
    assert.deepEqual(pos1.possibilities, [8, 9])

    const pos2 = new solver.Possibility()
    pos2.hint(16)
    assert.deepEqual(pos2.possibilities, [7, 9])

    const pos3 = new solver.Possibility()
    pos3.hint(15)
    assert.deepEqual(pos3.possibilities, [6, 7, 8, 9])

    // Check that hints will remove not reintroduce possibilities
    const pos4 = new solver.Possibility()
    // If this space has to add to 17 and 16, it can only be 9
    pos4.hint(17)
    pos4.hint(16)
    assert.deepEqual(pos4.possibilities, [9])
  })
  it('possibillity generation', function () {
    const hints = [9, 13, 5, 16, 10, 12, 13, 11, 14, 5, 13, 6]
    // The grid will be [2, 7, 6, 3, 9, 4, 8, 5, 1]
    const possibilities = solver.generatePossibilities(hints)
    assert.deepEqual(possibilities[0].possibilities, [1, 2])
    assert.deepEqual(possibilities[1].possibilities, [7])
    assert.deepEqual(possibilities[2].possibilities, [6, 8])
    assert.deepEqual(possibilities[3].possibilities, [3])
    assert.deepEqual(possibilities[4].possibilities, [9])
    assert.deepEqual(possibilities[5].possibilities, [4])
    assert.deepEqual(possibilities[6].possibilities, [6, 8])
    assert.deepEqual(possibilities[7].possibilities, [5])
    assert.deepEqual(possibilities[8].possibilities, [1, 2])
  })
  it('possibillity solve', function () {
    const hints = [16, 10, 15, 15, undefined, undefined, undefined, 10, undefined, undefined, 5, 3]
    const solutions = solver.possibilitySolve(hints)
    // There should only be one solution
    assert.strictEqual(solutions.length, 1)
    assert.deepEqual(solutions[0], [9, 7, 3, 6, 8, 5, 4, 1, 2])
  })
})
