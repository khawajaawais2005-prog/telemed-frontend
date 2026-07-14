import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Eye,
  Video,
  FileSignature,
  X,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import StatCard from "../components/StatCard";
import StatusPill from "../components/StatusPill";

const tabs = [
  { key: "today", label: "Today's Patients", filter: (a) => a.status !== "cancelled" },
  { key: "queue", label: "Patient Queue", filter: (a) => ["waiting", "ready"].includes(a.status) },
  { key: "upcoming", label: "Upcoming", filter: (a) => a.status === "booked" },
  { key: "completed", label: "Completed", filter: (a) => a.status === "completed" },
  { key: "cancelled", label: "Cancelled", filter: (a) => a.status === "cancelled" },
];

export default function DoctorDashboard() {
  const { appointments, updateAppointmentStatus, writePrescription } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState("today");
  const [detailsFor, setDetailsFor] = useState(null);
  const [rxFor, setRxFor] = useState(null);

  const active = tabs.find((t) => t.key === tab);
  const list = appointments.filter(active.filter);

  const counts = {
    today: appointments.filter((a) => a.status !== "cancelled").length,
    waiting: appointments.filter((a) => ["waiting", "ready"].includes(a.status)).length,
    completed: appointments.filter((a) => a.status === "completed").length,
    cancelled: appointments.filter((a) => a.status === "cancelled").length,
  };

  return (
    <div className="p-5 lg:p-8 space-y-6">
      <div className="grid sm:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Today's Patients" value={counts.today} accent="navy" />
        <StatCard icon={CalendarCheck} label="In Queue" value={counts.waiting} accent="teal" />
        <StatCard icon={CheckCircle2} label="Completed" value={counts.completed} accent="amber" />
        <StatCard icon={XCircle} label="Cancelled" value={counts.cancelled} accent="coral" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
              tab === t.key
                ? "bg-clinic-navy text-white"
                : "bg-white border border-clinic-line text-clinic-slate hover:text-clinic-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {list.length === 0 ? (
          <div className="card p-8 text-center text-sm text-clinic-slate">
            No patients in this list.
          </div>
        ) : (
          list.map((a) => (
            <div key={a.id} className="card p-4 flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex-1 grid sm:grid-cols-4 gap-3 text-sm">
                <div>
                  <p className="font-semibold text-clinic-ink">{a.patientName}</p>
                  <p className="text-xs text-clinic-slate">
                    {a.patientAge !== "-" ? `${a.patientAge} yrs` : ""} {a.patientGender}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-clinic-slate">Appointment</p>
                  <p className="font-medium text-clinic-ink">{a.date} · {a.time}</p>
                </div>
                <div>
                  <p className="text-xs text-clinic-slate">Queue Position</p>
                  <p className="font-medium text-clinic-ink">#{a.queuePosition}</p>
                </div>
                <div>
                  <StatusPill status={a.status} />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <ActionBtn icon={Eye} label="View Details" onClick={() => setDetailsFor(a)} />
                <ActionBtn
                  icon={Video}
                  label="Join Consultation"
                  onClick={() => navigate(`/call/${a.id}`)}
                  primary
                />
                <ActionBtn
                  icon={CheckCircle2}
                  label="Mark Completed"
                  onClick={() => updateAppointmentStatus(a.id, "completed")}
                />
                <ActionBtn
                  icon={XCircle}
                  label="Cancel"
                  onClick={() => updateAppointmentStatus(a.id, "cancelled")}
                  danger
                />
                <ActionBtn icon={FileSignature} label="Write Prescription" onClick={() => setRxFor(a)} />
              </div>
            </div>
          ))
        )}
      </div>

      {detailsFor && (
        <DetailsModal appt={detailsFor} onClose={() => setDetailsFor(null)} />
      )}
      {rxFor && (
        <PrescriptionModal
          appt={rxFor}
          onClose={() => setRxFor(null)}
          onSave={(rx) => {
            writePrescription(rxFor.id, rx);
            setRxFor(null);
          }}
        />
      )}
    </div>
  );
}

function ActionBtn({ icon: Icon, label, onClick, primary, danger }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
        primary
          ? "bg-clinic-teal text-white border-clinic-teal hover:brightness-95"
          : danger
          ? "border-red-200 text-clinic-coral hover:bg-red-50"
          : "border-clinic-line text-clinic-ink hover:border-clinic-teal"
      }`}
    >
      <Icon size={14} /> {label}
    </button>
  );
}

function DetailsModal({ appt, onClose }) {
  return (
    <Modal onClose={onClose} title={`${appt.patientName} — ${appt.id}`}>
      <div className="space-y-3 text-sm">
        <Row label="Symptoms" value={appt.symptoms?.join(", ") || "Not provided"} />
        <Row label="Description" value={appt.description || "—"} />
        <Row label="Allergies" value={appt.allergies || "None reported"} />
        <Row label="Medications" value={appt.medications || "None reported"} />
        <Row label="Uploaded Reports" value={appt.reports?.join(", ") || "None"} />
        <Row label="Previous Prescriptions" value={appt.prescriptionUploads?.join(", ") || "None"} />
      </div>
    </Modal>
  );
}

function PrescriptionModal({ appt, onClose, onSave }) {
  const [diagnosis, setDiagnosis] = useState("");
  const [medicines, setMedicines] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <Modal onClose={onClose} title={`Write Prescription — ${appt.patientName}`}>
      <div className="space-y-3">
        <label className="block">
          <span className="text-xs font-semibold text-clinic-slate">Diagnosis</span>
          <input
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            className="mt-1 w-full px-3 py-2 rounded-lg border border-clinic-line text-sm focus:outline-none focus:border-clinic-teal"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-clinic-slate">Medicines</span>
          <textarea
            rows={3}
            value={medicines}
            onChange={(e) => setMedicines(e.target.value)}
            className="mt-1 w-full px-3 py-2 rounded-lg border border-clinic-line text-sm focus:outline-none focus:border-clinic-teal resize-none"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-clinic-slate">Notes</span>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 w-full px-3 py-2 rounded-lg border border-clinic-line text-sm focus:outline-none focus:border-clinic-teal resize-none"
          />
        </label>
        <button
          onClick={() => onSave({ diagnosis, medicines, notes, issuedAt: new Date() })}
          className="btn-primary w-full py-2.5 rounded-xl"
        >
          Save Prescription
        </button>
      </div>
    </Modal>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="card w-full max-w-md p-6 animate-slideUp">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-clinic-ink">{title}</h3>
          <button onClick={onClose} className="text-clinic-slate hover:text-clinic-ink">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div>
      <p className="text-xs text-clinic-slate">{label}</p>
      <p className="text-clinic-ink font-medium">{value}</p>
    </div>
  );
}
