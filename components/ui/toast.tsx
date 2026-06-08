"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, X, Info, Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info" | "loading" | "warning";

interface ToastProps {
  id: string;
  message: string;
  type?: ToastType;
  onClose: (id: string) => void;
}

export function Toast({ id, message, type = "info", onClose }: ToastProps) {
  useEffect(() => {
    if (type !== "loading") {
      const timer = setTimeout(() => onClose(id), 5000);
      return () => clearTimeout(timer);
    }
  }, [id, type, onClose]);

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    loading: <Loader2 className="h-5 w-5 text-brand-600 animate-spin" />,
  };

  const styles = {
    success: "border-emerald-100 bg-emerald-50/50",
    error: "border-red-100 bg-red-50/50",
    info: "border-blue-100 bg-blue-50/50",
    warning: "border-amber-100 bg-amber-50/50",
    loading: "border-brand-100 bg-brand-50/50",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={cn(
        "flex items-center gap-4 p-4 min-w-[320px] max-w-md rounded-2xl border shadow-xl backdrop-blur-md",
        styles[type]
      )}
    >
      <div className="flex-shrink-0">{icons[type]}</div>
      <div className="flex-grow">
        <p className="text-sm font-bold text-brand-950 leading-snug">
          {message}
        </p>
      </div>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 p-1 rounded-full hover:bg-black/5 transition-colors"
      >
        <X className="h-4 w-4 text-brand-950/20" />
      </button>
    </motion.div>
  );
}

// Hook personalizado para usar el sistema de notificaciones
export function useToast() {
  const [toasts, setToasts] = useState<{ id: string; message: string; type: ToastType }[]>([]);

  const showToast = (message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, showToast, removeToast };
}
