require("dotenv").config();
const mysql = require("mysql");
const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const app = express();
const sessions = require("express-session");
const MySQLStore = require("express-mysql-session")(sessions);
const port = process.env.PORT || 5000;
const helper = require("./lib/helper_functions");
const oneDay = 1000 * 60 * 60 * 24;

/**
 * TODO : validate user credentials before inserting into db
 * TODO : use checkAuth middleware for every user request, security
 */

//  const checkAuth = (req, res, next) => {
//   if (!req.session.isLogged) {
//     res.redirect("/signin");
//     return;
//   }
//   next();
// }

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

// app.set('trust proxy', 1)

let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB,
});

connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

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

app.use(
  sessions({
    secret: process.env.SECRET,
    saveUninitialized: false,
    store: sessionStore,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

app.listen(port, () => console.log(`Listening to port ${port}`));

app.get("/express", (req, res) => {
  console.log("/express ->", req.session);
  if (req.session.userId != null && req.session) {
    res.status(200).send({
      express: `welcome ${req.session.userId}`,
    });
  } else {
    res.status(200).send({
      express: `please sign in or sign up`,
    });
  }
});

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
 * TODO - sweetalerts and change result var to isLogged
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
          result: "",
          error: error,
        });
      } else {
        console.log("query executed", result);
        req.session.userId = req.body.firstName;
        req.session.isLogged = true;
        res.status(200).send({
          result: "User is Registered",
          error: "",
        });
      }
    } catch (err) {
      console.error("error in /signup");
    }
  } else {
    res.status(500).send({
      result: "",
      error: "No data recieved from the form",
    });
  }
});

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
