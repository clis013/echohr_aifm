import React, { useRef, useEffect, useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ClipboardCheck,
  Lock,
  ChevronRight,
  SlidersHorizontal,
  Users,
  Briefcase,
  FileText,
  Copy,
  Check,
  ShieldCheck,
  MessageSquare,
  X,
  Plus,
  Mic,
  Send,
  Clock,
  BookOpen,
  Search,
  History,
} from 'lucide-react';
import EchoLogo from '../EchoLogo';
import { useApp } from '../../context/AppContext';

// Pre-configured conversation history sessions for Maya Tan
const MAYA_CHAT_SESSIONS = [
  {
    id: 'session_sprint',
    title: 'Sprint Tasks & Workload Prioritization',
    date: 'Today, 10:14 AM',
    category: 'Workload & Capacity',
    snippet: 'Sprint Tasks (Thursday) > Client Launch (Friday) > Testing Documentation (Defer)',
    messages: [
      {
        id: 1,
        sender: 'maya',
        text: "My manager said, 'Prepare the client launch materials and make sure everything is ready for Friday.' But what exactly am I supposed to prepare? I don’t want to keep asking questions and look incapable.",
        time: '10:14 AM',
      },
      {
        id: 2,
        sender: 'ai',
        text: `I can help you work that out. Based on the Client Launch Checklist and a previous client-launch project, you will normally need to prepare:

• Client presentation using the approved template
• Product overview and key benefits
• Demo preparation checklist
• Final review and approval from your project lead

You can confirm project-specific requirements with your manager.`,
        hasResourceCard: true,
        time: '10:14 AM',
      },
      {
        id: 3,
        sender: 'maya',
        text: "That helps. But my senior also asked me to finish their testing documentation. I already have other sprint tasks due this week. I don’t know what I should do first…",
        time: '10:16 AM',
      },
      {
        id: 4,
        sender: 'ai',
        text: 'Based on the workload information from JIRO, here is how you should prioritize:',
        hasTaskTable: true,
        taskTableText: `Your existing sprint tasks and launch materials already require an estimated 11 hours. Adding testing documentation (4 hours) pushes you to 15 hours, causing an immediate sprint overload.
        
Recommended priority order:
1. Sprint Tasks (Thursday) — First priority
2. Client Launch Materials (Friday) — Second priority
3. Testing Documentation (Friday) — Defer / Hand back to senior or reassign

Please confirm this priority order with your manager (Daniel Lim).`,
        suggestedDraft: `Hi Daniel, I'm currently prioritizing my sprint tasks (due Thursday) and the client launch materials (due Friday). Alex asked me to take on testing documentation, which exceeds my capacity for this sprint. Could you confirm if prioritizing my core sprint commitments first aligns with your plan?`,
        time: '10:17 AM',
      },
      {
        id: 5,
        sender: 'ai',
        text: `Does this type of issue appear often for you?\nIf yes, you can let the company know through anonymous feedback or a confidential report. Your identity and individual conversation will not be shared, and HR will see anonymized themes.`,
        isTurn5: true,
        showActionButtons: true,
        time: '10:18 AM',
      },
    ],
  },
  {
    id: 'session_templates',
    title: 'Client Launch Checklist & Deck Templates',
    date: 'Yesterday, 3:20 PM',
    category: 'Task Guidance',
    snippet: 'Access corporate slide templates under ENG-SOP-008 in Company Policies.',
    messages: [
      {
        id: 101,
        sender: 'maya',
        text: 'Where can I find the standard slide deck template for client demo meetings?',
        time: '3:20 PM',
      },
      {
        id: 102,
        sender: 'ai',
        text: 'You can access the approved client presentation template under ENG-SOP-008 in Company Policies. It includes slide layouts for Architecture Overview, Deliverable Milestones, and QA sign-offs.\n\nWould you like me to link the checklist directly?',
        hasResourceCard: true,
        time: '3:21 PM',
      },
    ],
  },
  {
    id: 'session_overtime',
    title: 'Overtime & Peer Task Delegation Policy',
    date: '22 Oct 2026',
    category: 'Company Policy',
    snippet: 'Under HR-POL-014, junior engineers are protected from ad-hoc overtime.',
    messages: [
      {
        id: 201,
        sender: 'maya',
        text: 'Are junior engineers expected to work late on deployment weeks? My senior mentioned staying online till 10 PM.',
        time: '4:15 PM',
      },
      {
        id: 202,
        sender: 'ai',
        text: 'Under HR-POL-014 (Clause 4.1), employees in their first 6 months are protected from ad-hoc task delegation without prior approval from their people manager.\n\nYou are entitled to discuss this with Daniel Lim, and work beyond sprint commitments should be formally reprioritized rather than assumed as mandatory overtime.',
        time: '4:16 PM',
      },
    ],
  },
  {
    id: 'session_1on1',
    title: 'How to Request 1-on-1 Check-in With Manager',
    date: '18 Oct 2026',
    category: 'Communication Draft',
    snippet: 'Draft: Hi Daniel, I would like to schedule a 15-minute sync this week...',
    messages: [
      {
        id: 301,
        sender: 'maya',
        text: "How do I ask Daniel for a 1-on-1 without looking like I'm struggling or incapable?",
        time: '11:05 AM',
      },
      {
        id: 302,
        sender: 'ai',
        text: 'Requesting alignment on sprint priorities is normal and recommended under HR-POL-032. Here is a friendly, professional draft you can send:\n\n"Hi Daniel, I\'d like to schedule a 15-minute sync this week to review my current sprint priorities and make sure my deliverables are on track. Let me know what time works best for you!"',
        time: '11:06 AM',
      },
    ],
  },
  {
    id: 'session_eap',
    title: 'Confidentiality of Mental Health Support (EAP)',
    date: '12 Oct 2026',
    category: 'Wellbeing',
    snippet: 'Yes, 100% confidential. EAP services (BEN-POL-005) are independent of HR.',
    messages: [
      {
        id: 401,
        sender: 'maya',
        text: 'Is the Employee Assistance Program confidential? Does HR see who uses it?',
        time: '9:30 AM',
      },
      {
        id: 402,
        sender: 'ai',
        text: 'Yes, 100% confidential. EAP services (BEN-POL-005) are managed by an independent third-party provider (EchoCare Health). Neither HR nor your direct manager receives individual names or usage records.',
        time: '9:31 AM',
      },
    ],
  },
];

