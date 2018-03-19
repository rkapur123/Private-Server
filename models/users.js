const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')

const userSchema = mongoose.Schema({
  username: {
    type: String
  },
  password: {
    type: String
  },
  account: [{
    type: String
  }],
  created_at: {
		type: Date,
		default: Date.now
	},
})

// save the user hash password
userSchema.pre('save', function(next) {
	var user = this;
	// hash password
	if (this.isModified('password') || this.isNew) {
		bcrypt.genSalt(10, function(err, salt) {
			if (err) return next(err);
			bcrypt.hash(user.password, salt, null, function(err, hash) {
				if (err) return next(err);
				user.password = hash;
				next()
			})
		})
	} else {
		return next()
	}
})

module.exports = mongoose.model('User', userSchema)
