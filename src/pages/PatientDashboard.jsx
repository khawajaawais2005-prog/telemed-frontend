import React from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarClock,
  Clock3,
  Stethoscope,
  FileDown,
  FileText,
  ClipboardList,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import StatCard from "../components/StatCard";
import StatusPill from "../components/StatusPill";

export default function PatientDashboard() {
  const { currentPatient, appointments } = useApp();
  const navigate = useNavigate();

  const mine = currentPatient
    ? appointments.filter(
        (a) =>
          a.patientName === currentPatient.fullName ||
          a.id === currentPatient.appointmentId
      )
    : appointments;

  const upcoming = mine.find((a) =>
    ["booked", "waiting", "ready", "in-call"].includes(a.status)
  );
  const past = mine.filter((a) => ["completed", "cancelled"].includes(a.status));
  const allPrescriptions = mine.flatMap((a) =>
    a.prescriptions.map((p) => ({ ...p, appointmentId: a.id, doctor: a.doctorName }))
  );

  const goToNextStep = () => {
    if (!upcoming) return navigate("/booking");
    if (upcoming.status === "booked" && upcoming.symptoms.length === 0 && !upcoming.description) {
      navigate(`/prepare/${upcoming.id}`);
    } else {
      navigate(`/waiting/${upcoming.id}`);
    }
  };

  return (
    <div className="p-5 lg:p-8 space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard icon={CalendarClock} label="Upcoming Appointments" value={mine.filter(a=>["booked","waiting","ready","in-call"].includes(a.status)).length} accent="teal" />
        <StatCard icon={ClipboardList} label="Past Consultations" value={past.length} accent="navy" />
        <StatCard icon={FileText} label="Prescriptions" value={allPrescriptions.length} accent="amber" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <h2 className="font-display font-bold text-clinic-ink mb-4">
            Upcoming Appointment
          </h2>
          {upcoming ? (
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-clinic-sky flex items-center justify-center shrink-0">
                <Stethoscope size={24} className="text-clinic-navy" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-clinic-ink">{upcoming.doctorName}</p>
                <p className="text-sm text-clinic-slate">{upcoming.specialization}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-clinic-slate">
                  <span className="flex items-center gap-1">
                    <CalendarClock size={14} /> {upcoming.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock3 size={14} /> {upcoming.time}
                  </span>
                </div>
                <div className="mt-2">
                  <StatusPill status={upcoming.status} />
                </div>
              </div>
              <button onClick={goToNextStep} className="btn-primary px-5 py-2.5 rounded-xl whitespace-nowrap">
                {upcoming.status === "booked" && upcoming.symptoms.length === 0
                  ? "Add Symptoms"
                  : "Go to Waiting Room"}
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-clinic-slate mb-4">
                You have no upcoming appointment yet.
              </p>
              <button
                onClick={() => navigate("/booking")}
                className="btn-primary px-5 py-2.5 rounded-xl"
              >
                Book an Appointment
              </button>
            </div>
          )}
        </div>

        <div className="card p-6">
          <h2 className="font-display font-bold text-clinic-ink mb-4">
            Patient Profile
          </h2>
          {currentPatient ? (
            <div className="space-y-2 text-sm">
              <ProfileRow label="Name" value={currentPatient.fullName} />
              <ProfileRow label="Gender" value={currentPatient.gender} />
              <ProfileRow label="Phone" value={currentPatient.phone} />
              <ProfileRow label="Email" value={currentPatient.email} />
              <ProfileRow label="Appointment ID" value={currentPatient.appointmentId} />
            </div>
          ) : (
            <p className="text-sm text-clinic-slate">
              Please verify your identity first.
            </p>
          )}
        </div>
      </div>

      <div className="card p-6">
        <h2 className="font-display font-bold text-clinic-ink mb-4">
          Prescriptions &amp; Reports
        </h2>
        {allPrescriptions.length === 0 ? (
          <p className="text-sm text-clinic-slate">
            Prescriptions will appear here after a completed consultation.
          </p>
        ) : (
          <div className="space-y-2">
            {allPrescriptions.map((p, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl bg-clinic-mist"
              >
                <div>
                  <p className="text-sm font-semibold text-clinic-ink">
                    {p.appointmentId} · {p.doctor}
                  </p>
                  <p className="text-xs text-clinic-slate">{p.diagnosis}</p>
                </div>
                <button className="flex items-center gap-1.5 text-xs font-semibold text-clinic-tealDark hover:underline">
                  <FileDown size={14} /> Download
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileRow({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-clinic-slate">{label}</span>
      <span className="font-medium text-clinic-ink">{value || "—"}</span>
    </div>
  );
}
