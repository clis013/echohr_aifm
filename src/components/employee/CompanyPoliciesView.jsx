import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  Clock,
  CheckCircle2,
  HelpCircle,
  FileText,
  X,
  MessageSquare,
  ArrowRight,
  Filter,
  Copy,
  Check,
  Layers,
  ListFilter
} from 'lucide-react';
import { COMPANY_POLICIES } from '../../data/mockData';

export default function CompanyPoliciesView({ onAskEko, setActivePage }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [policyModalTab, setPolicyModalTab] = useState('clauses'); // 'clauses' | 'overview' | 'faqs' | 'ask'
  const [expandedClauses, setExpandedClauses] = useState({});
  const [expandedFaqs, setExpandedFaqs] = useState({});
  const [copiedClauseIdx, setCopiedClauseIdx] = useState(null);

  const categories = [
    { id: 'all', label: 'All Policies' },
    { id: 'workload', label: 'Workload & Hours' },
    { id: 'task_ownership', label: 'Task Ownership & SOPs' },
    { id: 'grievance', label: 'Grievance & Safety' },
    { id: 'mentorship', label: 'Growth & Mentorship' },
    { id: 'wellbeing', label: 'Wellbeing & Health' },
  ];

  const filteredPolicies = useMemo(() => {
    return COMPANY_POLICIES.filter((policy) => {
      const matchesCategory =
        selectedCategory === 'all' || policy.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        policy.title.toLowerCase().includes(query) ||
        policy.id.toLowerCase().includes(query) ||
        policy.summary.toLowerCase().includes(query) ||
        policy.ekoUsage.toLowerCase().includes(query) ||
        policy.keyGuidelines.some(
          (g) =>
            g.text.toLowerCase().includes(query) ||
            g.clause.toLowerCase().includes(query)
        );
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleAskEkoPolicy = (policy, specificClause = null) => {
    const promptText = specificClause
      ? `Can you explain ${policy.id} (${specificClause.clause}) and how it applies to my current work in ${policy.categoryLabel}?`
      : `Can you explain ${policy.id} (${policy.title}) and what guidelines apply to my day-to-day work?`;
    if (onAskEko) {
      onAskEko(promptText);
    } else if (setActivePage) {
      setActivePage('emp_chat');
    }
  };

  const openPolicyDetail = (policy, initialTab = 'clauses') => {
    setSelectedPolicy(policy);
    setPolicyModalTab(initialTab);
    // Expand the first clause by default, rest collapsed
    setExpandedClauses({ 0: true });
    setExpandedFaqs({});
  };

  const toggleClause = (idx) => {
    setExpandedClauses((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const toggleFaq = (idx) => {
    setExpandedFaqs((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const toggleAllClauses = () => {
    if (!selectedPolicy) return;
    const allExpanded = selectedPolicy.keyGuidelines.every(
      (_, idx) => expandedClauses[idx]
    );
    if (allExpanded) {
      setExpandedClauses({});
    } else {
      const next = {};
      selectedPolicy.keyGuidelines.forEach((_, idx) => {
        next[idx] = true;
      });
      setExpandedClauses(next);
    }
  };

  const handleCopyClause = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedClauseIdx(idx);
    setTimeout(() => setCopiedClauseIdx(null), 2000);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto pb-10 animate-in fade-in duration-200">
      {/* 1. Header Banner - Note: Page title is already shown in TopHeader, so no duplicate <h2> here */}
      <div className="bg-gradient-to-r from-white via-indigo-50/40 to-[#EEF0FF]/50 border border-[#EBECEF] rounded-3xl p-6 sm:p-7 shadow-card relative overflow-hidden transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-[#5455EE]/10 text-[#5455EE] text-xs font-semibold flex items-center gap-1.5 border border-[#5455EE]/20">
                <Sparkles size={13} />
                Eko AI Knowledge Base & Policy Governance
              </span>
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                Verified Company Standards
              </span>
            </div>
            {/* Direct explanatory subtitle - ensures clean UI consistency with Voice Hub and Community Board */}
            <p className="text-sm font-normal text-slate-600 leading-relaxed">
              These verified policies and task handoff frameworks are referenced by Eko AI to answer your workplace questions, evaluate sprint workloads, and provide objective guidance.
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-xs p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col gap-1.5 min-w-[240px]">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <ShieldCheck size={16} className="text-emerald-600" />
              <span>Full Employee Access</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Consult the exact guidelines Eko uses to verify rights, overtime rules, and escalation channels.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Search and Category Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search policies, overtime, sprint handoff, SLAs..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#EBECEF] text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#5455EE] shadow-2xs transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold p-1 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#5455EE] text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-[#EBECEF]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Categorized Policies Grid */}
      {filteredPolicies.length === 0 ? (
        <div className="bg-white border border-[#EBECEF] rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
            <BookOpen size={24} />
          </div>
          <h3 className="text-base font-bold text-slate-900">No policies found</h3>
          <p className="text-xs text-slate-500 max-w-md">
            No matching policy documents found for "{searchQuery}". Try searching for "overtime", "sprint", "reporting", or "counselling".
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer mt-1"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredPolicies.map((policy) => (
            <div
              key={policy.id}
              className="bg-white border border-[#EBECEF] hover:border-[#5455EE]/40 hover:shadow-card rounded-3xl p-6 transition-all flex flex-col justify-between shadow-2xs group relative"
            >
              <div className="flex flex-col gap-3">
                {/* Policy Meta Header */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-xl bg-[#EEF0FF] text-[#5455EE] border border-indigo-100 uppercase tracking-wider">
                      {policy.id}
                    </span>
                    <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg">
                      {policy.version}
                    </span>
                    <span className="text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg">
                      {policy.categoryLabel || policy.category}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-normal">
                    Updated {policy.lastUpdated}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-[#5455EE] transition-colors leading-[26px]">
                  {policy.title}
                </h3>

                {/* Summary */}
                <p className="text-sm font-normal text-slate-600 leading-[22px] line-clamp-2">
                  {policy.summary}
                </p>

                {/* Categorized Clauses & FAQs Pills - Clean preview instead of full text wall */}
                <div className="flex items-center gap-2 flex-wrap mt-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-xs font-medium text-slate-700">
                    <Layers size={13} className="text-[#5455EE]" />
                    {policy.keyGuidelines.length} Categorized Clauses
                  </span>
                  {policy.faqs && policy.faqs.length > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-xs font-medium text-slate-700">
                      <HelpCircle size={13} className="text-emerald-600" />
                      {policy.faqs.length} Verified FAQs
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#EEF0FF] text-xs font-medium text-[#5455EE]">
                    <Sparkles size={13} />
                    Eko AI Trained
                  </span>
                </div>

                {/* Eko AI Reference Callout */}
                <div className="p-3 rounded-2xl bg-[#F8F9FD] border border-indigo-100/80 flex items-start gap-2.5 mt-1">
                  <Sparkles size={15} className="text-[#5455EE] flex-shrink-0 mt-0.5" />
                  <div className="text-xs font-normal text-slate-600 leading-relaxed">
                    <span className="font-semibold text-[#5455EE]">Eko AI Usage: </span>
                    {policy.ekoUsage}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => openPolicyDetail(policy, 'clauses')}
                  className="px-3.5 py-1.5 rounded-xl bg-[#F4F5FA] hover:bg-slate-200 text-sm font-medium leading-5 text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText size={14} className="text-slate-500" />
                  <span>View Categorized Clauses</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAskEkoPolicy(policy)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#EEF0FF] hover:bg-[#5455EE] hover:text-white text-[#5455EE] text-sm font-medium leading-5 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Sparkles size={14} />
                  <span>Ask Eko</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Categorized Policy Detail Modal */}
      {selectedPolicy && (
        <div
          onClick={() => setSelectedPolicy(null)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[88vh] flex flex-col shadow-2xl border border-[#EBECEF] overflow-hidden"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-gradient-to-b from-slate-50 to-white">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-[#5455EE] text-white uppercase tracking-wider">
                    {selectedPolicy.id}
                  </span>
                  <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md">
                    {selectedPolicy.categoryLabel || selectedPolicy.category}
                  </span>
                  <span className="text-xs text-slate-500 font-normal">
                    Effective {selectedPolicy.effectiveDate} · Version {selectedPolicy.version}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 leading-7 tracking-tight">
                  {selectedPolicy.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPolicy(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer flex-shrink-0 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Navigation Tabs - Categorizing content so users do NOT face a wall of text */}
            <div className="flex items-center gap-2 px-6 pt-3 pb-1 border-b border-slate-100 bg-slate-50/70 overflow-x-auto">
              <button
                type="button"
                onClick={() => setPolicyModalTab('clauses')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  policyModalTab === 'clauses'
                    ? 'bg-white text-[#5455EE] shadow-2xs border border-[#EBECEF]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers size={14} />
                <span>Categorized Clauses ({selectedPolicy.keyGuidelines.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setPolicyModalTab('overview')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  policyModalTab === 'overview'
                    ? 'bg-white text-[#5455EE] shadow-2xs border border-[#EBECEF]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen size={14} />
                <span>Scope & AI Governance</span>
              </button>

              {selectedPolicy.faqs && selectedPolicy.faqs.length > 0 && (
                <button
                  type="button"
                  onClick={() => setPolicyModalTab('faqs')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    policyModalTab === 'faqs'
                      ? 'bg-white text-[#5455EE] shadow-2xs border border-[#EBECEF]'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <HelpCircle size={14} />
                  <span>Verified FAQs ({selectedPolicy.faqs.length})</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setPolicyModalTab('ask')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  policyModalTab === 'ask'
                    ? 'bg-white text-[#5455EE] shadow-2xs border border-[#EBECEF]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles size={14} />
                <span>Ask Eko AI</span>
              </button>
            </div>

            {/* Modal Body - Tab Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-700">
              {/* TAB 1: CATEGORIZED CLAUSES (Interactive Accordion) */}
              {policyModalTab === 'clauses' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-1">
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm leading-5">
                        Categorized Standard Clauses
                      </h4>
                      <p className="text-xs text-slate-500">
                        Select any clause below to expand guidelines, copy text, or consult Eko AI.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={toggleAllClauses}
                      className="px-3 py-1 rounded-lg text-xs font-semibold text-[#5455EE] hover:bg-[#EEF0FF] transition-colors cursor-pointer"
                    >
                      {selectedPolicy.keyGuidelines.every((_, idx) => expandedClauses[idx])
                        ? 'Collapse All'
                        : 'Expand All'}
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {selectedPolicy.keyGuidelines.map((item, idx) => {
                      const isExpanded = expandedClauses[idx];
                      return (
                        <div
                          key={idx}
                          className="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden transition-all"
                        >
                          <button
                            type="button"
                            onClick={() => toggleClause(idx)}
                            className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/80 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded-full bg-[#EEF0FF] text-[#5455EE] text-xs font-bold flex items-center justify-center flex-shrink-0">
                                {idx + 1}
                              </span>
                              <div>
                                <span className="font-semibold text-slate-900 text-sm leading-5 block">
                                  {item.clause}
                                </span>
                                {!isExpanded && (
                                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                                    {item.text}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0 text-slate-400">
                              <ChevronDown
                                size={16}
                                className={`transition-transform duration-200 ${
                                  isExpanded ? 'rotate-180 text-[#5455EE]' : ''
                                }`}
                              />
                            </div>
                          </button>

                          {isExpanded && (
                            <div className="px-4 pb-4 pt-1 border-t border-slate-100 space-y-3 bg-[#FAFBFD]">
                              <p className="text-sm font-normal text-slate-700 leading-relaxed">
                                {item.text}
                              </p>
                              <div className="flex items-center justify-between pt-2">
                                <button
                                  type="button"
                                  onClick={() => handleCopyClause(item.text, idx)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer"
                                >
                                  {copiedClauseIdx === idx ? (
                                    <>
                                      <Check size={13} className="text-emerald-600" />
                                      <span className="text-emerald-600">Copied</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy size={13} />
                                      <span>Copy Clause</span>
                                    </>
                                  )}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const p = selectedPolicy;
                                    setSelectedPolicy(null);
                                    handleAskEkoPolicy(p, item);
                                  }}
                                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-[#5455EE] hover:bg-[#EEF0FF] transition-colors cursor-pointer"
                                >
                                  <Sparkles size={13} />
                                  <span>Ask Eko About This Clause</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: OVERVIEW & AI SCOPE */}
              {policyModalTab === 'overview' && (
                <div className="space-y-4">
                  {/* Eko Reference Card */}
                  <div className="p-4 rounded-2xl bg-[#F8F9FD] border border-indigo-100 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#5455EE] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm leading-5">
                        How Eko AI References This Policy
                      </h4>
                      <p className="text-xs sm:text-[13px] text-slate-600 mt-1 leading-5 font-normal">
                        {selectedPolicy.ekoUsage}
                      </p>
                    </div>
                  </div>

                  {/* Summary */}
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm leading-5 mb-1.5">
                      Policy Executive Summary
                    </h4>
                    <p className="text-sm font-normal text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      {selectedPolicy.summary}
                    </p>
                  </div>

                  {/* Governance Metadata */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3.5 rounded-2xl border border-slate-200 bg-white flex flex-col gap-1">
                      <span className="text-xs text-slate-400 uppercase font-medium tracking-wider">
                        Governance Authority
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-slate-800">
                        People Operations & Engineering Leadership
                      </span>
                    </div>
                    <div className="p-3.5 rounded-2xl border border-slate-200 bg-white flex flex-col gap-1">
                      <span className="text-xs text-slate-400 uppercase font-medium tracking-wider">
                        Review Cycle
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-slate-800">
                        Quarterly (Last reviewed: {selectedPolicy.lastUpdated})
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: VERIFIED FAQS (Accordion) */}
              {policyModalTab === 'faqs' && selectedPolicy.faqs && (
                <div className="space-y-3">
                  <div className="pb-1">
                    <h4 className="font-semibold text-slate-900 text-sm leading-5">
                      Verified Frequently Asked Questions
                    </h4>
                    <p className="text-xs text-slate-500">
                      Official HR answers to common employee scenarios under this policy.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {selectedPolicy.faqs.map((faq, idx) => {
                      const isFaqExpanded = expandedFaqs[idx] ?? (idx === 0);
                      return (
                        <div
                          key={idx}
                          className="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden transition-all"
                        >
                          <button
                            type="button"
                            onClick={() => toggleFaq(idx)}
                            className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/80 transition-colors cursor-pointer"
                          >
                            <div className="flex items-start gap-2.5">
                              <HelpCircle size={16} className="text-[#5455EE] flex-shrink-0 mt-0.5" />
                              <span className="font-semibold text-slate-900 text-sm leading-5">
                                {faq.q}
                              </span>
                            </div>
                            <ChevronDown
                              size={16}
                              className={`transition-transform duration-200 text-slate-400 ${
                                isFaqExpanded ? 'rotate-180 text-[#5455EE]' : ''
                              }`}
                            />
                          </button>

                          {isFaqExpanded && (
                            <div className="px-4 pb-4 pt-1 border-t border-slate-100 bg-[#FAFBFD]">
                              <p className="text-sm font-normal text-slate-700 leading-relaxed">
                                {faq.a}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 4: ASK EKO */}
              {policyModalTab === 'ask' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-[#EEF0FF]/60 border border-[#5455EE]/20 flex items-start gap-3">
                    <Sparkles size={18} className="text-[#5455EE] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm leading-5">
                        Ask Eko AI Directly About This Policy
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Click any prompt below to test how Eko applies {selectedPolicy.id} to real workplace questions, or transfer directly to the chat window.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                      Recommended Questions
                    </span>
                    {selectedPolicy.keyGuidelines.map((guideline, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          const p = selectedPolicy;
                          setSelectedPolicy(null);
                          handleAskEkoPolicy(p, guideline);
                        }}
                        className="w-full p-3.5 rounded-2xl border border-slate-200 hover:border-[#5455EE]/40 bg-white hover:bg-[#F8F9FD] text-left transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <MessageSquare size={14} className="text-[#5455EE] flex-shrink-0" />
                          <span className="text-xs sm:text-sm font-medium text-slate-800 group-hover:text-[#5455EE] transition-colors">
                            "What are the rules regarding {guideline.clause.toLowerCase()}?"
                          </span>
                        </div>
                        <ArrowRight size={14} className="text-slate-400 group-hover:text-[#5455EE] transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 px-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400">
                Official document version {selectedPolicy.version} · Category: {selectedPolicy.categoryLabel || selectedPolicy.category}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPolicy(null)}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const p = selectedPolicy;
                    setSelectedPolicy(null);
                    handleAskEkoPolicy(p);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#5455EE] hover:bg-[#4344dd] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles size={14} />
                  <span>Ask Eko About This Policy</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
