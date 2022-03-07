/****************************************************************************************
 * This file contains the important functions to implement the back-end API functionality
 ****************************************************************************************/

/**
 * A common function used to execute query using promises
 * @param {mysql.Connection} connection - mySql connection object
 * @param {String} sqlQuery - Sql query to be executed
 * @returns {Promise} - A Promise with value of either reject or resolve
 */
const executeQuery = (connection, sqlQuery) => {
  return new Promise((resolve, reject) => {
    connection.query(sqlQuery, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};

/**
 * This function compare password entered by user with the password in the Db
 * @param {*} bcrypt
 * @param {String} password - Password entered by user
 * @param {String} retrievedHash - Retreived password of user from Db
 * @returns {Promise} - Promise with reject or resolve
 */
const bcryptComparePassword = (bcrypt, password, retrievedHash) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, retrievedHash, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};

/**
 * Hash the password to be stored in Db
 * @param {*} bcrypt
 * @param {String} password - Password in string entered by user
 * @returns {Promise} - Promise with either resolve and reject
 */
const bcryptHashPassword = (bcrypt, password) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 12, async function (err, hash) {
      if (err) {
        reject(err);
      }
      resolve(hash);
    });
  });
};

/**
 * Get the user balance from Db
 * @param {mysql.Connection} connection - Connection object for Db
 * @param {String} email - Email entered by user
 * @returns {Object} - An object with balance and error as keys
 */
const getUserBalance = async (connection, email) => {
  try {
    let query = `select balance from balance where email = '${email}'`;
    let resultOfGetUserBalance = await executeQuery(connection, query);
    return { balance: resultOfGetUserBalance, error: null };
  } catch (e) {
    console.error("error inside getuserbalance", e);
    return { balance: null, error: e };
  }
};

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

/**
 *
 * @param {String} email - Email of the user
 * @param {Number} moneyLeft - Money left in user account
 * @param {mysql.Connection} connection - DB connection object
 * @returns {Object} - An object with updateMoneyResult and updatedMoneyError as keys
 */
const updateMoneyInAccount = async (email, moneyLeft, connection) => {
  try {
    let query = `UPDATE balance SET balance = '${moneyLeft}' WHERE (email = '${email}')`;
    let resultOfDbMoneyUpdate = await executeQuery(connection, query);
    return {
      updateMoneyResult: resultOfDbMoneyUpdate,
      updatedMoneyError: null,
    };
  } catch (error) {
    console.error("error inside updateMoneyInAccount", error);
    return { updateMoneyResult: null, updatedMoneyError: error };
  }
};

/**
 *
 * @param {mysql.Connection} connection - Db connection Object
 * @param {Object} req - Request Object
 * @returns {Object} - Object with resultOfTransactionInsertion and error as keys
 */
const insertTransactionIntoTable = async (connection, req) => {
  try {
    let { coinPrice, coinName, amountInvested, quantityBought } = req.body;
    let query = `insert into transactions(email,coin_price,coin_name,amount_invested,quantity_bought) values ('${
      req.session.email
    }',${Number(coinPrice).toFixed(2)},'${coinName}',${Number(
      amountInvested
    ).toFixed(2)},${Number(quantityBought).toFixed(4)})`;
    let resultOfTransactionInsertion = await executeQuery(connection, query);
    return { resultOfTransactionInsertion, error: null };
  } catch (error) {
    console.error("error inside insertTransactionIntoTable", error);
    return { resultOfTransactionInsertion: null, error };
  }
};

/**
 * Chcck the balance of user and perform the buy operation
 * @param {mysql.Connection} connection - Db connection Object
 * @param {Object} req - Request Object
 * @returns {Object} - Object with keys - result, completed, error
 */
