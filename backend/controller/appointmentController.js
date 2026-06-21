const appointmentService = require("../service/appointmentService");
const asyncHandler = require("../utils/asyncHandler");

const getAppointments = asyncHandler(async (req, res) => {
  const appointments = await appointmentService.getAllAppointments(req.query);
  res.json(appointments);
});

const createAppointment = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.createAppointment(req.body);
  res.status(201).json(appointment);
});

const cancelAppointment = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.cancelAppointment(req.params.id);
  res.json(appointment);
});

module.exports = {
  getAppointments,
  createAppointment,
  cancelAppointment,
};
