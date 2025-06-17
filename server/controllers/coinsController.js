const { log } = require("winston");
const coinsModel = require("../models/coinsModel");
const logger = require("../utils/logger");

/**
 * Create a record in coins table
 * @param {Object} req - Request object containing coin data
 * @param {Object} res - Response object to send the result or error
 * @returns {Object} - Object with keys - result, error
 */
const create = async (req, res) => {
  const { name, description, oldPrice, currentPrice } = req.body;

  if (!name || !description || !oldPrice || !currentPrice) {
    logger.error("Invalid input data for creating coin");
    return res.status(400).send({
      result: [],
      error:
        "Invalid input data. All fields are required: name, description, oldPrice, currentPrice.",
    });
  }

  try {
    const { result, error } = await coinsModel.create({
      name,
      description,
      oldPrice,
      currentPrice,
    });

    if (error) {
      logger.error("Error creating coin - coinsModel", error?.message || error);
      return res.status(400).send({
        result: [],
        error: `Error creating a coin record: ${error?.message || error}`,
      });
    }
    logger.info(`Coin created successfully: ${name}`);
    res.status(201).send({
      result,
      error: null,
    });
  } catch (error) {
    logger.error(
      "Error creating coin - coinsController",
      error?.message || error
    );
    res.status(500).send({
      result: [],
      error: `Error creating a coin record at controller level: ${
        error?.message || error
      }`,
    });
    return;
  }
};

/**
 * Get a single coin by ID
 * @param {*} req
 * @param {*} res
 * @returns {Object} - Object with keys - result, error
 *
 */
const get = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    logger.error("Coin ID is required to fetch a coin");
    return res.status(400).send({
      result: [],
      error: "Coin ID is required",
    });
  }
  try {
    const { result, error } = await coinsModel.get(id);
    if (error) {
      logger.error("Error fetching coin - coinsModel", error?.message || error);
      return res.status(400).send({
        result: [],
        error: `Error fetching coin record: ${error?.message || error}`,
      });
    }
    logger.info(`Coin fetched successfully: ${id}`);
    res.status(200).send({
      result,
      error: null,
    });
  } catch (error) {
    logger.error(
      "Error fetching coin - coinsController",
      error?.message || error
    );
    res.status(500).send({
      result: [],
      error: `Error fetching coin record at controller level: ${
        error?.message || error
      }`,
    });
  }
};

/**
 * Get all coins
 * @param {*} req
 * @param {*} res
 * @returns {Object} - Object with keys - result, error
 *
 */
const getAll = async (req, res) => {
  try {
    const { result, error } = await coinsModel.getAll();
    if (error) {
      logger.error(
        "Error fetching all coins - coinsModel",
        error?.message || error
      );
      return res.status(400).send({
        result: [],
        error: `Error fetching all coins: ${error?.message || error}`,
      });
    }
    logger.info("All coins fetched successfully");
    res.status(200).send({
      result,
      error: null,
    });
  } catch (error) {
    logger.error(
      "Error fetching all coins - coinsController",
      error?.message || error
    );
    res.status(500).send({
      result: [],
      error: `Error fetching all coins at controller level: ${
        error?.message || error
      }`,
    });
  }
};

/**
 * Update a coin record
 * @param {*} req
 * @param {*} res
 * @returns {Object} - Object with keys - result, error
 *
 */
const update = async (req, res) => {
  const id = req.params.id;
  const { name, description, oldPrice, currentPrice } = req.body;
  if (!id || !name || !description || !oldPrice || !currentPrice) {
    logger.error("Invalid input data for updating coin");
    return res.status(400).send({
      result: [],
      error:
        "Invalid input data. All fields are required: id, name, description, oldPrice, currentPrice.",
    });
  }

  try {
    const { result, error } = await coinsModel.update(
      id,
      name,
      description,
      oldPrice,
      currentPrice
    );
    if (error) {
      logger.error("Error updating coin - coinsModel", error?.message || error);
      return res.status(400).send({
        result: [],
        error: `Error updating coin record: ${error?.message || error}`,
      });
    }
    logger.info(`Coin updated successfully: ${id}`);
    res.status(200).send({
      result,
      error: null,
    });
  } catch (error) {
    logger.error(
      "Error updating coin - coinsController",
      error?.message || error
    );
    res.status(500).send({
      result: [],
      error: `Error updating coin record at controller level: ${
        error?.message || error
      }`,
    });
  }
};

module.exports = {
  create,
  get,
  getAll,
  update,
};
