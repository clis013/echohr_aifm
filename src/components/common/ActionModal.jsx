import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  UserCheck,
  Megaphone,
  Send,
  Check,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { ACTION_PLAN_AP01 } from '../../data/mockData';

export default function ActionModal({
  isOpen,
  onClose,
  modalData,
  onConfirm,
  onPublishAnnouncement,
  isAnnouncementPublished,
  actionState,
  onAssignManagerAction,
  onMarkActionCompleted,
  onSendMayaUpdate,
}) {
  if (!isOpen || !modalData) return null;

  const { type, item } = modalData;
  const isCreateActionPlan = type === 'intervention';

  // --- States for Create Action Plan Form (Requested Modal) ---
  const [suggestedActions, setSuggestedActions] = useState([
    {
      id: 'act_1',
      text: 'Review task allocation and informal handoffs to new hires',
      checked: true,
    },
    {
      id: 'act_2',
      text: 'Clarify task ownership before assigning additional work',
      checked: true,
    },
    {
      id: 'act_3',
      text: 'Introduce a weekly workload and priority check-in for new hires',
      checked: true,
    },
  ]);

  const [actionOwner, setActionOwner] = useState('Daniel Lim — Engineering Manager');
  const [deadline, setDeadline] = useState('30 Oct 2026');
  const [priority, setPriority] = useState(item?.priority || 'High');

  const toggleSuggestedAction = (id) => {
    setSuggestedActions((prev) =>
      prev.map((act) => (act.id === id ? { ...act, checked: !act.checked } : act))
    );
  };

  const handleCreateAndAssignActionPlan = () => {
    if (onAssignManagerAction) {
      onAssignManagerAction();
    }
    if (onPublishAnnouncement) {
      onPublishAnnouncement();
    }
    if (onSendMayaUpdate) {
      onSendMayaUpdate();
    }
    if (onConfirm) {
      onConfirm({
        type: 'intervention',
        item,
        statusVal: 'Assigned',
        actionOwner,
        deadline,
        priority,
        actions: suggestedActions.filter((a) => a.checked),
      });
    }
    onClose();
  };

  // --- States for Report Review View ---
  const [statusVal, setStatusVal] = useState(item?.status || 'In Progress');
  const [noteVal] = useState('');
  const [showEscalationConfirm, setShowEscalationConfirm] = useState(false);
  const [escalatedPlan, setEscalatedPlan] = useState(null);
  const [managerAssignedToast, setManagerAssignedToast] = useState(false);
  const [mayaUpdatedToast, setMayaUpdatedToast] = useState(false);

  const handleConfirm = () => {
    onConfirm({ type, item, statusVal, noteVal });
    onClose();
  };

  const handleConfirmEscalation = () => {
    item.status = 'Escalated';
    item.assignedReviewer = 'Head of Engineering';
    item.hrCaseOwner = 'Sarah Lee';
    item.nextActionDue = '22 October 2026';
    setEscalatedPlan(ACTION_PLAN_AP01);
    setShowEscalationConfirm(false);
    onConfirm({
      type: 'report',
      item,
      statusVal: 'Escalated',
      noteVal: 'Escalated to Head of Engineering. Action plan AP-01 initialized.',
    });
  };

  const handleSendToManager = () => {
    setManagerAssignedToast(true);
    if (onAssignManagerAction) onAssignManagerAction();
  };

  const handleCompleteAction = () => {
    if (onMarkActionCompleted) onMarkActionCompleted();
  };

  const handleSendUpdateToMaya = () => {
    setMayaUpdatedToast(true);
    if (onSendMayaUpdate) onSendMayaUpdate();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden border border-[#EBECEF] animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[#EBECEF] flex items-center justify-between bg-white flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <h3 className="text-xl font-semibold leading-7 tracking-tight text-slate-900">
              {isCreateActionPlan
                ? 'Create Action Plan'
                : item?.concernTitle || `Review Report ${item?.id}`}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            title="Close dialog"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-slate-800 bg-[#F8F9FD]">
          {/* VIEW A: CREATE ACTION PLAN (Exact Form Requested) */}
          {isCreateActionPlan ? (
            <div className="space-y-4">
              {/* Concern: CON-01 & Burnout & Workload Imbalance */}
              <div className="p-4 rounded-2xl bg-white border border-[#EBECEF] shadow-2xs space-y-1">
                <span className="font-mono text-xs font-medium tracking-wider px-2.5 py-0.5 rounded-md bg-[#5455EE] text-white inline-block leading-[18px]">
                  {item?.code || item?.id || 'CON-01'}
                </span>
                <h4 className="text-base font-semibold leading-6 text-slate-900 mt-1">
                  {item?.title || 'Burnout & Workload Imbalance'}
                </h4>
              </div>

              {/* Anonymized concern */}
              <div className="p-4 rounded-2xl bg-white border border-[#EBECEF] shadow-2xs space-y-1.5">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider leading-[18px] block">
                  Anonymized concern
                </span>
                <p className="text-sm font-normal leading-[22px] text-slate-800">
                  {item?.id === 'CON-01' || !item?.anonymizedSummary
                    ? 'New hires in Engineering may be receiving additional tasks without clear ownership or priority confirmation, creating workload and deadline conflicts.'
                    : item.anonymizedSummary}
                </p>
              </div>

              {/* Assign to */}
              <div className="p-4 rounded-2xl bg-white border border-[#EBECEF] shadow-2xs space-y-1.5">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider leading-[18px] block">
                  Assign to
                </span>
                <select
                  value={actionOwner}
                  onChange={(e) => setActionOwner(e.target.value)}
                  className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-normal leading-5 text-slate-800 outline-none focus:border-[#5455EE] cursor-pointer"
                >
                  <option value="Daniel Lim — Engineering Manager">
                    Daniel Lim — Engineering Manager
                  </option>
                  <option value="Elena Chen — Head of Engineering">
                    Elena Chen — Head of Engineering
                  </option>
                  <option value="Sarah Lee — Senior HRBP">Sarah Lee — Senior HRBP</option>
                  <option value="Marcus Brody — Product Director">
                    Marcus Brody — Product Director
                  </option>
                </select>
              </div>

              {/* Suggested actions */}
              <div className="p-4 rounded-2xl bg-white border border-[#EBECEF] shadow-2xs space-y-2.5">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider leading-[18px] block">
                  Suggested actions
                </span>
                <div className="space-y-2">
                  {suggestedActions.map((action) => (
                    <label
                      key={action.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                        action.checked
                          ? 'bg-[#EEF0FF]/60 border-[#5455EE]/40 text-slate-900 shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={action.checked}
                        onChange={() => toggleSuggestedAction(action.id)}
                        className="mt-0.5 w-4 h-4 rounded text-[#5455EE] focus:ring-[#5455EE] border-slate-300 cursor-pointer accent-[#5455EE]"
                      />
                      <span className="text-sm font-normal leading-[22px] text-slate-900 select-none">
                        {action.text}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Deadline & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Deadline */}
                <div className="p-4 rounded-2xl bg-white border border-[#EBECEF] shadow-2xs space-y-1.5">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider leading-[18px] block">
                    Deadline
                  </span>
                  <div className="flex items-center gap-2 bg-[#F8F9FD] border border-slate-200 rounded-xl px-3 py-2">
                    <Calendar size={14} className="text-[#5455EE] flex-shrink-0" />
                    <input
                      type="text"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full bg-transparent text-sm font-normal leading-5 text-slate-800 outline-none"
                    />
                  </div>
                </div>

                {/* Priority */}
                <div className="p-4 rounded-2xl bg-white border border-[#EBECEF] shadow-2xs space-y-1.5">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider leading-[18px] block">
                    Priority
                  </span>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full bg-rose-50 border border-rose-200 text-rose-700 font-medium rounded-xl px-3 py-2 text-sm leading-5 outline-none focus:border-rose-400 cursor-pointer"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              {/* Success measure */}
              <div className="p-4 rounded-2xl bg-white border border-[#EBECEF] shadow-2xs space-y-1.5">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider leading-[18px] block">
                  Success measure
                </span>
                <p className="text-sm font-normal leading-[22px] text-slate-800">
                  Task owner and priority are confirmed before additional work is assigned.
                </p>
              </div>
            </div>
          ) : escalatedPlan ? (
            /* VIEW A.2: ESCALATED ACTION PLAN */
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-extrabold text-[#5455EE] bg-[#EEF0FF] px-2.5 py-0.5 rounded-full border border-[#5455EE]/20">
                    AP-01 · {actionState?.status || ACTION_PLAN_AP01.status}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-1">
                    {ACTION_PLAN_AP01.title}
                  </h4>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  High Priority
                </span>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-[#F8F9FD] p-3.5 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Linked Concern
                  </span>
                  <span className="font-bold text-slate-800">CON-01 (Burnout)</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Linked Report
                  </span>
                  <span className="font-bold text-slate-800">R004 (ANON-4827)</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    HR Owner
                  </span>
                  <span className="font-bold text-slate-800">Sarah Lee, HRBP</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Assigned Manager
                  </span>
                  <span className="font-bold text-[#5455EE]">Daniel Lim (Eng)</span>
                </div>
              </div>
            </div>
          ) : (
            /* VIEW B: REPORT REVIEW */
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-medium text-xs bg-slate-900 text-white px-2.5 py-0.5 rounded-lg shadow-2xs tracking-wider">
                      {item.id}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="font-medium text-slate-700 text-xs bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200 leading-[18px]">
                      {item.department || 'Undisclosed'}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500 text-xs leading-[18px]">
                      Tenure: <strong>{item.tenure || 'Hidden'}</strong>
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500 text-xs leading-[18px]">
                      Submitted: <strong>{item.submissionDate || item.date}</strong>
                    </span>
                  </div>
                  <h4 className="text-base font-semibold leading-6 text-slate-900 mt-0.5">
                    {item.concernTitle}
                  </h4>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 flex-shrink-0">
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full leading-[18px] ${
                      item.priority === 'High'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {item.priority} Priority
                  </span>
                  <span className="text-xs font-mono font-medium text-slate-500 tracking-wider leading-[18px]">
                    Ref: {item.referenceCode || 'ANON-4827'}
                  </span>
                </div>
              </div>

              {/* Case Metadata & Confidentiality Strip */}
              <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-white border border-[#EBECEF] flex-wrap shadow-2xs">
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="font-semibold text-slate-800 bg-[#F4F5FA] px-2.5 py-1 rounded-lg border border-slate-200">
                    Dept: {item.department || 'Undisclosed'}
                  </span>
                  <span className="font-semibold text-[#5455EE] bg-[#EEF0FF] px-2.5 py-1 rounded-lg border border-[#5455EE]/20 flex items-center gap-1">
                    <UserCheck size={12} />
                    <span>{item.anonymityType || (item.isAnonymous ? 'Department-Level Anonymous' : 'Identity Disclosed')}</span>
                  </span>
                  <span className="text-slate-500 font-medium">
                    Tenure: {item.tenure || 'Hidden'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <label htmlFor="report-triage-status" className="text-xs font-semibold text-slate-600">
                    Status:
                  </label>
                  <select
                    id="report-triage-status"
                    value={statusVal}
                    onChange={(e) => setStatusVal(e.target.value)}
                    className="px-2.5 py-1 bg-[#F8F9FD] border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-[#5455EE] cursor-pointer"
                  >
                    <option value="Action Required">Action Required</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Escalated">Escalated</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>

              {/* 1. Core Employee Concern Description */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col gap-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <h5 className="font-semibold text-slate-900 text-sm leading-5 flex items-center gap-1.5">
                    <ShieldAlert size={16} className="text-rose-600" />
                    <span>Reported Concern & Context</span>
                  </h5>
                  <span className="text-[11px] font-medium text-slate-400">
                    Original Confidential Submission
                  </span>
                </div>
                <div className="p-3.5 sm:p-4 rounded-xl bg-[#F8F9FD] border border-slate-200 text-slate-800 leading-[22px] text-sm font-normal">
                  {item.snippet || item.aiCaseSummary}
                </div>
              </div>

              {/* 2. Target Positive Outcome / Desired Resolution */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex flex-col gap-1.5 shadow-2xs">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 leading-[18px]">
                  Target Resolution & Expected Change
                </span>
                <p className="text-sm font-normal leading-[22px] text-emerald-950">
                  {item.outcome || 'Rebalance sprint task allocations, establish explicit definition-of-done guidelines for senior-to-junior task handoffs, and clarify sprint priorities.'}
                </p>
              </div>

              {/* 3. Corroborating Early Disengagement Signals */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col gap-2.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <h5 className="font-semibold text-slate-900 text-sm leading-5">
                    Corroborating Disengagement Signals
                  </h5>
                  <span className="text-xs text-slate-400 font-medium">3 Corroborated Channels</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#F8F9FD] border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-medium uppercase">Eko AI Telemetry</span>
                    <strong className="text-slate-800 font-medium">Task handoff friction queries</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F8F9FD] border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-medium uppercase">Community Board</span>
                    <strong className="text-slate-800 font-medium">Post COM-1 (24 upvotes)</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F8F9FD] border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-medium uppercase">Operational Metrics</span>
                    <strong className="text-rose-700 font-medium">+18% Overtime & 3 JIRO clashes</strong>
                  </div>
                </div>
              </div>

              {/* 4. Action Controls for Report */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Recommended Next Step</span>
                  <p className="text-sm font-normal text-slate-800 leading-[22px] mt-0.5">
                    {item.suggestedAction || 'Investigate task allocation, route case to Head of Engineering, protect reporter identity.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEscalationConfirm(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#5455EE] hover:bg-[#4344dd] text-white text-sm font-medium leading-5 flex items-center gap-1.5 transition-all shadow-xs cursor-pointer flex-shrink-0"
                >
                  <span>Escalate & Create Action Plan</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        {isCreateActionPlan ? (
          <div className="p-4 sm:p-5 bg-white border-t border-[#EBECEF] flex items-center justify-between flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium leading-5 text-slate-600 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 bg-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreateAndAssignActionPlan}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm leading-5 shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2 group"
            >
              <Sparkles size={14} className="text-[#A5B4FC]" />
              <span>Create & Assign Plan</span>
              <ArrowRight
                size={13}
                className="text-slate-400 group-hover:translate-x-0.5 group-hover:text-white transition-all"
              />
            </button>
          </div>
        ) : (
          <div className="p-4 bg-slate-50 border-t border-[#EBECEF] flex items-center justify-between flex-wrap gap-3 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-semibold text-slate-500">
                Case Assigned to: <strong>Sarah Lee, Senior HRBP</strong>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-sm font-medium leading-5 text-slate-600 hover:text-slate-800 hover:bg-slate-200/70 border border-slate-200 bg-white transition-colors cursor-pointer shadow-2xs"
              >
                Close
              </button>
              {!escalatedPlan && (
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="px-6 py-2.5 rounded-xl bg-[#5455EE] hover:bg-[#4344dd] text-white text-sm font-medium leading-5 transition-all shadow-md shadow-[#5455EE]/25 flex items-center gap-2 cursor-pointer"
                >
                  <Check size={14} />
                  <span>Save Status & Changes</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Dialog at z-[100] */}
      {showEscalationConfirm && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setShowEscalationConfirm(false);
          }}
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 flex flex-col gap-4 text-xs"
          >
            <div className="flex items-center gap-3 text-amber-600">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center flex-shrink-0 border border-amber-200">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h4 className="text-xl font-semibold leading-7 text-slate-900">
                  Escalate confidential report?
                </h4>
                <p className="text-slate-500 text-xs font-normal leading-[18px] mt-0.5">
                  Reference: {item.referenceCode || item.id}
                </p>
              </div>
            </div>

            <p className="text-slate-700 leading-[22px] text-sm font-normal">
              This report concerns workload allocation and managerial communication. It will be
              routed to Action Plan AP-01 for Engineering, assigning anonymized corrective actions to
              manager Daniel Lim.
              <br />
              <br />
              <strong>
                The reporter's identity will remain strictly protected and hidden across all case
                views.
              </strong>
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowEscalationConfirm(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium leading-5 text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmEscalation}
                className="px-5 py-2.5 rounded-xl bg-[#5455EE] hover:bg-[#4344dd] text-white text-sm font-medium leading-5 transition-all shadow-md shadow-[#5455EE]/25 cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 size={14} />
                <span>Confirm Escalation</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
