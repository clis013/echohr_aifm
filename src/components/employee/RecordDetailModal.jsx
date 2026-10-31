import React from 'react';
import {
  X,
  ShieldCheck,
  ChevronDown,
  Check,
  Clock,
  CheckCircle2,
  CheckCircle,
  PlusCircle,
  RotateCcw,
} from 'lucide-react';

export default function RecordDetailModal({
  recordTarget,
  onClose,
  isReportResolved,
  recordPrivacyOpen,
  setRecordPrivacyOpen,
  onOpenAddUpdate,
  onOpenRetract,
  onRetakeSurvey,
}) {
  if (!recordTarget) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-2xl w-full shadow-2xl border border-slate-200 flex flex-col gap-4 text-xs animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        {/* BRANCH 1: REPORT RECORD VIEWING */}
        {recordTarget.type === 'report' ? (
          <>
            {/* 1. Header: [R001] [Confidential Report] */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex flex-col gap-1.5 w-full">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-extrabold text-[#5455EE] bg-[#EEF0FF] px-2.5 py-1 rounded-lg border border-[#5455EE]/20">
                    {recordTarget.displayId || 'R001'}
                  </span>
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                    Confidential Report
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1 leading-snug">
                  {recordTarget.title}
                </h3>

                <div className="text-xs font-mono text-slate-600 flex items-center gap-1.5">
                  <span className="font-bold text-slate-700">Ref num:</span>
                  <span>{recordTarget.systemId || recordTarget.id || 'ANON-4827'}</span>
                </div>

                <div className="text-xs text-slate-600 flex items-center gap-1.5">
                  <span className="font-bold text-slate-700">Submit date:</span>
                  <span>{recordTarget.date || '20 October 2026'}</span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-slate-700">Status:</span>
                  <span
                    className={`px-3 py-0.5 rounded-full font-bold text-xs ${
                      recordTarget.status === 'Withdrawn' ||
                      recordTarget.resolutionStatus === 'Withdrawn'
                        ? 'bg-slate-200 text-slate-700 border border-slate-300'
                        : recordTarget.status === 'Resolved' ||
                          recordTarget.resolutionStatus === 'Resolved' ||
                          recordTarget.resolutionStatus === 'Solved' ||
                          (recordTarget.id === 'ANON-4827' && isReportResolved)
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-indigo-50 text-[#5455EE] border border-indigo-200'
                    }`}
                  >
                    {recordTarget.status === 'Withdrawn' ||
                    recordTarget.resolutionStatus === 'Withdrawn'
                      ? 'Withdrawn'
                      : recordTarget.status === 'Resolved' ||
                        recordTarget.resolutionStatus === 'Resolved' ||
                        recordTarget.resolutionStatus === 'Solved' ||
                        (recordTarget.id === 'ANON-4827' && isReportResolved)
                      ? 'Resolved'
                      : 'In Progress'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer flex-shrink-0"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Privacy Mode Accordion */}
            <div className="rounded-2xl border border-slate-200 bg-[#F8F9FD] overflow-hidden transition-all shadow-2xs">
              <button
                type="button"
                onClick={() => setRecordPrivacyOpen(!recordPrivacyOpen)}
                className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-100/60 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <ShieldCheck size={16} className="text-[#5455EE] flex-shrink-0" />
                  <span className="font-bold text-slate-800 text-xs">
                    Privacy mode: {recordTarget.privacyChoice === 'optionB' ? 'Fully anonymous' : 'Department-level anonymous'}
                  </span>
                  <span className="text-[11px] text-slate-500 font-normal">
                    (dropdown to see department, ...)
                  </span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-slate-400 transition-transform duration-200 ${
                    recordPrivacyOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {recordPrivacyOpen && (
                <div className="p-3.5 pt-0 border-t border-slate-200/70 bg-white grid grid-cols-2 gap-2 text-xs text-slate-600 mt-2">
                  <div>
                    Department:{' '}
                    <strong className="text-slate-800">
                      {recordTarget.privacyChoice === 'optionB'
                        ? 'Hidden / Undisclosed'
                        : recordTarget.department || 'Engineering'}
                    </strong>
                  </div>
                  <div>
                    Tenure:{' '}
                    <strong className="text-slate-800">
                      {recordTarget.privacyChoice === 'optionB' ? 'Hidden / Undisclosed' : '5 months'}
                    </strong>
                  </div>
                  <div>
                    Identity: <strong className="text-slate-800">Strictly Protected</strong>
                  </div>
                  <div>
                    AI-chat transcript: <strong className="text-slate-800">Not attached</strong>
                  </div>
                </div>
              )}
            </div>

            {/* Concern description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Description
              </label>
              <div className="p-4 rounded-2xl bg-[#F8F9FD] border border-slate-200 text-xs text-slate-800 whitespace-pre-line leading-relaxed">
                {recordTarget.description || 'Repeated workload transfers and conflicting priorities.'}
              </div>
            </div>

            {/* Desired outcome */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Desired outcome / request resolution
              </label>
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 text-xs text-emerald-950 leading-relaxed font-medium">
                {recordTarget.outcome ||
                  'Fairer workload allocation, clearer task priorities, and a safe way to raise concerns without retaliation.'}
              </div>
            </div>

            {/* Case updates vertical timeline */}
            <div className="flex flex-col gap-2 pt-1">
              <label className="text-xs font-bold text-slate-800 flex items-center justify-between uppercase tracking-wide">
                <span>Case updates</span>
              </label>

              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                {/* Timeline Item 1: Report Submitted */}
                <div className="relative flex items-start gap-3">
                  <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-[#5455EE] text-white flex items-center justify-center ring-4 ring-white shadow-2xs">
                    <Check size={11} />
                  </div>
                  <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-3 flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-xs">
                        Report Submitted & Reference Code Assigned
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {recordTarget.date || '20 Oct 2026'}, 10:45 AM
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      Submission safely received with reference{' '}
                      <span className="font-mono font-bold text-slate-800">
                        {recordTarget.systemId || recordTarget.id || 'ANON-4827'}
                      </span>
                      . Automatically routed to People Operations under verified confidentiality protocols.
                    </p>
                  </div>
                </div>

                {/* Timeline Item 2: Integrated Check Status Content */}
                <div className="relative flex items-start gap-3">
                  <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center ring-4 ring-white shadow-2xs">
                    <Clock size={11} />
                  </div>
                  <div className="flex-1 bg-indigo-50/50 border border-indigo-100 rounded-2xl p-3.5 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-indigo-950 text-xs">
                          Assigned for Senior HR Review
                        </span>
                        <span className="text-[10px] font-bold text-[#5455EE] bg-white px-2 py-0.5 rounded-md border border-indigo-200">
                          HR Operations
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        20 Oct 2026, 11:30 AM
                      </span>
                    </div>
                    <div className="text-slate-700 text-xs leading-relaxed space-y-2 whitespace-pre-line bg-white/80 p-3 rounded-xl border border-indigo-100/60">
                      <p>
                        Your report has been assigned to an appropriate senior reviewer outside your direct reporting line. The review will examine task ownership, workload distribution, and how conflicting priorities are resolved.
                      </p>
                      <p>
                        We will track the agreed corrective actions and provide further updates through this reference code.
                      </p>
                      <p className="font-semibold text-slate-800">
                        Your concern is being taken seriously. No conclusion has been reached about individual responsibility at this stage.
                      </p>
                    </div>
                    {!(recordTarget.status === 'Resolved' || isReportResolved) && (
                      <div className="text-[10px] font-medium text-indigo-700 pt-0.5 flex items-center gap-1.5">
                        <Clock size={12} />
                        <span>Expected Review Milestone: 22 October 2026</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Timeline Item 3: Case Resolved (If resolved) */}
                {(recordTarget.status === 'Resolved' ||
                  recordTarget.resolutionStatus === 'Resolved' ||
                  recordTarget.resolutionStatus === 'Solved' ||
                  (recordTarget.id === 'ANON-4827' && isReportResolved)) && (
                  <div className="relative flex items-start gap-3">
                    <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-4 ring-white shadow-2xs">
                      <CheckCircle2 size={13} />
                    </div>
                    <div className="flex-1 bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-emerald-900 text-xs">
                            Case Resolved & Corrective Actions Implemented
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                            Closed by HR
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-700">
                          21 Oct 2026, 04:15 PM
                        </span>
                      </div>
                      <div className="text-slate-800 text-xs leading-relaxed space-y-1.5 bg-white/90 p-3 rounded-xl border border-emerald-100">
                        <p>
                          Thank you for raising this concern. We have reviewed workload allocation in Engineering and clarified task-ownership guidance for new hires. Your manager will also introduce a weekly check-in during your first 90 days.
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Please continue to use Eko or submit feedback if similar issues occur.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Additional Employee Follow-up Notes if any */}
                {recordTarget.updates &&
                  recordTarget.updates
                    .filter(
                      (u) =>
                        u.text !==
                        'Assigned to Senior HRBP and Head of Engineering for workload allocation review.'
                    )
                    .map((u) => (
                      <div key={u.id} className="relative flex items-start gap-3">
                        <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center ring-4 ring-white shadow-2xs text-[10px] font-bold">
                          •
                        </div>
                        <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-3 flex flex-col gap-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-slate-900 text-xs">
                              Follow-up Note Added
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {u.date}
                            </span>
                          </div>
                          <p className="text-slate-700 text-xs leading-relaxed">
                            {u.text}
                          </p>
                        </div>
                      </div>
                    ))}
              </div>
            </div>

            {/* Footer Buttons for Report */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 mt-2 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                {recordTarget.resolutionStatus === 'Solved' ||
                recordTarget.resolutionStatus === 'Closed' ||
                (recordTarget.id === 'ANON-4827' && isReportResolved) ? (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                    <CheckCircle size={14} />
                    <span>Case Resolved · Read-Only</span>
                  </span>
                ) : recordTarget.resolutionStatus === 'Withdrawn by Employee' ||
                  recordTarget.resolutionStatus === 'Withdrawn' ? (
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200">
                    Withdrawn by Employee
                  </span>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => onOpenAddUpdate(recordTarget)}
                      className="px-4 py-2.5 rounded-xl bg-[#5455EE] hover:bg-[#4344dd] text-white text-xs font-extrabold transition-all shadow-md shadow-[#5455EE]/25 flex items-center gap-1.5 cursor-pointer"
                      title="Add follow-up notes or updates under this case"
                    >
                      <PlusCircle size={14} />
                      <span>Add Follow-up Note</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenRetract(recordTarget)}
                      className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-bold text-rose-700 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw size={14} />
                      <span>
                        {recordTarget.reviewStatus === 'Reviewed'
                          ? 'Retract Case'
                          : 'Take Back Submission'}
                      </span>
                    </button>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer shadow-sm"
              >
                Close
              </button>
            </div>
          </>
        ) : (
          /* BRANCH 2: PULSE SURVEY OR FEEDBACK RECORD VIEWING */
          <>
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-mono font-extrabold text-[#5455EE] bg-[#EEF0FF] px-2.5 py-0.5 rounded-md border border-[#5455EE]/20">
                    {recordTarget.displayId || (recordTarget.type === 'pulse' ? 'S001' : 'F001')}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    (Ref: {recordTarget.systemId || recordTarget.id})
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    {recordTarget.type === 'pulse' ? 'Pulse Survey Check-in' : 'Constructive Feedback'}
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-extrabold text-slate-900 mt-0.5">
                  {recordTarget.title}
                </h4>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span>Submitted: {recordTarget.date}</span>
                  <span>•</span>
                  <span>Channel: Employee Voice</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {recordTarget.type === 'pulse' ? (
              <div className="flex flex-col gap-3.5">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-2">
                    Pulse Survey Scores:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#F8F9FD] p-3.5 rounded-2xl border border-slate-200">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500">Workload</span>
                      <strong className="text-sm font-extrabold text-[#5455EE]">
                        {recordTarget.scores?.workload || 6} / 10
                      </strong>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500">Clarity</span>
                      <strong className="text-sm font-extrabold text-[#5455EE]">
                        {recordTarget.scores?.clarity || 6} / 10
                      </strong>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500">Support</span>
                      <strong className="text-sm font-extrabold text-[#5455EE]">
                        {recordTarget.scores?.support || 6} / 10
                      </strong>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500">Help</span>
                      <strong className="text-sm font-extrabold text-[#5455EE]">
                        {recordTarget.scores?.help || 6} / 10
                      </strong>
                    </div>
                  </div>
                </div>
                {recordTarget.comment && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-700">Submitted Notes & Comments:</label>
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed">
                      {recordTarget.comment}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-700">Feedback Description:</label>
                  <div className="p-4 rounded-2xl bg-[#F8F9FD] border border-slate-200 text-xs text-slate-800 whitespace-pre-line leading-relaxed">
                    {recordTarget.description || recordTarget.message}
                  </div>
                </div>
                {recordTarget.outcome && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-700">Suggested Improvement:</label>
                    <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 text-xs text-emerald-950 leading-relaxed">
                      {recordTarget.outcome}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 mt-2 flex-wrap">
              {recordTarget.type === 'pulse' ? (
                <button
                  type="button"
                  onClick={onRetakeSurvey}
                  className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw size={14} />
                  <span>Retake / Update Survey</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onOpenRetract(recordTarget)}
                  className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-bold text-rose-700 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw size={14} />
                  <span>Take Back Submission</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer shadow-sm"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
