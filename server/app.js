/***********************************************
 * 
 * Require files
 * 
 ***********************************************/
require("dotenv").config();
const usersRoutes = require("./routes/usersRoutes");
const coinsRoutes = require("./routes/coinsRoutes");
const ledgerRoutes = require("./routes/ledgerRoutes");
const favouriteCoinsRoutes = require('./routes/favouriteCoinsRoutes');
const express = require("express");
const app = express();
const cors = require("cors");
const {sessions, sessionStore} = require("./config/db");


/***********************************************
 * 
 * Express configurations
 * 
 ***********************************************/
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
app.use(
  sessions({
    key: "session_cookie_name",
    secret: process.env.SECRET,
    store: sessionStore,
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24, sameSite: "lax" },
  })
);


/***********************************************
 * 
 * Routes
 * 
 ***********************************************/
app.use("/users", usersRoutes);
app.use("/coins", coinsRoutes);
app.use("/ledger", ledgerRoutes);
app.use("/favourite", favouriteCoinsRoutes);

module.exports = app;