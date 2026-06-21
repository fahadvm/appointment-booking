import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { User, Calendar, Clock, BedDouble, Check, ShieldCheck, Sparkles } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

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

export default function Home() {
    const [searchParams, setSearchParams] = useSearchParams();
    const serviceQuery = searchParams.get("service") || "Haircut";

    const [customerName, setCustomerName] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("10:00");
    const [serviceType, setServiceType] = useState(serviceQuery);

    const [bookingMessage, setBookingMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const todayStr = new Date().toISOString().split("T")[0];

    useEffect(() => {
        setServiceType(serviceQuery);
        if (!date) {
            setDate(todayStr);
        }
    }, [serviceQuery]);

    const handleBookAppointment = async (e) => {
        e.preventDefault();
        setBookingMessage("");

        if (!customerName.trim()) {
            setBookingMessage("Error: Customer Name is required");
            return;
        }

        const resetForm = () => {
            setCustomerName("");
            setDate(todayStr);
            setTime("10:00");
            setServiceType(serviceQuery);
        };

        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/api/appointments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerName,
                    date,
                    time,
                    serviceType,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to book");

            setBookingMessage("Success: Appointment booked successfully!");
            resetForm();
        } catch (err) {
            setBookingMessage(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full flex-grow pb-16 bg-[#f5f5f5] text-gray-800 font-sans">
            <section className="bg-[#003580] text-white pt-8 pb-20 px-4 md:px-6">
                <div className="max-w-6xl mx-auto text-left">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Book your next appointment</h1>
                    <p className="text-lg md:text-xl font-normal text-white/90">Search and secure your professional appointment slots instantly...</p>
                </div>
            </section>

            <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-8 relative z-20">
                <form onSubmit={handleBookAppointment} className="bg-[#ffb700] p-1 rounded-lg shadow-lg">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.8fr_0.8fr_1fr_auto] gap-[3px]">
                        {/* Field 1: Customer Name */}
                        <div className="bg-white flex items-center gap-2 px-3 py-3 rounded-[4px] border border-transparent focus-within:ring-2 focus-within:ring-[#003580]">
                            <User className="w-5 h-5 text-gray-400 shrink-0" />
                            <div className="flex-grow flex flex-col items-start leading-tight">
                                <span className="text-xs text-gray-400 font-medium">Customer Name</span>
                                <input
                                    type="text"
                                    required
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    placeholder="Enter full name"
                                    className="w-full text-sm font-semibold text-gray-800 bg-transparent border-none outline-none p-0"
                                />
                            </div>
                        </div>

                        <div className="bg-white flex items-center gap-2 px-3 py-3 rounded-[4px] border border-transparent focus-within:ring-2 focus-within:ring-[#003580]">
                            <Calendar className="w-5 h-5 text-gray-400 shrink-0" />
                            <div className="flex-grow flex flex-col items-start leading-tight">
                                <span className="text-xs text-gray-400 font-medium">Date</span>
                                <input
                                    type="date"
                                    min={todayStr}
                                    required
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full text-sm font-semibold text-gray-800 bg-transparent border-none outline-none p-0 cursor-pointer"
                                />
                            </div>
                        </div>

                        <div className="bg-white flex items-center gap-2 px-3 py-3 rounded-[4px] border border-transparent focus-within:ring-2 focus-within:ring-[#003580]">
                            <Clock className="w-5 h-5 text-gray-400 shrink-0" />
                            <div className="flex-grow flex flex-col items-start leading-tight">
                                <span className="text-xs text-gray-400 font-medium">Time Slot</span>
                                <select
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="w-full text-sm font-semibold text-gray-800 bg-transparent border-none outline-none p-0 cursor-pointer"
                                >
                                    <option value="09:00">09:00 AM</option>
                                    <option value="10:00">10:00 AM</option>
                                    <option value="11:00">11:00 AM</option>
                                    <option value="12:00">12:00 PM</option>
                                    <option value="14:00">02:00 PM</option>
                                    <option value="15:00">03:00 PM</option>
                                    <option value="16:00">04:00 PM</option>
                                    <option value="17:00">05:00 PM</option>
                                </select>
                            </div>
                        </div>



                        {/* Book Now Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-[#006ce4] hover:bg-[#005fb8] disabled:bg-blue-300 text-white font-bold px-8 py-3.5 rounded-[4px] cursor-pointer shadow-sm transition duration-150 shrink-0"
                        >
                            {loading ? "Booking..." : "Book Now"}
                        </button>
                    </div>
                </form>
            </div>

            <div className="max-w-6xl mx-auto px-4 md:px-6 mt-8">
                 {bookingMessage && (
                <div className="max-w-6xl mx-auto px-4 mb-5 md:px-6 mt-6">
                    <div className={`p-4 rounded-md text-sm font-semibold flex items-center gap-2 border text-left ${bookingMessage.startsWith("Success")
                            ? "bg-green-50 border-green-200 text-green-700"
                            : "bg-red-50 border-red-200 text-red-700"
                        }`}>
                        <span>{bookingMessage.startsWith("Success") ? "✓" : "⚠"}</span>
                        <span>{bookingMessage.replace("Success: ", "").replace("Error: ", "")}</span>
                    </div>
                </div>
            )}
                <div className="bg-white border border-[#ffb700] rounded-lg p-6 shadow-sm text-left">
                    <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                        Review and Confirm Your Details
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pb-4 border-b border-gray-100">
                        <div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Customer Name</span>
                            <div className={`text-sm font-bold mt-1 ${customerName.trim() ? "text-gray-800" : "text-gray-500 italic"}`}>
                                {customerName.trim() ? customerName : "Name missing *"}
                            </div>
                        </div>
                        <div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Date</span>
                            <div className="text-sm font-bold text-gray-800 mt-1">
                                {date || todayStr}
                            </div>
                        </div>
                        <div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Time Slot</span>
                            <div className="text-sm font-bold text-gray-800 mt-1">
                                {formatTime(time)}
                            </div>
                        </div>
                        <div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Service Type</span>
                            <div className="text-sm font-bold text-[#003580] mt-1">
                                {serviceType}
                            </div>
                        </div>
                    </div>
                    

                    <div className="mt-4 flex items-center justify-between flex-wrap gap-2 text-xs">
                        <div className="flex items-center gap-1.5 font-bold">
                            {customerName.trim() ? (
                                <span className="text-green-700 flex items-center gap-1">
                                    Ready to book! Please verify that all details above are correct.
                                </span>
                            ) : (
                                <span className="text-amber-600 flex items-center gap-1 ">
                                    Please enter your Customer Name in the form to verify booking details.
                                </span>
                            )}
                        </div>
           
                        <span className="text-gray-400 font-medium font-semibold">Free cancellation</span>
                    </div>
                </div>
            </div>


            {/* Value Proposition features grid */}
            <section className="max-w-6xl mx-auto px-4 md:px-6 mt-16 text-left">
                <h2 className="text-2xl font-bold text-gray-900 mb-10 font-sans">Why BookHere.com?</h2>
                <div className="grid mt-10 grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-5 flex items-start gap-4 shadow-sm">
                        <div className="bg-blue-50 p-3 rounded-full text-[#003580] shrink-0"><ShieldCheck className="w-6 h-6" /></div>
                        <div>
                            <h3 className="font-bold text-base mb-1">No Booking Fees</h3>
                            <p className="text-sm text-gray-500 font-medium leading-relaxed">We believe in complete transparency. Save money on every slot you book.</p>
                        </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-5 flex items-start gap-4 shadow-sm">
                        <div className="bg-blue-50 p-3 rounded-full text-[#003580] shrink-0"><Sparkles className="w-6 h-6" /></div>
                        <div>
                            <h3 className="font-bold text-base mb-1">Instant Confirmation</h3>
                            <p className="text-sm text-gray-500 font-medium leading-relaxed">All appointment slots are synced in real time. Confirm immediately.</p>
                        </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-5 flex items-start gap-4 shadow-sm">
                        <div className="bg-blue-50 p-3 rounded-full text-[#003580] shrink-0"><Clock className="w-6 h-6" /></div>
                        <div>
                            <h3 className="font-bold text-base mb-1">Flexible Scheduling</h3>
                            <p className="text-sm text-gray-500 font-medium leading-relaxed">Reschedule or cancel your slots easily through the Bookings list anytime.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
