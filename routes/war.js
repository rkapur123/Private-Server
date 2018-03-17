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
      const c1 = await Coin.findOne({ _id: coin_one })
      const c2 = await Coin.findOne({ _id: coin_two })

      game.warfactory.deployed()
        .then(async instance => {
          instance.CreateCoinWar(
            `${c1.coin_symbol} ${c2.coin_symbol}`,
            `${c1.coin_address}`,
            `${c2.coin_address}`,
            0,
            100, { from: `${game.address}` })
          .then(result => {
            console.log(result)
            res.redirect('/wars')
          })
        })

      // const warFactoryInstance = await game.warfactory.deployed()
      // const i = await warFactoryInstance.CreateCoinWar(
      //   `${c1.coin_symbol} ${c2.coin_symbol}`,
      //   c1.coin_address,
      //   c2.coin_address,
      //   0,
      //   0, { from: game.address })
      // console.log(i)
      // res.redirect('/wars')
    })

  })

}
