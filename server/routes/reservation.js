const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservationController");
const API_URL = `/api/${process.env.API_VERSION}`;

router.post(`${API_URL}/reservation`, reservationController.createReservation);
router.put(`${API_URL}/reservation`, reservationController.updateReservation);
router.get(
  `${API_URL}/partner/reservations`,
  reservationController.getAllReservationOfPartner
);
router.get(
  `${API_URL}/client/reservations`,
  reservationController.getAllReservationsOfClient
);

module.exports = router;
