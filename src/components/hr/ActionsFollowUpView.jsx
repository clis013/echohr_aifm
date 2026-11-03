import React, { useState, useMemo } from 'react';
import {
  ListTodo,
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Activity,
  User,
  Building2,
  Check,
  RotateCcw,
  ShieldAlert,
  Send,
  Sparkles,
  ExternalLink,
  Layers,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  MessageSquare,
  Bot,
  Users,
  Eye,
  FileCheck2,
  BellRing,
  Edit3,
  Sliders,
  Plus,
  Trash2,
  X,
  FileText,
  Quote,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import EvidenceModal from './EvidenceModal';
import { dataService } from '../../services/dataService';

// Default initial outcome tracking metrics for action plans
const getInitialOutcomeMetrics = (planId) => {
  const common = [
    {
      id: 'pulse',
      label: 'Pulse Manageability Score',
      beforeRate: '2.8 / 5',
      afterRate: '3.6 / 5',
      change: '+28% recovery',
      tone: 'emerald',
      source: 'Weekly Team Pulse Survey',
      details: 'Role clarity and sprint load manageability scores improved notably across 23 responses.',
      enabled: true,
    },
    {
      id: 'overtime',
      label: 'Department Overtime Surge',
      beforeRate: '+18%',
      afterRate: '+6%',
      change: '-12% reduction',
      tone: 'emerald',
      source: 'Timesheet & JIRO Audit',
      details: 'Unplanned sprint overtime moderated from +18% to +6%. JIRO deadline collisions dropped from 3 to 0.',
      enabled: true,
    },
    {
      id: 'ai_patterns',
      label: 'EkoAI Ambiguity Inquiries',
      beforeRate: '6 queries',
      afterRate: '2 queries',
      change: '-67% friction',
      tone: 'emerald',
      source: 'Eko AI Workplace Telemetry',
      details: 'Inquiries mentioning task handoffs or sprint ambiguity dropped from 6 to 2 over the past 14 days.',
      enabled: true,
    },
    {
      id: 'reports',
      label: 'New Escalation Reports',
      beforeRate: '3 / cycle',
      afterRate: '0 new reports',
      change: 'Safe Range',
      tone: 'emerald',
      source: 'Confidential Feedback Hub',
      details: 'No new anonymous or named reports submitted for this squad in the past 14 days.',
      enabled: true,
    },
    {
      id: 'community',
      label: 'Community Board Friction Heat',
      beforeRate: '24 upvotes',
      afterRate: 'Thread resolved',
      change: 'Cooled',
      tone: 'blue',
      source: 'Peer Community Board',
      details: 'Friction discussion thread cooled. 1 positive comment acknowledging clearer priority discussions.',
      enabled: false,
    },
  ];

  if (planId === 'AP-02') {
    common[0].beforeRate = '2.4 / 5';
    common[0].afterRate = '3.1 / 5';
    common[0].change = '+29% recovery';
    common[1].label = 'PR Review Cycle Time';
    common[1].beforeRate = '96h SLA';
    common[1].afterRate = '28h SLA';
    common[1].change = '-71% turnaround';
  } else if (planId === 'AP-03') {
    common[0].label = 'Recognition & Valued Index';
    common[0].beforeRate = '2.9 / 5';
    common[0].afterRate = '4.2 / 5';
    common[0].change = '+44% sentiment';
    common[1].label = 'Peer Spotlights Logged';
    common[1].beforeRate = '2 / month';
    common[1].afterRate = '14 / month';
    common[1].change = '+600% surge';
  }

  return common;
};

export default function ActionsFollowUpView() {
  const {
    actionPlans,
    selectedActionPlanId,
    setSelectedActionPlanId,
    handleApproveActionPlan,
    handleRequestRevision,
    handleEscalateActionPlan,
    handleSendReminder,
    handleNavigateToConcern,
    handleUpdateActionPlan,
    showToast,
  } = useApp();

  // Search & Status filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Expandable dropdown state: which action plan ID is currently expanded (defaults to AP-01)
  const [expandedPlanId, setExpandedPlanId] = useState('AP-01');

  // Plan Edit State: holds form values for in-place editing
  const [editingPlanData, setEditingPlanData] = useState({});

  // Outcome Tracking customization state: map of planId -> metrics array
  const [planMetrics, setPlanMetrics] = useState(() => {
    const initialMap = {};
    actionPlans.forEach((plan) => {
      initialMap[plan.id] = getInitialOutcomeMetrics(plan.id);
    });
    return initialMap;
  });

  // Modal / selector states
  const [editingMetricsPlanId, setEditingMetricsPlanId] = useState(null); // which plan is customizing outcome metrics
  const [newMetricForm, setNewMetricForm] = useState({
    label: '',
    beforeRate: '',
    afterRate: '',
    change: '',
    source: '',
  });
  const [showAddMetricModal, setShowAddMetricModal] = useState(false);

  // Evidence Modal for inspecting raw signal telemetry
  const [evidenceConcern, setEvidenceConcern] = useState(null);

  // Revision / Escalation Modals
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [activeRevisionPlanId, setActiveRevisionPlanId] = useState(null);
  const [escalateModalOpen, setEscalateModalOpen] = useState(false);
  const [activeEscalatePlanId, setActiveEscalatePlanId] = useState(null);

  // Filtered action plans
  const filteredPlans = useMemo(() => {
    return actionPlans.filter((plan) => {
      const matchStatus =
        statusFilter === 'all'
          ? true
          : plan.status.toLowerCase().replace(/\s+/g, '_') === statusFilter.toLowerCase().replace(/\s+/g, '_') ||
            (statusFilter === 'in_progress' && plan.status.toLowerCase().includes('progress')) ||
            (statusFilter === 'awaiting_update' && plan.status.toLowerCase().includes('awaiting')) ||
            (statusFilter === 'monitoring' && plan.status.toLowerCase().includes('monitoring')) ||
            (statusFilter === 'completed' && plan.status.toLowerCase().includes('completed'));

      const matchSearch =
        searchQuery.trim() === ''
          ? true
          : plan.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            plan.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
            plan.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
            plan.linkedConcern.toLowerCase().includes(searchQuery.toLowerCase()) ||
            plan.linkedReport?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchStatus && matchSearch;
    });
  }, [actionPlans, statusFilter, searchQuery]);

  // Metric summary calculations for 6 top cards
  const summaryMetrics = useMemo(() => {
    const active = actionPlans.filter((p) => p.status !== 'Completed').length;
    const awaitingUpdate = actionPlans.filter((p) =>
      p.status.toLowerCase().includes('awaiting')
    ).length;
    const dueThisWeek = actionPlans.filter((p) =>
      p.dueDate?.toLowerCase().includes('oct') && p.status !== 'Completed'
    ).length;
    const overdue = actionPlans.filter((p) => p.status === 'Overdue').length;
    const completedMonth = actionPlans.filter((p) => p.status === 'Completed').length + 1; // +1 historical
    return {
      active,
      awaitingUpdate,
      dueThisWeek,
      overdue,
      completedMonth,
      resolvedRate: '85%',
    };
  }, [actionPlans]);

  // Toggle Accordion Dropdown
  const handleToggleExpand = (plan) => {
    if (expandedPlanId === plan.id) {
      setExpandedPlanId(null);
    } else {
      setExpandedPlanId(plan.id);
      setSelectedActionPlanId(plan.id);
      // Initialize edit form with plan values
      if (!editingPlanData[plan.id]) {
        setEditingPlanData((prev) => ({
          ...prev,
          [plan.id]: {
            title: plan.title,
            owner: plan.owner,
            department: plan.department,
            dueDate: plan.dueDate || plan.due,
            status: plan.status,
            progress: plan.progress,
            managerUpdate: plan.managerUpdate || '',
            nextStep: plan.nextStep || 'Weekly check-in to verify task handoff adherence',
          },
        }));
      }
    }
  };

  // Update in-memory edit draft for a plan
  const handleDraftChange = (planId, field, value) => {
    setEditingPlanData((prev) => ({
      ...prev,
      [planId]: {
        ...(prev[planId] || {}),
        [field]: value,
      },
    }));
  };

  // Commit Save Changes for a Plan
  const handleSavePlanChanges = (planId) => {
    const draft = editingPlanData[planId];
    if (!draft) return;
    handleUpdateActionPlan({
      id: planId,
      ...draft,
      lastUpdate: 'Updated just now by HR',
    });
  };

  // Toggle metric visibility / inclusion
  const handleToggleMetric = (planId, metricId) => {
    setPlanMetrics((prev) => {
      const currentList = prev[planId] || getInitialOutcomeMetrics(planId);
      const updated = currentList.map((m) =>
        m.id === metricId ? { ...m, enabled: !m.enabled } : m
      );
      return { ...prev, [planId]: updated };
    });
  };

  // Update before / after rates on a metric
  const handleUpdateMetricRate = (planId, metricId, field, value) => {
    setPlanMetrics((prev) => {
      const currentList = prev[planId] || getInitialOutcomeMetrics(planId);
      const updated = currentList.map((m) =>
        m.id === metricId ? { ...m, [field]: value } : m
      );
      return { ...prev, [planId]: updated };
    });
  };

  // Add custom outcome metric
  const handleAddCustomMetric = (planId) => {
    if (!newMetricForm.label.trim()) {
      showToast('Please enter a metric label.');
      return;
    }
    const newMetric = {
      id: `custom_${Date.now()}`,
      label: newMetricForm.label,
      beforeRate: newMetricForm.beforeRate || 'Baseline',
      afterRate: newMetricForm.afterRate || 'Target',
      change: newMetricForm.change || 'Tracking',
      tone: 'emerald',
      source: newMetricForm.source || 'HR Custom Outcome Tracking',
      details: 'Custom telemetry indicator configured by HR partner.',
      enabled: true,
    };
    setPlanMetrics((prev) => ({
      ...prev,
      [planId]: [...(prev[planId] || getInitialOutcomeMetrics(planId)), newMetric],
    }));
    setShowAddMetricModal(false);
    setNewMetricForm({ label: '', beforeRate: '', afterRate: '', change: '', source: '' });
    showToast(`Added custom outcome metric: ${newMetric.label}`);
  };

  // Open Evidence modal for linked concern
  const handleOpenEvidence = (concernId) => {
    const allConcerns = dataService.getDepartmentData('all').priorityConcerns || [];
    const target = allConcerns.find((c) => c.id === concernId || c.code === concernId);
    if (target) {
      setEvidenceConcern(target);
    } else {
      showToast(`Showing raw signal evidence for ${concernId}`);
    }
  };

  const getStatusBadge = (status) => {
    const lower = (status || '').toLowerCase();
    if (lower.includes('progress')) return 'bg-amber-50 text-amber-800 border-amber-200';
    if (lower.includes('awaiting')) return 'bg-purple-50 text-purple-700 border-purple-200';
    if (lower.includes('monitoring')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (lower.includes('completed')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (lower.includes('escalated') || lower.includes('overdue')) return 'bg-rose-50 text-rose-700 border-rose-200';
    return 'bg-slate-50 text-slate-700 border-slate-200';
  };

  return (
    <div className="flex flex-col gap-7 w-full max-w-7xl mx-auto pb-14 animate-in fade-in duration-200">
      {/* 1. PAGE HEADER (Clean subtitle without duplicate H2 for UI consistency) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 -mt-2">
        <p className="text-sm font-normal leading-[22px] text-slate-500">
          Monitor before-and-after recovery rates, edit action plans in-place, and track linked employee feedback.
        </p>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#EBECEF] text-xs font-medium leading-[18px] text-slate-600 shadow-2xs">
            <ShieldAlert size={14} className="text-[#5455EE]" />
            <span>Employee confidentiality strictly protected across all linked cases</span>
          </div>
        </div>
      </div>

      {/* 2. SUMMARY METRIC CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5 sm:gap-4">
        {/* Card 1: Active action plans */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EBECEF] shadow-card hover:border-[#5455EE]/40 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider leading-[18px]">
              Active Plans
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#EEF0FF] text-[#5455EE] flex items-center justify-center">
              <ListTodo size={16} />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl sm:text-[30px] font-semibold leading-9 tabular-nums text-slate-900">
              {summaryMetrics.active}
            </div>
            <div className="text-xs font-normal leading-[18px] text-slate-500 mt-0.5 flex items-center gap-1">
              <span className="text-indigo-600 font-bold">3 in progress</span> · 2 squads
            </div>
          </div>
        </div>

        {/* Card 2: Awaiting manager update */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EBECEF] shadow-card hover:border-[#5455EE]/40 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider leading-[18px]">
              Awaiting Update
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Clock size={16} />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl sm:text-[30px] font-semibold leading-9 tabular-nums text-purple-700">
              {summaryMetrics.awaitingUpdate}
            </div>
            <div className="text-xs font-normal leading-[18px] text-purple-700 mt-0.5">
              AP-02 · Elena Chen (Eng)
            </div>
          </div>
        </div>

        {/* Card 3: Due this week */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EBECEF] shadow-card hover:border-[#5455EE]/40 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider leading-[18px]">
              Due This Week
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
              <Calendar size={16} />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl sm:text-[30px] font-semibold leading-9 tabular-nums text-slate-900">
              {summaryMetrics.dueThisWeek}
            </div>
            <div className="text-xs font-medium leading-[18px] text-amber-800 mt-0.5">
              AP-01 due Friday (30 Oct)
            </div>
          </div>
        </div>

        {/* Card 4: Overdue */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EBECEF] shadow-card hover:border-[#5455EE]/40 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider leading-[18px]">
              Overdue
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl sm:text-[30px] font-semibold leading-9 tabular-nums text-emerald-600">
              {summaryMetrics.overdue}
            </div>
            <div className="text-xs font-normal leading-[18px] text-emerald-600 mt-0.5">
              100% on-track adherence
            </div>
          </div>
        </div>

        {/* Card 5: Completed */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EBECEF] shadow-card hover:border-[#5455EE]/40 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider leading-[18px]">
              Completed
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileCheck2 size={16} />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl sm:text-[30px] font-semibold leading-9 tabular-nums text-slate-900">
              {summaryMetrics.completedMonth}
            </div>
            <div className="text-xs font-normal leading-[18px] text-slate-500 mt-0.5">
              AP-04 + 1 historical resolved
            </div>
          </div>
        </div>

        {/* Card 6: Resolved Rate */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EBECEF] shadow-card hover:border-[#5455EE]/40 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider leading-[18px]">
              Resolved Rate
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-[#5455EE] flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl sm:text-[30px] font-semibold leading-9 tabular-nums text-[#5455EE]">
              {summaryMetrics.resolvedRate}
            </div>
            <div className="text-xs font-normal leading-[18px] text-slate-500 mt-0.5">
              3 of 4 signal trends cooled
            </div>
          </div>
        </div>
      </div>

      {/* 3. ACTION PLAN LIST SECTION (With in-place expandable dropdowns) */}
      <div className="bg-white border border-[#EBECEF] rounded-3xl p-5 sm:p-6 shadow-card flex flex-col gap-5">
        {/* Header Controls: Title, Search & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <ListTodo size={16} />
            </div>
            <div>
              <h3 className="text-xl font-semibold leading-7 tracking-tight text-slate-900">
                Action Plans & Recovery Tracker
              </h3>
              <p className="text-xs font-normal leading-[18px] text-slate-500 mt-0.5">
                Click any row dropdown to inspect before-and-after rate changes, edit plans, and track linked employee cases.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search plan, owner, case..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F8F9FD] border border-[#EBECEF] rounded-xl pl-9 pr-3.5 py-2 text-sm font-normal text-slate-800 placeholder-slate-400 outline-none focus:border-[#5455EE] transition-all leading-5"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1 bg-[#F4F5FA] p-1 rounded-xl border border-slate-200/60 overflow-x-auto">
              {[
                { id: 'all', label: 'All' },
                { id: 'in_progress', label: 'In Progress' },
                { id: 'awaiting_update', label: 'Awaiting Update' },
                { id: 'monitoring', label: 'Monitoring' },
                { id: 'completed', label: 'Completed' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium leading-5 transition-all whitespace-nowrap cursor-pointer ${
                    statusFilter === tab.id
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ACTION PLANS ACCORDION LIST */}
        <div className="flex flex-col gap-3.5">
          {filteredPlans.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No action plans match the current search or status filter.
            </div>
          ) : (
            filteredPlans.map((plan) => {
              const isExpanded = expandedPlanId === plan.id;
              const draft = editingPlanData[plan.id] || {
                title: plan.title,
                owner: plan.owner,
                department: plan.department,
                dueDate: plan.dueDate || plan.due,
                status: plan.status,
                progress: plan.progress,
                managerUpdate: plan.managerUpdate || '',
                nextStep: plan.nextStep || 'Weekly check-in to verify task handoff adherence',
              };
              const metrics = planMetrics[plan.id] || getInitialOutcomeMetrics(plan.id);
              const enabledMetrics = metrics.filter((m) => m.enabled);

              return (
                <div
                  key={plan.id}
                  className={`border rounded-2xl transition-all overflow-hidden ${
                    isExpanded
                      ? 'border-[#5455EE]/40 bg-white shadow-md ring-2 ring-[#5455EE]/10'
                      : 'border-[#EBECEF] bg-[#F8F9FD]/60 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  {/* ACCORDION ROW HEADER: Shows Action title, Linked case, Owner, Department, Progress, Status */}
                  <div
                    onClick={() => handleToggleExpand(plan)}
                    className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    {/* Left: ID, Title & Linked Case badge */}
                    <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 transition-transform ${
                          isExpanded
                            ? 'bg-[#5455EE] text-white rotate-180'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        <ChevronDown size={16} />
                      </div>

                      <div className="flex flex-col gap-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-medium text-[#5455EE] bg-[#EEF0FF] px-2 py-0.5 rounded-md tracking-wider">
                            {plan.id}
                          </span>
                          <span className="text-base font-semibold leading-6 text-slate-900 hover:text-[#5455EE] transition-colors truncate">
                            {draft.title || plan.title}
                          </span>
                        </div>

                        {/* Linked Case (Report / Feedback / Concern) */}
                        <div className="flex items-center gap-2 text-xs flex-wrap">
                          <span className="text-xs font-medium text-slate-500 leading-[18px]">Linked Case:</span>
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNavigateToConcern(plan.linkedConcern, false);
                            }}
                            className="inline-flex items-center gap-1 font-mono text-xs font-medium leading-[18px] px-2 py-0.5 rounded-md bg-indigo-50 text-[#5455EE] border border-indigo-200 hover:bg-indigo-100 transition-colors cursor-pointer"
                            title="Click to view Concern card on Dashboard"
                          >
                            <span>{plan.linkedConcern}</span>
                            <ExternalLink size={10} />
                          </span>

                          {plan.linkedReport && (
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenEvidence(plan.linkedConcern);
                              }}
                              className="inline-flex items-center gap-1 text-xs font-medium leading-[18px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                              title="Click to view linked employee report in Evidence Modal"
                            >
                              <FileText size={10} className="text-[#5455EE]" />
                              <span>{plan.linkedReport} Report</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Owner, Department, Progress, Status */}
                    <div className="flex items-center gap-4 sm:gap-6 flex-wrap lg:flex-nowrap justify-between lg:justify-end">
                      {/* Owner */}
                      <div className="flex items-center gap-1.5 min-w-[110px]">
                        <User size={13} className="text-slate-400" />
                        <span className="text-[13px] font-medium leading-5 text-slate-800">{draft.owner || plan.owner}</span>
                      </div>

                      {/* Department */}
                      <div className="flex items-center gap-1 min-w-[100px]">
                        <Building2 size={13} className="text-slate-400" />
                        <span className="text-[13px] font-normal leading-5 text-slate-600">{draft.department || plan.department}</span>
                      </div>

                      {/* Progress Bar & % */}
                      <div className="flex items-center gap-2 min-w-[120px]">
                        <div className="w-16 sm:w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#5455EE] rounded-full transition-all duration-300"
                            style={{ width: `${draft.progress || plan.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold leading-5 text-slate-900 tabular-nums">{draft.progress || plan.progress}%</span>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium leading-[18px] border whitespace-nowrap ${getStatusBadge(
                          draft.status || plan.status
                        )}`}
                      >
                        {draft.status || plan.status}
                      </span>
                    </div>
                  </div>

                  {/* EXPANDED DROPDOWN PANEL: Read, Edit & Update, Outcome Rate Tracking, Linked Employee Feedback */}
                  {isExpanded && (
                    <div className="px-5 pb-6 pt-2 border-t border-slate-100 flex flex-col gap-6 animate-in slide-in-from-top-2 duration-150">
                      {/* 1. OUTCOME TRACKING: BEFORE & AFTER RATE COMPARISON */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-50/60 via-white to-slate-50 border border-indigo-100 shadow-2xs flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-indigo-100">
                          <div>
                            <div className="flex items-center gap-2">
                              <TrendingUp size={16} className="text-[#5455EE]" />
                              <h4 className="text-base font-semibold leading-6 text-slate-900">
                                Before vs. After Rate Comparison (Action in Progress)
                              </h4>
                              <span className="text-xs font-medium leading-[18px] text-white bg-[#5455EE] px-2.5 py-0.5 rounded-full">
                                Live Telemetry
                              </span>
                            </div>
                            <p className="text-xs font-normal leading-[18px] text-slate-500 mt-0.5">
                              AI generates initial telemetry; HR can customize, select which metrics to view, and update rates below.
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setEditingMetricsPlanId(editingMetricsPlanId === plan.id ? null : plan.id)
                              }
                              className={`px-3 py-1.5 rounded-xl text-sm font-medium leading-5 transition-all flex items-center gap-1.5 cursor-pointer ${
                                editingMetricsPlanId === plan.id
                                  ? 'bg-slate-900 text-white'
                                  : 'bg-white text-slate-700 hover:text-[#5455EE] border border-[#EBECEF] shadow-2xs'
                              }`}
                            >
                              <Sliders size={13} />
                              <span>{editingMetricsPlanId === plan.id ? 'Done Editing' : 'Customize Metrics'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowAddMetricModal(true);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-[#5455EE] border border-indigo-200 text-sm font-medium leading-5 flex items-center gap-1 cursor-pointer"
                              title="Add custom metric to track"
                            >
                              <Plus size={13} />
                              <span className="hidden sm:inline">Add Metric</span>
                            </button>
                          </div>
                        </div>

                        {/* Metric Selector Checkbox Pills (Visible when in Customize Mode) */}
                        {editingMetricsPlanId === plan.id && (
                          <div className="p-3 bg-white rounded-xl border border-indigo-200 flex flex-col gap-2 animate-in fade-in duration-150">
                            <span className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
                              Select & Toggle Metrics to Display for {plan.id}:
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {metrics.map((m) => (
                                <button
                                  key={m.id}
                                  type="button"
                                  onClick={() => handleToggleMetric(plan.id, m.id)}
                                  className={`px-3 py-1.5 rounded-xl text-sm font-medium leading-5 transition-all flex items-center gap-1.5 cursor-pointer ${
                                    m.enabled
                                      ? 'bg-[#5455EE] text-white shadow-xs'
                                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                  }`}
                                >
                                  <span>{m.enabled ? '✓' : '+'}</span>
                                  <span>{m.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Metric Comparison Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                          {enabledMetrics.map((metric) => (
                            <div
                              key={metric.id}
                              className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:border-[#5455EE]/40 transition-all gap-2"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium leading-5 text-slate-700 truncate">
                                  {metric.label}
                                </span>
                                <span className="text-xs font-medium leading-[18px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                  {metric.change}
                                </span>
                              </div>

                              {/* Before ➔ After Rate Values */}
                              <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100 text-xs font-bold">
                                <div>
                                  <span className="text-xs font-normal leading-[18px] text-slate-500 block uppercase">
                                    Before Action
                                  </span>
                                  {editingMetricsPlanId === plan.id ? (
                                    <input
                                      type="text"
                                      value={metric.beforeRate}
                                      onChange={(e) =>
                                        handleUpdateMetricRate(plan.id, metric.id, 'beforeRate', e.target.value)
                                      }
                                      className="w-16 bg-white border border-slate-300 rounded px-1 py-0.5 text-xs font-bold text-slate-800"
                                    />
                                  ) : (
                                    <span className="text-sm font-normal text-slate-500 line-through tabular-nums">
                                      {metric.beforeRate}
                                    </span>
                                  )}
                                </div>

                                <ArrowRight size={14} className="text-[#5455EE] flex-shrink-0" />

                                <div>
                                  <span className="text-xs font-medium leading-[18px] text-emerald-700 block uppercase">
                                    Current / After
                                  </span>
                                  {editingMetricsPlanId === plan.id ? (
                                    <input
                                      type="text"
                                      value={metric.afterRate}
                                      onChange={(e) =>
                                        handleUpdateMetricRate(plan.id, metric.id, 'afterRate', e.target.value)
                                      }
                                      className="w-16 bg-white border border-emerald-400 rounded px-1 py-0.5 text-xs font-bold text-emerald-700"
                                    />
                                  ) : (
                                    <span className="text-xl font-semibold leading-7 text-slate-900 tabular-nums">
                                      {metric.afterRate}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <p className="text-xs font-normal leading-[18px] text-slate-500">
                                {metric.details}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 2. LINKED EMPLOYEE FEEDBACK & EVIDENCE SECTION */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 flex flex-col gap-3 shadow-2xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-amber-200/60">
                          <div className="flex items-center gap-2">
                            <Quote size={16} className="text-amber-800" />
                            <h4 className="text-base font-semibold leading-6 text-slate-900">
                              Linked Employee Case & Qualitative Voice
                            </h4>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-amber-900 font-mono leading-[18px]">
                              Source: {plan.linkedConcern} · {plan.linkedReport || 'R004'}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleOpenEvidence(plan.linkedConcern)}
                              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm leading-5 flex items-center gap-1.5 shadow-2xs cursor-pointer"
                            >
                              <Layers size={12} />
                              <span>View Evidence Modal</span>
                            </button>
                          </div>
                        </div>

                        {/* Employee Feedback Quote */}
                        <div className="p-3.5 rounded-xl bg-white border border-amber-200/60 text-sm font-normal leading-[22px] text-slate-800">
                          "{plan.anonymizedSummary}"
                        </div>

                        <div className="flex items-center justify-between text-xs font-normal leading-[18px] text-slate-600">
                          <span className="flex items-center gap-1">
                            <ShieldAlert size={12} className="text-[#5455EE]" />
                            <span>Privacy Mode: Department-Level Visible (Identity Stripped)</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleNavigateToConcern(plan.linkedConcern, false)}
                            className="text-[#5455EE] font-medium text-sm leading-5 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <span>Inspect Concern Card on Dashboard</span>
                            <ExternalLink size={11} />
                          </button>
                        </div>
                      </div>

                      {/* 3. DIRECT EDIT & PLAN TRACKING CONTROLS */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-[#F8F9FD] border border-slate-200 flex flex-col gap-4">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                          <div className="flex items-center gap-2">
                            <Edit3 size={15} className="text-[#5455EE]" />
                            <h4 className="text-base font-semibold leading-6 text-slate-900">
                              Edit Action Plan Details & Next Steps
                            </h4>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSavePlanChanges(plan.id)}
                            className="px-4 py-2 rounded-xl bg-[#5455EE] hover:bg-[#4344dd] text-white font-medium text-sm leading-5 shadow-xs flex items-center gap-1.5 cursor-pointer"
                          >
                            <Check size={14} />
                            <span>Save Changes</span>
                          </button>
                        </div>

                        {/* Form Inputs Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                          {/* Title */}
                          <div className="lg:col-span-2 flex flex-col gap-1">
                            <label className="text-sm font-medium leading-5 text-slate-700">Action Plan Title</label>
                            <input
                              type="text"
                              value={draft.title}
                              onChange={(e) => handleDraftChange(plan.id, 'title', e.target.value)}
                              className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-normal text-slate-900 outline-none focus:border-[#5455EE] leading-[22px]"
                            />
                          </div>

                          {/* Owner */}
                          <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium leading-5 text-slate-700">Owner</label>
                            <input
                              type="text"
                              value={draft.owner}
                              onChange={(e) => handleDraftChange(plan.id, 'owner', e.target.value)}
                              className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-normal text-slate-900 outline-none focus:border-[#5455EE] leading-[22px]"
                            />
                          </div>

                          {/* Department */}
                          <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium leading-5 text-slate-700">Department</label>
                            <select
                              value={draft.department}
                              onChange={(e) => handleDraftChange(plan.id, 'department', e.target.value)}
                              className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-normal text-slate-900 outline-none focus:border-[#5455EE] leading-[22px]"
                            >
                              <option value="Engineering">Engineering</option>
                              <option value="Product">Product & Design</option>
                              <option value="Sales & Marketing">Sales & Marketing</option>
                              <option value="Customer Operations">Customer Operations</option>
                              <option value="Operations">Operations</option>
                            </select>
                          </div>

                          {/* Due Date */}
                          <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium leading-5 text-slate-700">Due Date</label>
                            <input
                              type="text"
                              value={draft.dueDate}
                              onChange={(e) => handleDraftChange(plan.id, 'dueDate', e.target.value)}
                              className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-normal text-slate-900 outline-none focus:border-[#5455EE] leading-[22px]"
                            />
                          </div>

                          {/* Status */}
                          <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium leading-5 text-slate-700">Status</label>
                            <select
                              value={draft.status}
                              onChange={(e) => handleDraftChange(plan.id, 'status', e.target.value)}
                              className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-normal text-slate-900 outline-none focus:border-[#5455EE] leading-[22px]"
                            >
                              <option value="In progress">In progress</option>
                              <option value="Awaiting manager update">Awaiting manager update</option>
                              <option value="Monitoring">Monitoring</option>
                              <option value="Completed">Completed</option>
                              <option value="Escalated">Escalated</option>
                            </select>
                          </div>

                          {/* Progress Slider */}
                          <div className="lg:col-span-2 flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                              <label className="text-sm font-medium leading-5 text-slate-700">Execution Progress</label>
                              <span className="text-sm font-semibold text-[#5455EE] tabular-nums leading-5">{draft.progress}%</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              step="5"
                              value={draft.progress}
                              onChange={(e) =>
                                handleDraftChange(plan.id, 'progress', parseInt(e.target.value, 10))
                              }
                              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#5455EE]"
                            />
                          </div>
                        </div>

                        {/* Manager Update Note */}
                        <div className="flex flex-col gap-1.5 pt-2">
                          <label className="text-sm font-medium leading-5 text-slate-700">Manager Progress Update Note</label>
                          <textarea
                            rows={2}
                            value={draft.managerUpdate}
                            onChange={(e) => handleDraftChange(plan.id, 'managerUpdate', e.target.value)}
                            placeholder="Add or update manager's implementation notes..."
                            className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm font-normal leading-[22px] text-slate-800 outline-none focus:border-[#5455EE]"
                          />
                        </div>

                        {/* HR Review Decision Buttons */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              type="button"
                              onClick={() => handleApproveActionPlan(plan.id)}
                              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm leading-5 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                            >
                              <CheckCircle2 size={13} className="text-emerald-400" />
                              <span>Approve to Monitoring</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveRevisionPlanId(plan.id);
                                setRevisionModalOpen(true);
                              }}
                              className="px-3.5 py-2 rounded-xl bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 font-medium text-sm leading-5 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                            >
                              <RotateCcw size={13} className="text-amber-800" />
                              <span>Request Revision</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveEscalatePlanId(plan.id);
                                setEscalateModalOpen(true);
                              }}
                              className="px-3.5 py-2 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 font-medium text-sm leading-5 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                            >
                              <AlertTriangle size={13} className="text-rose-600" />
                              <span>Escalate</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSendReminder(plan.id, draft.owner)}
                              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-medium text-sm leading-5 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                            >
                              <BellRing size={13} className="text-[#5455EE]" />
                              <span>Send Reminder</span>
                            </button>
                          </div>

                          <div className="text-xs font-normal leading-[18px] text-slate-500">
                            Last edited: {plan.lastUpdate || '23 Oct 2026'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 4. MODALS */}

      {/* ADD CUSTOM METRIC MODAL */}
      {showAddMetricModal && (
        <div
          onClick={() => setShowAddMetricModal(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 flex flex-col gap-4 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xl font-semibold leading-7 text-slate-900">
                Add Outcome Tracking Metric
              </h3>
              <button
                type="button"
                onClick={() => setShowAddMetricModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium leading-5 text-slate-700">Metric Name</label>
                <input
                  type="text"
                  placeholder="e.g. PR Review SLA, On-call Incident Count"
                  value={newMetricForm.label}
                  onChange={(e) => setNewMetricForm({ ...newMetricForm, label: e.target.value })}
                  className="p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm font-normal text-slate-900 outline-none focus:border-[#5455EE] leading-[22px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium leading-5 text-slate-700">Rate Before Action</label>
                  <input
                    type="text"
                    placeholder="e.g. 96h, 18%"
                    value={newMetricForm.beforeRate}
                    onChange={(e) => setNewMetricForm({ ...newMetricForm, beforeRate: e.target.value })}
                    className="p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm font-normal text-slate-900 outline-none focus:border-[#5455EE] leading-[22px]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium leading-5 text-slate-700">Current / Target Rate</label>
                  <input
                    type="text"
                    placeholder="e.g. 24h, 6%"
                    value={newMetricForm.afterRate}
                    onChange={(e) => setNewMetricForm({ ...newMetricForm, afterRate: e.target.value })}
                    className="p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm font-normal text-slate-900 outline-none focus:border-[#5455EE] leading-[22px]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium leading-5 text-slate-700">Trend / Recovery Badge</label>
                <input
                  type="text"
                  placeholder="e.g. -75% turnaround, Positive Recovery"
                  value={newMetricForm.change}
                  onChange={(e) => setNewMetricForm({ ...newMetricForm, change: e.target.value })}
                  className="p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm font-normal text-slate-900 outline-none focus:border-[#5455EE] leading-[22px]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddMetricModal(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium leading-5 text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleAddCustomMetric(expandedPlanId || 'AP-01')}
                className="px-4 py-2 rounded-xl bg-[#5455EE] hover:bg-[#4344dd] text-white text-sm font-medium leading-5 shadow-xs"
              >
                Add Metric
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REVISION REQUEST MODAL */}
      {revisionModalOpen && (
        <div
          onClick={() => setRevisionModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 flex flex-col gap-4 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xl font-semibold leading-7 text-slate-900">
                Request Manager Revision
              </h3>
              <button
                type="button"
                onClick={() => setRevisionModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-sm font-normal leading-[22px] text-slate-600">
              Ask the action owner to refine task allocation thresholds, add concrete timeline deliverables, or clarify delegation checkpoints.
            </p>

            <textarea
              rows={3}
              placeholder="Specify requested revision details for the manager..."
              className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-sm font-normal leading-[22px] text-slate-800 outline-none focus:border-[#5455EE]"
            />

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRevisionModalOpen(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium leading-5 text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  handleRequestRevision(activeRevisionPlanId || 'AP-01');
                  setRevisionModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium leading-5 shadow-xs"
              >
                Send Revision Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ESCALATE MODAL */}
      {escalateModalOpen && (
        <div
          onClick={() => setEscalateModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 flex flex-col gap-4 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xl font-semibold leading-7 text-slate-900">
                Escalate Action Plan
              </h3>
              <button
                type="button"
                onClick={() => setEscalateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-sm font-normal leading-[22px] text-slate-600">
              Escalate this plan to the Head of Department (VP of Engineering / Product) for immediate structural capacity intervention.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEscalateModalOpen(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium leading-5 text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  handleEscalateActionPlan(activeEscalatePlanId || 'AP-01');
                  setEscalateModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium leading-5 shadow-xs"
              >
                Confirm Escalation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RAW SIGNAL EVIDENCE MODAL */}
      {evidenceConcern && (
        <EvidenceModal
          isOpen={!!evidenceConcern}
          onClose={() => setEvidenceConcern(null)}
          concern={evidenceConcern}
        />
      )}
    </div>
  );
}
