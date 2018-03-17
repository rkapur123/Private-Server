const mongoose = require('mongoose')

const coinSchema = mongoose.Schema({
  coin_name: {
    type: String,
    required: true
  },
  coin_symbol: {
    type: String,
    required: true
  },
  coin_address: {
    type: String,
    required: true
  },
  created_at: {
		type: Date,
		default: Date.now
	},
})

module.exports = mongoose.model('Coin', coinSchema)
