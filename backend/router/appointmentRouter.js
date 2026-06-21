const express = require("express");
const router = express.Router();
const appointmentController = require("../controller/appointmentController");

router.get("/", appointmentController.getAppointments);
router.post("/", appointmentController.createAppointment);
router.patch("/:id/cancel", appointmentController.cancelAppointment);

module.exports = router;
