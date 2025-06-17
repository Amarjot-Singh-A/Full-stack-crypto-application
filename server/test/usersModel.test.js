// Mock db, logger, and bcrypt
jest.mock('../config/db', () => ({
  formatSqlQuery: jest.fn((sql, inserts) => 'formatted query'),
  executeQuery: jest.fn(),
}));
jest.mock('../utils/logger', () => ({
  error: jest.fn(),
}));
jest.mock('../services/bcrypt', () => ({
  bcryptHashPassword: jest.fn(),
  bcryptComparePassword: jest.fn(),
}));

const usersModel = require('../models/usersModel');
const db = require('../config/db');
const logger = require('../utils/logger');
const bcrypt = require('../services/bcrypt');

describe('usersModel', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('should hash password, insert user, and return result', async () => {
      bcrypt.bcryptHashPassword.mockResolvedValue('hashedpass');
      db.executeQuery.mockResolvedValue({ insertId: 1 });
      const data = { firstName: 'John', lastName: 'Doe', email: 'john@example.com', password: 'pass123' };
      const res = await usersModel.signUp(data);
      expect(bcrypt.bcryptHashPassword).toHaveBeenCalledWith('pass123');
      expect(db.formatSqlQuery).toHaveBeenCalled();
      expect(db.executeQuery).toHaveBeenCalled();
      expect(res.result).toEqual({ insertId: 1 });
      expect(res.error).toBeNull();
    });

    it('should handle errors and log them', async () => {
      bcrypt.bcryptHashPassword.mockRejectedValue(new Error('Hash error'));
      const data = { firstName: 'John', lastName: 'Doe', email: 'john@example.com', password: 'pass123' };
      const res = await usersModel.signUp(data);
      expect(logger.error).toHaveBeenCalled();
      expect(res.result).toBeNull();
      expect(res.error).toBeInstanceOf(Error);
    });
  });

  describe('signIn', () => {
    it('should authenticate user and return success object', async () => {
      db.executeQuery.mockResolvedValue([{ firstName: 'John', password: 'hashedpass', id: 10 }]);
      bcrypt.bcryptComparePassword.mockResolvedValue(true);
      const res = await usersModel.signIn('john@example.com', 'pass123');
      expect(db.formatSqlQuery).toHaveBeenCalled();
      expect(db.executeQuery).toHaveBeenCalled();
      expect(bcrypt.bcryptComparePassword).toHaveBeenCalledWith('pass123', 'hashedpass');
      expect(res).toEqual({
        isPasswordMatch: true,
        isEmailMatch: true,
        firstName: 'John',
        userId: 10
      });
    });

    it('should return isEmailMatch false if user not found', async () => {
      db.executeQuery.mockResolvedValue([]);
      const res = await usersModel.signIn('john@example.com', 'pass123');
      expect(res).toEqual({
        isPasswordMatch: false,
        isEmailMatch: false,
        firstName: null,
        userId: null
      });
    });

    it('should handle errors and log them', async () => {
      db.executeQuery.mockRejectedValue(new Error('DB error'));
      const res = await usersModel.signIn('john@example.com', 'pass123');
      expect(logger.error).toHaveBeenCalled();
      expect(res).toEqual({
        isPasswordMatch: false,
        isEmailMatch: false,
        firstName: null,
        userId: null
      });
    });
  });
});