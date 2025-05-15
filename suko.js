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
      this.grid[4] + this.grid[5] + this.grid[7] + this.grid[8],
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
  const { regionA, regionB, regionC } = generateContiguousRegions(gen);
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

function getNeighbors(index) {
  const neighbors = [];
  const row = Math.floor(index / 3);
  const col = index % 3;

  if (col > 0) neighbors.push(index - 1);     // left
  if (col < 2) neighbors.push(index + 1);     // right
  if (row > 0) neighbors.push(index - 3);     // up
  if (row < 2) neighbors.push(index + 3);     // down

  return neighbors;
}

function growRegion(gen, start, size, excluded) {
  const region = [start];
  const regionSet = new Set([start]);
  const frontier = [start];

  while (region.length < size && frontier.length > 0) {
    const current = frontier.shift();
    const neighbors = getNeighbors(current)
      .filter(n => !regionSet.has(n) && !excluded.has(n));
    
    if (neighbors.length === 0) continue;
    const chosen = neighbors[Math.floor(gen() * neighbors.length)];
    region.push(chosen);
    regionSet.add(chosen);
    frontier.push(chosen);
  }

  return region.length === size ? region : null;
}

function generateContiguousRegions(gen) {
  // Choose 3 or 4 length regions.
  const sizeA = gen() < 0.5 ? 3 : 4
  // B can't be 4 if A is 4
  const sizeB = sizeA === 4 || gen() < 0.5 ? 3 : 4
  const allCells = [...Array(9).keys()];

  let attempts = 0;
  while (attempts++ < 1000) {
    const startA = allCells[Math.floor(gen() * allCells.length)];
    const regionA = growRegion(gen, startA, sizeA, new Set());
    if (!regionA) continue;

    const used = new Set(regionA);
    const remaining = allCells.filter(i => !used.has(i));
    const startB = remaining[Math.floor(gen() * remaining.length)];
    const regionB = growRegion(gen, startB, sizeB, used);
    if (!regionB) continue;

    // Work out the unused indicies
    const setC = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8])
    const removeFromC = index => setC.delete(index)
    regionA.forEach(removeFromC)
    regionB.forEach(removeFromC)
    const regionC = Array.from(setC)
    return { regionA, regionB, regionC };
  }

  throw new Error("Failed to generate valid regions after many attempts.");
}




const main = function (gen) {
  const puzzleRand = generate(gen)
  const puzzleAsSVG = generateSVG(puzzleRand)
  console.log(puzzleAsSVG)

  console.log(puzzleRand.areas)
}

if (require.main === module) {
  main(Math.random)
}

module.exports.Area = Area
module.exports.Suko = Suko
