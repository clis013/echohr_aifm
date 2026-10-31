import React, { useState, useEffect } from 'react';
import { CATEGORIES } from '../../data/mockData';
import DonutChart from '../common/DonutChart';
import EvidenceModal from './EvidenceModal';
import { useApp } from '../../context/AppContext';
import {
  ChevronDown,
  Filter,
  CheckCircle2,
  ClipboardCheck,
  MessageSquare,
  Bot,
  TrendingUp,
  Flame,
  Compass,
  Users,
  Award,
  HelpCircle,
  X,
  Building2,
  ArrowRight,
  Sparkles,
  Layers,
} from 'lucide-react';

const departmentMap = {
  engineering: 'engineering',
  'engineering & tech': 'engineering',
  product: 'product',
  'product & design': 'product',
  sales: 'sales',
  'sales & marketing': 'sales',
  'customer support': 'support',
  support: 'support',
  operations: 'operations',
};

const getDepartmentKey = (deptName) => {
  if (!deptName) return null;
  const lower = deptName.toLowerCase().trim();
  if (departmentMap[lower]) return departmentMap[lower];
  if (lower.includes('eng')) return 'engineering';
  if (lower.includes('prod')) return 'product';
  if (lower.includes('sale')) return 'sales';
  if (lower.includes('supp')) return 'support';
  if (lower.includes('op')) return 'operations';
  return null;
};

const parseDeptInfo = (dept) => {
  if (typeof dept === 'object' && dept !== null) {
    return {
      name: dept.name,
      level: dept.level || 'High',
      deptKey: getDepartmentKey(dept.name),
    };
  }
  const match = String(dept).match(/^([^(]+)(?:\(([^)]+)\))?/);
  const name = match ? match[1].trim() : String(dept);
  const level = match && match[2] ? match[2].trim() : null;
  return {
    name,
    level,
    deptKey: getDepartmentKey(name),
  };
};

