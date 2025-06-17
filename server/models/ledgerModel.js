const { formatSqlQuery, executeQuery } = require("../config/db");
const logger = require("../utils/logger");
const { getTimestampInZone } = require("../utils/dateUtils");

/**
 * Create a record in ledger table
 * @param {*} param0 - Object with values => { userId, transactionId, balance }
 * @returns {Object} - Object with result and error as keys
 */
const create = async ({ userId, transactionId, balance }) => {
  try {
    const sql = "INSERT INTO ?? (??,??,??,??) values (?,?,?,?)";
    const inserts = [
      "ledger",
      "userId",
      "transactionId",
      "balance",
      "timestamp",
      userId,
      transactionId,
      balance,
      getTimestampInZone(),
    ];
    const formattedQuery = formatSqlQuery(sql, inserts);
    const result = await executeQuery(formattedQuery);

    return { result, error: null };
  } catch (error) {
    logger.error("error in creating ledger record", error);
    return { result: null, error };
  }
};

/**
 * Fetch record from ledger table
 * @param {number} userId -
 * @returns {Object} - fetched ledger record
 */
const get = async (userId) => {
  try {
    const sql = "SELECT ??,??,?? FROM ?? WHERE ?? = ?";
    const inserts = ["userId", "transactionId", "balance", "ledger", "userId", userId];
    const formattedQuery = formatSqlQuery(sql, inserts);
    const result = await executeQuery(formattedQuery);
    return { result, error: null };
  } catch (error) {
    logger.error("error fetching ledger record", error);
    return { result: null, error };
  }
};

/**
 * Delete a record from ledger table
 * @param {number} id - ID of the ledger record to be deleted
 * @returns {Object} - Object with result and error as keys 
 */
const remove = async (id) => {
  try {
    const sql = "DELETE FROM ?? WHERE ?? = ?";
    const inserts = ["ledger", "id", id];
    const formattedQuery = formatSqlQuery(sql, inserts);
    const result = await executeQuery(formattedQuery);  
    return { result, error: null };
  } catch (error) {
    logger.error("error deleting ledger record", error);
    return { result: null, error };
  }
};

module.exports = {
    create,
    get,
    remove
}