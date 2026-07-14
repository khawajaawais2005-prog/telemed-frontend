import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeartPulse, ShieldCheck, User, CalendarClock, Loader2 } from "lucide-react";
import { useApp } from "../context/AppContext";

const emptyForm = {
  fullName: "",
  dob: "",
  gender: "",
  phone: "",
  email: "",
  appointmentId: "",
  cnic: "",
};

export default function PatientVerification() {
  const { verifyPatient } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // matched appointment or null after verify
  const [verified, setVerified] = useState(false);

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required";
    if (!form.dob) next.dob = "Date of birth is required";
    if (!form.gender) next.gender = "Please select a gender";
    if (!/^\+?[0-9\s-]{7,15}$/.test(form.phone))
      next.phone = "Enter a valid phone number";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email";
    if (!form.appointmentId.trim()) next.appointmentId = "Appointment ID is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      const matched = verifyPatient(form);
      setResult(matched);
      setVerified(true);
      setLoading(false);
    }, 700);
  };

  if (verified) {
    return (
      <div className="min-h-screen bg-clinic-navy flex items-center justify-center p-6">
        <div className="card max-w-md w-full p-8 text-center animate-slideUp">
          <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mx-auto">
            <ShieldCheck size={30} className="text-clinic-teal" />
          </div>
          <h2 className="font-display text-xl font-bold text-clinic-ink mt-4">
            Identity Verified
          </h2>
          <p className="text-sm text-clinic-slate mt-1">
            {result
              ? "We found your appointment. Here are the details."
              : "No matching appointment was found — you can book a new one from your dashboard."}
          </p>

          <div className="mt-6 text-left bg-clinic-mist rounded-xl p-4 space-y-2.5">
            <Row label="Patient Name" value={form.fullName} />
            <Row label="Appointment ID" value={form.appointmentId} />
            <Row
              label="Assigned Doctor"
              value={result ? result.doctorName : "Not yet assigned"}
            />
            <Row label="Appointment Date" value={result ? result.date : "—"} />
            <Row label="Appointment Time" value={result ? result.time : "—"} />
            <Row
              label="Verification Status"
              value="Verified ✓"
              highlight
            />
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="btn-primary w-full mt-6 py-3 rounded-xl"
          >
            Go to Appointment Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-clinic-navy flex items-center justify-center p-6">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 rounded-2xl overflow-hidden shadow-pop">
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-clinic-deep to-clinic-teal p-10 text-white">
          <div>
            <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
              <HeartPulse size={22} />
            </div>
            <h1 className="font-display text-2xl font-bold mt-6 leading-tight">
              Secure Patient
              <br />
              Verification
            </h1>
            <p className="text-white/75 text-sm mt-3 max-w-xs">
              Confirm your identity before every consultation so your doctor
              always has the right medical record in front of them.
            </p>
          </div>
          <div className="space-y-3 text-sm text-white/85">
            <Feature icon={ShieldCheck} text="Your data is encrypted and confidential" />
            <Feature icon={User} text="One profile, every past visit" />
            <Feature icon={CalendarClock} text="Matched instantly to your appointment" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 space-y-4">
          <h2 className="font-display text-lg font-bold text-clinic-ink">
            Verify your details
          </h2>
          <p className="text-sm text-clinic-slate -mt-2">
            Tip: try appointment ID <span className="font-semibold">APT-1001</span> to
            see a pre-booked appointment.
          </p>

          <Field label="Full Name" error={errors.fullName}>
            <input
              className="input"
              value={form.fullName}
              onChange={update("fullName")}
              placeholder="e.g. Bilal Ahmed"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Date of Birth" error={errors.dob}>
              <input
                type="date"
                className="input"
                value={form.dob}
                onChange={update("dob")}
              />
            </Field>
            <Field label="Gender" error={errors.gender}>
              <select className="input" value={form.gender} onChange={update("gender")}>
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Phone Number" error={errors.phone}>
              <input
                className="input"
                value={form.phone}
                onChange={update("phone")}
                placeholder="+92 300 1234567"
              />
            </Field>
            <Field label="Email" error={errors.email}>
              <input
                className="input"
                value={form.email}
                onChange={update("email")}
                placeholder="you@email.com"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Appointment ID" error={errors.appointmentId}>
              <input
                className="input"
                value={form.appointmentId}
                onChange={update("appointmentId")}
                placeholder="APT-1001"
              />
            </Field>
            <Field label="CNIC (Optional)">
              <input
                className="input"
                value={form.cnic}
                onChange={update("cnic")}
                placeholder="42101-1234567-1"
              />
            </Field>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 rounded-xl flex items-center justify-center gap-2 mt-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>
        </form>
      </div>

      <style>{`
        .input {
          width: 100%;
          border: 1px solid #DCE7EC;
          border-radius: 0.75rem;
          padding: 0.6rem 0.8rem;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.15s ease;
          background: white;
        }
        .input:focus {
          border-color: #0EA5A0;
          box-shadow: 0 0 0 3px rgba(14,165,160,0.12);
        }
      `}</style>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-clinic-slate">{label}</span>
      <div className="mt-1">{children}</div>
      {error && <span className="text-[11px] text-clinic-coral">{error}</span>}
    </label>
  );
}

function Row({ label, value, highlight }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-clinic-slate">{label}</span>
      <span
        className={`font-semibold ${
          highlight ? "text-clinic-teal" : "text-clinic-ink"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function Feature({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={16} />
      <span>{text}</span>
    </div>
  );
}
