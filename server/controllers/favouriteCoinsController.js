const favouriteCoinsModel = require("../models/favouriteCoinsModel");

/**
 * Hanlde logic related to signing in of a user
 * @param {Object} req
 * @param {Object} res
 */
const getFavourite = async (req, res) => {
  try {
    const { result, error } = favouriteCoinsModel.get(req.session.userId);
    if (result.length > 0) {
      res.status(200).send({
        result,
        error,
      });
    } else {
      res.status(200).send({
        result,
        error: "user have no favourite coins",
      });
    }
  } catch (err) {
    res.status(500).send({
      result,
      error: "Error fetching favourite record at controller level",
    });
  }
};

/**
 * Hanlde business logic related to signing up a user
 * @param {Object} req
 * @param {Object} res
 */
const createFavourite = async (req, res) => {
  try {
    const { result, error } = await favouriteCoinsModel.create({
      coinId: req.body.coinId,
      name: req.body.name,
      userId: req.body.userId,
    });
    if (result.length > 0) {
      res.status(200).send({
        result,
        error,
      });
    } else {
      res.status(400).send({
        result,
        error: "Error inserting favourite record at controller level",
      });
    }
  } catch (err) {
    res.status(500).send({
      result,
      error: "Error inserting favourite record at controller level",
    });
  }
};

module.exports = {
  getFavourite,
  createFavourite,
};
