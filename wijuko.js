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
  constructor (grid) {
    this.grid = grid
    this.hints = []
  }

  fillHints () {
    this.hints[0] = this.grid[0] + this.grid[1]
    this.hints[1] = this.grid[1] + this.grid[2]
  
    this.hints[2] = this.grid[0] + this.grid[3]
    this.hints[3] = this.grid[1] + this.grid[4]
    this.hints[4] = this.grid[2] + this.grid[5]
  
    this.hints[5] = this.grid[3] + this.grid[4]
    this.hints[6] = this.grid[4] + this.grid[5]
  
    this.hints[7] = this.grid[3] + this.grid[6]
    this.hints[8] = this.grid[4] + this.grid[7]
    this.hints[9] = this.grid[5] + this.grid[8]
  
    this.hints[10] = this.grid[6] + this.grid[7]
    this.hints[11] = this.grid[7] + this.grid[8]
  }

  gridLine (gridStart, hintLine, printGridNumber) {
    const line = [
      '+  ',
      printGridNumber ? this.grid[gridStart] : ' ',
      '  ',
      this.hints[hintLine] ? hintToString(this.hints[hintLine]) : ' || ',
      ' ',
      printGridNumber ? this.grid[gridStart + 1] : ' ',
      '  ',
      this.hints[hintLine + 1] ? hintToString(this.hints[hintLine + 1]) : ' || ',
      '  ',
      printGridNumber ? this.grid[gridStart + 2] : ' ',
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

  prettyPrint (stream, printGridNumber) {
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
    stream(this.gridLine(0, 0, printGridNumber))
    stream(this.hintLine(2))
    stream(this.gridLine(3, 5, printGridNumber))
    stream(this.hintLine(7))
    stream(this.gridLine(6, 10, printGridNumber))
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
  // Get a new random array for the number grid
  const grid = generateGridArray(gen)
  const puzzle = new Wijuko(grid)
  // Let's just put all sums in as hints
  puzzle.fillHints()
  // Now let's randomly remove 5 of them, by picking the indicies
  const indices = Array.from({ length: 12 }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(gen() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const toUndefine = indices.slice(0, 5);
  toUndefine.forEach(i => puzzle.hints[i] = undefined);
  return puzzle
}

const generateStandard1 = function () {
  const puzzle = new Wijuko([9, 7, 3, 6, 8, 5, 4, 1, 2])
  puzzle.hints = [16, 10, 15, 15, undefined, undefined, undefined, 10, undefined, undefined, 5, 3]
  return puzzle
}

module.exports.generateGridArray = generateGridArray
module.exports.generate = generate
module.exports.generateStandard1 = generateStandard1
