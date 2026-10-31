import React from 'react';
import {
  Clock,
  MessageSquare,
  ClipboardCheck,
  Lock,
  ArrowRight,
  CheckCircle2,
  FileText,
  Eye,
} from 'lucide-react';

export default function EmployeeVoiceHub({
  onOpenModal,
  submittedRecords,
  recordFilter,
  setRecordFilter,
  submittedAlert,
  setSubmittedAlert,
  onViewRecord,
  isReportResolved,
}) {
  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto pb-8">
      {/* Header Subtitle & Status Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 -mt-2">
        <p className="text-xs sm:text-sm text-slate-500">
          Your space to share suggestions, complete your weekly pulse survey, or raise a concern confidentially.
        </p>

        <button
          type="button"
          onClick={() => onOpenModal('status')}
          className="px-4 py-2 bg-white border border-[#EBECEF] hover:bg-[#F8F9FD] text-xs font-bold text-slate-700 rounded-2xl flex items-center gap-2 shadow-xs cursor-pointer self-start sm:self-auto flex-shrink-0"
        >
          <Clock size={14} className="text-[#5455EE]" />
          <span>Check Report Status (ANON-4827)</span>
        </button>
      </div>

      {/* 1. 3 TOP ACTION BUTTONS / CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Give Feedback */}
        <button
          type="button"
          onClick={() => onOpenModal('feedback')}
          className="p-5 rounded-3xl border border-[#EBECEF] hover:border-[#5455EE]/60 hover:shadow-md bg-white text-left transition-all flex flex-col justify-between cursor-pointer group shadow-card"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:scale-105 transition-transform">
                <MessageSquare size={18} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                Constructive
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-[#5455EE] transition-colors">
              Give Feedback
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Share suggestions, onboarding improvements, or squad workflow ideas.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#5455EE]">
            <span>Open Form</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Card 2: Pulse Survey */}
        <button
          type="button"
          onClick={() => onOpenModal('pulse')}
          className="p-5 rounded-3xl border border-[#EBECEF] hover:border-[#5455EE]/60 hover:shadow-md bg-white text-left transition-all flex flex-col justify-between cursor-pointer group shadow-card"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 group-hover:scale-105 transition-transform">
                <ClipboardCheck size={18} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                Occasional check-in · 2 min
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-[#5455EE] transition-colors">
              Pulse Survey
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Rate role clarity, workload balance, and team guidance.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#5455EE]">
            <span>Start Survey</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Card 3: Confidential Report */}
        <button
          type="button"
          onClick={() => onOpenModal('report')}
          className="p-5 rounded-3xl border border-[#EBECEF] hover:border-[#5455EE]/60 hover:shadow-md bg-white text-left transition-all flex flex-col justify-between cursor-pointer group shadow-card"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 group-hover:scale-105 transition-transform">
                <Lock size={18} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                Private Reporting
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-[#5455EE] transition-colors">
              Confidential Report
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Tell HR about recurring workload issues, unclear responsibilities, or lack of support.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#5455EE]">
            <span>Submit Report</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>

      {/* Temporary Form Submitted Alert */}
      {submittedAlert && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0" />
            <div>
              <span className="font-bold text-slate-900 block">{submittedAlert.title}</span>
              <span className="text-[11px] text-slate-600 mt-0.5">{submittedAlert.message}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSubmittedAlert(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. SUBMITTED RECORDS & ACTIVITY */}
      <div className="bg-white border border-[#EBECEF] rounded-3xl p-6 shadow-card flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-[#5455EE]" />
            <h4 className="text-base font-bold text-slate-900">
              My Records
            </h4>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {submittedRecords.length}
            </span>
          </div>

          {/* Filter buttons to choose feedback, survey or report */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setRecordFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                recordFilter === 'all'
                  ? 'bg-[#5455EE] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              All ({submittedRecords.length})
            </button>
            <button
              type="button"
              onClick={() => setRecordFilter('report')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                recordFilter === 'report'
                  ? 'bg-[#5455EE] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              Reports ({submittedRecords.filter((r) => r.type === 'report').length})
            </button>
            <button
              type="button"
              onClick={() => setRecordFilter('pulse')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                recordFilter === 'pulse'
                  ? 'bg-[#5455EE] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              Surveys ({submittedRecords.filter((r) => r.type === 'pulse').length})
            </button>
            <button
              type="button"
              onClick={() => setRecordFilter('feedback')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                recordFilter === 'feedback'
                  ? 'bg-[#5455EE] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              Feedback ({submittedRecords.filter((r) => r.type === 'feedback').length})
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3.5">
          {submittedRecords.filter((r) => (recordFilter === 'all' ? true : r.type === recordFilter)).length === 0 ? (
            <div className="py-8 px-4 text-center bg-[#F8F9FD] rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center gap-1.5">
              <span className="text-xs font-bold text-slate-700">No records found</span>
              <p className="text-[11px] text-slate-400 max-w-sm">
                {recordFilter === 'all'
                  ? 'Submissions from your weekly pulse check-in, confidential reports, or feedback forms will appear here once submitted.'
                  : `No ${recordFilter === 'report' ? 'confidential reports' : recordFilter === 'pulse' ? 'pulse surveys' : 'feedback'} submitted yet.`}
              </p>
            </div>
          ) : (
            submittedRecords
              .filter((r) => (recordFilter === 'all' ? true : r.type === recordFilter))
              .map((rec) => {
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
                        className={`px-2.5 py-1 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 flex-shrink-0 shadow-2xs ${typeConfig.badgeClass}`}
                      >
                        <TypeIcon size={12} className={typeConfig.iconColor} />
                        <span className="font-mono font-extrabold">{displayId}</span>
                      </div>

                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 group-hover:text-[#5455EE] transition-colors truncate">
                            {rec.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                            • Ref: {rec.systemId || rec.id}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1 flex-wrap">
                          <span>Submitted: {rec.date}</span>
                          <span>•</span>
                          {isWithdrawn ? (
                            <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-slate-200 text-slate-700 border border-slate-300">
                              Withdrawn · Deletes in 30 days
                            </span>
                          ) : isSolved ? (
                            <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Resolved
                            </span>
                          ) : rec.status === 'In Progress' || rec.resolutionStatus === 'In Progress' ? (
                            <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-indigo-50 text-[#5455EE] border border-indigo-200">
                              In Progress
                            </span>
                          ) : isReviewed ? (
                            <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-sky-50 text-sky-700 border border-sky-200">
                              Reviewed
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-amber-50 text-amber-700 border border-amber-200">
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
                      className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-[#5455EE] hover:bg-[#EEF0FF] hover:border-[#5455EE]/40 transition-colors shadow-2xs flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
                    >
                      <Eye size={13} />
                      <span>View</span>
                    </button>
                  </div>
                );
              })
          )}
        </div>
      </div>
    </div>
  );
}
