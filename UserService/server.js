const express = require("express");

const app = express();

app.get("/health", (req, res, next) => {
  res.json({
    message: "API HEALTH 100%",
  });
});

app.listen(3000, () => {
  console.log("Listening On 3000");
});