// Pre-configured conversation history sessions for Manager Daniel Lim
const MANAGER_CHAT_SESSIONS = [
  {
    id: 'manager_session_1',
    title: 'Review Sprint 14 team capacity & workload distribution',
    date: 'Today, 9:00 AM',
    category: 'Squad Capacity',
    snippet: 'Platform Squad workload is concentrated on 3 senior engineers and 1 new hire.',
    messages: [
      {
        id: 601,
        sender: 'daniel',
        text: 'Review Sprint 14 team capacity and workload distribution',
        time: '9:00 AM',
      },
      {
        id: 602,
        sender: 'ai',
        text: `Based on Sprint 14 telemetry, Platform Squad's workload is concentrated on 3 senior engineers and 1 new hire (Maya Tan).\n\nKey Observations:\n• 18% increase in ad-hoc testing and bug documentation tasks.\n• Workload manageability in recent pulse check-ins dropped to 6/10.\n\nRecommended Actions:\n1. Re-estimate testing tasks and enforce WIP limits on Sprint 14 backlog.\n2. Clarify that new hires should focus strictly on core onboarding deliverables.\n3. Review task reassignments in tomorrow's daily standup.`,
        time: '9:01 AM',
      },
    ],
  },
  {
    id: 'manager_session_2',
    title: '1-on-1 talking points for workload check-ins',
    date: 'Yesterday, 2:15 PM',
    category: 'Management Coaching',
    snippet: 'Talking points for assessing task ownership and psychological safety.',
    messages: [
      {
        id: 603,
        sender: 'daniel',
        text: 'Generate 1-on-1 talking points for workload check-ins',
        time: '2:15 PM',
      },
      {
        id: 604,
        sender: 'ai',
        text: `Here are structured 1-on-1 discussion prompts designed to identify hidden workload pressure and clarify expectations:\n\n1. Task Ownership & Scope:\n"How clear are your current sprint commitments, and are there any ad-hoc tasks being passed to you that aren't on Jira?"\n\n2. Workload Manageability:\n"On a scale of 1-5, how realistic does your deadline feel for this Friday? Which item would you defer if time runs out?"\n\n3. Psychological Safety:\n"Is there any area where you feel blocked or hesitant to ask questions? How can I best support you this week?"`,
        time: '2:16 PM',
      },
    ],
  },
  {
    id: 'manager_session_3',
    title: 'Action Plan AP-01 Implementation Steps',
    date: '24 Oct 2026',
    category: 'HR Remediation',
    snippet: 'Implementation guidelines for AP-01: WIP limits and weekly check-ins.',
    messages: [
      {
        id: 605,
        sender: 'daniel',
        text: 'What are the key steps for implementing Action Plan AP-01 in Engineering?',
        time: '11:30 AM',
      },
      {
        id: 606,
        sender: 'ai',
        text: `Action Plan AP-01 (Engineering Task Allocation & Role Clarity) outlines 3 management commitments:\n\n1. Explicit WIP Limits:\nEstablish clear ownership for cross-functional testing tasks so junior engineers aren't overwhelmed.\n\n2. Weekly 1-on-1 Touchpoints:\nSchedule recurring 30-minute weekly alignment sessions with newer hires (under 6 months tenure).\n\n3. Standard Handoff Guidelines:\nDocument definition-of-done and task acceptance criteria before reallocating work.\n\nYou can monitor and complete these deliverables directly in the Manager Workspace.`,
        time: '11:31 AM',
      },
    ],
  },
];

