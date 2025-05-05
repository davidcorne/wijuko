const wijuko = require('./wijuko')

const main = function () {
  const puzzleRand = wijuko.generate(Math.random)
  const puzzleAsSVG = wijuko.generateSVG(puzzleRand)
  console.log(puzzleAsSVG)
}

main()
