import React, { useState, useEffect, useRef } from 'react';
import { CATEGORIES, MAYA_PROFILE } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import EkoChatView from './EkoChatView';
import EmployeeVoiceHub from './EmployeeVoiceHub';
import CompanyPoliciesView from './CompanyPoliciesView';
import ConfidentialReportModal from './ConfidentialReportModal';
import PulseSurveyModal from './PulseSurveyModal';
import ConstructiveFeedbackModal from './ConstructiveFeedbackModal';
import AnonymousStatusModal from './AnonymousStatusModal';
import AddUpdateModal from './AddUpdateModal';
import RetractRecordModal from './RetractRecordModal';
import FollowUpModal from './FollowUpModal';
import RecordDetailModal from './RecordDetailModal';

export default function EmployeePortalView({
  activePage,
  setActivePage,
  onShowToast,
  onSubmitNewReport,
  isReportResolved = false,
  initialVoiceTab,
  setHighlightPostId,
  userRole = 'employee',
}) {
  const isManager = userRole === 'manager';

  // AI Chat state - separated for Maya Tan and Daniel Lim
  const [mayaMessages, setMayaMessages] = useState([]);
  const [managerMessages, setManagerMessages] = useState([]);
  const messages = isManager ? managerMessages : mayaMessages;
  const setMessages = (updater) => {
    if (isManager) {
      setManagerMessages(updater);
    } else {
      setMayaMessages(updater);
    }
  };

  const [chatInput, setChatInput] = useState('');
  const chatFileInputRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const [demoStep, setDemoStep] = useState(0); // 0, 1, 2, 3 (Maya only)
  const [draftCopied, setDraftCopied] = useState(false);
  const [showResourcePreview, setShowResourcePreview] = useState(false);

  // Voice & Feedback active modal form: null | 'report' | 'pulse' | 'feedback' | 'status'
  const [voiceTab, setVoiceTab] = useState(initialVoiceTab || null);
  const [recordFilter, setRecordFilter] = useState('all'); // 'all' | 'report' | 'pulse' | 'feedback'

  useEffect(() => {
    if (initialVoiceTab) {
      setVoiceTab(initialVoiceTab);
    }
  }, [initialVoiceTab]);

  useEffect(() => {
    if (voiceTab === 'pulse') {
      setPulseSubmittedSuccess(false);
      setPulseResponses({
        workload: 0,
        clarity: 0,
        support: 0,
        help: 0,
      });
      setPulseComment('');
    } else if (voiceTab === 'report') {
      setReportCategory('con_01');
      setReportDescription('');
      setReportOutcome('');
      setPrivacyChoice('optionA');
      setPrivacyConsent(true);
    }
  }, [voiceTab]);

  // Pulse Survey Form State
  const [pulseResponses, setPulseResponses] = useState({
    workload: 0,
    clarity: 0,
    support: 0,
    help: 0,
  });
  const [pulseComment, setPulseComment] = useState('');
  const [pulseSubmittedSuccess, setPulseSubmittedSuccess] = useState(false);

  // Open Feedback Form State
  const [feedbackCategory, setFeedbackCategory] = useState('process');
  const [feedbackScope, setFeedbackScope] = useState('Engineering Department');
  const [feedbackTitle, setFeedbackTitle] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackOutcome, setFeedbackOutcome] = useState('');
  const [feedbackAnonymous, setFeedbackAnonymous] = useState(true);

  // Confidential Report Form State
  const [reportCategory, setReportCategory] = useState('con_01');
  const [reportDescription, setReportDescription] = useState('');
  const [reportOutcome, setReportOutcome] = useState('');
  const [privacyChoice, setPrivacyChoice] = useState('optionA');
  const [privacyDropdownOpen, setPrivacyDropdownOpen] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(true);

  // Status Search State
  const [searchRefCode, setSearchRefCode] = useState('ANON-4827');
  const [statusResult, setStatusResult] = useState(null);

  // Simulated Follow-up State
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);

  // Temporary Form Submission Alert
  const [submittedAlert, setSubmittedAlert] = useState(null);

  // Modal: View Record Details
  const [detailRecordTarget, setDetailRecordTarget] = useState(null);
  const [recordPrivacyOpen, setRecordPrivacyOpen] = useState(false);

  const { askEkoQuestion } = useApp();
  const [activeVoiceTab, setActiveVoiceTab] = useState(
    initialVoiceTab === 'pulse' || initialVoiceTab === 'report' || initialVoiceTab === 'feedback'
      ? initialVoiceTab
      : 'feedback'
  );

  // Initial records for Maya Tan (starts without pulse survey so reminder banner is shown)
  const initialMayaRecords = [
    {
      id: 'ANON-4827',
      displayId: 'R001',
      systemId: 'ANON-4827',
      type: 'report',
      title: 'Repeated workload transfers and conflicting priorities',
      category: 'con_01',
      categoryLabel: 'Burnout & Workload Imbalance',
      department: 'Engineering',
      date: '20 October 2026',
      status: 'In Progress',
      reviewStatus: 'Reviewed',
      resolutionStatus: 'In Progress',
      description: 'An anonymous Engineering employee reports repeated additional task assignments from a senior colleague without manager alignment, creating sprint overload.',
      outcome: 'Clear task ownership and workload rebalancing',
      privacyChoice: 'optionA',
      updates: [
        {
          id: 1,
          date: '20 Oct, 11:30 AM',
          text: 'Assigned to Senior HRBP and Head of Engineering for workload allocation review.',
        },
      ],
    },
    {
      id: 'FDB-1042',
      displayId: 'F001',
      systemId: 'FDB-1042',
      type: 'feedback',
      title: 'Standardize Sprint Handover Checklist for New Hires',
      category: 'process',
      categoryLabel: 'Process & Tooling',
      department: 'Engineering',
      date: '18 October 2026',
      status: 'Need Review',
      reviewStatus: 'Pending Review',
      resolutionStatus: 'Need Review',
      description: 'Suggesting a standardized task acceptance criteria checklist before senior peers hand off testing tickets to new joiners.',
      outcome: 'Better onboarding and reduced ambiguity',
      privacyChoice: 'optionB',
      updates: [],
    },
  ];

  // Submitted Records / Activity List - separated for Maya and Daniel
  const [mayaRecords, setMayaRecords] = useState(initialMayaRecords);
  const [managerRecords, setManagerRecords] = useState([]);
  const submittedRecords = isManager ? managerRecords : mayaRecords;
  const setSubmittedRecords = (updater) => {
    if (isManager) {
      setManagerRecords(updater);
    } else {
      setMayaRecords(updater);
    }
  };

  // Modal: Add Update / Follow-up Note to Record
  const [showAddUpdateModal, setShowAddUpdateModal] = useState(false);
  const [updateRecordTarget, setUpdateRecordTarget] = useState(null);
  const [newUpdateText, setNewUpdateText] = useState('');

  // Modal: Take Back / Retract Record
  const [showRetractModal, setShowRetractModal] = useState(false);
  const [retractRecordTarget, setRetractRecordTarget] = useState(null);

  const triggerSubmittedAlert = (type, title, message) => {
    setSubmittedAlert({ type, title, message });
    setTimeout(() => {
      setSubmittedAlert(null);
    }, 5000);
  };

  // Manager Quick Prompt Trigger
  const handleManagerQuickPrompt = (promptText) => {
    const userMsg = {
      id: Date.now(),
      sender: 'daniel',
      text: promptText,
      time: 'Just now',
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      let replyText = 'Here is my managerial recommendation on this:';
      const p = promptText.toLowerCase();
      if (p.includes('capacity') || p.includes('sprint') || p.includes('workload')) {
        replyText = `Based on Sprint 14 telemetry, Platform Squad's workload is concentrated on 3 senior engineers and 1 new hire (Maya Tan).\n\nKey Observations:\n• 18% increase in ad-hoc testing and bug documentation tasks.\n• Workload manageability in recent pulse check-ins dropped to 6/10.\n\nRecommended Actions:\n1. Re-estimate testing tasks and enforce WIP limits on Sprint 14 backlog.\n2. Clarify that new hires should focus strictly on core onboarding deliverables.\n3. Review task reassignments in tomorrow's daily standup.`;
      } else if (p.includes('1-on-1') || p.includes('prompts') || p.includes('talking')) {
        replyText = `Here are structured 1-on-1 discussion prompts designed to identify hidden workload pressure and clarify expectations:\n\n1. Task Ownership & Scope:\n"How clear are your current sprint commitments, and are there any ad-hoc tasks being passed to you that aren't on Jira?"\n\n2. Workload Manageability:\n"On a scale of 1-5, how realistic does your deadline feel for this Friday? Which item would you defer if time runs out?"\n\n3. Psychological Safety:\n"Is there any area where you feel blocked or hesitant to ask questions? How can I best support you this week?"`;
      } else if (p.includes('ap-01') || p.includes('action plan')) {
        replyText = `Action Plan AP-01 (Engineering Task Allocation & Role Clarity) outlines 3 management commitments:\n\n1. Explicit WIP Limits:\nEstablish clear ownership for cross-functional testing tasks so junior engineers aren't overwhelmed.\n\n2. Weekly 1-on-1 Touchpoints:\nSchedule recurring 30-minute weekly alignment sessions with newer hires (under 6 months tenure).\n\n3. Standard Handoff Guidelines:\nDocument definition-of-done and task acceptance criteria before reallocating work.\n\nYou can monitor and complete these deliverables directly in the Manager Workspace.`;
      } else {
        replyText = "I understand, Daniel. Balancing team delivery targets with well-being requires clear priority trade-offs. Let's make sure the squad's sprint WIP limits and 1-on-1 check-ins reflect these commitments.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: replyText,
          time: 'Just now',
        },
      ]);
      setIsTyping(false);
    }, 700);
  };

  const demoTimeoutsRef = useRef([]);

  const clearDemoTimeouts = () => {
    demoTimeoutsRef.current.forEach((t) => clearTimeout(t));
    demoTimeoutsRef.current = [];
  };

  useEffect(() => {
    return () => {
      clearDemoTimeouts();
    };
  }, []);

  // 1-Click AI Chat Demo Launch (Plays full sequence in one shot: Unclear instruction -> Guidance -> Workload conflict -> Prioritization -> Check-in)
  const handleStartDemo = () => {
    clearDemoTimeouts();

    // Turn 1: Maya expresses uncertainty about manager's unclear instruction
    const m1 = {
      id: 1,
      sender: 'maya',
      text: "My manager said, 'Prepare the client launch materials and make sure everything is ready for Friday.' But what exactly am I supposed to prepare? I don’t want to keep asking questions and look incapable.",
      time: '10:14 AM',
    };
    setMessages([m1]);
    setIsTyping(true);
    setDemoStep(1);

    // Turn 2: Eko responds with Client Launch Checklist guidance
    const t1 = setTimeout(() => {
      const m2 = {
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
      };
      setMessages((prev) => [...prev, m2]);
      setIsTyping(false);

      // Turn 3: Maya automatically asks about senior's testing doc & workload conflict
      const t2 = setTimeout(() => {
        const m3 = {
          id: 3,
          sender: 'maya',
          text: "That helps. But my senior also asked me to finish their testing documentation. I already have other sprint tasks due this week. I don’t know what I should do first…",
          time: '10:16 AM',
        };
        setMessages((prev) => [...prev, m3]);
        setIsTyping(true);

        // Turn 4: Eko responds with task comparison table, recommended priority order & suggested draft
        const t3 = setTimeout(() => {
          const m4 = {
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
          };
          setMessages((prev) => [...prev, m4]);
          setIsTyping(false);

          // Turn 5: Eko follows up with proactive recurring-issue check-in
          const t4 = setTimeout(() => {
            setIsTyping(true);

            const t5 = setTimeout(() => {
              const m5 = {
                id: 5,
                sender: 'ai',
                text: `Does this type of issue appear often for you?\nIf yes, you can let the company know through anonymous feedback or a confidential report. Your identity and individual conversation will not be shared, and HR will see anonymized themes.`,
                isTurn5: true,
                showActionButtons: true,
                time: '10:18 AM',
              };
              setMessages((prev) => [...prev, m5]);
              setIsTyping(false);
              setDemoStep(3);
            }, 1200);
            demoTimeoutsRef.current.push(t5);
          }, 900);
          demoTimeoutsRef.current.push(t4);
        }, 1700);
        demoTimeoutsRef.current.push(t3);
      }, 1200);
      demoTimeoutsRef.current.push(t2);
    }, 1500);
    demoTimeoutsRef.current.push(t1);
  };

  // Fallback direct step triggers if needed
  const handleProceedToTurn3 = () => {};
  const handleProceedToTurn5 = () => {};

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const isMgr = userRole === 'manager';
    const text = chatInput.trim();
    const userMsg = {
      id: Date.now(),
      sender: isMgr ? 'daniel' : 'maya',
      text,
      time: 'Just now',
    };
    setMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      let replyText = isMgr
        ? "I understand, Daniel. Balancing delivery targets with team well-being requires clear priority trade-offs. Let's make sure the squad's sprint WIP limits and 1-on-1 check-ins reflect these commitments."
        : "I understand how challenging that can be. Let's make sure your priorities are documented and protected. You can also explore feedback or reporting options at your own pace.";

      if (isMgr) {
        const query = text.toLowerCase();
        if (query.includes('capacity') || query.includes('sprint') || query.includes('workload')) {
          replyText = "Based on Sprint 14 telemetry, Platform Squad's workload is concentrated on 3 senior engineers and 1 new hire (Maya Tan). I recommend holding a 15-minute backlog review to re-estimate or defer non-critical documentation tasks.";
        } else if (query.includes('1-on-1') || query.includes('talking') || query.includes('check-in')) {
          replyText = "Here are three suggested talking points for your upcoming 1-on-1s:\n1. 'How clear do your current sprint deliverables feel on a scale of 1-5?'\n2. 'Are any ad-hoc requests coming from peers that aren't reflected in your board commitments?'\n3. 'What is one task we can take off your plate this week?'";
        } else if (query.includes('ap-01') || query.includes('action plan') || query.includes('hr')) {
          replyText = "Action Plan AP-01 is assigned to your engineering squad. Key deliverables include: (1) Setting explicit WIP limits on sprint tasks, (2) Establishing weekly 1-on-1s for team members under 6 months tenure, and (3) Publishing a standard sprint handoff brief.";
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: replyText,
          time: 'Just now',
        },
      ]);
      setIsTyping(false);
    }, 700);
  };

  const handlePulseSubmit = (e) => {
    e.preventDefault();
    setPulseSubmittedSuccess(true);
    const existingCount = submittedRecords.filter((r) => r.type === 'pulse').length;
    const displayNum = String(existingCount + 1).padStart(3, '0');
    const newPulseRecord = {
      id: 'PULSE-W42',
      displayId: `S${displayNum}`,
      systemId: 'PULSE-W42',
      type: 'pulse',
      title: 'Weekly Pulse Check-in (Week 42)',
      date: 'Today, 20 Oct',
      status: 'Reviewed',
      reviewStatus: 'Aggregated',
      resolutionStatus: 'Recorded',
      scores: {
        workload: pulseResponses.workload ?? 6,
        clarity: pulseResponses.clarity ?? 6,
        support: pulseResponses.support ?? 6,
        help: pulseResponses.help ?? 6,
      },
      comment: pulseComment || MAYA_PROFILE.pulseComment,
    };
    setSubmittedRecords((prev) => {
      const existingIdx = prev.findIndex((r) => r.type === 'pulse');
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = newPulseRecord;
        return updated;
      }
      return [newPulseRecord, ...prev];
    });
    setActiveVoiceTab('pulse');
    if (onShowToast) onShowToast('Your pulse survey has been submitted.');
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedbackTitle.trim() || !feedbackMessage.trim()) return;

    const existingCount = submittedRecords.filter((r) => r.type === 'feedback').length;
    const displayNum = String(existingCount + 1).padStart(3, '0');
    const sysId = `FDB-${Date.now().toString().slice(-4)}`;

    const newRecord = {
      id: sysId,
      displayId: `F${displayNum}`,
      systemId: sysId,
      type: 'feedback',
      title: feedbackTitle.trim(),
      category: feedbackCategory,
      categoryLabel: 'Process & Tooling',
      department: 'Engineering',
      date: 'Today, 20 Oct',
      status: 'Need Review',
      reviewStatus: 'Pending Review',
      resolutionStatus: 'Need Review',
      description: feedbackMessage.trim(),
      outcome: feedbackOutcome.trim() || 'Process and capacity improvements',
      privacyChoice: feedbackAnonymous ? 'optionB' : 'optionA',
      updates: [],
    };

    setSubmittedRecords((prev) => [newRecord, ...prev]);
    setFeedbackTitle('');
    setFeedbackMessage('');
    setFeedbackOutcome('');
    setVoiceTab(null);
    triggerSubmittedAlert(
      'feedback',
      'Constructive Feedback Shared',
      'Your feedback has been delivered to departmental leadership.'
    );
    if (onShowToast) onShowToast('Constructive feedback shared successfully!');
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (!privacyConsent) {
      if (onShowToast) onShowToast('Please confirm the privacy choice before submitting.');
      return;
    }

    const existingCount = submittedRecords.filter((r) => r.type === 'report').length;
    const displayNum = String(existingCount + 1).padStart(3, '0');

    const newReportRecord = {
      id: 'ANON-4827',
      displayId: `R${displayNum}`,
      systemId: 'ANON-4827',
      type: 'report',
      title: 'Repeated workload transfers and conflicting priorities',
      category: reportCategory,
      categoryLabel:
        reportCategory === 'con_01' || reportCategory === 'burnout'
          ? 'Burnout & Workload Imbalance'
          : reportCategory === 'con_02' || reportCategory === 'role_expectations'
          ? 'Unclear Role Expectations'
          : reportCategory === 'leadership'
          ? 'Poor Leadership & Support'
          : reportCategory === 'recognition' || reportCategory === 'con_03'
          ? 'Lack of Recognition & Appreciation'
          : reportCategory === 'growth'
          ? 'Limited Growth & Career Development'
          : reportCategory === 'collaboration' || reportCategory === 'con_04'
          ? 'Collaboration & Social Connection Difficulties'
          : reportCategory === 'change_mgmt'
          ? 'Unsuccessful Change Management'
          : 'Workplace Feedback',
      department: privacyChoice === 'optionA' ? 'Engineering' : 'Undisclosed',
      date: '20 October 2026',
      status: 'In Progress',
      reviewStatus: 'Reviewed',
      resolutionStatus: 'In Progress',
      description: reportDescription,
      outcome: reportOutcome,
      privacyChoice: privacyChoice,
      updates: [
        {
          id: 1,
          date: '20 Oct, 11:30 AM',
          text: 'Assigned to Senior HRBP and Head of Engineering for workload allocation review.',
        },
      ],
    };

    setSubmittedRecords((prev) => [
      newReportRecord,
      ...prev.filter((r) => r.id !== 'ANON-4827'),
    ]);

    setVoiceTab(null);

    if (onSubmitNewReport) {
      onSubmitNewReport({
        isAnonymous: true,
        department: privacyChoice === 'optionA' ? 'Engineering' : 'Undisclosed',
        category: reportCategory,
        title: 'Repeated workload transfers and conflicting priorities',
        snippet: reportDescription,
        outcome: reportOutcome,
        referenceCode: 'ANON-4827',
      });
    }
    if (onShowToast) onShowToast('Your report has been submitted securely with reference ANON-4827.');
  };

  const handleCheckStatus = () => {
    if (searchRefCode.trim().toUpperCase() === 'ANON-4827') {
      if (isReportResolved) {
        setStatusResult({
          ref: 'ANON-4827',
          title: 'Repeated workload transfers and conflicting priorities',
          status: 'Resolved',
          lastUpdated: '20 October 2026',
          nextUpdate: 'Completed',
          response: `Thank you for raising this concern. We have reviewed workload allocation in Engineering and clarified task-ownership guidance for new hires. Your manager will also introduce a weekly check-in during your first 90 days.

Please continue to use Eko or submit feedback if similar issues occur.`,
        });
      } else {
        setStatusResult({
          ref: 'ANON-4827',
          title: 'Repeated workload transfers and conflicting priorities',
          status: 'Escalated for Review',
          lastUpdated: '20 October 2026',
          nextUpdate: '22 October 2026',
          response: `Thank you for raising this concern.

Your report has been assigned to an appropriate senior reviewer outside your direct reporting line. The review will examine task ownership, workload distribution, and how conflicting priorities are resolved.

We will track the agreed corrective actions and provide further updates through this reference code.

Your concern is being taken seriously. No conclusion has been reached about individual responsibility at this stage.`,
        });
      }
    } else {
      if (onShowToast) onShowToast('No active case found for that reference code. Try ANON-4827.');
    }
  };

  const handleOpenAddUpdate = (rec) => {
    setUpdateRecordTarget(rec);
    setNewUpdateText('');
    setShowAddUpdateModal(true);
  };

  const handleSaveAddUpdate = () => {
    if (!newUpdateText.trim() || !updateRecordTarget) return;

    const newUpdateItem = {
      id: Date.now(),
      date: 'Today, Just now',
      text: newUpdateText.trim(),
    };

    setSubmittedRecords((prev) =>
      prev.map((r) => {
        if (r.id === updateRecordTarget.id) {
          const updated = {
            ...r,
            updates: r.updates ? [...r.updates, newUpdateItem] : [newUpdateItem],
          };
          if (detailRecordTarget && detailRecordTarget.id === r.id) {
            setDetailRecordTarget(updated);
          }
          return updated;
        }
        return r;
      })
    );

    setShowAddUpdateModal(false);
    triggerSubmittedAlert(
      'update',
      'Update Appended to Case',
      `Your follow-up note has been added to ${updateRecordTarget.id}.`
    );
    if (onShowToast) onShowToast(`Follow-up note added to ${updateRecordTarget.id}.`);
  };

  const handleOpenRetract = (rec) => {
    setRetractRecordTarget(rec);
    setShowRetractModal(true);
  };

  const handleConfirmRetract = () => {
    if (!retractRecordTarget) return;

    setSubmittedRecords((prev) =>
      prev.map((r) => {
        if (r.id === retractRecordTarget.id) {
          const updated = {
            ...r,
            status: 'Withdrawn',
            resolutionStatus: 'Withdrawn',
            withdrawnNotice: 'Scheduled for permanent deletion after 30 days',
            updates: [
              ...(r.updates || []),
              {
                id: Date.now(),
                date: 'Today, Just now',
                text: 'Submission withdrawn by employee. Scheduled for permanent deletion after 30 days.',
              },
            ],
          };
          if (detailRecordTarget && detailRecordTarget.id === r.id) {
            setDetailRecordTarget(updated);
          }
          return updated;
        }
        return r;
      })
    );

    triggerSubmittedAlert(
      'retract',
      'Submission Withdrawn',
      `Record ${retractRecordTarget.displayId || retractRecordTarget.id} has been withdrawn. It has been removed from HR triage and will be permanently deleted after 30 days.`
    );
    if (onShowToast) onShowToast(`Submission marked as Withdrawn (scheduled for deletion in 30 days).`);

    setShowRetractModal(false);
  };

  return (
    <>
      {/* VIEW 1: AI ASSISTANT CHAT */}
      {activePage === 'emp_chat' && (
        <EkoChatView
          isManager={isManager}
          messages={messages}
          setMessages={setMessages}
          chatInput={chatInput}
          setChatInput={setChatInput}
          isTyping={isTyping}
          demoStep={demoStep}
          draftCopied={draftCopied}
          setDraftCopied={setDraftCopied}
          showResourcePreview={showResourcePreview}
          setShowResourcePreview={setShowResourcePreview}
          chatFileInputRef={chatFileInputRef}
          handleManagerQuickPrompt={handleManagerQuickPrompt}
          handleStartDemo={handleStartDemo}
          handleProceedToTurn3={handleProceedToTurn3}
          handleProceedToTurn5={handleProceedToTurn5}
          handleSendChat={handleSendChat}
          onShowToast={onShowToast}
          setVoiceTab={setVoiceTab}
          setActivePage={setActivePage}
          setHighlightPostId={setHighlightPostId}
        />
      )}

      {/* VIEW 2: COMPANY POLICIES & KNOWLEDGE BASE */}
      {activePage === 'emp_resources' && (
        <CompanyPoliciesView
          onAskEko={(prompt) => {
            askEkoQuestion(prompt);
          }}
          setActivePage={setActivePage}
        />
      )}

      {/* VIEW 3: VOICE & FEEDBACK HUB (3 Tabs: Feedback, Report, Pulse Survey) */}
      {activePage === 'emp_feedback' && (
        <EmployeeVoiceHub
          onOpenModal={(tab) => {
            setVoiceTab(tab);
            if (tab === 'feedback' || tab === 'report' || tab === 'pulse') {
              setActiveVoiceTab(tab);
            }
          }}
          submittedRecords={submittedRecords}
          submittedAlert={submittedAlert}
          setSubmittedAlert={setSubmittedAlert}
          onViewRecord={(rec) => setDetailRecordTarget(rec)}
          isReportResolved={isReportResolved}
          activeTab={activeVoiceTab}
          setActiveTab={setActiveVoiceTab}
        />
      )}

      {/* MODAL 1: CONFIDENTIAL REPORT */}
      <ConfidentialReportModal
        isOpen={voiceTab === 'report'}
        onClose={() => setVoiceTab(null)}
        reportCategory={reportCategory}
        setReportCategory={setReportCategory}
        reportDescription={reportDescription}
        setReportDescription={setReportDescription}
        reportOutcome={reportOutcome}
        setReportOutcome={setReportOutcome}
        privacyChoice={privacyChoice}
        setPrivacyChoice={setPrivacyChoice}
        privacyDropdownOpen={privacyDropdownOpen}
        setPrivacyDropdownOpen={setPrivacyDropdownOpen}
        privacyConsent={privacyConsent}
        setPrivacyConsent={setPrivacyConsent}
        onSubmit={handleReportSubmit}
      />

      {/* MODAL 2: PULSE SURVEY */}
      <PulseSurveyModal
        isOpen={voiceTab === 'pulse'}
        onClose={() => setVoiceTab(null)}
        pulseResponses={pulseResponses}
        setPulseResponses={setPulseResponses}
        pulseComment={pulseComment}
        setPulseComment={setPulseComment}
        pulseSubmittedSuccess={pulseSubmittedSuccess}
        setPulseSubmittedSuccess={setPulseSubmittedSuccess}
        onSubmit={handlePulseSubmit}
      />

      {/* MODAL 3: CONSTRUCTIVE FEEDBACK */}
      <ConstructiveFeedbackModal
        isOpen={voiceTab === 'feedback'}
        onClose={() => setVoiceTab(null)}
        feedbackCategory={feedbackCategory}
        setFeedbackCategory={setFeedbackCategory}
        feedbackScope={feedbackScope}
        setFeedbackScope={setFeedbackScope}
        feedbackTitle={feedbackTitle}
        setFeedbackTitle={setFeedbackTitle}
        feedbackMessage={feedbackMessage}
        setFeedbackMessage={setFeedbackMessage}
        feedbackOutcome={feedbackOutcome}
        setFeedbackOutcome={setFeedbackOutcome}
        feedbackAnonymous={feedbackAnonymous}
        setFeedbackAnonymous={setFeedbackAnonymous}
        onSubmit={handleFeedbackSubmit}
      />

      {/* MODAL 4: ANONYMOUS STATUS */}
      <AnonymousStatusModal
        isOpen={voiceTab === 'status'}
        onClose={() => setVoiceTab(null)}
        searchRefCode={searchRefCode}
        setSearchRefCode={setSearchRefCode}
        statusResult={statusResult}
        onCheckStatus={handleCheckStatus}
        onOpenFollowUp={() => setShowFollowUpModal(true)}
      />

      {/* MODAL: ADD UPDATE NOTE */}
      <AddUpdateModal
        isOpen={showAddUpdateModal}
        onClose={() => setShowAddUpdateModal(false)}
        updateRecordTarget={updateRecordTarget}
        newUpdateText={newUpdateText}
        setNewUpdateText={setNewUpdateText}
        onSave={handleSaveAddUpdate}
      />

      {/* MODAL: RETRACT RECORD */}
      <RetractRecordModal
        isOpen={showRetractModal}
        onClose={() => setShowRetractModal(false)}
        retractRecordTarget={retractRecordTarget}
        onConfirm={handleConfirmRetract}
      />

      {/* MODAL: SIMULATED FOLLOW UP */}
      <FollowUpModal
        isOpen={showFollowUpModal}
        onClose={() => setShowFollowUpModal(false)}
      />

      {/* MODAL: VIEW RECORD DETAILS */}
      <RecordDetailModal
        recordTarget={detailRecordTarget}
        onClose={() => setDetailRecordTarget(null)}
        isReportResolved={isReportResolved}
        recordPrivacyOpen={recordPrivacyOpen}
        setRecordPrivacyOpen={setRecordPrivacyOpen}
        onOpenAddUpdate={handleOpenAddUpdate}
        onOpenRetract={handleOpenRetract}
        onRetakeSurvey={() => {
          setDetailRecordTarget(null);
          setVoiceTab('pulse');
        }}
      />
    </>
  );
}
