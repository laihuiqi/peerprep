const express = require("express");
const app = express();

// Dependencies
const morgan = require("morgan");
const bodyParser = require("body-parser");

// MongoDB Database using Mongoose as Client
const mongoose = require("mongoose");

// Importing Routes
const userRoutes = require("./routes/users");

// Connecting to MongoDB Database
mongoose.connect("", {
  useMongoClient: true,
});

// Middleware to help in parsing, loggiong
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// To handle CORS Errors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // "*" -> Allow all links to access

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  // Browsers usually send this before PUT or POST Requests
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, PATCH");
    return res.status(200).json({});
  }

  // Continue Route Processing
  next();
});

// Routes
app.use("/users", userRoutes);

// Handle When No Route Match Is Found
app.use((req, res, next) => {
  const error = new Error("Route Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;