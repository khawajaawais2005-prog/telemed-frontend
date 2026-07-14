import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Upload, X, FileText } from "lucide-react";
import { useApp } from "../context/AppContext";
import { symptomOptions } from "../data/mockData";

export default function ConsultationPrep() {
  const { appointmentId } = useParams();
  const { appointments, saveSymptoms } = useApp();
  const navigate = useNavigate();
  const appt = appointments.find((a) => a.id === appointmentId);

  const [selected, setSelected] = useState([]);
  const [customSymptom, setCustomSymptom] = useState("");
  const [description, setDescription] = useState("");
  const [allergies, setAllergies] = useState("");
  const [medications, setMedications] = useState("");
  const [reports, setReports] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  if (!appt) {
    return (
      <div className="p-8 text-clinic-slate">Appointment not found.</div>
    );
  }

  const toggleSymptom = (s) => {
    setSelected((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const addCustom = () => {
    if (customSymptom.trim()) {
      setSelected((prev) => [...prev, customSymptom.trim()]);
      setCustomSymptom("");
    }
  };

  const onFile = (setter) => (e) => {
    const files = Array.from(e.target.files || []).map((f) => f.name);
    setter((prev) => [...prev, ...files]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveSymptoms(appt.id, {
      symptoms: selected,
      customSymptoms: customSymptom,
      description,
      allergies,
      medications,
      reports,
      prescriptionUploads: prescriptions,
    });
    navigate(`/waiting/${appt.id}`);
  };

  return (
    <div className="p-5 lg:p-8 max-w-3xl">
      <div className="card p-6 lg:p-8">
        <h2 className="font-display text-lg font-bold text-clinic-ink">
          Tell your doctor how you're feeling
        </h2>
        <p className="text-sm text-clinic-slate mt-1">
          For appointment {appt.id} with {appt.doctorName}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div>
            <p className="text-sm font-semibold text-clinic-ink mb-2">Select symptoms</p>
            <div className="flex flex-wrap gap-2">
              {symptomOptions.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => toggleSymptom(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    selected.includes(s)
                      ? "bg-clinic-teal text-white border-clinic-teal"
                      : "border-clinic-line text-clinic-ink hover:border-clinic-teal"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="flex gap-2 mt-3">
              <input
                value={customSymptom}
                onChange={(e) => setCustomSymptom(e.target.value)}
                placeholder="Add a custom symptom"
                className="flex-1 px-3 py-2 rounded-xl border border-clinic-line text-sm focus:outline-none focus:border-clinic-teal"
              />
              <button
                type="button"
                onClick={addCustom}
                className="px-4 py-2 rounded-xl border border-clinic-line text-sm font-semibold hover:border-clinic-teal"
              >
                Add
              </button>
            </div>
            {selected.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {selected.map((s) => (
                  <span
                    key={s}
                    className="flex items-center gap-1 bg-clinic-sky text-clinic-navy text-xs font-medium px-2.5 py-1 rounded-full"
                  >
                    {s}
                    <X size={12} className="cursor-pointer" onClick={() => toggleSymptom(s)} />
                  </span>
                ))}
              </div>
            )}
          </div>

          <Field label="Describe your symptoms">
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="When did it start? How severe is it?"
              className="w-full px-3 py-2 rounded-xl border border-clinic-line text-sm focus:outline-none focus:border-clinic-teal resize-none"
            />
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Allergies">
              <input
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="e.g. Penicillin"
                className="w-full px-3 py-2 rounded-xl border border-clinic-line text-sm focus:outline-none focus:border-clinic-teal"
              />
            </Field>
            <Field label="Current Medications">
              <input
                value={medications}
                onChange={(e) => setMedications(e.target.value)}
                placeholder="e.g. Metformin 500mg"
                className="w-full px-3 py-2 rounded-xl border border-clinic-line text-sm focus:outline-none focus:border-clinic-teal"
              />
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <UploadBox
              label="Medical Reports (PDF/Image)"
              files={reports}
              onFile={onFile(setReports)}
              onRemove={(i) => setReports((p) => p.filter((_, idx) => idx !== i))}
            />
            <UploadBox
              label="Previous Prescriptions"
              files={prescriptions}
              onFile={onFile(setPrescriptions)}
              onRemove={(i) => setPrescriptions((p) => p.filter((_, idx) => idx !== i))}
            />
          </div>

          <button type="submit" className="btn-primary w-full py-3 rounded-xl">
            Save &amp; Continue to Waiting Room
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-clinic-ink">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function UploadBox({ label, files, onFile, onRemove }) {
  return (
    <div>
      <span className="text-sm font-semibold text-clinic-ink">{label}</span>
      <label className="mt-1.5 flex flex-col items-center justify-center gap-1 border-2 border-dashed border-clinic-line rounded-xl py-5 cursor-pointer hover:border-clinic-teal transition-colors">
        <Upload size={18} className="text-clinic-slate" />
        <span className="text-xs text-clinic-slate">Click to upload</span>
        <input type="file" multiple className="hidden" onChange={onFile} accept=".pdf,image/*" />
      </label>
      {files.length > 0 && (
        <ul className="mt-2 space-y-1">
          {files.map((f, i) => (
            <li
              key={i}
              className="flex items-center justify-between text-xs bg-clinic-mist px-2.5 py-1.5 rounded-lg"
            >
              <span className="flex items-center gap-1.5 truncate">
                <FileText size={12} /> {f}
              </span>
              <X size={12} className="cursor-pointer shrink-0" onClick={() => onRemove(i)} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
