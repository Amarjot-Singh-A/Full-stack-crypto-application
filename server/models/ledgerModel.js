const { formatSqlQuery, executeQuery } = require("../config/db");

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
      Math.floor(Date.now() / 1000)
    ];
    const formattedQuery = formatSqlQuery(sql, inserts);
    const result = await executeQuery(formattedQuery);

    return { result, error: null };
  } catch (error) {
    console.error("error in creating ledger record", err);
    return { result: null, error };
  }
};

/**
 * Fetch record from ledger table
 * @param {int} userId -
 * @returns {Object} - fetched ledger record
 */
const get = async (userId) => {
  try {
    const sql = "SELECT ??,??,?? FROM ?? WHERE ?? = ?";
    const inserts = ["userId", "transactionId", "balance", "ledger", "userId", userId];
    const formattedQuery = formatSqlQuery(sql, inserts);
    const result = await executeQuery(formattedQuery);
    return {result, error: null};
  } catch (error) {
    console.error("error fetching ledger record", error);
    return { result: null, error };
  }
};

module.exports = {
    create,
    get
}