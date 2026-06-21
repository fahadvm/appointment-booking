const appointmentRepository = require("../repository/appointmentRepository");
const { isValidAppointment } = require("../validator/appointmentValidator");

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 5;
const MAX_LIMIT = 50;
const ALLOWED_SORT_FIELDS = new Set([
  "date",
  "time",
  "customerName",
  "serviceType",
  "status",
  "createdAt",
]);
const ALLOWED_SORT_ORDERS = new Set(["asc", "desc"]);

const parsePositiveInteger = (value, fallback) => {
  const parsedValue = Number.parseInt(value, 10);

  if (Number.isNaN(parsedValue) || parsedValue < 1) {
    return fallback;
  }

  return parsedValue;
};

const getAllAppointments = async (filters = {}) => {
  const page = parsePositiveInteger(filters.page, DEFAULT_PAGE);
  const requestedLimit = parsePositiveInteger(filters.limit, DEFAULT_LIMIT);
  const limit = Math.min(requestedLimit, MAX_LIMIT);
  const sortBy = ALLOWED_SORT_FIELDS.has(filters.sortBy)
    ? filters.sortBy
    : "date";
  const sortOrder = ALLOWED_SORT_ORDERS.has(filters.sortOrder)
    ? filters.sortOrder
    : "asc";

  return await appointmentRepository.findAll({
    page,
    limit,
    date: filters.date,
    search: filters.search?.trim(),
    status: filters.status,
    serviceType: filters.serviceType,
    sortBy,
    sortOrder,
  });
};

const createAppointment = async (appointmentData) => {
  const validation = isValidAppointment(appointmentData);
  if (!validation.valid) {
    const error = new Error(validation.message);
    error.statusCode = 400;
    throw error;
  }

  const overlappingAppointment = await appointmentRepository.findOverlapping({
    date: appointmentData.date,
    time: appointmentData.time,
  });

  if (overlappingAppointment) {
    const error = new Error(
      "This time slot is already booked. Please choose another time."
    );
    error.statusCode = 409;
    throw error;
  }

  try {
    return await appointmentRepository.create(appointmentData);
  } catch (error) {
    if (error.code === 11000) {
      error.message =
        "This time slot is already booked. Please choose another time.";
      error.statusCode = 409;
    }

    throw error;
  }
};

const cancelAppointment = async (id) => {
  const appointment = await appointmentRepository.cancel(id);
  if (!appointment) {
    const error = new Error("Appointment not found");
    error.statusCode = 404;
    throw error;
  }
  return appointment;
};

module.exports = {
  getAllAppointments,
  createAppointment,
  cancelAppointment,
};
