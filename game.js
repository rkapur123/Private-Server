const Web3 = require('web3')
const TruffleContract = require('truffle-contract')
const WarFactory = require('./contracts/WarFactory.json')
const CoinWars = require('./contracts/CoinWar.json')

module.exports = {
  web3: undefined,
  address: '0x0',
  warfactory: undefined,
  coinwars: undefined,

  init: function() {
    let web3_provider
    if (typeof web3 !== 'undefined') {
      web3_provider = web3.currentProvider;
    } else {
      // set the provider you want from Web3.providers
      web3_provider = new Web3.providers.HttpProvider("http://localhost:8545")
    }
    this.web3 = new Web3(web3_provider)

    this.address = this.web3.eth.coinbase
    this.coinwars = TruffleContract(CoinWars)
    this.coinwars.setProvider(web3_provider)
    this.warfactory = TruffleContract(WarFactory)
    this.warfactory.setProvider(web3_provider)
  }
}
