import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import ToastStack from "./components/ToastStack";
import PatientVerification from "./pages/PatientVerification";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorBooking from "./pages/DoctorBooking";
import ConsultationPrep from "./pages/ConsultationPrep";
import WaitingRoom from "./pages/WaitingRoom";
import VideoConsultation from "./pages/VideoConsultation";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientHistory from "./pages/PatientHistory";

const titleMap = {
  "/dashboard": ["My Dashboard", "Your appointments, prescriptions, and reports"],
  "/booking": ["Book Appointment", "Choose a doctor and an available time slot"],
  "/history": ["History & Records", "Every past consultation in one place"],
  "/doctor": ["Doctor Dashboard", "Manage your patient queue and consultations"],
};

function DashboardLayout({ children }) {
  const location = useLocation();
  const base = "/" + location.pathname.split("/")[1];
  const [title, subtitle] = titleMap[base] || ["MediConnect", ""];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Topbar title={title} subtitle={subtitle} />
        {children}
      </div>
      <ToastStack />
    </div>
  );
}

// Pages that render inside the full sidebar + topbar shell.
const shellRoutes = ["/dashboard", "/booking", "/history", "/doctor", "/prepare", "/waiting"];

export default function App() {
  const location = useLocation();
  const needsShell = shellRoutes.some((r) => location.pathname.startsWith(r));

  const routes = (
    <Routes>
      <Route path="/" element={<PatientVerification />} />
      <Route path="/dashboard" element={<PatientDashboard />} />
      <Route path="/booking" element={<DoctorBooking />} />
      <Route path="/prepare/:appointmentId" element={<ConsultationPrep />} />
      <Route path="/waiting/:appointmentId" element={<WaitingRoom />} />
      <Route path="/call/:appointmentId" element={<VideoConsultation />} />
      <Route path="/doctor" element={<DoctorDashboard />} />
      <Route path="/history" element={<PatientHistory />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );

  if (!needsShell) return routes;
  return <DashboardLayout>{routes}</DashboardLayout>;
}
