const paymentMethodModel = require('../models/paymentMethodModel');
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

describe('paymentMethodModel', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should insert a payment method and return result', async () => {
      db.executeQuery.mockResolvedValue({ insertId: 1 });
      const data = { type: 'card', name: 'Visa' };
      const res = await paymentMethodModel.create(data);
      expect(db.formatSqlQuery).toHaveBeenCalled();
      expect(db.executeQuery).toHaveBeenCalled();
      expect(res.result).toEqual({ insertId: 1 });
      expect(res.error).toBeNull();
    });

    it('should handle errors and log them', async () => {
      db.executeQuery.mockRejectedValue(new Error('DB error'));
      const data = { type: 'card', name: 'Visa' };
      const res = await paymentMethodModel.create(data);
      expect(logger.error).toHaveBeenCalled();
      expect(res.result).toBeNull();
      expect(res.error).toBeInstanceOf(Error);
    });
  });

  describe('get', () => {
    it('should fetch a payment method by id', async () => {
      db.executeQuery.mockResolvedValue([{ id: 1, type: 'card', name: 'Visa' }]);
      const res = await paymentMethodModel.get(1);
      expect(db.formatSqlQuery).toHaveBeenCalled();
      expect(db.executeQuery).toHaveBeenCalled();
      expect(res.result).toEqual([{ id: 1, type: 'card', name: 'Visa' }]);
      expect(res.error).toBeNull();
    });

    it('should handle errors and log them', async () => {
      db.executeQuery.mockRejectedValue(new Error('DB error'));
      const res = await paymentMethodModel.get(1);
      expect(logger.error).toHaveBeenCalled();
      expect(res.result).toBeNull();
      expect(res.error).toBeInstanceOf(Error);
    });
  });

  describe('getAll', () => {
    it('should fetch all payment methods', async () => {
      db.executeQuery.mockResolvedValue([
        { id: 1, type: 'card', name: 'Visa' },
        { id: 2, type: 'bank', name: 'Chase' }
      ]);
      const res = await paymentMethodModel.getAll();
      expect(db.formatSqlQuery).toHaveBeenCalled();
      expect(db.executeQuery).toHaveBeenCalled();
      expect(res.result).toEqual([
        { id: 1, type: 'card', name: 'Visa' },
        { id: 2, type: 'bank', name: 'Chase' }
      ]);
      expect(res.error).toBeNull();
    });

    it('should handle errors and log them', async () => {
      db.executeQuery.mockRejectedValue(new Error('DB error'));
      const res = await paymentMethodModel.getAll();
      expect(logger.error).toHaveBeenCalled();
      expect(res.result).toBeNull();
      expect(res.error).toBeInstanceOf(Error);
    });
  });
});
