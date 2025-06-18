const { fetchAndUpsertCoin } = require('./coinPriceService');

setInterval(() => {
  // fetchAndUpsertCoin('bitcoin', 'The original cryptocurrency').catch((err) => {
  //   // Error already logged in service
  // });
}, 30000000);
