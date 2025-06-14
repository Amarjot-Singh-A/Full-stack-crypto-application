const coinsModel = require("../models/coinsModel");

/**
 * Hanlde logic related to signing in of a user
 * @param {Object} req
 * @param {Object} res
 */
const getFavourite = async (req, res) => {
 try {
    let fetchedCoinsArr = coinsModel.getFavourite(
      req.session.userId
    );
    console.log("fetchedCoinsArr", fetchedCoinsArr);
    if (fetchedCoinsArr.length) {
      res.status(200).send({
        coins: fetchedCoinsArr,
        error: "",
      });
    } else {
      res.status(200).send({
        coins: fetchedCoinsArr,
        error: "user have no favourite coins",
      });
    }
  } catch (err) {
    res.status(400).send({
      coins: fetchedCoinsArr,
      error: "user have no favourite coins",
    });
  }

};

/**
 * Hanlde business logic related to signing up a user
 * @param {Object} req
 * @param {Object} res
 */
const postFavourite = async (req, res) => {
let resultOfCoinsQuery = await coinsModel.postFavourite({
    coinId : req.body.coinId,
    name : req.body.name,
    userId : req.body.userId
});
  if (Object.keys(resultOfCoinsQuery).length > 0) {
    res.status(200).send({
      inserted: true,
      error: "",
    });
  } else {
    res.status(403).send({
      inserted: false,
      error: "error inserting coins",
    });
  }
};

/**
 * Handle logic related to logging out a user
 * @param {Object} req
 * @param {Object} res
 */
const buy = (req, res) => {
// console.log("buy -> ", req.body);
//   let { result, completed, error } = await coinsModel.buy(
//     connection,
//     req
//   );
//   if (completed) {
//     res.status(200).send({
//       result,
//       error,
//       completed,
//     });
//   } else if (completed === false && result) {
//     res.status(403).send({
//       result,
//       error,
//       completed,
//     });
//   } else {
//     res.status(403).send({
//       result,
//       error,
//       completed,
//     });
//   }
};

module.exports = {
  getFavourite,
  postFavourite,
  buy,
};
