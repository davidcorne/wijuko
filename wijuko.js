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
  const indices = Array.from({ length: 12 }, (_, i) => i)
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(gen() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]]
  }
  const toUndefine = indices.slice(0, 5)
  toUndefine.forEach(i => { puzzle.hints[i] = undefined })
  return puzzle
}

const generateStandard1 = function () {
  const puzzle = new Wijuko([9, 7, 3, 6, 8, 5, 4, 1, 2])
  puzzle.hints = [16, 10, 15, 15, undefined, undefined, undefined, 10, undefined, undefined, 5, 3]
  return puzzle
}

const generateSVG = function (puzzle) {
  const svgTemplateStrings = [`<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <!-- Border -->
  <rect x="0" y="0" width="300" height="300" fill="none" stroke="black" stroke-width="4"/>
  
  <!-- Grid Lines -->
  <line x1="100" y1="0" x2="100" y2="300" stroke="black" stroke-width="2"/>
  <line x1="200" y1="0" x2="200" y2="300" stroke="black" stroke-width="2"/>
  <line x1="0" y1="100" x2="300" y2="100" stroke="black" stroke-width="2"/>
  <line x1="0" y1="200" x2="300" y2="200" stroke="black" stroke-width="2"/>

  <!-- Diamonds with numbers -->
`,

  puzzle.hints[0]
    ? `<polygon points="100,40 110,50 100,60 90,50" fill="white" stroke="black"/>
  <text x="100" y="50" text-anchor="middle" dominant-baseline="middle" font-size="12">${puzzle.hints[0]}</text>
`
    : '',
  puzzle.hints[1]
    ? `<polygon points="200,40 210,50 200,60 190,50" fill="white" stroke="black"/>
  <text x="200" y="50" text-anchor="middle" dominant-baseline="middle" font-size="12">${puzzle.hints[1]}</text>
`
    : '',
  puzzle.hints[2]
    ? `<polygon points="40,100 50,110 60,100 50,90" fill="white" stroke="black"/>
  <text x="50" y="100" text-anchor="middle" dominant-baseline="middle" font-size="12">${puzzle.hints[2]}</text>
`
    : '',
  puzzle.hints[3]
    ? `<polygon points="140,100 150,110 160,100 150,90" fill="white" stroke="black"/>
  <text x="150" y="100" text-anchor="middle" dominant-baseline="middle" font-size="12">${puzzle.hints[3]}</text>
`
    : '',
  puzzle.hints[4]
    ? `<polygon points="240,100 250,110 260,100 250,90" fill="white" stroke="black"/>
  <text x="250" y="100" text-anchor="middle" dominant-baseline="middle" font-size="12">${puzzle.hints[4]}</text>
`
    : '',
  puzzle.hints[5]
    ? `<polygon points="100,140 110,150 100,160 90,150" fill="white" stroke="black"/>
  <text x="100" y="150" text-anchor="middle" dominant-baseline="middle" font-size="12">${puzzle.hints[5]}</text>
`
    : '',
  puzzle.hints[6]
    ? `<polygon points="200,140 210,150 200,160 190,150" fill="white" stroke="black"/>
  <text x="200" y="150" text-anchor="middle" dominant-baseline="middle" font-size="12">${puzzle.hints[6]}</text>
`
    : '',
  puzzle.hints[7]
    ? `<polygon points="40,200 50,210 60,200 50,190" fill="white" stroke="black"/>
  <text x="50" y="200" text-anchor="middle" dominant-baseline="middle" font-size="12">${puzzle.hints[7]}</text>
`
    : '',
  puzzle.hints[8]
    ? `<polygon points="140,200 150,210 160,200 150,190" fill="white" stroke="black"/>
  <text x="150" y="200" text-anchor="middle" dominant-baseline="middle" font-size="12">${puzzle.hints[8]}</text>
`
    : '',
  puzzle.hints[9]
    ? `<polygon points="240,200 250,210 260,200 250,190" fill="white" stroke="black"/>
  <text x="250" y="200" text-anchor="middle" dominant-baseline="middle" font-size="12">${puzzle.hints[9]}</text>
`
    : '',
  puzzle.hints[10]
    ? `<polygon points="100,240 110,250 100,260 90,250" fill="white" stroke="black"/>
  <text x="100" y="250" text-anchor="middle" dominant-baseline="middle" font-size="12">${puzzle.hints[10]}</text>
`
    : '',
  puzzle.hints[11]
    ? `<polygon points="200,240 210,250 200,260 190,250" fill="white" stroke="black"/>
  <text x="200" y="250" text-anchor="middle" dominant-baseline="middle" font-size="12">${puzzle.hints[11]}</text>
`
    : '',
  '</svg>'
  ]
  return svgTemplateStrings.join('')
}

module.exports.generateSVG = generateSVG
module.exports.generateGridArray = generateGridArray
module.exports.generate = generate
module.exports.generateStandard1 = generateStandard1
