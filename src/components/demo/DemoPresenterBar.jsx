import React, { useState } from 'react';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Play,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Eye,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export const DEMO_STEPS = [
  {
    step: 1,
    role: 'employee',
    page: 'emp_feedback',
    title: 'Occasional Pulse Survey',
    instruction: 'Maya completes an occasional 2-minute pulse survey (Workload: 6/10, Role clarity: 6/10). Scores provide early signals without forcing full disclosure.',
    triggerType: 'pulse_survey',
  },
  {
    step: 2,
    role: 'employee',
    page: 'emp_chat',
    title: 'Client Launch Clarification',
    instruction: "Maya opens Eko and asks what 'client launch materials' means. Eko validates her question without making her feel incapable.",
    triggerType: 'chat_turn_1',
  },
  {
    step: 3,
    role: 'employee',
    page: 'emp_chat',
    title: 'Approved Company Resources',
    instruction: 'Eko references standard launch templates and provides an interactive preview of the approved Client Launch Checklist modal.',
    triggerType: 'chat_turn_2',
  },
  {
    step: 4,
    role: 'employee',
    page: 'emp_chat',
    title: 'Workload & Deadline Conflict',
    instruction: 'Maya shares that her senior colleague also assigned extra testing documentation on top of 6h sprint tickets due Friday.',
    triggerType: 'chat_turn_3',
  },
  {
    step: 5,
    role: 'employee',
    page: 'emp_chat',
    title: 'JIRO Workload Comparison & Neutral Draft',
    instruction: 'Eko displays the 11h vs 4h commitment table and drafts a non-confrontational priority clarification message with a 1-click copy button.',
    triggerType: 'chat_turn_4',
  },
  {
    step: 6,
    role: 'employee',
    page: 'emp_chat',
    title: 'Maya Expresses Recurrence',
    instruction: "Maya mentions: 'This has happened a few times. I am not sure whether I should raise it.'",
    triggerType: 'chat_turn_5_start',
  },
  {
    step: 7,
    role: 'employee',
    page: 'emp_chat',
    title: 'Eko Detects Recurring Pattern (Past 2 Weeks)',
    instruction: 'Eko detects recurring themes across the past 2 weeks. Notice Eko does NOT label Maya as disengaged or notify HR automatically; it explains the situation may not be ideal and offers voluntary options.',
    triggerType: 'chat_turn_5_eko',
  },
  {
    step: 8,
    role: 'employee',
    page: 'emp_chat',
    title: 'Voluntary Next Steps',
    instruction: 'Eko offers voluntary next steps: view community discussions, submit anonymous report, use manager draft, or save for later.',
    triggerType: 'chat_turn_5_actions',
  },
  {
    step: 9,
    role: 'employee',
    page: 'community',
    title: 'Community Board & Upvote COM-1',
    instruction: 'Maya views peer discussion COM-1 about competing deadlines and clicks upvote (count updates from 23 to 24).',
    triggerType: 'community_upvote',
  },
  {
    step: 10,
    role: 'employee',
    page: 'community',
    title: 'Subtle Eko Suggestion',
    instruction: "Eko shows a gentle inline suggestion: 'It looks like you may have a similar concern. Would you like to share feedback or submit an anonymous report?'",
    triggerType: 'community_prompt',
  },
  {
    step: 11,
    role: 'employee',
    page: 'emp_feedback',
    title: 'Submit Anonymous Report (Department Privacy)',
    instruction: "Maya selects 'Department-level privacy: HR can see my department but not my identity.' Her private chat and ID remain completely hidden.",
    triggerType: 'open_report_modal',
  },
  {
    step: 12,
    role: 'employee',
    page: 'emp_feedback',
    title: 'Case Reference ANON-4827 Generated',
    instruction: 'Maya receives case reference ANON-4827. She can track HR updates and communicate securely without revealing identity.',
    triggerType: 'report_submitted',
  },
  {
    step: 13,
    role: 'hr',
    page: 'dashboard',
    title: 'Switch to HR Portal',
    instruction: 'Switch role to Sarah Lee / Sarah Jenkins. View organization-wide and Engineering telemetry (+18% Overtime surge).',
    triggerType: 'switch_hr',
  },
  {
    step: 14,
    role: 'hr',
    page: 'dashboard',
    title: 'Review CON-01 & Related Signals',
    instruction: 'HR reviews CON-01 with recurring pattern badge, ANON-4827 case, COM-1 community signals, and JIRO indicators.',
    triggerType: 'review_con01',
  },
  {
    step: 15,
    role: 'hr',
    page: 'reports',
    title: 'Assign Anonymized Action to Daniel Lim',
    instruction: 'HR assigns Action Plan AP-01 to Daniel Lim. The manager receives only the concern theme, instruction, and deadline—no employee identities.',
    triggerType: 'assign_manager_action',
  },
  {
    step: 16,
    role: 'manager',
    page: 'manager_workspace',
    title: 'Switch to Manager Action Workspace',
    instruction: 'Switch role to Daniel Lim (Engineering Manager). Notice Daniel CANNOT see the HR dashboard, survey answers, or chat transcripts.',
    triggerType: 'switch_manager',
  },
  {
    step: 17,
    role: 'manager',
    page: 'manager_workspace',
    title: 'Daniel Receives Anonymized Package',
    instruction: "Daniel inspects the assigned package: 'Clarify task ownership and review workload allocation for new hires.'",
    triggerType: 'view_manager_action',
  },
  {
    step: 18,
    role: 'manager',
    page: 'manager_workspace',
    title: 'Daniel Asks HR in Secure Chat',
    instruction: 'Daniel asks Sarah Lee for clarifying context. Sarah guides him with supportive questions without compromising anonymity.',
    triggerType: 'manager_chat_demo',
  },
  {
    step: 19,
    role: 'manager',
    page: 'manager_workspace',
    title: 'Daniel Updates Action Progress',
    instruction: 'Daniel submits his progress update: 15-min check-in introduced, documentation reassigned, sprint guidelines updated.',
    triggerType: 'manager_submit_update',
  },
  {
    step: 20,
    role: 'hr',
    page: 'reports',
    title: 'HR Reviews Update & Marks Action Complete',
    instruction: 'HR verifies the manager’s corrective actions and marks Action Plan AP-01 as completed.',
    triggerType: 'hr_complete_action',
  },
  {
    step: 21,
    role: 'hr',
    page: 'reports',
    title: 'HR Updates Maya via Anonymous Channel',
    instruction: "HR sends resolution update to Maya: 'We have reviewed workload allocation in Engineering and clarified task-ownership...'",
    triggerType: 'hr_send_maya_update',
  },
  {
    step: 22,
    role: 'hr',
    page: 'community',
    title: 'HR Posts “You Said, We Did” Announcement',
    instruction: "HR publishes official announcement ANN-01 to the Community Board: 'You said, we did: Clearer task ownership and workload support...'",
    triggerType: 'publish_announcement',
  },
  {
    step: 23,
    role: 'employee',
    page: 'community',
    title: 'Maya Views Resolved Status & Community Action',
    instruction: 'Full loop closed! Maya sees her report status marked as Resolved and reads the transparent community announcement.',
    triggerType: 'demo_completed',
  },
];

