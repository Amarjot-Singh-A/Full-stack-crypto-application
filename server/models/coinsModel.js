const { formatSqlQuery, executeQuery } = require('../config/db');
const logger = require('../utils/logger');
const { getTimestampInZone } = require('../utils/dateUtils');

/**
 * Create a record in coins table
 * @param {Object} param0 - Object with values => { name, description, oldPrice, currentPrice }
 * @returns {Object} - Object with result and error as keys
 */
const create = async ({ name, description, oldPrice, currentPrice }) => {
  try {
    const sql = 'INSERT INTO ?? (??,??,??,??,??,??) values (?,?,?,?,?,?)';
    const inserts = [
      'coins',
      'name',
      'description',
      'oldPrice',
      'currentPrice',
      'timestamp',
      'updatedTimestamp',
      name,
      description,
      oldPrice,
      currentPrice,
      getTimestampInZone(),
      getTimestampInZone(),
    ];
    const formattedQuery = formatSqlQuery(sql, inserts);
    const result = await executeQuery(formattedQuery);

    return {
      result,
      error: null,
    };
  } catch (error) {
    logger.error('Error inserting coin - data model', error.message);
    return {
      result: [],
      error,
    };
  }
};

/**
 * Fetch single coin from coins table
 * @param {number} id
 * @returns {Object} - fetched coin record
 */
const get = async (id) => {
  try {
    const sql = 'SELECT * FROM ?? WHERE ?? = ?';
    const inserts = ['coins', 'id', id];
    const formattedQuery = formatSqlQuery(sql, inserts);
    const result = await executeQuery(formattedQuery);

    return {
      result,
      error: null,
    };
  } catch (error) {
    logger.error('Error fetching single coin - data model', error.message);
    return {
      result: [],
      error,
    };
  }
};

/**
 * Fetch all coins from coins table
 * @returns {{ result: Array, error: Error|null }} - fetched coins
 */
const getAll = async () => {
  try {
    const sql = 'SELECT * FROM ??';
    const inserts = ['coins'];
    const formattedQuery = formatSqlQuery(sql, inserts);
    const result = await executeQuery(formattedQuery);

    return {
      result,
      error: null,
    };
  } catch (error) {
    logger.error('Error fetching all coins - data model', error.message);
    return {
      result: [],
      error,
    };
  }
};

/**
 * Update a coin record in coins table
 * @param {number} id - ID of the coin to update
 * @param {string} name - New name of the coin
 * @param {string} description - New description of the coin
 * @param {number} oldPrice - Old price of the coin
 * @param {number} currentPrice - Current price of the coin
 * @returns {Object} - Object with result and error as keys
 */
const update = async (id, name, description, oldPrice, currentPrice) => {
  try {
    const sql =
      'UPDATE ?? SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?';
    const inserts = [
      'coins',
      'name',
      name,
      'description',
      description,
      'oldPrice',
      oldPrice,
      'currentPrice',
      currentPrice,
      'updatedTimestamp',
      getTimestampInZone(),
      'id',
      id,
    ];
    const formattedQuery = formatSqlQuery(sql, inserts);
    const result = await executeQuery(formattedQuery);

    return {
      result,
      error: null,
    };
  } catch (error) {
    logger.error('Error updating coin - data model', error.message);
    return {
      result: [],
      error,
    };
  }
};

/**
 * Get a coin by its name
 * @param {*} name
 * @returns {Object} - Object with result and error as keys
 */
const getByName = async (name) => {
  try {
    const sql = 'SELECT * FROM ?? WHERE ?? = ?';
    const inserts = ['coins', 'name', name];
    const formattedQuery = formatSqlQuery(sql, inserts);
    const result = await executeQuery(formattedQuery);
    return { result, error: null };
  } catch (error) {
    logger.error('Error fetching coin by name - data model', error.message);
    return { result: [], error };
  }
};

module.exports = {
  create,
  get,
  getAll,
  update,
  getByName,
};
