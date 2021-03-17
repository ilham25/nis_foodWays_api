const express = require("express");

const router = express.Router();

const { getUsers, deleteUser } = require("../controller/user");

router.get("/users", getUsers);
router.delete("/user/delete/:id", deleteUser);

module.exports = router;
