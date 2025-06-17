const favouriteCoinsModel = require("../models/favouriteCoinsModel");

/**
 * Fetch the favourite coins for the authenticated user
 * @param {Object} req
 * @param {Object} res
 */
const getFavourite = async (req, res) => {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(401).send({
        result: [],
        error: "User not authenticated or session missing",
      });
    }
    const { result, error } = await favouriteCoinsModel.get(req.session.userId);
    console.log("getFavourite result =>", result);
    if (Array.isArray(result) && result.length > 0) {
      res.status(200).send({
        result,
        error,
      });
    } else {
      res.status(200).send({
        result,
        error: "User has no favourite coins",
      });
    }
  } catch (err) {
    res.status(500).send({
      result: [],
      error: `Error fetching favourite record at controller level : ${err.message}`,
    });
  }
};

/**
 * Handle logic related to creating a favourite coin for a user
 * @param {Object} req
 * @param {Object} res
 */
const createFavourite = async (req, res) => {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(401).send({
        result: [],
        error: "User not authenticated or session missing",
      });
    }
    if (!req.body.coinId || !req.body.name) {
      return res.status(400).send({
        result: [],
        error: "coinId and name are required",
      });
    }
    const { result, error } = await favouriteCoinsModel.create({
      coinId: req.body.coinId,
      name: req.body.name,
      userId: req.session.userId,
    });
    console.log("createFavourite result =>", result)
    if (Array.isArray(result) && result.length > 0) {
      res.status(201).send({
        result,
        error,
      });
    } else {
      res.status(400).send({
        result,
        error: "Failed to add favourite coin. It may already exist or input is invalid.",
      });
    }
  } catch (err) {
    res.status(500).send({
      result: [],
      error: `Server error while inserting favourite record at controller level: ${err.message}`,
    });
  }
};

module.exports = {
  getFavourite,
  createFavourite,
};
