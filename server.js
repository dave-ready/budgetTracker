const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/budget", {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useFindAndModify: false
});

// routes
//DOESN'T WORK 
//app.use("./routes/api.js");

//EXAMPLE
//const auth = require("./routes/auth");
//app.use("/api/v1/auth", auth);

const api = require("./routes/api.js");
app.use("./routes/api.js", api);

//ALTERNATIVE
//const api = require("./routes/api.js");
//app.use("/api/transaction/bulk", bulk);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});



