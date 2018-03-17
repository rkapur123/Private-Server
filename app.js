const express = require('express')
const PORT = process.env.PORT || 3000

const app = express()

app.get('/', function(req, res) {
  res.send('hello app')
})

app.listen(PORT, () => console.log(`CoinWar server start on port ${PORT}`))
