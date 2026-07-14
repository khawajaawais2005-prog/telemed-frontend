import React from "react";
import { FileDown, Stethoscope } from "lucide-react";
import { useApp } from "../context/AppContext";
import StatusPill from "../components/StatusPill";

export default function PatientHistory() {
  const { currentPatient, appointments } = useApp();

  const mine = currentPatient
    ? appointments.filter(
        (a) =>
          a.patientName === currentPatient.fullName ||
          a.id === currentPatient.appointmentId
      )
    : appointments;

  const sorted = [...mine].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="p-5 lg:p-8 space-y-4">
      {sorted.length === 0 ? (
        <div className="card p-8 text-center text-sm text-clinic-slate">
          No consultation history yet.
        </div>
      ) : (
        sorted.map((a) => (
          <div key={a.id} className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-clinic-sky flex items-center justify-center">
                  <Stethoscope size={18} className="text-clinic-navy" />
                </div>
                <div>
                  <p className="font-semibold text-clinic-ink">{a.doctorName}</p>
                  <p className="text-xs text-clinic-slate">
                    {a.date} · {a.time} · {a.id}
                  </p>
                </div>
              </div>
              <StatusPill status={a.status} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-4 text-sm">
              <div>
                <p className="text-xs text-clinic-slate">Symptoms</p>
                <p className="text-clinic-ink">{a.symptoms?.join(", ") || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-clinic-slate">Diagnosis</p>
                <p className="text-clinic-ink">{a.diagnosis || "—"}</p>
              </div>
            </div>

            {a.prescriptions?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {a.prescriptions.map((p, i) => (
                  <button
                    key={i}
                    className="flex items-center gap-1.5 text-xs font-semibold text-clinic-tealDark border border-clinic-line px-3 py-1.5 rounded-lg hover:border-clinic-teal"
                  >
                    <FileDown size={13} /> Prescription #{i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
