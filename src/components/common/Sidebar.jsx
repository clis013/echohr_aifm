import React from 'react';
import { LayoutGrid, FileText, Users, ChevronLeft, ChevronRight, Bot, ClipboardCheck, Briefcase, ListTodo } from 'lucide-react';
import EchoLogo from './EchoLogo';

export default function Sidebar({
  activePage,
  setActivePage,
  isMinimized,
  setIsMinimized,
  userRole = 'hr',
  setUserRole,
}) {
  const hrNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'reports', label: 'Feedback & Reports', icon: FileText, badge: '24' },
    { id: 'community', label: 'Community Board', icon: Users },
    { id: 'actions', label: 'Actions & Follow-up', icon: ListTodo },
  ];

  // Employee side
  const employeeNavItems = [
    { id: 'emp_chat', label: 'Eko Assistant', icon: Bot, badge: 'AI' },
    { id: 'emp_feedback', label: 'Voice & Feedback', icon: ClipboardCheck },
    { id: 'community', label: 'Community Board', icon: Users },
  ];

  // Manager side (Daniel Lim: Eko Assistant, Manager Workspace, Voice & Feedback, Community Board)
  const managerNavItems = [
    { id: 'emp_chat', label: 'Eko Assistant', icon: Bot, badge: 'AI' },
    { id: 'manager_workspace', label: 'Manager Workspace', icon: Briefcase },
    { id: 'emp_feedback', label: 'Voice & Feedback', icon: ClipboardCheck },
    { id: 'community', label: 'Community Board', icon: Users },
  ];

  let navItems = hrNavItems;
  if (userRole === 'employee') navItems = employeeNavItems;
  if (userRole === 'manager') navItems = managerNavItems;

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-white border-r border-[#EBECEF] flex flex-col justify-between transition-all duration-300 z-50 select-none shadow-[2px_0_12px_rgba(0,0,0,0.02)] ${
        isMinimized ? 'w-[76px]' : 'w-[264px]'
      }`}
    >
      {/* Top Section: Brand & Nav */}
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className={`p-5 flex items-center border-b border-[#EBECEF] relative ${isMinimized ? 'justify-center' : 'justify-between'}`}>
          {!isMinimized && (
            <div className="flex items-center gap-2.5">
              <EchoLogo size={30} color="#5455EE" animated className="flex-shrink-0" />
              <span className="font-extrabold text-slate-900 text-xl tracking-tight">EchoHR</span>
            </div>
          )}

          {isMinimized && (
            <div className="flex items-center justify-center" title="EchoHR">
              <EchoLogo size={26} color="#5455EE" animated />
            </div>
          )}

          {/* Minimize/Expand Button */}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            title={isMinimized ? 'Expand sidebar' : 'Minimize sidebar'}
            className="w-7 h-7 rounded-lg bg-[#F4F5FA] hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
          >
            {isMinimized ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Prototype Role Switcher Toggle (3 Roles: Maya 1st, HR 2nd, Daniel 3rd) */}
        {!isMinimized ? (
          <div className="px-3 pt-3 pb-1">
            <div className="grid grid-cols-3 bg-[#F1F3F9] p-1 rounded-2xl border border-slate-200/60 shadow-inner gap-0.5">
              <button
                type="button"
                onClick={() => setUserRole && setUserRole('employee')}
                className={`flex items-center justify-center gap-1 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                  userRole === 'employee'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Switch to Employee Portal view"
              >
                <span>👤 Maya</span>
              </button>
              <button
                type="button"
                onClick={() => setUserRole && setUserRole('hr')}
                className={`flex items-center justify-center gap-1 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                  userRole === 'hr'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Switch to HR Portal view"
              >
                <span>👔 HR</span>
              </button>
              <button
                type="button"
                onClick={() => setUserRole && setUserRole('manager')}
                className={`flex items-center justify-center gap-1 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                  userRole === 'manager'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Switch to Manager Action Workspace"
              >
                <span>💼 Daniel</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-2 flex justify-center">
            <button
              onClick={() => {
                if (userRole === 'employee') setUserRole('hr');
                else if (userRole === 'hr') setUserRole('manager');
                else setUserRole('employee');
              }}
              title={`Role: ${userRole === 'employee' ? 'Employee Portal' : userRole === 'hr' ? 'HR Portal' : 'Manager Workspace'} (Click to cycle)`}
              className="w-10 h-10 rounded-xl bg-[#F1F3F9] hover:bg-slate-200 text-sm flex items-center justify-center cursor-pointer shadow-xs"
            >
              {userRole === 'employee' ? '👤' : userRole === 'hr' ? '👔' : '💼'}
            </button>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="p-3 flex flex-col gap-1">
          {!isMinimized && (
            <div className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {userRole === 'employee' ? 'Employee Hub' : 'Menu'}
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                title={isMinimized ? item.label : undefined}
                className={`relative w-full flex items-center rounded-xl font-bold transition-all duration-150 cursor-pointer ${
                  isMinimized ? 'justify-center p-3' : 'px-3.5 py-2.5 gap-3'
                } ${
                  isActive
                    ? 'bg-[#F4F5FA] text-slate-900 font-extrabold'
                    : 'text-slate-500 hover:bg-[#F8F9FD] hover:text-slate-900 font-semibold'
                }`}
              >
                {Icon && (
                  <Icon
                    size={20}
                    className={`w-5 h-5 min-w-[20px] min-h-[20px] flex-shrink-0 transition-colors ${
                      isActive ? 'text-[#5455EE]' : 'text-slate-400'
                    }`}
                  />
                )}
                {!isMinimized && (
                  <>
                    <span className="flex-1 text-left text-[13px] whitespace-nowrap">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`flex-shrink-0 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          item.badge === 'AI'
                            ? 'bg-[#EEF0FF] text-[#5455EE] border border-[#5455EE]/20'
                            : 'bg-rose-50 text-rose-600 border border-rose-200'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: User Profile */}
      <div className="flex flex-col">
        <div className="p-3 border-t border-[#EBECEF]">
          <div
            className={`flex items-center rounded-2xl p-2 transition-all ${
              isMinimized ? 'justify-center' : 'gap-3'
            }`}
          >
            <div
              className={`relative w-9 h-9 rounded-2xl text-white font-extrabold text-xs flex items-center justify-center flex-shrink-0 shadow-sm ${
                userRole === 'employee'
                  ? 'bg-gradient-to-tr from-teal-500 to-emerald-600'
                  : userRole === 'manager'
                  ? 'bg-gradient-to-tr from-purple-500 to-indigo-600'
                  : 'bg-gradient-to-tr from-[#5455EE] to-[#7B7DF6]'
              }`}
            >
              {userRole === 'employee' ? 'MT' : userRole === 'manager' ? 'DL' : 'SJ'}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
            </div>
            {!isMinimized && (
              <div className="flex-1 overflow-hidden">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {userRole === 'employee'
                    ? 'Maya Tan'
                    : userRole === 'manager'
                    ? 'Daniel Lim'
                    : 'Sarah Jenkins'}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {userRole === 'employee'
                    ? 'Junior Software Engineer'
                    : userRole === 'manager'
                    ? 'Engineering Manager'
                    : 'Lead People Partner'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
