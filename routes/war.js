const War = require('../models/wars')
const Coin = require('../models/coins')

module.exports = function(router, game) {

  // get list of wars
  router.get('/wars', async function(req, res, next) {
    const coins = await Coin.find({}).sort('-created_at')
    const wars = await War.find({})
      .sort('-created_at')
      .populate('coin_one')
      .populate('coin_two')

    res.render('war', { wars, coins, error: req.session.error })
    req.session.error = null
  })

  const warExists = async function(coin1, coin2) {
    const war = await War.findOne({ coin_one: coin1, coin_two: coin2 })
    if (war) {
      return true
    }
    return false
  }

  // create a new war
  router.post('/wars/add', async function(req, res, next) {
    const { coin_one, coin_two } = req.body

    // check if coins are equal
    if (coin_one === coin_two) {
      req.session.error = 'Please choose different coins'
      return res.redirect('/wars')
    }

    let warAlreadyExists = await warExists(coin_one, coin_two)
    if (warAlreadyExists) {
      req.session.error = 'War between these coins already exists ! Please choose different coins'
      return res.redirect('/wars')
    }

    warAlreadyExists = await warExists(coin_two, coin_one)
    if (warAlreadyExists) {
      req.session.error = 'War between these coins already exists ! Please choose different coins'
      return res.redirect('/wars')
    }

    const war = new War({
      coin_one,
      coin_two
    })

    war.save(async function(err) {
      res.redirect('/wars')
    })
  })

  // delete war
  router.get('/wars/delete/:id', function(req, res, next) {
    War.remove({ _id: req.params.id, isOnGoing: false }, function(err) {
      res.redirect('/wars')
    })
  })

  // start war
  router.post('/wars/edit', async function(req, res, next) {
    const {
      id,
      gas,
      coin1_symbol,
      coin2_symbol,
      coin1_address,
      coin2_address,
      from_block,
      to_block } = req.body

    var _update = {
      from_block,
      to_block,
      isOnGoing: true
    }

    try {
      // create coinwar instance
      const coinWarInstance = await game.coinwars.deployed(
        coin1_address,
        coin2_address,
        from_block,
        to_block
      )

      // create war factory instance
      const warFactoryInstance = await game.warfactory.deployed()

      // add coin war to factory
      const cW = await warFactoryInstance.createCoinWar(
          `${coin1_symbol} ${coin2_symbol}`,
          coinWarInstance.address,
          id, { from: `${game.address}`, gas: `${gas}` })

      // listen to start war event
      warFactoryInstance.NewWarStarted()
        .watch(async function(error, result) {
          console.log('Event Triggered',result.args.warID)
          await War.findByIdAndUpdate(id, _update)
          res.redirect('/wars')
        })

      } catch(e) {
        console.log(e)
        req.session.error = `Unable to start war ! ${e.message}`
        res.redirect('/wars')
      }
  })

  router.get('/wars/deleteall', async function(req, res) {
    await War.remove({})
    res.redirect('/wars')
  })

}
