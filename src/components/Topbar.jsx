import React, { useState } from "react";
import { Bell, Menu } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Topbar({ title, subtitle }) {
  const { notifications, markAllNotificationsRead } = useApp();
  const [open, setOpen] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-clinic-line px-5 lg:px-8 py-4 flex items-center justify-between">
      <div>
        <h1 className="font-display text-xl font-bold text-clinic-ink">{title}</h1>
        {subtitle && <p className="text-sm text-clinic-slate mt-0.5">{subtitle}</p>}
      </div>

      <div className="relative">
        <button
          onClick={() => {
            setOpen((v) => !v);
            if (!open) markAllNotificationsRead();
          }}
          className="relative w-10 h-10 rounded-full bg-clinic-sky flex items-center justify-center hover:bg-clinic-line transition-colors"
        >
          <Bell size={18} className="text-clinic-navy" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-clinic-coral text-white text-[10px] font-bold flex items-center justify-center">
              {unread}
            </span>
          )}
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto card p-2 animate-slideUp">
            {notifications.length === 0 ? (
              <p className="text-sm text-clinic-slate p-4 text-center">
                No notifications yet.
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-3 rounded-lg hover:bg-clinic-mist transition-colors"
                >
                  <p className="text-sm font-semibold text-clinic-ink">{n.title}</p>
                  <p className="text-xs text-clinic-slate mt-0.5">{n.body}</p>
                  <p className="text-[10px] text-clinic-slate/70 mt-1">
                    {n.time.toLocaleTimeString()}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </header>
  );
}
