const sql = require("./db.js");

const Data = function (data) {
  this.counter = data.counter;
};

Data.getAll = (counter, result) => {
  let query = "SELECT * FROM data LIMIT 1";
  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    console.log("results: ", res[0]);
    result(null, res[0]);
  });
};

Data.updateById = (id, data, result) => {
  sql.query(
    "UPDATE data SET counter = ? WHERE id = ?",
    [data.counter, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      if (res.affectedRows === 0) {
        result({ kind: "not_found" }, null);
        return;
      }
      console.log("updated row: ", { id: id, ...data });
      result(null, { id: id, ...data });
    }
  );
};

module.exports = Data;
