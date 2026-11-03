import React from 'react';
import { X, PlusCircle } from 'lucide-react';

export default function AddUpdateModal({
  isOpen,
  onClose,
  updateRecordTarget,
  newUpdateText,
  setNewUpdateText,
  onSave,
}) {
  if (!isOpen || !updateRecordTarget) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 flex flex-col gap-4 text-xs animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <PlusCircle size={16} className="text-[#5455EE]" />
            <h4 className="text-sm font-bold text-slate-900">
              Add Follow-up Note ({updateRecordTarget.id})
            </h4>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
          <span className="font-bold text-slate-800 block mb-0.5">Existing Case:</span>
          <p className="line-clamp-2">{updateRecordTarget.title}</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-slate-700">
            New update or additional context:
          </label>
          <textarea
            rows={4}
            value={newUpdateText}
            onChange={(e) => setNewUpdateText(e.target.value)}
            placeholder="e.g. A colleague transferred another sprint ticket today without discussion, making the deadline unachievable..."
            className="p-3 rounded-xl border border-slate-200 text-xs text-slate-800 bg-[#F4F5FA] outline-none focus:border-[#5455EE] leading-relaxed"
          />
          <span className="text-[10px] text-slate-400">
            This note will be appended directly to your existing case history for HR review.
          </span>
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
            onClick={onSave}
            disabled={!newUpdateText.trim()}
            className="px-4 py-2 rounded-xl bg-[#5455EE] disabled:opacity-40 text-white font-bold hover:bg-[#4344dd] transition-colors cursor-pointer shadow-sm"
          >
            Append Update
          </button>
        </div>
      </div>
    </div>
  );
}
