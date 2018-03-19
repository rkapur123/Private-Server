const User = require('../models/users')

module.exports = function(router, passport, game) {
  router.post('/users/add', function(req, res) {
    const newUser = new User({
      username: 'admin',
      password: 'India@123',
      account: '0x627306090abaB3A6e1400e9345bC60c78a8BEf57'
    })

    newUser.save(function(err) {
      res.json({ message: 'New user has been created' })
    })
  })
}
