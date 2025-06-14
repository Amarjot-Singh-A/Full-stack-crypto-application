const {
  bcryptComparePassword,
  bcryptHashPassword,
} = require("../services/bcrypt");
const { formatSqlQuery, executeQuery } = require("../config/db");

/**
 * Sign up new user
 * @param {*} param0 - Object with values => {firstname :, lastName:, email:, password:,}
 * @returns {Object} - Object with result and err as keys
 */
const signUp = async ({ firstName, lastName, email, password }) => {
  try {
    const hashedPassword = await bcryptHashPassword(password);
    const sql = "INSERT INTO ?? (??,??,??,??) values (?,?,?,?)";
    const inserts = [
      "users",
      "email",
      "password",
      "firstName",
      "lastName",
      email,
      hashedPassword,
      firstName,
      lastName,
    ];
    const formattedQuery = formatSqlQuery(sql, inserts);
    const resultOfUserQuery = await executeQuery(formattedQuery);

    return { result: resultOfUserQuery, err: null };
  } catch (err) {
    console.error("error in signUp", err);
    return { result: null, err };
  }
};

/**
 * Authenticate the user
 * @param {String} email - Email entered by user
 * @param {String} password - Password entered by user
 * @returns {Object} - Object with keys isPasswordMatch and isEmailMatch. additional key firstName on success
 */
const signIn = async (email, password) => {
  try {
    const sql = "SELECT ??,??, ?? FROM ?? WHERE ?? = ?";
    const inserts = ["firstName", "password","id", "users", "email", email];
    const formattedQuery = formatSqlQuery(sql, inserts);
    const queryResult = await executeQuery(formattedQuery);

    if (Object.keys(queryResult).length > 0) {
      const isPasswordMatch = await bcryptComparePassword(
        password,
        queryResult[0].password
      );
      return {
        isPasswordMatch: isPasswordMatch,
        isEmailMatch: true,
        firstName: queryResult[0].firstName,
        userId : queryResult[0].id
      };
    } else {
      return { 
        isPasswordMatch: false, 
        isEmailMatch: false,
        firstName: null,
        userId: null
     };
    }
  } catch (err) {
    console.error("error in signIn", err);
  }
};

module.exports = {
    signIn,
    signUp
}