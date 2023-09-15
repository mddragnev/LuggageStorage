const express = require("express");
const router = express.Router();
const placesController = require("../controllers/placesController");
const API_URL = `/api/${process.env.API_VERSION}`;

router.get(`${API_URL}/places`, placesController.getAllPlaces);
router.get(`${API_URL}/places/:id`, placesController.getPlace)
router.put(`${API_URL}/places`, placesController.updatePlace)

module.exports = router;
