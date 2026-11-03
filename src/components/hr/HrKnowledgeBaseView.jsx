import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Sparkles,
  Plus,
  Edit3,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  FileText,
  Clock,
  ShieldCheck,
  Send,
  X,
  ChevronRight,
  Filter,
  ArrowRight,
  Bot,
  Trash2,
  Check,
  Building2,
  Tag,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function HrKnowledgeBaseView() {
  const {
    companyPolicies,
    unansweredQuestions,
    knowledgeFaqs,
    handleUpdatePolicy,
    handleAnswerQuestion,
    handleSaveKnowledgeFaq,
    handleDeleteKnowledgeFaq,
    showToast,
    setActivePage,
  } = useApp();

  // Navigation Tabs: 'policies' | 'unanswered' | 'faqs'
  const [activeTab, setActiveTab] = useState('policies');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Policy Modal state for Add/Edit
  const [policyModalOpen, setPolicyModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [policyForm, setPolicyForm] = useState({
    id: '',
    title: '',
    category: 'workload',
    categoryLabel: 'Workload & Hours',
    version: 'v1.0',
    effectiveDate: '01 Nov 2026',
    summary: '',
    ekoUsage: '',
    keyGuidelines: [{ clause: '', text: '' }],
  });

  // Answer Modal / Drawer for Unanswered Questions
  const [answeringQuestion, setAnsweringQuestion] = useState(null);
  const [answerDraft, setAnswerDraft] = useState('');
  const [selectedPolicyForAnswer, setSelectedPolicyForAnswer] = useState('HR-POL-014');

  // Q&A Edit Modal state
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [faqForm, setFaqForm] = useState({
    id: '',
    question: '',
    answer: '',
    category: 'workload',
    policyId: 'HR-POL-014',
  });

  // Category filter options
  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'workload', label: 'Workload & Hours' },
    { id: 'task_ownership', label: 'Task Ownership & Escalation' },
    { id: 'grievance', label: 'Safety & Grievance' },
    { id: 'mentorship', label: 'Mentorship & Growth' },
    { id: 'wellbeing', label: 'Wellbeing & Health' },
  ];

  // Filtered Policies
  const filteredPolicies = useMemo(() => {
    return companyPolicies.filter((policy) => {
      const matchCat = selectedCategory === 'all' || policy.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        policy.title?.toLowerCase().includes(q) ||
        policy.id?.toLowerCase().includes(q) ||
        policy.summary?.toLowerCase().includes(q) ||
        policy.keyGuidelines?.some((g) => g.text.toLowerCase().includes(q) || g.clause.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }, [companyPolicies, selectedCategory, searchQuery]);

  // Filtered Unanswered Questions
  const filteredQuestions = useMemo(() => {
    return unansweredQuestions.filter((qItem) => {
      const matchCat = selectedCategory === 'all' || qItem.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        qItem.question?.toLowerCase().includes(q) ||
        qItem.askedBy?.toLowerCase().includes(q) ||
        qItem.hrAnswer?.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [unansweredQuestions, selectedCategory, searchQuery]);

  // Filtered Knowledge FAQs
  const filteredFaqs = useMemo(() => {
    return knowledgeFaqs.filter((faq) => {
      const matchCat = selectedCategory === 'all' || faq.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        faq.question?.toLowerCase().includes(q) ||
        faq.answer?.toLowerCase().includes(q) ||
        faq.id?.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [knowledgeFaqs, selectedCategory, searchQuery]);

  const pendingQuestionsCount = unansweredQuestions.filter((q) => q.status === 'pending').length;

  // Open Policy Modal for Add or Edit
  const openPolicyModal = (policy = null) => {
    if (policy) {
      setEditingPolicy(policy);
      setPolicyForm({
        id: policy.id,
        title: policy.title,
        category: policy.category,
        categoryLabel: policy.categoryLabel || 'General',
        version: policy.version || 'v1.0',
        effectiveDate: policy.effectiveDate || '01 Nov 2026',
        summary: policy.summary || '',
        ekoUsage: policy.ekoUsage || '',
        keyGuidelines: policy.keyGuidelines?.length ? [...policy.keyGuidelines] : [{ clause: '', text: '' }],
      });
    } else {
      setEditingPolicy(null);
      setPolicyForm({
        id: `HR-POL-0${companyPolicies.length + 15}`,
        title: '',
        category: 'workload',
        categoryLabel: 'Workload & Hours',
        version: 'v1.0',
        effectiveDate: '01 Nov 2026',
        summary: '',
        ekoUsage: 'Eko AI references this policy to answer questions regarding company norms.',
        keyGuidelines: [{ clause: 'Clause 1.1', text: '' }],
      });
    }
    setPolicyModalOpen(true);
  };

  const handleSavePolicySubmit = (e) => {
    e.preventDefault();
    if (!policyForm.title.trim()) {
      showToast('Please enter a policy title.');
      return;
    }
    const catObj = categories.find((c) => c.id === policyForm.category);
    const updatedPolicy = {
      ...policyForm,
      categoryLabel: catObj ? catObj.label : 'General',
      lastUpdated: 'Just now',
    };
    handleUpdatePolicy(updatedPolicy);
    setPolicyModalOpen(false);
  };

  // Submit Answer to Unanswered Question
  const handlePublishAnswer = () => {
    if (!answerDraft.trim()) {
      showToast('Please type an official answer before publishing.');
      return;
    }
    if (answeringQuestion) {
      handleAnswerQuestion(answeringQuestion.id, answerDraft, selectedPolicyForAnswer);
      setAnsweringQuestion(null);
      setAnswerDraft('');
    }
  };

  // Open Q&A Modal
  const openFaqModal = (faq = null) => {
    if (faq) {
      setEditingFaq(faq);
      setFaqForm({ ...faq });
    } else {
      setEditingFaq(null);
      setFaqForm({
        id: `KB-${Date.now().toString().slice(-4)}`,
        question: '',
        answer: '',
        category: 'workload',
        policyId: 'HR-POL-014',
      });
    }
    setFaqModalOpen(true);
  };

  const handleSaveFaqSubmit = (e) => {
    e.preventDefault();
    if (!faqForm.question.trim() || !faqForm.answer.trim()) {
      showToast('Please enter both question and answer.');
      return;
    }
    handleSaveKnowledgeFaq({
      ...faqForm,
      lastUpdated: 'Just now',
      verifiedBy: 'Sarah Jenkins (HR Partner)',
    });
    setFaqModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* 1. HERO BANNER */}
      <div className="bg-gradient-to-r from-white via-indigo-50/50 to-[#EEF0FF]/60 border border-[#EBECEF] rounded-3xl p-6 sm:p-8 shadow-card relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-[#5455EE]/10 text-[#5455EE] text-xs font-medium leading-[18px] flex items-center gap-1.5 border border-[#5455EE]/20">
                <Sparkles size={13} />
                HR Knowledge Base & Policy Governance
              </span>
              <span className="text-xs text-slate-500 font-normal hidden sm:inline">
                Powers Eko AI Responses
              </span>
            </div>
            <p className="text-sm font-normal text-slate-600 mt-1 leading-[22px]">
              Maintain verified company policies, answer newly escalated employee questions, and train Eko AI to address workplace friction with accurate, empathetic answers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => openPolicyModal(null)}
              className="px-4 py-2.5 rounded-2xl bg-[#5455EE] hover:bg-[#4344dd] text-white text-sm font-medium leading-5 transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Plus size={15} />
              <span>Add New Policy</span>
            </button>
            <button
              type="button"
              onClick={() => openFaqModal(null)}
              className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-[#EBECEF] text-sm font-medium leading-5 transition-all shadow-2xs flex items-center gap-2 cursor-pointer"
            >
              <HelpCircle size={15} className="text-[#5455EE]" />
              <span>Add Q&A Entry</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. STATS ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Stat 1: Verified Policies */}
        <div className="bg-white rounded-3xl p-5 border border-[#EBECEF] shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
              Active Policies
            </span>
            <div className="text-2xl sm:text-[30px] font-semibold text-slate-900 mt-1 leading-9 tabular-nums">
              {companyPolicies.length}
            </div>
            <span className="text-xs text-emerald-600 font-medium leading-[18px] flex items-center gap-1 mt-0.5">
              <CheckCircle2 size={12} />
              All Verified
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-[#EEF0FF] text-[#5455EE] flex items-center justify-center">
            <BookOpen size={18} />
          </div>
        </div>

        {/* Stat 2: Unanswered Questions Queue */}
        <div className="bg-white rounded-3xl p-5 border border-[#EBECEF] shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
              Unanswered Questions
            </span>
            <div className="text-2xl sm:text-[30px] font-semibold text-amber-800 mt-1 leading-9 tabular-nums">
              {pendingQuestionsCount}
            </div>
            <span className="text-xs text-amber-800 font-medium leading-[18px] flex items-center gap-1 mt-0.5">
              <AlertCircle size={12} />
              Needs HR Policy Answer
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center">
            <Bot size={18} />
          </div>
        </div>

        {/* Stat 3: Verified Eko Q&A pairs */}
        <div className="bg-white rounded-3xl p-5 border border-[#EBECEF] shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
              Eko Knowledge Index
            </span>
            <div className="text-2xl sm:text-[30px] font-semibold text-slate-900 mt-1 leading-9 tabular-nums">
              {knowledgeFaqs.length}
            </div>
            <span className="text-xs text-slate-500 font-normal leading-[18px] mt-0.5 block">
              Instant retrieval pairs
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-[#5455EE] flex items-center justify-center">
            <Sparkles size={18} />
          </div>
        </div>

        {/* Stat 4: Accuracy & Coverage */}
        <div className="bg-white rounded-3xl p-5 border border-[#EBECEF] shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
              AI Answer Coverage
            </span>
            <div className="text-2xl sm:text-[30px] font-semibold text-emerald-600 mt-1 leading-9 tabular-nums">
              96.4%
            </div>
            <span className="text-xs text-slate-500 font-normal leading-[18px] mt-0.5 block">
              +4.2% since last sprint
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck size={18} />
          </div>
        </div>
      </div>

      {/* 3. CONTROLS: TABS, SEARCH & CATEGORY FILTER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EBECEF] pb-3">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('policies')}
            className={`px-4 py-2.5 rounded-2xl text-sm font-medium leading-5 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'policies'
                ? 'bg-[#5455EE] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-[#EBECEF]'
            }`}
          >
            <BookOpen size={14} />
            <span>Company Policies & SOPs ({companyPolicies.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('unanswered')}
            className={`px-4 py-2.5 rounded-2xl text-sm font-medium leading-5 transition-all cursor-pointer flex items-center gap-2 relative ${
              activeTab === 'unanswered'
                ? 'bg-[#5455EE] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-[#EBECEF]'
            }`}
          >
            <Bot size={14} />
            <span>Unanswered Questions</span>
            {pendingQuestionsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-800 text-white shadow-2xs leading-[18px]">
                {pendingQuestionsCount} New
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('faqs')}
            className={`px-4 py-2.5 rounded-2xl text-sm font-medium leading-5 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'faqs'
                ? 'bg-[#5455EE] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-[#EBECEF]'
            }`}
          >
            <HelpCircle size={14} />
            <span>Verified Q&A Index ({knowledgeFaqs.length})</span>
          </button>
        </div>

        {/* Search & Category filter */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-64">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search policies or questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#EBECEF] rounded-2xl pl-9 pr-3.5 py-2 text-sm font-normal text-slate-800 placeholder-slate-400 outline-none focus:border-[#5455EE] transition-all shadow-2xs leading-5"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white border border-[#EBECEF] rounded-2xl px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-[#5455EE] cursor-pointer shadow-2xs leading-5"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. TAB CONTENT */}

      {/* TAB 1: COMPANY POLICIES & SOPS */}
      {activeTab === 'policies' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredPolicies.map((policy) => (
            <div
              key={policy.id}
              className="bg-white border border-[#EBECEF] rounded-3xl p-6 shadow-card hover:border-[#5455EE]/40 transition-all flex flex-col justify-between gap-4 group"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-medium text-[#5455EE] bg-[#EEF0FF] px-2.5 py-0.5 rounded-md border border-[#5455EE]/20 tracking-wider">
                      {policy.id}
                    </span>
                    <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md leading-[18px]">
                      {policy.version}
                    </span>
                    <span className="text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded-full leading-[18px]">
                      {policy.categoryLabel || policy.category}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => openPolicyModal(policy)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-[#5455EE] hover:bg-[#EEF0FF] transition-all cursor-pointer"
                    title="Edit Policy"
                  >
                    <Edit3 size={15} />
                  </button>
                </div>

                <h3 className="text-lg font-semibold leading-[26px] text-slate-900 group-hover:text-[#5455EE] transition-colors">
                  {policy.title}
                </h3>

                <p className="text-sm font-normal leading-[22px] text-slate-600">
                  {policy.summary}
                </p>

                {/* Eko AI usage notice */}
                <div className="p-3.5 rounded-2xl bg-[#F8F9FD] border border-slate-200 flex items-start gap-2.5 text-[13px] leading-5 text-slate-700">
                  <Sparkles size={14} className="text-[#5455EE] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900">How Eko references this:</span>
                    <p className="text-[13px] font-normal text-slate-600 mt-0.5 leading-5">
                      {policy.ekoUsage}
                    </p>
                  </div>
                </div>

                {/* Key Clauses */}
                {policy.keyGuidelines && policy.keyGuidelines.length > 0 && (
                  <div className="flex flex-col gap-2 mt-1">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider leading-[18px]">
                      Key Standard Clauses ({policy.keyGuidelines.length})
                    </span>
                    <div className="flex flex-col gap-2">
                      {policy.keyGuidelines.slice(0, 3).map((clause, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1"
                        >
                          <span className="text-sm font-semibold leading-[22px] text-[#5455EE]">
                            {clause.clause}
                          </span>
                          <span className="text-sm font-normal leading-[22px] text-slate-600">
                            {clause.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-normal leading-[18px] text-slate-500">
                <span>Updated: {policy.lastUpdated}</span>
                <button
                  type="button"
                  onClick={() => openPolicyModal(policy)}
                  className="text-sm font-medium leading-5 text-[#5455EE] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Edit Policy & Clauses</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: UNANSWERED EMPLOYEE QUESTIONS (AI ESCALATIONS) */}
      {activeTab === 'unanswered' && (
        <div className="flex flex-col gap-5">
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-3 text-amber-950">
            <AlertCircle size={18} className="text-amber-800 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-sm font-semibold leading-5 text-amber-900">Autonomous Question Escalation Queue</span>
              <p className="text-sm font-normal text-amber-900/90 mt-1 leading-[22px]">
                When employees ask Eko questions that have never been asked before or where company policies lack coverage, Eko flags them here. Providing an official HR answer immediately trains Eko AI and updates company knowledge for all employees.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {filteredQuestions.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#EBECEF] rounded-3xl p-6 shadow-card flex flex-col gap-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md tracking-wider">
                      {item.id}
                    </span>
                    <span className="text-sm font-medium leading-5 text-slate-800">{item.askedBy}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs font-normal leading-[18px] text-slate-500 flex items-center gap-1">
                      <Clock size={12} />
                      {item.askedDate}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full">
                      {item.categoryLabel || item.category}
                    </span>
                  </div>

                  <span
                    className={`self-start sm:self-auto px-3 py-1 rounded-full text-xs font-medium leading-[18px] border ${
                      item.status === 'answered'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {item.status === 'answered' ? 'Published to Eko AI ✓' : 'Awaiting HR Answer'}
                  </span>
                </div>

                {/* Question */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#EEF0FF] text-[#5455EE] flex items-center justify-center flex-shrink-0 font-semibold text-sm">
                    Q
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-semibold leading-6 text-slate-900">
                      "{item.question}"
                    </h4>
                    <p className="text-xs font-normal leading-[18px] text-slate-500 mt-1">
                      Diagnostic: {item.aiDiagnosis}
                    </p>
                  </div>
                </div>

                {/* If Answered: show the answer */}
                {item.status === 'answered' && (
                  <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold leading-[18px] text-emerald-800 flex items-center gap-1.5">
                        <CheckCircle2 size={14} className="text-emerald-600" />
                        <span>Official HR Policy Answer (Live in Eko Knowledge Base)</span>
                      </span>
                      <span className="text-xs font-normal leading-[18px] text-slate-500">
                        Answered by {item.answeredBy} · {item.answeredDate}
                      </span>
                    </div>
                    <p className="text-sm font-normal leading-[22px] text-slate-800">
                      "{item.hrAnswer}"
                    </p>
                  </div>
                )}

                {/* If Pending: Action to Answer */}
                {item.status === 'pending' && (
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-normal leading-[18px] text-slate-500">
                      AI is waiting for HR input before confirming guidance to employees.
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setAnsweringQuestion(item);
                        setAnswerDraft('');
                        setSelectedPolicyForAnswer(item.linkedPolicyId || 'HR-POL-014');
                      }}
                      className="px-4 py-2 rounded-xl bg-[#5455EE] hover:bg-[#4344dd] text-white text-sm font-medium leading-5 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 size={13} />
                      <span>Provide Official HR Answer</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: VERIFIED Q&A INDEX */}
      {activeTab === 'faqs' && (
        <div className="bg-white border border-[#EBECEF] rounded-3xl p-6 shadow-card flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold leading-6 text-slate-900">
                Verified Eko AI Q&A Index
              </h3>
              <p className="text-xs font-normal leading-[18px] text-slate-500 mt-0.5">
                Eko references these precise question-answer pairs to give fast, deterministic answers.
              </p>
            </div>
            <button
              type="button"
              onClick={() => openFaqModal(null)}
              className="px-3.5 py-2 rounded-xl bg-[#5455EE] text-white text-sm font-medium leading-5 hover:bg-[#4344dd] transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Knowledge Pair</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredFaqs.map((faq) => (
              <div key={faq.id} className="py-4 flex flex-col gap-2 group">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded tracking-wider">
                      {faq.id}
                    </span>
                    <span className="text-xs font-medium leading-[18px] text-[#5455EE] bg-[#EEF0FF] px-2 py-0.5 rounded-full">
                      {faq.policyId}
                    </span>
                    <span className="text-xs font-normal leading-[18px] text-slate-400">Verified by {faq.verifiedBy}</span>
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => openFaqModal(faq)}
                      className="p-1.5 text-slate-400 hover:text-[#5455EE] hover:bg-slate-100 rounded-lg cursor-pointer"
                      title="Edit"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteKnowledgeFaq(faq.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <h4 className="text-base font-semibold leading-6 text-slate-900">
                  {faq.question}
                </h4>
                <p className="text-sm font-normal leading-[22px] text-slate-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. MODALS */}

      {/* ANSWER QUESTION DRAWER / MODAL */}
      {answeringQuestion && (
        <div
          onClick={() => setAnsweringQuestion(null)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 flex flex-col gap-5 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#EEF0FF] text-[#5455EE] flex items-center justify-center">
                  <Bot size={16} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold leading-7 text-slate-900">
                    Provide Official HR Answer
                  </h3>
                  <span className="text-[13px] font-normal leading-5 text-slate-500">
                    Publishing immediately incorporates this into Eko's knowledge base
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAnsweringQuestion(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500 leading-[18px]">
                Employee Question:
              </span>
              <p className="text-sm font-semibold leading-[22px] text-slate-800">
                "{answeringQuestion.question}"
              </p>
              <span className="text-xs font-normal leading-[18px] text-slate-500 mt-0.5">
                Asked by: {answeringQuestion.askedBy}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium leading-5 text-slate-700">
                Link to Company Policy:
              </label>
              <select
                value={selectedPolicyForAnswer}
                onChange={(e) => setSelectedPolicyForAnswer(e.target.value)}
                className="p-2.5 rounded-xl border border-[#EBECEF] bg-[#F8F9FD] text-sm font-normal text-slate-800 outline-none focus:border-[#5455EE] leading-5"
              >
                {companyPolicies.map((pol) => (
                  <option key={pol.id} value={pol.id}>
                    {pol.id} — {pol.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium leading-5 text-slate-700">
                Official HR Answer & Guidance:
              </label>
              <textarea
                rows={5}
                value={answerDraft}
                onChange={(e) => setAnswerDraft(e.target.value)}
                placeholder="Type the formal policy answer that Eko AI should provide when an employee asks this question..."
                className="w-full p-3.5 rounded-2xl border border-[#EBECEF] bg-[#F8F9FD] text-sm font-normal text-slate-900 placeholder-slate-400 outline-none focus:border-[#5455EE] focus:bg-white transition-all resize-none leading-[22px]"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setAnsweringQuestion(null)}
                className="px-4 py-2 rounded-xl text-sm font-medium leading-5 text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePublishAnswer}
                className="px-5 py-2.5 rounded-xl bg-[#5455EE] hover:bg-[#4344dd] text-white text-sm font-medium leading-5 transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles size={14} />
                <span>Publish to Eko AI Knowledge Base</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POLICY ADD/EDIT MODAL */}
      {policyModalOpen && (
        <div
          onClick={() => setPolicyModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 border border-slate-200 flex flex-col gap-5 my-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#EEF0FF] text-[#5455EE] flex items-center justify-center">
                  <BookOpen size={16} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold leading-7 text-slate-900">
                    {editingPolicy ? `Edit Policy ${editingPolicy.id}` : 'Create New Company Policy'}
                  </h3>
                  <span className="text-[13px] font-normal leading-5 text-slate-500">
                    Policy standards are directly referenced by Eko AI when diagnosing workplace friction
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPolicyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSavePolicySubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium leading-5 text-slate-700">Policy Code / ID</label>
                  <input
                    type="text"
                    value={policyForm.id}
                    onChange={(e) => setPolicyForm({ ...policyForm, id: e.target.value })}
                    className="p-2.5 rounded-xl border border-[#EBECEF] bg-[#F8F9FD] text-sm font-normal text-slate-800 outline-none focus:border-[#5455EE]"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium leading-5 text-slate-700">Category</label>
                  <select
                    value={policyForm.category}
                    onChange={(e) => setPolicyForm({ ...policyForm, category: e.target.value })}
                    className="p-2.5 rounded-xl border border-[#EBECEF] bg-[#F8F9FD] text-sm font-normal text-slate-800 outline-none focus:border-[#5455EE]"
                  >
                    <option value="workload">Workload & Hours</option>
                    <option value="task_ownership">Task Ownership & Escalation</option>
                    <option value="grievance">Safety & Grievance</option>
                    <option value="mentorship">Mentorship & Growth</option>
                    <option value="wellbeing">Wellbeing & Health</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium leading-5 text-slate-700">Policy Title</label>
                <input
                  type="text"
                  value={policyForm.title}
                  onChange={(e) => setPolicyForm({ ...policyForm, title: e.target.value })}
                  placeholder="e.g. Workload Allocation, Overtime & Task Delegation Policy"
                  className="p-2.5 rounded-xl border border-[#EBECEF] bg-[#F8F9FD] text-sm font-normal text-slate-800 outline-none focus:border-[#5455EE]"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium leading-5 text-slate-700">Summary</label>
                <textarea
                  rows={2}
                  value={policyForm.summary}
                  onChange={(e) => setPolicyForm({ ...policyForm, summary: e.target.value })}
                  placeholder="Executive summary of the policy's purpose and scope..."
                  className="p-2.5 rounded-xl border border-[#EBECEF] bg-[#F8F9FD] text-sm font-normal leading-[22px] text-slate-800 outline-none focus:border-[#5455EE]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium leading-5 text-slate-700">Eko AI Diagnostic Prompt Usage</label>
                <textarea
                  rows={2}
                  value={policyForm.ekoUsage}
                  onChange={(e) => setPolicyForm({ ...policyForm, ekoUsage: e.target.value })} 
                  placeholder="How Eko references this policy when advising employees..."
                  className="p-2.5 rounded-xl border border-[#EBECEF] bg-[#F8F9FD] text-sm font-normal leading-[22px] text-slate-800 outline-none focus:border-[#5455EE]"
                />
              </div>

              {/* Clauses */}
              <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium leading-5 text-slate-700">Standard Clauses & Rules</label>
                  <button
                    type="button"
                    onClick={() =>
                      setPolicyForm({
                        ...policyForm,
                        keyGuidelines: [...policyForm.keyGuidelines, { clause: `Clause ${policyForm.keyGuidelines.length + 1}.1`, text: '' }],
                      })
                    }
                    className="text-xs font-medium text-[#5455EE] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={12} />
                    <span>Add Clause</span>
                  </button>
                </div>

                {policyForm.keyGuidelines.map((guideline, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={guideline.clause}
                        onChange={(e) => {
                          const updated = [...policyForm.keyGuidelines];
                          updated[idx].clause = e.target.value;
                          setPolicyForm({ ...policyForm, keyGuidelines: updated });
                        }}
                        placeholder="Clause title (e.g. Clause 4.1 - Junior Tenure Protection)"
                        className="font-semibold text-sm text-[#5455EE] bg-transparent outline-none w-full"
                      />
                      {policyForm.keyGuidelines.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = policyForm.keyGuidelines.filter((_, i) => i !== idx);
                            setPolicyForm({ ...policyForm, keyGuidelines: updated });
                          }}
                          className="text-slate-400 hover:text-rose-500 p-0.5"
                        >
                          <X size={13} />
                        </button>
                      )}
                    </div>
                    <textarea
                      rows={2}
                      value={guideline.text}
                      onChange={(e) => {
                        const updated = [...policyForm.keyGuidelines];
                        updated[idx].text = e.target.value;
                        setPolicyForm({ ...policyForm, keyGuidelines: updated });
                      }}
                      placeholder="Rule details and constraints..."
                      className="text-sm font-normal leading-[22px] text-slate-700 bg-white p-2 rounded-lg border border-slate-200 outline-none focus:border-[#5455EE]"
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPolicyModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium leading-5 text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#5455EE] hover:bg-[#4344dd] text-white text-sm font-medium leading-5 transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Check size={14} />
                  <span>Save Policy & Sync Eko</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FAQ ADD/EDIT MODAL */}
      {faqModalOpen && (
        <div
          onClick={() => setFaqModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 flex flex-col gap-4 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xl font-semibold leading-7 text-slate-900">
                {editingFaq ? 'Edit Verified Knowledge Pair' : 'Add New Eko Q&A Pair'}
              </h3>
              <button
                type="button"
                onClick={() => setFaqModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveFaqSubmit} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium leading-5 text-slate-700">Question / Inquiry</label>
                <input
                  type="text"
                  value={faqForm.question}
                  onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                  placeholder="e.g. Can senior colleagues offload tasks to new hires?"
                  className="p-2.5 rounded-xl border border-[#EBECEF] bg-[#F8F9FD] text-sm font-normal text-slate-800 outline-none focus:border-[#5455EE]"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium leading-5 text-slate-700">Official Policy Answer</label>
                <textarea
                  rows={4}
                  value={faqForm.answer}
                  onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                  placeholder="Verified answer returned by Eko AI..."
                  className="p-2.5 rounded-xl border border-[#EBECEF] bg-[#F8F9FD] text-sm font-normal leading-[22px] text-slate-800 outline-none focus:border-[#5455EE]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium leading-5 text-slate-700">Category</label>
                  <select
                    value={faqForm.category}
                    onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                    className="p-2 rounded-xl border border-[#EBECEF] bg-[#F8F9FD] text-sm font-normal text-slate-800 outline-none focus:border-[#5455EE]"
                  >
                    <option value="workload">Workload & Hours</option>
                    <option value="task_ownership">Task Ownership</option>
                    <option value="grievance">Safety & Grievance</option>
                    <option value="mentorship">Mentorship</option>
                    <option value="wellbeing">Wellbeing</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium leading-5 text-slate-700">Linked Policy</label>
                  <select
                    value={faqForm.policyId}
                    onChange={(e) => setFaqForm({ ...faqForm, policyId: e.target.value })}
                    className="p-2 rounded-xl border border-[#EBECEF] bg-[#F8F9FD] text-sm font-normal text-slate-800 outline-none focus:border-[#5455EE]"
                  >
                    {companyPolicies.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.id}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setFaqModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium leading-5 text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#5455EE] hover:bg-[#4344dd] text-white text-sm font-medium leading-5 transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Check size={14} />
                  <span>Save Knowledge Item</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

