const coinsModel = require("../models/coinsModel");

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
  buy
};
