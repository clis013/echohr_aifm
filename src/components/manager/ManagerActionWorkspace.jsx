import React, { useState, useMemo } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Save,
  Search,
  Filter,
  ArrowRight,
  ShieldAlert,
  Building2,
  X,
  FileCheck2,
  Sparkles,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ManagerActionWorkspace({
  onShowToast,
  actionState,
  onUpdateActionState,
}) {
  const { setActionPlans, showToast } = useApp();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'in_progress' | 'completed'

  // Selected action plan for detail/update modal
  const [selectedPlanModal, setSelectedPlanModal] = useState(null);

  // Initial assigned action records for Daniel Lim
  const [assignedRecords, setAssignedRecords] = useState([
    {
      id: 'AP-01',
      title: 'Review task allocation and priority-setting for new hires',
      concernTheme: 'Burnout & Workload Imbalance',
      anonymizedConcern:
        'New hires may receive additional tasks without clear ownership or priority confirmation.',
      requestedActions: [
        'Review task allocation and informal handoffs to new hires.',
        'Clarify task ownership before assigning additional work.',
        'Introduce a weekly workload and priority check-in for new hires.',
      ],
      dueDate: '30 Oct 2026',
      priority: 'High',
      status: actionState?.status || 'In progress',
      department: 'Engineering',
      progressUpdate:
        actionState?.actionsTaken ||
        'Reviewed current task-allocation practice. Added requirement that senior colleagues confirm task owner and priority before delegating documentation work. Weekly new-hire priority check-in scheduled from 3 Nov.',
      lastUpdate: '23 Oct 2026',
    },
    {
      id: 'AP-00',
      title: 'Q3 Sprint Documentation & Knowledge Transfer Protocol',
      concernTheme: 'Collaboration & Organisational Change',
      anonymizedConcern:
        'New engineers experienced onboarding ambiguity due to fragmented wiki documentation.',
      requestedActions: [
        'Audit squad documentation runbooks in Notion.',
        'Pair each probationary engineer with an onboarding mentor.',
      ],
      dueDate: '15 Sep 2026',
      priority: 'Medium',
      status: 'Completed',
      department: 'Engineering',
      progressUpdate:
        'Completed runbook audit across squads Alpha and Beta. All 4 probationary engineers completed onboarding runbook walkthrough.',
      lastUpdate: '15 Sep 2026',
    },
  ]);

  // Active plan being updated in modal
  const activePlan = selectedPlanModal || assignedRecords[0];
  const [modalProgressText, setModalProgressText] = useState(
    activePlan?.progressUpdate || ''
  );

  const openPlanModal = (plan) => {
    setSelectedPlanModal(plan);
    setModalProgressText(plan.progressUpdate || '');
  };

  const handleSaveProgress = (planId) => {
    const updatedRecords = assignedRecords.map((r) =>
      r.id === planId
        ? {
            ...r,
            progressUpdate: modalProgressText,
            status: 'In progress',
            lastUpdate: 'Updated just now',
          }
        : r
    );
    setAssignedRecords(updatedRecords);

    if (onUpdateActionState) {
      onUpdateActionState({
        status: 'In progress',
        actionsTaken: modalProgressText,
        managerSubmitted: true,
      });
    }

    if (setActionPlans) {
      setActionPlans((prev) =>
        prev.map((p) =>
          p.id === planId
            ? {
                ...p,
                managerUpdate: modalProgressText,
                status: 'In progress',
                lastUpdate: 'Updated by Daniel Lim just now',
              }
            : p
        )
      );
    }

    const notify = onShowToast || showToast;
    if (notify) notify('Progress update saved.');
    setSelectedPlanModal(null);
  };

  const handleMarkComplete = (planId) => {
    const updatedRecords = assignedRecords.map((r) =>
      r.id === planId
        ? {
            ...r,
            progressUpdate: modalProgressText,
            status: 'Completed',
            lastUpdate: 'Completed just now',
          }
        : r
    );
    setAssignedRecords(updatedRecords);

    if (onUpdateActionState) {
      onUpdateActionState({
        status: 'Completed',
        actionsTaken: modalProgressText,
        managerSubmitted: true,
      });
    }

    if (setActionPlans) {
      setActionPlans((prev) =>
        prev.map((p) =>
          p.id === planId
            ? {
                ...p,
                managerUpdate: modalProgressText,
                status: 'Completed',
                progress: 100,
                lastUpdate: 'Completed by Daniel Lim just now',
              }
            : p
        )
      );
    }

    const notify = onShowToast || showToast;
    if (notify) notify(`Action ${planId} marked as complete.`);
    setSelectedPlanModal(null);
  };

  // Filtered records
  const filteredRecords = useMemo(() => {
    return assignedRecords.filter((record) => {
      const matchStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'in_progress'
          ? record.status === 'In progress'
          : record.status === 'Completed';

      const matchSearch =
        searchQuery.trim() === ''
          ? true
          : record.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            record.anonymizedConcern.toLowerCase().includes(searchQuery.toLowerCase()) ||
            record.concernTheme.toLowerCase().includes(searchQuery.toLowerCase());

      return matchStatus && matchSearch;
    });
  }, [assignedRecords, statusFilter, searchQuery]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* 1. Subtitle & Context Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EBECEF] pb-4">
        <p className="text-xs sm:text-sm text-slate-500">
          Assigned corrective action plans for <strong className="text-slate-900 font-bold">Daniel Lim</strong> · Engineering Manager
        </p>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#EBECEF] text-xs font-semibold text-slate-600 shadow-2xs">
            <ShieldAlert size={14} className="text-[#5455EE]" />
            <span>Reporter Confidentiality Protected: Anonymized Concerns Only</span>
          </div>
        </div>
      </div>

      {/* 2. Top Metric Cards (Like Report List Page) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#EBECEF] shadow-xs flex flex-col gap-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Total Assigned Plans
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">
              {assignedRecords.length}
            </span>
            <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
              Engineering
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#EBECEF] shadow-xs flex flex-col gap-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            In Progress
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-600">
              {assignedRecords.filter((r) => r.status === 'In progress').length}
            </span>
            <span className="text-[11px] text-slate-500">Active Execution</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#EBECEF] shadow-xs flex flex-col gap-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Completed Actions
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-600">
              {assignedRecords.filter((r) => r.status === 'Completed').length}
            </span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              Resolved
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#EBECEF] shadow-xs flex flex-col gap-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Next Deadline
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">30 Oct</span>
            <span className="text-[11px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md">
              AP-01
            </span>
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Bar (Like Report List Page) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#EBECEF] shadow-xs">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assigned actions by ID, concern, or keyword..."
            className="w-full bg-[#F8F9FD] border border-slate-200/90 rounded-xl pl-9 pr-3.5 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none focus:border-[#5455EE] transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-[#F4F5FA] p-1 rounded-xl border border-slate-200/60">
          {[
            { id: 'all', label: 'All' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'completed', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
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

      {/* 4. Action Plans Table / List (Like Report List Page) */}
      <div className="bg-white rounded-3xl border border-[#EBECEF] shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#EBECEF] text-[11px] font-extrabold text-slate-400 uppercase tracking-wider bg-[#F8F9FD]/80">
                <th className="p-4 rounded-tl-3xl whitespace-nowrap">Action Plan ID</th>
                <th className="p-4 whitespace-nowrap">Concern Theme</th>
                <th className="p-4 min-w-[200px]">Anonymized Concern</th>
                <th className="p-4 min-w-[220px]">Requested Actions</th>
                <th className="p-4 whitespace-nowrap">Priority</th>
                <th className="p-4 whitespace-nowrap">Due Date</th>
                <th className="p-4 whitespace-nowrap">Status</th>
                <th className="p-4 text-right rounded-tr-3xl whitespace-nowrap min-w-[150px]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBECEF]">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No assigned action records match the current filter or search criteria.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => (
                  <tr
                    key={record.id}
                    onClick={() => openPlanModal(record)}
                    className="hover:bg-[#F8F9FD] transition-colors cursor-pointer group"
                  >
                    <td className="p-4 whitespace-nowrap">
                      <span className="font-mono font-black text-xs px-2.5 py-1 rounded-lg bg-[#5455EE] text-white shadow-2xs">
                        Action {record.id}
                      </span>
                    </td>

                    <td className="p-4 font-bold text-slate-900 whitespace-nowrap">
                      {record.concernTheme}
                    </td>

                    <td className="p-4">
                      <p className="text-slate-700 leading-snug line-clamp-2 font-medium">
                        {record.anonymizedConcern}
                      </p>
                    </td>

                    <td className="p-4">
                      <ul className="text-slate-600 list-disc pl-4 space-y-0.5 line-clamp-2">
                        {record.requestedActions.map((act, i) => (
                          <li key={i} className="truncate">
                            {act}
                          </li>
                        ))}
                      </ul>
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                          record.priority === 'High'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {record.priority}
                      </span>
                    </td>

                    <td className="p-4 whitespace-nowrap font-semibold text-slate-800">
                      {record.dueDate}
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] border ${
                          record.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>

                    <td className="p-4 text-right whitespace-nowrap min-w-[150px]">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openPlanModal(record);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-2xs group-hover:shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <span>Update & Review</span>
                        <ChevronRight size={13} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Assigned Action Detail & Progress Update Modal (Exact Requested Specification) */}
      {selectedPlanModal && (
        <div
          onClick={() => setSelectedPlanModal(null)}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden border border-[#EBECEF] animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-[#EBECEF] flex items-center justify-between bg-white flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-black px-2.5 py-1 rounded-md bg-[#5455EE] text-white">
                  Action {selectedPlanModal.id}
                </span>
                <span className="text-xs text-slate-400 font-semibold">•</span>
                <span className="text-sm font-extrabold text-slate-800">
                  {selectedPlanModal.concernTheme}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPlanModal(null)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                title="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body: Exact Structure Requested */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-slate-800 bg-[#F8F9FD]">
              {/* Anonymized Concern */}
              <div className="p-4 rounded-2xl bg-white border border-[#EBECEF] shadow-2xs space-y-1.5">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  Anonymized concern
                </span>
                <p className="text-xs sm:text-sm text-slate-900 leading-relaxed font-bold">
                  {selectedPlanModal.anonymizedConcern}
                </p>
              </div>

              {/* Requested actions (Numbered 1, 2, 3) */}
              <div className="p-4 rounded-2xl bg-white border border-[#EBECEF] shadow-2xs space-y-2">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  Requested actions
                </span>
                <ol className="list-decimal pl-5 space-y-1.5 text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                  {selectedPlanModal.requestedActions.map((act, i) => (
                    <li key={i} className="pl-1">
                      {act}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Due date & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-white border border-[#EBECEF] shadow-2xs flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center flex-shrink-0 border border-amber-200">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase block">
                      Due date
                    </span>
                    <span className="font-bold text-slate-900 text-xs">
                      {selectedPlanModal.dueDate}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#EBECEF] shadow-2xs flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center flex-shrink-0 border border-rose-200">
                    <Clock size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase block">
                      Priority
                    </span>
                    <span className="font-bold text-rose-700 text-xs">
                      {selectedPlanModal.priority}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Update */}
              <div className="p-4 rounded-2xl bg-white border border-[#EBECEF] shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                    Progress update
                  </span>
                  <span className="text-[10px] font-medium text-slate-400">
                    Saves to HR Actions & Follow-up
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={modalProgressText}
                  onChange={(e) => setModalProgressText(e.target.value)}
                  placeholder="Describe what you did, when, and any obstacles."
                  className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-3.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 leading-relaxed outline-none focus:border-[#5455EE] focus:bg-white transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Modal Footer: [Save progress] [Mark complete] */}
            <div className="p-4 sm:p-5 bg-white border-t border-[#EBECEF] flex items-center justify-between flex-shrink-0">
              <button
                type="button"
                onClick={() => setSelectedPlanModal(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 bg-white transition-colors cursor-pointer"
              >
                Close
              </button>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handleSaveProgress(selectedPlanModal.id)}
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 font-bold text-xs shadow-2xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Save size={14} />
                  <span>Save progress</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleMarkComplete(selectedPlanModal.id)}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer group"
                >
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span>Mark complete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
