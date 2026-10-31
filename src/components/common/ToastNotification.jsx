import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ToastNotification() {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] bg-white/95 backdrop-blur-md text-slate-800 text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl border border-slate-200/90 animate-in fade-in slide-in-from-top-3 duration-200 flex items-center gap-2.5 pointer-events-none">
      <CheckCircle2 size={16} className="text-[#5455EE] flex-shrink-0" />
      <span>{toastMessage}</span>
    </div>
  );
}
