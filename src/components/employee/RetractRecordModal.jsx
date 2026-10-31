import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function RetractRecordModal({
  isOpen,
  onClose,
  retractRecordTarget,
  onConfirm,
}) {
  if (!isOpen || !retractRecordTarget) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 flex flex-col gap-4 text-xs animate-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3 text-amber-600">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center flex-shrink-0 border border-amber-200">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h4 className="text-base font-extrabold text-slate-900">
              Withdraw Submission ({retractRecordTarget.displayId || retractRecordTarget.id})?
            </h4>
            <p className="text-slate-500 text-[11px] mt-0.5">
              {retractRecordTarget.title}
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-[11px] text-amber-950 leading-relaxed">
          <strong>Notice:</strong> Withdrawing this submission will immediately remove it from the HR triage queue—HR will no longer see it. It will remain in your records marked as <strong>Withdrawn</strong> and will be permanently deleted after 30 days.
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 transition-colors cursor-pointer shadow-sm"
          >
            Confirm Withdrawal (Delete after 30 days)
          </button>
        </div>
      </div>
    </div>
  );
}
