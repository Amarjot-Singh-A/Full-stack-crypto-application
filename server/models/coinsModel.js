const { formatSqlQuery, executeQuery } = require("../config/db");
const logger = require("../services/logger");

/**
 * Create a record in coins table
 * @param {Object} param0 - Object with values => { name, description, oldPrice, currentPrice }
 * @returns {Object} - Object with result and error as keys
 */
const create = async ({ name, description, oldPrice, currentPrice }) => {
  try {
    const sql = "INSERT INTO ?? (??,??,??,??,??,??) values (?,?,?,?,?,?)";
    const timestamp = Math.floor(Date.now() / 1000);
    const inserts = [
      "coins",
      "name",
      "description",
      "oldPrice",
      "currentPrice",
      "timestamp",
      "updatedTimestamp",
      name,
      description,
      oldPrice,
      currentPrice,
      timestamp,
      timestamp,
    ];
    const formattedQuery = formatSqlQuery(sql, inserts);
    const result = await executeQuery(formattedQuery);

    return {
      result,
      error: null,
    };
  } catch (error) {
    logger.error("Error inserting coin - data model", error.message);
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
    const sql = "SELECT * FROM ?? WHERE ?? = ?";
    const inserts = ["coins", "id", id];
    const formattedQuery = formatSqlQuery(sql, inserts);
    const result = await executeQuery(formattedQuery);

    return {
      result,
      error: null,
    };
  } catch (error) {
    logger.error("Error fetching single coin - data model", error.message);
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
    const sql = "SELECT * FROM ??";
    const inserts = ["coins"];
    const formattedQuery = formatSqlQuery(sql, inserts);
    const result = await executeQuery(formattedQuery);

    return {
      result,
      error: null,
    };
  } catch (error) {
    logger.error("Error fetching all coins - data model", error.message);
    return {
      result: [],
      error,
    };
  }
};

module.exports = {
  create,
  get,
  getAll,
};
