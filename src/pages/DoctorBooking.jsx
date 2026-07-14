import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useApp } from "../context/AppContext";
import DoctorCard from "../components/DoctorCard";

export default function DoctorBooking() {
  const { doctors, bookAppointment } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selection, setSelection] = useState(null); // { doctorId, slot }

  const filtered = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.specialization.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectSlot = (doctor, slot) => {
    setSelection({ doctor, slot });
  };

  const confirmBooking = () => {
    if (!selection) return;
    const appt = bookAppointment(selection.doctor, selection.slot);
    navigate(`/prepare/${appt.id}`);
  };

  return (
    <div className="p-5 lg:p-8 space-y-6">
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-clinic-slate" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search doctor or specialization..."
          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-clinic-line text-sm focus:outline-none focus:border-clinic-teal"
        />
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 pb-24">
        {filtered.map((doc) => (
          <DoctorCard
            key={doc.id}
            doctor={doc}
            onSelectSlot={handleSelectSlot}
            selectedSlot={selection?.doctor.id === doc.id ? selection.slot : null}
          />
        ))}
      </div>

      {selection && (
        <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-white border-t border-clinic-line px-6 py-4 flex items-center justify-between shadow-pop animate-slideUp">
          <div className="text-sm">
            <span className="text-clinic-slate">Booking </span>
            <span className="font-semibold text-clinic-ink">{selection.doctor.name}</span>
            <span className="text-clinic-slate"> at </span>
            <span className="font-semibold text-clinic-ink">{selection.slot}</span>
          </div>
          <button onClick={confirmBooking} className="btn-primary px-6 py-2.5 rounded-xl">
            Confirm Appointment
          </button>
        </div>
      )}
    </div>
  );
}
