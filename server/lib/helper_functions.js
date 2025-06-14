/****************************************************************************************
 * This file contains the important functions to implement the back-end API functionality
 ****************************************************************************************/

const mysql = require("mysql2");

// todo - write test for API using jest
// https://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/



// todo - fix this
/**
 * Get the user balance from Db
 * @param {mysql.Connection} connection - Connection object for Db
 * @param {String} email - Email entered by user
 * @returns {Object} - An object with balance and error as keys
 */
const getUserBalance = async (connection, email) => {
  try {
    let sql = "SELECT ?? FROM ?? WHERE ?? = ?";
    let inserts = ["balance", "balance", "email", email];
    let formattedQuery = formatSqlQuery(sql, inserts);
    let resultOfGetUserBalance = await executeQuery(connection, formattedQuery);
    return { balance: resultOfGetUserBalance, error: null };
  } catch (e) {
    console.error("error inside getuserbalance", e);
    return { balance: null, error: e };
  }
};

// todo - fix this
/**
 * Check whether the balance is enough to perform transaction
 * @param {Number} balance - Current balance of user
 * @param {Number} amountToInvest - Amount to be invested in coins
 * @returns {Object} - An object with moneyLeft and eligible as keys
 */
const enoughBalance = async (balance, amountToInvest) => {
  if (balance >= amountToInvest) {
    console.log("balance >");
    return { moneyLeft: Number(balance - amountToInvest), eligible: true };
  } else {
    console.log("balance <");
    return { moneyLeft: balance, eligible: false };
  }
};

// todo - fix this
/**
 *
 * @param {String} email - Email of the user
 * @param {Number} moneyLeft - Money left in user account
 * @param {mysql.Connection} connection - DB connection object
 * @returns {Object} - An object with updateMoneyResult and updatedMoneyError as keys
 */
const updateMoneyInAccount = async (email, moneyLeft, connection) => {
  try {
    let sql = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
    let inserts = ["balance", "balance", moneyLeft, "email", email];
    let formattedQuery = formatSqlQuery(sql, inserts);
    let resultOfDbMoneyUpdate = await executeQuery(connection, formattedQuery);
    return {
      updateMoneyResult: resultOfDbMoneyUpdate,
      updatedMoneyError: null,
    };
  } catch (error) {
    console.error("error inside updateMoneyInAccount", error);
    return { updateMoneyResult: null, updatedMoneyError: error };
  }
};

// todo - fix this
/**
 *
 * @param {mysql.Connection} connection - Db connection Object
 * @param {Object} req - Request Object
 * @returns {Object} - Object with resultOfTransactionInsertion and error as keys
 */
const insertTransactionIntoTable = async (connection, req) => {
  try {
    let { coinPrice, coinName, amountInvested, quantityBought } = req.body;
    let sql =
      "INSERT INTO transactions(email,coin_price,coin_name,amount_invested,quantity_bought) values (?,?,?,?,?)";
    let inserts = [
      req.session.email,
      Number(coinPrice).toFixed(2),
      coinName,
      Number(amountInvested).toFixed(2),
      Number(quantityBought).toFixed(4),
    ];
    let formattedQuery = formatSqlQuery(sql, inserts);
    let resultOfTransactionInsertion = await executeQuery(
      connection,
      formattedQuery
    );
    return { resultOfTransactionInsertion, error: null };
  } catch (error) {
    console.error("error inside insertTransactionIntoTable", error);
    return { resultOfTransactionInsertion: null, error };
  }
};
 
// todo - if addDefaultMoney fails, fail the user signup
/**
 * Add default money into user account, when user is created
 * @param {mysql.Connection} connection - Db connection Object
 * @param {Object} resultOfUserQuery - Result of user insert query
 * @param {String} email - Email of the user
 * @returns {Object} - Object with resultMoney and errorMoney as keys
 */
const addDefaultMoney = async (connection, resultOfUserQuery, email) => {
  try {
    if (resultOfUserQuery.insertId) {
      let sql = "INSERT INTO ?? (??,??,??) values (?,?,?)";
      let inserts = [
        "balance",
        "userid",
        "email",
        "balance",
        resultOfUserQuery.insertId,
        email,
        50000.0,
      ];
      let formattedQuery = formatSqlQuery(sql, inserts);
      let resultOfBalanceQuery = await executeQuery(connection, formattedQuery);

      return { resultMoney: resultOfBalanceQuery, errorMoney: null };
    } else {
      throw new Error("insertId empty in addDefaultMoney");
    }
  } catch (e) {
    console.error("error in adddefaultmoney", e);
    return { resultMoney: null, errorMoney: e };
  }
};


// todo - fix this
/**
 * General error codes related to mysql
 * @param {*} param0 - Object containing error number ({ errno })
 * @returns {String} - String describing the error
 */
const mysqlErrorCodes = ({ errno }) => {
  switch (errno) {
    case 1062:
      return "user with email already exist";

    default:
      return "Error while creating user";
  }
};

// todo - fix this
/**
 * Fetch the list of transaction done by user
 * @param {mysql.Connection} connection - Db connection Object
 * @param {String} email - User email
 * @returns {Object} - Object containing result and error as keys
 */
const fetchUserTrans = async (connection, email) => {
  try {
    let sql = "SELECT * FROM ?? WHERE ?? = ?";
    let inserts = ["transactions", "email", email];
    let formattedQuery = formatSqlQuery(sql, inserts);
    let result = await executeQuery(connection, formattedQuery);

    return { result, error: null };
  } catch (e) {
    console.error("error inside fetchUserTrans", e);
    return { result: null, error: e };
  }
};

/**
 * Export the function to be used elsewhere
 */
module.exports = {
  mysqlErrorCodes,
  addDefaultMoney,
  getUserBalance,
  fetchUserTrans,
};
