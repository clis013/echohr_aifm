import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/common/Sidebar';
import TopHeader from './components/common/TopHeader';
import ActionModal from './components/common/ActionModal';
import ToastNotification from './components/common/ToastNotification';
import AiAssistantDrawer from './components/hr/AiAssistantDrawer';
import ViewRouter from './routes/ViewRouter';

function AppLayout() {
  const {
    userRole,
    handleRoleChange,
    activePage,
    navigateTo,
    isMinimized,
    setIsMinimized,
    department,
    handleDepartmentChange,
    showToast,
    isAiDrawerOpen,
    setIsAiDrawerOpen,
    modalState,
    setModalState,
    handleConfirmModal,
    isAnnouncementPublished,
    setIsAnnouncementPublished,
    actionState,
    setActionState,
    setIsReportResolved,
  } = useApp();

  return (
    <div className="flex min-h-screen bg-[#F4F5FA] text-slate-900 font-sans relative">
      {/* Collapsible Sidebar */}
      <Sidebar
        activePage={activePage}
        setActivePage={navigateTo}
        isMinimized={isMinimized}
        setIsMinimized={setIsMinimized}
        userRole={userRole}
        setUserRole={handleRoleChange}
        onOpenAiDrawer={() => setIsAiDrawerOpen(true)}
      />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isMinimized ? 'ml-[76px]' : 'ml-[264px]'}`}>
        <TopHeader
          activePage={activePage}
          department={department}
          setDepartment={handleDepartmentChange}
          onNotificationClick={() =>
            showToast(
              userRole === 'hr'
                ? '4 Pending high-priority employee signals awaiting review'
                : userRole === 'manager'
                ? '1 Assigned action item from HR: Task ownership & workload review'
                : '1 New Announcement: Team sprint planning starts 10 AM'
            )
          }
          userRole={userRole}
        />

        {/* Modular View Switcher */}
        <ViewRouter />
      </div>

      {/* Action Workflow Modal */}
      <ActionModal
        isOpen={modalState.isOpen}
        modalData={modalState.data}
        onClose={() => setModalState({ isOpen: false, data: null })}
        onConfirm={handleConfirmModal}
        onPublishAnnouncement={() => {
          setIsAnnouncementPublished(true);
          showToast('Official HR announcement published to Community Board.');
        }}
        isAnnouncementPublished={isAnnouncementPublished}
        actionState={actionState}
        onAssignManagerAction={() => {
          setActionState((prev) => ({ ...prev, status: 'Assigned' }));
          showToast('Action Plan AP-01 assigned to Daniel Lim (Engineering Manager)');
        }}
        onMarkActionCompleted={() => {
          setActionState((prev) => ({ ...prev, status: 'Completed' }));
          showToast('Action Plan AP-01 marked as Completed');
        }}
        onSendMayaUpdate={() => {
          setIsReportResolved(true);
          showToast('Resolution update dispatched to Maya via ANON-4827 channel');
        }}
      />

      {/* Floating HR AI Assistant (HR view only) */}
      {userRole === 'hr' && (
        <AiAssistantDrawer
          isOpen={isAiDrawerOpen}
          setIsOpen={setIsAiDrawerOpen}
        />
      )}

      {/* Top Floating Toast Notification */}
      <ToastNotification />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
}
