const express = require("express");
const router = express.Router();

const {
  getAttemptDetails,
  addAttemptDetails,
} = require("../Controllers/HistoryRoutesController");

router.post("/add-attempt", addAttemptDetails);

router.get("/:userId", getAttemptDetails);

module.exports = router;
