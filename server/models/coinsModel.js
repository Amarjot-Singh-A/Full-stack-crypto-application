
const { formatSqlQuery, executeQuery } = require("../config/db");


/**
 * Chcck the balance of user and perform the buy operation
 * @param {Object} req - Request Object
 * @returns {Object} - Object with keys - result, completed, error
 */
const buy = async (req) => {
//   try {
//     let { email } = req.session;
//     let { balance, error } = await getUserBalance(connection, email);
//     if (error == null) {
//       console.log("inside crypto error = null", balance[0].balance);
//       let { moneyLeft, eligible } = await enoughBalance(
//         balance[0].balance,
//         Number(req.body.amountInvested)
//       );
//       if (eligible) {
//         console.log("inside eligible", moneyLeft);
//         let { updateMoneyResult, updatedMoneyError } =
//           await updateMoneyInAccount(email, moneyLeft, connection);

//         let { resultOfTransactionInsertion, error } =
//           await insertTransactionIntoTable(connection, req);

//         if (updatedMoneyError == null && resultOfTransactionInsertion) {
//           console.log("result of trans");
//           return { result: updateMoneyResult, completed: true, error: null };
//         } else {
//           return {
//             result: "Unexpected error inside",
//             completed: false,
//             error: null,
//           };
//         }
//       } else {
//         return {
//           result: "Not enough balance in account",
//           completed: false,
//           error: null,
//         };
//       }
//     } else {
//       throw new Error("Error fetching balance");
//     }
//   } catch (e) {
//     console.error("Error inside crypto buy action", e);
//     return { result: null, completed: false, error: e.message };
//   }
};

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

module.exports = {
    buy
}

