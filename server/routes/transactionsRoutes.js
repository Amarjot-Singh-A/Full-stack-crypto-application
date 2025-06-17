const transactionsController = require('../controllers/transactionsController');

const express = require('express');
const router = express.Router();
const { checkAuth } = require('../services/middleware');    


/** * Route to get a single transaction by ID
 * @route GET /transactions/:id
 * @returns {Object} - Object with keys - result, error
 */
router.get('/:id', checkAuth, transactionsController.getTransaction);  

/** * Route to get all transactions
 * @route GET /transactions/
 * @returns {Object} - Object with keys - result, error
 */
router.get('/', checkAuth, transactionsController.getAllTransactions);

/** * Route to create a new transaction
 * @route POST /
 * @returns {Object} - Object with keys - result, error 
 */
router.post('/', checkAuth, transactionsController.createTransaction);


module.exports = router;