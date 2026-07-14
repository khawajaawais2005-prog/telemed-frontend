import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  ScreenShare,
  MessageSquare,
  PhoneOff,
  Wifi,
  Send,
  Circle,
} from "lucide-react";
import { useApp } from "../context/AppContext";

export default function VideoConsultation() {
  const { appointmentId } = useParams();
  const { appointments, updateAppointmentStatus } = useApp();
  const navigate = useNavigate();
  const appt = appointments.find((a) => a.id === appointmentId);

  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [permissionError, setPermissionError] = useState("");
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [connection] = useState("Stable");

  // Camera & microphone are requested ONLY here, once, after the patient
  // has already clicked "Join Consultation" in the waiting room.
  useEffect(() => {
    let active = true;
    updateAppointmentStatus(appointmentId, "in-call");
    navigator.mediaDevices
      ?.getUserMedia({ video: true, audio: true })
      .then((s) => {
        if (!active) return;
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;
      })
      .catch(() => setPermissionError("Camera/microphone access was denied."));

    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => {
      active = false;
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentId]);

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [stream]);

  if (!appt) return <div className="p-8 text-clinic-slate">Appointment not found.</div>;

  const toggleMic = () => {
    stream?.getAudioTracks().forEach((t) => (t.enabled = !micOn));
    setMicOn((v) => !v);
  };
  const toggleCam = () => {
    stream?.getVideoTracks().forEach((t) => (t.enabled = !camOn));
    setCamOn((v) => !v);
  };
  const endCall = () => {
    stream?.getTracks().forEach((t) => t.stop());
    updateAppointmentStatus(appointmentId, "completed");
    navigate("/dashboard");
  };
  const sendMessage = () => {
    if (!chatInput.trim()) return;
    setMessages((m) => [...m, { from: "You", text: chatInput.trim() }]);
    setChatInput("");
  };

  const fmt = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="h-screen bg-clinic-navy text-white flex flex-col">
      <div className="flex items-center justify-between px-5 py-3 bg-black/20">
        <div className="flex items-center gap-3 text-sm">
          <span className="flex items-center gap-1.5">
            <Circle size={8} className="fill-red-500 text-red-500" /> Live · {fmt(seconds)}
          </span>
          <span className="flex items-center gap-1.5 text-white/70">
            <Wifi size={14} /> {connection}
          </span>
        </div>
        <p className="text-sm font-semibold">{appt.doctorName} · {appt.specialization}</p>
      </div>

      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {permissionError ? (
          <p className="text-white/70 text-sm max-w-sm text-center">{permissionError}</p>
        ) : (
          <div className="w-full h-full bg-black/40 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-clinic-teal/30 flex items-center justify-center mx-auto text-3xl font-display font-bold">
                {appt.doctorName?.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>
              <p className="mt-3 text-white/70 text-sm">Waiting for {appt.doctorName}'s video…</p>
            </div>
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className={`absolute bottom-5 right-5 w-40 h-28 sm:w-56 sm:h-40 rounded-xl border-2 border-white/20 object-cover bg-black ${
            camOn ? "" : "hidden"
          }`}
        />
        {!camOn && (
          <div className="absolute bottom-5 right-5 w-40 h-28 sm:w-56 sm:h-40 rounded-xl border-2 border-white/20 bg-black/60 flex items-center justify-center text-xs text-white/60">
            Camera Off
          </div>
        )}

        {screenSharing && (
          <div className="absolute top-4 left-4 bg-clinic-coral text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
            <ScreenShare size={12} /> Sharing screen
          </div>
        )}

        {chatOpen && (
          <div className="absolute right-0 top-0 h-full w-80 bg-white text-clinic-ink flex flex-col shadow-pop">
            <div className="p-4 border-b border-clinic-line font-semibold">Chat</div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {messages.length === 0 ? (
                <p className="text-xs text-clinic-slate">No messages yet.</p>
              ) : (
                messages.map((m, i) => (
                  <div key={i} className="text-sm bg-clinic-mist rounded-lg p-2">
                    <span className="font-semibold">{m.from}: </span>
                    {m.text}
                  </div>
                ))
              )}
            </div>
            <div className="p-3 border-t border-clinic-line flex gap-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message"
                className="flex-1 px-3 py-2 rounded-lg border border-clinic-line text-sm focus:outline-none focus:border-clinic-teal"
              />
              <button onClick={sendMessage} className="btn-primary px-3 rounded-lg">
                <Send size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-3 py-5 bg-black/20">
        <CtrlBtn onClick={toggleMic} active={micOn} on={<Mic size={18} />} off={<MicOff size={18} />} />
        <CtrlBtn onClick={toggleCam} active={camOn} on={<Video size={18} />} off={<VideoOff size={18} />} />
        <CtrlBtn
          onClick={() => setScreenSharing((v) => !v)}
          active={!screenSharing}
          on={<ScreenShare size={18} />}
          off={<ScreenShare size={18} />}
        />
        <CtrlBtn
          onClick={() => setChatOpen((v) => !v)}
          active={!chatOpen}
          on={<MessageSquare size={18} />}
          off={<MessageSquare size={18} />}
        />
        <button
          onClick={endCall}
          className="w-14 h-11 rounded-full bg-clinic-coral hover:brightness-95 flex items-center justify-center"
        >
          <PhoneOff size={18} />
        </button>
      </div>
    </div>
  );
}

function CtrlBtn({ onClick, active, on, off }) {
  return (
    <button
      onClick={onClick}
      className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
        active ? "bg-white/10 hover:bg-white/20" : "bg-clinic-coral"
      }`}
    >
      {active ? on : off}
    </button>
  );
}
