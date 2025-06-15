const { formatSqlQuery, executeQuery } = require("../config/db");

/**
 * Get user favourite coins from Db
 * @param {String} userId
 * @returns {Object}
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
    console.error("Error fetching favourite coins - data model", error);
    return {
      result: [],
      error,
    };
  }
};

/**
 * Update the user favourite coins in Db
 * @param {Object}  - {coinId, name, userId }
 * @returns {Object}
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
    console.error("Error inserting favourite coins - data model", error);
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
