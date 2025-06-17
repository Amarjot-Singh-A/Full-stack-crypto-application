const ledgerController = require("../controllers/ledgerController");
const express = require("express");
const router = express.Router();
const {checkAuth} = require("../services/middleware");

/** 
 * Get ledger record for the authenticated user
 * @route GET /ledger/
 * @returns {Object} - Object with keys - result, error
 * @throws {401} - User not authenticated or session missing
 * @throws {404} - Ledger record not found
 * @throws {500} - Internal server error
 */
router.get("/",checkAuth, ledgerController.getLedger);

/**
 * Remove a ledger record by ID
 * @route DELETE /ledger/
 * @param {number} id - ID of the ledger record to be deleted
 * @returns {Object} - Object with keys - result, error
 * @throws {400} - Missing required field: id
 * @throws {404} - Ledger record not found
 * @throws {500} - Internal server error
 */
router.delete("/", checkAuth, ledgerController.removeLedger);

/**
 * Create a new ledger record
 * @route POST /ledger/
 * @param {{ userId: number, transactionId: number, balance: number }} body - Object containing userId, transactionId, and balance
 * @returns {Object} - Object with keys - result, error
 * @throws {400} - Missing required fields in request body
 * @throws {500} - Internal server error
 */
router.post("/", checkAuth, ledgerController.createLedger);


module.exports = router;