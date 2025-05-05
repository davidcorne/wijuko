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
})
