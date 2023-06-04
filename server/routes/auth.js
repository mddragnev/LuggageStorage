const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const API_URL = `/api/${process.env.API_VERSION}`;

router.post(`${API_URL}/register`, authController.register);
router.post(`${API_URL}/register/partner`, authController.registerPartner);

router.post(`${API_URL}/login`, authController.login);
router.get(`${API_URL}/logout`, authController.logout);
router.get(`${API_URL}/refresh`, authController.refreshTokenHandler);

module.exports = router;
