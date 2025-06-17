const { log } = require("winston");
const favouriteCoinsModel = require("../models/favouriteCoinsModel");
const logger = require("../utils/logger");

/**
 * Fetch the favourite coins for the authenticated user
 * @param {Object} req
 * @param {Object} res
 */
const getFavourite = async (req, res) => {
  try {
    if (!req.session || !req.session.userId) {
      logger.warn("User not authenticated or session missing");
      return res.status(401).send({
        result: [],
        error: "User not authenticated or session missing",
      });
    }
    const { result, error } = await favouriteCoinsModel.get(req.session.userId);
    console.log("getFavourite result =>", result);
    if (Array.isArray(result) && result.length > 0) {
      logger.info(`Favourite coins fetched successfully for user ${req.session.userId}`);
      return res.status(200).send({
        result,
        error,
      });
    } else {
      logger.warn(`No favourite coins found for user ${req.session.userId}`);
      res.status(200).send({
        result,
        error: "User has no favourite coins",
      });
    }
  } catch (err) {
    logger.error("Error fetching favourite coins - favouriteCoinsController", err.message || err);
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
      logger.warn("User not authenticated or session missing");
      return res.status(401).send({
        result: [],
        error: "User not authenticated or session missing",
      });
    }
    if (!req.body.coinId || !req.body.name) {
      logger.warn("coinId and name are required for creating a favourite coin");
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
      logger.info(`Favourite coin added successfully for user ${req.session.userId}`);
      return res.status(201).send({
        result,
        error,
      });
    } else {
      logger.warn(`Failed to add favourite coin for user ${req.session.userId}`);
      res.status(400).send({
        result,
        error: "Failed to add favourite coin. It may already exist or input is invalid.",
      });
    }
  } catch (err) {
    logger.error("Error inserting favourite coin - favouriteCoinsController", err.message || err);
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