export default function DemoPresenterBar({
  currentStepIndex,
  onStepChange,
  onExecuteStepAction,
  userRole,
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const currentStep = DEMO_STEPS[currentStepIndex] || DEMO_STEPS[0];

  const roleBadge = {
    employee: { label: '👤 Maya (Employee)', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    hr: { label: '👔 Sarah (HR Lead)', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    manager: { label: '💼 Daniel (Manager)', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  }[currentStep.role];

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 max-w-4xl w-[94%] bg-slate-900/95 backdrop-blur-xl border border-slate-700 text-white rounded-3xl shadow-2xl transition-all duration-300">
      {/* Top Header bar inside the pill */}
      <div className="px-5 py-3 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-[#5455EE] flex items-center justify-center text-white">
            <Sparkles size={13} />
          </div>
          <span className="text-xs font-black tracking-wide text-white uppercase flex items-center gap-1.5">
            <span>Demo Walkthrough</span>
            <span className="text-slate-400 font-normal">|</span>
            <span className="text-[#8B8DF9] font-bold">
              Step {currentStep.step} of {DEMO_STEPS.length}
            </span>
          </span>
          <span
            className={`hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${roleBadge.color}`}
          >
            {roleBadge.label}
          </span>
        </div>

        {/* Right Controls: Step Selector & Minimize Toggle */}
        <div className="flex items-center gap-2">
          {/* Quick Step Selector Dropdown */}
          <select
            value={currentStepIndex}
            onChange={(e) => onStepChange(Number(e.target.value))}
            className="bg-slate-800 text-slate-200 text-xs font-bold rounded-xl px-2.5 py-1 border border-slate-700 outline-none cursor-pointer max-w-[140px] sm:max-w-[210px] truncate"
            aria-label="Select Demo Step"
          >
            {DEMO_STEPS.map((s, idx) => (
              <option key={s.step} value={idx}>
                {s.step}. {s.title}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Collapse instructions' : 'Expand instructions'}
            className="w-7 h-7 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            {isExpanded ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
          </button>
        </div>
      </div>

      {/* Expandable Instruction & Action Panel */}
      {isExpanded && (
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs animate-in fade-in duration-150">
          <div className="flex-1 pr-2">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-sm font-extrabold text-white">
                {currentStep.title}
              </h4>
            </div>
            <p className="text-slate-300 leading-relaxed text-xs">
              <strong className="text-amber-400 font-bold">Presenter Guide:</strong>{' '}
              {currentStep.instruction}
            </p>
          </div>

          {/* Action & Nav Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
            {/* 1-Click Auto Run / Trigger for this step */}
            <button
              type="button"
              onClick={() => onExecuteStepAction(currentStep)}
              className="px-3.5 py-2 rounded-xl bg-[#5455EE] hover:bg-[#4344dd] text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              title="Automatically perform action for this step"
            >
              <Play size={12} fill="currentColor" />
              <span>Guide Action</span>
            </button>

            {/* Prev Button */}
            <button
              type="button"
              disabled={currentStepIndex === 0}
              onClick={() => onStepChange(Math.max(0, currentStepIndex - 1))}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Previous step"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Next Button */}
            <button
              type="button"
              disabled={currentStepIndex === DEMO_STEPS.length - 1}
              onClick={() => onStepChange(Math.min(DEMO_STEPS.length - 1, currentStepIndex + 1))}
              className="px-3 py-2 rounded-xl bg-white hover:bg-slate-200 text-slate-900 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
              title="Next step"
            >
              <span>Next</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
