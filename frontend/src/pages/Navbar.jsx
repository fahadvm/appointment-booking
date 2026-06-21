import { NavLink, useLocation } from "react-router-dom";
import { Scissors, Stethoscope, Briefcase, Users } from "lucide-react";

export default function Navbar() {
  const location = useLocation();

  // Helper to read query parameter
  const searchParams = new URLSearchParams(location.search);
  const activeService = searchParams.get("service") || "Haircut";

  return (
    <header className="bg-[#003580] text-white w-full shadow-md font-sans">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
        <NavLink to="/" className="text-2xl font-bold tracking-tight text-white hover:text-gray-100 flex items-center gap-2">
          <span>BookHere.com</span>
        </NavLink>

        <div className="flex items-center">
          <NavLink
            to="/bookings"
            className="bg-white text-[#003580] hover:bg-gray-100 font-bold px-5 py-2 rounded-md shadow-sm transition duration-150 ease-in-out text-sm cursor-pointer select-none"
          >
            My Bookings
          </NavLink>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 pb-4">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-white/20">
          <NavLink
            to="/?service=Haircut"
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition cursor-pointer ${
              activeService === "Haircut"
                ? "bg-white/10 border-white text-white"
                : "border-transparent text-white hover:bg-white/10"
            }`}
          >
            <Scissors className="w-4 h-4" />
            <span>Haircut</span>
          </NavLink>

          <NavLink
            to="/?service=Health Checkup"
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition cursor-pointer ${
              activeService === "Health Checkup"
                ? "bg-white/10 border-white text-white"
                : "border-transparent text-white hover:bg-white/10"
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Health Checkup</span>
          </NavLink>

          <NavLink
            to="/?service=Consultation"
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition cursor-pointer ${
              activeService === "Consultation"
                ? "bg-white/10 border-white text-white"
                : "border-transparent text-white hover:bg-white/10"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Consultation</span>
          </NavLink>

          <NavLink
            to="/?service=Meeting"
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition cursor-pointer ${
              activeService === "Meeting"
                ? "bg-white/10 border-white text-white"
                : "border-transparent text-white hover:bg-white/10"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Meeting</span>
          </NavLink>
        </div>
      </div>
    </header>
  );
}