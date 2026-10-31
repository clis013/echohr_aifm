import React, { useState, useMemo, useRef } from 'react';
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
  ChevronRight,
  MessageSquare,
  Bot,
  Users,
  Eye,
  FileCheck2,
  BellRing,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import EvidenceModal from './EvidenceModal';
import { dataService } from '../../services/dataService';

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
    showToast,
  } = useApp();

  // Filters & Search State
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [evidenceConcern, setEvidenceConcern] = useState(null);
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [revisionNote, setRevisionNote] = useState('');
  const [escalateModalOpen, setEscalateModalOpen] = useState(false);

  // Detail View ref for smooth scrolling when "View details" / "Review update" clicked
  const detailViewRef = useRef(null);

  // Selected Action Plan (defaults to selectedActionPlanId or AP-01 or first available)
  const currentPlan = useMemo(() => {
    return (
      actionPlans.find((p) => p.id === selectedActionPlanId) ||
      actionPlans.find((p) => p.id === 'AP-01') ||
      actionPlans[0]
    );
  }, [actionPlans, selectedActionPlanId]);

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
            plan.linkedConcern.toLowerCase().includes(searchQuery.toLowerCase());

      return matchStatus && matchSearch;
    });
  }, [actionPlans, statusFilter, searchQuery]);

  // 1. Metric Calculations for the 6 Summary Cards
  const metrics = useMemo(() => {
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

  const getStatusBadge = (status) => {
    const lower = (status || '').toLowerCase();
    if (lower.includes('progress')) {
      return 'bg-amber-50 text-amber-800 border-amber-200';
    }
    if (lower.includes('awaiting')) {
      return 'bg-purple-50 text-purple-700 border-purple-200';
    }
    if (lower.includes('monitoring')) {
      return 'bg-blue-50 text-blue-700 border-blue-200';
    }
    if (lower.includes('completed')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (lower.includes('escalated') || lower.includes('overdue')) {
      return 'bg-rose-50 text-rose-700 border-rose-200';
    }
    return 'bg-slate-50 text-slate-700 border-slate-200';
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Medium':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const handleSelectPlan = (planId, scrollToDetail = false) => {
    setSelectedActionPlanId(planId);
    if (scrollToDetail && detailViewRef.current) {
      detailViewRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const openEvidenceForConcern = (concernId) => {
    const allConcerns = dataService.getDepartmentData('all').priorityConcerns || [];
    const target = allConcerns.find((c) => c.id === concernId || c.code === concernId);
    if (target) {
      setEvidenceConcern(target);
    } else {
      showToast(`Showing evidence data for concern ${concernId}`);
    }
  };

  return (
    <div className="flex flex-col gap-7 animate-in fade-in duration-200">
      {/* Page Description Subheader */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 -mt-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Actions & Follow-up
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Track execution after assignment, review manager progress updates, and monitor disengagement recovery.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#EBECEF] text-xs font-semibold text-slate-600 shadow-2xs">
            <ShieldAlert size={14} className="text-[#5455EE]" />
            <span>Strict reporter confidentiality maintained across all action trackers</span>
          </div>
        </div>
      </div>

      {/* 1. SUMMARY METRIC CARDS (6 Cards Required) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5 sm:gap-4">
        {/* Card 1: Active action plans */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EBECEF] shadow-card hover:border-[#5455EE]/40 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Active Plans
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#EEF0FF] text-[#5455EE] flex items-center justify-center">
              <ListTodo size={16} />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {metrics.active}
            </div>
            <div className="text-[11px] font-medium text-slate-500 mt-0.5 flex items-center gap-1">
              <span className="text-indigo-600 font-bold">3 in progress</span> · 2 squads
            </div>
          </div>
        </div>

        {/* Card 2: Awaiting manager update */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EBECEF] shadow-card hover:border-[#5455EE]/40 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Awaiting Update
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Clock size={16} />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl sm:text-3xl font-black text-purple-700 tracking-tight">
              {metrics.awaitingUpdate}
            </div>
            <div className="text-[11px] font-medium text-purple-700 mt-0.5">
              AP-02 · Elena Chen (Eng)
            </div>
          </div>
        </div>

        {/* Card 3: Due this week */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EBECEF] shadow-card hover:border-[#5455EE]/40 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Due This Week
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
              <Calendar size={16} />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {metrics.dueThisWeek}
            </div>
            <div className="text-[11px] font-medium text-amber-800 mt-0.5 font-bold">
              AP-01 due Friday (30 Oct)
            </div>
          </div>
        </div>

        {/* Card 4: Overdue */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EBECEF] shadow-card hover:border-[#5455EE]/40 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Overdue
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight">
              {metrics.overdue}
            </div>
            <div className="text-[11px] font-medium text-emerald-600 mt-0.5">
              100% on-track adherence
            </div>
          </div>
        </div>

        {/* Card 5: Completed this month */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EBECEF] shadow-card hover:border-[#5455EE]/40 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Completed
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileCheck2 size={16} />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {metrics.completedMonth}
            </div>
            <div className="text-[11px] font-medium text-slate-500 mt-0.5">
              AP-04 + 1 historical resolved
            </div>
          </div>
        </div>

        {/* Card 6: Concerns resolved after action */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EBECEF] shadow-card hover:border-[#5455EE]/40 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Resolved Rate
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-[#5455EE] flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl sm:text-3xl font-black text-[#5455EE] tracking-tight">
              {metrics.resolvedRate}
            </div>
            <div className="text-[11px] font-medium text-slate-500 mt-0.5">
              3 of 4 signal trends cooled
            </div>
          </div>
        </div>
      </div>

      {/* 2. ACTION PLAN TABLE SECTION */}
      <div className="bg-white border border-[#EBECEF] rounded-3xl p-5 sm:p-6 shadow-card hover:border-[#5455EE]/30 transition-all flex flex-col gap-5">
        {/* Table Controls Header: Search & Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <ListTodo size={16} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Active Action Plans Tracker
              </h3>
              <p className="text-xs text-slate-500">
                Click any row to inspect execution progress and outcome signals below.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search plan, owner, concern..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F8F9FD] border border-[#EBECEF] rounded-xl pl-9 pr-3.5 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none focus:border-[#5455EE] transition-all"
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
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
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

        {/* Table Container */}
        <div className="overflow-x-auto -mx-5 sm:-mx-6 px-5 sm:px-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#EBECEF] text-[11px] font-extrabold text-slate-400 uppercase tracking-wider bg-[#F8F9FD]/60">
                <th className="py-3 px-3.5 rounded-l-xl">Action Plan ID & Title</th>
                <th className="py-3 px-3">Linked Concern</th>
                <th className="py-3 px-3">Owner</th>
                <th className="py-3 px-3">Department</th>
                <th className="py-3 px-3">Due Date</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Progress</th>
                <th className="py-3 px-3">Last Update</th>
                <th className="py-3 px-3 text-right rounded-r-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPlans.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No action plans match the current filter or search criteria.
                  </td>
                </tr>
              ) : (
                filteredPlans.map((plan) => {
                  const isSelected = currentPlan?.id === plan.id;
                  return (
                    <tr
                      key={plan.id}
                      onClick={() => handleSelectPlan(plan.id, false)}
                      className={`group transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#EEF0FF]/50 hover:bg-[#EEF0FF]/70'
                          : 'hover:bg-[#F8F9FD]'
                      }`}
                    >
                      {/* 1. Action plan ID and title */}
                      <td className="py-3.5 px-3.5 font-bold">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-mono text-xs px-2 py-0.5 rounded-md font-extrabold ${
                              isSelected
                                ? 'bg-[#5455EE] text-white shadow-2xs'
                                : 'bg-slate-100 text-slate-800'
                            }`}
                          >
                            {plan.id}
                          </span>
                          <span className="text-slate-900 group-hover:text-[#5455EE] font-bold line-clamp-1 max-w-[220px]">
                            {plan.title}
                          </span>
                        </div>
                      </td>

                      {/* 2. Linked concern */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNavigateToConcern(plan.linkedConcern, false);
                            }}
                            className="inline-flex items-center gap-1 font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#F4F5FA] hover:bg-[#EEF0FF] text-[#5455EE] border border-[#5455EE]/20 transition-colors cursor-pointer"
                            title={`Navigate to ${plan.linkedConcern} on Dashboard`}
                          >
                            <span>{plan.linkedConcern}</span>
                            <ExternalLink size={10} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEvidenceForConcern(plan.linkedConcern);
                            }}
                            className="text-[10px] font-semibold text-slate-400 hover:text-slate-700 underline cursor-pointer"
                            title="Open Evidence Modal for this concern"
                          >
                            Evidence
                          </button>
                        </div>
                      </td>

                      {/* 3. Owner */}
                      <td className="py-3.5 px-3 font-semibold text-slate-800">
                        <div className="flex items-center gap-1.5">
                          <User size={13} className="text-slate-400" />
                          <span>{plan.owner}</span>
                        </div>
                      </td>

                      {/* 4. Department */}
                      <td className="py-3.5 px-3 text-slate-600 font-medium">
                        <div className="flex items-center gap-1">
                          <Building2 size={13} className="text-slate-400" />
                          <span>{plan.department}</span>
                        </div>
                      </td>

                      {/* 5. Due date */}
                      <td className="py-3.5 px-3 font-semibold text-slate-800 whitespace-nowrap">
                        {plan.dueDate || plan.due}
                      </td>

                      {/* 6. Status */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadge(
                            plan.status
                          )}`}
                        >
                          {plan.status}
                        </span>
                      </td>

                      {/* 7. Progress */}
                      <td className="py-3.5 px-3 min-w-[120px]">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                plan.progress === 100
                                  ? 'bg-emerald-500'
                                  : plan.progress >= 50
                                  ? 'bg-[#5455EE]'
                                  : 'bg-amber-500'
                              }`}
                              style={{ width: `${plan.progress}%` }}
                            />
                          </div>
                          <span className="font-bold text-[11px] text-slate-700 w-8 text-right">
                            {plan.progress}%
                          </span>
                        </div>
                      </td>

                      {/* 8. Last update */}
                      <td className="py-3.5 px-3 text-slate-500 text-[11px] whitespace-nowrap">
                        {plan.lastUpdate}
                      </td>

                      {/* 9. Actions (View details / Review update / Send reminder) */}
                      <td className="py-3.5 px-3 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectPlan(plan.id, true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-bold transition-all shadow-2xs cursor-pointer"
                            title="View details"
                          >
                            View details
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectPlan(plan.id, true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold transition-all shadow-2xs cursor-pointer"
                            title="Review update"
                          >
                            Review update
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSendReminder(plan.id, plan.owner);
                            }}
                            className="p-1 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                            title={`Send reminder to ${plan.owner}`}
                            aria-label={`Send reminder to ${plan.owner}`}
                          >
                            <BellRing size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. ACTION PLAN DETAIL VIEW */}
      {currentPlan && (
        <div
          ref={detailViewRef}
          className="bg-white border-2 border-[#5455EE]/30 rounded-3xl p-6 sm:p-7 shadow-card flex flex-col gap-6 animate-in fade-in duration-200 relative overflow-hidden"
        >
          {/* Top Decorative Indigo Border Line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#5455EE] via-[#7B7DF6] to-[#A5B4FC]" />

          {/* Detail View Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-[#5455EE] text-white shadow-2xs">
                  {currentPlan.id}
                </span>
                <span className="text-slate-300">•</span>
                <span
                  className={`text-xs font-extrabold px-3 py-1 rounded-full border ${getStatusBadge(
                    currentPlan.status
                  )}`}
                >
                  {currentPlan.status}
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getPriorityBadge(
                    currentPlan.priority
                  )}`}
                >
                  {currentPlan.priority} Priority
                </span>
                <span className="text-slate-400 text-xs">
                  Created {currentPlan.created}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {currentPlan.title}
              </h3>

              {/* Linked Concern Interactive Connection */}
              <div className="flex items-center gap-2 flex-wrap mt-0.5">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                  Linked Concern:
                </span>
                <button
                  type="button"
                  onClick={() => handleNavigateToConcern(currentPlan.linkedConcern, false)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#EEF0FF] hover:bg-[#E0E4FF] text-[#5455EE] border border-[#5455EE]/30 font-bold text-xs transition-colors cursor-pointer group"
                  title="Navigate back to Dashboard concern card"
                >
                  <span>{currentPlan.linkedConcern}: {currentPlan.linkedConcernTitle}</span>
                  <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button
                  type="button"
                  onClick={() => openEvidenceForConcern(currentPlan.linkedConcern)}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-2xs cursor-pointer"
                  title="Inspect all signal evidence in modal"
                >
                  <Layers size={12} />
                  <span>View Evidence Modal</span>
                </button>
              </div>
            </div>

            {/* Quick Metadata Box: Owner, Dept, Due, Progress */}
            <div className="grid grid-cols-2 gap-2.5 bg-[#F8F9FD] p-3.5 rounded-2xl border border-slate-200/80 min-w-[280px]">
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase block">
                  Action Owner
                </span>
                <span className="font-bold text-slate-900 text-xs flex items-center gap-1 mt-0.5">
                  <User size={13} className="text-[#5455EE]" />
                  {currentPlan.owner}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase block">
                  Department
                </span>
                <span className="font-bold text-slate-900 text-xs flex items-center gap-1 mt-0.5">
                  <Building2 size={13} className="text-[#5455EE]" />
                  {currentPlan.department}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase block">
                  Deadline
                </span>
                <span className="font-bold text-slate-900 text-xs flex items-center gap-1 mt-0.5">
                  <Calendar size={13} className="text-[#5455EE]" />
                  {currentPlan.dueDate || currentPlan.due}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase block">
                  Overall Progress
                </span>
                <span className="font-extrabold text-[#5455EE] text-xs flex items-center gap-1 mt-0.5">
                  <Activity size={13} className="text-[#5455EE]" />
                  {currentPlan.progress}% Complete
                </span>
              </div>
            </div>
          </div>

          {/* Anonymized Concern Summary */}
          <div className="p-4 rounded-2xl bg-[#F8F9FD] border border-slate-200/90 flex flex-col gap-1.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert size={14} className="text-[#5455EE]" />
                <span>Anonymized Concern Summary</span>
              </span>
              <span className="text-[11px] font-bold text-slate-400 font-mono">
                Source: {currentPlan.linkedConcern} · {currentPlan.linkedReport || 'R004'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
              {currentPlan.anonymizedSummary}
            </p>
          </div>

          {/* Manager Progress Update & HR Review Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
            {/* Left 2 Cols: Manager Progress Update Box */}
            <div className="lg:col-span-2 p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 shadow-2xs flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs">
                    DL
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
                      Manager Progress Update — {currentPlan.owner}
                    </h4>
                    <span className="text-[11px] text-slate-500">
                      Submitted on {currentPlan.managerUpdateDate || '23 Oct 2026, 14:30'}
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  Awaiting HR Review
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-amber-200/60 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium shadow-2xs">
                “{currentPlan.managerUpdate}”
              </div>

              <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-600" />
                <span>Action items verified against Engineering sprint backlog</span>
              </div>
            </div>

            {/* Right 1 Col: HR Review Buttons (Approve / Request Revision / Escalate) */}
            <div className="p-5 rounded-2xl bg-white border border-[#EBECEF] shadow-2xs flex flex-col gap-3.5">
              <div>
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                  HR Review Decisions
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Assess manager implementation and progress adherence.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {/* 1. Approve and move to monitoring */}
                <button
                  type="button"
                  onClick={() => handleApproveActionPlan(currentPlan.id)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs hover:shadow-md transition-all flex items-center justify-between cursor-pointer group"
                >
                  <span className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-400" />
                    <span>Approve and move to monitoring</span>
                  </span>
                  <ArrowRight size={13} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* 2. Request revision */}
                <button
                  type="button"
                  onClick={() => setRevisionModalOpen(true)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 font-bold text-xs shadow-2xs transition-all flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <RotateCcw size={14} className="text-amber-800" />
                    <span>Request revision</span>
                  </span>
                  <ChevronRight size={13} className="text-amber-800" />
                </button>

                {/* 3. Escalate */}
                <button
                  type="button"
                  onClick={() => setEscalateModalOpen(true)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 font-bold text-xs shadow-2xs transition-all flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <AlertTriangle size={14} className="text-rose-600" />
                    <span>Escalate</span>
                  </span>
                  <ChevronRight size={13} className="text-rose-500" />
                </button>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>HR Partner: Sarah Jenkins</span>
                <span>SLA: 48h</span>
              </div>
            </div>
          </div>

          {/* Action Items List */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <ListTodo size={14} className="text-[#5455EE]" />
                <span>Action Items Execution Status</span>
              </h4>
              <span className="text-[11px] font-bold text-slate-500">
                {currentPlan.actionItems?.filter((a) => a.completed).length || 0} of{' '}
                {currentPlan.actionItems?.length || 0} completed
              </span>
            </div>

            <div className="border border-[#EBECEF] rounded-2xl overflow-hidden divide-y divide-slate-100 bg-white">
              {currentPlan.actionItems?.map((act) => (
                <div
                  key={act.id}
                  className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-[#F8F9FD] transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 flex-shrink-0 ${
                        act.completed
                          ? 'bg-emerald-500 text-white'
                          : 'border-2 border-slate-300 text-transparent'
                      }`}
                    >
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <div className="flex flex-col">
                      <span
                        className={`text-xs sm:text-sm font-bold ${
                          act.completed ? 'text-slate-900 line-through opacity-80' : 'text-slate-900'
                        }`}
                      >
                        {act.title}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        Owner: {act.owner} · Due {act.due}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`self-start sm:self-auto text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                      act.completed
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {act.completed ? 'Completed' : act.status || 'In progress'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* OUTCOME TRACKING SECTION: 5 Key Indicators */}
          <div className="flex flex-col gap-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-[#5455EE] uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp size={14} />
                <span>Outcome Tracking & Disengagement Recovery Signals</span>
              </h4>
              <span className="text-[11px] font-bold text-slate-400">
                Live automated telemetry since action plan assignment
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              {/* 1. Related EkoAI patterns */}
              <div className="p-4 rounded-2xl bg-white border border-[#EBECEF] shadow-2xs flex flex-col justify-between hover:border-[#5455EE]/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase">
                    EkoAI Patterns
                  </span>
                  <Bot size={15} className="text-amber-800" />
                </div>
                <div className="mt-2">
                  <div className="text-base font-black text-slate-900">
                    {currentPlan.outcomeTracking?.ekoAiPatterns?.trend || 'Reduced 6 → 2'}
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 inline-block mt-1">
                    {currentPlan.outcomeTracking?.ekoAiPatterns?.change || '-67% friction'}
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1.5 leading-snug">
                    {currentPlan.outcomeTracking?.ekoAiPatterns?.details}
                  </p>
                </div>
              </div>

              {/* 2. New reports */}
              <div className="p-4 rounded-2xl bg-white border border-[#EBECEF] shadow-2xs flex flex-col justify-between hover:border-[#5455EE]/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase">
                    New Reports
                  </span>
                  <MessageSquare size={15} className="text-[#5455EE]" />
                </div>
                <div className="mt-2">
                  <div className="text-base font-black text-slate-900">
                    {currentPlan.outcomeTracking?.newReports?.trend || '0 new reports'}
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 inline-block mt-1">
                    Past 14 days clean
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1.5 leading-snug">
                    {currentPlan.outcomeTracking?.newReports?.details}
                  </p>
                </div>
              </div>

              {/* 3. Community activity */}
              <div className="p-4 rounded-2xl bg-white border border-[#EBECEF] shadow-2xs flex flex-col justify-between hover:border-[#5455EE]/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase">
                    Community Activity
                  </span>
                  <Users size={15} className="text-purple-600" />
                </div>
                <div className="mt-2">
                  <div className="text-base font-black text-slate-900">
                    {currentPlan.outcomeTracking?.communityActivity?.trend || 'Thread cooled'}
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 inline-block mt-1">
                    Positive feedback
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1.5 leading-snug">
                    {currentPlan.outcomeTracking?.communityActivity?.details}
                  </p>
                </div>
              </div>

              {/* 4. Pulse trend */}
              <div className="p-4 rounded-2xl bg-white border border-[#EBECEF] shadow-2xs flex flex-col justify-between hover:border-[#5455EE]/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase">
                    Pulse Trend
                  </span>
                  <TrendingUp size={15} className="text-emerald-600" />
                </div>
                <div className="mt-2">
                  <div className="text-base font-black text-slate-900">
                    {currentPlan.outcomeTracking?.pulseTrend?.trend || '2.8 → 3.4 / 5'}
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 inline-block mt-1">
                    {currentPlan.outcomeTracking?.pulseTrend?.change || '+21% recovery'}
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1.5 leading-snug">
                    {currentPlan.outcomeTracking?.pulseTrend?.details}
                  </p>
                </div>
              </div>

              {/* 5. Operational indicators */}
              <div className="p-4 rounded-2xl bg-white border border-[#EBECEF] shadow-2xs flex flex-col justify-between hover:border-[#5455EE]/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase">
                    Operational Signals
                  </span>
                  <Activity size={15} className="text-[#5455EE]" />
                </div>
                <div className="mt-2">
                  <div className="text-base font-black text-slate-900">
                    {currentPlan.outcomeTracking?.operationalIndicators?.trend || 'Overtime +18% → +6%'}
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 inline-block mt-1">
                    0 JIRO collisions
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1.5 leading-snug">
                    {currentPlan.outcomeTracking?.operationalIndicators?.details}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revision Request Modal */}
      {revisionModalOpen && (
        <div
          onClick={() => setRevisionModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 flex flex-col gap-4 text-xs"
          >
            <div className="flex items-center gap-3 text-amber-700">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center flex-shrink-0 border border-amber-200">
                <RotateCcw size={20} />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-slate-900">
                  Request Revision from {currentPlan.owner}
                </h4>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Plan: {currentPlan.id} — {currentPlan.title}
                </p>
              </div>
            </div>

            <p className="text-slate-600 leading-relaxed">
              Provide constructive guidance for the manager regarding what needs adjustment before this action plan can move to monitoring.
            </p>

            <textarea
              rows={4}
              value={revisionNote}
              onChange={(e) => setRevisionNote(e.target.value)}
              placeholder="e.g. Please clarify how senior documentation responsibilities will be rescheduled and ensure check-in dates are confirmed with the squad leads..."
              className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 outline-none focus:border-[#5455EE]"
            />

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRevisionModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  handleRequestRevision(currentPlan.id);
                  setRevisionModalOpen(false);
                  setRevisionNote('');
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Send size={13} />
                <span>Send Revision Request</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Escalate Confirmation Modal */}
      {escalateModalOpen && (
        <div
          onClick={() => setEscalateModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 flex flex-col gap-4 text-xs"
          >
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center flex-shrink-0 border border-rose-200">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-slate-900">
                  Escalate Action Plan?
                </h4>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Plan: {currentPlan.id} · Department: {currentPlan.department}
                </p>
              </div>
            </div>

            <p className="text-slate-700 leading-relaxed text-xs">
              Escalating this plan notifies the Head of Department and HR Leadership to intervene directly. The confidential reporter's identity will continue to be strictly protected.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEscalateModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  handleEscalateActionPlan(currentPlan.id);
                  setEscalateModalOpen(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <AlertTriangle size={14} />
                <span>Confirm Escalation</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Evidence Modal for Linked Concern */}
      <EvidenceModal
        isOpen={Boolean(evidenceConcern)}
        onClose={() => setEvidenceConcern(null)}
        concern={evidenceConcern}
      />
    </div>
  );
}
