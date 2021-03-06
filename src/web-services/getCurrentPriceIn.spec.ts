// tslint:disable

import * as assert from 'assert'

import getCurrentPriceIn from './getCurrentPriceIn'

describe('webServices#getCurrentPriceIn()', async function() {
  let usdPrice

  it(`SHOULD return a number with no parameter (= USD)`, function(done) {
    getCurrentPriceIn().then(price => {
      usdPrice = price
      assert.strictEqual(typeof usdPrice === 'number' && !isNaN(usdPrice), true)
      done()
    })
  })

  it(`SHOULD return a different number with "JPY" parameter`, function(done) {
    getCurrentPriceIn('JPY').then(eurPrice => {
      assert.strictEqual(typeof eurPrice === 'number' && !isNaN(eurPrice), true)
      assert.notStrictEqual(eurPrice, usdPrice)
      done()
    })
  })
})
