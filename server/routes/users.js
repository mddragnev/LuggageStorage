const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const verifyRoles = require("../middlewares/verifyRoles");
const API_URL = `/api/${process.env.API_VERSION}`;

router.get(
  `${API_URL}/users`,
  verifyRoles("admin"),
  usersController.getAllUsers
);

router.put(`${API_URL}/users`, usersController.updateUser);
router.put(`${API_URL}/users/verify`, usersController.verifyUser);

module.exports = router;
