
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