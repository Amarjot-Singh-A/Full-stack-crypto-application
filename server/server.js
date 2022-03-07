/****************************************************************************************
 * This file contains the configuration of back-end framework (Express)
 * Contains different modules used by the Express
 * List all the Route used by the Express
 * List the Middleware used for Routes
 ****************************************************************************************/

// Require the file
require("dotenv").config();

// Assign objects and variables
const mysql = require("mysql");
const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const app = express();
const sessions = require("express-session");
const MySQLStore = require("express-mysql-session")(sessions);
const port = process.env.PORT || 5000;
const helper = require("./lib/helper_functions");
const e = require("express");
const oneDay = 1000 * 60 * 60 * 24;

// express uses cors 
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// express uses URL encode
app.use(
  express.urlencoded({
    extended: true,
  })
);

// express uses json format
app.use(express.json());

// app.set('trust proxy', 1)

// create a mySql connection Object with values from .env file
let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB,
});

// create a connection to Db
connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

// configure mySql session settings
const sessionStore = new MySQLStore(
  {
    clearExpired: true,
    checkExpirationInterval: 60000,
  },
  connection,
  (err) => {
    if (err) {
      console.error("error creating mysqlstore");
    }
  }
);

// configure express
app.use(
  sessions({
    secret: process.env.SECRET,
    saveUninitialized: false,
    store: sessionStore,
    cookie: { maxAge: oneDay , sameSite : "lax"},
    resave: false,
  })
);

// check if express is listening to port
app.listen(port, () => console.log(`Listening to port ${port}`));

/**
 * Middleware to check the user is authenticated for every request
 * @param {Object} req - Request Object
 * @param {Object} res - Response Object
 * @param {*} next - Callback function to run once the middleware is successfull
 * @returns 
 */
const checkAuth = (req, res, next) => {
  if (!req.session.isLogged && !req.session.userId && !req.session.email) {
    res.redirect("/signin");
    return;
  }
  next();
};

/**
 * Route - /favourite
 * @summary GET favourite coins of a user 
 */
app.get("/favourite", checkAuth, async (req, res) => {
  try {
    let fetchedCoinsArr = await helper.getCoinsDb(
      connection,
      req.session.email
    );
    console.log("fetchedCoinsArr", fetchedCoinsArr);
    if (fetchedCoinsArr[0].coins) {
      res.status(200).send({
        coins: fetchedCoinsArr,
        error: "",
      });
    } else {
      res.status(200).send({
        coins: fetchedCoinsArr[0].coins,
        error: "user have no favourite coins",
      });
    }
  } catch (err) {
    res.status(400).send({
      coins: fetchedCoinsArr[0].coins,
      error: "user have no favourite coins",
    });
  }
});

/**
 * Route - /favourite 
 * @summary - POST favourite coin by a user
 */
app.post("/favourite", checkAuth, async (req, res) => {
  let resultOfCoinsQuery = await helper.insertCoinsDb(connection, req);
  if (Object.keys(resultOfCoinsQuery).length > 0) {
    res.status(200).send({
      inserted: true,
      error: "",
    });
  } else {
    res.status(403).send({
      inserted: false,
      error: "error inserting coins",
    });
  }
});

/**
 * Route - /express
 * @summary Check whether the user is authenticated or not
 */
app.get("/express", checkAuth, (req, res) => {
  console.log("/express ->", req.session);
  res.status(200).send({
    express: `welcome ${req.session.userId}`,
  });
});

/**
 * Route - /balance
 * @summary - GET user account balance
 */
app.get("/balance", checkAuth, async (req, res) => {
  const { balance, error } = await helper.getUserBalance(
    connection,
    req.session.email
  );
  if (balance == null && error) {
    res.status(404).send({
      retrieved: false,
      error,
      balance: null,
    });
  } else {
    res.status(200).send({
      retrieved: true,
      error: null,
      balance,
    });
  }
});

/**
 * Route - /signin
 * @summary - POST signin request of user
 */
app.post("/signin", async (req, res) => {
  console.log("/signin body ->", req.body);
  const formEmail = req.body.email || "";
  const formPassword = req.body.password || "";

  if (formEmail && formPassword) {
    const { isPasswordMatch, isEmailMatch, firstName } =
      await helper.verifySignIn(connection, bcrypt, formEmail, formPassword);
    if (isPasswordMatch === true && isEmailMatch === true) {
      req.session.userId = firstName;
      req.session.isLogged = true;
      req.session.email = formEmail;
      console.log("session signin-> ", req.session);

      console.log("password matched");
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
});

/**
 * Route - /signup
 * @summary - POST signup request of user and add default money to account
 */
app.post("/signup", async (req, res) => {
  if (req.body) {
    try {
      const { result, err } = await helper.signUpUser(
        req.body,
        connection,
        bcrypt
      );

      if (result == null && err) {
        let error = helper.mysqlErrorCodes(err);
        console.log(error);
        res.status(403).send({
          loggedIn: false,
          error: error,
        });
      } else {
        console.log("sign up query executed", result);
        const { resultMoney, errorMoney } = await helper.addDefaultMoney(
          connection,
          result,
          req.body.email
        );
        if ((resultMoney == null) & errorMoney) {
          console.log(errorMoney);
          res.status(403).send({
            loggedIn: false,
            error: error,
          });
        } else {
          console.log("default money query executed", resultMoney);
          req.session.userId = req.body.firstName;
          req.session.isLogged = true;
          req.session.email = req.body.email;
          res.status(200).send({
            loggedIn: true,
            error: "",
          });
        }
      }
    } catch (err) {
      console.error("error in /signup");
    }
  } else {
    res.status(500).send({
      loggedIn: false,
      error: "No data recieved from the form",
    });
  }
});

/**
 * Route - /logout
 * @summary - Destroy the user session and clear the cookie 
 */
app.get("/logout", (req, res) => {
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
});

/**
 * Route - /buy
 * @summary - POST request to buy crypto
 */
app.post("/buy", checkAuth, async (req, res) => {
  console.log("buy -> ", req.body);
  let { result, completed, error } = await helper.cryptoBuyAction(
    connection,
    req
  );
  if (completed) {
    res.status(200).send({
      result,
      error,
      completed,
    });
  } else if (completed === false && result) {
    res.status(403).send({
      result,
      error,
      completed,
    });
  } else {
    res.status(403).send({
      result,
      error,
      completed,
    });
  }
});

/**
 * Route - /portfolio
 * @summary - GET Transactions of an user
 */
app.get("/portfolio", checkAuth, async (req, res) => {
  try {
    let result = await helper.fetchUserTrans(connection, req.session.email);
    console.log("get portfolio->", result);
    if (result.error) {
      res.status(403).send({
        result: result.result,
        error: error,
        completed: false,
      });
    } else {
      res.status(200).send({
        result: result.result,
        error: result.error,
        completed: true,
      });
    }
  } catch (e) {
    console.error("error inside get portfolio", e);
    res.status(403).send({
      result: null,
      error: e,
      completed: false,
    });
  }
});
