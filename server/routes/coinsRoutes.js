const coinsController = require("../controllers/coinsController");
const express = require("express");
const router = express.Router();
const {checkAuth} = require("../services/middleware");

/** * Route to create a new coin
 * @route POST /coins
 * @param {Object} req - Request object containing coin data
 * @param {Object} res - Response object to send the result or error
 */
router.post("/", checkAuth, coinsController.create);

/** * Route to get a single coin by ID
 * @route GET /coins/:id
 * @param {Object} req - Request object containing coin ID
 * @param {Object} res - Response object to send the result or error
 */
router.get("/:id", checkAuth, coinsController.get); 

/** * Route to get all coins
 * @route GET /coins  
 * @param {Object} req - Request object
 * @param {Object} res - Response object to send the result or error
 */
router.get("/", checkAuth, coinsController.getAll); 

/** * Route to update a coin by ID
 * @route PUT /coins/:id 
 * @param {Object} req - Request object containing coin data
 * @param {Object} res - Response object to send the result or error
 */
router.put("/:id", checkAuth, coinsController.update);

module.exports = router;
