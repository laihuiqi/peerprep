const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  addUserToDatabase,
  updateUserData,
  deleteUserFromDatabase,
} = require("../controllers/userDatabaseController");

router.get("/", getAllUsers);

router.get("/:userId", getUserById);

router.post("/:userId", addUserToDatabase);

router.patch("/:userId", updateUserData);

router.delete("/:userId", deleteUserFromDatabase);

module.exports = router;
