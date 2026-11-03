import React from 'react';
import { Bell, Settings, Clock, Plus, BookOpen } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function TopHeader({
  activePage,
  onNotificationClick,
  userRole = 'hr',
}) {
  const {
    isChatHistoryOpen,
    setIsChatHistoryOpen,
    startNewChat,
    setActivePage: setContextActivePage,
    department,
    currentDeptData,
  } = useApp();

  let pageTitle = 'Dashboard';
  if (userRole === 'hr') {
    if (activePage === 'reports') {
      pageTitle = 'Feedback & Reports';
    } else if (activePage === 'community') {
      pageTitle = 'Community Board';
    } else if (activePage === 'actions') {
      pageTitle = 'Actions & Follow-up';
    } else if (activePage === 'hr_resources') {
      pageTitle = 'Company Resources & Knowledge Base';
    } else {
      // HR Dashboard view: show selected Department Name when not in Organization view
      if (department !== 'all' && currentDeptData?.name) {
        pageTitle = currentDeptData.name.toLowerCase().includes('department')
          ? currentDeptData.name
          : `${currentDeptData.name} Department`;
      } else {
        pageTitle = 'Dashboard';
      }
    }
  } else if (userRole === 'manager') {
    pageTitle =
      activePage === 'manager_workspace'
        ? 'Manager Workspace'
        : activePage === 'emp_resources'
        ? 'Company Policies & Resources'
        : activePage === 'emp_chat'
        ? 'Eko Assistant'
        : activePage === 'emp_feedback'
        ? 'Voice & Feedback'
        : 'Community Board';
  } else {
    pageTitle =
      activePage === 'emp_resources'
        ? 'Company Policies & Resources'
        : activePage === 'emp_chat'
        ? 'Eko Assistant'
        : activePage === 'emp_feedback'
        ? 'Voice & Feedback'
        : 'Community Board';
  }

  return (
    <header className="px-6 lg:px-8 pt-7 pb-2 flex items-center justify-between transition-colors">
      {/* Top Left: On Eko AI Chat, smaller History (clock) icon button + New Chat button */}
      {activePage === 'emp_chat' ? (
        <div className="flex items-center gap-2">
          <button
            type="button"
            id="history-btn-top-header"
            onClick={() => setIsChatHistoryOpen(!isChatHistoryOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#EBECEF] hover:bg-[#F8F9FD] text-slate-700 hover:text-[#5455EE] hover:border-[#5455EE]/40 text-sm font-medium leading-5 transition-all shadow-2xs cursor-pointer group"
            title="Chat History - Click to view past conversations"
          >
            <Clock size={15} className="text-[#5455EE] group-hover:rotate-[-20deg] transition-transform" />
            <span>History</span>
          </button>

          <button
            type="button"
            onClick={startNewChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EEF0FF] hover:bg-[#E0E4FF] text-[#5455EE] text-sm font-medium leading-5 transition-all shadow-2xs cursor-pointer"
            title="Start a new chat session"
          >
            <Plus size={14} />
            <span>New Chat</span>
          </button>
        </div>
      ) : (
        <h1 className="text-2xl sm:text-[28px] font-semibold text-slate-900 leading-[36px] tracking-[-0.015em]">
          {pageTitle}
        </h1>
      )}

      {/* Right: Company Policies (on Eko Assistant page) + Notifications & Settings */}
      <div className="flex items-center gap-2.5">
        {activePage === 'emp_chat' && (
          <button
            type="button"
            onClick={() => setContextActivePage && setContextActivePage('emp_resources')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white border border-[#EBECEF] hover:bg-slate-50 text-slate-700 hover:text-[#5455EE] text-sm font-medium leading-5 transition-colors shadow-xs cursor-pointer"
            title="View company policies referenced by Eko"
          >
            <BookOpen size={15} className="text-[#5455EE]" />
            <span className="hidden sm:inline">Company Policies</span>
          </button>
        )}

        <button
          onClick={onNotificationClick}
          className="relative w-10 h-10 rounded-2xl bg-white border border-[#EBECEF] text-slate-600 hover:text-slate-900 hover:border-slate-300 flex items-center justify-center transition-all cursor-pointer shadow-xs"
          title={userRole === 'hr' ? '4 Unread Alerts' : '1 New Announcement'}
        >
          <Bell size={17} />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#5455EE] border-2 border-white" />
        </button>

        <button
          className="w-10 h-10 rounded-2xl bg-white border border-[#EBECEF] text-slate-600 hover:text-slate-900 hover:border-slate-300 flex items-center justify-center transition-all cursor-pointer shadow-xs"
          title="Settings"
        >
          <Settings size={17} />
        </button>
      </div>
    </header>
  );
}

