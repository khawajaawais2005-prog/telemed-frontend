import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Clock3, Users, Video, ShieldOff } from "lucide-react";
import { useApp } from "../context/AppContext";
import StatusPill from "../components/StatusPill";

function diffToClock(ms) {
  if (ms <= 0) return "00:00:00";
  const totalSec = Math.floor(ms / 1000);
  const h = String(Math.floor(totalSec / 3600)).padStart(2, "0");
  const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
  const s = String(totalSec % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export default function WaitingRoom() {
  const { appointmentId } = useParams();
  const { appointments } = useApp();
  const navigate = useNavigate();
  const appt = appointments.find((a) => a.id === appointmentId);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!appt) return <div className="p-8 text-clinic-slate">Appointment not found.</div>;

  const remainingMs = appt.timeValue ? new Date(appt.timeValue) - now : 0;
  const isReady = appt.status === "ready" || appt.status === "in-call";

  return (
    <div className="p-5 lg:p-8 max-w-3xl">
      <div className="card p-6 lg:p-10 text-center">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
            isReady ? "bg-teal-50 animate-pulseRing" : "bg-clinic-sky"
          }`}
        >
          <Clock3 size={28} className={isReady ? "text-clinic-teal" : "text-clinic-navy"} />
        </div>

        <h2 className="font-display text-xl font-bold text-clinic-ink mt-4">
          {isReady ? "Doctor is Ready" : "You're in the Waiting Room"}
        </h2>
        <p className="text-sm text-clinic-slate mt-1">
          Please stay on this page. We'll notify you the moment {appt.doctorName} is ready.
        </p>

        <div className="mt-3">
          <StatusPill status={appt.status} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mt-8 text-left">
          <InfoTile label="Doctor" value={appt.doctorName} />
          <InfoTile label="Appointment Time" value={appt.time} />
          <InfoTile label="Current Time" value={now.toLocaleTimeString()} />
          <InfoTile
            label="Remaining Time"
            value={isReady ? "00:00:00" : diffToClock(remainingMs)}
            emphasize
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mt-4">
          <InfoTile icon={Users} label="Queue Position" value={`#${appt.queuePosition}`} />
          <InfoTile label="Patients Before You" value={appt.patientsBefore} />
          <InfoTile label="Est. Waiting Time" value={`${appt.patientsBefore * 5} min`} />
        </div>

        <div className="mt-8">
          {isReady ? (
            <button
              onClick={() => navigate(`/call/${appt.id}`)}
              className="btn-primary px-8 py-4 rounded-2xl text-base flex items-center gap-2 mx-auto"
            >
              <Video size={20} /> Join Consultation
            </button>
          ) : (
            <p className="flex items-center justify-center gap-2 text-xs text-clinic-slate">
              <ShieldOff size={14} /> Camera and microphone are not requested here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoTile({ icon: Icon, label, value, emphasize }) {
  return (
    <div className="bg-clinic-mist rounded-xl p-4">
      <p className="text-xs text-clinic-slate flex items-center gap-1">
        {Icon && <Icon size={12} />} {label}
      </p>
      <p
        className={`mt-1 font-display font-bold ${
          emphasize ? "text-2xl text-clinic-tealDark" : "text-base text-clinic-ink"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
