const { formatSqlQuery, executeQuery } = require("../config/db");
const logger = require("../utils/logger");


/**
 * Create a record in payment method table
 * @param {*} param0 - Object with values => { type, name }
 * @returns {Object} - Object with result and error as keys
 */
const create = async ({ type, name}) => {
  try {
    const sql = "INSERT INTO ?? (??,??) values (?,?)";
    const inserts = [
      "paymentMethod",
      "type",
      "name",
      type,
      name
    ];
    const formattedQuery = formatSqlQuery(sql, inserts);
    const result = await executeQuery(formattedQuery);

    return { result, error: null };
  } catch (error) {
    logger.error("error in creating payment method record", error);
    return { result: null, error };
  }
};

/**
 * Fetch record from payment method table
 * @param {number} id -
 * @returns {Object} - fetched ledger record
 */
const get = async (id) => {
  try {
    const sql = "SELECT ??,??,?? FROM ?? WHERE ?? = ?";
    const inserts = ["id", "type", "name", "paymentMethod", "id", id];
    const formattedQuery = formatSqlQuery(sql, inserts);
    const result = await executeQuery(formattedQuery);
    return { result, error: null };
  } catch (error) {
    logger.error("error fetching payment method record", error);
    return { result: null, error };
  }
};

/**
 * Fetch all records from payment method table
 * @returns {Object} - fetched payment methods
 * @description This function retrieves all payment methods from the database.
 **/
const getAll = async () => {
try {
    const sql = "SELECT * FROM ??";
    const inserts = ["paymentMethod"];
    const formattedQuery = formatSqlQuery(sql, inserts);
    const result = await executeQuery(formattedQuery);
    return { result, error: null };
  } catch (error) {
    logger.error("error fetching all payment methods", error);
    return { result: null, error };
  }
};

module.exports = {
    create,
    get,
    getAll
}