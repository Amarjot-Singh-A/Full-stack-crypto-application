const favouriteCoinsModel = require('../models/favouriteCoinsModel');
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

describe('favouriteCoinsModel', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should fetch favourite coins for a user', async () => {
      db.executeQuery.mockResolvedValue([{ coinId: 1, name: 'BTC' }]);
      const res = await favouriteCoinsModel.get('user123');
      expect(db.formatSqlQuery).toHaveBeenCalled();
      expect(db.executeQuery).toHaveBeenCalled();
      expect(res.result).toEqual([{ coinId: 1, name: 'BTC' }]);
      expect(res.error).toBeNull();
    });

    it('should handle errors and log them', async () => {
      db.executeQuery.mockRejectedValue(new Error('DB error'));
      const res = await favouriteCoinsModel.get('user123');
      expect(logger.error).toHaveBeenCalled();
      expect(res.result).toEqual([]);
      expect(res.error).toBeInstanceOf(Error);
    });
  });

  describe('create', () => {
    it('should insert a favourite coin and return result', async () => {
      db.executeQuery.mockResolvedValue({ insertId: 1 });
      const data = { coinId: 1, name: 'BTC', userId: 'user123' };
      const res = await favouriteCoinsModel.create(data);
      expect(db.formatSqlQuery).toHaveBeenCalled();
      expect(db.executeQuery).toHaveBeenCalled();
      expect(res.result).toEqual({ insertId: 1 });
      expect(res.error).toBeNull();
    });

    it('should handle errors and log them', async () => {
      db.executeQuery.mockRejectedValue(new Error('DB error'));
      const data = { coinId: 1, name: 'BTC', userId: 'user123' };
      const res = await favouriteCoinsModel.create(data);
      expect(logger.error).toHaveBeenCalled();
      expect(res.result).toEqual([]);
      expect(res.error).toBeInstanceOf(Error);
    });
  });
});