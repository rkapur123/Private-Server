const mongoose = require('mongoose')

const warsSchema = mongoose.Schema({
  coin_one: {
    type: mongoose.Schema.Types.ObjectId,
		ref: 'Coin',
    required: true
  },
  coin_two: {
    type: mongoose.Schema.Types.ObjectId,
		ref: 'Coin',
    required: true
  },
  from_block: {
    type: Number,
    default: 0,
    required: true
  },
  to_block: {
    type: Number,
    default: 1,
    required: true
  },
  isOnGoing: {
    type: Boolean,
    default: false
  },
  created_at: {
		type: Date,
		default: Date.now
	},
})

module.exports = mongoose.model('War', warsSchema)
