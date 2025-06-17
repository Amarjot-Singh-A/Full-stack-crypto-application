const ledgerModel = require("../models/ledgerModel");

/**
 * Fetch record from ledger table
 * @param {Object} req
 * @param {Object} res
 */
const getLedger = async (req, res) => {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(401).send({
        result: null,
        error: "User not authenticated or session missing",
      });
    }
    const { result, error } = await ledgerModel.get(req.session.userId);
    console.log("getLedger result =>", result);
    if (result == null && error) {
      res.status(404).send({
        result,
        error,
      });
    } else {
      res.status(200).send({
        result,
        error,
      });
    }
  } catch (err) {
    res.status(500).send({
      result: null,
      error: `Error fetching balance - controller level: ${err.message}`,
    });
  }
};

/**
 * Remove a record from ledger table
 * @param {*} req
 * @param {*} res
 * @returns {Object} - Object with keys - result, error
 */
const removeLedger = async (req, res) => {
  try {
    if (!req.body.id) {
      return res.status(400).send({
        result: null,
        error: "Missing required field: id",
      });
    }
    const { result, error } = await ledgerModel.remove(req.body.id);
    if (result == null && error) {
      res.status(404).send({
        result,
        error,
      });
    } else {
      res.status(200).send({
        result,
        error,
      });
    }
  } catch (err) {
    res.status(500).send({
      result: null,
      error: `Error deleting ledger record - controller level: ${err.message}`,
    });
  }
};

/**
 * Create a new ledger record
 * This function creates a new ledger record by deducting the specified amount from the user's balance.
 * It checks if the user is authenticated, validates the request body, fetches the user's ledger records,
 * and ensures that the last record's balance is sufficient before creating a new transaction and ledger record.
 * @param {*} req - Request object containing user session and body with paymentId, amount, and notes
 * @param {*} res 
 * @returns {Object} - Object with keys - result, error
 * @throws {Error} - Throws an error if any step fails, including insufficient balance or missing fields.
 */
const createLedger = async (req, res) => {
  try {
    // Validate session and request body
    if (!req.session || !req.session.userId) {
      return res.status(401).send({
        result: null,
        error: "User not authenticated or session missing",
      });
    }
    if (
      !req.body ||
      !req.body.paymentId ||
      (!req.body.amount || req.body.amount <= 0 )||
      !req.body.notes
    ) {
      return res.status(400).send({
        result: null,
        error: "Missing required fields: paymentId, amount, or notes",
      });
    }
    // Extract paymentId, amount, and notes from request body
    const { paymentId, amount, notes } = req.body;
    const userId = req.session.userId;

    // Fetch the user's ledger records
    const getLedgerRecords = await ledgerModel.get(userId);
    if (getLedgerRecords.error) {
      return res.status(500).send({
        result: null,
        error: `Error fetching ledger records: ${getLedgerRecords.error.message}`,
      });
    }
    if (getLedgerRecords.result.length === 0) {
      return res.status(404).send({
        result: null,
        error: "No ledger records found for the user",
      });
    }
    // Sort getledgerRecords by id or timestamp
    getLedgerRecords.result.sort((a, b) => a.id - b.id);
    // Check if the last record's balance is sufficient
    const lastRecord =
      getLedgerRecords.result[getLedgerRecords.result.length - 1];
    if (lastRecord.balance < amount) {
      return res.status(400).send({
        result: null,
        error: "Insufficient balance in ledger",
      });
    }
    // Deduct the amount from the last record's balance
    const newBalance = lastRecord.balance - amount;
    console.log("New balance after deduction:", newBalance);

    // Create a transaction record with payment id provided in body
    const transactionId = await ledgerModel.createTransaction({
      paymentId,
      amount,
      notes,
    });
    if (transactionId.error) {
      return res.status(500).send({
        result: null,
        error: `Error creating transaction record: ${transactionId.error.message}`,
      });
    }
    console.log("Transaction ID created:", transactionId.result.id);

    // Create a new ledger record with the new balance and transaction ID
    if (paymentId != 11 || paymentId != 22) {
      // Assuming 11 and 22 are cash deposit or withdrawal IDs

      const { result, error } = await ledgerModel.create({
        userId: userId,
        transactionId: transactionId.result.id,
        balance: newBalance,
      });
      console.log("createLedger result =>", result);
      if (result == null && error) {
        res.status(404).send({
          result,
          error,
        });
      } else {
        res.status(201).send({
          result,
          error,
        });
      }
    } else {
      console.log(
        "Payment ID is for cash deposit or withdrawal, skipping ledger record creation."
      );
      res.status(200).send({
        result: {
          message:
            "Payment ID is for cash deposit or withdrawal, no ledger record created.",
        },
        error: null,
      });
    }
  } catch (err) {
    res.status(500).send({
      result: null,
      error: `Error creating ledger record - controller level: ${err.message}`,
    });
  }
};

module.exports = {
  getLedger,
  removeLedger,
  createLedger,
};
