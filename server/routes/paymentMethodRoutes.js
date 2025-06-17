const paymentMethodController = require('../controllers/paymentMethodController');
const express = require('express');
const router = express.Router();
const { checkAuth } = require('../services/middleware');    


/**
 * Route to create a new payment method
 * @route POST /payment-method/
 * @returns {Object} - Object with keys - result, error
 */
router.post('/', checkAuth, paymentMethodController.createPaymentMethod); 

/** * Route to get a payment method by ID
 * @route POST /payment-method/:id
 * @returns {Object} - Object with keys - result, error
 */
router.get('/:id', checkAuth, paymentMethodController.getPaymentMethod);

/**
 * Route to get all payment methods
 * @route GET /payment-method/
 * @returns {Object} - Object with keys - result, error
 */
router.get('/', checkAuth, paymentMethodController.getAllPaymentMethods);    

module.exports = router;