/**
 * Middleware to check the user is authenticated for every request
 * @param {Object} req - Request Object
 * @param {Object} res - Response Object
 * @param {*} next - Callback function to run once the middleware is successfull
 * @returns
 */
const checkAuth = (req, res, next) => {
  if (!req.session.isLogged && !req.session.userName && !req.session.email) {
    res.redirect("/signin");
    return;
  }
  next();
};

module.exports = {
  checkAuth,
};
