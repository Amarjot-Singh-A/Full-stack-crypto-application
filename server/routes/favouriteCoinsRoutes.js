const favouriteCoinsController = require("../controllers/favouriteCoinsController");
const express = require("express");
const router = express.Router();
const {checkAuth} = require("../services/middleware");



router.get("/",checkAuth, favouriteCoinsController.getFavourite);
router.post("/",checkAuth, favouriteCoinsController.postFavourite);


module.exports = router;
