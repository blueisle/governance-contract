/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * truffleframework.com/docs/advanced/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like truffle-hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura API
 * keys are available for free at: infura.io/register
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */
require('babel-register')({
  ignore: /node_modules\/(?!zeppelin-solidity)/,
});
require('babel-polyfill');

const HDWalletProvider = require('truffle-hdwallet-provider');
const config = require('config');
const ropstenConfig = config.get('ropsten');
const metaTestnetConfig = config.get('metadiumTestnet');

module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */

  networks: {
    // Useful for testing. The `development` name is special - truffle uses it by default
    // if it's defined here and no other network is specified at the command line.
    // You should run a client (like ganache-cli, geth or parity) in a separate terminal
    // tab if you use this network and you must also set the `host`, `port` and `network_id`
    // options below to some value.
    //
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*', // Match any network id
      gas: 7984452,
      gasPrice: 2000000000,
    },
    coverage: {
      host: 'localhost',
      network_id: '*',
      port: 8555, // <-- If you change this, also set the port option in .solcover.js.
      gas: 0xfffffffffff, // <-- Use this high gas value
      gasPrice: 0x01, // <-- Use this low gas price
    },
    metadiumTestnet: {
      provider: () => {
        return new HDWalletProvider(metaTestnetConfig.mnemonic, metaTestnetConfig.provider);
      },
      network_id: metaTestnetConfig.network_id,
      gasPrice: metaTestnetConfig.gasPrice,
    },
    ropsten: {
      provider: function () {
        return new HDWalletProvider(ropstenConfig.mnemonic, ropstenConfig.provider);
      },
      network_id: ropstenConfig.network_id,
      gas: ropstenConfig.gas,
      gasPrice: ropstenConfig.gasPrice,
    },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    reporter: 'eth-gas-reporter',
    reporterOptions: {
      currency: 'USD',
      gasPrice: 18
    },
  },

  // Configure your compilers
  compilers: {
    solc: {
      // version: '0.5.1',    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
