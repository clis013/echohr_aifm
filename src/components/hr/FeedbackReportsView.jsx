import React, { useState, useMemo } from 'react';
import { CATEGORIES } from '../../data/mockData';
import {
  Download,
  Plus,
  ShieldAlert,
  MessageSquareHeart,
  Search,
  Filter,
  User,
  Lock,
} from 'lucide-react';

const INITIAL_FEEDBACK_ITEMS = [
  {
    id: 'FDB-1042',
    date: '19 October 2026',
    department: 'Engineering · Platform Squad',
    category: 'Process & Tooling',
    categoryKey: 'con_01',
    title: 'Standardizing sprint brief checklists and priority trade-offs',
    snippet:
      'Proposing a brief definition-of-done kickoff checklist for each sprint to prevent conflicting task handoffs and ambiguous deliverables.',
    outcome: 'Clearer task ownership and less sprint disruption for newer hires.',
    privacy: 'Anonymous Employee',
    isAnonymous: true,
    reviewStatus: 'Reviewed by HR',
    status: 'In Review',
    statusType: 'review',
    upvotes: 18,
  },
  {
    id: 'FDB-1038',
    date: '18 October 2026',
    department: 'Engineering · Core Backend',
    category: 'Process & Tooling',
    categoryKey: 'con_02',
    title: 'Centralized architectural decision records (ADRs) to avoid contradictory review feedback',
    snippet:
      'Different tech leads provide conflicting architectural directions on PRs. A shared ADR template in Notion/GitHub would unify review expectations.',
    outcome: 'Unified code review standards, less rework, and faster merge cycles.',
    privacy: 'Anonymous Dev',
    isAnonymous: true,
    reviewStatus: 'Action Plan Linked',
    status: 'AP-01 Linked',
    statusType: 'linked',
    upvotes: 24,
  },
  {
    id: 'FDB-1025',
    date: '15 October 2026',
    department: 'Product & Design',
    category: 'Onboarding & Mentorship',
    categoryKey: 'con_03',
    title: 'Dedicated onboarding buddy pairings during first 60 days',
    snippet:
      'New product specialists spend significant time hunting down previous client presentation decks and launch checklist templates without knowing who to ping.',
    outcome: 'Smoother ramp-up, faster time-to-first-deliverable, and reduced hesitation asking questions.',
    privacy: 'Named (Maya · Assoc. Specialist)',
    isAnonymous: false,
    reviewStatus: 'Reviewed by HR',
    status: 'Planned for Q4',
    statusType: 'planned',
    upvotes: 12,
  },
  {
    id: 'FDB-1019',
    date: '12 October 2026',
    department: 'Sales & Marketing',
    category: 'Team Culture & Workflow',
    categoryKey: 'con_04',
    title: 'Async daily standups on Slack to preserve morning deep-work focus',
    snippet:
      'Our daily morning standup has expanded into a 35-minute verbal status readout. Moving standard updates to async Slack threads would preserve uninterrupted engineering & campaign focus.',
    outcome: 'Regained 2.5 hours of weekly focused flow time across 8 reps.',
    privacy: 'Anonymous Rep',
    isAnonymous: true,
    reviewStatus: 'Reviewed by HR',
    status: 'Trial Active',
    statusType: 'trial',
    upvotes: 9,
  },
];

