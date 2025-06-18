// Mock db and logger
jest.mock('../config/db', () => ({
  formatSqlQuery: jest.fn((sql, inserts) => 'formatted query'),
  executeQuery: jest.fn(),
}));
jest.mock('../utils/logger'),
  () => ({
    error: jest.fn(),
  });

const transactionsModel = require('../models/transactionsModel');
const db = require('../config/db');
const logger = require('../utils/logger');

describe('transactionsModel', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should fetch a transaction by id', async () => {
      db.executeQuery.mockResolvedValue([
        {
          id: 1,
          paymentId: 2,
          amount: 100,
          notes: 'test',
          timestamp: 1234567890,
        },
      ]);
      const res = await transactionsModel.get(1);
      expect(db.formatSqlQuery).toHaveBeenCalled();
      expect(db.executeQuery).toHaveBeenCalled();
      expect(res.result).toEqual([
        {
          id: 1,
          paymentId: 2,
          amount: 100,
          notes: 'test',
          timestamp: 1234567890,
        },
      ]);
      expect(res.error).toBeNull();
    });

    it('should handle errors and log them', async () => {
      db.executeQuery.mockRejectedValue(new Error('DB error'));
      const res = await transactionsModel.get(1);
      expect(logger.error).toHaveBeenCalled();
      expect(res.result).toBeNull();
      expect(res.error).toBeInstanceOf(Error);
    });
  });

  describe('getAll', () => {
    it('should fetch all transactions', async () => {
      db.executeQuery.mockResolvedValue([
        {
          id: 1,
          paymentId: 2,
          amount: 100,
          notes: 'test',
          timestamp: 1234567890,
        },
        {
          id: 2,
          paymentId: 3,
          amount: 200,
          notes: 'another',
          timestamp: 1234567891,
        },
      ]);
      const res = await transactionsModel.getAll();
      expect(db.formatSqlQuery).toHaveBeenCalled();
      expect(db.executeQuery).toHaveBeenCalled();
      expect(res.result).toEqual([
        {
          id: 1,
          paymentId: 2,
          amount: 100,
          notes: 'test',
          timestamp: 1234567890,
        },
        {
          id: 2,
          paymentId: 3,
          amount: 200,
          notes: 'another',
          timestamp: 1234567891,
        },
      ]);
      expect(res.error).toBeNull();
    });

    it('should handle errors and log them', async () => {
      db.executeQuery.mockRejectedValue(new Error('DB error'));
      const res = await transactionsModel.getAll();
      expect(logger.error).toHaveBeenCalled();
      expect(res.result).toBeNull();
      expect(res.error).toBeInstanceOf(Error);
    });
  });

  describe('create', () => {
    it('should insert a transaction and return result', async () => {
      db.executeQuery.mockResolvedValue({ insertId: 1 });
      const data = { paymentId: 2, amount: 100, notes: 'test' };
      const res = await transactionsModel.create(data);
      expect(db.formatSqlQuery).toHaveBeenCalled();
      expect(db.executeQuery).toHaveBeenCalled();
      expect(res.result).toEqual({ insertId: 1 });
      expect(res.error).toBeNull();
    });

    it('should handle errors and log them', async () => {
      db.executeQuery.mockRejectedValue(new Error('DB error'));
      const data = { paymentId: 2, amount: 100, notes: 'test' };
      const res = await transactionsModel.create(data);
      expect(logger.error).toHaveBeenCalled();
      expect(res.result).toBeNull();
      expect(res.error).toBeInstanceOf(Error);
    });
  });
});
