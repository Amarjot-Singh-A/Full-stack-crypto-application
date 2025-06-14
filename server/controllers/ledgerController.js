const ledgerModel = require("../models/ledgerModel");


/**
 * Fetch balance from ledger table
 * @param {Object} req
 * @param {Object} res
 */
const getBalance = async (req, res) => {
  try {
    const { result, error } = await ledgerModel.get(req.session.userId);
    console.log("getBalance result =>", result);
    console.log("req.session.userId =>", req.session.userId);
    if (result == null && error) {
      res.status(404).send({
        result,
        error
      });
    } else {
      res.status(200).send({
        result,
        error
      });
    }
  } catch (err) {
    res.status(400).send({
      result: null,
      error: "Error fetching balance",
    });
  }
};

module.exports = {
  getBalance
};
