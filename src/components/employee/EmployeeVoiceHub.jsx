import React, { useState } from 'react';
import {
  MessageSquare,
  Lock,
  ClipboardCheck,
  CheckCircle2,
  FileText,
  Eye,
  Plus,
  ArrowRight,
  ChevronDown
} from 'lucide-react';

export default function EmployeeVoiceHub({
  onOpenModal,
  submittedRecords = [],
  submittedAlert,
  setSubmittedAlert,
  onViewRecord,
  isReportResolved = false,
  activeTab = 'feedback',
  setActiveTab,
}) {
  const [localTab, setLocalTab] = useState(activeTab || 'feedback');
  const [isSubmitMenuOpen, setIsSubmitMenuOpen] = useState(false);

  const currentTab = setActiveTab ? activeTab : localTab;
  const handleTabChange = (tab) => {
    if (setActiveTab) setActiveTab(tab);
    setLocalTab(tab);
  };

  // Check if pulse survey is already completed
  const hasFilledPulse = submittedRecords.some(
    (r) => r.type === 'pulse' && r.status !== 'Withdrawn'
  );

  const feedbackRecords = submittedRecords.filter((r) => r.type === 'feedback');
  const reportRecords = submittedRecords.filter((r) => r.type === 'report');
  const pulseRecords = submittedRecords.filter((r) => r.type === 'pulse');

  const displayedRecords =
    currentTab === 'feedback'
      ? feedbackRecords
      : currentTab === 'report'
      ? reportRecords
      : pulseRecords;

  return (
    <div className="flex flex-col gap-5 w-full max-w-6xl mx-auto pb-10">
      {/* Top Header: Subtitle */}
      <div className="-mt-2">
        <p className="text-sm font-normal leading-[22px] text-slate-500">
          Share constructive suggestions, raise confidential concerns, or complete your occasional check-in.
        </p>
      </div>

      {/* Pulse Survey Reminder Card: Lively, Human & Warm (活泼) */}
      {!hasFilledPulse && (
        <div className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-[#EEF0FF] via-[#F3F4FE] to-[#FAF8FF] border border-[#5455EE]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-2xl bg-[#5455EE] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <ClipboardCheck size={18} />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                Hey there! Your weekly pulse check is still waiting for you ~ ✨
              </span>
              <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                Your survey is still empty! Takes just 1 minute — share how your week is feeling so we can shape real team support 🚀
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenModal('pulse')}
            className="px-4 py-2 rounded-xl bg-[#5455EE] hover:bg-[#4344dd] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto flex-shrink-0 hover:scale-[1.02]"
          >
            <span>Fill it in ~ 🚀</span>
          </button>
        </div>
      )}

      {/* Temporary Form Submitted Alert */}
      {submittedAlert && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0" />
            <div>
              <span className="font-semibold text-slate-900 block leading-5">{submittedAlert.title}</span>
              <span className="text-xs text-slate-600 mt-0.5 leading-[18px]">{submittedAlert.message}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSubmittedAlert(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-medium p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. STANDALONE TAB BAR: Separated from the record list container */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 p-1 bg-[#F1F3F9] rounded-2xl border border-slate-200/60 shadow-inner">
          {/* Tab 1: Feedback */}
          <button
            type="button"
            onClick={() => handleTabChange('feedback')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium leading-5 transition-all cursor-pointer ${
              currentTab === 'feedback'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/70'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <MessageSquare size={14} className={currentTab === 'feedback' ? 'text-emerald-600' : 'text-slate-400'} />
            <span>Feedback</span>
            <span
              className={`text-xs px-2 py-0.2 rounded-full font-medium leading-[18px] ${
                currentTab === 'feedback' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200/80 text-slate-600'
              }`}
            >
              {feedbackRecords.length}
            </span>
          </button>

          {/* Tab 2: Confidential Reports */}
          <button
            type="button"
            onClick={() => handleTabChange('report')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium leading-5 transition-all cursor-pointer ${
              currentTab === 'report'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/70'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Lock size={14} className={currentTab === 'report' ? 'text-rose-600' : 'text-slate-400'} />
            <span>Reports</span>
            <span
              className={`text-xs px-2 py-0.2 rounded-full font-medium leading-[18px] ${
                currentTab === 'report' ? 'bg-rose-100 text-rose-800' : 'bg-slate-200/80 text-slate-600'
              }`}
            >
              {reportRecords.length}
            </span>
          </button>

          {/* Tab 3: Pulse Surveys */}
          <button
            type="button"
            onClick={() => handleTabChange('pulse')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium leading-5 transition-all cursor-pointer ${
              currentTab === 'pulse'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/70'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <ClipboardCheck size={14} className={currentTab === 'pulse' ? 'text-sky-600' : 'text-slate-400'} />
            <span>Pulse Surveys</span>
            <span
              className={`text-xs px-2 py-0.2 rounded-full font-medium leading-[18px] ${
                currentTab === 'pulse' ? 'bg-sky-100 text-sky-800' : 'bg-slate-200/80 text-slate-600'
              }`}
            >
              {pulseRecords.length}
            </span>
          </button>
        </div>

        {/* Right Side: Single "Submit" Button with Dropdown (same level as tab switching) */}
        <div className="relative flex-shrink-0">
          <button
            type="button"
            onClick={() => setIsSubmitMenuOpen(!isSubmitMenuOpen)}
            className="px-4 py-2 bg-[#5455EE] hover:bg-[#4344dd] text-white text-sm font-medium leading-5 rounded-2xl flex items-center gap-1.5 shadow-xs cursor-pointer transition-all hover:scale-[1.02]"
          >
            <Plus size={16} />
            <span>Submit</span>
            <ChevronDown size={14} className={`transition-transform ${isSubmitMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isSubmitMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setIsSubmitMenuOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#EBECEF] p-2 z-30 animate-in fade-in slide-in-from-top-1 duration-150">
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitMenuOpen(false);
                    onOpenModal('feedback');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-left cursor-pointer transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <MessageSquare size={14} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-[#5455EE] transition-colors">
                      Give Feedback
                    </div>
                    <div className="text-[10px] text-slate-400">Suggestions & team ideas</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitMenuOpen(false);
                    onOpenModal('report');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-left cursor-pointer transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Lock size={14} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-[#5455EE] transition-colors">
                      Submit Report
                    </div>
                    <div className="text-[10px] text-slate-400">Confidential workplace concern</div>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 2. STANDALONE RECORD LIST: Separate div from the tab switcher */}
      <div className="bg-white border border-[#EBECEF] rounded-3xl p-6 shadow-card flex flex-col gap-3.5">
        {displayedRecords.length === 0 ? (
          <div className="py-12 px-4 text-center bg-[#F8F9FD] rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-xs">
              {currentTab === 'feedback' && <MessageSquare size={20} className="text-emerald-500" />}
              {currentTab === 'report' && <Lock size={20} className="text-rose-500" />}
              {currentTab === 'pulse' && <ClipboardCheck size={20} className="text-sky-500" />}
            </div>
            <span className="text-sm font-bold text-slate-800">
              {currentTab === 'feedback'
                ? 'No constructive feedback submitted yet'
                : currentTab === 'report'
                ? 'No confidential reports submitted yet'
                : 'No pulse surveys submitted yet'}
            </span>
            <p className="text-xs text-slate-500 max-w-sm">
              {currentTab === 'feedback'
                ? 'Have an idea to improve squad workflows or tooling? Share your suggestion here.'
                : currentTab === 'report'
                ? 'Experienced workload conflicts, lack of guidance, or pressure? Raise a concern securely.'
                : 'Complete your weekly pulse survey to track workload manageability and team support.'}
            </p>
            <button
              type="button"
              onClick={() => onOpenModal(currentTab)}
              className="mt-2 px-4 py-2 rounded-xl bg-[#5455EE] hover:bg-[#4344dd] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Plus size={14} />
              <span>
                {currentTab === 'feedback'
                  ? 'Give Feedback'
                  : currentTab === 'report'
                  ? 'Submit Report'
                  : 'Take Survey'}
              </span>
            </button>
          </div>
        ) : (
          displayedRecords.map((rec) => {
            const isSolved =
              rec.resolutionStatus === 'Resolved' ||
              rec.status === 'Resolved' ||
              rec.resolutionStatus === 'Solved' ||
              rec.resolutionStatus === 'Closed' ||
              (rec.id === 'ANON-4827' && isReportResolved);
            const isWithdrawn =
              rec.status === 'Withdrawn' ||
              rec.resolutionStatus === 'Withdrawn' ||
              rec.resolutionStatus === 'Withdrawn by Employee';
            const isReviewed =
              rec.status === 'Reviewed' || rec.reviewStatus === 'Reviewed' || rec.reviewStatus === 'Aggregated';

            const typeConfig =
              rec.type === 'report'
                ? {
                    label: 'Report',
                    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
                    icon: Lock,
                    iconColor: 'text-rose-600',
                    defaultPrefix: 'R001',
                  }
                : rec.type === 'pulse'
                ? {
                    label: 'Pulse Survey',
                    badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
                    icon: ClipboardCheck,
                    iconColor: 'text-sky-600',
                    defaultPrefix: 'S001',
                  }
                : {
                    label: 'Feedback',
                    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    icon: MessageSquare,
                    iconColor: 'text-emerald-600',
                    defaultPrefix: 'F001',
                  };
            const TypeIcon = typeConfig.icon;
            const displayId = rec.displayId || typeConfig.defaultPrefix;

            return (
              <div
                key={rec.id}
                onClick={() => onViewRecord(rec)}
                className="p-4 rounded-2xl border border-[#EBECEF] bg-[#F8F9FD] flex items-center justify-between gap-3 hover:border-[#5455EE]/40 hover:bg-[#F2F4FD] transition-all shadow-2xs cursor-pointer group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`px-2.5 py-1 rounded-xl border text-xs font-medium leading-[18px] flex items-center gap-1.5 flex-shrink-0 shadow-2xs ${typeConfig.badgeClass}`}
                  >
                    <TypeIcon size={12} className={typeConfig.iconColor} />
                    <span className="font-mono font-medium tracking-wider uppercase">{displayId}</span>
                  </div>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium leading-5 text-slate-900 group-hover:text-[#5455EE] transition-colors truncate">
                        {rec.title}
                      </span>
                      <span className="text-xs text-slate-500 font-mono hidden sm:inline">
                        • Ref: {rec.systemId || rec.id}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-normal leading-[18px] text-slate-500 mt-1 flex-wrap">
                      <span>Submitted: {rec.date}</span>
                      <span>•</span>
                      {isWithdrawn ? (
                        <span className="px-2 py-0.5 rounded font-medium text-xs leading-[18px] bg-slate-200 text-slate-700 border border-slate-300">
                          Withdrawn · Deletes in 30 days
                        </span>
                      ) : isSolved ? (
                        <span className="px-2 py-0.5 rounded font-medium text-xs leading-[18px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Resolved
                        </span>
                      ) : rec.status === 'In Progress' || rec.resolutionStatus === 'In Progress' ? (
                        <span className="px-2 py-0.5 rounded font-medium text-xs leading-[18px] bg-indigo-50 text-[#5455EE] border border-indigo-200">
                          In Progress
                        </span>
                      ) : isReviewed ? (
                        <span className="px-2 py-0.5 rounded font-medium text-xs leading-[18px] bg-sky-50 text-sky-700 border border-sky-200">
                          Reviewed
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded font-medium text-xs leading-[18px] bg-amber-50 text-amber-700 border border-amber-200">
                          Need Review
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewRecord(rec);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-sm font-medium leading-5 text-[#5455EE] hover:bg-[#EEF0FF] hover:border-[#5455EE]/40 transition-colors shadow-2xs flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
                >
                  <Eye size={14} />
                  <span>View</span>
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
