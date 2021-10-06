import React from 'react'


/**
 *todo - use snackbar material ui to notify buy bitcoin
 *todo - use tabs to build buy and sell form
 */
export default function Buy() {

let pickCurrency = 'https://api.coingecko.com/api/v3/simple/supported_vs_currencies'


// [
//     "btc",
//     "eth",
//     "ltc"
// ]


let pickCoin = 'https://api.coingecko.com/api/v3/coins/list?include_platform=false'

// [
//     {
//       "id": "01coin",
//       "symbol": "zoc",
//       "name": "01coin"
//     },
//     {
//       "id": "0-5x-long-algorand-token",
//       "symbol": "algohalf",
//       "name": "0.5X Long Algorand Token"
//     },
// ]


let priceOfCoinInCurrency = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=cad'

// {
//     "bitcoin": {
//       "cad": 61013
//     }
//   }

//how much crypto you will be able to buy
// setCrypto(Number.parseFloat((1 / price) * event.target.value).toFixed(7))





/**
 * todo - when user clicks on the buy button,
 * add the 
 */








    
    return (
        <div>
            this is the buy page
        </div>
    )
}
