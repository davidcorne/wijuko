const wijuko = require('./wijuko')

const main = function () {
  const puzzleRand = wijuko.generate(Math.random)
  const puzzleFixed = wijuko.generateStandard1()
  puzzleRand.prettyPrint(console.log)
  console.log('')
  puzzleFixed.prettyPrint(console.log)
  // puzzle.hints = [16, 10, 15, 15, undefined, undefined, undefined, 10, undefined, undefined, 5, 3]
}

main()
