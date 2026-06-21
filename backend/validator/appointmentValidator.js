const isValidAppointment = ({ customerName, date, time, serviceType }) => {
  if (!customerName || typeof customerName !== "string" || !customerName.trim()) {
    return { valid: false, message: "Customer name is required" };
  }
  if (customerName.trim().length > 100) {
    return { valid: false, message: "Customer name cannot exceed 100 characters" };
  }
  if (!date) {
    return { valid: false, message: "Appointment date is required" };
  }
  if (!time) {
    return { valid: false, message: "Appointment time is required" };
  }
  
  const validServices = ["Consultation", "Haircut", "Dental Checkup", "Health Checkup", "Meeting"];
  if (!serviceType || !validServices.includes(serviceType)) {
    return { valid: false, message: "Please select a valid service type" };
  }

  return { valid: true };
};

module.exports = {
  isValidAppointment,
};
