import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function AppointmentForm() {
  const [formData, setFormData] = useState({
    customerName: "",
    date: "",
    time: "",
    serviceType: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = "Customer name is required";
    } else if (formData.customerName.trim().length < 2) {
      newErrors.customerName =
        "Customer name must be at least 2 characters";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();

      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.date = "Please select today or a future date";
      }
    }

    if (!formData.time) {
      newErrors.time = "Time is required";
    }

    if (!formData.serviceType) {
      newErrors.serviceType = "Please select a service";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove error when user starts typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/api/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create appointment"
        );
      }

      setMessage("Appointment booked successfully!");

      setFormData({
        customerName: "",
        date: "",
        time: "",
        serviceType: "",
      });

      setErrors({});
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6">
          Appointment Booking
        </h1>

        {message && (
          <div
            className={`mb-4 p-3 rounded-lg text-center font-medium ${
              message.includes("successfully")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Customer Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Customer Name *
            </label>

            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              placeholder="Enter your name"
              className={`w-full rounded-lg px-4 py-2 border focus:outline-none focus:ring-2 ${
                errors.customerName
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:ring-black"
              }`}
            />

            {errors.customerName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.customerName}
              </p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Appointment Date *
            </label>

            <input
              type="date"
              name="date"
              min={today}
              value={formData.date}
              onChange={handleChange}
              className={`w-full rounded-lg px-4 py-2 border focus:outline-none focus:ring-2 ${
                errors.date
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:ring-black"
              }`}
            />

            {errors.date && (
              <p className="text-red-500 text-sm mt-1">
                {errors.date}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Appointment Time *
            </label>

            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className={`w-full rounded-lg px-4 py-2 border focus:outline-none focus:ring-2 ${
                errors.time
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:ring-black"
              }`}
            />

            {errors.time && (
              <p className="text-red-500 text-sm mt-1">
                {errors.time}
              </p>
            )}
          </div>

          {/* Service Type */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Service Type *
            </label>

            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              className={`w-full rounded-lg px-4 py-2 border focus:outline-none focus:ring-2 ${
                errors.serviceType
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:ring-black"
              }`}
            >
              <option value="">Select Service</option>
              <option value="Consultation">Consultation</option>
              <option value="Haircut">Haircut</option>
              <option value="Meeting">Meeting</option>
            </select>

            {errors.serviceType && (
              <p className="text-red-500 text-sm mt-1">
                {errors.serviceType}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Booking Appointment..." : "Book Appointment"}
          </button>
        </form>
      </div>
    </div>
  );
}
