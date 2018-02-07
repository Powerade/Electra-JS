// tslint:disable

import * as assert from 'assert'
import * as bip39 from 'bip39'
import * as dotenv from 'dotenv'

import Wallet from '.'
import assertCatch from '../helpers/assertCatch'
import Electra from '../libs/electra/index'

// Loads ".env" variables into process.env properties
dotenv.config()

const {
  CUSTOM_ADDRESS_HASH_TEST,
  CUSTOM_ADDRESS_PRIVATE_KEY_TEST,
  HD_CHAIN_1_HASH_TEST,
  HD_CHAIN_1_PRIVATE_KEY_TEST,
  HD_CHAIN_2_HASH_TEST,
  HD_CHAIN_2_PRIVATE_KEY_TEST,
  HD_MASTER_NODE_HASH_TEST,
  HD_MASTER_NODE_PRIVATE_KEY_TEST,
  HD_MNEMONIC_EXTENSION_TEST,
  HD_MNEMONIC_TEST,
  HD_PASSPHRASE_TEST,
} = process.env

// This HD wallet i seeded by the same wallet mnemonic than the one above, but without the mnemonic extension.
// As a result, the generated private keys are different and listed here.
export const HD_WALLET_WITHOUT_MNEMONIC_EXTENSION_TEST = {
  chains: [
    { hash: 'EdrLwe4T2zuyi42YZdFN68ozgbPovJbYdb', privateKey: 'QtMi7u7cjxQoBn4fQdNKWudNtEQUvNW6NL8e1oEUVwg4m1k1THJ3' },
    { hash: 'EJvQUTKdi8K5brkAMuCpK1cZYJxtRH9dY5', privateKey: 'QsFf6FQP7rzUpTBzovmaveu6umekDTs9GB2X4JycE9Jg6fxYroXc' }
  ],
  masterNode: {
    hash: 'EHtiQTEnQnbF4w6qwFV2vZ5rCKdcvSTbK4',
    privateKey: 'QqwHWeqEQx1yxTM4NHmhB16GxZ8HKDQhV5h9KMqHgZjBJD1wxNBq'
  },
}

if (([
  CUSTOM_ADDRESS_HASH_TEST,
  CUSTOM_ADDRESS_PRIVATE_KEY_TEST,
  HD_CHAIN_1_HASH_TEST,
  HD_CHAIN_1_PRIVATE_KEY_TEST,
  HD_CHAIN_2_HASH_TEST,
  HD_CHAIN_2_PRIVATE_KEY_TEST,
  HD_MASTER_NODE_HASH_TEST,
  HD_MASTER_NODE_PRIVATE_KEY_TEST,
  HD_MNEMONIC_EXTENSION_TEST,
  HD_MNEMONIC_TEST,
  HD_PASSPHRASE_TEST,
] as any).includes(undefined)) {
  console.error('Error: You forgot to fill value(s) in your ".env" test wallet data. Please check ".env.sample".')
  process.exit()
}

