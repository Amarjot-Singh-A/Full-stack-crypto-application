const coinsController = require("../controllers/coinsController");
const express = require("express");
const router = express.Router();
const {checkAuth} = require("../services/middleware");
/**
 * Route - coins/favourite
 * @summary - POST signin request of user
 */
router.get("/favourite",checkAuth, coinsController.getFavourite);
router.post("/favourite",checkAuth, coinsController.postFavourite);

/**
 * Route - coins/buy
 * @summary - POST signup request of user and add default money to account
 */
router.post("/buy",checkAuth, coinsController.buy);


module.exports = router;
