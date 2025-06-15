

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


// todo - fix this
/**
 * Fetch the list of transaction done by user
 * @param {mysql.Connection} connection - Db connection Object
 * @param {String} email - User email
 * @returns {Object} - Object containing result and error as keys
 */
const fetchUserTrans = async (connection, email) => {
  try {
    let sql = "SELECT * FROM ?? WHERE ?? = ?";
    let inserts = ["transactions", "email", email];
    let formattedQuery = formatSqlQuery(sql, inserts);
    let result = await executeQuery(connection, formattedQuery);

    return { result, error: null };
  } catch (e) {
    console.error("error inside fetchUserTrans", e);
    return { result: null, error: e };
  }
};

