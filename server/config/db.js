// Set up db connection

// Require the file
require('dotenv').config();

const mysql = require('mysql2');
const sessions = require('express-session');
const MySQLStore = require('express-mysql-session')(sessions);

// Create a connection to db
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Check for db connection error
connection.addListener('error', (err) => {
  console.error(err);
});

// configure mySql session settings
const sessionStore = new MySQLStore({}, connection.promise());

/**
 * Format sql queries
 * @param {string} query
 * @param {Array} inserts
 * @returns {string}
 */
const formatSqlQuery = (query, inserts) => mysql.format(query, inserts);

/**
 * A common function used to execute query using promises
 * @param {String} sqlQuery - Sql query to be executed
 * @returns {Promise} - A Promise with value of either reject or resolve
 */
const executeQuery = (sqlQuery) => {
  return connection
    .promise()
    .query(sqlQuery)
    .then(([result]) => result);
};

module.exports = {
  connection,
  sessions,
  sessionStore,
  formatSqlQuery,
  executeQuery,
};
