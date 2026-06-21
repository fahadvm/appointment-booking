const Appointment = require("../model/appointmentSchema");

const SORT_FIELDS = {
  date: "date",
  time: "time",
  customerName: "customerName",
  serviceType: "serviceType",
  status: "status",
  createdAt: "createdAt",
};

const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const getDateRange = (date) => {
  const startDate = new Date(`${date}T00:00:00.000Z`);
  const endDate = new Date(startDate);
  endDate.setUTCDate(endDate.getUTCDate() + 1);

  return { startDate, endDate };
};

const findAll = async ({
  page = 1,
  limit = 5,
  date,
  search,
  status,
  serviceType,
  sortBy = "date",
  sortOrder = "asc",
} = {}) => {
  const query = {};

  if (date) {
    const { startDate, endDate } = getDateRange(date);

    query.date = {
      $gte: startDate,
      $lt: endDate,
    };
  }

  if (search) {
    const searchRegex = new RegExp(escapeRegex(search), "i");

    query.$or = [
      { customerName: searchRegex },
      { serviceType: searchRegex },
      { status: searchRegex },
    ];
  }

  if (status) {
    query.status = status;
  }

  if (serviceType) {
    query.serviceType = serviceType;
  }

  const sortField = SORT_FIELDS[sortBy] || SORT_FIELDS.date;
  const sortDirection = sortOrder === "desc" ? -1 : 1;
  const sort = {
    [sortField]: sortDirection,
  };

  if (sortField !== "time") {
    sort.time = 1;
  }

  const skip = (page - 1) * limit;
  const [appointments, total] = await Promise.all([
    Appointment.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Appointment.countDocuments(query),
  ]);
  const totalPages = Math.max(Math.ceil(total / limit), 1);

  return {
    appointments,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

const findOverlapping = async ({ date, time }) => {
  const { startDate, endDate } = getDateRange(date);

  return await Appointment.findOne({
    date: {
      $gte: startDate,
      $lt: endDate,
    },
    time,
    status: "Booked",
  });
};

const create = async (appointmentData) => {
  return await Appointment.create(appointmentData);
};

const findById = async (id) => {
  return await Appointment.findById(id);
};

const cancel = async (id) => {
  return await Appointment.findByIdAndUpdate(
    id,
    { status: "Cancelled" },
    { new: true }
  );
};

module.exports = {
  findAll,
  findOverlapping,
  create,
  findById,
  cancel,
};
