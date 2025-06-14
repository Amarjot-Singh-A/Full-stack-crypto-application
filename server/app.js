/****************************************************************************************
 * This file contains the configuration of back-end framework (Express)
 * Contains different modules used by the Express
 * List all the Route used by the Express
 * List the Middleware used for Routes
 ****************************************************************************************/

// Require the file
require("dotenv").config();

// Require and constants
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const cors = require("cors");
const {connection, sessions, sessionStore} = require("./config/db");
const helper = require("./lib/helper_functions");
const { checkAuth } = require("./services/middleware");
const ONE_DAY = 1000 * 60 * 60 * 24;

const usersRoutes = require("./routes/usersRoutes");
const coinsRoutes = require("./routes/coinsRoutes");
const ledgerRoutes = require("./routes/ledgerRoutes");

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

// configure express
app.use(
  sessions({
    key: "session_cookie_name",
    secret: process.env.SECRET,
    store: sessionStore,
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: ONE_DAY, sameSite: "lax" },
  })
);


// signUp, signIn. logOut
app.use("/users", usersRoutes);


app.use("/coins", coinsRoutes);


app.use("/ledger", ledgerRoutes);



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

module.exports = app;
