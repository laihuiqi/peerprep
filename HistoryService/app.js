const express = require("express");
const app = express();

// Dependencies
const morgan = require("morgan");
const bodyParser = require("body-parser");

// Connecting to mySQL Database
const {
  connectToDatabase,
} = require("./Controllers/HistoryDatabaseController");

connectToDatabase().then(() =>
  console.log("History Database Connected Successfully")
);

// Importing Routes
const historyRoutes = require("./Routes/HistoryRoutes");

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
app.use("/history", historyRoutes);

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
