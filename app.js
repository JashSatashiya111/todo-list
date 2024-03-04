const dbConnect = require("./config/db");
const express = require("express");
require("dotenv").config();
const port = 3021;
const app = express();
const cors = require("cors");
dbConnect();
app.use(express.json());
app.use(cors());
app.use("/auth", require("./controller/auth"));
app.use("/todo", require("./controller/todo"));

global.setError = (msg, code) => {
  if (!code) {
    code = 400;
  }
  let err = new Error(msg);
  err.status = code;
  return err;
};
global.throwError = (err, code = 400) => {
  if (typeof err === 'string') {
    throw setError(err, code);
  } else {
    throw err;
  }
};

app.use(function (err, req, res, next) {
  let error = err.message.replace('Error: ', '')
  console.log(error);
  res.status(err.status || 500).send({ error });
});

app.get("/", (req, res) => {
  res.send("Now using https..");
});

app.listen(port, (req, res) => {
  console.log("Server Running on " + port);
});