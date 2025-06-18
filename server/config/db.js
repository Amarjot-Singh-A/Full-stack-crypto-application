// Set up db connection
const mysql = require('mysql2');
const sessions = require('express-session');
const MySQLStore = require('express-mysql-session')(sessions);

const MAX_RETRIES = 10;
const RETRY_DELAY = 2000; // ms

function createConnectionWithRetry(retries = 0) {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  return new Promise((resolve, reject) => {
    connection.connect((err) => {
      if (err) {
        if (retries < MAX_RETRIES) {
          console.log(`DB connection failed. Retrying in 2s... (${retries + 1}/${MAX_RETRIES})`);
          setTimeout(() => {
            createConnectionWithRetry(retries + 1).then(resolve).catch(reject);
          }, RETRY_DELAY);
        } else {
          console.error('Could not connect to DB after retries:', err);
          reject(err);
        }
      } else {
        console.log('Connected to MySQL DB!');
        resolve(connection);
      }
    });
  });
}

let connectionPromise = createConnectionWithRetry();

const formatSqlQuery = (query, inserts) => mysql.format(query, inserts);

/**
 * A common function used to execute query using promises
 * @param {String} sqlQuery - Sql query to be executed
 * @returns {Promise} - A Promise with value of either reject or resolve
 */
const executeQuery = async (sqlQuery) => {
  const connection = await connectionPromise;
  return connection
    .promise()
    .query(sqlQuery)
    .then(([result]) => result);
};

const sessionStorePromise = connectionPromise.then(
  (connection) => new MySQLStore({}, connection.promise())
);

module.exports = {
  connectionPromise,
  sessions,
  sessionStorePromise,
  formatSqlQuery,
  executeQuery,
};
