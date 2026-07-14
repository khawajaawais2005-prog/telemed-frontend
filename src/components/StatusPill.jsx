import React from "react";

const styles = {
  booked: "bg-clinic-sky text-clinic-navy",
  waiting: "bg-amber-50 text-clinic-amber border border-amber-200",
  ready: "bg-teal-50 text-clinic-tealDark border border-teal-200",
  "in-call": "bg-clinic-teal text-white",
  completed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  cancelled: "bg-red-50 text-clinic-coral border border-red-200",
};

const labels = {
  booked: "Booked",
  waiting: "Waiting for Doctor",
  ready: "Doctor is Ready",
  "in-call": "In Consultation",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function StatusPill({ status }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
        styles[status] || "bg-clinic-sky text-clinic-navy"
      }`}
    >
      {labels[status] || status}
    </span>
  );
}
