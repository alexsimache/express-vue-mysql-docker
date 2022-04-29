const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const path = __dirname + "/public/";

const app = express();
const dotenv = require("dotenv");

dotenv.config();

app.use(express.static(path));

const PORT = process.env.SERVER_PORT || 8080;

app.use(cors());

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(path + "index.html");
});

require("./routes/data.routes.js")(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
