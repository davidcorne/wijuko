'use strict'

const solver = require('./solver')

const hintToString = function (hint) {
  const line = [
    '<',
    hint,
    hint < 10 ? ' ' : '',
    '>'
  ]
  return line.join('')
}

class Suko {
  constructor (grid) {
    this.grid = grid
    this.hints = [
      this.grid[0] + this.grid[1] + this.grid[3] + this.grid[4],
      this.grid[1] + this.grid[2] + this.grid[4] + this.grid[5],
      this.grid[3] + this.grid[4] + this.grid[6] + this.grid[7],
      this.grid[4] + this.grid[5] + this.grid[7] + this.grid[8],
    ]
  }

  fillHints () {
    
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
  const puzzle = new Suko(grid)
  
  return puzzle
}

const generateSVG = function (puzzle) {
  return `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
    <!-- Solution -->
    <!-- ${puzzle.grid[0]} ${puzzle.grid[1]} ${puzzle.grid[2]}-->
    <!-- ${puzzle.grid[3]} ${puzzle.grid[4]} ${puzzle.grid[5]}-->
    <!-- ${puzzle.grid[6]} ${puzzle.grid[7]} ${puzzle.grid[8]}-->
  
    <!-- Outer border -->
  <rect x="0" y="0" width="200" height="200" stroke="black" fill="none" stroke-width="2"/>

  <!-- Grid lines (2 vertical and 2 horizontal for 3x3 cells) -->
  <g stroke="black" stroke-width="1">
    <!-- Vertical lines -->
    <line x1="66.67" y1="0" x2="66.67" y2="200" />
    <line x1="133.33" y1="0" x2="133.33" y2="200" />
    <!-- Horizontal lines -->
    <line x1="0" y1="66.67" x2="200" y2="66.67" />
    <line x1="0" y1="133.33" x2="200" y2="133.33" />
  </g>

  <!-- Circles with numbers at grid line intersections -->
  <g fill="white" stroke="black">
    <circle cx="66.67" cy="66.67" r="12" />
    <text x="66.67" y="71.67" font-size="10" text-anchor="middle" fill="black">${puzzle.hints[0]}</text>

    <circle cx="133.33" cy="66.67" r="12" />
    <text x="133.33" y="71.67" font-size="10" text-anchor="middle" fill="black">${puzzle.hints[1]}</text>

    <circle cx="66.67" cy="133.33" r="12" />
    <text x="66.67" y="138.33" font-size="10" text-anchor="middle" fill="black">${puzzle.hints[2]}</text>

    <circle cx="133.33" cy="133.33" r="12" />
    <text x="133.33" y="138.33" font-size="10" text-anchor="middle" fill="black">${puzzle.hints[3]}</text>
  </g>
</svg>
`
}

const main = function () {
  const puzzleRand = generate(Math.random)
  const puzzleAsSVG = generateSVG(puzzleRand)
  console.log(puzzleAsSVG)
}

main()

module.exports.generateSVG = generateSVG
module.exports.generateGridArray = generateGridArray
module.exports.generate = generate
