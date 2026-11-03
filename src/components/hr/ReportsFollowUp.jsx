import React, { useState } from 'react';
import { CATEGORIES } from '../../data/mockData';
import { ArrowRight, Filter, Lock, AlertTriangle, Clock } from 'lucide-react';

export default function ReportsFollowUp({
  reports,
  onSelectReport,
  onGoToReportsPage,
  isExpandedView = false,
}) {
  const [reportFilter, setReportFilter] = useState('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Filter reports
  let filtered = reports;
  if (reportFilter === 'urgent') {
    filtered = filtered.filter((r) => r.statusType === 'urgent');
  } else if (reportFilter === 'overdue') {
    filtered = filtered.filter((r) => r.statusType === 'overdue');
  }

  // Sort by urgency so overdue & urgent reports always show first
  const priorityWeight = { overdue: 4, urgent: 3, review: 2, followup: 1 };
  const sortedReports = [...filtered].sort((a, b) => {
    const weightA = priorityWeight[a.statusType] || 0;
    const weightB = priorityWeight[b.statusType] || 0;
    return weightB - weightA;
  });

  const getUrgencyBadge = (statusType, urgencyLabel, status) => {
    if (statusType === 'new' || status === 'New') {
      return (
        <span className="flex items-center gap-1 text-xs font-medium leading-[18px] px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200">
          <Clock size={11} className="text-sky-600" />
          <span>{urgencyLabel || 'New'}</span>
        </span>
      );
    }
    if (statusType === 'action_needed' || statusType === 'urgent' || status === 'Action Required' || (urgencyLabel && urgencyLabel.toLowerCase().includes('action'))) {
      return (
        <span className="flex items-center gap-1 text-xs font-medium leading-[18px] px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
          <Clock size={11} className="text-amber-700" />
          <span>{urgencyLabel || 'Need Action'}</span>
        </span>
      );
    }
    if (statusType === 'overdue') {
      return (
        <span className="flex items-center gap-1 text-xs font-medium leading-[18px] px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
          <AlertTriangle size={11} className="text-rose-600" />
          <span>{urgencyLabel || 'Past SLA'}</span>
        </span>
      );
    }
    if (statusType === 'review' || status === 'In Progress') {
      return (
        <span className="text-xs font-medium leading-[18px] px-2 py-0.5 rounded-md bg-indigo-50 text-[#5455EE] border border-indigo-200">
          In Review
        </span>
      );
    }
    return (
      <span className="text-xs font-normal leading-[18px] px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-200">
        Scheduled
      </span>
    );
  };

  return (
    <div className="bg-white border border-[#EBECEF] rounded-3xl p-5 sm:p-6 shadow-card hover:border-[#5455EE]/30 transition-all flex flex-col h-full">
      {/* Header with Title and Filter Icon */}
      <div className="flex items-center justify-between mb-4 relative">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold leading-7 tracking-tight text-slate-900">
            Reports to Follow Up
          </h3>
          <span className="text-xs font-medium leading-[18px] text-[#5455EE] bg-[#EEF0FF] border border-[#5455EE]/20 px-2 py-0.5 rounded-full">
            {reports.length}
          </span>
        </div>

        {/* Filter Icon Button & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-sm font-medium leading-5 transition-all cursor-pointer ${
              reportFilter !== 'all'
                ? 'bg-[#5455EE] text-white border-[#5455EE] shadow-sm'
                : 'bg-white border-[#EBECEF] text-slate-600 hover:bg-[#F8F9FD]'
            }`}
            title="Filter reports by urgency"
          >
            <Filter size={13} className={reportFilter !== 'all' ? 'text-white' : 'text-slate-400'} />
            <span className="capitalize">
              {reportFilter === 'all' ? 'Filter' : reportFilter}
            </span>
          </button>

          {showFilterDropdown && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-[#EBECEF] rounded-2xl shadow-xl z-20 py-1 text-xs">
              {[
                { id: 'all', label: 'All Reports' },
                { id: 'urgent', label: 'Urgent Only' },
                { id: 'overdue', label: 'SLA Overdue Only' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setReportFilter(opt.id);
                    setShowFilterDropdown(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 font-medium hover:bg-[#F8F9FD] flex items-center justify-between cursor-pointer ${
                    reportFilter === opt.id ? 'text-[#5455EE] font-bold bg-[#EEF0FF]' : 'text-slate-700'
                  }`}
                >
                  <span>{opt.label}</span>
                  {reportFilter === opt.id && <span className="w-1.5 h-1.5 rounded-full bg-[#5455EE]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reports List */}
      <div className={`grid grid-cols-1 ${isExpandedView ? 'md:grid-cols-2 lg:grid-cols-3' : ''} gap-3 flex-1`}>
        {sortedReports.map((report) => {
          const cat = CATEGORIES[report.concernCategory] || CATEGORIES.role_expectations;

          return (
            <div
              key={report.id}
              onClick={() => onSelectReport(report, cat)}
              className="border border-[#EBECEF] rounded-2xl p-4 bg-white hover:border-[#5455EE]/40 hover:bg-[#F8F9FD] transition-all cursor-pointer flex flex-col gap-2 shadow-xs"
            >
              {/* Row 1: Badges & Urgency */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-medium leading-[18px] text-slate-500 uppercase tracking-wider">
                    {report.id}
                  </span>

                  {report.anonymityType === 'Full Anonymity' ? (
                    <span className="flex items-center gap-1 text-xs font-normal leading-[18px] text-slate-600 bg-[#F4F5FA] px-2 py-0.5 rounded-lg border border-[#EBECEF]">
                      <Lock size={10} className="text-[#5455EE]" />
                      <span>Full Anonymous</span>
                    </span>
                  ) : report.isAnonymous || report.employeeCode === 'EMP-ANON' || report.referenceCode ? (
                    <span className="flex items-center gap-1 text-xs font-normal leading-[18px] text-slate-600 bg-[#F4F5FA] px-2 py-0.5 rounded-lg border border-[#EBECEF]">
                      <Lock size={10} className="text-slate-400" />
                      <span>{report.referenceCode || 'Anonymous'}</span>
                    </span>
                  ) : (
                    <span className="text-xs font-medium leading-[18px] text-slate-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                      {report.reporterName || report.employeeCode}
                    </span>
                  )}

                  {report.tenure && report.tenure !== 'Hidden' && (
                    <span className="text-xs font-normal leading-[18px] text-slate-500">
                      {report.tenure}
                    </span>
                  )}
                </div>

                {getUrgencyBadge(report.statusType, report.urgencyLabel, report.status)}
              </div>

              {/* Row 2: Core Blocker */}
              <div className="flex items-start gap-1">
                <h5 className="text-base font-semibold leading-6 text-slate-900 line-clamp-2">
                  {report.blocker || report.concernTitle}
                </h5>
              </div>

              {/* Row 3: Meta & Quick Action */}
              <div className="flex items-center justify-between text-xs font-normal leading-[18px] text-slate-500 pt-1 border-t border-[#EBECEF]">
                <div className="flex items-center gap-2">
                  <span>{report.department}</span>
                  <span>•</span>
                  <span>{report.date}</span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectReport(report, cat);
                  }}
                  className="flex items-center gap-1 font-medium text-sm leading-5 text-[#5455EE] hover:text-[#4338CA] transition-colors"
                >
                  <span>Review</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Link to Feedback & Reports Archive */}
      <div className="mt-4 pt-3 border-t border-[#EBECEF] flex justify-center">
        <button
          onClick={onGoToReportsPage}
          className="text-sm font-medium leading-5 text-[#5455EE] hover:text-[#4338CA] flex items-center gap-1.5 py-1.5 px-3.5 rounded-xl hover:bg-[#EEF0FF] transition-all cursor-pointer"
        >
          <span>View Full Archive</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
