import React, { useState, useMemo } from 'react';
import { CATEGORIES } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import {
  Download,
  Plus,
  ShieldAlert,
  MessageSquareHeart,
  Search,
  Filter,
  User,
  Lock,
  ArrowRight,
  Eye,
  CheckCircle2,
  Clock,
  Building2,
  Sparkles,
  MessageSquare,
} from 'lucide-react';

export default function FeedbackReportsView({
  reports = [],
  onReviewReport,
  onSchedulePulse,
  onExportCSV,
}) {
  const { feedbackList: globalFeedbackList, updateFeedback } = useApp();
  const [activeTab, setActiveTab] = useState('reports');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedFeedbackModal, setSelectedFeedbackModal] = useState(null);
  const [feedbackEditStatus, setFeedbackEditStatus] = useState('Need Review');

  const feedbackList = globalFeedbackList || [];

  const getStatusBadge = (statusType, text) => {
    if (
      text === 'Need Review' ||
      text === 'Needs Review' ||
      text === 'Needs HR Review' ||
      text === 'New' ||
      statusType === 'new' ||
      text === 'Action Required' ||
      text === 'Need Action' ||
      statusType === 'action_needed' ||
      statusType === 'urgent'
    ) {
      return 'bg-amber-50 text-amber-800 border border-amber-200';
    }
    if (text === 'Reviewed' || text === 'Reviewed by HR' || text === 'Acknowledged') {
      return 'bg-sky-50 text-sky-700 border border-sky-200';
    }
    if (text === 'In Progress' || statusType === 'review' || statusType === 'linked') {
      return 'bg-indigo-50 text-[#5455EE] border border-indigo-200';
    }
    if (
      text === 'Resolved' ||
      text === 'Solved' ||
      text === 'Closed' ||
      statusType === 'planned' ||
      statusType === 'resolved'
    ) {
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    }
    if (text === 'Withdrawn' || text === 'Withdrawn by Employee') {
      return 'bg-slate-100 text-slate-500 border border-slate-200';
    }
    return 'bg-slate-100 text-slate-700 border border-slate-200';
  };

  const filteredReports = useMemo(() => {
    return reports
      .filter((r) => r.status !== 'Withdrawn' && r.resolutionStatus !== 'Withdrawn')
      .filter((r) => {
        const query = searchQuery.trim().toLowerCase();
        const matchSearch =
          !query ||
          (r.id && r.id.toLowerCase().includes(query)) ||
          (r.referenceCode && r.referenceCode.toLowerCase().includes(query)) ||
          (r.concernTitle && r.concernTitle.toLowerCase().includes(query)) ||
          (r.snippet && r.snippet.toLowerCase().includes(query)) ||
          (r.department && r.department.toLowerCase().includes(query));

        const matchCat =
          selectedCategory === 'all' || r.concernCategory === selectedCategory;

        const matchStatus =
          selectedStatus === 'all' ||
          (selectedStatus === 'urgent' && (r.priority === 'High' || r.status === 'Action Required')) ||
          (selectedStatus === 'in_progress' && r.status === 'In Progress') ||
          (selectedStatus === 'resolved' && (r.status === 'Resolved' || r.resolutionStatus === 'Resolved'));

        return matchSearch && matchCat && matchStatus;
      });
  }, [reports, searchQuery, selectedCategory, selectedStatus]);

  const filteredFeedback = useMemo(() => {
    return feedbackList.filter((f) => {
      const matchSearch =
        !searchQuery.trim() ||
        f.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.snippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.department.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCat =
        selectedCategory === 'all' || f.categoryKey === selectedCategory;

      const matchStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'urgent' && f.status === 'Need Review') ||
        (selectedStatus === 'in_progress' && (f.status === 'In Progress' || f.status === 'In Review')) ||
        (selectedStatus === 'resolved' && (f.status === 'Resolved' || f.status === 'Planned for Q4'));

      return matchSearch && matchCat && matchStatus;
    });
  }, [feedbackList, searchQuery, selectedCategory, selectedStatus]);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. TOP TABS & ACTIONS BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EBECEF] pb-4">
        {/* Segmented Tab Pill Header */}
        <div className="flex items-center gap-2 p-1.5 bg-[#F1F3F9] rounded-2xl border border-slate-200/60 shadow-inner">
          <button
            type="button"
            onClick={() => {
              setActiveTab('reports');
              setSearchQuery('');
            }}
            className={`px-4 py-2 rounded-xl text-sm font-medium leading-5 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'reports'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/70'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Lock size={15} className={activeTab === 'reports' ? 'text-rose-600' : 'text-slate-400'} />
            <span className="font-semibold">Confidential Reports</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'reports'
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-slate-200/80 text-slate-600'
              }`}
            >
              {reports.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('feedback');
              setSearchQuery('');
            }}
            className={`px-4 py-2 rounded-xl text-sm font-medium leading-5 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'feedback'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/70'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <MessageSquare size={15} className={activeTab === 'feedback' ? 'text-emerald-600' : 'text-slate-400'} />
            <span className="font-semibold">Employee Feedback</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'feedback'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-200/80 text-slate-600'
              }`}
            >
              {feedbackList.length}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={onExportCSV}
            className="px-4 py-2 bg-white border border-[#EBECEF] hover:bg-[#F8F9FD] text-xs font-semibold text-slate-700 rounded-2xl flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onSchedulePulse}
            className="px-4 py-2 bg-[#5455EE] hover:bg-[#4546DF] text-white text-xs font-semibold rounded-2xl flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <Plus size={14} />
            <span>Schedule Pulse Survey</span>
          </button>
        </div>
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {activeTab === 'reports' ? (
          <>
            <div className="p-4 rounded-2xl bg-white border border-[#EBECEF] shadow-xs flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider leading-[18px]">
                Total Confidential Reports
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-[28px] font-semibold leading-8 tabular-nums text-slate-900">
                  {reports.length}
                </span>
                <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                  2 High Priority
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#EBECEF] shadow-xs flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider leading-[18px]">
                Under Active Triage
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-[28px] font-semibold leading-8 tabular-nums text-[#5455EE]">3</span>
                <span className="text-xs font-medium leading-[18px] text-slate-500">In Progress</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#EBECEF] shadow-xs flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider leading-[18px]">
                Avg Response Time
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-[28px] font-semibold leading-8 tabular-nums text-emerald-600">1.4 Days</span>
                <span className="text-xs font-normal leading-[18px] text-slate-500">Target &lt; 2 Days</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#EBECEF] shadow-xs flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider leading-[18px]">
                Linked Action Plans
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-[28px] font-semibold leading-8 tabular-nums text-slate-900">1 Active</span>
                <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                  AP-01
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="p-4 rounded-2xl bg-white border border-[#EBECEF] shadow-xs flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider leading-[18px]">
                Total Feedback Submitted
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-[28px] font-semibold leading-8 tabular-nums text-slate-900">
                  {feedbackList.length}
                </span>
                <span className="text-xs font-medium leading-[18px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  100% Constructive
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#EBECEF] shadow-xs flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider leading-[18px]">
                Process & Tooling Ideas
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-[28px] font-semibold leading-8 tabular-nums text-[#5455EE]">2</span>
                <span className="text-xs font-normal leading-[18px] text-slate-500">Highest Engagement</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#EBECEF] shadow-xs flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider leading-[18px]">
                Onboarding & Culture
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-[28px] font-semibold leading-8 tabular-nums text-purple-600">2</span>
                <span className="text-xs font-normal leading-[18px] text-slate-500">Peer Suggested</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#EBECEF] shadow-xs flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider leading-[18px]">
                Implemented / Planned
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-[28px] font-semibold leading-8 tabular-nums text-emerald-600">2 Actions</span>
                <span className="text-xs font-medium leading-[18px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  In Progress
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 3. SEARCH & CATEGORY FILTER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#EBECEF] shadow-xs">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'reports'
                ? 'Search reports by ID, title, department, or keyword...'
                : 'Search feedback by ID, suggestion, squad, or keyword...'
            }
            className="w-full pl-9 pr-4 py-2 text-sm font-normal leading-5 bg-[#F8F9FD] border border-slate-200 rounded-xl outline-none focus:border-[#5455EE] transition-all"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-[#F8F9FD] border border-slate-200 rounded-xl px-2.5 py-1.5">
            <Filter size={13} className="text-slate-400 flex-shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs font-medium bg-transparent text-slate-700 outline-none cursor-pointer"
            >
              <option value="all">All Concern Categories</option>
              <option value="con_01">Burnout & Workload Imbalance</option>
              <option value="con_02">Unclear Role Expectations & Support</option>
              <option value="con_03">Recognition & Career Growth</option>
              <option value="con_04">Collaboration & Change</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-[#F8F9FD] border border-slate-200 rounded-xl px-2.5 py-1.5">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs font-medium bg-transparent text-slate-700 outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="urgent">Action Required / High Priority</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved / Planned</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. CARD-BASED FEED: CONFIDENTIAL REPORTS TAB */}
      {activeTab === 'reports' && (
        <div className="bg-white border border-[#EBECEF] rounded-3xl p-5 sm:p-6 shadow-card flex flex-col gap-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 className="text-base font-semibold leading-6 text-slate-900">
              Confidential Reports Feed ({filteredReports.length})
            </h4>
            <span className="text-xs text-slate-400">
              Sorted by urgency & submission recency
            </span>
          </div>

          {filteredReports.length === 0 ? (
            <div className="py-12 px-4 text-center bg-[#F8F9FD] rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-xs">
                <Lock size={20} className="text-rose-500" />
              </div>
              <span className="text-sm font-bold text-slate-800">
                No reports match the current filter or search criteria
              </span>
              <p className="text-xs text-slate-500 max-w-sm">
                Try clearing search filters or checking other departments.
              </p>
            </div>
          ) : (
            filteredReports.map((r) => {
              const cat = CATEGORIES[r.concernCategory] || CATEGORIES.con_01 || CATEGORIES.other;
              return (
                <div
                  key={r.id}
                  id={`report-card-${r.id}`}
                  onClick={() => onReviewReport(r, cat)}
                  className="p-4 sm:p-5 rounded-2xl border border-[#EBECEF] bg-[#F8F9FD] hover:bg-[#F2F4FD] hover:border-[#5455EE]/40 transition-all shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
                >
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    {/* Left Icon Pill */}
                    <div className="px-2.5 py-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-mono font-medium flex items-center gap-1.5 flex-shrink-0 shadow-2xs mt-0.5">
                      <Lock size={12} className="text-rose-600" />
                      <span className="tracking-wider uppercase">{r.referenceCode || r.id}</span>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex flex-col min-w-0 flex-1 gap-1">
                      {/* Top Chips Row */}
                      <div className="flex items-center gap-2 flex-wrap text-xs">
                        <span
                          className="px-2.5 py-0.5 rounded-md font-semibold text-xs border"
                          style={{
                            backgroundColor: `${cat.color}12`,
                            color: cat.color,
                            borderColor: `${cat.color}30`,
                          }}
                        >
                          {cat.name}
                        </span>

                        <span className="text-slate-400 font-medium">•</span>

                        <span className="font-medium text-slate-700 flex items-center gap-1">
                          <Building2 size={12} className="text-slate-400" />
                          <span>{r.department}</span>
                        </span>

                        <span className="text-slate-400 font-medium">•</span>

                        {r.anonymityType === 'Full Anonymity' ? (
                          <span className="text-slate-500 font-medium">Fully Anonymous</span>
                        ) : !r.isAnonymous ? (
                          <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200">
                            {r.reporterName || r.employeeCode}
                          </span>
                        ) : (
                          <span className="text-slate-500 font-medium">Tenure: {r.tenure}</span>
                        )}

                        <span className="text-slate-400 font-medium">•</span>
                        <span className="text-slate-400">{r.submissionDate || r.date}</span>
                      </div>

                      {/* Title */}
                      <h5 className="text-base font-semibold leading-6 text-slate-900 group-hover:text-[#5455EE] transition-colors mt-0.5">
                        {r.concernTitle}
                      </h5>

                      {/* Snippet */}
                      <p className="text-sm font-normal leading-[22px] text-slate-600 line-clamp-2">
                        {r.snippet}
                      </p>

                      {/* Desired Outcome Pill */}
                      {r.outcome && (
                        <div className="mt-1">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium">
                            <span className="font-bold">Target Resolution:</span>
                            <span>{r.outcome}</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Status & Action Controls */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2.5 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-medium text-xs leading-[18px] ${
                          r.priority === 'High'
                            ? 'bg-rose-50 text-rose-600 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {r.priority} Priority
                      </span>

                      <span
                        className={`px-2.5 py-0.5 rounded-full font-medium text-xs leading-[18px] ${getStatusBadge(
                          r.statusType,
                          r.status
                        )}`}
                      >
                        {r.status}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onReviewReport(r, cat);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-sm font-medium leading-5 text-[#5455EE] hover:bg-[#EEF0FF] hover:border-[#5455EE]/40 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Take Action</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* 5. CARD-BASED FEED: EMPLOYEE FEEDBACK TAB */}
      {activeTab === 'feedback' && (
        <div className="bg-white border border-[#EBECEF] rounded-3xl p-5 sm:p-6 shadow-card flex flex-col gap-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 className="text-base font-semibold leading-6 text-slate-900">
              Constructive Employee Feedback ({filteredFeedback.length})
            </h4>
            <span className="text-xs text-slate-400">
              Proactive squad improvement suggestions
            </span>
          </div>

          {filteredFeedback.length === 0 ? (
            <div className="py-12 px-4 text-center bg-[#F8F9FD] rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-xs">
                <MessageSquare size={20} className="text-emerald-500" />
              </div>
              <span className="text-sm font-bold text-slate-800">
                No employee feedback matches the current criteria
              </span>
              <p className="text-xs text-slate-500 max-w-sm">
                Try searching for other squads or topics.
              </p>
            </div>
          ) : (
            filteredFeedback.map((f) => (
              <div
                key={f.id}
                onClick={() => {
                  setSelectedFeedbackModal(f);
                  setFeedbackEditStatus(f.status || 'Need Review');
                }}
                className="p-4 sm:p-5 rounded-2xl border border-[#EBECEF] bg-[#F8F9FD] hover:bg-[#F2F4FD] hover:border-[#5455EE]/40 transition-all shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
              >
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  {/* Left Icon Pill */}
                  <div className="px-2.5 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-mono font-medium flex items-center gap-1.5 flex-shrink-0 shadow-2xs mt-0.5">
                    <MessageSquare size={12} className="text-emerald-600" />
                    <span className="tracking-wider uppercase">{f.displayId || f.id}</span>
                  </div>

                  {/* Main Content Area */}
                  <div className="flex flex-col min-w-0 flex-1 gap-1">
                    {/* Top Chips Row */}
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="px-2.5 py-0.5 rounded-md font-semibold text-xs bg-[#EEF0FF] text-[#5455EE] border border-[#5455EE]/20">
                        {f.category}
                      </span>

                      <span className="text-slate-400 font-medium">•</span>

                      <span className="font-medium text-slate-700 flex items-center gap-1">
                        <Building2 size={12} className="text-slate-400" />
                        <span>{f.department}</span>
                      </span>

                      <span className="text-slate-400 font-medium">•</span>

                      <div className="flex items-center gap-1 text-slate-600">
                        <User size={12} className="text-slate-400" />
                        <span className="font-medium">{f.privacy}</span>
                      </div>

                      <span className="text-slate-400 font-medium">•</span>
                      <span className="text-slate-400">{f.date}</span>
                    </div>

                    {/* Title */}
                    <h5 className="text-base font-semibold leading-6 text-slate-900 group-hover:text-[#5455EE] transition-colors mt-0.5">
                      {f.title}
                    </h5>

                    {/* Snippet */}
                    <p className="text-sm font-normal leading-[22px] text-slate-600 line-clamp-2">
                      {f.snippet}
                    </p>

                    {/* Outcome Highlight */}
                    {f.outcome && (
                      <div className="mt-1">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium">
                          <span className="font-bold">Target Outcome:</span>
                          <span>{f.outcome}</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Status & Action Controls */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2.5 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-medium text-xs leading-[18px] ${getStatusBadge(
                      f.statusType,
                      f.status
                    )}`}
                  >
                    {f.status}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFeedbackModal(f);
                      setFeedbackEditStatus(f.status || 'Need Review');
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-sm font-medium leading-5 text-[#5455EE] hover:bg-[#EEF0FF] hover:border-[#5455EE]/40 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye size={14} />
                    <span>Review Feedback</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 6. STREAMLINED FEEDBACK REVIEW MODAL */}
      {selectedFeedbackModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 flex flex-col gap-4 text-xs animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <MessageSquare size={16} />
                </div>
                <div>
                  <h4 className="text-lg font-semibold leading-6 text-slate-900">
                    Feedback Triage: {selectedFeedbackModal.displayId || selectedFeedbackModal.id}
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    Submitted {selectedFeedbackModal.date}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFeedbackModal(null)}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* Scope Strip */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-[#F8F9FD] border border-slate-200 font-medium text-slate-700">
                Squad: {selectedFeedbackModal.department}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 font-medium text-[#5455EE]">
                {selectedFeedbackModal.privacy}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 font-medium text-emerald-800">
                {selectedFeedbackModal.category}
              </span>
            </div>

            {/* Title & Description */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 leading-[18px]">
                Suggestion Topic
              </span>
              <h5 className="text-base font-semibold leading-6 text-slate-900">
                {selectedFeedbackModal.title}
              </h5>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F8F9FD] border border-slate-200 text-slate-800 leading-[22px] text-sm font-normal">
              {selectedFeedbackModal.snippet}
            </div>

            {/* Target Outcome */}
            <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 text-sm font-normal leading-[22px]">
              <span className="font-semibold block mb-0.5 text-emerald-800 text-xs uppercase tracking-wider">
                Target Positive Outcome:
              </span>
              <p>{selectedFeedbackModal.outcome}</p>
            </div>

            {/* Triage Status Control */}
            <div className="p-3.5 rounded-2xl bg-[#EEF0FF]/60 border border-[#5455EE]/30 flex items-center justify-between gap-3">
              <label htmlFor="feedback-status-select" className="text-xs font-bold text-slate-800 whitespace-nowrap">
                Update Feedback Status:
              </label>
              <select
                id="feedback-status-select"
                value={feedbackEditStatus}
                onChange={(e) => setFeedbackEditStatus(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-[#5455EE] shadow-2xs cursor-pointer"
              >
                <option value="Need Review">Need Review</option>
                <option value="In Progress">In Progress</option>
                <option value="Planned for Q4">Planned for Q4</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-[11px] text-slate-400">
                Current Status: <strong>{selectedFeedbackModal.status}</strong>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedFeedbackModal(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-medium text-sm leading-5 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (updateFeedback) {
                      updateFeedback(selectedFeedbackModal.id, {
                        status: feedbackEditStatus,
                        reviewStatus: feedbackEditStatus === 'Need Review' ? 'Pending Review' : 'Reviewed by HR',
                        statusType:
                          feedbackEditStatus === 'Resolved' || feedbackEditStatus === 'Planned for Q4'
                            ? 'resolved'
                            : feedbackEditStatus === 'In Progress'
                            ? 'review'
                            : 'new',
                      });
                    }
                    setSelectedFeedbackModal(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#5455EE] text-white font-medium text-sm leading-5 hover:bg-[#4344dd] transition-colors cursor-pointer shadow-xs"
                >
                  Save Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
