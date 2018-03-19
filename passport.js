// load all the things we need
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt,
    User = require('./models/users');

// expose this function to our app using module.exports
module.exports = function(config, passport) {

  // JWT STRATEGY
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  opts.secretOrKey = config.secret;

  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    const { sub } = jwt_payload.data
    User.findById(sub)
      .select('username account')
      .exec(function(err, user) {
        if (err) return done(err, false, { message: 'Authentication failed !' });
        if (!user)
            return done(null, false, { message: 'Authentication failed ! User does not exist' });
        else
            return done(null, user);
    })
  }))

}