describe.only('Wallet', function() {
  let wallet: Wallet

  // TODO We need a more efficient lock() and unlock() strategy
  this.timeout(30000)

  describe(`WHEN instantiating a new wallet`, () => {
    it(`new Wallet() SHOULD NOT throw any error`, () => { assert.doesNotThrow(() => wallet = new Wallet()) })
  })

  describe(`AFTER instantiating this new wallet`, () => {
    it(`#state SHOULD be "EMPTY"`, () => { assert.strictEqual(wallet.state, 'EMPTY') })

    it(`#addresses SHOULD throw an error`, () => { assert.throws(() => wallet.addresses) })
    it(`#allAddresses SHOULD throw an error`, () => { assert.throws(() => wallet.allAddresses) })
    it(`#customAddresses SHOULD throw an error`, () => { assert.throws(() => wallet.customAddresses) })
    it(`#isHD SHOULD throw an error`, () => { assert.throws(() => wallet.isHD) })
    it(`#isLocked SHOULD throw an error`, () => { assert.throws(() => wallet.isLocked) })
    it(`#mnemonic SHOULD throw an error`, () => { assert.throws(() => wallet.mnemonic) })
    it(`#transactions SHOULD throw an error`, () => { assert.throws(() => wallet.transactions) })

    it(`#export() SHOULD throw an error`, () => { assert.throws(() => wallet.export()) })
    it(`#getBalance() SHOULD throw an error`, async () => {
      assert.strictEqual(await assertCatch(() => wallet.getBalance()), true)
    })
    it(`#lock() SHOULD throw an error`, () => { assert.throws(() => wallet.lock(HD_PASSPHRASE_TEST)) })
    it(`#reset() SHOULD throw an error`, () => { assert.throws(() => wallet.reset()) })
    it(`#unlock() SHOULD throw an error`, () => { assert.throws(() => wallet.unlock(HD_PASSPHRASE_TEST)) })
  })

  describe(`WHEN generating the same wallet (W1) WITHOUT <mnemonic>, <mnemonicExtension>, <chainsCount>`, () => {
    it(`#generate() SHOULD NOT throw any error`, () => {
      assert.doesNotThrow(() => wallet.generate(HD_PASSPHRASE_TEST))
    })
  })

  describe(`AFTER generating the same wallet (W1)`, () => {
    it(`#state SHOULD be "READY"`, () => { assert.strictEqual(wallet.state, 'READY') })

    it(`#addresses SHOULD be an array`, () => { assert.strictEqual(Array.isArray(wallet.addresses), true) })
    it(`#addresses SHOULD contain 1 address`, () => { assert.strictEqual(wallet.addresses.length, 1) })
    it(`#addresses first address SHOULD be resolvable`, () => {
      assert.strictEqual(wallet.addresses[0].hash, Electra.getAddressHashFromPrivateKey(wallet.addresses[0].privateKey))
    })

    it(`#mnemonic SHOULD be a string`, () => { assert.strictEqual(typeof wallet.mnemonic, 'string') })
    it(`#mnemonic SHOULD be a non-empty string`, () => { assert.strictEqual(wallet.mnemonic.length > 0, true) })
    it(`#mnemonic SHOULD be a 12-words string`, () => { assert.strictEqual(wallet.mnemonic.split(' ').length, 12) })
    it(`#mnemonic SHOULD be a lowercase string`, () => { assert.strictEqual(wallet.mnemonic, wallet.mnemonic.toLocaleLowerCase()) })
    it(`#mnemonic SHOULD be a valid BIP39 mnemonic`, () => { assert.strictEqual(bip39.validateMnemonic(wallet.mnemonic), true) })

    it(`#getBalance() SHOULD return a number`, async () => { assert.strictEqual(typeof await wallet.getBalance(), 'number') })

    it(`#isLocked SHOULD be FALSE`, () => { assert.strictEqual(wallet.isLocked, false) })
    it.skip(`#lock() SHOULD NOT throw any error`, () => { assert.doesNotThrow(() => wallet.lock(HD_PASSPHRASE_TEST)) })
    it.skip(`#isLocked SHOULD be TRUE`, () => { assert.strictEqual(wallet.isLocked, true) })
    it.skip(`#unlock() SHOULD not throw any error`, () => { assert.doesNotThrow(() => wallet.unlock(HD_PASSPHRASE_TEST)) })
    it.skip(`#isLocked SHOULD be FALSE`, () => { assert.strictEqual(wallet.isLocked, false) })

    it(`#generate() SHOULD throw an error`, () => { assert.throws(() => wallet.generate(HD_PASSPHRASE_TEST)) })
  })

  describe(`WHEN resetting the same wallet (W1)`, () => {
    it(`#reset() SHOULD NOT throw any error`, () => { assert.doesNotThrow(() => wallet.reset()) })
  })

  describe(`AFTER resetting the same wallet (W1)`, () => {
    it(`#state SHOULD be "EMPTY"`, () => { assert.strictEqual(wallet.state, 'EMPTY') })

    it(`#addresses SHOULD throw an error`, () => { assert.throws(() => wallet.addresses) })
    it(`#allAddresses SHOULD throw an error`, () => { assert.throws(() => wallet.allAddresses) })
    it(`#customAddresses SHOULD throw an error`, () => { assert.throws(() => wallet.customAddresses) })
    it(`#isHD SHOULD throw an error`, () => { assert.throws(() => wallet.isHD) })
    it(`#isLocked SHOULD throw an error`, () => { assert.throws(() => wallet.isLocked) })
    it(`#mnemonic SHOULD throw an error`, () => { assert.throws(() => wallet.mnemonic) })
    it(`#transactions SHOULD throw an error`, () => { assert.throws(() => wallet.transactions) })

    it(`#export() SHOULD throw an error`, () => { assert.throws(() => wallet.export()) })
    it(`#lock() SHOULD throw an error`, () => { assert.throws(() => wallet.lock(HD_PASSPHRASE_TEST)) })
    it(`#reset() SHOULD throw an error`, () => { assert.throws(() => wallet.reset()) })
    it(`#unlock() SHOULD throw an error`, () => { assert.throws(() => wallet.unlock(HD_PASSPHRASE_TEST)) })
  })

  describe(`WHEN generating the same wallet (W2) WITH <mnemonic> WITHOUT <mnemonicExtension>, <chainsCount>`, () => {
    it(`#generate() SHOULD throw an error WITH an invalid mnemonic`, () => {
      assert.throws(() => wallet.generate(HD_PASSPHRASE_TEST, HD_MNEMONIC_TEST.substr(1)))
    })
    it(`#generate() SHOULD NOT throw any error WITH a valid mnemonic`, () => {
      assert.doesNotThrow(() => wallet.generate(HD_PASSPHRASE_TEST, HD_MNEMONIC_TEST))
    })
  })

  describe(`AFTER generating the same wallet (W2)`, () => {
    it(`#state SHOULD be "READY"`, () => { assert.strictEqual(wallet.state, 'READY') })

    it(`#addresses SHOULD be an array`, () => { assert.strictEqual(Array.isArray(wallet.addresses), true) })
    it(`#addresses SHOULD contain 1 address`, () => { assert.strictEqual(wallet.addresses.length, 1) })
    it(`#addresses first address SHOULD be resolvable`, () => {
      assert.strictEqual(wallet.addresses[0].hash, Electra.getAddressHashFromPrivateKey(wallet.addresses[0].privateKey))
    })
    it(`#addresses first address private key SHOULD be the expected one`, () => {
      assert.strictEqual(wallet.addresses[0].privateKey, HD_WALLET_WITHOUT_MNEMONIC_EXTENSION_TEST.chains[0].privateKey)
    })
    it(`#addresses first address hash SHOULD be the expected one`, () => {
      assert.strictEqual(wallet.addresses[0].hash, HD_WALLET_WITHOUT_MNEMONIC_EXTENSION_TEST.chains[0].hash)
    })

    it(`#mnemonic SHOULD throw an error`, () => { assert.throws(() => wallet.mnemonic) })

    it(`#isLocked SHOULD be FALSE`, () => { assert.strictEqual(wallet.isLocked, false) })
    it.skip(`#lock() SHOULD NOT throw any error`, () => { assert.doesNotThrow(() => wallet.lock(HD_PASSPHRASE_TEST)) })
    it.skip(`#isLocked SHOULD be TRUE`, () => { assert.strictEqual(wallet.isLocked, true) })
    it.skip(`#unlock() SHOULD not throw any error`, () => { assert.doesNotThrow(() => wallet.unlock(HD_PASSPHRASE_TEST)) })
    it.skip(`#isLocked SHOULD be FALSE`, () => { assert.strictEqual(wallet.isLocked, false) })

    it(`#generate() SHOULD throw an error`, () => { assert.throws(() => wallet.generate(HD_PASSPHRASE_TEST)) })
  })

  describe(`WHEN resetting the same wallet (W2)`, () => {
    it(`#reset() SHOULD NOT throw any error`, () => { assert.doesNotThrow(() => wallet.reset()) })
  })

  describe(`AFTER resetting the same wallet (W2)`, () => {
    it(`#state SHOULD be "EMPTY"`, () => { assert.strictEqual(wallet.state, 'EMPTY') })

    it(`#addresses SHOULD throw an error`, () => { assert.throws(() => wallet.addresses) })
    it(`#allAddresses SHOULD throw an error`, () => { assert.throws(() => wallet.allAddresses) })
    it(`#customAddresses SHOULD throw an error`, () => { assert.throws(() => wallet.customAddresses) })
    it(`#isHD SHOULD throw an error`, () => { assert.throws(() => wallet.isHD) })
    it(`#isLocked SHOULD throw an error`, () => { assert.throws(() => wallet.isLocked) })
    it(`#mnemonic SHOULD throw an error`, () => { assert.throws(() => wallet.mnemonic) })
    it(`#transactions SHOULD throw an error`, () => { assert.throws(() => wallet.transactions) })

    it(`#export() SHOULD throw an error`, () => { assert.throws(() => wallet.export()) })
    it(`#lock() SHOULD throw an error`, () => { assert.throws(() => wallet.lock(HD_PASSPHRASE_TEST)) })
    it(`#reset() SHOULD throw an error`, () => { assert.throws(() => wallet.reset()) })
    it(`#unlock() SHOULD throw an error`, () => { assert.throws(() => wallet.unlock(HD_PASSPHRASE_TEST)) })
  })

  describe(`WHEN generating the same wallet (W3) WITH <mnemonic>, <mnemonicExtension> WITHOUT <chainsCount>`, () => {
    it(`#generate() SHOULD throw an error WITH an invalid mnemonic`, () => {
      assert.throws(() => wallet.generate(HD_PASSPHRASE_TEST, HD_MNEMONIC_TEST.substr(1), HD_MNEMONIC_EXTENSION_TEST))
    })
    it(`#generate() SHOULD NOT throw any error WITH a valid mnemonic`, () => {
      assert.doesNotThrow(() => wallet.generate(HD_PASSPHRASE_TEST, HD_MNEMONIC_TEST, HD_MNEMONIC_EXTENSION_TEST))
    })
  })

  describe(`AFTER generating the same wallet (W3)`, () => {
    it(`#state SHOULD be "READY"`, () => { assert.strictEqual(wallet.state, 'READY') })

    it(`#addresses SHOULD be an array`, () => { assert.strictEqual(Array.isArray(wallet.addresses), true) })
    it(`#addresses SHOULD contain 1 address`, () => { assert.strictEqual(wallet.addresses.length, 1) })
    it(`#addresses first address SHOULD be resolvable`, () => {
      assert.strictEqual(wallet.addresses[0].hash, Electra.getAddressHashFromPrivateKey(wallet.addresses[0].privateKey))
    })
    it(`#addresses first address private key SHOULD be the expected one`, () => {
      assert.strictEqual(wallet.addresses[0].privateKey, HD_CHAIN_1_PRIVATE_KEY_TEST)
    })
    it(`#addresses first address hash SHOULD be the expected one`, () => {
      assert.strictEqual(wallet.addresses[0].hash, HD_CHAIN_1_HASH_TEST)
    })

    it(`#mnemonic SHOULD throw an error`, () => { assert.throws(() => wallet.mnemonic) })

    it(`#isLocked SHOULD be FALSE`, () => { assert.strictEqual(wallet.isLocked, false) })
    it.skip(`#lock() SHOULD NOT throw any error`, () => { assert.doesNotThrow(() => wallet.lock(HD_PASSPHRASE_TEST)) })
    it.skip(`#isLocked SHOULD be TRUE`, () => { assert.strictEqual(wallet.isLocked, true) })
    it.skip(`#unlock() SHOULD not throw any error`, () => { assert.doesNotThrow(() => wallet.unlock(HD_PASSPHRASE_TEST)) })
    it.skip(`#isLocked SHOULD be FALSE`, () => { assert.strictEqual(wallet.isLocked, false) })

    it(`#generate() SHOULD throw an error`, () => { assert.throws(() => wallet.generate(HD_PASSPHRASE_TEST)) })
  })

  describe(`WHEN resetting the same wallet (W3)`, () => {
    it(`#reset() SHOULD NOT throw any error`, () => { assert.doesNotThrow(() => wallet.reset()) })
  })

  describe(`AFTER resetting the same wallet (W3)`, () => {
    it(`#state SHOULD be "EMPTY"`, () => { assert.strictEqual(wallet.state, 'EMPTY') })

    it(`#addresses SHOULD throw an error`, () => { assert.throws(() => wallet.addresses) })
    it(`#allAddresses SHOULD throw an error`, () => { assert.throws(() => wallet.allAddresses) })
    it(`#customAddresses SHOULD throw an error`, () => { assert.throws(() => wallet.customAddresses) })
    it(`#isHD SHOULD throw an error`, () => { assert.throws(() => wallet.isHD) })
    it(`#isLocked SHOULD throw an error`, () => { assert.throws(() => wallet.isLocked) })
    it(`#mnemonic SHOULD throw an error`, () => { assert.throws(() => wallet.mnemonic) })
    it(`#transactions SHOULD throw an error`, () => { assert.throws(() => wallet.transactions) })

    it(`#export() SHOULD throw an error`, () => { assert.throws(() => wallet.export()) })
    it(`#lock() SHOULD throw an error`, () => { assert.throws(() => wallet.lock(HD_PASSPHRASE_TEST)) })
    it(`#reset() SHOULD throw an error`, () => { assert.throws(() => wallet.reset()) })
    it(`#unlock() SHOULD throw an error`, () => { assert.throws(() => wallet.unlock(HD_PASSPHRASE_TEST)) })
  })

  describe(`WHEN generating the same wallet (W4) WITH <mnemonic>, <mnemonicExtension>, <chainsCount>`, () => {
    it(`#generate() SHOULD throw an error WITH an invalid mnemonic`, () => {
      assert.throws(() => wallet.generate(HD_PASSPHRASE_TEST, HD_MNEMONIC_TEST.substr(1), HD_MNEMONIC_EXTENSION_TEST, 2))
    })
    it(`#generate() SHOULD NOT throw any error WITH a valid mnemonic`, () => {
      assert.doesNotThrow(() => wallet.generate(HD_PASSPHRASE_TEST, HD_MNEMONIC_TEST, HD_MNEMONIC_EXTENSION_TEST, 2))
    })
  })

  describe(`AFTER generating the same wallet (W4)`, () => {
    it(`#state SHOULD be "READY"`, () => { assert.strictEqual(wallet.state, 'READY') })

    it(`#addresses SHOULD be an array`, () => { assert.strictEqual(Array.isArray(wallet.addresses), true) })
    it(`#addresses SHOULD contain 2 addresses`, () => { assert.strictEqual(wallet.addresses.length, 2) })
    it(`#addresses first address SHOULD be resolvable`, () => {
      assert.strictEqual(wallet.addresses[0].hash, Electra.getAddressHashFromPrivateKey(wallet.addresses[0].privateKey))
    })
    it(`#addresses first address private key SHOULD be the expected one`, () => {
      assert.strictEqual(wallet.addresses[0].privateKey, HD_CHAIN_1_PRIVATE_KEY_TEST)
    })
    it(`#addresses first address hash SHOULD be the expected one`, () => {
      assert.strictEqual(wallet.addresses[0].hash, HD_CHAIN_1_HASH_TEST)
    })
    it(`#addresses second address SHOULD be resolvable`, () => {
      assert.strictEqual(wallet.addresses[1].hash, Electra.getAddressHashFromPrivateKey(wallet.addresses[1].privateKey))
    })
    it(`#addresses second address private key SHOULD be the expected one`, () => {
      assert.strictEqual(wallet.addresses[1].privateKey, HD_CHAIN_2_PRIVATE_KEY_TEST)
    })
    it(`#addresses second address hash SHOULD be the expected one`, () => {
      assert.strictEqual(wallet.addresses[1].hash, HD_CHAIN_2_HASH_TEST)
    })

    it(`#mnemonic SHOULD throw an error`, () => { assert.throws(() => wallet.mnemonic) })

    it(`#isLocked SHOULD be FALSE`, () => { assert.strictEqual(wallet.isLocked, false) })
    it.skip(`#lock() SHOULD NOT throw any error`, () => { assert.doesNotThrow(() => wallet.lock(HD_PASSPHRASE_TEST)) })
    it.skip(`#isLocked SHOULD be TRUE`, () => { assert.strictEqual(wallet.isLocked, true) })
    it.skip(`#unlock() SHOULD not throw any error`, () => { assert.doesNotThrow(() => wallet.unlock(HD_PASSPHRASE_TEST)) })
    it.skip(`#isLocked SHOULD be FALSE`, () => { assert.strictEqual(wallet.isLocked, false) })

    it(`#generate() SHOULD throw an error`, () => { assert.throws(() => wallet.generate(HD_PASSPHRASE_TEST)) })
  })

  describe(`WHEN resetting the same wallet (W4)`, () => {
    it(`#reset() SHOULD NOT throw any error`, () => { assert.doesNotThrow(() => wallet.reset()) })
  })

  describe(`AFTER resetting the same wallet (W4)`, () => {
    it(`#state SHOULD be "EMPTY"`, () => { assert.strictEqual(wallet.state, 'EMPTY') })

    it(`#addresses SHOULD throw an error`, () => { assert.throws(() => wallet.addresses) })
    it(`#allAddresses SHOULD throw an error`, () => { assert.throws(() => wallet.allAddresses) })
    it(`#customAddresses SHOULD throw an error`, () => { assert.throws(() => wallet.customAddresses) })
    it(`#isHD SHOULD throw an error`, () => { assert.throws(() => wallet.isHD) })
    it(`#isLocked SHOULD throw an error`, () => { assert.throws(() => wallet.isLocked) })
    it(`#mnemonic SHOULD throw an error`, () => { assert.throws(() => wallet.mnemonic) })
    it(`#transactions SHOULD throw an error`, () => { assert.throws(() => wallet.transactions) })

    it(`#export() SHOULD throw an error`, () => { assert.throws(() => wallet.export()) })
    it(`#lock() SHOULD throw an error`, () => { assert.throws(() => wallet.lock(HD_PASSPHRASE_TEST)) })
    it(`#reset() SHOULD throw an error`, () => { assert.throws(() => wallet.reset()) })
    it(`#unlock() SHOULD throw an error`, () => { assert.throws(() => wallet.unlock(HD_PASSPHRASE_TEST)) })
  })
})