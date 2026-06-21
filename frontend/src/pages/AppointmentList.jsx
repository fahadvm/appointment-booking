import { useEffect, useState } from "react";
import { Calendar, Search, SlidersHorizontal } from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const APPOINTMENTS_PER_PAGE = 5;
const SERVICE_TYPES = [
  "Consultation",
  "Haircut",
  "Dental Checkup",
  "Health Checkup",
  "Meeting",
];

const formatDate = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (time) => {
  if (!time) return "";

  const [hourValue, minuteValue = "00"] = time.split(":");
  const hour = Number(hourValue);

  if (Number.isNaN(hour)) {
    return time;
  }

  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;

  return `${String(displayHour).padStart(2, "0")}:${minuteValue} ${period}`;
};

const getPageNumbers = (currentPage, totalPages) => {
  const start = Math.max(currentPage - 2, 1);
  const end = Math.min(start + 4, totalPages);
  const adjustedStart = Math.max(end - 4, 1);

  return Array.from(
    { length: end - adjustedStart + 1 },
    (_, index) => adjustedStart + index
  );
};

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: APPOINTMENTS_PER_PAGE,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState("");

  const buildQueryParams = () => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(APPOINTMENTS_PER_PAGE),
      sortBy,
      sortOrder,
    });

    if (search.trim()) {
      params.set("search", search.trim());
    }

    if (filterDate) {
      params.set("date", filterDate);
    }

    if (statusFilter) {
      params.set("status", statusFilter);
    }

    if (serviceFilter) {
      params.set("serviceType", serviceFilter);
    }

    return params;
  };

  const loadAppointments = async (ignoreUpdates = false) => {
    const params = buildQueryParams();

    const response = await fetch(`${API_BASE_URL}/api/appointments?${params}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to load appointments");
    }

    if (ignoreUpdates) return;

    setAppointments(data.appointments || []);
    setPagination(
      data.pagination || {
        page,
        limit: APPOINTMENTS_PER_PAGE,
        total: data.length || 0,
        totalPages: 1,
      }
    );
  };

  const fetchAppointments = async () => {
    try {
      setError("");
      setLoading(true);
      await loadAppointments();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        setError("");
        setLoading(true);
        const params = buildQueryParams();
        const response = await fetch(`${API_BASE_URL}/api/appointments?${params}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load appointments");
        }

        if (ignore) return;

        setAppointments(data.appointments || []);
        setPagination(
          data.pagination || {
            page,
            limit: APPOINTMENTS_PER_PAGE,
            total: data.length || 0,
            totalPages: 1,
          }
        );
      } catch (err) {
        if (!ignore) {
          setError(err.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      ignore = true;
    };
  }, [page, search, filterDate, statusFilter, serviceFilter, sortBy, sortOrder]);

  const handleCancel = async (id) => {
    try {
      setError("");
      setCancellingId(id);

      const response = await fetch(
        `${API_BASE_URL}/api/appointments/${id}/cancel`,
        {
          method: "PATCH",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to cancel appointment"
        );
      }

      await fetchAppointments();
    } catch (err) {
      setError(err.message);
    } finally {
      setCancellingId("");
    }
  };

  const handleDateChange = (event) => {
    setFilterDate(event.target.value);
    setPage(1);
  };

  const resetFilters = () => {
    setSearch("");
    setFilterDate("");
    setStatusFilter("");
    setServiceFilter("");
    setSortBy("date");
    setSortOrder("asc");
    setPage(1);
  };

  const hasActiveControls =
    search ||
    filterDate ||
    statusFilter ||
    serviceFilter ||
    sortBy !== "date" ||
    sortOrder !== "asc";

  const totalPages = pagination.totalPages || 1;
  const pageNumbers = getPageNumbers(pagination.page, totalPages);
  const firstItem =
    pagination.total === 0
      ? 0
      : (pagination.page - 1) * pagination.limit + 1;
  const lastItem = Math.min(
    pagination.page * pagination.limit,
    pagination.total
  );

  if (loading) {
    return (
      <div className="rounded-lg border border-[#ffb700] bg-white p-8 text-center text-sm font-semibold text-gray-600 shadow-lg">
        Loading appointments...
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-lg bg-[#ffb700] p-1 shadow-lg">
        <div className="grid grid-cols-1 gap-[3px] lg:grid-cols-[1.5fr_0.9fr_0.9fr_1fr_1.3fr_auto]">
          <label className="flex items-center gap-2 rounded-[4px] bg-white px-3 py-3 focus-within:ring-2 focus-within:ring-[#003580]">
            <Search className="h-5 w-5 shrink-0 text-gray-400" />
            <span className="flex flex-grow flex-col leading-tight">
              <span className="text-xs font-medium text-gray-400">Search</span>
              <input
                type="search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Name, service, status"
                className="w-full border-none bg-transparent p-0 text-sm font-semibold text-gray-800 outline-none"
              />
            </span>
          </label>

          <label className="flex items-center gap-2 rounded-[4px] bg-white px-3 py-3 focus-within:ring-2 focus-within:ring-[#003580]">
            <Calendar className="h-5 w-5 shrink-0 text-gray-400" />
            <span className="flex flex-grow flex-col leading-tight">
              <span className="text-xs font-medium text-gray-400">Date</span>
              <input
                type="date"
                value={filterDate}
                onChange={handleDateChange}
                className="w-full border-none bg-transparent p-0 text-sm font-semibold text-gray-800 outline-none"
              />
            </span>
          </label>

          <label className="flex flex-col justify-center rounded-[4px] bg-white px-3 py-3 leading-tight focus-within:ring-2 focus-within:ring-[#003580]">
            <span className="text-xs font-medium text-gray-400">Status</span>
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setPage(1);
              }}
              className="w-full border-none bg-transparent p-0 text-sm font-semibold text-gray-800 outline-none"
            >
              <option value="">All Status</option>
              <option value="Booked">Booked</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </label>

          <label className="flex flex-col justify-center rounded-[4px] bg-white px-3 py-3 leading-tight focus-within:ring-2 focus-within:ring-[#003580]">
            <span className="text-xs font-medium text-gray-400">Service</span>
            <select
              value={serviceFilter}
              onChange={(event) => {
                setServiceFilter(event.target.value);
                setPage(1);
              }}
              className="w-full border-none bg-transparent p-0 text-sm font-semibold text-gray-800 outline-none"
            >
              <option value="">All Services</option>
              {SERVICE_TYPES.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2 rounded-[4px] bg-white px-3 py-3 focus-within:ring-2 focus-within:ring-[#003580]">
            <SlidersHorizontal className="h-5 w-5 shrink-0 text-gray-400" />
            <span className="flex min-w-0 flex-grow flex-col leading-tight">
              <span className="text-xs font-medium text-gray-400">Sort</span>
              <span className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(event) => {
                    setSortBy(event.target.value);
                    setPage(1);
                  }}
                  className="min-w-0 flex-1 border-none bg-transparent p-0 text-sm font-semibold text-gray-800 outline-none"
                >
                  <option value="date">Date</option>
                  <option value="time">Time</option>
                  <option value="customerName">Name</option>
                  <option value="serviceType">Service</option>
                  <option value="status">Status</option>
                  <option value="createdAt">Created</option>
                </select>

                <select
                  value={sortOrder}
                  onChange={(event) => {
                    setSortOrder(event.target.value);
                    setPage(1);
                  }}
                  className="w-20 border-none bg-transparent p-0 text-sm font-semibold text-gray-800 outline-none"
                >
                  <option value="asc">Asc</option>
                  <option value="desc">Desc</option>
                </select>
              </span>
            </span>
          </label>

          <button
            onClick={resetFilters}
            disabled={!hasActiveControls}
            className="rounded-[4px] bg-[#006ce4] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#005fb8] disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="my-4 flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="font-semibold text-gray-700">
          Showing {firstItem}-{lastItem} of {pagination.total} appointment(s)
        </span>
        <span className="font-medium text-gray-500">
          Page {pagination.page} of {totalPages}
        </span>
      </div>

      {appointments.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm font-semibold text-gray-600 shadow-sm">
          {filterDate
            ? "No appointments found for the selected filters."
            : "No appointments booked yet."}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#003580] text-white">
              <tr>
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wide">Name</th>
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wide">Date</th>
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wide">Time</th>
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wide">Service</th>
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wide">Status</th>
                <th className="p-4 text-center text-xs font-bold uppercase tracking-wide">Action</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((appointment) => {
                const isCancelled =
                  appointment.status === "Cancelled";

                return (
                  <tr
                    key={appointment._id}
                    className="border-b border-gray-100 hover:bg-blue-50/40"
                  >
                    <td className="p-4 text-sm font-bold text-gray-900">
                      {appointment.customerName}
                    </td>

                    <td className="p-4 text-sm font-semibold text-gray-700">
                      {formatDate(appointment.date)}
                    </td>

                    <td className="p-4 text-sm font-semibold text-gray-700">
                      {formatTime(appointment.time)}
                    </td>

                    <td className="p-4">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#003580]">
                      {appointment.serviceType}
                      </span>
                    </td>

                    <td className="p-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          isCancelled
                            ? "bg-red-50 text-red-700"
                            : "bg-green-50 text-green-700"
                        }`}
                      >
                        {appointment.status || "Booked"}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <button
                        className="rounded-[4px] bg-[#006ce4] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#005fb8] disabled:cursor-not-allowed disabled:bg-gray-300"
                        disabled={
                          isCancelled ||
                          cancellingId === appointment._id
                        }
                        onClick={() =>
                          handleCancel(appointment._id)
                        }
                      >
                        {cancellingId === appointment._id
                          ? "Cancelling..."
                          : isCancelled
                          ? "Cancelled"
                          : "Cancel"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <button
              className="rounded-[4px] border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-[#003580] hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={pagination.page <= 1}
              onClick={() =>
                setPage((currentPage) => Math.max(currentPage - 1, 1))
              }
            >
              Previous
            </button>

            <div className="flex items-center gap-2">
              {pageNumbers.map((pageNumber) => (
                <button
                  key={pageNumber}
                  className={`h-10 min-w-10 rounded-[4px] border px-3 text-sm font-bold ${
                    pageNumber === pagination.page
                      ? "border-[#003580] bg-[#003580] text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              ))}
            </div>

            <button
              className="rounded-[4px] border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-[#003580] hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={pagination.page >= totalPages}
              onClick={() =>
                setPage((currentPage) => Math.min(currentPage + 1, totalPages))
              }
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentList;
