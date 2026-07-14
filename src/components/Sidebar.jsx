import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarPlus,
  Clock,
  Video,
  Stethoscope,
  History,
  HeartPulse,
} from "lucide-react";

const patientLinks = [
  { to: "/dashboard", label: "My Dashboard", icon: LayoutDashboard },
  { to: "/booking", label: "Book Appointment", icon: CalendarPlus },
  { to: "/history", label: "History & Records", icon: History },
];

const doctorLinks = [{ to: "/doctor", label: "Doctor Dashboard", icon: Stethoscope }];

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 bg-clinic-navy text-white">
      <div className="flex items-center gap-2 px-6 py-6">
        <div className="w-9 h-9 rounded-xl bg-clinic-teal flex items-center justify-center">
          <HeartPulse size={20} className="text-white" />
        </div>
        <div>
          <p className="font-display font-bold leading-none">MediConnect</p>
          <p className="text-[11px] text-white/50 mt-0.5">Telemedicine Platform</p>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1 mt-4">
        <p className="px-3 text-[11px] uppercase tracking-wider text-white/40 mb-2">
          Patient
        </p>
        {patientLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <link.icon size={18} />
            {link.label}
          </NavLink>
        ))}

        <p className="px-3 text-[11px] uppercase tracking-wider text-white/40 mb-2 mt-6">
          Clinical Staff
        </p>
        {doctorLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <link.icon size={18} />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mx-3 mb-4 rounded-xl bg-white/5 flex items-center gap-3 text-xs text-white/70">
        <Clock size={16} className="text-clinic-teal shrink-0" />
        <span>Camera &amp; mic only activate when you tap “Join Consultation”.</span>
      </div>
    </aside>
  );
}
