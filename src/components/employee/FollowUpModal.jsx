import React from 'react';
import { X, Calendar } from 'lucide-react';
import { MAYA_PROFILE } from '../../data/mockData';

export default function FollowUpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl border border-[#EBECEF] animate-in zoom-in-95 duration-150 flex flex-col gap-4 text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-[#5455EE]" />
            <h4 className="text-base font-extrabold text-slate-900">
              Simulated Follow-Up Scenario (3 November 2026)
            </h4>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Before vs After Table */}
        <div className="border border-[#EBECEF] rounded-2xl overflow-hidden shadow-2xs">
          <table className="w-full text-left">
            <thead className="bg-[#F8F9FD] text-slate-500 font-bold border-b border-[#EBECEF]">
              <tr>
                <th className="p-3">Pulse Measure</th>
                <th className="p-3 text-right">Before Intervention</th>
                <th className="p-3 text-right text-emerald-600 font-extrabold">Follow-Up (3 Nov)</th>
                <th className="p-3 text-right">Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBECEF]">
              {MAYA_PROFILE.pulseHistory.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-3 font-semibold text-slate-800">{row.measure}</td>
                  <td className="p-3 text-right text-slate-600">{row.current} / 10</td>
                  <td className="p-3 text-right font-extrabold text-emerald-700 bg-emerald-50/40">
                    {row.followUp} / 10
                  </td>
                  <td className="p-3 text-right text-emerald-600 font-bold">
                    +{row.followUp - row.current} pts
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Maya's Follow-up Comment */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
          <h5 className="font-bold text-emerald-950 mb-1">Maya's Follow-up Check-in Comment:</h5>
          <p className="text-emerald-900 italic leading-relaxed text-xs">
            “{MAYA_PROFILE.followUpComment}”
          </p>
        </div>

        <div className="flex items-center justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close Follow-up
          </button>
        </div>
      </div>
    </div>
  );
}
