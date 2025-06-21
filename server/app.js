/***********************************************
 *
 * Require files
 *
 ***********************************************/
require('dotenv').config();
const usersRoutes = require('./routes/usersRoutes');
const coinsRoutes = require('./routes/coinsRoutes');
const ledgerRoutes = require('./routes/ledgerRoutes');
const favouriteCoinsRoutes = require('./routes/favouriteCoinsRoutes');
const express = require('express');
const app = express();
const cors = require('cors');
const { sessions, sessionStorePromise } = require('./config/db');
require('./services/scheduler');

/***********************************************
 *
 * Express configurations
 *
 ***********************************************/
app.use(
  cors({
    origin: 'http://localhost:8080', // this should match your frontend REACT_APP_API_URL
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(express.json());

/***********************************************
 *
 * Async session store setup
 *
 ***********************************************/
(async () => {
  const sessionStore = await sessionStorePromise;
  app.use(
    sessions({
      key: process.env.SESSION_COOKIE_NAME,
      secret: process.env.SECRET || 'your-default-secret',
      store: sessionStore,
      saveUninitialized: false,
      resave: false,
      cookie: { maxAge: 1000 * 60 * 60 * 24, sameSite: 'lax' },
    }),
  );

  /***********************************************
   *
   * Routes
   *
   ***********************************************/
  app.use('/users', usersRoutes);
  app.use('/coins', coinsRoutes);
  app.use('/ledger', ledgerRoutes);
  app.use('/favourite', favouriteCoinsRoutes);

  app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  });
})();

module.exports = app;
