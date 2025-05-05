const express = require('express')
const wijuko = require('./wijuko')

const APP = express()
const PORT = 3000

APP.get('/', (req, res) => {
  const puzzle = wijuko.generate(Math.random)
  const svg = wijuko.generateSVG(puzzle)
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Wijuko</title>
    <style>
      body {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        padding-top: 20px;
      }
    </style>
  </head>
  <body>
    ${svg}
  </body>
  </html>
`;

res.send(html);
})

APP.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
