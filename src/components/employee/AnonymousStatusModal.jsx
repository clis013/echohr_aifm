import React from 'react';
import { X, Calendar } from 'lucide-react';

export default function AnonymousStatusModal({
  isOpen,
  onClose,
  searchRefCode,
  setSearchRefCode,
  statusResult,
  onCheckStatus,
  onOpenFollowUp,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-[#EBECEF] rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col gap-5 max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
        <div className="border-b border-slate-100 pb-3 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Check Report Status by Reference Code
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter your anonymous reference code to view progress updates and agreed actions.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            title="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            value={searchRefCode}
            onChange={(e) => setSearchRefCode(e.target.value)}
            placeholder="Enter reference code (e.g. ANON-4827)"
            className="flex-1 p-3 rounded-2xl border border-slate-200 text-xs font-mono font-bold text-slate-900 bg-[#F4F5FA] outline-none focus:border-[#5455EE]"
          />
          <button
            type="button"
            onClick={onCheckStatus}
            className="px-5 py-3 rounded-2xl bg-[#5455EE] text-white font-bold hover:bg-[#4344dd] transition-all cursor-pointer shadow-sm text-xs"
          >
            Check Status
          </button>
        </div>

        {statusResult ? (
          <div className="p-5 rounded-2xl bg-[#F8F9FD] border border-[#5455EE]/30 flex flex-col gap-3 animate-in fade-in">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                  Reference Code: {statusResult.ref}
                </span>
                <h4 className="text-base font-extrabold text-slate-900 mt-0.5">
                  Your report: {statusResult.title}
                </h4>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                {statusResult.status}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed whitespace-pre-line shadow-2xs">
              {statusResult.response}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-200 pt-2">
              <span>Last updated: {statusResult.lastUpdated}</span>
              <span>Next progress review: {statusResult.nextUpdate}</span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={onOpenFollowUp}
                className="px-3 py-1.5 rounded-xl bg-[#EEF0FF] text-[#5455EE] hover:bg-[#E0E3FF] font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Calendar size={13} />
                <span>Simulated Follow-Up (3 Nov 2026)</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs">
            Click <strong>Check Status</strong> above to view R004 / ANON-4827 triage updates.
          </div>
        )}

        {/* Close Button in Modal Footer */}
        <div className="flex items-center justify-end pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
