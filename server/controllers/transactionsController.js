const { log } = require('winston');
const transactionsModel = require('../models/transactionsModel');
const logger = require('../utils/logger');

/**
 * Get single transaction by ID
 * @param {*} req 
 * @param {*} res 
 * @returns {Object} - Object with keys - result, error
 */
const getTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      logger.warn('Missing required field: id');
      return res.status(400).send({
        result: null,
        error: 'Missing required field: id',
      });
    }
    const { result, error } = await transactionsModel.get(id);
    if (error) {
      logger.error(`Error fetching transaction - transactionsModel: ${error.message}`);
      return res.status(400).send({
        result: null,
        error: `Error fetching transaction: ${error.message}`,
      });
    }
    logger.info(`Transaction fetched successfully: ${id}`);
    res.status(200).send({
      result,
      error: null,
    });
  } catch (err) {
    logger.error(`Error fetching transaction - transactionsController: ${err.message}`);
    res.status(500).send({
      result: null,
      error: `Error fetching transaction - controller level: ${err.message}`,
    });
  }
};

/**
 * Get all transactions
 * @param {*} req 
 * @param {*} res 
 * @returns {Object} - Object with keys - result, error
 */
const getAllTransactions = async (req, res) => {  
  try {
    const { result, error } = await transactionsModel.getAll();
    if (error) {
      logger.error(`Error fetching transactions - transactionsModel: ${error.message}`);
      return res.status(400).send({
        result: null,
        error: `Error fetching transactions: ${error.message}`,
      });
    }
    logger.info('Transactions fetched successfully');
    res.status(200).send({
      result,
      error: null,
    });
  } catch (err) {
    logger.error(`Error fetching transactions - transactionsController: ${err.message}`);
    res.status(500).send({
      result: null,
      error: `Error fetching transactions - controller level: ${err.message}`,
    });
  }
};

/**
 * Create a new transaction
 * @param {*} req 
 * @param {*} res 
 * @returns {Object} - Object with keys - result, error
 */
const createTransaction = async (req, res) => {
  try {
    const { paymentId, amount, notes } = req.body;
    if (!paymentId || !amount) {
      logger.warn('Missing required fields: paymentId or amount');
      return res.status(400).send({
        result: null,
        error: 'Missing required fields: paymentId or amount',
      });
    }
    const { result, error } = await transactionsModel.create({ paymentId, amount, notes });
    if (error) {
      logger.error(`Error creating transaction - transactionsModel: ${error.message}`);
      return res.status(400).send({
        result: null,
        error: `Error creating transaction: ${error.message}`,
      });
    }
    logger.info(`Transaction created successfully: ${result.id}`);  
    res.status(201).send({
      result,
      error: null,
    });
  } catch (err) {
    logger.error(`Error creating transaction - transactionsController: ${err.message}`);
    res.status(500).send({
      result: null,
      error: `Error creating transaction - controller level: ${err.message}`,
    });
  }
};

module.exports = {
  getTransaction,
  getAllTransactions,
  createTransaction,
};