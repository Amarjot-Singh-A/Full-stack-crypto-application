const holdingsModel = require("../models/holdingsModel");

/**
 * Hanlde logic related to signing in of a user
 * @param {Object} req
 * @param {Object} res
 */
const getHoldings = async (req, res) => {
  try {
    const { result, error } = holdingsModel.get(req.session.userId);
    if (result.length > 0) {
      res.status(200).send({
        result,
        error,
      });
    } else {
      res.status(200).send({
        result,
        error: "user have no holdings",
      });
    }
  } catch (err) {
    res.status(500).send({
      result,
      error: "error getting holding - controller level ",
    });
  }
};

/**
 * Hanlde business logic related to signing up a user
 * @param {Object} req
 * @param {Object} res
 */
const createHoldings = async (req, res) => {
  try {
    const { result, error } = await holdingsModel.create({
      userId: req.body.userId,
      coinId: req.body.coinId,
      quantity: req.body.quantity,
    });
    if (result.length > 0) {
      res.status(200).send({
        result,
        error,
      });
    } else {
      res.status(400).send({
        result,
        error: "error inserting holding - controller level",
      });
    }
  } catch (err) {
    res.status(500).send({
      result,
      error: "Error inserting holding record at controller level",
    });
  }
};

/**
 * Hanlde business logic related to signing up a user
 * @param {Object} req
 * @param {Object} res
 */
const removeHoldings = async (req, res) => {
  try {
    const { result, error } = await holdingsModel.removeHoldings({
      id: req.body.id,
    });
    if (result.length > 0) {
      res.status(200).send({
        result,
        error,
      });
    } else {
      res.status(400).send({
        result,
        error: "error deleting holdings - controller level",
      });
    }
  } catch (err) {
    res.status(500).send({
      result,
      error: "Error deleting holding record at controller level",
    });
  }
};

module.exports = {
  getHoldings,
  createHoldings,
  removeHoldings,
};
