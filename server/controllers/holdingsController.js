const { log } = require('winston');
const holdingsModel = require('../models/holdingsModel');
const logger = require('../utils/logger');

/**
 * Fetch holdings for a user
 * @param {Object} req
 * @param {Object} res
 */
const getHoldings = async (req, res) => {
  try {
    if (!req.session || !req.session.userId) {
      logger.warn('User not authenticated or session missing');
      return res.status(401).send({
        result: [],
        error: 'User not authenticated or session missing',
      });
    }
    const { result, error } = await holdingsModel.get(req.session.userId);
    console.log('getHoldings result =>', result);
    if (Array.isArray(result) && result.length > 0) {
      logger.info(
        `Holdings fetched successfully for user ${req.session.userId}`,
      );
      return res.status(200).send({
        result,
        error: `Error getting holding - controller level : ${error.message}`,
      });
    } else {
      logger.warn(`No holdings found for user ${req.session.userId}`);
      res.status(200).send({
        result,
        error: 'user has no holdings',
      });
    }
  } catch (error) {
    logger.error(
      'Error getting holdings - holdingsController',
      error.message || error,
    );
    res.status(500).send({
      result: [],
      error: `Error getting holding - controller level : ${error.message}`,
    });
  }
};

/**
 * Handle business logic related to creating a new holding for a user
 * @param {Object} req
 * @param {Object} res
 */
const createHoldings = async (req, res) => {
  try {
    if (!req.session || !req.session.userId) {
      logger.warn('User not authenticated or session missing');
      return res.status(401).send({
        result: [],
        error: 'User not authenticated or session missing',
      });
    }
    if (!req.body.coinId || !req.body.quantity) {
      logger.warn('coinId and quantity are required for creating a holding');
      return res.status(400).send({
        result: [],
        error: 'Missing required fields: userId, coinId, or quantity',
      });
    }
    const { result, error } = await holdingsModel.create({
      userId: req.session.userId,
      coinId: req.body.coinId,
      quantity: req.body.quantity,
    });
    console.log('createHoldings result =>', result);
    if (Array.isArray(result) && result.length > 0) {
      logger.info(
        `Holding created successfully for user ${req.session.userId}`,
      );
      return res.status(201).send({
        result,
        error,
      });
    } else {
      logger.error(
        'Error inserting holding - controller level',
        error?.message || error,
      );
      res.status(400).send({
        result,
        error: 'error inserting holding - controller level',
      });
    }
  } catch (err) {
    logger.error(
      'Error inserting holding - holdingsController',
      err.message || err,
    );
    res.status(500).send({
      result: [],
      error: `Error inserting holding record at controller level : ${err.message}`,
    });
  }
};

/**
 * Handle business logic related to removing holdings
 * @param {Object} req
 * @param {Object} res
 */
const removeHoldings = async (req, res) => {
  try {
    if (!req.body.id) {
      logger.warn('id is required for removing a holding');
      return res.status(400).send({
        result: [],
        error: 'Missing required field: id',
      });
    }
    const { result, error } = await holdingsModel.removeHoldings({
      id: req.body.id,
    });
    console.log('removeHoldings result =>', result);
    if (Array.isArray(result) && result.length > 0) {
      logger.info(`Holding deleted successfully for id ${req.body.id}`);
      return res.status(200).send({
        result,
        error,
      });
    } else {
      logger.error(
        'Error deleting holdings - controller level',
        error?.message || error,
      );
      res.status(400).send({
        result,
        error: 'error deleting holdings - controller level',
      });
    }
  } catch (err) {
    logger.error(
      'Error deleting holdings - holdingsController',
      err.message || err,
    );
    res.status(500).send({
      result: [],
      error: `Error deleting holding record at controller level: ${err.message}`,
    });
  }
};

module.exports = { getHoldings, createHoldings, removeHoldings };
