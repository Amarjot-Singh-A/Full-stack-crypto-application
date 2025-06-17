const transactionsModel = require('../models/transactionsModel');

/**
 * Get single transaction by ID
 * @param {*} req 
 * @param {*} res 
 * @returns {Object} - Object with keys - result, error
 */
const getTransaction = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).send({
        result: null,
        error: 'Missing required field: id',
      });
    }
    const { result, error } = await transactionsModel.get(id);
    if (error) {
      return res.status(400).send({
        result: null,
        error: `Error fetching transaction: ${error.message}`,
      });
    }
    res.status(200).send({
      result,
      error: null,
    });
  } catch (err) {
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
      return res.status(400).send({
        result: null,
        error: `Error fetching transactions: ${error.message}`,
      });
    }
    res.status(200).send({
      result,
      error: null,
    });
  } catch (err) {
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
      return res.status(400).send({
        result: null,
        error: 'Missing required fields: paymentId or amount',
      });
    }
    const { result, error } = await transactionsModel.create({ paymentId, amount, notes });
    if (error) {
      return res.status(400).send({
        result: null,
        error: `Error creating transaction: ${error.message}`,
      });
    }
    res.status(201).send({
      result,
      error: null,
    });
  } catch (err) {
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