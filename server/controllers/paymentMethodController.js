const paymentMethodModel = require('../models/paymentMethodModel');
const logger = require('../utils/logger');

/**
 * Create a new payment method
 * @param {*} req
 * @param {*} res
 * @returns {Object} - Object with keys - result, error
 */
const createPaymentMethod = async (req, res) => {
  try {
    const { type, name } = req.body;
    if (!type || !name) {
      logger.warn('Missing required fields: type or name');
      return res.status(400).send({
        result: null,
        error: 'Missing required fields: type or name',
      });
    }
    const { result, error } = await paymentMethodModel.create({ type, name });
    if (error) {
      logger.error(
        `Error creating payment method - paymentMethodModel: ${error.message}`,
      );
      return res.status(400).send({
        result: null,
        error: `Error creating payment method: ${error.message}`,
      });
    }
    logger.info(`Payment method created successfully: ${name}`);
    res.status(201).send({
      result,
      error: null,
    });
  } catch (err) {
    logger.error(
      `Error creating payment method - paymentMethodController: ${err.message}`,
    );
    res.status(500).send({
      result: null,
      error: `Error creating payment method - controller level: ${err.message}`,
    });
  }
};

/**
 * Get a payment method by ID
 * @param {*} req
 * @param {*} res
 * @returns {Object} - Object with keys - result, error
 */
const getPaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      logger;
      return res.status(400).send({
        result: null,
        error: 'Missing required field: id',
      });
    }
    const { result, error } = await paymentMethodModel.get(id);
    if (error) {
      logger.error(
        `Error fetching payment method - paymentMethodModel: ${error.message}`,
      );
      return res.status(400).send({
        result: null,
        error: `Error fetching payment method: ${error.message}`,
      });
    }
    logger.info(`Payment method fetched successfully with ID: ${id}`);
    res.status(200).send({
      result,
      error: null,
    });
  } catch (err) {
    logger.error(
      `Error fetching payment method - paymentMethodController: ${err.message}`,
    );
    res.status(500).send({
      result: null,
      error: `Error fetching payment method - controller level: ${err.message}`,
    });
  }
};

/**
 * Get all payment methods
 * @param {*} req
 * @param {*} res
 * @returns {Object} - Object with keys - result, error
 */
const getAllPaymentMethods = async (req, res) => {
  try {
    const { result, error } = await paymentMethodModel.getAll();
    if (error) {
      logger.error(
        `Error fetching payment methods - paymentMethodModel: ${error.message}`,
      );
      return res.status(400).send({
        result: null,
        error: `Error fetching payment methods: ${error.message}`,
      });
    }
    logger.info('Payment methods fetched successfully');
    res.status(200).send({
      result,
      error: null,
    });
  } catch (err) {
    logger.error(
      `Error fetching payment methods - paymentMethodController: ${err.message}`,
    );
    res.status(500).send({
      result: null,
      error: `Error fetching payment methods - controller level: ${err.message}`,
    });
  }
};

module.exports = {
  createPaymentMethod,
  getPaymentMethod,
  getAllPaymentMethods,
};
