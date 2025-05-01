'use strict'

const hintToString = function (hint) {
  const line = [
    '<',
    hint,
    hint < 10 ? ' ' : '',
    '>'
  ]
  return line.join('')
}

class Wijuko {
  /**
   *  G0  |H0 | G1  |H1 | G2
   * -H2 -+   +-H3 -+   +-H4 -
   *  G3  |H5 | G4  |H6 | G5
   * -H7 -+   +-H8 -+   +-H9 -
   *  G6  |H10| G7  |H11| G8
   */
  constructor () {
    this.grid = []
    this.hints = []
  }

  gridLine (gridStart, hintLine) {
    const line = [
      '+  ',
      this.grid[gridStart + 0],
      '  ',
      this.hints[hintLine] ? hintToString(this.hints[hintLine]) : ' || ',
      ' ',
      this.grid[gridStart + 1],
      '  ',
      this.hints[hintLine + 1] ? hintToString(this.hints[hintLine + 1]) : ' || ',
      '  ',
      this.grid[gridStart + 2],
      '  |'
    ]
    return line.join('')
  }

  hintLine (start) {
    const line = [
      '+-',
      this.hints[start] ? hintToString(this.hints[start]) : '----',
      '-++-',
      this.hints[start + 1] ? hintToString(this.hints[start + 1]) : '----',
      '-++-',
      this.hints[start + 2] ? hintToString(this.hints[start + 2]) : '----',
      '-+'
    ]
    return line.join('')
  }

  /**
   *
   * @param {*} stream
   */
  prettyPrint (stream) {
    /**
     * This looks like this:
     * +------++------++------+
     * +  G  <HH> G  <HH> G   |
     * +-<HH>-++-<HH>-++-<HH>-+
     * +  G  <HH> G  <HH> G   |
     * +-<HH>-++-<HH>-++-<HH>-+
     * +  G  <HH> G  <HH> G   |
     * +------++------++------+
     *
     * e.g.
     * +------++------++------+
     * +  9  <16> 7  <10>  3  |
     * +-<15>-++-<15>-++------+
     * +  6   ||  8   ||   5  |
     * +-<10>-++------++------+
     * +  4  <5 > 1  <3 >  2  |
     * +------++------++------+
     */
    const border = '+------++------++------+'
    stream(border)
    stream(this.gridLine(0, 0))
    stream(this.hintLine(2))
    stream(this.gridLine(3, 5))
    stream(this.hintLine(7))
    stream(this.gridLine(6, 10))
    stream(border)
  }
}

const generateGridArray = function (gen) {
  // Create an array of integers from 1 to 9
  const numbers = Array.from({ length: 9 }, (_, i) => i + 1)

  // Fisher-Yates shuffle
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(gen() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]]
  }
  return numbers
}

const generate = function (gen) {
  const puzzle = new Wijuko()
  // Get a new random array for the number grid
  puzzle.grid = generateGridArray(gen)
  // Let's just put all sums in as hints
  puzzle.hints = Array(12)
  puzzle.hints[0] = puzzle.grid[0] + puzzle.grid[1]
  puzzle.hints[1] = puzzle.grid[1] + puzzle.grid[2]

  puzzle.hints[2] = puzzle.grid[0] + puzzle.grid[3]
  puzzle.hints[3] = puzzle.grid[1] + puzzle.grid[4]
  puzzle.hints[4] = puzzle.grid[2] + puzzle.grid[5]

  puzzle.hints[5] = puzzle.grid[3] + puzzle.grid[4]
  puzzle.hints[6] = puzzle.grid[4] + puzzle.grid[5]

  puzzle.hints[7] = puzzle.grid[3] + puzzle.grid[6]
  puzzle.hints[8] = puzzle.grid[4] + puzzle.grid[7]
  puzzle.hints[9] = puzzle.grid[5] + puzzle.grid[8]

  puzzle.hints[10] = puzzle.grid[6] + puzzle.grid[7]
  puzzle.hints[11] = puzzle.grid[7] + puzzle.grid[8]
  return puzzle
}

const generateStandard1 = function () {
  const puzzle = new Wijuko()
  puzzle.grid = [9, 7, 3, 6, 8, 5, 4, 1, 2]
  puzzle.hints = [16, 10, 15, 15, undefined, undefined, undefined, 10, undefined, undefined, 5, 3]
  return puzzle
}

module.exports.generateGridArray = generateGridArray
module.exports.generate = generate
module.exports.generateStandard1 = generateStandard1
