import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import dataService from '../services/dataService';
import {
  COMPANY_POLICIES,
  INITIAL_UNANSWERED_QUESTIONS,
  INITIAL_KNOWLEDGE_FAQS,
} from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Core persona and navigation state
  const [userRole, setUserRole] = useState('employee'); // Default: Employee (Maya)
  const [activePage, setActivePage] = useState('emp_chat'); // Default: Maya's Eko Assistant
  const [department, setDepartment] = useState('all');
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedCatFilter, setSelectedCatFilter] = useState(null);

  // Global UI notification & modal states
  const [toastMessage, setToastMessage] = useState(null);
  const [modalState, setModalState] = useState({ isOpen: false, data: null });
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);

  // Ensure clean light mode
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('dark');
      localStorage.removeItem('echohr_dark_mode');
    }
  }, []);

  // Eko Chat History State
  const [isChatHistoryOpen, setIsChatHistoryOpen] = useState(false);
  const [activeChatSessionId, setActiveChatSessionId] = useState('session_sprint');
  const [newChatTrigger, setNewChatTrigger] = useState(0);
  const [loadSessionTrigger, setLoadSessionTrigger] = useState(null);
  const [pendingEkoQuestion, setPendingEkoQuestion] = useState(null);

  // Cross-role synchronization flags
  const [isAnnouncementPublished, setIsAnnouncementPublished] = useState(false);
  const [isReportResolved, setIsReportResolved] = useState(false);
  const [defaultVoiceTab, setDefaultVoiceTab] = useState(null);
  const [highlightPostId, setHighlightPostId] = useState(null);

  // Manager action workspace state (Action Plan AP-01)
  const initialActionPlan = dataService.getActionPlanAP01();
  const [actionState, setActionState] = useState({
    status: 'In progress',
    assignedManager: 'Daniel Lim, Engineering Manager',
    actionsTaken: initialActionPlan.actionsTaken || '',
    nextStep: initialActionPlan.nextStep || '',
    managerSubmitted: false,
  });

  // Action Plans list and navigation state for Actions & Follow-up page
  const [actionPlans, setActionPlans] = useState(() => dataService.getActionPlans());
  const [selectedActionPlanId, setSelectedActionPlanId] = useState('AP-01');
  const [expandedConcernId, setExpandedConcernId] = useState(null);
  const [evidenceModalConcern, setEvidenceModalConcern] = useState(null);

  // HR Company Resources & Knowledge Base State
  const [companyPolicies, setCompanyPolicies] = useState(() => COMPANY_POLICIES);
  const [unansweredQuestions, setUnansweredQuestions] = useState(() => INITIAL_UNANSWERED_QUESTIONS);
  const [knowledgeFaqs, setKnowledgeFaqs] = useState(() => INITIAL_KNOWLEDGE_FAQS);

  // Toast Notification dispatcher
  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  }, []);

  // Multi-role persona switcher with automatic view redirection
  const handleRoleChange = useCallback((role) => {
    setUserRole(role);
    if (role === 'employee') {
      if (activePage !== 'community') {
        setActivePage('emp_chat');
      }
    } else if (role === 'manager') {
      if (activePage !== 'community' && !activePage.startsWith('emp_')) {
        setActivePage('manager_workspace');
      }
    } else {
      if (activePage.startsWith('emp_') || activePage === 'manager_workspace') {
        setActivePage('dashboard');
      }
    }
  }, [activePage]);

  // Department selector helper
  const handleDepartmentChange = useCallback((deptKey) => {
    setDepartment(deptKey);
    const deptInfo = dataService.getDepartmentData(deptKey);
    showToast(
      deptKey === 'all'
        ? 'Switched to Organizational View (All Departments)'
        : `Switched to ${deptInfo?.name || deptKey} Department`
    );
  }, [showToast]);

  // Eko Chat History Actions
  const startNewChat = useCallback(() => {
    setActiveChatSessionId('new');
    setNewChatTrigger(Date.now());
    setIsChatHistoryOpen(false);
    showToast('Started a new conversation with Eko');
  }, [showToast]);

  const loadChatSession = useCallback((session) => {
    setActiveChatSessionId(session.id);
    setLoadSessionTrigger(session);
    setIsChatHistoryOpen(false);
    showToast(`Loaded: ${session.title}`);
  }, [showToast]);

  const askEkoQuestion = useCallback((questionText) => {
    setActivePage('emp_chat');
    setPendingEkoQuestion(questionText);
  }, []);

  // Modal interaction handlers
  const handleLaunchPlan = useCallback((item, category) => {
    setModalState({
      isOpen: true,
      data: { type: 'intervention', item, category },
    });
  }, []);

  const handleReviewReport = useCallback((report, category) => {
    setModalState({
      isOpen: true,
      data: { type: 'report', item: report, category },
    });
  }, []);

  const handleConfirmModal = useCallback(({ type, item, statusVal, actionOwner, deadline, priority, actions }) => {
    if (type === 'intervention') {
      showToast(`Action plan assigned for "${item?.title || 'Selected Concern'}"`);
      // Update actionPlans state or create new action plan
      setActionPlans((prev) => {
        const existingIdx = prev.findIndex((p) => p.linkedConcern === item?.id);
        if (existingIdx >= 0) {
          const updated = [...prev];
          updated[existingIdx] = {
            ...updated[existingIdx],
            status: 'In progress',
            owner: actionOwner ? actionOwner.split('—')[0].trim() : updated[existingIdx].owner,
            due: deadline || updated[existingIdx].due,
            dueDate: deadline || updated[existingIdx].dueDate,
            priority: priority || updated[existingIdx].priority,
          };
          return updated;
        } else {
          const newId = `AP-0${prev.length + 1}`;
          const newPlan = {
            id: newId,
            title: `Implement corrective actions for ${item?.title || 'concern'}`,
            linkedConcern: item?.id || 'CON-01',
            linkedConcernTitle: item?.title || 'Burnout & Workload Imbalance',
            linkedReport: 'R004',
            priority: priority || item?.priority || 'High',
            owner: actionOwner ? actionOwner.split('—')[0].trim() : 'Daniel Lim',
            department: item?.departmentsAffected?.[0]?.split(' ')[0] || 'Engineering',
            due: deadline || '30 Oct 2026',
            dueDate: deadline || '30 Oct 2026',
            status: 'In progress',
            progress: 25,
            lastUpdate: 'Just now',
            created: '23 Oct 2026',
            anonymizedSummary: item?.description || 'Newly assigned action plan.',
            managerUpdate: 'Action plan created by HR. Awaiting initial manager check-in.',
            managerUpdateDate: 'Just now',
            outcomeTracking: {
              ekoAiPatterns: { label: 'Related EkoAI patterns', trend: 'Baseline recorded', change: 'Monitoring', status: 'In Review', details: 'Initial baseline tracked.' },
              newReports: { label: 'New related reports', trend: '0 new reports', change: 'Clear', status: 'Safe Range', details: 'Zero reports since creation.' },
              communityActivity: { label: 'Community board activity', trend: 'Monitoring', change: 'Neutral', details: 'Tracking discussions.' },
              pulseTrend: { label: 'Pulse survey trend', trend: 'Initial 2.8 / 5', change: 'Base', status: 'In Review', details: 'Awaiting next weekly pulse.' },
              operationalIndicators: { label: 'Operational indicators', trend: 'Overtime +18%', change: 'Targeted', status: 'In Progress', details: 'Tracking JIRO and overtime metrics.' },
            },
            actionItems: actions && actions.length > 0 ? actions.map((a, i) => ({
              id: `ACT-NEW-${i + 1}`,
              title: a.text,
              owner: actionOwner ? actionOwner.split('—')[0].trim() : 'Daniel Lim',
              due: deadline || '30 Oct 2026',
              completed: false,
              status: 'In progress',
            })) : [
              { id: 'ACT-NEW-1', title: 'Review task allocation and handoffs', owner: 'Daniel Lim', due: deadline || '30 Oct 2026', completed: false, status: 'In progress' }
            ],
          };
          return [newPlan, ...prev];
        }
      });
    } else {
      if (item) {
        item.status = statusVal;
      }
      showToast(`Report ${item?.id} status updated to "${statusVal}"`);
    }
  }, [showToast]);

  const updateActionState = useCallback((newState) => {
    setActionState((prev) => ({ ...prev, ...newState }));
  }, []);

  const handleNewReportSubmit = useCallback((reportData) => {
    const newReport = dataService.submitNewReport(reportData);
    showToast(`Report ${newReport.id} logged and routed to HR Triage`);
  }, [showToast]);

  const navigateTo = useCallback((page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Action plan specific handlers
  const handleApproveActionPlan = useCallback((planId) => {
    setActionPlans((prev) =>
      prev.map((p) =>
        p.id === planId
          ? {
              ...p,
              status: 'Monitoring',
              progress: Math.max(p.progress, 75),
              lastUpdate: 'Approved just now by HR',
            }
          : p
      )
    );
    showToast(`Action plan ${planId} approved and moved to 30-day monitoring.`);
  }, [showToast]);

  const handleRequestRevision = useCallback((planId) => {
    setActionPlans((prev) =>
      prev.map((p) =>
        p.id === planId
          ? {
              ...p,
              status: 'Awaiting manager update',
              lastUpdate: 'Revision requested just now',
            }
          : p
      )
    );
    showToast(`Revision request sent to manager for ${planId}.`);
  }, [showToast]);

  const handleEscalateActionPlan = useCallback((planId) => {
    setActionPlans((prev) =>
      prev.map((p) =>
        p.id === planId
          ? {
              ...p,
              status: 'Escalated',
              priority: 'High',
              lastUpdate: 'Escalated just now to Head of Department',
            }
          : p
      )
    );
    showToast(`Action plan ${planId} escalated to Head of Department.`);
  }, [showToast]);

  const handleSendReminder = useCallback((planId, ownerName) => {
    showToast(`Follow-up reminder sent to ${ownerName || 'manager'} for ${planId}.`);
  }, [showToast]);

  // Cross-navigation from Actions & Follow-up to Concern card or Evidence Modal
  const handleNavigateToConcern = useCallback((concernId, openEvidence = false) => {
    const allConcerns = dataService.getDepartmentData('all').priorityConcerns || [];
    const targetConcern = allConcerns.find((c) => c.id === concernId || c.code === concernId);
    
    if (openEvidence && targetConcern) {
      setEvidenceModalConcern(targetConcern);
    } else {
      setActivePage('dashboard');
      setExpandedConcernId(concernId);
      window.scrollTo({ top: 400, behavior: 'smooth' });
      showToast(`Navigated to Dashboard concern ${concernId}`);
    }
  }, [showToast]);

  // Cross-navigation from Dashboard concern strip to Actions page
  const handleNavigateToActionPlan = useCallback((planId) => {
    setSelectedActionPlanId(planId || 'AP-01');
    setActivePage('actions');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Navigated to Action Plan ${planId || 'AP-01'}`);
  }, [showToast]);

  // HR Knowledge Base & Policy Management Handlers
  const handleUpdatePolicy = useCallback((updatedPolicy) => {
    setCompanyPolicies((prev) => {
      const exists = prev.some((p) => p.id === updatedPolicy.id);
      if (exists) {
        return prev.map((p) => (p.id === updatedPolicy.id ? updatedPolicy : p));
      }
      return [updatedPolicy, ...prev];
    });
    showToast(`Policy ${updatedPolicy.id} updated and synced with Eko AI.`);
  }, [showToast]);

  const handleAnswerQuestion = useCallback((questionId, officialAnswer, linkedPolicyId) => {
    let targetQuestionTitle = '';
    setUnansweredQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          targetQuestionTitle = q.question;
          return {
            ...q,
            status: 'answered',
            hrAnswer: officialAnswer,
            answeredBy: 'Sarah Jenkins (Senior HR Partner)',
            answeredDate: 'Just now',
            linkedPolicyId: linkedPolicyId || q.linkedPolicyId || 'HR-POL-014',
          };
        }
        return q;
      })
    );

    // Auto-publish to verified knowledge FAQs for Eko
    setKnowledgeFaqs((prev) => [
      {
        id: `KB-${Date.now().toString().slice(-4)}`,
        question: targetQuestionTitle || 'Employee Query',
        answer: officialAnswer,
        category: 'workload',
        policyId: linkedPolicyId || 'HR-POL-014',
        lastUpdated: 'Just now',
        verifiedBy: 'Sarah Jenkins (HR Partner)',
      },
      ...prev,
    ]);

    showToast('Official answer published to Eko AI Knowledge Base!');
  }, [showToast]);

  const handleSaveKnowledgeFaq = useCallback((faq) => {
    setKnowledgeFaqs((prev) => {
      const exists = prev.some((f) => f.id === faq.id);
      if (exists) {
        return prev.map((f) => (f.id === faq.id ? faq : f));
      }
      return [faq, ...prev];
    });
    showToast('Knowledge item saved & published to Eko AI.');
  }, [showToast]);

  const handleDeleteKnowledgeFaq = useCallback((faqId) => {
    setKnowledgeFaqs((prev) => prev.filter((f) => f.id !== faqId));
    showToast('Knowledge item removed from Eko reference.');
  }, [showToast]);

  // Action Plan updater for directly editing and tracking plans
  const handleUpdateActionPlan = useCallback((updatedPlan) => {
    setActionPlans((prev) =>
      prev.map((p) => (p.id === updatedPlan.id ? { ...p, ...updatedPlan } : p))
    );
    showToast(`Action plan ${updatedPlan.id} changes saved successfully.`);
  }, [showToast]);

  // Derived memoized data getters
  const currentDeptData = useMemo(() => {
    return dataService.getDepartmentData(department);
  }, [department]);

  const allReports = useMemo(() => {
    return dataService.getAllReports();
  }, [department, modalState]);

  const filteredConcerns = useMemo(() => {
    return currentDeptData.priorityConcerns || [];
  }, [currentDeptData]);

  const filteredReports = useMemo(() => {
    return currentDeptData.reports || [];
  }, [currentDeptData]);

  const value = {
    // Role & Navigation
    userRole,
    setUserRole,
    handleRoleChange,
    activePage,
    setActivePage,
    navigateTo,
    department,
    setDepartment,
    handleDepartmentChange,
    isMinimized,
    setIsMinimized,
    selectedCatFilter,
    setSelectedCatFilter,

    // Feedback & UI State
    toastMessage,
    showToast,
    modalState,
    setModalState,
    handleLaunchPlan,
    handleReviewReport,
    handleConfirmModal,
    isAiDrawerOpen,
    setIsAiDrawerOpen,

    // Eko Chat History
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
    askEkoQuestion,

    // Cross-role coordination
    isAnnouncementPublished,
    setIsAnnouncementPublished,
    isReportResolved,
    setIsReportResolved,
    defaultVoiceTab,
    setDefaultVoiceTab,
    highlightPostId,
    setHighlightPostId,
    actionState,
    setActionState,
    updateActionState,
    handleNewReportSubmit,

    // Action Plans (Actions & Follow-up page)
    actionPlans,
    setActionPlans,
    selectedActionPlanId,
    setSelectedActionPlanId,
    expandedConcernId,
    setExpandedConcernId,
    evidenceModalConcern,
    setEvidenceModalConcern,
    handleApproveActionPlan,
    handleRequestRevision,
    handleEscalateActionPlan,
    handleSendReminder,
    handleNavigateToConcern,
    handleNavigateToActionPlan,
    handleUpdateActionPlan,

    // HR Company Resources & Knowledge Base
    companyPolicies,
    setCompanyPolicies,
    unansweredQuestions,
    setUnansweredQuestions,
    knowledgeFaqs,
    setKnowledgeFaqs,
    handleUpdatePolicy,
    handleAnswerQuestion,
    handleSaveKnowledgeFaq,
    handleDeleteKnowledgeFaq,

    // Data models
    currentDeptData,
    allReports,
    filteredConcerns,
    filteredReports,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default AppContext;
