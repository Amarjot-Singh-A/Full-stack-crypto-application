/**
 * TODO - change sqlQuery format 
 * `SELECT * FROM user_tbl WHERE username = ? AND 
                      password = ?`, [username, password],        
       (err, results, fields)
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

const enoughBalance = async (balance, amountToInvest) => {
  if (balance >= amountToInvest) {
    console.log('balance >')
    return { moneyLeft: Number(balance - amountToInvest), eligible: true };
  } else {
    console.log('balance <')
    return { moneyLeft: balance, eligible: false };
  }
};

const updateMoneyInAccount = async (email, moneyLeft, connection) => {
  try {
    let query = `UPDATE balance SET balance = '${moneyLeft}' WHERE (email = '${email}')`;
    let resultOfDbMoneyUpdate = await executeQuery(connection, query);
    return {
      updateMoneyResult: resultOfDbMoneyUpdate,
      updatedMoneyerror: null,
    };
  } catch (error) {
    console.error("error inside updateMoneyInAccount", error);
    return { updateMoneyResult: null, updatedMoneyerror: error };
  }
};

/**
 * todo - create table transactions with email as foreign key from balance,
 * todo - other columns - coinPrice,coinName,amountInvest,quantityBought,
 * todo - timestamp created, timestamp updated
 */

const insertTransactionIntoTable = async (connection, req) => {
  try {
    let { coinPrice, coinName, amountInvested, quantityBought } = req.body;
    let query = `insert into transactions(email,coin_price,coin_name,amount_invested,quantity_bought) values ('${req.session.email}',${Number(coinPrice).toFixed(2)},'${coinName}',${Number(amountInvested).toFixed(2)},${Number(quantityBought).toFixed(2)})`;
    let resultOfTransactionInsertion = await executeQuery(connection,query)
    return {resultOfTransactionInsertion,error:null}
  } catch (error) {
    console.error("error inside insertTransactionIntoTable", error);
    return {resultOfTransactionInsertion:null , error}
  }
};


const cryptoBuyAction = async (connection, req) => {
  try {
    let { email } = req.session;
    let { balance, error } = await getUserBalance(connection, email);
    if (error == null) {
      console.log("inside crypto error = null",balance[0].balance)
      let { moneyLeft, eligible } = await enoughBalance(
        balance[0].balance,
        Number(req.body.amountInvested)
      );
      if (eligible) {
        console.log('inside eligible',moneyLeft)
        let { updateMoneyResult, updatedMoneyerror } =
          await updateMoneyInAccount(email, moneyLeft, connection);

        let {resultOfTransactionInsertion,error} = await insertTransactionIntoTable(connection, req);

        if (updatedMoneyerror == null && resultOfTransactionInsertion) {
          console.log('result of trans')
          return { result: updateMoneyResult, completed: true, error: null };
        } else {
          return {
            result: "unexpected error inside updateMoneyInAccount",
            completed: false,
            error: null,
          };
        }
      } else {
        return {
          result: "not enough balance in account",
          completed: false,
          error: null,
        };
      }
    } else {
      throw error("error fetching balance inside cryptobuyaction");
    }
  } catch (e) {
    console.error("error inside crypto buy action", e);
    return { result: null, completed: false, error: e };
  }
};

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

const mysqlErrorCodes = ({ errno }) => {
  switch (errno) {
    case 1062:
      return "user with email already exist";

    default:
      return "Error while creating user";
  }
};

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
 * todo - check the format of req and complete the insertion
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

module.exports = {
  verifySignIn,
  signUpUser,
  mysqlErrorCodes,
  getCoinsDb,
  insertCoinsDb,
  addDefaultMoney,
  getUserBalance,
  cryptoBuyAction,
};
