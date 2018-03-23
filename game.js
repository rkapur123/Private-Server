const Web3 = require('web3')
const TruffleContract = require('truffle-contract')
const WarFactory = require('./contracts/WarFactory.json')
const CoinWars = require('./contracts/CoinWar.json')

const War = require('./models/wars')

const self = module.exports = {
  web3: undefined,
  address: '0x0',
  warfactory: undefined,
  coinwars: undefined,

  init: function() {
    return async function(req, res, next) {
      let web3_provider
      if (typeof web3 !== 'undefined') {
        web3_provider = web3.currentProvider;
      } else {
        // set the provider you want from Web3.providers
        web3_provider = new Web3.providers.HttpProvider("http://localhost:8545")
      }
      self.web3 = new Web3(web3_provider)

      self.address = self.web3.eth.coinbase
      self.coinwars = TruffleContract(CoinWars)
      self.coinwars.setProvider(web3_provider)

      self.warfactory = TruffleContract(WarFactory)
      self.warfactory.setProvider(web3_provider)
      console.log(self.warfactory.web3.eth)

      next()
    }
  }

}
