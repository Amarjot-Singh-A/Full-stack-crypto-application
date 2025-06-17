const favouriteCoinsController = require("../controllers/favouriteCoinsController");
const express = require("express");
const router = express.Router();
const {checkAuth} = require("../services/middleware");


/**
 * Get favourite coins for the authenticated user
 * @route GET /favourite-coins
 * @returns {Object} - Object with keys - result, error
 * @throws {401} - User not authenticated or session missing
 * @throws {404} - Favourite coins not found
 * @throws {500} - Internal server error
 */
router.get("/",checkAuth, favouriteCoinsController.getFavourite);

/**
 * create a new favourite coin for the authenticated user
 * @route POST /favourite-coins
 * @param {Object} body - Object containing coinId and userId
 * @returns {Object} - Object with keys - result, error
 * @throws {400} - Missing required fields in request body
 * @throws {500} - Internal server error    
 */
router.post("/",checkAuth, favouriteCoinsController.createFavourite);


module.exports = router;