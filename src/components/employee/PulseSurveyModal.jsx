import React from 'react';
import { X, CheckCircle2, Check, ClipboardCheck, Sparkles, Send } from 'lucide-react';
import { MAYA_PROFILE } from '../../data/mockData';

export default function PulseSurveyModal({
  isOpen,
  onClose,
  pulseResponses,
  setPulseResponses,
  pulseComment,
  setPulseComment,
  pulseSubmittedSuccess,
  setPulseSubmittedSuccess,
  onSubmit,
}) {
  if (!isOpen) return null;

  const questions = [
    {
      key: 'workload',
      label: '1. How manageable has your workload felt this week?',
      minLabel: 'Overloaded',
      maxLabel: 'Manageable',
    },
    {
      key: 'clarity',
      label: '2. Do you have clear instructions and priority guidelines?',
      minLabel: 'Very Unclear',
      maxLabel: 'Crystal Clear',
    },
    {
      key: 'support',
      label: '3. How supported do you feel by your manager & peers?',
      minLabel: 'No Support',
      maxLabel: 'Fully Supported',
    },
    {
      key: 'help',
      label: '4. How comfortable are you reaching out when stuck?',
      minLabel: 'Hesitant',
      maxLabel: 'Comfortable',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[#EBECEF] rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col gap-4 max-w-2xl w-full animate-in zoom-in-95 duration-150">
        {pulseSubmittedSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center gap-3.5 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shadow-xs">
              <CheckCircle2 size={32} className="text-emerald-500" />
            </div>
            <div className="flex flex-col gap-1 max-w-md">
              <h3 className="text-xl font-bold text-slate-900">
                Pulse Survey Recorded! ✨
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Thank you for checking in. Your exact ratings have been saved and aggregated anonymously into team workload trends.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setPulseSubmittedSuccess(false);
                onClose();
              }}
              className="mt-2 px-6 py-2.5 bg-[#5455EE] hover:bg-[#4344dd] text-white font-semibold text-sm rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Check size={15} />
              <span>Done</span>
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#EEF0FF] text-[#5455EE] flex items-center justify-center flex-shrink-0 shadow-2xs">
                  <ClipboardCheck size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">
                    Weekly Pulse Check-in
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    100% anonymous · Takes 1 minute to reflect on your week
                  </p>
                </div>
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

            {/* Form - Compact & larger text, strictly NO scrolling */}
            <form onSubmit={onSubmit} className="flex flex-col gap-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {questions.map((q) => {
                  const currentVal = pulseResponses[q.key] ?? 3;
                  return (
                    <div
                      key={q.key}
                      className="p-3.5 rounded-2xl bg-[#F8F9FD] border border-slate-200/80 flex flex-col justify-between gap-2.5"
                    >
                      <label className="text-sm font-semibold text-slate-900 leading-snug">
                        {q.label}
                      </label>

                      {/* 1-5 Scale Rating Buttons */}
                      <div className="flex items-center justify-between gap-1.5">
                        {[1, 2, 3, 4, 5].map((num) => {
                          const isSelected = currentVal === num;
                          return (
                            <button
                              key={num}
                              type="button"
                              onClick={() =>
                                setPulseResponses({
                                  ...pulseResponses,
                                  [q.key]: num,
                                })
                              }
                              className={`flex-1 py-1.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#5455EE] text-white shadow-xs scale-105 ring-2 ring-[#5455EE]/30'
                                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/90'
                              }`}
                            >
                              {num}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium px-0.5">
                        <span>1 ({q.minLabel})</span>
                        <span>5 ({q.maxLabel})</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Optional Comment: Clean compact single/two line */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700">
                  Anything you'd like to highlight about this week's pace? (Optional)
                </label>
                <input
                  type="text"
                  value={pulseComment}
                  onChange={(e) => setPulseComment(e.target.value)}
                  placeholder="e.g. Blockers on Sprint 14 testing, need clearer brief on launch deliverables..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 bg-[#F8F9FD] focus:bg-white outline-none focus:border-[#5455EE] transition-all"
                />
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setPulseResponses({
                      workload: 2,
                      clarity: 2,
                      support: 3,
                      help: 3,
                    });
                    setPulseComment(MAYA_PROFILE.pulseComment);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer border border-purple-200"
                  title="Autofill sample pulse ratings"
                >
                  <Sparkles size={13} />
                  <span>Quick Sample Fill</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#5455EE] hover:bg-[#4344dd] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Send size={13} />
                    <span>Submit Pulse Survey</span>
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
