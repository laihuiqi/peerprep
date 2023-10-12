const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "GET USERS",
  });
});

router.post("/", (req, res, next) => {
  res.status(201).json({
    message: "POST USERS",
  });
});

router.get("/:userId", (req, res, next) => {
  const id = req.params.userId;

  res.status(200).json({
    message: "GET USER",
    userId: id,
  });
});

router.post("/:userId", (req, res, next) => {
  const id = req.params.userId;

  res.status(201).json({
    message: "POST USER",
    userId: id,
  });
});

router.delete("/:userId", (req, res, next) => {
  const id = req.params.userId;

  res.status(200).json({
    message: "DELETE USER",
    userId: id,
  });
});

module.exports = router;
