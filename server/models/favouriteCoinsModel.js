const { formatSqlQuery, executeQuery } = require("../config/db");
const logger = require("../services/logger");

/**
 * Get user favourite coins from Db
 * @param {String} userId
 * @returns {{ result: Array<any>, error: Error|null }}
 */
const get = async (userId) => {
  try {
    const sql = "SELECT ??,?? FROM ?? WHERE ?? = ?";
    const inserts = ["coinId", "name", "favouriteCoins", "userId", userId];
    const formattedQuery = formatSqlQuery(sql, inserts);
    const result = await executeQuery(formattedQuery);

    return {
      result,
      error: null,
    };
  } catch (error) {
    // Use a logging library or mask sensitive data in production
    logger.error("Error fetching favourite coins - data model", error.message);
    return {
      result: [],
      error,
    };
  }
};

/**
 * Update the user favourite coins in Db
 * @param {Object}  params - { coinId, name, userId }
 * @returns {{ result: any, error: Error|null }}
 */
const create = async ({ coinId, name, userId }) => {
  try {
    const sql = "INSERT INTO ?? (??,??,??,??) values (?,?,?,?)";
    const inserts = [
      "favouriteCoins",
      "coinId",
      "name",
      "userId",
      "timestamp",
      coinId,
      name,
      userId,
      Math.floor(Date.now() / 1000),
    ];
    const formattedQuery = formatSqlQuery(sql, inserts);
    const result = await executeQuery(formattedQuery);

    return {
      result,
      error: null,
    };
  } catch (error) {
    logger.error("Error inserting favourite coins - data model", error.message);
    return {
      result: [],
      error,
    };
  }
};

module.exports = {
  get,
  create,
};
