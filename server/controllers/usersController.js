const { Logger, log } = require('winston');
const usersModel = require('../models/usersModel');
const logger = require('../utils/logger');

/**
 * Handle business logic related to signing in a user
 * @param {*} req
 * @param {*} res
 * @returns {Object} - Object with keys loggedIn and error
 *                      loggedIn: true if user is successfully signed in, false otherwise
 *                      error: empty string if no error, otherwise contains error message
 */
const signIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    logger.error('email or password not provided');
    return res.status(400).send({
      loggedIn: false,
      error: 'email or password not provided',
    });
  }

  try {
    const { isPasswordMatch, isEmailMatch, firstName, userId } =
      await usersModel.signIn(email, password);

    if (isPasswordMatch === true && isEmailMatch === true) {
      req.session.userName = firstName;
      req.session.isLogged = true;
      req.session.email = email;
      req.session.userId = userId;
      logger.info(`User signed in successfully: userId=${userId}, email=${email}`);
      res.status(200).send({
        loggedIn: true,
        error: '',
      });
    } else {
      logger.warn('email or password doesnt match', {
        email,
      });
      res.status(401).send({
        loggedIn: false,
        error: 'email or password doesnt match',
      });
    }
  } catch (error) {
    logger.error('Error in controller while signing in: ', error);
    res.status(500).send({
      loggedIn: false,
      error: `Error in controller while signing up: ${error.message}`,
    });
  }
};

/**
 * Handle business logic related to signing up a user
 * @param {*} req
 * @param {*} res
 * @returns {Object} - Object with keys loggedIn and error
 *                      loggedIn: true if user is successfully signed up, false otherwise
 *                      error: empty string if no error, otherwise contains error message
 */
const signUp = async (req, res) => {
  if (!req.body) {
    logger.error('No data in request body');
    return res.status(500).send({
      loggedIn: false,
      error: 'No data in request body',
    });
  }

  try {
    const { result, error } = await usersModel.signUp(req.body);
    if (result == null && error) {
      logger.error('Error in model while signing up: ', error);
      return res.status(401).send({
        loggedIn: false,
        error,
      });
    } else {
      logger.info('User signed up successfully', result);
      res.status(200).send({
        loggedIn: true,
        error: '',
      });
    }
  } catch (error) {
    logger.error('Error in controller while signing in: ', error);
    res.status(500).send({
      loggedIn: false,
      error: `Error in controller while signing in: ${error.message}`,
    });
  }
};

/**
 * Handle business logic related to logging out a user
 * @param {*} req
 * @param {*} res
 * @returns {Object} - Object with keys isLogged and error
 *                      isLogged: false if user is successfully logged out, true otherwise
 *                      error: empty string if no error, otherwise contains error message
 */
const logOut = (req, res) => {
  if (!req.session || !req.session.isLogged) {
    logger.warn('session doesnt exist');
    return res.status(500).send({
      isLogged: false,
      error: 'session doesnt exist',
    });
  }

  console.log('session before destroy-> ', req.session);
  req.session.destroy((error) => {
    if (error) {
      logger.error('Error logging out user: ', error);
      return res.status(500).send({
        isLogged: true,
        error: `error logging out: ${error.message}`,
      });
    }
    // clear the cookie
    return res
      .clearCookie(process.env.SESSION_COOKIE_NAME, {
        secure: false,
        path: '/',
        httpOnly: true,
      })
      .status(200)
      .send({
        isLogged: false,
        error: '',
      });
  });
};

module.exports = {
  signIn,
  signUp,
  logOut,
};
