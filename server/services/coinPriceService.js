const axios = require('axios');
const coinsModel = require('../models/coinsModel');
const logger = require('../utils/logger');

/**
 * Fetch current price(s) of coin(s) and insert/update in DB
 * @param {Array} coins - Array of { name, description }
 */
async function fetchAndUpsertCoins(coins) {
  try {
    const ids = coins.map((c) => c.name).join(',');
    // Fetch current prices from CoinGecko
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price`,
      {
        params: {
          ids,
          vs_currencies: 'cad',
        },
      },
    );
    console.log(`Response from CoinGecko for ${ids}:`, response.data);

    for (const coin of coins) {
      const currentPrice = response.data[coin.name]?.cad;
      if (typeof currentPrice !== 'number') {
        logger.error(`Invalid price data from API for ${coin.name}`);
        continue;
      }

      // Try to get existing coin record
      const { result } = await coinsModel.getByName(coin.name);

      if (result && result.length > 0) {
        // Update result record
        const oldPrice = result[0].currentPrice;
        await coinsModel.update(
          result[0].id,
          coin.name,
          coin.description,
          oldPrice,
          currentPrice,
        );
        logger.info(`Updated coin ${coin.name} with new price ${currentPrice}`);
      } else {
        // Insert new record
        await coinsModel.create({
          name: coin.name,
          description: coin.description,
          oldPrice: currentPrice,
          currentPrice,
        });
        logger.info(
          `Inserted new coin ${coin.name} with price ${currentPrice}`,
        );
      }
    }
  } catch (err) {
    logger.error('Error in fetchAndUpsertCoins', err);
    throw err;
  }
}

module.exports = { fetchAndUpsertCoins };
