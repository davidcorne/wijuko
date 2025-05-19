'use strict'

class Area {
  constructor (span, grid) {
    this.span = span
    this.sum = 0
    for (let i = 0; i < this.span.length; ++i) {
      this.sum += grid[this.span[i]]
    }
  }
}

class Suko {
  constructor (grid, spans) {
    this.grid = grid
    this.hints = this.fillHints()
    this.areas = this.fillAreas(spans)
  }

  fillHints () {
    return [
      this.grid[0] + this.grid[1] + this.grid[3] + this.grid[4],
      this.grid[1] + this.grid[2] + this.grid[4] + this.grid[5],
      this.grid[3] + this.grid[4] + this.grid[6] + this.grid[7],
      this.grid[4] + this.grid[5] + this.grid[7] + this.grid[8]
    ]
  }

  fillAreas (spans) {
    const areas = []
    for (let i = 0; i < spans.length; ++i) {
      areas.push(new Area(spans[i], this.grid))
    }
    return areas
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

const generateSpans = function (gen) {
  const { regionA, regionB, regionC } = generateContiguousRegions(gen)
  return [regionA, regionB, regionC]
}

const generate = function (gen) {
  // Get a new random array for the number grid
  const grid = generateGridArray(gen)
  const spans = generateSpans(gen)
  const puzzle = new Suko(grid, spans)

  return puzzle
}

const generateSVG = function (puzzle) {
  const colours = new Array(9)
  const referenceColours = ['white', '#e9e9e9', '#d3d3d3']
  for (let i = 0; i < puzzle.areas.length; ++i) {
    const currentColour = referenceColours[i]
    for (let j = 0; j < puzzle.areas[i].span.length; ++j) {
      colours[puzzle.areas[i].span[j]] = currentColour
    }
  }
  return `<svg width="200" height="250" xmlns="http://www.w3.org/2000/svg">
    <!-- Solution -->
    <!-- ${puzzle.grid[0]} ${puzzle.grid[1]} ${puzzle.grid[2]}-->
    <!-- ${puzzle.grid[3]} ${puzzle.grid[4]} ${puzzle.grid[5]}-->
    <!-- ${puzzle.grid[6]} ${puzzle.grid[7]} ${puzzle.grid[8]}-->
  
  <g>
    <rect x="0" y="0" width="66.67" height="66.67" fill="${colours[0]}" />
    <rect x="66.67" y="0" width="66.67" height="66.67" fill="${colours[1]}" />
    <rect x="133.33" y="0" width="66.67" height="66.67" fill="${colours[2]}" />

    <rect x="0" y="66.67" width="66.67" height="66.67" fill="${colours[3]}" />
    <rect x="66.67" y="66.67" width="66.67" height="66.67" fill="${colours[4]}" />
    <rect x="133.33" y="66.67" width="66.67" height="66.67" fill="${colours[5]}" />

    <rect x="0" y="133.33" width="66.67" height="66.67" fill="${colours[6]}" />
    <rect x="66.67" y="133.33" width="66.67" height="66.67" fill="${colours[7]}" />
    <rect x="133.33" y="133.33" width="66.67" height="66.67" fill="${colours[8]}" />
  </g>
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

  <!-- Circles with numbers at the bottom for the sums of the areas -->
  <g fill="white" stroke="black">
    <circle cx="66.67" cy="225" r="12" fill="${referenceColours[0]}"/>
    <text x="66.67" y="230" font-size="10" text-anchor="middle" fill="black">${puzzle.areas[0].sum}</text>
  
    <circle cx="100" cy="225" r="12" fill="${referenceColours[1]}"/>
    <text x="100" y="230" font-size="10" text-anchor="middle" fill="black">${puzzle.areas[1].sum}</text>
  
    <circle cx="133.3" cy="225" r="12" fill="${referenceColours[2]}"/>
    <text x="133.3" y="230" font-size="10" text-anchor="middle" fill="black">${puzzle.areas[2].sum}</text>
  </g>

</svg>
`
}

function getNeighbors (index) {
  const neighbors = []
  const row = Math.floor(index / 3)
  const col = index % 3

  if (col > 0) neighbors.push(index - 1) // left
  if (col < 2) neighbors.push(index + 1) // right
  if (row > 0) neighbors.push(index - 3) // up
  if (row < 2) neighbors.push(index + 3) // down

  return neighbors
}

function growRegion (gen, start, size, excluded) {
  const region = [start]
  const regionSet = new Set([start])
  const frontier = [start]

  while (region.length < size && frontier.length > 0) {
    const current = frontier.shift()
    const neighbors = getNeighbors(current)
      .filter(n => !regionSet.has(n) && !excluded.has(n))

    if (neighbors.length === 0) continue
    const chosen = neighbors[Math.floor(gen() * neighbors.length)]
    region.push(chosen)
    regionSet.add(chosen)
    frontier.push(chosen)
  }

  return region.length === size ? region : null
}

function arraysEqual (a, b) {
  if (a.length !== b.length) {
    return false
  }
  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) {
      return false
    }
  }
  return true
}

/**
 *
 * @param {Array} region
 * @returns Boolean
 */
