import React from "react";
import { Star, CalendarDays, BadgeCheck } from "lucide-react";

export default function DoctorCard({ doctor, onSelectSlot, selectedSlot }) {
  return (
    <div className="card p-5 flex flex-col hover:shadow-pop transition-shadow">
      <div className="flex gap-4">
        <img
          src={doctor.photo}
          alt={doctor.name}
          className="w-16 h-16 rounded-2xl object-cover border border-clinic-line"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <h3 className="font-display font-bold text-clinic-ink truncate">
              {doctor.name}
            </h3>
            <BadgeCheck size={15} className="text-clinic-teal shrink-0" />
          </div>
          <p className="text-sm text-clinic-tealDark font-medium">
            {doctor.specialization}
          </p>
          <p className="text-xs text-clinic-slate mt-1">
            {doctor.experience} Years Experience
          </p>
          <div className="flex items-center gap-1 mt-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={13}
                className={
                  i < Math.round(doctor.rating)
                    ? "fill-clinic-amber text-clinic-amber"
                    : "text-clinic-line"
                }
              />
            ))}
            <span className="text-xs text-clinic-slate ml-1">
              {doctor.rating} ({doctor.reviews})
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mt-4 text-xs text-clinic-slate">
        <CalendarDays size={14} />
        Available: {doctor.availableDays.join(", ")}
      </div>

      <div className="mt-3">
        <p className="text-xs font-semibold text-clinic-slate mb-2">Time Slots</p>
        <div className="flex flex-wrap gap-2">
          {doctor.slots.map((slot) => {
            const active = selectedSlot === slot;
            return (
              <button
                key={slot}
                onClick={() => onSelectSlot(doctor, slot)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  active
                    ? "bg-clinic-teal text-white border-clinic-teal"
                    : "border-clinic-line text-clinic-ink hover:border-clinic-teal hover:text-clinic-tealDark"
                }`}
              >
                {slot}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
