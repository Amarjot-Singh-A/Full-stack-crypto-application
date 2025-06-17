// Mock db and logger
jest.mock('../config/db', () => ({
  formatSqlQuery: jest.fn((sql, inserts) => 'formatted query'),
  executeQuery: jest.fn(),
}));
jest.mock('../utils/logger'), () => ({
  error: jest.fn(),
});


const holdingsModel = require('../models/holdingsModel');
const db = require('../config/db');
const logger = require('../utils/logger');


describe('holdingsModel', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should fetch holdings for a user', async () => {
      db.executeQuery.mockResolvedValue([{ id: 1, coinId: 2, quantity: 5, userId: 'user123' }]);
      const res = await holdingsModel.get('user123');
      expect(db.formatSqlQuery).toHaveBeenCalled();
      expect(db.executeQuery).toHaveBeenCalled();
      expect(res.result).toEqual([{ id: 1, coinId: 2, quantity: 5, userId: 'user123' }]);
      expect(res.error).toBeNull();
    });

    it('should handle errors and log them', async () => {
      db.executeQuery.mockRejectedValue(new Error('DB error'));
      const res = await holdingsModel.get('user123');
      expect(logger.error).toHaveBeenCalled();
      expect(res.result).toEqual([]);
      expect(res.error).toBeInstanceOf(Error);
    });
  });

  describe('create', () => {
    it('should insert a holding and return result', async () => {
      db.executeQuery.mockResolvedValue({ insertId: 1 });
      const data = { userId: 'user123', coinId: 2, quantity: 5 };
      const res = await holdingsModel.create(data);
      expect(db.formatSqlQuery).toHaveBeenCalled();
      expect(db.executeQuery).toHaveBeenCalled();
      expect(res.result).toEqual({ insertId: 1 });
      expect(res.error).toBeNull();
    });

    it('should handle errors and log them', async () => {
      db.executeQuery.mockRejectedValue(new Error('DB error'));
      const data = { userId: 'user123', coinId: 2, quantity: 5 };
      const res = await holdingsModel.create(data);
      expect(logger.error).toHaveBeenCalled();
      expect(res.result).toEqual([]);
      expect(res.error).toBeInstanceOf(Error);
    });
  });

  describe('remove', () => {
    it('should delete a holding and return result', async () => {
      db.executeQuery.mockResolvedValue({ affectedRows: 1 });
      const res = await holdingsModel.remove(1);
      expect(db.formatSqlQuery).toHaveBeenCalled();
      expect(db.executeQuery).toHaveBeenCalled();
      expect(res.result).toEqual({ affectedRows: 1 });
      expect(res.error).toBeNull();
    });

    it('should handle errors and log them', async () => {
      db.executeQuery.mockRejectedValue(new Error('DB error'));
      const res = await holdingsModel.remove(1);
      expect(logger.error).toHaveBeenCalled();
      expect(res.result).toEqual([]);
      expect(res.error).toBeInstanceOf(Error);
    });
  });
});