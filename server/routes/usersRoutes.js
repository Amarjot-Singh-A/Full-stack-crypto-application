const userController = require("../controllers/usersController");
const express = require("express");
const router = express.Router();

/**
 * Route - /signin
 * @summary - POST signin request of user
 */
router.post("/signin", userController.signIn);

/**
 * Route - /signup
 * @summary - POST signup request of user and add default money to account
 */
router.post("/signup", userController.signUp);

/**
 * Route - /logout
 * @summary - Destroy the user session and clear the cookie
 */
router.get("/logout", userController.logOut);

module.exports = router;
