const express = require('express')
const wijuko = require('./wijuko')

const APP = express()
const PORT = 3000

APP.get('/', (req, res) => {
  const puzzle = wijuko.generate(Math.random)
  const svg = wijuko.generateSVG(puzzle)
  res.set('Content-Type', 'image/svg+xml')
  res.send(svg)
})

APP.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
