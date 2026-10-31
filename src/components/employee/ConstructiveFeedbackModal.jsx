import React from 'react';
import { X, MessageSquare } from 'lucide-react';

export default function ConstructiveFeedbackModal({
  isOpen,
  onClose,
  feedbackCategory,
  setFeedbackCategory,
  feedbackScope,
  setFeedbackScope,
  feedbackTitle,
  setFeedbackTitle,
  feedbackMessage,
  setFeedbackMessage,
  feedbackOutcome,
  setFeedbackOutcome,
  feedbackAnonymous,
  setFeedbackAnonymous,
  onSubmit,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-[#EBECEF] rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col gap-5 max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
        <div className="border-b border-slate-100 pb-3 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Share Constructive Feedback</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Submit suggestions, onboarding improvements, or team workflow ideas directly to leadership.
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

        <form onSubmit={onSubmit} className="flex flex-col gap-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Feedback Category</label>
              <select
                value={feedbackCategory}
                onChange={(e) => setFeedbackCategory(e.target.value)}
                className="p-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-800 bg-[#F4F5FA] outline-none focus:border-[#5455EE]"
              >
                <option value="workload">Workload & Capacity Planning</option>
                <option value="process">Process & Tooling Improvements</option>
                <option value="onboarding">Onboarding & Documentation</option>
                <option value="culture">Team Culture & Recognition</option>
                <option value="communication">Management Communication</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Target Department / Team</label>
              <input
                type="text"
                value={feedbackScope}
                onChange={(e) => setFeedbackScope(e.target.value)}
                className="p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 bg-[#F4F5FA] outline-none focus:border-[#5455EE]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">Suggestion Title</label>
            <input
              type="text"
              value={feedbackTitle}
              onChange={(e) => setFeedbackTitle(e.target.value)}
              placeholder="e.g. Standardize 24h pull request review turnaround SLA"
              className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 bg-[#F4F5FA] outline-none focus:border-[#5455EE]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">Detailed Feedback / Suggestion</label>
            <textarea
              rows={3}
              value={feedbackMessage}
              onChange={(e) => setFeedbackMessage(e.target.value)}
              placeholder="What is working well, what could be improved, and how can we support the team better?"
              className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 bg-[#F4F5FA] outline-none focus:border-[#5455EE] leading-relaxed"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">What positive outcome would this bring?</label>
            <input
              type="text"
              value={feedbackOutcome}
              onChange={(e) => setFeedbackOutcome(e.target.value)}
              placeholder="e.g. Less sprint thrash and clearer expectations for newer hires"
              className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 bg-[#F4F5FA] outline-none focus:border-[#5455EE]"
            />
          </div>

          <label className="flex items-center gap-2 text-slate-700 cursor-pointer text-xs select-none">
            <input
              type="checkbox"
              checked={feedbackAnonymous}
              onChange={(e) => setFeedbackAnonymous(e.target.checked)}
              className="rounded text-[#5455EE] focus:ring-[#5455EE]"
            />
            <span>Submit anonymously without attaching my name or profile</span>
          </label>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!feedbackTitle.trim() || !feedbackMessage.trim()}
              className="px-5 py-2.5 bg-[#5455EE] hover:bg-[#4344dd] disabled:opacity-40 text-white font-bold rounded-xl transition-all shadow-md cursor-pointer text-xs flex items-center gap-1.5"
            >
              <MessageSquare size={14} />
              <span>Submit Feedback</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
