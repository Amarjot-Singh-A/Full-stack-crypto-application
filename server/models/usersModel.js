const {
  bcryptComparePassword,
  bcryptHashPassword,
} = require('../services/bcrypt');
const { formatSqlQuery, executeQuery } = require('../config/db');
const logger = require('../utils/logger');

/**
 * Sign up new user
 * @param {*} param0 - Object with values => {firstName:, lastName:, email:, password:}
 * @returns {Object} - Object with result and error as keys
 */
const signUp = async ({ firstName, lastName, email, password }) => {
  try {
    const hashedPassword = await bcryptHashPassword(password);
    const sql = 'INSERT INTO ?? (??,??,??,??) values (?,?,?,?)';
    const inserts = [
      'users',
      'email',
      'password',
      'firstName',
      'lastName',
      email,
      hashedPassword,
      firstName,
      lastName,
    ];
    const formattedQuery = formatSqlQuery(sql, inserts);
    const resultOfUserQuery = await executeQuery(formattedQuery);

    return { result: resultOfUserQuery, error: null };
  } catch (error) {
    logger.error('error in signUp', error);
    return { result: null, error };
  }
};

/**
 * Authenticate the user
 * @param {String} email - Email entered by user
 * @param {String} password - Password entered by user
 * @returns {Object} - On success: { isPasswordMatch: true, isEmailMatch: true, firstName: String, userId: Number }
 *                     On failure (invalid credentials or error): { isPasswordMatch: false, isEmailMatch: false, firstName: null, userId: null }
 */
const signIn = async (email, password) => {
  try {
    const sql = 'SELECT ??,??, ?? FROM ?? WHERE ?? = ?';
    const inserts = ['firstName', 'password', 'id', 'users', 'email', email];
    const formattedQuery = formatSqlQuery(sql, inserts);
    const queryResult = await executeQuery(formattedQuery);

    if (Array.isArray(queryResult) && queryResult.length > 0) {
      const isPasswordMatch = await bcryptComparePassword(
        password,
        queryResult[0].password,
      );
      return {
        isPasswordMatch,
        isEmailMatch: true,
        firstName: queryResult[0].firstName,
        userId: queryResult[0].id,
      };
    } else {
      return {
        isPasswordMatch: false,
        isEmailMatch: false,
        firstName: null,
        userId: null,
      };
    }
  } catch (error) {
    logger.error('error in signIn', error);
    return {
      isPasswordMatch: false,
      isEmailMatch: false,
      firstName: null,
      userId: null,
    };
  }
};

module.exports = {
  signIn,
  signUp,
};
