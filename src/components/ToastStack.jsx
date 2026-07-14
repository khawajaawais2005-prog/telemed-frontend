import React from "react";
import { CheckCircle2, Info, X } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function ToastStack() {
  const { toasts, dismissToast } = useApp();
  return (
    <div className="fixed bottom-5 right-5 z-50 space-y-2 w-80">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="card p-3 flex items-start gap-3 animate-toastIn shadow-pop"
        >
          {t.type === "success" ? (
            <CheckCircle2 size={18} className="text-clinic-teal mt-0.5 shrink-0" />
          ) : (
            <Info size={18} className="text-clinic-navy mt-0.5 shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-clinic-ink">{t.title}</p>
            <p className="text-xs text-clinic-slate mt-0.5">{t.body}</p>
          </div>
          <button
            onClick={() => dismissToast(t.id)}
            className="text-clinic-slate hover:text-clinic-ink"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
