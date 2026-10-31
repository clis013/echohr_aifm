import React from 'react';
import { Bell, Settings } from 'lucide-react';

export default function TopHeader({
  activePage,
  onNotificationClick,
  userRole = 'hr',
}) {
  let pageTitle = 'Dashboard';
  if (userRole === 'hr') {
    pageTitle =
      activePage === 'reports'
        ? 'Feedback & Reports'
        : activePage === 'community'
        ? 'Community Board'
        : activePage === 'actions'
        ? 'Actions & Follow-up'
        : 'Dashboard';
  } else if (userRole === 'manager') {
    pageTitle =
      activePage === 'manager_workspace'
        ? 'Manager Workspace'
        : activePage === 'emp_chat'
        ? 'Eko Assistant'
        : activePage === 'emp_feedback'
        ? 'Voice & Feedback'
        : 'Community Board';
  } else {
    pageTitle =
      activePage === 'emp_chat'
        ? 'Eko Assistant'
        : activePage === 'emp_feedback'
        ? 'Voice & Feedback'
        : 'Community Board';
  }

  return (
    <header className="px-6 lg:px-8 pt-7 pb-2 flex items-center justify-between transition-colors">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
        {pageTitle}
      </h1>

      {/* Right: Notifications & Settings */}
      <div className="flex items-center gap-2.5">
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
