const usersModel = require("../models/usersModel");

/**
 * Hanlde logic related to signing in of a user
 * @param {Object} req
 * @param {Object} res
 */
const signIn = async (req, res) => {
  const formEmail = req.body.email || "";
  const formPassword = req.body.password || "";

  if (formEmail && formPassword) {
    const { isPasswordMatch, isEmailMatch, firstName , userId} =
      await usersModel.signIn(formEmail, formPassword);
    if (isPasswordMatch === true && isEmailMatch === true) {
      req.session.userName = firstName;
      req.session.isLogged = true;
      req.session.email = formEmail;
      req.session.userId = userId
      console.log("password matched & session signin-> ", req.session);
      res.status(200).send({
        loggedIn: true,
        error: "",
      });
    } else {
      console.log("email or password doesnt match");
      res.status(401).send({
        loggedIn: false,
        error: "email or password doesnt match",
      });
    }
  }
};

/**
 * Hanlde business logic related to signing up a user
 * @param {Object} req
 * @param {Object} res
 */
const signUp = async (req, res) => {
  if (req.body) {
    try {
      const { result, err } = await usersModel.signUp(req.body);

      if (result == null && err) {
        let error = helper.mysqlErrorCodes(err);
        console.log(error);
        res.status(403).send({
          loggedIn: false,
          error: error,
        });
      } else {
        console.log("sign up query executed", result);
        // const { resultMoney, errorMoney } = await helper.addDefaultMoney(
        //   connection,
        //   result,
        //   req.body.email
        // );
        // if ((resultMoney == null) & errorMoney) {
        //   console.log(errorMoney);
        //   res.status(403).send({
        //     loggedIn: false,
        //     error: error,
        //   });
        // } else {
        //   console.log("default money query executed", resultMoney);
        //   req.session.userId = req.body.firstName;
        //   req.session.isLogged = true;
        //   req.session.email = req.body.email;
        //   res.status(200).send({
        //     loggedIn: true,
        //     error: "",
        //   });
        // }
      }
    } catch (err) {
      console.error("error in signing up user");
    }
  } else {
    res.status(500).send({
      loggedIn: false,
      error: "No data recieved from the form",
    });
  }
};


// todo - if addDefaultMoney fails, fail the user signup
/**
 * Add default money into user account, when user is created
 * @param {mysql.Connection} connection - Db connection Object
 * @param {Object} resultOfUserQuery - Result of user insert query
 * @param {String} email - Email of the user
 * @returns {Object} - Object with resultMoney and errorMoney as keys
 */
const addDefaultMoney = async (connection, resultOfUserQuery, email) => {
  try {
    if (resultOfUserQuery.insertId) {
      let sql = "INSERT INTO ?? (??,??,??) values (?,?,?)";
      let inserts = [
        "balance",
        "userid",
        "email",
        "balance",
        resultOfUserQuery.insertId,
        email,
        50000.0,
      ];
      let formattedQuery = formatSqlQuery(sql, inserts);
      let resultOfBalanceQuery = await executeQuery(connection, formattedQuery);

      return { resultMoney: resultOfBalanceQuery, errorMoney: null };
    } else {
      throw new Error("insertId empty in addDefaultMoney");
    }
  } catch (e) {
    console.error("error in adddefaultmoney", e);
    return { resultMoney: null, errorMoney: e };
  }
};




// todo - fix this
/**
 * General error codes related to mysql
 * @param {*} param0 - Object containing error number ({ errno })
 * @returns {String} - String describing the error
 */
const mysqlErrorCodes = ({ errno }) => {
  switch (errno) {
    case 1062:
      return "user with email already exist";

    default:
      return "Error while creating user";
  }
};




/**
 * Handle logic related to logging out a user
 * @param {Object} req
 * @param {Object} res
 */
const logOut = (req, res) => {
  if (req.session.isLogged) {
    req.session.destroy((err) => {
      console.log("/logout inside-> ", req.session);

      if (err) {
        console.error("failed to log user out");
        res.status(500).send({
          isLogged: true,
          error: `erorr logging out`,
        });
      }
      req.session = null;
      console.log("user logged out");
      return res
        .clearCookie("connect.sid", {
          secure: false,
          path: "/",
          httpOnly: true,
        })
        .status(200)
        .send({
          isLogged: false,
          error: "",
        });
    });
  } else {
    res.status(500).send({
      isLogged: false,
      error: "session doesnt exist",
    });
    console.log("user is not logged in");
  }
};

module.exports = {
  signIn,
  signUp,
  logOut,
};
