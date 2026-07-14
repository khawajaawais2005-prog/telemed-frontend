import React from "react";

export default function StatCard({ icon: Icon, label, value, accent = "teal" }) {
  const accents = {
    teal: "bg-teal-50 text-clinic-tealDark",
    navy: "bg-clinic-sky text-clinic-navy",
    amber: "bg-amber-50 text-clinic-amber",
    coral: "bg-red-50 text-clinic-coral",
  };
  return (
    <div className="card p-4 flex items-center gap-3">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${accents[accent]}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xl font-display font-bold text-clinic-ink leading-none">
          {value}
        </p>
        <p className="text-xs text-clinic-slate mt-1">{label}</p>
      </div>
    </div>
  );
}
