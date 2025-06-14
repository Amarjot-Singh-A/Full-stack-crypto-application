
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


/**
 * Get user favourite coins from Db
 * @param {String} userId
 * @returns {Object} - Array of Object containing the favourite coins of user
 */
const getFavourite = async (userId) => {
  try {
    let sql = "SELECT ??,?? FROM ?? WHERE ?? = ?";
    let inserts = ["coinId","name", "favouriteCoins", "userId", userId];
    let formattedQuery = formatSqlQuery(sql, inserts);
    let favouriteCoinsArr = await executeQuery(formattedQuery);

    return favouriteCoinsArr;
  } catch (err) {
    console.error("error fetching coins from db", err);
  }
};

/**
 * Update the user favourite coins in Db
 * @param {Object}  - {coinId, name, userId }
 * @returns {Object} - Result Object of insertion sql operation
 */
const postFavourite = async ({coinId, name, userId }) => {
  try {
    let sql = "INSERT INTO ?? (??,??,??,??) values (?,?,?,?)";
    let inserts = [
      "favouriteCoins",
      "coinId",
      "name",
      "userId",
      "timestamp",
      coinId,
      name,
      userId,
      Math.floor(Date.now() / 1000)
    ];
    let formattedQuery = formatSqlQuery(sql, inserts);
    let resultofCoinInsertion = await executeQuery(formattedQuery);

    return resultofCoinInsertion;
  } catch (err) {
    console.error("error inserting coins into db", err);
  }
};

module.exports = {
    buy,
    getFavourite,
    postFavourite
}

