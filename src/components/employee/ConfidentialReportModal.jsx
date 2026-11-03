import React from 'react';
import { X, Lock, ChevronDown, ShieldCheck, Sparkles } from 'lucide-react';

export default function ConfidentialReportModal({
  isOpen,
  onClose,
  reportCategory,
  setReportCategory,
  reportDescription,
  setReportDescription,
  reportOutcome,
  setReportOutcome,
  privacyChoice,
  setPrivacyChoice,
  privacyDropdownOpen,
  setPrivacyDropdownOpen,
  privacyConsent,
  setPrivacyConsent,
  onSubmit,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-[#EBECEF] rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col gap-6 max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
        <div className="border-b border-slate-100 pb-3 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Confidential Workplace Report
            </h3>
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

        <form onSubmit={onSubmit} className="flex flex-col gap-5 text-xs">
          {/* Field: Concern Category */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-800">
              What is your concern about?
            </label>
            <select
              value={reportCategory}
              onChange={(e) => setReportCategory(e.target.value)}
              className="p-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-800 bg-[#F4F5FA] outline-none focus:border-[#5455EE]"
            >
              <option value="con_01">Burnout & Workload Imbalance</option>
              <option value="con_02">Unclear Role Expectations</option>
              <option value="leadership">Poor Leadership & Support</option>
              <option value="recognition">Lack of Recognition & Appreciation</option>
              <option value="growth">Limited Growth & Career Development</option>
              <option value="collaboration">Collaboration & Social Connection Difficulties</option>
              <option value="change_mgmt">Unsuccessful Change Management</option>
            </select>
          </div>

          {/* Field: Describe your concern */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-800">
              Describe your concern
            </label>
            <textarea
              rows={4}
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              className="w-full p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-900 bg-[#F4F5FA] outline-none focus:border-[#5455EE] leading-relaxed"
            />
          </div>

          {/* Field: What outcome would help? */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-800">
              What outcome would help?
            </label>
            <input
              type="text"
              value={reportOutcome}
              onChange={(e) => setReportOutcome(e.target.value)}
              placeholder="e.g. Fairer workload allocation, clearer task priorities, and a safe way to raise concerns."
              className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-900 bg-[#F4F5FA] outline-none focus:border-[#5455EE]"
            />
          </div>

          {/* PRIVACY & INFORMATION VISIBILITY SECTION DROPDOWN ACCORDION */}
          <div className="rounded-2xl border border-[#5455EE]/30 bg-[#F8F9FD] overflow-hidden transition-all shadow-2xs">
            <button
              type="button"
              onClick={() => setPrivacyDropdownOpen(!privacyDropdownOpen)}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-100/60 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#5455EE]/10 text-[#5455EE] flex items-center justify-center">
                  <Lock size={14} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      Privacy & Information Visibility
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {privacyChoice === 'optionA' ? 'Department Visible (Engineering)' : 'Fully Anonymous'}
                    </span>
                  </div>
                </div>
              </div>
              <ChevronDown
                size={16}
                className={`text-slate-400 transition-transform duration-200 ${privacyDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {privacyDropdownOpen && (
              <div className="p-4 pt-2 border-t border-slate-200 bg-white flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-700">Visibility Level:</label>
                  <select
                    value={privacyChoice}
                    onChange={(e) => setPrivacyChoice(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-[#F4F5FA] outline-none focus:border-[#5455EE]"
                  >
                    <option value="optionA">Department-level privacy</option>
                    <option value="optionB">Fully anonymous</option>
                  </select>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  {privacyChoice === 'optionA' ? (
                    <span>
                      <strong>Department-level privacy:</strong> HR sees your department (Engineering) to take targeted action, but your personal identity and chat transcripts remain completely hidden.
                    </span>
                  ) : (
                    <span>
                      <strong>Fully anonymous:</strong> HR only sees a company-wide theme. Your department, identity, and chat transcripts are completely hidden.
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1 border-t border-slate-100">
                  <div>Identity: <strong className="text-slate-800">Hidden</strong></div>
                  <div>Department: <strong className="text-slate-800">{privacyChoice === 'optionA' ? 'Engineering' : 'Hidden'}</strong></div>
                  <div>AI-chat transcript: <strong className="text-slate-800">Not attached</strong></div>
                  <div>Manager identity: <strong className="text-slate-800">Not disclosed</strong></div>
                </div>
              </div>
            )}
          </div>

          {/* Department & Tenure (Placed directly under Privacy Choice) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Department</span>
              <span className="font-bold text-slate-800 text-xs">
                {privacyChoice === 'optionB' ? 'Hidden / Undisclosed' : 'Engineering'}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Tenure</span>
              <span className="font-bold text-slate-800 text-xs">
                {privacyChoice === 'optionB' ? 'Hidden / Undisclosed' : '5 months (New Hire)'}
              </span>
            </div>
          </div>

          {/* Consent Checkbox */}
          <label className="flex items-start gap-2 text-[11px] font-semibold text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={privacyConsent}
              onChange={(e) => setPrivacyConsent(e.target.checked)}
              className="mt-0.5 rounded text-[#5455EE] focus:ring-[#5455EE]"
            />
            <span>
              I understand that the information I submit may be used to investigate this concern. I have reviewed the privacy choice above.
            </span>
          </label>

          {/* Footer Actions */}
          <div className="flex items-center justify-between gap-2.5 pt-3 border-t border-slate-100 flex-wrap">
            <button
              type="button"
              onClick={() => {
                setReportCategory('con_01');
                setReportDescription(
                  `Over the past few weeks, a senior colleague has repeatedly assigned me additional testing and documentation work without discussing my existing commitments.\n\nAt the same time, my manager often gives instructions without clearly explaining the expected deliverables or which tasks should take priority.\n\nI have been working late to finish everything. I am uncomfortable raising this directly because I am new and worry that I may be viewed as difficult or incapable.\n\nI would like HR to review how work is allocated, clarify task ownership, and establish a safer way to resolve conflicting priorities.`
                );
                setReportOutcome(
                  'Fairer workload allocation, clearer task priorities, and a safe way to raise concerns without retaliation.'
                );
                setPrivacyChoice('optionA');
                setPrivacyConsent(true);
              }}
              className="px-3.5 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs hover:scale-[1.01]"
              title="Autofill sample report for Maya"
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
                <ShieldCheck size={14} />
                <span>Submit Report</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
