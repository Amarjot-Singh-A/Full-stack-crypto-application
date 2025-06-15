const { formatSqlQuery, executeQuery } = require("../config/db");

const get = async (userId) => {
  try {
    const sql = "SELECT ??,?? FROM ?? WHERE ?? = ?";
    const inserts = ["id", "coinId", "quantity", "holdings", "userId", userId];
    const formattedQuery = formatSqlQuery(sql, inserts);
    const result = await executeQuery(formattedQuery);

    return {
      result,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching holdings - data model", error);
    return {
      result: [],
      error,
    };
  }
};

const create = async ({ userId, coinId, quantity }) => {
  try {
    const sql = "INSERT INTO ?? (??,??,??) values (?,?,?)";
    const inserts = [
      "holdings",
      "userId",
      "coinId",
      "quantity",
      userId,
      coinId,
      quantity,
    ];
    const formattedQuery = formatSqlQuery(sql, inserts);
    const result = await executeQuery(formattedQuery);

    return {
      result,
      error: null,
    };
  } catch (error) {
    console.error("Error inserting holdings - data model", error);
    return {
      result: [],
      error,
    };
  }
};

const remove = async (id) => {
  try {
    const sql = "DELETE FROM ?? WHERE ?? = ?";
    const inserts = ["holdings", "id", id];
    const formattedQuery = formatSqlQuery(sql, inserts);
    const result = await executeQuery(formattedQuery);

    return {
      result,
      error: null,
    };
  } catch (error) {
    console.error("Error deleting holdings - data model", error);
    return {
      result: [],
      error,
    };
  }
};

module.exports = {
  get,
  create,
  remove,
};
