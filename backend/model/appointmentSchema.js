const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    date: {
      type: Date,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    serviceType: {
      type: String,
      required: true,
      enum: [
        "Consultation",
        "Haircut",
        "Dental Checkup",
        "Health Checkup",
        "Meeting",
      ],
    },

    status: {
      type: String,
      enum: ["Booked", "Cancelled"],
      default: "Booked",
    },
  },
  {
    timestamps: true,
  }
);

appointmentSchema.index(
  { date: 1, time: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "Booked" },
  }
);

module.exports = mongoose.model(
  "Appointment",
  appointmentSchema
);