const getRecommendedSteps = (stepData) => {
  if (Array.isArray(stepData)) return stepData;
  if (stepData && typeof stepData === 'object' && Array.isArray(stepData.detailed)) {
    return stepData.detailed;
  }
  const text =
    typeof stepData === 'string'
      ? stepData
      : stepData?.short || stepData?.recommended || '';
  if (!text) return [];
  return text
    .split(/(?<=\.)\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
};

const getOperationalList = (opData) => {
  if (Array.isArray(opData) && opData.length > 0) return opData;
  if (!opData) {
    return [
      'Engineering overtime: increased by 18% over the past 30 days.',
      'Deadline collisions: 2 new hires affected with 3 conflicting deliverables in JIRO.',
    ];
  }
  if (typeof opData === 'string') {
    const parts = opData
      .split(/;\s*|\.\s+(?=[A-Z])|\s+and\s+(?=[A-Z])/i)
      .map((s) => s.trim().replace(/\.$/, ''))
      .filter(Boolean);
    return parts.length > 0 ? parts : [opData];
  }
  if (typeof opData === 'object' && opData.metrics) {
    return opData.metrics.map((m) => `${m.name}: ${m.value} (${m.window || 'recent'})`);
  }
  return [String(opData)];
};

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

const getStructuredEvidenceTiles = (item, isDepartmentView, departmentName) => {
  const ev = item.evidenceSummary || {};
  const id = item.code || item.id;

  if (id === 'CON-01') {
    return [
      {
        key: 'pulse',
        channel: 'Pulse Survey',
        icon: ClipboardCheck,
        iconStyle: 'text-indigo-600 bg-indigo-50 border-indigo-100',
        pills: [
          { label: 'Score', val: '2.8 / 5', delta: '-12%' },
          { label: 'Cohort', val: '14 Responses' },
        ],
        headline: 'Workload & Deadlines',
        text: 'Responses cite severe sprint delivery pressure, competing deadlines, and declining priority clarity.',
      },
      {
        key: 'feedback',
        channel: 'Feedback & Reports',
        icon: MessageSquare,
        iconStyle: 'text-blue-600 bg-blue-50 border-blue-100',
        pills: [
          { label: 'Confidential', val: '1 Report' },
          { label: 'Voluntary', val: '3 Submissions' },
        ],
        headline: 'Senior Task Offloading',
        text: 'Reports cite senior colleagues repeatedly delegating testing and documentation without checking capacity.',
      },
      {
        key: 'community',
        channel: 'Community Board',
        icon: Users,
        iconStyle: 'text-purple-600 bg-purple-50 border-purple-100',
        pills: [
          { label: 'Engagement', val: '24 Upvotes' },
          { label: 'Thread', val: '7 Comments' },
        ],
        headline: 'Trending Peer Discussion',
        text: "Active peer thread on 'How to handle extra tasks passed down by senior peers without clear priorities'.",
      },
      {
        key: 'ai',
        channel: 'AI Assistant (Eko)',
        icon: Bot,
        iconStyle: 'text-amber-600 bg-amber-50 border-amber-100',
        pills: [
          { label: 'Telemetry', val: '6 Sessions' },
          { label: 'Pattern', val: 'Task Friction' },
        ],
        headline: 'Recurring Handoff Queries',
        text: 'Employees seeking guidance on clarifying deliverable scope, workload overload, and declining extra tasks.',
      },
      {
        key: 'ops',
        channel: 'Operational Indicators',
        icon: TrendingUp,
        iconStyle: 'text-emerald-600 bg-emerald-50 border-emerald-100',
        pills: [
          { label: 'Overtime', val: '+18% (30d)', alert: true },
          { label: 'JIRO', val: '3 Collisions' },
        ],
        headline: 'Capacity Spillover & Bottlenecks',
        text: 'Overtime increased 18%; 2 new hires affected with 3 conflicting sprint deliverables in JIRO.',
      },
    ];
  }

  if (id === 'CON-02') {
    return [
      {
        key: 'pulse',
        channel: 'Pulse Survey',
        icon: ClipboardCheck,
        iconStyle: 'text-indigo-600 bg-indigo-50 border-indigo-100',
        pills: [
          { label: 'Score', val: '3.1 / 5', delta: '-8%' },
          { label: 'Cohort', val: '11 Responses' },
        ],
        headline: 'Deliverable Ambiguity',
        text: 'Responses report unclear acceptance criteria and insufficient managerial guidance in sprint cycles.',
      },
      {
        key: 'feedback',
        channel: 'Feedback & Reports',
        icon: MessageSquare,
        iconStyle: 'text-blue-600 bg-blue-50 border-blue-100',
        pills: [
          { label: 'Confidential', val: '1 Report' },
          { label: 'Voluntary', val: '5 Submissions' },
        ],
        headline: 'Contradictory Squad Directives',
        text: 'Submissions request explicit acceptance criteria and standardized task briefs for sprint items.',
      },
      {
        key: 'community',
        channel: 'Community Board',
        icon: Users,
        iconStyle: 'text-purple-600 bg-purple-50 border-purple-100',
        pills: [
          { label: 'Engagement', val: '8 Upvotes' },
        ],
        headline: 'PR Standard Alignment',
        text: "Peer discussion highlighting unwritten PR review standards and conflicting lead directives.",
      },
      {
        key: 'ai',
        channel: 'AI Assistant (Eko)',
        icon: Bot,
        iconStyle: 'text-amber-600 bg-amber-50 border-amber-100',
        pills: [
          { label: 'Telemetry', val: '4 Sessions' },
          { label: 'Pattern', val: 'Role Clarity' },
        ],
        headline: 'Architectural Guidance Inquiries',
        text: 'Inquiries regarding architectural standards and conflicting technical guidance between squad leads.',
      },
      {
        key: 'ops',
        channel: 'Operational Indicators',
        icon: TrendingUp,
        iconStyle: 'text-emerald-600 bg-emerald-50 border-emerald-100',
        pills: [
          { label: 'PR Turnaround', val: '4.2 Days (SLA: 24h)', alert: true },
          { label: '1-on-1s', val: '68% Adherence' },
        ],
        headline: 'Review SLA Slippage',
        text: 'PR review turnaround lengthened to 4.2 days; 1-on-1 cadence adherence dropped to 68% for junior cohort.',
      },
    ];
  }

  if (id === 'CON-03') {
    return [
      {
        key: 'pulse',
        channel: 'Pulse Survey',
        icon: ClipboardCheck,
        iconStyle: 'text-indigo-600 bg-indigo-50 border-indigo-100',
        pills: [
          { label: 'Cohort', val: '8 Responses' },
        ],
        headline: 'Recognition & Growth Gap',
        text: 'Responses cite absence of milestone acknowledgment and zero protected learning time.',
      },
      {
        key: 'feedback',
        channel: 'Feedback & Reports',
        icon: MessageSquare,
        iconStyle: 'text-blue-600 bg-blue-50 border-blue-100',
        pills: [
          { label: 'Voluntary', val: '2 Submissions' },
        ],
        headline: 'Retrospective Omissions',
        text: 'Feedback notes cross-functional launch contributions consistently omitted from sprint retros.',
      },
      {
        key: 'community',
        channel: 'Community Board',
        icon: Users,
        iconStyle: 'text-purple-600 bg-purple-50 border-purple-100',
        pills: [
          { label: 'Engagement', val: '11 Upvotes' },
          { label: 'Thread', val: '4 Comments' },
        ],
        headline: 'Milestone Recognition Discussion',
        text: "Discussion asking 'Does extra effort during launch milestones actually get acknowledged?'.",
      },
      {
        key: 'ai',
        channel: 'AI Assistant (Eko)',
        icon: Bot,
        iconStyle: 'text-amber-600 bg-amber-50 border-amber-100',
        pills: [
          { label: 'Telemetry', val: '3 Sessions' },
          { label: 'Pattern', val: 'Career Growth' },
        ],
        headline: 'Progression Framework Inquiries',
        text: 'Employees inquiring about promotion criteria, progression paths, and 30-60-90 check-ins.',
      },
      {
        key: 'ops',
        channel: 'Operational Indicators',
        icon: TrendingUp,
        iconStyle: 'text-emerald-600 bg-emerald-50 border-emerald-100',
        pills: [
          { label: 'Shoutouts', val: '-35% (30d)', alert: true },
          { label: 'Learning Time', val: '0 Hours' },
        ],
        headline: 'Acknowledgment Decline',
        text: 'Peer shoutouts declined 35%; zero professional development hours logged in past sprint cycle.',
      },
    ];
  }

  // Dynamic fallback for any other custom concern
  const pulseText =
    typeof ev.pulseSurvey === 'string'
      ? ev.pulseSurvey
      : ev.pulseSurvey?.summary ||
        (isDepartmentView && departmentName
          ? `${departmentName} cohort survey responses cite workload pressure and competing priorities.`
          : 'Survey responses cite workload pressure and competing deadlines.');

  const feedbackText =
    ev.feedbackCountSummary ||
    (typeof ev.voluntaryFeedback === 'string' ? ev.voluntaryFeedback : ev.voluntaryFeedback?.summary) ||
    '1 anonymous report and 3 voluntary feedback submissions.';

  const commText =
    typeof ev.community === 'string'
      ? ev.community
      : ev.community?.summary || 'Peer discussion thread on workload and priority alignment.';

  const aiText =
    typeof ev.recurringPattern === 'string'
      ? ev.recurringPattern
      : typeof ev.aiAnalysis === 'string'
      ? ev.aiAnalysis
      : typeof ev.aiAssistant === 'string'
      ? ev.aiAssistant
      : typeof ev.ekoAiPattern === 'string'
      ? ev.ekoAiPattern
      : ev.ekoAiPattern?.summary || 'Recurring Eko support interaction pattern detected.';

  const opsList = getOperationalList(ev.operationalIndicators);

  return [
    {
      key: 'pulse',
      channel: 'Pulse Survey',
      icon: ClipboardCheck,
      iconStyle: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      pills: [{ label: 'Survey', val: 'Cohort Data' }],
      headline: 'Survey Feedback',
      text: pulseText,
    },
    {
      key: 'feedback',
      channel: 'Feedback & Reports',
      icon: MessageSquare,
      iconStyle: 'text-blue-600 bg-blue-50 border-blue-100',
      pills: [{ label: 'Submissions', val: 'Active Channels' }],
      headline: 'Reporter Themes',
      text: feedbackText,
    },
    {
      key: 'community',
      channel: 'Community Board',
      icon: Users,
      iconStyle: 'text-purple-600 bg-purple-50 border-purple-100',
      pills: [{ label: 'Forum', val: 'Peer Thread' }],
      headline: 'Community Discussions',
      text: commText,
    },
    {
      key: 'ai',
      channel: 'AI Assistant (Eko)',
      icon: Bot,
      iconStyle: 'text-amber-600 bg-amber-50 border-amber-100',
      pills: [{ label: 'AI Telemetry', val: 'Pattern Logged' }],
      headline: 'Copilot Trends',
      text: aiText,
    },
    {
      key: 'ops',
      channel: 'Operational Indicators',
      icon: TrendingUp,
      iconStyle: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      pills: [{ label: 'Ops Data', val: `${opsList.length} Metrics` }],
      headline: 'System Metrics',
      text: opsList.join(' • '),
    },
  ];
};

export default function PriorityConcerns({
  distribution,
  concerns,
  selectedCategoryFilter,
  onSelectCategoryFilter,
  onClearCategoryFilter,
  isDepartmentView = false,
  departmentName = '',
  onSelectDepartment,
  onActionPlanClick,
  onLaunchPlan,
  onViewReports,
}) {
  const {
    actionPlans,
    handleNavigateToActionPlan,
    expandedConcernId,
    setExpandedConcernId,
    evidenceModalConcern,
    setEvidenceModalConcern,
  } = useApp();

  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [selectedEvidenceConcern, setSelectedEvidenceConcern] = useState(null);

  // Sync expandedConcernId when navigated from Actions & Follow-up
  useEffect(() => {
    if (expandedConcernId) {
      setExpandedId(expandedConcernId);
      setTimeout(() => {
        const el = document.getElementById(`concern-${expandedConcernId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
    }
  }, [expandedConcernId]);

  // Filter list
  let filtered = concerns;
  if (priorityFilter !== 'all') {
    filtered = filtered.filter((c) => c.priority.toLowerCase() === priorityFilter.toLowerCase());
  }
  if (selectedCategoryFilter) {
    filtered = filtered.filter(
      (c) =>
        c.categoryKey === selectedCategoryFilter ||
        (CATEGORIES[selectedCategoryFilter] && c.categoryKey === CATEGORIES[selectedCategoryFilter].id)
    );
  }

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-amber-500/10 text-amber-800 border-amber-300';
      case 'Medium':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Emerging':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white border border-[#EBECEF] rounded-3xl p-5 sm:p-6 shadow-card hover:border-[#5455EE]/30 transition-all flex flex-col gap-5">
      {/* 1. Header with Title and Connected Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Disengagement Concerns & Distribution
          </h3>
          {isDepartmentView && departmentName && (
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#F4F5FA] text-[#5455EE] border border-[#EBECEF]">
              {departmentName}
            </span>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          {/* Active Theme Filter Tag */}
          {selectedCategoryFilter && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EEF0FF] text-[#5455EE] border border-[#5455EE]/30 rounded-full text-xs font-bold animate-in fade-in">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: CATEGORIES[selectedCategoryFilter]?.color || '#5455EE' }}
              />
              <span className="truncate max-w-[160px] sm:max-w-none">
                {CATEGORIES[selectedCategoryFilter]?.name || selectedCategoryFilter}
              </span>
              <button
                type="button"
                onClick={onClearCategoryFilter}
                className="w-4 h-4 rounded-full hover:bg-[#5455EE]/20 flex items-center justify-center transition-colors cursor-pointer text-[#5455EE]"
                title="Clear theme filter"
                aria-label="Clear theme filter"
              >
                <X size={12} strokeWidth={2.5} />
              </button>
            </div>
          )}

          {/* Active Priority Tag */}
          {priorityFilter !== 'all' && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 border border-slate-300 rounded-full text-xs font-bold animate-in fade-in capitalize">
              <span>{priorityFilter} Priority</span>
              <button
                type="button"
                onClick={() => setPriorityFilter('all')}
                className="w-4 h-4 rounded-full hover:bg-slate-300 flex items-center justify-center transition-colors cursor-pointer text-slate-600"
                title="Clear priority filter"
                aria-label="Clear priority filter"
              >
                <X size={12} strokeWidth={2.5} />
              </button>
            </div>
          )}

          {/* Filter Dropdown Popover */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                priorityFilter !== 'all' || selectedCategoryFilter
                  ? 'bg-[#5455EE] text-white border-[#5455EE] shadow-sm'
                  : 'bg-white border-[#EBECEF] text-slate-600 hover:bg-[#F8F9FD]'
              }`}
              title="Filter concerns"
            >
              <Filter
                size={13}
                className={priorityFilter !== 'all' || selectedCategoryFilter ? 'text-white' : 'text-slate-400'}
              />
              <span>
                {priorityFilter !== 'all' || selectedCategoryFilter
                  ? `Filter (${(priorityFilter !== 'all' ? 1 : 0) + (selectedCategoryFilter ? 1 : 0)})`
                  : 'Filter Concerns'}
              </span>
              <ChevronDown size={13} className="opacity-60" />
            </button>

            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-[#EBECEF] rounded-2xl shadow-xl z-30 p-4 text-xs flex flex-col gap-3.5 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <span className="font-extrabold text-slate-900 text-xs">Filter Concerns</span>
                  {(selectedCategoryFilter || priorityFilter !== 'all') && (
                    <button
                      type="button"
                      onClick={() => {
                        setPriorityFilter('all');
                        if (onClearCategoryFilter) onClearCategoryFilter();
                      }}
                      className="text-[11px] font-bold text-[#5455EE] hover:underline cursor-pointer"
                    >
                      Reset all
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Concern Theme
                  </label>
                  <select
                    value={selectedCategoryFilter || 'all'}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'all') {
                        if (onClearCategoryFilter) onClearCategoryFilter();
                      } else {
                        if (onSelectCategoryFilter) onSelectCategoryFilter(val);
                      }
                    }}
                    className="w-full bg-[#F8F9FD] border border-[#EBECEF] rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#5455EE] cursor-pointer"
                  >
                    <option value="all">All Concern Themes</option>
                    <option value="con_01">Burnout & Workload Imbalance</option>
                    <option value="con_02">Unclear Role Expectations & Poor Manager Support</option>
                    <option value="con_03">Lack of Recognition & Career Growth</option>
                    <option value="con_04">Collaboration & Organisational Change</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Priority Level
                  </label>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="w-full bg-[#F8F9FD] border border-[#EBECEF] rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#5455EE] cursor-pointer"
                  >
                    <option value="all">All Priorities</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="emerging">Low / Emerging Priority</option>
                  </select>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Showing {filtered.length} of {concerns.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowFilterDropdown(false)}
                    className="px-3.5 py-1.5 bg-[#5455EE] text-white text-xs font-bold rounded-xl hover:bg-[#4344dd] cursor-pointer shadow-xs transition-all"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Embedded Concern Distribution Donut Chart */}
      {distribution && (
        <DonutChart
          distribution={distribution}
          departmentName={departmentName}
          isDepartmentView={isDepartmentView}
          selectedCategoryId={selectedCategoryFilter}
          onSelectCategory={(catId) => {
            if (onSelectCategoryFilter) {
              onSelectCategoryFilter(catId === selectedCategoryFilter ? null : catId);
            }
          }}
        />
      )}

      {/* 3. Concerns Counter & Subtitle */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">
            Actionable Early Signals
          </span>
          <span className="text-[11px] font-semibold text-slate-400">
            ({filtered.length} {filtered.length === 1 ? 'concern' : 'concerns'})
          </span>
        </div>

        {(selectedCategoryFilter || priorityFilter !== 'all') && (
          <button
            type="button"
            onClick={() => {
              setPriorityFilter('all');
              if (onClearCategoryFilter) onClearCategoryFilter();
            }}
            className="text-xs font-semibold text-[#5455EE] hover:underline cursor-pointer"
          >
            Reset all filters
          </button>
        )}
      </div>

      {/* 4. Concerns List */}
      <div className="flex flex-col gap-3.5">
        {filtered.length === 0 ? (
          <div className="text-center py-10 bg-[#F4F5FA] rounded-2xl border border-dashed border-[#EBECEF]">
            <CheckCircle2 size={32} className="text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-800">No concerns under this priority filter</p>
            <span className="text-xs text-slate-400">All indicators in safe range.</span>
          </div>
        ) : (
          filtered.map((item) => {
            const cat = CATEGORIES[item.categoryKey] || CATEGORIES.burnout;
            const CategoryIcon = getCategoryIcon(item.categoryKey);
            const isExpanded = expandedId === item.id;
            const evidence = item.evidenceSummary || {};
            const linkedAction =
              actionPlans?.find(
                (p) => p.linkedConcern === item.id || p.linkedConcern === item.code
              ) || (item.id === 'CON-01' ? actionPlans?.[0] : null);

            return (
              <div
                key={item.id}
                id={`concern-${item.id}`}
                className="border border-[#EBECEF] rounded-2xl bg-white overflow-hidden hover:border-[#5455EE]/40 hover:shadow-xs transition-all shadow-sm"
              >
                {/* Concern card (dropdown closed): Icon, id, concern theme, priority tag, short description */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="p-4 flex flex-col gap-1 cursor-pointer hover:bg-[#F8F9FD]/60 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Icon */}
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xs border border-black/5"
                        style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                      >
                        <CategoryIcon size={20} strokeWidth={2.2} />
                      </div>

                      {/* ID and Concern Theme */}
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                            {item.code || item.id}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-gray-900 leading-snug">
                          {item.title}
                        </h4>
                      </div>
                    </div>

                    {/* Priority tag & Chevron */}
                    <div className="flex items-center gap-2 flex-shrink-0 mt-1">
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getPriorityBadge(
                          item.priority
                        )}`}
                      >
                        {item.priority} priority
                      </span>
                      <ChevronDown
                        size={18}
                        className={`text-gray-400 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </div>

                  {/* Short description (same as now) */}
                  {!isExpanded && (
                    <p className="text-sm text-gray-600 leading-relaxed pr-6 mt-1.5 line-clamp-2 pl-[52px]">
                      {item.description || cat?.description}
                    </p>
                  )}
                </div>

                {/* Concern card (dropdown open) */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-3 border-t border-gray-100 bg-[#FAFAFC] text-gray-800 text-sm flex flex-col gap-4 animate-in fade-in duration-150">
                    {/* 1. Direct description (no extra label, single clean description) */}
                    <p className="text-sm text-gray-700 leading-relaxed pl-0.5">
                      {item.description || cat?.description}
                    </p>

                    <hr className="border-gray-200/80 my-0.5" />

                    {/* 2. Detected, Status, Department affected in vertical arrangement (detected and status on same line) */}
                    <div className="flex flex-col gap-2 text-sm text-slate-700 pl-0.5">
                      <div className="flex items-center gap-6 flex-wrap">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-bold text-[#5455EE]">Detected:</span>
                          <span className="text-slate-700">{item.detected || item.detectedWindow || 'Past 14 days'}</span>
                        </div>

                        <div className="flex items-baseline gap-1.5">
                          <span className="font-bold text-[#5455EE]">Status:</span>
                          <span className="text-slate-700">{item.status || 'Requires Investigation'}</span>
                        </div>
                      </div>

                      {/* Department affected: only shown in Organizational / All Departments view */}
                      {!isDepartmentView && (
                        <div className="flex items-start sm:items-center gap-2 flex-wrap">
                          <span className="font-bold text-[#5455EE]">Department affected:</span>
                          <div className="flex flex-wrap items-center gap-2">
                            {(
                              item.departmentsAffected || [
                                'Engineering (High)',
                                'Sales & Marketing (Medium)',
                              ]
                            ).map((deptStr, idx) => {
                              const deptInfo = parseDeptInfo(deptStr);
                              return deptInfo.deptKey ? (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (onSelectDepartment) onSelectDepartment(deptInfo.deptKey);
                                  }}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white hover:bg-[#EEF0FF] text-slate-800 hover:text-[#5455EE] border border-slate-200 hover:border-[#5455EE]/40 text-xs font-bold shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
                                  title={`Switch to ${deptInfo.name} department view in dashboard`}
                                >
                                  <Building2 size={13} className="text-slate-400 group-hover:text-[#5455EE]" />
                                  <span>{deptInfo.name}</span>
                                  {deptInfo.level && (
                                    <span className="text-slate-400 font-normal">
                                      ({deptInfo.level})
                                    </span>
                                  )}
                                  <span className="text-[#5455EE] font-bold group-hover:translate-x-0.5 transition-transform">
                                    ↗
                                  </span>
                                </button>
                              ) : (
                                <span
                                  key={idx}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-medium"
                                >
                                  <Building2 size={13} className="text-slate-400" />
                                  <span>{deptInfo.name}</span>
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 3. Pattern / Evidence Summary: Grouped in ONE single section with direct executive data reporting tiles */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#5455EE] uppercase tracking-wider">
                          <Layers size={13} />
                          <span>Pattern / Evidence Summary</span>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-400">
                          5 Synthesized Channels
                        </span>
                      </div>

                      <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#EBECEF] space-y-3 text-sm">
                        {/* Executive Data Reporting Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                          {getStructuredEvidenceTiles(item, isDepartmentView, departmentName).map((tile, idx) => {
                            const isFifth = idx === 4;
                            const IconComponent = tile.icon;
                            return (
                              <div
                                key={tile.key || idx}
                                className={`p-3 rounded-xl bg-[#FBFBFE] hover:bg-[#F6F7FD] border border-slate-200/80 transition-all flex flex-col justify-between gap-1.5 ${
                                  isFifth ? 'md:col-span-2' : ''
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                  <div className="flex items-center gap-2">
                                    <div
                                      className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 border ${tile.iconStyle}`}
                                    >
                                      <IconComponent size={13} strokeWidth={2.2} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-800">
                                      {tile.channel}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    {tile.pills.map((pill, pIdx) => (
                                      <span
                                        key={pIdx}
                                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold ${
                                          pill.alert
                                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                            : pill.delta
                                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                            : 'bg-white text-slate-700 border border-slate-200 shadow-2xs'
                                        }`}
                                      >
                                        {pill.label && (
                                          <span className="text-slate-400 font-semibold">
                                            {pill.label}:
                                          </span>
                                        )}
                                        <span className="font-extrabold">{pill.val}</span>
                                        {pill.delta && (
                                          <span className="text-rose-600 font-black">
                                            ({pill.delta})
                                          </span>
                                        )}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                <div className="text-xs text-slate-600 leading-relaxed mt-0.5">
                                  <strong className="font-bold text-slate-900">
                                    {tile.headline}:{' '}
                                  </strong>
                                  <span>{tile.text}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* “View all Evidence” dark button inside the unified section */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                          <span className="text-[11px] text-slate-500">
                            Drill down into verbatim excerpts, audit logs, and granular channel records
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEvidenceConcern(item);
                            }}
                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer group"
                            title="View all Evidence"
                          >
                            <Layers size={13} className="text-white" />
                            <span>View all Evidence</span>
                            <ArrowRight
                              size={13}
                              className="text-slate-400 group-hover:translate-x-0.5 group-hover:text-white transition-all"
                            />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 4. AI interpretation: Spacious container with comfortable padding so text never sticks to borders */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#5455EE] uppercase tracking-wider">
                        <Sparkles size={13} />
                        <span>AI Interpretation</span>
                      </div>
                      <div className="p-4 sm:p-5 rounded-2xl bg-[#EEF0FF]/60 border border-[#5455EE]/25 shadow-2xs">
                        <p className="text-sm text-slate-800 leading-relaxed font-medium">
                          {item.aiInterpretation ||
                            (item.id === 'CON-01'
                              ? 'Multiple anonymized signals indicate recurring task allocation ambiguity and workload friction among new hires in Engineering. HR should validate with manager context before assigning corrective action.'
                              : item.id === 'CON-02'
                              ? 'Signals suggest junior engineers face ambiguous acceptance criteria and conflicting guidance across technical leads, lengthening PR cycles to 4+ days.'
                              : 'Signals indicate employees in Product and Customer Success perceive contributions on cross-functional releases as uncredited, creating recognition gaps after launch milestones.')}
                        </p>
                      </div>
                    </div>

                    {/* 5. Recommend next step: Consistent section title design & point form / 123 */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#5455EE] uppercase tracking-wider">
                        <ClipboardCheck size={13} />
                        <span>Recommend Next Step</span>
                      </div>
                      <ol className="list-decimal pl-5 space-y-1.5 text-sm text-slate-800 leading-relaxed font-medium">
                        {getRecommendedSteps(item.recommendedNextStep).map((step, idx) => (
                          <li key={idx} className="pl-1">
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* 6. Action Button: Create Action Plan (Left bottom) — Dark button */}
                    <div className="pt-2 flex items-center justify-start">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const cat = CATEGORIES[item.categoryKey] || CATEGORIES.burnout;
                          if (onLaunchPlan) {
                            onLaunchPlan(item, cat);
                          } else if (onActionPlanClick) {
                            onActionPlanClick(item);
                          }
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer group"
                        title="Create Action Plan for this concern"
                      >
                        <Sparkles size={14} className="text-[#A5B4FC]" />
                        <span>Create Action Plan</span>
                        <ArrowRight
                          size={13}
                          className="text-slate-400 group-hover:translate-x-0.5 group-hover:text-white transition-all"
                        />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Evidence Modal */}
      <EvidenceModal
        isOpen={Boolean(selectedEvidenceConcern || evidenceModalConcern)}
        onClose={() => {
          setSelectedEvidenceConcern(null);
          if (setEvidenceModalConcern) setEvidenceModalConcern(null);
        }}
        concern={selectedEvidenceConcern || evidenceModalConcern}
        departmentName={departmentName}
        isDepartmentView={isDepartmentView}
      />
    </div>
  );
}
