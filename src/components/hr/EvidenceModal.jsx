import React, { useEffect, useRef } from 'react';
import {
  X,
  ClipboardCheck,
  MessageSquare,
  Users2,
  Bot,
  TrendingUp,
  FileText,
  Flame,
  Compass,
  Award,
  Users,
  HelpCircle,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { CATEGORIES } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

const getCategoryIcon = (categoryKey) => {
  switch (categoryKey) {
    case 'con_01':
    case 'burnout':
      return Flame;
    case 'con_02':
    case 'role_expectations':
    case 'leadership':
      return Compass;
    case 'con_03':
    case 'recognition':
    case 'growth':
      return Award;
    case 'con_04':
    case 'collaboration':
    case 'change_mgmt':
      return Users;
    default:
      return HelpCircle;
  }
};

const getPulseMetrics = (concern, evidence, effectiveDeptName) => {
  const pulseText =
    typeof evidence.pulseSurvey === 'string'
      ? evidence.pulseSurvey
      : evidence.pulseSurvey?.summary || '';

  // Extract responses e.g. "18 responses" or "14 pulse responses"
  const respMatch = pulseText.match(/(\d+)\s+(?:pulse\s+)?responses/i);
  const repeatedResponses = respMatch
    ? respMatch[1]
    : concern?.id === 'CON-01'
      ? '18'
      : concern?.id === 'CON-02'
        ? '16'
        : '14';

  // Extract score e.g. "2.8/5" or "3.0/5"
  const scoreMatch = pulseText.match(/(\d+(?:\.\d+)?)\s*\/\s*5/);
  const clarityRate = scoreMatch ? `${scoreMatch[1]} / 5.0` : '2.8 / 5.0';

  // Extract delta e.g. "-12%"
  const deltaMatch = pulseText.match(/([+-]?\d+%\s*(?:vs\s+last\s+cycle)?)/i);
  const trend = deltaMatch ? deltaMatch[1] : '-12%';

  return {
    repeatedResponses,
    clarityRate,
    trend,
    pulseText:
      pulseText ||
      `${effectiveDeptName} cohort survey responses indicate elevated friction around workload and deadlines.`,
  };
};

export default function EvidenceModal({
  isOpen,
  onClose,
  concern,
  departmentName = '',
  isDepartmentView = false,
}) {
  const closeBtnRef = useRef(null);
  const {
    navigateTo,
    handleReviewReport,
    allReports,
    setHighlightPostId,
    showToast,
    currentDeptData,
  } = useApp();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !concern) return null;

  const cat = CATEGORIES[concern.categoryKey] || CATEGORIES.burnout;
  const CategoryIcon = getCategoryIcon(concern.categoryKey);
  const evidence = concern.evidenceSummary || {};
  const effectiveDeptName = departmentName || currentDeptData?.name || 'Engineering';

  const pulseMetrics = getPulseMetrics(concern, evidence, effectiveDeptName);

  const voluntarySummary =
    typeof evidence.voluntaryFeedback === 'string'
      ? evidence.voluntaryFeedback
      : evidence.voluntaryFeedback?.summary ||
      'Multiple related questions about unclear task priorities, additional tasks from senior colleagues, and workload conflict.';

  const anonymousReportSummary =
    typeof evidence.anonymousReport === 'string'
      ? evidence.anonymousReport
      : evidence.anonymousReport?.summary || '';

  const communitySummary =
    typeof evidence.community === 'string'
      ? evidence.community
      : evidence.community?.summary ||
      (concern.id === 'CON-01'
        ? "24 employees upvoted a peer advice thread on 'How to handle extra tasks passed down by senior peers without clear priorities' (7 comments)."
        : concern.id === 'CON-02'
          ? "Peer onboarding discussion on 'Unwritten PR review standards and conflicting lead directives' received 8 upvotes."
          : 'Peer recognition discussion on unrecognized launch efforts received 11 upvotes.');

  const aiSummary =
    typeof evidence.recurringPattern === 'string'
      ? evidence.recurringPattern
      : typeof evidence.aiAnalysis === 'string'
        ? evidence.aiAnalysis
        : typeof evidence.aiAssistant === 'string'
          ? evidence.aiAssistant
          : typeof evidence.ekoAiPattern === 'string'
            ? evidence.ekoAiPattern
            : evidence.ekoAiPattern?.summary ||
            'Recurring Eko conversation pattern detected over the past two weeks (6 interactions).';

  const operationalList = Array.isArray(evidence.operationalIndicators)
    ? evidence.operationalIndicators
    : typeof evidence.operationalIndicators === 'string'
      ? evidence.operationalIndicators
        .split(/;\s*|\.\s+(?=[A-Z])|\s+and\s+(?=[A-Z])/i)
        .map((s) => s.trim().replace(/\.$/, ''))
        .filter(Boolean)
      : [
        'Engineering overtime: increased by 18% over the past 30 days.',
        'Deadline collisions: 2 new hires affected with 3 conflicting deliverables in JIRO.',
      ];

  const handleReviewSpecificReport = () => {
    onClose();
    const targetReport = allReports?.find(
      (r) => r.id === 'R004' || r.employeeCode === 'ANON-4827'
    ) || {
      id: 'R004',
      employeeCode: 'ANON-4827',
      isAnonymous: true,
      anonymityType: 'Department-Level Anonymous',
      department: 'Engineering',
      tenure: '5 months',
      priority: 'High',
      status: 'Action Required',
      concernCategory: 'con_01',
      concernTitle: 'Repeated workload transfers and conflicting priorities',
      snippet:
        'A senior colleague repeatedly transfers testing and documentation work without checking existing commitments. My manager gives unclear instructions and does not consistently resolve conflicting deadlines. I am working overtime and am afraid to raise the issue because I am new.',
      suggestedAction:
        'Investigate task allocation, route case to Head of Engineering, protect reporter identity',
    };
    handleReviewReport(targetReport);
    showToast('Opened confidential report R004 triage review');
  };

  const handleGoToFeedback = () => {
    onClose();
    navigateTo('reports');
    showToast('Navigated to Employee Feedback triage in Reports');
  };

  const handleGoToCommunityPost = () => {
    onClose();
    setHighlightPostId('COM-1');
    navigateTo('community');
    showToast('Navigated to related post on Community Board');
  };

  const handleGoToPulseSurveys = () => {
    onClose();
    navigateTo('reports');
    showToast(`Navigated to ${effectiveDeptName} Pulse Survey results`);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="evidence-modal-title"
    >
      <div className="bg-white rounded-3xl shadow-2xl border border-[#EBECEF] max-w-3xl w-full my-auto flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-white border-b border-[#EBECEF] flex items-start justify-between gap-4 flex-shrink-0">
          <div className="flex items-start gap-3.5">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xs border border-black/5"
              style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
            >
              <CategoryIcon size={22} strokeWidth={2.3} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                  {concern.code || concern.id}
                </span>
                <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                  {concern.title}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-300">
                  {concern.priority} Priority
                </span>
              </div>
              <h3
                id="evidence-modal-title"
                className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug"
              >
                Detailed Evidence & Signals — {concern.code || concern.id}
              </h3>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                {concern.description || cat?.description || concern.title}
              </p>
            </div>
          </div>

          <button
            ref={closeBtnRef}
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
            title="Close dialog (Escape)"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Content: Grouped Evidence Details */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 bg-[#F8F9FD]">
          {/* Source 1: Pulse Survey */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#EBECEF] shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#5455EE] text-white flex items-center justify-center flex-shrink-0">
                  <ClipboardCheck size={14} />
                </div>
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
                  Pulse Survey Signals
                </h4>
              </div>
              <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                {effectiveDeptName} Cohort
              </span>
            </div>

            {/* Structured Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div className="p-2.5 rounded-xl bg-[#F8F9FD] border border-slate-200/80 flex flex-col">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Repeated responses
                </span>
                <span className="text-lg font-black text-slate-900 mt-0.5">
                  {pulseMetrics.repeatedResponses}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F8F9FD] border border-slate-200/80 flex flex-col">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Priority clarity rate
                </span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-lg font-black text-rose-600">
                    {pulseMetrics.clarityRate}
                  </span>
                  <span className="text-[10px] font-bold text-rose-600">
                    ({pulseMetrics.trend})
                  </span>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F8F9FD] border border-slate-200/80 col-span-2 sm:col-span-1 flex flex-col">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Department cohort
                </span>
                <span className="text-xs font-bold text-[#5455EE] mt-1.5 truncate">
                  {effectiveDeptName}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {pulseMetrics.pulseText}
            </p>

            {/* Action button link to see all pulse surveys */}
            <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleGoToPulseSurveys}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EEF0FF] hover:bg-[#5455EE] text-[#5455EE] hover:text-white text-xs font-bold transition-all cursor-pointer group shadow-2xs hover:shadow-xs"
                title={`See all pulse surveys for ${effectiveDeptName}`}
              >
                <ClipboardCheck size={13} />
                <span>View pulse surveys(engineering)</span>
                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
              <span className="text-[10px] text-slate-400 italic">
                *Aggregated data · Anonymity threshold (≥ 5 responses) met
              </span>
            </div>
          </div>

          {/* Source 2: Feedback & Reports */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#EBECEF] shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center flex-shrink-0">
                  <MessageSquare size={14} />
                </div>
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
                  Feedback & Reports
                </h4>
              </div>
              <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                Active Submissions
              </span>
            </div>

            <p className="text-xs text-slate-800 leading-relaxed font-semibold">
              {evidence.feedbackCountSummary || voluntarySummary}
            </p>

            {/* Individual Feedback & Report Items with Direct Button Links */}
            <div className="space-y-2.5">
              {evidence.feedbackItems && evidence.feedbackItems.length > 0 ? (
                evidence.feedbackItems.map((itemStr, idx) => {
                  const isAnonReport = itemStr.includes('Anonymous report:');
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-[#F8F9FD] border border-slate-200/90 text-xs text-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-2.5">
                        {isAnonReport ? (
                          <FileText size={16} className="text-[#5455EE] mt-0.5 flex-shrink-0" />
                        ) : (
                          <MessageSquare size={16} className="text-teal-600 mt-0.5 flex-shrink-0" />
                        )}
                        <div>
                          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                            {isAnonReport ? (
                              <>
                                <span className="px-1.5 py-0.5 rounded-md bg-[#EEF0FF] text-[#5455EE] font-black text-[10px] tracking-wider uppercase">
                                  Case #R004
                                </span>
                                <span className="px-1.5 py-0.5 rounded-md bg-slate-200/70 text-slate-700 font-bold text-[10px]">
                                  ANON-4827
                                </span>
                                <span className="px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-700 font-bold text-[10px] border border-rose-200">
                                  High Priority
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="px-1.5 py-0.5 rounded-md bg-teal-50 text-teal-700 font-black text-[10px] tracking-wider uppercase border border-teal-200/60">
                                  Voluntary Feedback
                                </span>
                                <span className="px-1.5 py-0.5 rounded-md bg-slate-200/70 text-slate-600 font-bold text-[10px]">
                                  Anonymous Pod
                                </span>
                              </>
                            )}
                          </div>
                          <p className="text-slate-700 leading-relaxed font-medium">
                            {itemStr.replace(/^(?:Anonymous report|Voluntary feedback):\s*/i, '')}
                          </p>
                        </div>
                      </div>

                      {/* Direct button link to the report or feedback */}
                      {isAnonReport ? (
                        <button
                          type="button"
                          onClick={handleReviewSpecificReport}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#5455EE] hover:bg-[#4546DF] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer whitespace-nowrap self-start sm:self-center flex-shrink-0 group"
                          title="Open Confidential Report R004 in Triage Modal"
                        >
                          <span>Review Report R004</span>
                          <ArrowRight
                            size={12}
                            className="group-hover:translate-x-0.5 transition-transform"
                          />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleGoToFeedback}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#EEF0FF] text-slate-700 hover:text-[#5455EE] border border-slate-200 hover:border-[#5455EE]/40 text-xs font-bold transition-all cursor-pointer whitespace-nowrap self-start sm:self-center flex-shrink-0 group"
                          title="View all voluntary feedback in Reports page"
                        >
                          <span>View Feedback</span>
                          <ArrowRight
                            size={12}
                            className="group-hover:translate-x-0.5 transition-transform"
                          />
                        </button>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="p-3.5 rounded-2xl bg-[#F8F9FD] border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  {voluntarySummary}
                </div>
              )}
            </div>

            {/* Bottom link to Feedback & Reports full view */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">
                Confidential triage & resolution workflow
              </span>
              <button
                type="button"
                onClick={handleGoToFeedback}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#5455EE] hover:underline cursor-pointer"
              >
                <span>Open Feedback & Reports full view</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>

          {/* Source 3: Community Signals */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#EBECEF] shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center flex-shrink-0">
                  <Users2 size={14} />
                </div>
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
                  Community Signals
                </h4>
              </div>
              <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200/60">
                Peer Discussion
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {communitySummary}
            </p>

            {/* Action button link to the related community post */}
            <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleGoToCommunityPost}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white border border-purple-200/80 text-xs font-bold transition-all cursor-pointer group shadow-2xs hover:shadow-xs"
                title="Open related discussion on Community Board (COM-1)"
              >
                <Users2 size={13} />
                <span>View related community post (COM-1)</span>
                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
              <span className="text-[10px] text-slate-400 italic">
                *Peer sentiment signal · Identities permanently masked
              </span>
            </div>
          </div>

          {/* Source 4: AI Assistant */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200/90 shadow-2xs space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-amber-600 text-white flex items-center justify-center flex-shrink-0">
                <Bot size={14} />
              </div>
              <h4 className="text-xs font-extrabold text-amber-950 uppercase tracking-wide">
                AI Assistant (Eko Recurring Pattern)
              </h4>
            </div>
            <p className="text-xs text-amber-950 leading-relaxed font-medium">
              {aiSummary}
            </p>
            <p className="text-[10px] text-amber-800 italic">
              *Conversation content is isolated and confidential. Only aggregated friction patterns are shared.
            </p>
          </div>

          {/* Source 5: Operational Indicators */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#EBECEF] shadow-2xs space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                <TrendingUp size={14} />
              </div>
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
                Operational Indicators
              </h4>
            </div>
            <ul className="space-y-1.5 pl-4 text-xs text-slate-700 list-disc font-medium">
              {operationalList.map((indicator, idx) => (
                <li key={idx} className="leading-relaxed">
                  {indicator}
                </li>
              ))}
            </ul>
            <p className="text-[10px] text-slate-400 italic">
              *Department telemetry aggregates used as systemic context, not individual performance assessments.
            </p>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#EBECEF] flex items-center justify-end flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
