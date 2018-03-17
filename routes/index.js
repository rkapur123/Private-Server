const Coin = require('../models/coins')

module.exports = function(router) {
  router.get('/', function(req, res, next) {
    Coin.find({})
      .sort('-created_at')
      .exec(function(err, coins) {
        if (err) return next(err)
        res.render('index', { coins })
      })
  })

  router.post('/coins/add', function(req, res, next) {
    const coin = new Coin({
      coin_name: req.body.coin_name,
      coin_symbol: req.body.coin_symbol.toUpperCase(),
      coin_address: req.body.coin_address
    })

    coin.save(function(err) {
      if (err) {
        res.redirect('/')
      } else {
        res.redirect('/')
      }
    })
  })

  router.get('/coins/delete/:id', function(req, res, next) {
    Coin.remove({ _id: req.params.id }, function(err) {
      res.redirect('/')
    })
  })

}
