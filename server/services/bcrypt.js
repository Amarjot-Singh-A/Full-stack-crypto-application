const bcrypt = require("bcrypt");

/**
 * This function compare password entered by user with the password in the Db
 * @param {String} password - Password entered by user
 * @param {String} retrievedHash - Retreived password of user from Db
 * @returns {Promise} - Promise with reject or resolve
 */
const bcryptComparePassword = (password, retrievedHash) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, retrievedHash, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};


/**
 * Hash the password to be stored in Db
 * @param {String} password - Password in string entered by user
 * @returns {Promise} - Promise with either resolve and reject
 */
const bcryptHashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 12, async function (err, hash) {
      if (err) {
        reject(err);
      }
      resolve(hash);
    });
  });
};

module.exports = {
  bcryptComparePassword,
  bcryptHashPassword
}