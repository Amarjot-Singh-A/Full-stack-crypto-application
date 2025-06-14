const ledgerController = require("../controllers/ledgerController");
const express = require("express");
const router = express.Router();
const {checkAuth} = require("../services/middleware");

/**
 * route - /ledger/balance
 */
router.get("/balance",checkAuth, ledgerController.getBalance);


module.exports = router;