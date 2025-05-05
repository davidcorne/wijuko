const wijuko = require('./wijuko')

const main = function () {
  const puzzleRand = wijuko.generate(Math.random)
  // // Print the puzzle solved
  // let printGridNumber = true
  // puzzleRand.prettyPrint(console.log, printGridNumber)
  // // Print 20 blank lines
  // for (let i = 0; i < 20; i++) {
  //   console.log('')
  // }
  // // Print the puzzle with the grid numbers hidden
  // printGridNumber = false
  // puzzleRand.prettyPrint(console.log, printGridNumber)
  const puzzleAsSVG = wijuko.generateSVG(puzzleRand)
  console.log(puzzleAsSVG)
}

main()
