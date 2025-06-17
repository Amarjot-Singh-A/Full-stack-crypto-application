const axios = require('axios');
const coinsModel = require('../models/coinsModel');
const logger = require('../utils/logger');

/**
 * Fetch current price of a coin and insert/update in DB
 * @param {string} name - Name of the coin
 * @param {string} description - Description of the coin
 */
async function fetchAndUpsertCoin(name, description) {
  try {
    // Fetch current price from CoinGecko
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price`,
      {
        params: {
          ids: name,
          vs_currencies: 'cad',
        },
      }
    );
    console.log(`Response from CoinGecko for ${name}:`, response.data);

    const currentPrice = response.data[name]?.cad;
    if (typeof currentPrice !== 'number') {
      throw new Error('Invalid price data from API');
    }

    // Try to get existing coin record
    const { result, error } = await coinsModel.getByName(name); 

    if (result && result.length > 0) {
      // Update result record
      const oldPrice = result[0].currentPrice;
      const result  = await coinsModel.update(
        result[0].id,
        name,
        description,
        oldPrice,
        currentPrice
      );
      logger.info(`Updated coin ${name} with new price ${currentPrice}`);
    } else {
      // Insert new record
     await coinsModel.create({
        name,
        description,
        oldPrice: currentPrice,
        currentPrice,
      });
      logger.info(`Inserted new coin ${name} with price ${currentPrice}`);
    }
  } catch (err) {
    logger.error('Error in fetchAndUpsertCoin', err);
    throw err;
  }
}

module.exports = { fetchAndUpsertCoin };