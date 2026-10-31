import React from 'react';
import { X, CheckCircle2, Check, ClipboardCheck, Sparkles } from 'lucide-react';
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

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-[#EBECEF] rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col gap-6 max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
        {pulseSubmittedSuccess ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center gap-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center border-2 border-emerald-200/80 shadow-md">
              <CheckCircle2 size={36} className="text-emerald-500" />
            </div>
            <div className="flex flex-col gap-1.5 max-w-md">
              <h3 className="text-xl font-extrabold text-slate-900">
                Your Pulse Survey is Submitted!
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Thank you for checking in. Your weekly pulse scores and feedback have been securely recorded.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setPulseSubmittedSuccess(false);
                onClose();
              }}
              className="mt-3 px-6 py-2.5 bg-[#5455EE] hover:bg-[#4344dd] text-white font-extrabold text-xs rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Check size={14} />
              <span>Done</span>
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Occasional Pulse Survey
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  This helps EchoHR understand broader team trends. You can also use Eko anytime for immediate work support.
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

            <form onSubmit={onSubmit} className="flex flex-col gap-6 text-xs">
              {/* Question 1: Workload */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800">
                    1. How manageable has your workload felt this week?
                  </label>
                  <span className="font-bold px-2 py-0.5 rounded-lg text-xs text-[#5455EE] bg-[#EEF0FF]">
                    {pulseResponses.workload ?? 0} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={pulseResponses.workload ?? 0}
                  onChange={(e) =>
                    setPulseResponses({ ...pulseResponses, workload: parseInt(e.target.value) })
                  }
                  className="w-full accent-[#5455EE] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>0 (Severe Overload)</span>
                  <span>10 (Completely Manageable)</span>
                </div>
              </div>

              {/* Question 2: Role Clarity */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800">
                    2. Do you have clear instructions and priority guidelines for your tasks?
                  </label>
                  <span className="font-bold px-2 py-0.5 rounded-lg text-xs text-[#5455EE] bg-[#EEF0FF]">
                    {pulseResponses.clarity ?? 0} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={pulseResponses.clarity ?? 0}
                  onChange={(e) =>
                    setPulseResponses({ ...pulseResponses, clarity: parseInt(e.target.value) })
                  }
                  className="w-full accent-[#5455EE] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>0 (Very Unclear)</span>
                  <span>10 (Crystal Clear)</span>
                </div>
              </div>

              {/* Question 3: Support */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800">
                    3. How supported do you feel by your manager and senior squad mates?
                  </label>
                  <span className="font-bold px-2 py-0.5 rounded-lg text-xs text-[#5455EE] bg-[#EEF0FF]">
                    {pulseResponses.support ?? 0} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={pulseResponses.support ?? 0}
                  onChange={(e) =>
                    setPulseResponses({ ...pulseResponses, support: parseInt(e.target.value) })
                  }
                  className="w-full accent-[#5455EE] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>0 (Isolated / No Support)</span>
                  <span>10 (Fully Supported)</span>
                </div>
              </div>

              {/* Question 4: Comfort asking for help */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800">
                    4. How comfortable do you feel reaching out when you need help?
                  </label>
                  <span className="font-bold px-2 py-0.5 rounded-lg text-xs text-[#5455EE] bg-[#EEF0FF]">
                    {pulseResponses.help ?? 0} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={pulseResponses.help ?? 0}
                  onChange={(e) =>
                    setPulseResponses({ ...pulseResponses, help: parseInt(e.target.value) })
                  }
                  className="w-full accent-[#5455EE] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>0 (Very Hesitant)</span>
                  <span>10 (Completely Comfortable)</span>
                </div>
              </div>

              {/* Optional Comment */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-800">
                  Any specific comments on this week's pace? (Optional)
                </label>
                <textarea
                  rows={3}
                  value={pulseComment}
                  onChange={(e) => setPulseComment(e.target.value)}
                  placeholder="Share any thoughts or context about your workload this week..."
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-900 bg-[#F4F5FA] outline-none focus:border-[#5455EE]"
                />
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between gap-2.5 pt-3 border-t border-slate-100 flex-wrap">
                {/* Left Bottom Demo Autofill Button */}
                <button
                  type="button"
                  onClick={() => {
                    setPulseResponses({
                      workload: 6,
                      clarity: 6,
                      support: 6,
                      help: 6,
                    });
                    setPulseComment(MAYA_PROFILE.pulseComment);
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs hover:scale-[1.01]"
                  title="Fill demo values for Maya"
                >
                  <Sparkles size={14} className="text-purple-600" />
                  <span>Demo Autofill</span>
                </button>

                <div className="flex items-center gap-2.5 ml-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#5455EE] hover:bg-[#4344dd] text-white font-extrabold text-xs rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <ClipboardCheck size={14} />
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
