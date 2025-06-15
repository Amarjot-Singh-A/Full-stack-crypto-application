const coinsController = require("../controllers/coinsController");
const express = require("express");
const router = express.Router();
const {checkAuth} = require("../services/middleware");

/**
 * Route - coins/buy
 * @summary - POST signup request of user and add default money to account
 */
router.post("/buy",checkAuth, coinsController.buy);


module.exports = router;
