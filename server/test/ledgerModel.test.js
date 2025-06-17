const ledgerModel = require('../models/ledgerModel');
const db = require('../config/db');
const logger = require('../services/logger');

// Mock db and logger
jest.mock('../config/db', () => ({
  formatSqlQuery: jest.fn((sql, inserts) => 'formatted query'),
  executeQuery: jest.fn(),
}));
jest.mock('../services/logger', () => ({
  error: jest.fn(),
}));

describe('ledgerModel', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should insert a ledger record and return result', async () => {
      db.executeQuery.mockResolvedValue({ insertId: 1 });
      const data = { userId: 'user123', transactionId: 'txn456', balance: 1000 };
      const res = await ledgerModel.create(data);
      expect(db.formatSqlQuery).toHaveBeenCalled();
      expect(db.executeQuery).toHaveBeenCalled();
      expect(res.result).toEqual({ insertId: 1 });
      expect(res.error).toBeNull();
    });

    it('should handle errors and log them', async () => {
      db.executeQuery.mockRejectedValue(new Error('DB error'));
      const data = { userId: 'user123', transactionId: 'txn456', balance: 1000 };
      const res = await ledgerModel.create(data);
      expect(logger.error).toHaveBeenCalled();
      expect(res.result).toBeNull();
      expect(res.error).toBeInstanceOf(Error);
    });
  });

  describe('get', () => {
    it('should fetch ledger records for a user', async () => {
      db.executeQuery.mockResolvedValue([
        { userId: 'user123', transactionId: 'txn456', balance: 1000 }
      ]);
      const res = await ledgerModel.get('user123');
      expect(db.formatSqlQuery).toHaveBeenCalled();
      expect(db.executeQuery).toHaveBeenCalled();
      expect(res.result).toEqual([
        { userId: 'user123', transactionId: 'txn456', balance: 1000 }
      ]);
      expect(res.error).toBeNull();
    });

    it('should handle errors and log them', async () => {
      db.executeQuery.mockRejectedValue(new Error('DB error'));
      const res = await ledgerModel.get('user123');
      expect(logger.error).toHaveBeenCalled();
      expect(res.result).toBeNull();
      expect(res.error).toBeInstanceOf(Error);
    });
  })

  describe('remove', () => {
    it('should delete a ledger record and return result', async () => {
      db.executeQuery.mockResolvedValue({ affectedRows: 1 });
      const res = await ledgerModel.remove(1);
      expect(db.formatSqlQuery).toHaveBeenCalled();
      expect(db.executeQuery).toHaveBeenCalled();
      expect(res.result).toEqual({ affectedRows: 1 });
      expect(res.error).toBeNull();
    });

    it('should handle errors and log them', async () => {
      db.executeQuery.mockRejectedValue(new Error('DB error'));
      const res = await ledgerModel.remove(1);
      expect(logger.error).toHaveBeenCalled();
      expect(res.result).toBeNull();
      expect(res.error).toBeInstanceOf(Error);
    });
  });
});