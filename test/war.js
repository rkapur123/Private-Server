const mongoose = require("mongoose")
const War = require('../models/wars')
const Coin = require('../models/coins')

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('./server')
const should = chai.should()

// initialize the game
const game = require('../game')
game.init()

chai.use(chaiHttp)

describe('Delete all wars in the database', () => {
  // Before each test we empty the database
  beforeEach((done) => {
      War.remove({}, (err) => {
         done();
      })
    })
})

describe('Create a new war', () => {
  it('should run CreateCoinWar instance', done => {

    const war = new War({
      coin_one: mongoose.Types.ObjectId('5aad2778c3e50f1a367cca5f'),
      coin_two: mongoose.Types.ObjectId('5aad278ec3e50f1a367cca60')
    })

    chai.request(server)
      .post('/wars/add')
      .send(war)
      .end(async (err, res) => {

        try {
          const coinWarInstance = await game.coinwars.deployed(
            '0x0d1d4e623D10F9FBA5Db95830F7d3839406C6AF2',
            '0x627306090abaB3A6e1400e9345bC60c78a8BEf57',
            0, 0)
          const warFactoryInstance = await game.warfactory.deployed()
          warFactoryInstance.createCoinWar(
            "EOS TRON",
            coinWarInstance.address,
            { from: `${game.address}`, gas: 5000000 }
          ).then(function(result) {
            console.log(result)
            done()
          }).catch(function(error) {
            console.log(error)
            done()
          })
        } catch(e) {
          console.log(e)
          done()
        }

      })

    })
  })
