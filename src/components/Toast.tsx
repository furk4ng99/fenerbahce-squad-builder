"use client";

import { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
    message: string;
    type: ToastType;
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

export function Toast({ message, type, isVisible, onClose, duration = 3000 }: ToastProps) {
    useEffect(() => {
        if (isVisible && duration > 0) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    if (!isVisible) return null;

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-green-400" />,
        error: <AlertCircle className="w-5 h-5 text-red-400" />,
        info: <Info className="w-5 h-5 text-blue-400" />,
    };

    const bgColors = {
        success: "bg-green-900/90 border-green-500/50",
        error: "bg-red-900/90 border-red-500/50",
        info: "bg-blue-900/90 border-blue-500/50",
    };

    return (
        <div
            className={cn(
                "fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-4 py-3 rounded-lg border backdrop-blur-md shadow-2xl flex items-center gap-3 animate-fade-in-up",
                bgColors[type]
            )}
        >
            {icons[type]}
            <span className="text-white text-sm font-medium">{message}</span>
            <button
                onClick={onClose}
                className="ml-2 text-white/60 hover:text-white transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}

// Toast hook for easier usage
export function useToast() {
    const [toast, setToast] = useState<{
        message: string;
        type: ToastType;
        isVisible: boolean;
    }>({
        message: "",
        type: "info",
        isVisible: false,
    });

    const showToast = (message: string, type: ToastType = "info") => {
        setToast({ message, type, isVisible: true });
    };

    const hideToast = () => {
        setToast((prev) => ({ ...prev, isVisible: false }));
    };

    return { toast, showToast, hideToast };
}