const cryptoBuyAction = async (connection, req) => {
  try {
    let { email } = req.session;
    let { balance, error } = await getUserBalance(connection, email);
    if (error == null) {
      console.log("inside crypto error = null", balance[0].balance);
      let { moneyLeft, eligible } = await enoughBalance(
        balance[0].balance,
        Number(req.body.amountInvested)
      );
      if (eligible) {
        console.log("inside eligible", moneyLeft);
        let { updateMoneyResult, updatedMoneyError } =
          await updateMoneyInAccount(email, moneyLeft, connection);

        let { resultOfTransactionInsertion, error } =
          await insertTransactionIntoTable(connection, req);

        if (updatedMoneyError == null && resultOfTransactionInsertion) {
          console.log("result of trans");
          return { result: updateMoneyResult, completed: true, error: null };
        } else {
          return {
            result: "Unexpected error inside",
            completed: false,
            error: null,
          };
        }
      } else {
        return {
          result: "Not enough balance in account",
          completed: false,
          error: null,
        };
      }
    } else {
      throw new Error("Error fetching balance");
    }
  } catch (e) {
    console.error("Error inside crypto buy action", e);
    return { result: null, completed: false, error: e.message };
  }
};

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
      let query = `insert into balance(userid,email,balance)
    values('${resultOfUserQuery.insertId}','${email}',50000.00)`;
      let resultOfBalanceQuery = await executeQuery(connection, query);
      return { resultMoney: resultOfBalanceQuery, errorMoney: null };
    } else {
      throw new Error("insertId empty in addDefaultMoney");
    }
  } catch (e) {
    console.error("error in adddefaultmoney", e);
    return { resultMoney: null, errorMoney: e };
  }
};

/**
 * Sign up new user
 * @param {*} param0 - Object with values => {firstname :, lastName:, email:, password:,}
 * @param {mysql.Connection} connection - Db connection Object
 * @param {*} bcrypt
 * @returns {Object} - Object with result and err as keys
 */
const signUpUser = async (
  { firstName, lastName, email, password },
  connection,
  bcrypt
) => {
  try {
    let hashedPassword = await bcryptHashPassword(bcrypt, password);
    let query = `INSERT INTO users(email,password,first_name,last_name) 
        VALUES('${email}','${hashedPassword}','${firstName}','${lastName}')`;
    let resultOfUserQuery = await executeQuery(connection, query);
    return { result: resultOfUserQuery, err: null };
  } catch (err) {
    console.error("error in signUpUser", err);
    return { result: null, err };
  }
};

/**
 * Authenticate the user
 * @param {mysql.Connection} connection - Db connection Object
 * @param {*} bcrypt
 * @param {String} email - Email entered by user
 * @param {String} password - Password entered by user
 * @returns {Object} - Object with keys isPasswordMatch and isEmailMatch. additional key firstName on success
 */
const verifySignIn = async (connection, bcrypt, email, password) => {
  try {
    const query = `SELECT first_name,password FROM users WHERE email='${email}'`;
    let queryResult = await executeQuery(connection, query);
    if (Object.keys(queryResult).length > 0) {
      let isPasswordMatch = await bcryptComparePassword(
        bcrypt,
        password,
        queryResult[0].password
      );
      return {
        isPasswordMatch: isPasswordMatch,
        isEmailMatch: true,
        firstName: queryResult[0].first_name,
      };
    } else {
      return { isPasswordMatch: false, isEmailMatch: false };
    }
  } catch (err) {
    console.error("error in verifysignin", err);
  }
};

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

/**
 * Get user favourite coins from Db
 * @param {mysql.Connection} connection - Db connection Object
 * @param {String} email - Email of user
 * @returns {Object} - Array of Object containing the favourite coins of user
 */
const getCoinsDb = async (connection, email) => {
  try {
    let query = `SELECT coins FROM users WHERE email='${email}'`;
    let favouriteCoinsArr = await executeQuery(connection, query);
    return favouriteCoinsArr;
  } catch (err) {
    console.error("error fetching coins from db", err);
  }
};

/**
 * Update the user favourite coins in Db
 * @param {mysql.Connection} connection - Db connection Object
 * @param {Object} req - Request Object
 * @returns {Object} - Result Object of insertion sql operation
 */
const insertCoinsDb = async (connection, req) => {
  try {
    let query = `update users set coins=('${JSON.stringify(
      req.body
    )}') WHERE email='${req.session.email}'`;
    let resultofCoinInsertion = await executeQuery(connection, query);
    return resultofCoinInsertion;
  } catch (err) {
    console.error("error inserting coins into db", err);
  }
};

/**
 * Fetch the list of transaction done by user
 * @param {mysql.Connection} connection - Db connection Object
 * @param {String} email - User email
 * @returns {Object} - Object containing result and error as keys
 */
const fetchUserTrans = async (connection, email) => {
  try {
    let query = `select * from transactions where email='${email}'`;
    let result = await executeQuery(connection, query);
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
  verifySignIn,
  signUpUser,
  mysqlErrorCodes,
  getCoinsDb,
  insertCoinsDb,
  addDefaultMoney,
  getUserBalance,
  cryptoBuyAction,
  fetchUserTrans,
};
