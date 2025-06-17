const paymentMethodModel = require('../models/paymentMethodModel');

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
      return res.status(400).send({
        result: null,
        error: 'Missing required fields: type or name',
      });
    }
    const { result, error } = await paymentMethodModel.create({ type, name });
    if (error) {
      return res.status(400).send({
        result: null,
        error: `Error creating payment method: ${error.message}`,
      });
    }
    res.status(201).send({
      result,
      error: null,
    });
  } catch (err) {
    res.status(500).send({
      result: null,
      error: `Error creating payment method - controller level: ${err.message}`,
    });
  }
}   

/**
 * Get a payment method by ID
 * @param {*} req 
 * @param {*} res 
 * @returns {Object} - Object with keys - result, error
 */
const getPaymentMethod = async (req, res) => {  
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).send({
        result: null,
        error: 'Missing required field: id',
      });
    }
    const { result, error } = await paymentMethodModel.get(id);
    if (error) {
      return res.status(400).send({
        result: null,
        error: `Error fetching payment method: ${error.message}`,
      });
    }
    res.status(200).send({
      result,
      error: null,
    });
  } catch (err) {
    res.status(500).send({
      result: null,
      error: `Error fetching payment method - controller level: ${err.message}`,
    });
  }
}   

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
      return res.status(400).send({
        result: null,
        error: `Error fetching payment methods: ${error.message}`,
      });
    }
    res.status(200).send({
      result,
      error: null,
    });
  } catch (err) {
    res.status(500).send({
      result: null,
      error: `Error fetching payment methods - controller level: ${err.message}`,
    });
  }
}

module.exports = {
  createPaymentMethod,
  getPaymentMethod,
  getAllPaymentMethods,
};
