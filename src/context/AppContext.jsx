import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { initialDoctors } from "../data/mockData";

const AppContext = createContext(null);

function pad(n) {
  return String(n).padStart(2, "0");
}

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Seed one existing appointment 6 minutes from load, so the waiting room /
// countdown / "doctor ready" flow can be demoed immediately without
// waiting a real appointment slot to arrive.
function buildSeedAppointment(doctors) {
  const now = new Date();
  const apptTime = new Date(now.getTime() + 90 * 1000); // ready in 90s
  return {
    id: "APT-1001",
    patientName: "Bilal Ahmed",
    patientAge: 29,
    patientGender: "Male",
    doctorId: doctors[0].id,
    doctorName: doctors[0].name,
    specialization: doctors[0].specialization,
    date: now.toLocaleDateString(),
    time: formatTime(apptTime),
    timeValue: apptTime,
    status: "booked", // booked -> waiting -> ready -> in-call -> completed / cancelled
    queuePosition: 5,
    patientsBefore: 4,
    symptoms: [],
    customSymptoms: "",
    description: "",
    allergies: "",
    medications: "",
    reports: [],
    prescriptions: [],
    diagnosis: "",
    notes: "",
    createdAt: now,
  };
}

export function AppProvider({ children }) {
  const [doctors] = useState(initialDoctors);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [appointments, setAppointments] = useState(() => [
    buildSeedAppointment(initialDoctors),
  ]);
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);

  const pushNotification = useCallback((title, body, type = "info") => {
    const notif = {
      id: `N-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title,
      body,
      type,
      time: new Date(),
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
    setToasts((prev) => [...prev, notif]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== notif.id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  // --- Patient verification -------------------------------------------------
  const verifyPatient = useCallback(
    (formData) => {
      const matched = appointments.find(
        (a) => a.id.toLowerCase() === formData.appointmentId.trim().toLowerCase()
      );
      const patient = {
        fullName: formData.fullName,
        dob: formData.dob,
        gender: formData.gender,
        phone: formData.phone,
        email: formData.email,
        appointmentId: formData.appointmentId.trim(),
        cnic: formData.cnic || "",
        verifiedAt: new Date(),
        verified: true,
      };
      setCurrentPatient(patient);
      if (matched) {
        setAppointments((prev) =>
          prev.map((a) =>
            a.id === matched.id ? { ...a, patientName: formData.fullName } : a
          )
        );
        pushNotification(
          "Verification successful",
          `Welcome back, ${formData.fullName}. Your appointment ${matched.id} is confirmed.`,
          "success"
        );
      } else {
        pushNotification(
          "Verification successful",
          `Welcome, ${formData.fullName}. No existing appointment was found for ID ${formData.appointmentId} — you can book a new one.`,
          "info"
        );
      }
      return matched || null;
    },
    [appointments, pushNotification]
  );

  // --- Booking ---------------------------------------------------------------
  const bookAppointment = useCallback(
    (doctor, slot) => {
      const id = `APT-${Math.floor(1000 + Math.random() * 9000)}`;
      const now = new Date();
      const appt = {
        id,
        patientName: currentPatient?.fullName || "Guest Patient",
        patientAge: currentPatient?.dob
          ? new Date().getFullYear() - new Date(currentPatient.dob).getFullYear()
          : "-",
        patientGender: currentPatient?.gender || "-",
        doctorId: doctor.id,
        doctorName: doctor.name,
        specialization: doctor.specialization,
        date: now.toLocaleDateString(),
        time: slot,
        timeValue: new Date(now.getTime() + 2 * 60 * 1000), // demo: ready in 2 min
        status: "booked",
        queuePosition: Math.floor(Math.random() * 4) + 2,
        patientsBefore: Math.floor(Math.random() * 3) + 1,
        symptoms: [],
        customSymptoms: "",
        description: "",
        allergies: "",
        medications: "",
        reports: [],
        prescriptions: [],
        diagnosis: "",
        notes: "",
        createdAt: now,
      };
      setAppointments((prev) => [appt, ...prev]);
      pushNotification(
        "Appointment booked",
        `${appt.doctorName} on ${appt.date} at ${appt.time}.`,
        "success"
      );
      return appt;
    },
    [currentPatient, pushNotification]
  );

  const saveSymptoms = useCallback(
    (appointmentId, symptomData) => {
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === appointmentId ? { ...a, ...symptomData, status: "waiting" } : a
        )
      );
      pushNotification(
        "Consultation details saved",
        "Your symptoms and documents were shared with your doctor.",
        "info"
      );
    },
    [pushNotification]
  );

  const updateAppointmentStatus = useCallback(
    (appointmentId, status, extra = {}) => {
      setAppointments((prev) =>
        prev.map((a) => (a.id === appointmentId ? { ...a, status, ...extra } : a))
      );
    },
    []
  );

  const writePrescription = useCallback(
    (appointmentId, prescription) => {
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === appointmentId
            ? {
                ...a,
                prescriptions: [...a.prescriptions, prescription],
                diagnosis: prescription.diagnosis || a.diagnosis,
                notes: prescription.notes || a.notes,
              }
            : a
        )
      );
      pushNotification(
        "Prescription available",
        `Your prescription for appointment ${appointmentId} is ready to download.`,
        "success"
      );
    },
    [pushNotification]
  );

  // --- Live countdown / auto status transitions ------------------------------
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setAppointments((prev) =>
        prev.map((a) => {
          if (a.status === "waiting" || a.status === "booked") {
            if (a.timeValue && now >= new Date(a.timeValue)) {
              return { ...a, status: "ready" };
            }
          }
          return a;
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fire a "doctor ready" notification exactly once per appointment
  const [notifiedReady, setNotifiedReady] = useState(new Set());
  useEffect(() => {
    appointments.forEach((a) => {
      if (a.status === "ready" && !notifiedReady.has(a.id)) {
        pushNotification(
          "Doctor is ready",
          `${a.doctorName} is ready to see you now.`,
          "success"
        );
        setNotifiedReady((prev) => new Set(prev).add(a.id));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointments]);

  const value = useMemo(
    () => ({
      doctors,
      currentPatient,
      appointments,
      notifications,
      toasts,
      verifyPatient,
      bookAppointment,
      saveSymptoms,
      updateAppointmentStatus,
      writePrescription,
      pushNotification,
      dismissToast,
      markAllNotificationsRead,
      setCurrentPatient,
    }),
    [
      doctors,
      currentPatient,
      appointments,
      notifications,
      toasts,
      verifyPatient,
      bookAppointment,
      saveSymptoms,
      updateAppointmentStatus,
      writePrescription,
      pushNotification,
      dismissToast,
      markAllNotificationsRead,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export { pad, formatTime };
