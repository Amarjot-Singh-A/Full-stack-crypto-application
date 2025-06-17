const { formatSqlQuery, executeQuery } = require("../config/db");
const logger = require("../utils/logger");
const { getTimestampInZone } = require("../utils/dateUtils");

/**
 * Fetch a transaction record from the database
 * @param {number} id - The ID of the transaction to fetch
 * @returns {Object} - An object containing the result and error (if any)
 */
const get = async (id) => {
  try {
    const sql = "SELECT * FROM ?? WHERE ?? = ?";
    const inserts = ["transactions", "id", id];
    const formattedQuery = formatSqlQuery(sql, inserts);
    const result = await executeQuery(formattedQuery);

    return { result, error: null };
  } catch (error) {
    logger.error("Error fetching single transaction record", error);
    return { result: null, error };
  }
};

/**
 * Fetch all transaction records from the database
 * @returns {{ result: Array<Object>|null, error: Error|null }} - An object containing an array of transaction objects as `result` and `error` if any
 */
const getAll = async () => {
  try {
    const sql = "SELECT * FROM ??";
    const inserts = ["transactions"];
    const formattedQuery = formatSqlQuery(sql, inserts);
    const result = await executeQuery(formattedQuery);

    return { result, error: null };
  } catch (error) {
    logger.error("Error fetching transaction records", error);
    return { result: null, error };
  }
};

/**
 * Create a new transaction record in the database
 * @param {Object} param0 - An object containing the transaction details
 * @param {number} param0.paymentId - The ID of the payment associated with the transaction
 * @param {number} param0.amount - The amount of the transaction
 * @param {string} param0.notes - Additional notes for the transaction
 * @returns {{ result: Object|null, error: Error|null }} - An object containing the result of the insert operation and error (if any)
 */
const create = async ({
  paymentId,
  amount,
  notes}) => {  
  try {
    const sql = "INSERT INTO ?? (??, ??, ??, ??) VALUES (?, ?, ?, ?)";
    const inserts = [
      "transactions",
      "paymentId",
      "amount",
      "notes",
      "timestamp",
      paymentId,
      amount,
      notes,
      getTimestampInZone(),
    ];
    const formattedQuery = formatSqlQuery(sql, inserts);
    const result = await executeQuery(formattedQuery);

    return { result, error: null };
  } catch (error) {
    logger.error("Error inserting transaction record", error);
    return { result: null, error };
  }
};

module.exports = {
  get,
  getAll,
  create,
};