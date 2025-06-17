// Mock db and logger
jest.mock('../config/db', () => ({
  formatSqlQuery: jest.fn((sql, inserts) => 'formatted query'),
  executeQuery: jest.fn(),
}));
jest.mock('../utils/logger'), () => ({
  error: jest.fn(),
});

const coinsModel = require('../models/coinsModel');
const db = require('../config/db');
const logger = require('../utils/logger');


describe('coinsModel', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should insert a coin and return result', async () => {
      db.executeQuery.mockResolvedValue({ insertId: 1 });
      const data = { name: 'BTC', description: 'Bitcoin', oldPrice: 100, currentPrice: 200 };
      const res = await coinsModel.create(data);
      expect(db.formatSqlQuery).toHaveBeenCalled();
      expect(db.executeQuery).toHaveBeenCalled();
      expect(res.result).toEqual({ insertId: 1 });
      expect(res.error).toBeNull();
    });

    it('should handle errors and log them', async () => {
      db.executeQuery.mockRejectedValue(new Error('DB error'));
      const data = { name: 'BTC', description: 'Bitcoin', oldPrice: 100, currentPrice: 200 };
      const res = await coinsModel.create(data);
      expect(logger.error).toHaveBeenCalled();
      expect(res.result).toEqual([]);
      expect(res.error).toBeInstanceOf(Error);
    });
  });

  describe('get', () => {
    it('should fetch a coin by id', async () => {
      db.executeQuery.mockResolvedValue([{ id: 1, name: 'BTC' }]);
      const res = await coinsModel.get(1);
      expect(res.result).toEqual([{ id: 1, name: 'BTC' }]);
      expect(res.error).toBeNull();
    });

    it('should handle errors and log them', async () => {
      db.executeQuery.mockRejectedValue(new Error('DB error'));
      const res = await coinsModel.get(1);
      expect(logger.error).toHaveBeenCalled();
      expect(res.result).toEqual([]);
      expect(res.error).toBeInstanceOf(Error);
    });
  });

  describe('getAll', () => {
    it('should fetch all coins', async () => {
      db.executeQuery.mockResolvedValue([{ id: 1, name: 'BTC' }]);
      const res = await coinsModel.getAll();
      expect(res.result).toEqual([{ id: 1, name: 'BTC' }]);
      expect(res.error).toBeNull();
    });

    it('should handle errors and log them', async () => {
      db.executeQuery.mockRejectedValue(new Error('DB error'));
      const res = await coinsModel.getAll();
      expect(logger.error).toHaveBeenCalled();
      expect(res.result).toEqual([]);
      expect(res.error).toBeInstanceOf(Error);
    });
  });

  describe('update', () => {
    it('should update a coin and return result', async () => {
      db.executeQuery.mockResolvedValue({ affectedRows: 1 });
      const data = {id:1 ,name: 'BTC', description: 'Bitcoin updated', oldPrice: 100, currentPrice: 250 };
      const res = await coinsModel.update(data);
      expect(db.formatSqlQuery).toHaveBeenCalled();
      expect(db.executeQuery).toHaveBeenCalled();
      expect(res.result).toEqual({ affectedRows: 1 });
      expect(res.error).toBeNull();
    });

    it('should handle errors and log them', async () => {
      db.executeQuery.mockRejectedValue(new Error('DB error'));
      const data = { id: 1, name: 'BTC', description: 'Bitcoin updated', oldPrice: 100, currentPrice: 250 };
      const res = await coinsModel.update(data);
      expect(logger.error).toHaveBeenCalled();
      expect(res.result).toEqual([]);
      expect(res.error).toBeInstanceOf(Error);
    });
  });
});