function invalidRegion (region) {
  if (region.length < 2 || region.length > 4) {
    // Can't have a region of 1 or 5+
    return true
  }
  const sortedRegion = [...region].sort((a, b) => a - b)
  const invalidRegions = [
    [0, 1, 3, 4],
    [1, 2, 4, 5],
    [3, 4, 6, 7],
    [4, 5, 7, 8]
  ]
  return invalidRegions.some(region => arraysEqual(sortedRegion, region))
}

function generateContiguousRegions (gen) {
  // Choose 3 or 4 length regions.
  const sizeA = gen() < 0.5 ? 3 : 4
  // B can't be 4 if A is 4
  const sizeB = sizeA === 4 || gen() < 0.5 ? 3 : 4
  const allCells = [...Array(9).keys()]

  let attempts = 0
  while (attempts++ < 1000) {
    const startA = allCells[Math.floor(gen() * allCells.length)]
    const regionA = growRegion(gen, startA, sizeA, new Set())
    if (!regionA) continue

    const used = new Set(regionA)
    const remaining = allCells.filter(i => !used.has(i))
    const startB = remaining[Math.floor(gen() * remaining.length)]
    const regionB = growRegion(gen, startB, sizeB, used)
    if (!regionB) continue

    // Work out the unused indicies
    const setC = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8])
    const removeFromC = index => setC.delete(index)
    regionA.forEach(removeFromC)
    regionB.forEach(removeFromC)
    const regionC = Array.from(setC)
    if (invalidRegion(regionA) || invalidRegion(regionB) || invalidRegion(regionC)) {
      continue
    }
    return { regionA, regionB, regionC }
  }

  throw new Error('Failed to generate valid regions after many attempts.')
}

const generateSukoSVG = function (gen) {
  const puzzleRand = generate(gen)
  const puzzleAsSVG = generateSVG(puzzleRand)
  return puzzleAsSVG
}

const generateSukoSolutionSVG = function (grid) {
  const svg = `<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="60" height="60" stroke="black" fill="none" stroke-width="2"/>
  <g font-size="10" text-anchor="middle">
    <!-- Row 0 -->
    <text x="10"  y="10">${grid[0]}</text>
    <text x="30" y="10">${grid[1]}</text>
    <text x="50" y="10">${grid[2]}</text>

    <!-- Row 1 -->
    <text x="10"  y="30">${grid[3]}</text>
    <text x="30" y="30">${grid[4]}</text>
    <text x="50" y="30">${grid[5]}</text>

    <!-- Row 2 -->
    <text x="10" y="50">${grid[6]}</text>
    <text x="30" y="50">${grid[7]}</text>
    <text x="50" y="50">${grid[8]}</text>
  </g>
  `
  return svg
}

const generateA4HTML = function (gen) {
  const svgs = []
  const solutions = []
  // you can lay out 12 200x250 svgs on an A4 page
  for (let i = 0; i < 21; ++i) {
    const puzzleRand = generate(gen)
    const puzzleAsSVG = generateSVG(puzzleRand)
    svgs.push(puzzleAsSVG)
    const solution = generateSukoSolutionSVG(puzzleRand.grid)
    solutions.push(solution)
  }
  const style = `body {
      margin: 0;
      padding: 0;
      background: #eee;
    }

    .a4-page {
      width: 794px;   /* A4 width at 96dpi */
      height: 1123px; /* A4 height at 96dpi */
      margin: 20px auto;
      background: white;
      box-sizing: border-box;
      page-break-after: always;
      display: flex;
      flex-direction: column;
      padding: 20px;
      
    }

    .grid-large-3x4, .grid-large-3x3 {
      display: grid;
      grid-template-columns: repeat(3, 200px);
      column-gap: 48.5px;
      row-gap: 30.75x;
    }

    .grid-large-3x4 {
      grid-template-rows: repeat(4, 250px);
    }

    .grid-large-3x3 {
      grid-template-rows: repeat(3, 250px);
    }

    .grid-small {
      display: grid;
      grid-template-columns: repeat(7, 60px);
      grid-auto-rows: 60px;
      column-gap: 44px;
      row-gap: 30px;
      margin-top: 40px;
    }

    .svg-large, .svg-small {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    @media print {
      body {
        background: none;
      }

      .a4-page {
        margin: 0;
        page-break-after: always;
      }
    }`
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SVG Grid Pages</title>
  <style>
    ${style}
  </style>
</head>
<body>
  <div id="container">

    <!-- Page 1: First 12 large SVGs -->
    <div class="a4-page">
      <div class="grid-large-3x4">
        ${svgs.slice(0, 12).map(svg => `<div class="svg-large">${svg}</div>`).join('\n')}
      </div>
    </div>

    <!-- Page 2: Next 9 large SVGs and 21 small ones -->
    <div class="a4-page">
      <div class="grid-large-3x3">
        ${svgs.slice(12).map(svg => `<div class="svg-large">${svg}</div>`).join('\n')}
      </div>

      <div class="grid-small">
        ${solutions.map(svg => `<div class="svg-small">${svg}</div>`).join('\n')}
      </div>
    </div>

  </div>
</body>
</html>
  `
}

if (require.main === module) {
  const html = generateA4HTML(Math.random)
  console.log(html)
}

module.exports.Area = Area
module.exports.Suko = Suko
module.exports.generateSukoSVG = generateSukoSVG
module.exports.invalidRegion = invalidRegion