export default function FeedbackReportsView({
  reports = [],
  onReviewReport,
  onSchedulePulse,
  onExportCSV,
}) {
  const [activeTab, setActiveTab] = useState('reports');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [feedbackList, setFeedbackList] = useState(INITIAL_FEEDBACK_ITEMS);
  const [selectedFeedbackModal, setSelectedFeedbackModal] = useState(null);
  const [feedbackEditStatus, setFeedbackEditStatus] = useState('Need Review');

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
          (r.concernTitle && r.concernTitle.toLowerCase().includes(query)) ||
          (r.snippet && r.snippet.toLowerCase().includes(query)) ||
          (r.department && r.department.toLowerCase().includes(query));

        const matchCat =
          selectedCategory === 'all' || r.concernCategory === selectedCategory;

        return matchSearch && matchCat;
      });
  }, [reports, searchQuery, selectedCategory]);

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

      return matchSearch && matchCat;
    });
  }, [feedbackList, searchQuery, selectedCategory]);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. TOP TABS BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EBECEF] pb-4">
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => {
              setActiveTab('reports');
              setSearchQuery('');
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'reports'
                ? 'bg-[#5455EE] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-[#EBECEF]'
            }`}
          >
            <ShieldAlert size={14} />
            <span>Confidential Reports</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                activeTab === 'reports'
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 text-slate-600'
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
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'feedback'
                ? 'bg-[#5455EE] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-[#EBECEF]'
            }`}
          >
            <MessageSquareHeart size={14} />
            <span>Employee Feedback</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                activeTab === 'feedback'
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {feedbackList.length}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={onExportCSV}
            className="px-4 py-2.5 bg-white border border-[#EBECEF] hover:bg-[#F8F9FD] text-xs font-bold text-slate-700 rounded-2xl flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onSchedulePulse}
            className="px-5 py-2.5 bg-[#5455EE] hover:bg-[#4546DF] text-white text-xs font-bold rounded-2xl flex items-center gap-2 transition-all shadow-md shadow-[#5455EE]/25 cursor-pointer"
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
                <span className="text-2xl sm:text-[30px] font-semibold leading-9 tabular-nums text-slate-900">{reports.length}</span>
                <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                  2 High Priority
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#EBECEF] shadow-xs flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider leading-[18px]">
                Under Active Triage
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-[30px] font-semibold leading-9 tabular-nums text-[#5455EE]">3</span>
                <span className="text-xs font-normal leading-[18px] text-slate-500">In Progress</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#EBECEF] shadow-xs flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider leading-[18px]">
                Avg Response Time
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-[30px] font-semibold leading-9 tabular-nums text-emerald-600">1.4 Days</span>
                <span className="text-xs font-normal leading-[18px] text-slate-500">Target &lt; 2 Days</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#EBECEF] shadow-xs flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider leading-[18px]">
                Linked Action Plans
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-[30px] font-semibold leading-9 tabular-nums text-slate-900">1 Active</span>
                <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
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
                <span className="text-2xl sm:text-[30px] font-semibold leading-9 tabular-nums text-slate-900">{feedbackList.length}</span>
                <span className="text-xs font-medium leading-[18px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  100% Constructive
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#EBECEF] shadow-xs flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider leading-[18px]">
                Process & Tooling Ideas
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-[30px] font-semibold leading-9 tabular-nums text-[#5455EE]">2</span>
                <span className="text-xs font-normal leading-[18px] text-slate-500">Highest Engagement</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#EBECEF] shadow-xs flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider leading-[18px]">
                Onboarding & Culture
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-[30px] font-semibold leading-9 tabular-nums text-purple-600">2</span>
                <span className="text-xs font-normal leading-[18px] text-slate-500">Peer Suggested</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#EBECEF] shadow-xs flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider leading-[18px]">
                Implemented / Planned
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-[30px] font-semibold leading-9 tabular-nums text-emerald-600">2 Actions</span>
                <span className="text-xs font-medium leading-[18px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
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
                ? 'Search reports by ID, concern, department, or keyword...'
                : 'Search feedback by ID, suggestion, squad, or keyword...'
            }
            className="w-full pl-9 pr-4 py-2 text-sm font-normal leading-5 bg-[#F8F9FD] border border-slate-200 rounded-xl outline-none focus:border-[#5455EE] transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={14} className="text-slate-400 flex-shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 text-sm font-medium leading-5 bg-[#F8F9FD] border border-slate-200 rounded-xl text-slate-700 outline-none focus:border-[#5455EE] cursor-pointer"
          >
            <option value="all">All Concern Categories</option>
            <option value="con_01">Burnout & Workload Imbalance</option>
            <option value="con_02">Unclear Role Expectations & Support</option>
            <option value="con_03">Recognition & Career Growth</option>
            <option value="con_04">Collaboration & Change</option>
          </select>
        </div>
      </div>

      {/* 4. TAB CONTENT: REPORTS TAB */}
      {activeTab === 'reports' && (
        <div className="bg-white border border-[#EBECEF] rounded-3xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F9FD] border-b border-[#EBECEF] text-slate-500 font-medium uppercase tracking-wider text-xs leading-[18px]">
                <tr>
                  <th className="p-4">Report ID</th>
                  <th className="p-4">Tenure & Dept</th>
                  <th className="p-4">Disengagement Category</th>
                  <th className="p-4">Observed Concern & Snippet</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBECEF]">
                {filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      No reports match the current filter or search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((r) => {
                    const cat = CATEGORIES[r.concernCategory] || CATEGORIES.con_01 || CATEGORIES.other;
                    return (
                      <tr
                        key={r.id}
                        id={`report-row-${r.id}`}
                        className="hover:bg-[#F8F9FD] transition-colors"
                      >
                        <td className="p-4">
                          <span className="text-xs font-mono font-medium text-slate-500 uppercase tracking-wider leading-[18px]">
                            {r.id}
                          </span>
                        </td>
                        <td className="p-4">
                          {r.anonymityType === 'Full Anonymity' ? (
                            <div className="flex flex-col gap-0.5">
                              <span className="font-semibold text-slate-700 bg-[#F4F5FA] px-2 py-0.5 rounded-lg text-xs border border-[#EBECEF] inline-flex items-center gap-1 w-fit">
                                <Lock size={10} className="text-[#5455EE]" />
                                <span>Fully Anonymous</span>
                              </span>
                              <div className="text-slate-400 text-xs mt-0.5">Dept & Tenure Hidden</div>
                            </div>
                          ) : !r.isAnonymous ? (
                            <div className="flex flex-col gap-0.5">
                              <span className="font-bold text-slate-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg text-xs border border-emerald-200 w-fit">
                                {r.reporterName || r.employeeCode}
                              </span>
                              <div className="text-slate-500 text-xs mt-0.5">{r.department} · {r.tenure}</div>
                            </div>
                          ) : (
                            <div>
                              <span className="font-semibold text-slate-700 bg-[#F4F5FA] px-2.5 py-0.5 rounded-lg text-xs border border-[#EBECEF]">
                                {r.tenure}
                              </span>
                              <div className="text-slate-400 text-xs mt-0.5">{r.department}</div>
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <span className="font-medium text-slate-800 text-sm leading-5">{cat.name}</span>
                        </td>
                        <td className="p-4 max-w-sm">
                          <div className="text-sm font-semibold leading-5 text-slate-900 truncate">
                            {r.concernTitle}
                          </div>
                          <div className="text-slate-500 text-xs font-normal leading-[18px] truncate mt-0.5">
                            {r.snippet}
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-medium text-xs leading-[18px] ${
                              r.priority === 'High'
                                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {r.priority}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-medium text-xs leading-[18px] ${getStatusBadge(
                              r.statusType,
                              r.status
                            )}`}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => onReviewReport(r, cat)}
                            className="px-3.5 py-1.5 bg-[#EEF0FF] hover:bg-[#E0E3FF] text-[#5455EE] font-medium rounded-xl text-sm leading-5 transition-colors cursor-pointer"
                          >
                            Take Action
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. TAB CONTENT: EMPLOYEE FEEDBACK TAB */}
      {activeTab === 'feedback' && (
        <div className="bg-white border border-[#EBECEF] rounded-3xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F9FD] border-b border-[#EBECEF] text-slate-500 font-medium uppercase tracking-wider text-xs leading-[18px]">
                <tr>
                  <th className="p-4">Feedback ID</th>
                  <th className="p-4">Department / Squad</th>
                  <th className="p-4">Theme & Category</th>
                  <th className="p-4">Constructive Suggestion & Outcome</th>
                  <th className="p-4">Author / Visibility</th>
                  <th className="p-4">Review Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBECEF]">
                {filteredFeedback.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      No employee feedback matches the current search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredFeedback.map((f) => (
                    <tr
                      key={f.id}
                      className="hover:bg-[#F8F9FD] transition-colors"
                    >
                      <td className="p-4">
                        <span className="text-xs font-mono font-medium text-slate-500 uppercase tracking-wider leading-[18px]">
                          {f.id}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">{f.date}</div>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-slate-800 text-xs">
                          {f.department}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-[#EEF0FF] text-[#5455EE] border border-[#5455EE]/20">
                          {f.category}
                        </span>
                      </td>
                      <td className="p-4 max-w-md">
                        <div className="text-sm font-bold text-slate-900 leading-snug">
                          {f.title}
                        </div>
                        <p className="text-slate-600 text-xs mt-1 line-clamp-2 leading-relaxed">
                          {f.snippet}
                        </p>
                        <div className="mt-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block border border-emerald-100 font-medium">
                          <strong>Outcome:</strong> {f.outcome}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <User size={12} className="text-slate-400" />
                          <span className="font-semibold text-slate-700 text-xs">
                            {f.privacy}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-medium text-xs leading-[18px] ${getStatusBadge(
                            f.statusType,
                            f.status
                          )}`}
                        >
                          {f.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFeedbackModal(f);
                            setFeedbackEditStatus(f.status || 'Need Review');
                          }}
                          className="px-3.5 py-1.5 bg-[#EEF0FF] hover:bg-[#E0E3FF] text-[#5455EE] font-medium rounded-xl text-sm leading-5 transition-colors cursor-pointer"
                        >
                          Review Feedback
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: REVIEW CONSTRUCTIVE FEEDBACK DETAIL */}
      {selectedFeedbackModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 flex flex-col gap-4 text-xs animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageSquareHeart size={18} className="text-[#5455EE]" />
                <h4 className="text-xl font-semibold leading-7 text-slate-900">
                  Feedback Review: {selectedFeedbackModal.id}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFeedbackModal(null)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <span className="text-xs font-medium uppercase tracking-wider text-slate-500 leading-[18px]">
                  Subject / Suggestion Title
                </span>
                <p className="text-base font-semibold leading-6 text-slate-900 mt-0.5">
                  {selectedFeedbackModal.title}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F8F9FD] border border-slate-200 text-slate-700 leading-[22px] text-sm font-normal">
                {selectedFeedbackModal.snippet}
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm font-normal leading-[22px]">
                <span className="font-bold block mb-0.5">Target Positive Outcome:</span>
                <p>{selectedFeedbackModal.outcome}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-[11px]">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Department Scope</span>
                  <span className="font-bold text-slate-800">{selectedFeedbackModal.department}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Visibility Choice</span>
                  <span className="font-bold text-slate-800">{selectedFeedbackModal.privacy}</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#EEF0FF]/60 border border-[#5455EE]/30 flex items-center justify-between gap-3">
                <label htmlFor="feedback-status-select" className="text-xs font-bold text-slate-800 whitespace-nowrap">
                  Change Feedback Status:
                </label>
                <select
                  id="feedback-status-select"
                  value={feedbackEditStatus}
                  onChange={(e) => setFeedbackEditStatus(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-[#5455EE] shadow-2xs cursor-pointer"
                >
                  <option value="Need Review">Need Review</option>
                  <option value="Reviewed">Reviewed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-[11px] text-slate-400">Current: {selectedFeedbackModal.status}</span>
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
                    setFeedbackList((prev) =>
                      prev.map((item) =>
                        item.id === selectedFeedbackModal.id
                          ? { ...item, status: feedbackEditStatus, reviewStatus: feedbackEditStatus === 'Need Review' ? 'Pending Review' : 'Reviewed by HR' }
                          : item
                      )
                    );
                    setSelectedFeedbackModal(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#5455EE] text-white font-medium text-sm leading-5 hover:bg-[#4344dd] transition-colors cursor-pointer shadow-xs"
                >
                  Save Status & Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
