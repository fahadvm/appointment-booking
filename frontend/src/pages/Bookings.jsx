import AppointmentList from "./AppointmentList";

export default function Bookings() {
  return (
    <div className="w-full flex-grow bg-[#f5f5f5] pb-16 text-gray-800 font-sans">
      <section className="bg-[#003580] px-4 pt-8 pb-20 text-white md:px-6">
        <div className="mx-auto max-w-6xl text-left">
          <h1 className="mb-2 text-4xl font-bold tracking-tight md:text-5xl">
            My Bookings
          </h1>
          <p className="text-lg font-normal text-white/90 md:text-xl">
            Review, search, filter, and manage your appointment slots.
          </p>
        </div>
      </section>

      <main className="relative z-20 mx-auto -mt-8 max-w-6xl px-4 md:px-6">
        <AppointmentList />
      </main>
    </div>
  );
}
