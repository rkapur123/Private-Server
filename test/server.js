const express = require('express')
const path = require('path')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const hbs = require('express-handlebars')
const expressSession = require('express-session')

const PORT = process.env.PORT || 3000

const app = express()

// connect to database
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/coinwar')
const db = mongoose.connection

// check connected
db.once('open', function() {
  console.log('Successfully connected to coinwar database')
})

// check error
db.on('error', function() {
  console.log('Error connecting to coinwar database (make sure the port is 27017)')
})

app.use(logger('combined'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

// start test server
app.listen(PORT, function() {
  console.log(`CoinWar private test server start on port ${PORT}`)
})

module.exports = app