export default function EkoChatView({
  isManager,
  messages,
  setMessages,
  chatInput,
  setChatInput,
  isTyping,
  demoStep,
  draftCopied,
  setDraftCopied,
  showResourcePreview,
  setShowResourcePreview,
  chatFileInputRef,
  handleManagerQuickPrompt,
  handleStartDemo,
  handleProceedToTurn3,
  handleProceedToTurn5,
  handleSendChat,
  onShowToast,
  setVoiceTab,
  setActivePage,
  setHighlightPostId,
}) {
  const {
    isChatHistoryOpen,
    setIsChatHistoryOpen,
    activeChatSessionId,
    setActiveChatSessionId,
    newChatTrigger,
    loadSessionTrigger,
    pendingEkoQuestion,
    setPendingEkoQuestion,
    startNewChat,
    loadChatSession,
  } = useApp();

  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const messagesEndRef = useRef(null);

  const availableSessions = isManager ? MANAGER_CHAT_SESSIONS : MAYA_CHAT_SESSIONS;

  const filteredSessions = availableSessions.filter((s) => {
    if (!historySearchQuery.trim()) return true;
    const q = historySearchQuery.toLowerCase();
    return (
      s.title.toLowerCase().includes(q) ||
      s.snippet.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q)
    );
  });

  // Handle new chat signal from top header
  useEffect(() => {
    if (newChatTrigger > 0) {
      setMessages([]);
    }
  }, [newChatTrigger, setMessages]);

  // Handle session load signal
  useEffect(() => {
    if (loadSessionTrigger && loadSessionTrigger.messages) {
      setMessages(loadSessionTrigger.messages);
    }
  }, [loadSessionTrigger, setMessages]);

  // Handle policy question passed from CompanyPoliciesView
  useEffect(() => {
    if (pendingEkoQuestion) {
      const q = pendingEkoQuestion;
      setPendingEkoQuestion(null);
      const userMsg = {
        id: Date.now(),
        sender: isManager ? 'daniel' : 'maya',
        text: q,
        time: 'Just now',
      };
      setMessages((prev) => [...prev, userMsg]);

      setTimeout(() => {
        let reply =
          'I am happy to explain this company policy. EchoHR indexes all active policies to ensure employees receive clear, verified guidance regarding workloads, handovers, and grievance protections.';
        if (q.includes('HR-POL-014')) {
          reply = `According to HR-POL-014 (Workload Allocation & Overtime Guidelines):\n\n1. Clause 4.1 Junior Tenure Protection:\nEmployees in their first 6 months are protected from ad-hoc task delegation without prior approval from their engineering manager.\n\n2. Clause 4.2 Sprint WIP Limits:\nCommitments exceeding 85% individual capacity trigger an early backlog re-estimation.\n\n3. Clause 5.3 Compensatory Rest:\nOvertime exceeding 5 hours/week requires manager pre-approval and qualifies for Time-Off-In-Lieu (TOIL).\n\nIf you are feeling pressure to take on unestimated tasks, you can discuss this directly with your manager or use Eko's neutral message draft.`;
        } else if (q.includes('ENG-SOP-008')) {
          reply = `Under ENG-SOP-008 (Sprint Task Handoff & Definition of Done):\n\n• Any delegated task must include explicit acceptance criteria, target environment, and estimated effort.\n• The Client Launch Checklist requires standard slide templates and lead sign-off.\n• Testing documentation remains the responsibility of the primary feature author unless officially reassigned during sprint planning.`;
        } else if (q.includes('HR-POL-021')) {
          reply = `Under HR-POL-021 (Psychological Safety & Confidential Reporting):\n\n• Absolute Non-Retaliation: You are strictly protected from any negative career impact or peer penalty for raising good-faith concerns.\n• Anonymous reference codes (like ANON-4827) isolate your identity while allowing two-way communication.\n• HR guarantees initial triage within 48 business hours.`;
        } else if (q.includes('HR-POL-032')) {
          reply = `Under HR-POL-032 (Manager 1-on-1 Framework):\n\n• You are entitled to recurring weekly 30-minute check-ins during your first 90 days.\n• Check-in agendas must cover workload balance, priority trade-offs, and blocker removal.`;
        } else if (q.includes('BEN-POL-005')) {
          reply = `Under BEN-POL-005 (Employee Assistance Program & Mental Wellbeing):\n\n• You have access to 6 complimentary, completely confidential counselling sessions per year via EchoCare Health.\n• No individual usage records or names are ever shared with HR or your manager.\n• Wednesday afternoons are designated as company-wide No-Meeting focus blocks.`;
        }
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'ai',
            text: reply,
            time: 'Just now',
          },
        ]);
      }, 700);
    }
  }, [pendingEkoQuestion, isManager, setMessages, setPendingEkoQuestion]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col min-h-[calc(100vh-130px)] max-w-4xl w-full mx-auto justify-between pb-6 relative">
      {/* 1. SLIDE-OUT CHAT HISTORY OVERLAY PANEL */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isChatHistoryOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop (Clicking outside slides panel away) */}
        <div
          onClick={() => setIsChatHistoryOpen(false)}
          className="absolute inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity"
        />

        {/* Sliding Panel from Left */}
        <div
          className={`absolute top-0 left-0 bottom-0 w-84 sm:w-96 max-w-[88vw] bg-white shadow-2xl border-r border-[#EBECEF] z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${
            isChatHistoryOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#EEF0FF] text-[#5455EE] flex items-center justify-center shadow-2xs">
                <Clock size={19} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-base leading-6 tracking-tight">Chat History</h3>
                <p className="text-xs font-normal leading-[18px] text-slate-500">Previous Eko conversations</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsChatHistoryOpen(false)}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
              title="Close history panel"
            >
              <X size={15} />
            </button>
          </div>

          {/* New Chat Action Button */}
          <div className="p-4 border-b border-slate-100 bg-white">
            <button
              type="button"
              onClick={() => {
                startNewChat();
                setMessages([]);
                setIsChatHistoryOpen(false);
              }}
              className="w-full py-2.5 px-4 rounded-2xl bg-[#EEF0FF] hover:bg-[#5455EE] text-[#5455EE] hover:text-white text-sm font-medium leading-5 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs group"
            >
              <Plus size={15} className="group-hover:rotate-90 transition-transform" />
              <span>Start New Conversation</span>
            </button>

            {/* Search past chats */}
            <div className="relative mt-3">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={historySearchQuery}
                onChange={(e) => setHistorySearchQuery(e.target.value)}
                placeholder="Search past conversations..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#F8F9FD] border border-slate-200 text-sm font-normal text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#5455EE]"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {filteredSessions.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No past conversations match your search.
              </div>
            ) : (
              filteredSessions.map((session) => {
                const isActive = activeChatSessionId === session.id;
                return (
                  <div
                    key={session.id}
                    onClick={() => {
                      loadChatSession(session);
                      setMessages(session.messages);
                      setIsChatHistoryOpen(false);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left flex flex-col gap-1.5 ${
                      isActive
                        ? 'bg-[#EEF0FF]/60 border-[#5455EE]/40 shadow-xs ring-1 ring-[#5455EE]/30'
                        : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium leading-[18px] uppercase tracking-wider text-[#5455EE] bg-indigo-50 px-2 py-0.5 rounded-md">
                        {session.category}
                      </span>
                      <span className="text-xs text-slate-500 font-normal leading-[18px]">
                        {session.date}
                      </span>
                    </div>
                    <h4 className="text-sm font-medium leading-5 text-slate-900 line-clamp-1">
                      {session.title}
                    </h4>
                    <p className="text-[13px] font-normal leading-5 text-slate-600 line-clamp-2">
                      {session.snippet}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer */}
          <div className="p-3.5 border-t border-slate-100 bg-slate-50 text-center">
            <span className="text-[10px] text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck size={12} className="text-emerald-600" />
              Private & encrypted locally in your session.
            </span>
          </div>
        </div>
      </div>

      {/* Slide-out overlay panel is controlled by TopHeader */}

      {/* Welcome Section - Centered when no messages */}
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center my-auto py-10 w-full max-w-2xl mx-auto animate-in fade-in duration-300">
          <div className="w-14 h-14 rounded-2xl bg-[#EEF0FF] flex items-center justify-center mb-3.5 shadow-xs">
            <EchoLogo size={32} color="#5455EE" animated />
          </div>
          <h2 className="text-[28px] sm:text-[32px] font-semibold text-slate-900 leading-10 tracking-[-0.015em]">
            {isManager ? 'Good morning, Daniel 👋' : 'Good morning, Maya 👋'}
          </h2>
          <p className="text-base sm:text-lg font-medium text-slate-800 mt-1.5 leading-7">
            {isManager ? 'Engineering Management & Team Copilot' : 'What can I help you with today?'}
          </p>
          <p className="text-sm font-normal text-slate-600 mt-1 max-w-lg leading-[22px]">
            {isManager
              ? 'Get AI assistance on sprint workload distribution, team alignment, 1-on-1 talking points, or leadership guidance.'
              : "Whether you need help understanding a task, organising your priorities, or finding support, you don't have to figure everything out alone."}
          </p>

          {/* Quick Action Cards */}
          {isManager ? (
            /* Daniel Lim's Manager Quick Actions (NO DEMO) */
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full mt-6 text-left">
              <button
                type="button"
                onClick={() => handleManagerQuickPrompt('Review Sprint 14 team capacity and workload distribution')}
                className="bg-white hover:bg-slate-50 border border-slate-200 p-4 rounded-2xl shadow-xs flex items-center justify-between text-left cursor-pointer transition-all group hover:scale-[1.02] hover:border-slate-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#5455EE] flex items-center justify-center border border-indigo-100 flex-shrink-0">
                    <SlidersHorizontal size={17} />
                  </div>
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider text-slate-400">
                      Capacity & Workload
                    </div>
                    <h4 className="text-sm font-medium text-slate-900 mt-0.5 leading-5">Sprint Capacity</h4>
                    <p className="text-[13px] font-normal text-slate-500 mt-0.5 leading-5">Review squad load & WIP</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-1" />
              </button>

              <button
                type="button"
                onClick={() => handleManagerQuickPrompt('Generate 1-on-1 talking points for workload check-ins')}
                className="bg-white hover:bg-slate-50 border border-slate-200 p-4 rounded-2xl shadow-xs flex items-center justify-between text-left cursor-pointer transition-all group hover:scale-[1.02] hover:border-slate-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 flex-shrink-0">
                    <Users size={17} />
                  </div>
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider text-slate-400">
                      Manager 1-on-1s
                    </div>
                    <h4 className="text-sm font-medium text-slate-900 mt-0.5 leading-5">1-on-1 Prompts</h4>
                    <p className="text-[13px] font-normal text-slate-500 mt-0.5 leading-5">Workload & clarity questions</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-1" />
              </button>

              <button
                type="button"
                onClick={() => handleManagerQuickPrompt('What are the key steps for implementing Action Plan AP-01 in Engineering?')}
                className="bg-white hover:bg-slate-50 border border-slate-200 p-4 rounded-2xl shadow-xs flex items-center justify-between text-left cursor-pointer transition-all group hover:scale-[1.02] hover:border-slate-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 flex-shrink-0">
                    <Briefcase size={17} />
                  </div>
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider text-slate-400">
                      Remediation
                    </div>
                    <h4 className="text-sm font-medium text-slate-900 mt-0.5 leading-5">Action Plan AP-01</h4>
                    <p className="text-[13px] font-normal text-slate-500 mt-0.5 leading-5">Workload limits & guidelines</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-1" />
              </button>
            </div>
          ) : (
            /* Maya Tan's Employee Quick Actions (Demo Walkthrough) */
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full mt-6 text-left">
              <button
                type="button"
                onClick={handleStartDemo}
                className="bg-[#5455EE] hover:bg-[#4344dd] text-white p-4 rounded-2xl shadow-md flex items-center justify-between text-left cursor-pointer transition-all group hover:scale-[1.02]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles size={17} className="text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider text-white/80">
                      Live Walkthrough
                    </div>
                    <h4 className="text-sm font-medium mt-0.5 leading-5">Start Demo</h4>
                    <p className="text-[13px] font-normal text-white/80 mt-0.5 leading-5">Open Eko guidance</p>
                  </div>
                </div>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform flex-shrink-0 ml-1" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setVoiceTab('pulse');
                }}
                className="bg-white hover:bg-slate-50 border border-slate-200 p-4 rounded-2xl shadow-xs flex items-center justify-between text-left cursor-pointer transition-all group hover:scale-[1.02] hover:border-slate-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 flex-shrink-0">
                    <ClipboardCheck size={17} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Occasional Check-in
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-0.5">Pulse Survey</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Occasional check-in · 2 min</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-1" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setActivePage('emp_feedback');
                  setVoiceTab('report');
                }}
                className="bg-white hover:bg-slate-50 border border-slate-200 p-4 rounded-2xl shadow-xs flex items-center justify-between text-left cursor-pointer transition-all group hover:scale-[1.02] hover:border-slate-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 flex-shrink-0">
                    <Lock size={17} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Private Voice
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-0.5">Submit Report</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Raise concerns safely</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-1" />
              </button>
            </div>
          )}
        </div>
      ) : null}

      {/* Conversation Stream */}
      {messages.length > 0 && (
        <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">
          {messages.map((msg) => {
            const isUser = isManager ? msg.sender === 'daniel' : msg.sender === 'maya';
            const senderDisplayName = msg.sender === 'daniel' ? 'Daniel Lim' : msg.sender === 'maya' ? 'Maya Tan' : 'Eko';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 text-sm ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in duration-200`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-2xl bg-[#5455EE] text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                    <EchoLogo size={16} color="#FFFFFF" animated />
                  </div>
                )}

                <div
                  className={`p-4 sm:p-5 rounded-3xl max-w-[85%] leading-6 ${
                    isUser
                      ? 'bg-[#5455EE] text-white rounded-br-xs shadow-md font-normal'
                      : 'bg-white text-slate-800 border border-[#EBECEF] rounded-bl-xs shadow-card font-normal'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-2 text-xs opacity-80">
                    <span className="font-semibold text-[13px] leading-5">{senderDisplayName}</span>
                    <span className="text-xs leading-[18px] font-normal">{msg.time}</span>
                  </div>

                  <p className="whitespace-pre-line text-base font-normal leading-6">
                    {msg.text}
                  </p>

                  {/* Turn 2: Client Launch Checklist */}
                  {msg.hasResourceCard && (
                    <div className="mt-3.5 p-3.5 rounded-2xl bg-[#F8F9FD] border border-slate-200 flex items-center justify-between shadow-2xs">
                      <span className="text-sm font-semibold leading-5 text-slate-900 flex items-center gap-1.5">
                        <FileText size={16} className="text-[#5455EE]" />
                        Company Resource: Client Launch Checklist
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowResourcePreview(true)}
                        className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-[#5455EE] font-medium text-sm leading-5 hover:bg-[#EEF0FF] transition-colors shadow-2xs cursor-pointer"
                      >
                        View Example
                      </button>
                    </div>
                  )}

                  {/* Turn 4: Task Comparison Table & Neutral Draft */}
                  {msg.hasTaskTable && (
                    <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-col gap-3">
                      <h4 className="text-sm font-semibold leading-5 text-slate-900">
                        Workload & Commitment Comparison
                      </h4>

                      <div className="border border-slate-200 rounded-2xl overflow-hidden text-sm">
                        <table className="w-full text-left">
                          <thead className="bg-[#F8F9FD] text-slate-700 font-medium border-b border-slate-200">
                            <tr>
                              <th className="p-3 text-sm font-medium leading-5">Commitment</th>
                              <th className="p-3 text-sm font-medium leading-5">Deadline</th>
                              <th className="p-3 text-right text-sm font-medium leading-5">Estimated Effort</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            <tr>
                              <td className="p-3 font-normal text-slate-800 leading-5">Existing sprint tasks</td>
                              <td className="p-3 text-slate-600 leading-5">Thursday, 22 Oct</td>
                              <td className="p-3 text-right font-semibold tabular-nums text-slate-900 leading-5">6 hours</td>
                            </tr>
                            <tr>
                              <td className="p-3 font-normal text-slate-800 leading-5">Client launch materials</td>
                              <td className="p-3 text-slate-600 leading-5">Friday, 23 Oct</td>
                              <td className="p-3 text-right font-semibold tabular-nums text-slate-900 leading-5">5 hours</td>
                            </tr>
                            <tr className="bg-[#FFF9F2]">
                              <td className="p-3 font-normal text-[#9E4A1A] leading-5">Additional testing documentation</td>
                              <td className="p-3 text-[#9E4A1A] leading-5">Friday, 23 Oct</td>
                              <td className="p-3 text-right font-semibold tabular-nums text-[#9E4A1A] leading-5">4 hours</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Summary & Suggestions below table */}
                      <span className="font-semibold flex items-center gap-1.5 text-indigo-950 text-sm leading-5">
                        💡 Recommended Priority Order:
                      </span>
                      <div className="text-sm space-y-1.5 text-slate-800 leading-[22px]">
                        <p>1. <strong className="font-semibold text-slate-900">Existing sprint tasks (Thursday)</strong> — take precedence to avoid blocking sprint delivery.</p>
                        <p>2. <strong className="font-semibold text-slate-900">Client launch materials (Friday)</strong> — you scheduled client milestone for the week.</p>
                        <p>3. <strong className="font-semibold text-slate-900">Additional testing documentation (Friday)</strong> — Defer / reassign: exceeds weekly capacity (+4h overload).</p>
                      </div>

                      <p className="text-sm font-normal text-slate-700 leading-[22px] pt-1">
                        You should confirm this priority order with your manager (Daniel Lim) before deferring or declining the testing documentation so expectations are aligned.
                      </p>

                      <p className="text-sm font-medium leading-5 text-slate-900 pt-0.5">
                        Need suggested draft message?
                      </p>

                      {/* Suggested Message Box (Non-italic per Section 6.6) */}
                      <div className="p-4 rounded-2xl bg-[#F8F9FE] border border-[#5455EE]/25 flex flex-col gap-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium leading-5 text-[#5455EE]">Suggested draft message:</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard?.writeText(msg.suggestedDraft);
                              setDraftCopied(true);
                              if (onShowToast) onShowToast('Draft message copied to clipboard');
                              setTimeout(() => setDraftCopied(false), 2500);
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-[#5455EE] hover:bg-[#4344dd] text-white text-sm font-medium leading-5 transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                          >
                            {draftCopied ? <Check size={13} /> : <Copy size={13} />}
                            <span>{draftCopied ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                        <p className="text-slate-800 text-sm font-normal leading-[22px]">
                          “{msg.suggestedDraft}”
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Turn 5: Proactive Recurring-Issue Check-in Quick Actions */}
                  {msg.isTurn5 && msg.showActionButtons && (
                    <div className="mt-3.5 pt-3.5 border-t border-slate-100 flex flex-col gap-2.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {/* 1. Submit anonymous report */}
                        <button
                          type="button"
                          onClick={() => {
                            setVoiceTab('report');
                            if (onShowToast) onShowToast('Opening Confidential Workplace Report modal...');
                          }}
                          className="p-3.5 rounded-2xl bg-gradient-to-r from-[#5455EE] to-[#4344dd] hover:from-[#4344dd] hover:to-[#3839cb] text-white transition-all text-left flex items-center justify-between cursor-pointer group shadow-sm shadow-[#5455EE]/20 hover:scale-[1.01]"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-white/20 text-white flex items-center justify-center flex-shrink-0">
                              <ShieldCheck size={16} />
                            </div>
                            <div>
                              <span className="font-medium text-sm block leading-5">
                                Submit anonymous report
                              </span>
                              <span className="text-xs text-white/80 leading-[18px]">
                                Identity not shared · Confidential HR review
                              </span>
                            </div>
                          </div>
                          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform flex-shrink-0 ml-1 opacity-90" />
                        </button>

                        {/* 2. Give feedback */}
                        <button
                          type="button"
                          onClick={() => {
                            setVoiceTab('feedback');
                            if (onShowToast) onShowToast('Opening Feedback Form modal...');
                          }}
                          className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-[#5455EE] hover:bg-[#F8F9FD] transition-all text-left flex items-center justify-between cursor-pointer group shadow-2xs hover:scale-[1.01]"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                              <MessageSquare size={16} />
                            </div>
                            <div>
                              <span className="font-medium text-slate-900 text-sm group-hover:text-[#5455EE] transition-colors block leading-5">
                                Give feedback
                              </span>
                              <span className="text-xs text-slate-500 leading-[18px]">
                                Share suggestions & improvements
                              </span>
                            </div>
                          </div>
                          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform flex-shrink-0 ml-1 text-slate-400 group-hover:text-[#5455EE]" />
                        </button>

                        {/* 3. View community discussions */}
                        <button
                          type="button"
                          onClick={() => {
                            if (setHighlightPostId) setHighlightPostId('COM-1');
                            setActivePage('community');
                            if (onShowToast) onShowToast('Navigating to Community Board (COM-1)...');
                          }}
                          className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-[#5455EE] hover:bg-[#F8F9FD] transition-all text-left flex items-center justify-between cursor-pointer group shadow-2xs hover:scale-[1.01]"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                              <Users size={16} />
                            </div>
                            <div>
                              <span className="font-medium text-slate-900 text-sm group-hover:text-[#5455EE] transition-colors block leading-5">
                                View community discussions
                              </span>
                              <span className="text-xs text-slate-500 leading-[18px]">
                                Peer support & shared experiences
                              </span>
                            </div>
                          </div>
                          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform flex-shrink-0 ml-1 text-slate-400 group-hover:text-[#5455EE]" />
                        </button>

                        {/* 4. Not now */}
                        <button
                          type="button"
                          onClick={() => {
                            setMessages((prev) =>
                              prev.map((m) =>
                                m.id === msg.id ? { ...m, showActionButtons: false, dismissed: true } : m
                              )
                            );
                            if (onShowToast) onShowToast('Check-in suggestion dismissed. You can continue chatting normally.');
                          }}
                          className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-all text-left flex items-center justify-between cursor-pointer group shadow-2xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-slate-200/70 text-slate-600 flex items-center justify-center flex-shrink-0">
                              <X size={15} />
                            </div>
                            <div>
                              <span className="font-bold text-slate-700 text-xs group-hover:text-slate-900 transition-colors block leading-tight">
                                Not now
                              </span>
                              <span className="text-[10px] text-slate-400 leading-tight">
                                Return to normal chat
                              </span>
                            </div>
                          </div>
                          <span className="text-[11px] font-bold text-slate-400 group-hover:text-slate-600">
                            Dismiss
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 self-start bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
              <EchoLogo size={14} color="#5455EE" animated />
              <span>Eko is retrieving guidance...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Demo Completion Navigation (Shown once full sequence completes in one shot) */}
      {!isManager && demoStep === 3 && !isTyping && (
        <div className="mb-2">
          <button
            type="button"
            onClick={() => {
              if (setHighlightPostId) setHighlightPostId('COM-1');
              setActivePage('community');
              if (onShowToast) onShowToast('Navigating to Community Board (COM-1)...');
            }}
            className="w-full p-2.5 rounded-2xl bg-[#EEF0FF] border border-[#5455EE]/40 text-[#5455EE] text-xs font-bold flex items-center justify-between hover:bg-[#E0E3FF] transition-all cursor-pointer shadow-xs"
          >
            <span>👉 Next Demo Step: View Community Discussions (COM-1)</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Bottom Input Form */}
      <div className="w-full">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendChat();
          }}
          className="rounded-3xl border border-slate-200 bg-white shadow-sm focus-within:border-[#5455EE] focus-within:ring-2 focus-within:ring-[#5455EE]/10 transition-all p-2 px-3 flex items-center gap-2"
        >
          {/* Left: a plus sign on left for any attachment */}
          <button
            type="button"
            onClick={() => {
              if (chatFileInputRef.current) {
                chatFileInputRef.current.click();
              }
            }}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-[#EEF0FF] text-slate-500 hover:text-[#5455EE] flex items-center justify-center transition-all flex-shrink-0 cursor-pointer shadow-2xs"
            title="Attach file, screenshot or note"
            aria-label="Add attachment"
          >
            <Plus size={17} />
          </button>
          <input
            type="file"
            ref={chatFileInputRef}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && onShowToast) {
                onShowToast(`Attached "${file.name}" for Eko analysis`);
              }
            }}
          />

          {/* Middle: typing space */}
          <textarea
            rows={1}
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendChat();
              }
            }}
            placeholder={
              isManager
                ? 'Ask Eko about sprint capacity, team alignment, 1-on-1 coaching...'
                : 'Ask anything about onboarding, workload, or expectations...'
            }
            className="flex-1 py-1.5 px-2 text-base font-normal leading-6 text-slate-900 placeholder:text-slate-400 focus:outline-none resize-none bg-transparent max-h-28 overflow-y-auto"
          />

          {/* Right: audio icon and send icon */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              type="button"
              onClick={() => {
                if (onShowToast) {
                  onShowToast('Voice dictation active. Speak into your microphone...');
                }
              }}
              className="w-9 h-9 rounded-full hover:bg-slate-100 text-slate-400 hover:text-[#5455EE] flex items-center justify-center transition-all cursor-pointer"
              title="Voice input"
              aria-label="Voice input"
            >
              <Mic size={17} />
            </button>
            <button
              type="submit"
              disabled={!chatInput.trim()}
              className="w-9 h-9 rounded-full bg-[#5455EE] hover:bg-[#4344dd] disabled:opacity-40 disabled:hover:bg-[#5455EE] text-white flex items-center justify-center transition-all shadow-sm cursor-pointer"
              title="Send message"
              aria-label="Send message"
            >
              <Send size={15} className="translate-x-[0.5px]" />
            </button>
          </div>
        </form>

        <div className="flex items-center justify-center gap-1.5 text-[13px] font-normal leading-5 text-slate-600 mt-2">
          <ShieldCheck size={14} className="text-emerald-600 flex-shrink-0" />
          <span>
            {isManager
              ? 'Confidential managerial coaching and copilot workspace.'
              : 'Private AI conversation is not automatically attached to an HR report.'}
          </span>
        </div>
      </div>

      {/* Modal: Resource Preview */}
      {showResourcePreview && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 flex flex-col gap-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-900">Client Launch Checklist Example</h4>
              <button
                type="button"
                onClick={() => setShowResourcePreview(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Standard client launch assets include: 1) Executive Pitch Deck (Slide deck), 2) Architectural Whitepaper, 3) End-to-end sandbox walkthrough demo, and 4) Sign-off sheet from Squad Lead and Product Director.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl text-slate-500 text-[11px]">
              Retrieved from Engineering Confluence / Launches.
            </div>
            <button
              type="button"
              onClick={() => setShowResourcePreview(false)}
              className="mt-2 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 cursor-pointer"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
