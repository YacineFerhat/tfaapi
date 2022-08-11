const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const { dbUrl, port } = require("./config");
const userRoute = require("./src/routes/user");
const paymentRoute = require("./src/routes/payment");

const app = express();
app.use(morgan("common"));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.listen(port, () => {
  console.log(`Connected to port ${port}`);
});

app.use("/api/payments", paymentRoute);
app.use("/api/users", userRoute);

var options = {
  keepAlive: true,
  connectTimeoutMS: 30000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(dbUrl, options, (err) => {
  console.log("connected to DB");
  if (err) console.log(err);
});
