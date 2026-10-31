import React from 'react';
import { Building2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import MetricCards from '../components/hr/MetricCards';
import PriorityConcerns from '../components/hr/PriorityConcerns';
import ReportsFollowUp from '../components/hr/ReportsFollowUp';
import FeedbackReportsView from '../components/hr/FeedbackReportsView';
import CommunityBoardView from '../components/community/CommunityBoardView';
import EmployeePortalView from '../components/employee/EmployeePortalView';
import ManagerActionWorkspace from '../components/manager/ManagerActionWorkspace';
import ActionsFollowUpView from '../components/hr/ActionsFollowUpView';
import dataService from '../services/dataService';

export default function ViewRouter() {
  const {
    userRole,
    activePage,
    setActivePage,
    navigateTo,
    department,
    handleDepartmentChange,
    showToast,
    isReportResolved,
    defaultVoiceTab,
    setDefaultVoiceTab,
    highlightPostId,
    setHighlightPostId,
    handleNewReportSubmit,
    actionState,
    updateActionState,
    currentDeptData,
    filteredConcerns,
    filteredReports,
    allReports,
    selectedCatFilter,
    setSelectedCatFilter,
    handleLaunchPlan,
    handleReviewReport,
    isAnnouncementPublished,
    setIsAnnouncementPublished,
  } = useApp();

  return (
    <main className="px-6 lg:px-8 pb-12 flex flex-col gap-6 max-w-[1600px] w-full mx-auto">
      {/* Subheader: Greeting on Left, Department Selector on Right (HR Dashboard only) */}
      {userRole === 'hr' && activePage === 'dashboard' ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 -mt-2">
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            <span className="font-bold text-slate-900">Welcome back, Sarah 👋</span>{' '}
            <span className="text-slate-500 font-medium">
              Here is your workforce disengagement intelligence today.
            </span>
          </p>

          {/* Department View Dropdown */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="flex items-center bg-white border border-[#EBECEF] hover:border-[#5455EE]/50 rounded-2xl px-3.5 py-2 shadow-xs transition-all">
              <Building2 size={16} className="text-[#5455EE] mr-2.5 flex-shrink-0" />
              <div className="flex flex-col text-left">
                <select
                  value={department}
                  onChange={(e) => handleDepartmentChange(e.target.value)}
                  className="bg-transparent text-xs sm:text-sm font-bold text-slate-800 outline-none cursor-pointer pr-3 pt-0.5"
                  aria-label="Organizational and Department View"
                >
                  <optgroup label="Organization-wide View">
                    <option value="all">All Departments (300)</option>
                  </optgroup>
                  <optgroup label="Department Views">
                    <option value="engineering">Engineering (100)</option>
                    <option value="product">Product (55)</option>
                    <option value="sales">Sales & Marketing (65)</option>
                    <option value="support">Customer Success (45)</option>
                    <option value="operations">Operations (35)</option>
                  </optgroup>
                </select>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* 1. EMPLOYEE PORTAL VIEWS (Also accessible to Manager as an employee) */}
      {((userRole === 'employee' && activePage !== 'community') ||
        (userRole === 'manager' && activePage.startsWith('emp_'))) && (
          <EmployeePortalView
            userRole={userRole}
            activePage={activePage}
            setActivePage={setActivePage}
            onShowToast={showToast}
            isReportResolved={isReportResolved}
            initialVoiceTab={defaultVoiceTab}
            highlightPostId={highlightPostId}
            setHighlightPostId={setHighlightPostId}
            onSubmitNewReport={handleNewReportSubmit}
          />
        )}

      {/* 2. MANAGER ACTION WORKSPACE (Mode 1: Daniel Lim's HR Collaboration Space) */}
      {userRole === 'manager' && activePage === 'manager_workspace' && (
        <ManagerActionWorkspace
          onShowToast={showToast}
          actionState={actionState}
          onUpdateActionState={updateActionState}
        />
      )}

      {/* 3. HR PORTAL: PAGE 1 - HR DASHBOARD */}
      {userRole === 'hr' && activePage === 'dashboard' && (
        <>
          {/* Top Banner: 4 KPI / Operational Indicator Cards */}
          <MetricCards
            metrics={currentDeptData.metrics}
            operationalIndicators={currentDeptData.operationalIndicators}
            isDepartmentView={department !== 'all'}
          />

          {/* Main 2-Column Section */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6 items-start">
            {/* Left Column: Disengagement Concerns & Friction Themes Distribution */}
            <div className="flex flex-col gap-6">
              <PriorityConcerns
                distribution={currentDeptData.distribution}
                concerns={filteredConcerns}
                selectedCategoryFilter={selectedCatFilter}
                onSelectCategoryFilter={(catId) => {
                  setSelectedCatFilter(catId);
                  showToast(catId ? 'Filtered concerns by theme' : 'Cleared theme filter');
                }}
                onClearCategoryFilter={() => {
                  setSelectedCatFilter(null);
                  showToast('Cleared theme filter');
                }}
                isDepartmentView={department !== 'all'}
                departmentName={currentDeptData.name}
                onSelectDepartment={handleDepartmentChange}
                onLaunchPlan={handleLaunchPlan}
                onViewReports={() => {
                  navigateTo('reports');
                  showToast('Navigated to Feedback & Reports');
                }}
              />
            </div>

            {/* Right Column: Urgent Anonymous & Named Reports to Follow Up */}
            <div className="sticky top-24">
              <ReportsFollowUp
                reports={filteredReports}
                onSelectReport={handleReviewReport}
                onGoToReportsPage={() => navigateTo('reports')}
              />
            </div>
          </div>
        </>
      )}

      {/* 4. HR PORTAL: PAGE 2 - FEEDBACK & REPORTS FULL VIEW */}
      {userRole === 'hr' && activePage === 'reports' && (
        <FeedbackReportsView
          reports={allReports}
          onReviewReport={handleReviewReport}
          onSchedulePulse={() => showToast('Scheduled new 60-day Role Clarity Pulse Survey.')}
          onExportCSV={() => showToast('Exported CSV archive to Downloads.')}
        />
      )}

      {/* 5. HR PORTAL: PAGE 3 - ACTIONS & FOLLOW-UP VIEW */}
      {userRole === 'hr' && activePage === 'actions' && (
        <ActionsFollowUpView />
      )}

      {/* 6. COMMUNITY BOARD VIEW (Shared across HR, Manager & Employee) */}
      {activePage === 'community' && (
        <CommunityBoardView
          onNewPost={() => showToast('Discussion submitted to Community Board.')}
          onShowToast={showToast}
          isAnnouncementPublished={isAnnouncementPublished}
          setIsAnnouncementPublished={setIsAnnouncementPublished}
          userRole={userRole}
          highlightPostId={highlightPostId}
          onClearHighlight={() => setHighlightPostId(null)}
          onNavigateToFeedback={(tab) => {
            setActivePage('emp_feedback');
            setDefaultVoiceTab(tab || 'report');
          }}
        />
      )}
    </main>
  );
}
