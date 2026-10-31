import React, { useRef, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  ClipboardCheck,
  Lock,
  ChevronRight,
  SlidersHorizontal,
  Users,
  Briefcase,
  FileText,
  Copy,
  Check,
  ShieldCheck,
  MessageSquare,
  X,
  Plus,
  Mic,
  Send,
} from 'lucide-react';
import EchoLogo from '../EchoLogo';

export default function EkoChatView({
  isManager,
  messages,
  setMessages,
  chatInput,
  setChatInput,
  isTyping,
  demoStep,
  draftCopied,
  setDraftCopied,
  showResourcePreview,
  setShowResourcePreview,
  chatFileInputRef,
  handleManagerQuickPrompt,
  handleStartDemo,
  handleProceedToTurn3,
  handleProceedToTurn5,
  handleSendChat,
  onShowToast,
  setVoiceTab,
  setActivePage,
  setHighlightPostId,
}) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col min-h-[calc(100vh-130px)] max-w-4xl w-full mx-auto justify-between pb-6">
      {/* Welcome Section - Centered when no messages */}
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center my-auto py-10 w-full max-w-2xl mx-auto animate-in fade-in duration-300">
          <div className="w-14 h-14 rounded-2xl bg-[#EEF0FF] flex items-center justify-center mb-3.5 shadow-xs">
            <EchoLogo size={32} color="#5455EE" animated />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {isManager ? 'Good morning, Daniel 👋' : 'Good morning, Maya 👋'}
          </h2>
          <p className="text-base sm:text-lg font-semibold text-slate-800 mt-1.5">
            {isManager ? 'Engineering Management & Team Copilot' : 'What can I help you with today?'}
          </p>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-lg leading-relaxed">
            {isManager
              ? 'Get AI assistance on sprint workload distribution, team alignment, 1-on-1 talking points, or leadership guidance.'
              : "Whether you need help understanding a task, organising your priorities, or finding support, you don't have to figure everything out alone."}
          </p>

          {/* Quick Action Cards */}
          {isManager ? (
            /* Daniel Lim's Manager Quick Actions (NO DEMO) */
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full mt-6 text-left">
              <button
                type="button"
                onClick={() => handleManagerQuickPrompt('Review Sprint 14 team capacity and workload distribution')}
                className="bg-white hover:bg-slate-50 border border-slate-200 p-4 rounded-2xl shadow-xs flex items-center justify-between text-left cursor-pointer transition-all group hover:scale-[1.02] hover:border-slate-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#5455EE] flex items-center justify-center border border-indigo-100 flex-shrink-0">
                    <SlidersHorizontal size={17} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Capacity & Workload
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-0.5">Sprint Capacity</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Review squad load & WIP</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-1" />
              </button>

              <button
                type="button"
                onClick={() => handleManagerQuickPrompt('Generate 1-on-1 talking points for workload check-ins')}
                className="bg-white hover:bg-slate-50 border border-slate-200 p-4 rounded-2xl shadow-xs flex items-center justify-between text-left cursor-pointer transition-all group hover:scale-[1.02] hover:border-slate-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 flex-shrink-0">
                    <Users size={17} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Manager 1-on-1s
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-0.5">1-on-1 Prompts</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Workload & clarity questions</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-1" />
              </button>

              <button
                type="button"
                onClick={() => handleManagerQuickPrompt('What are the key steps for implementing Action Plan AP-01 in Engineering?')}
                className="bg-white hover:bg-slate-50 border border-slate-200 p-4 rounded-2xl shadow-xs flex items-center justify-between text-left cursor-pointer transition-all group hover:scale-[1.02] hover:border-slate-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 flex-shrink-0">
                    <Briefcase size={17} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Remediation
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-0.5">Action Plan AP-01</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Workload limits & guidelines</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-1" />
              </button>
            </div>
          ) : (
            /* Maya Tan's Employee Quick Actions (Demo Walkthrough) */
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full mt-6 text-left">
              <button
                type="button"
                onClick={handleStartDemo}
                className="bg-[#5455EE] hover:bg-[#4344dd] text-white p-4 rounded-2xl shadow-md flex items-center justify-between text-left cursor-pointer transition-all group hover:scale-[1.02]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles size={17} className="text-white" />
                  </div>
                  <div>
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-white/80">
                      Live Walkthrough
                    </div>
                    <h4 className="text-sm font-bold mt-0.5">Start Demo</h4>
                    <p className="text-[11px] text-white/80 mt-0.5">Open Eko guidance</p>
                  </div>
                </div>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform flex-shrink-0 ml-1" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setVoiceTab('pulse');
                }}
                className="bg-white hover:bg-slate-50 border border-slate-200 p-4 rounded-2xl shadow-xs flex items-center justify-between text-left cursor-pointer transition-all group hover:scale-[1.02] hover:border-slate-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 flex-shrink-0">
                    <ClipboardCheck size={17} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Occasional Check-in
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-0.5">Pulse Survey</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Occasional check-in · 2 min</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-1" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setActivePage('emp_feedback');
                  setVoiceTab('report');
                }}
                className="bg-white hover:bg-slate-50 border border-slate-200 p-4 rounded-2xl shadow-xs flex items-center justify-between text-left cursor-pointer transition-all group hover:scale-[1.02] hover:border-slate-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 flex-shrink-0">
                    <Lock size={17} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Private Voice
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-0.5">Submit Report</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Raise concerns safely</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-1" />
              </button>
            </div>
          )}
        </div>
      ) : null}

      {/* Conversation Stream */}
      {messages.length > 0 && (
        <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">
          {messages.map((msg) => {
            const isUser = isManager ? msg.sender === 'daniel' : msg.sender === 'maya';
            const senderDisplayName = msg.sender === 'daniel' ? 'Daniel Lim' : msg.sender === 'maya' ? 'Maya Tan' : 'Eko';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 text-xs ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in duration-200`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-2xl bg-[#5455EE] text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                    <EchoLogo size={16} color="#FFFFFF" animated />
                  </div>
                )}

                <div
                  className={`p-4 rounded-3xl max-w-[85%] leading-relaxed ${
                    isUser
                      ? 'bg-[#5455EE] text-white rounded-br-xs shadow-md font-medium'
                      : 'bg-white text-slate-800 border border-[#EBECEF] rounded-bl-xs shadow-card'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-1.5 text-[10px] opacity-75">
                    <span className="font-bold">{senderDisplayName}</span>
                    <span>{msg.time}</span>
                  </div>

                  <p className="whitespace-pre-line text-xs sm:text-sm leading-relaxed">
                    {msg.text}
                  </p>

                  {/* Turn 2: Client Launch Checklist */}
                  {msg.hasResourceCard && (
                    <div className="mt-3.5 p-3.5 rounded-2xl bg-[#F8F9FD] border border-slate-200 flex items-center justify-between shadow-2xs">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <FileText size={15} className="text-[#5455EE]" />
                        Company Resource: Client Launch Checklist
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowResourcePreview(true)}
                        className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-[#5455EE] font-bold text-xs hover:bg-[#EEF0FF] transition-colors shadow-2xs cursor-pointer"
                      >
                        View Example
                      </button>
                    </div>
                  )}

                  {/* Turn 4: Task Comparison Table & Neutral Draft */}
                  {msg.hasTaskTable && (
                    <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-col gap-3">
                      <h4 className="text-sm font-extrabold text-slate-900">
                        Workload & Commitment Comparison
                      </h4>

                      <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
                        <table className="w-full text-left">
                          <thead className="bg-[#F8F9FD] text-slate-600 font-bold border-b border-slate-200">
                            <tr>
                              <th className="p-3">Commitment</th>
                              <th className="p-3">Deadline</th>
                              <th className="p-3 text-right">Estimated Effort</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            <tr>
                              <td className="p-3 font-medium text-slate-800">Existing sprint tasks</td>
                              <td className="p-3 text-slate-600">Thursday, 22 Oct</td>
                              <td className="p-3 text-right font-extrabold text-slate-900">6 hours</td>
                            </tr>
                            <tr>
                              <td className="p-3 font-medium text-slate-800">Client launch materials</td>
                              <td className="p-3 text-slate-600">Friday, 23 Oct</td>
                              <td className="p-3 text-right font-extrabold text-slate-900">5 hours</td>
                            </tr>
                            <tr className="bg-[#FFF9F2]">
                              <td className="p-3 font-medium text-[#9E4A1A]">Additional testing documentation</td>
                              <td className="p-3 text-[#9E4A1A]">Friday, 23 Oct</td>
                              <td className="p-3 text-right font-extrabold text-[#9E4A1A]">4 hours</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Summary & Suggestions below table */}
                      <span className="font-extrabold flex items-center gap-1.5 text-indigo-950 text-xs">
                        💡 Recommended Priority Order:
                      </span>
                      <div className="text-xs space-y-1 text-slate-800">
                        <p>1. <strong className="text-slate-900">Existing sprint tasks (Thursday)</strong> — take precedence to avoid blocking sprint delivery.</p>
                        <p>2. <strong className="text-slate-900">Client launch materials (Friday)</strong> — you scheduled client milestone for the week.</p>
                        <p>3. <strong className="text-slate-900">Additional testing documentation (Friday)</strong> — Defer / reassign: exceeds weekly capacity (+4h overload).</p>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed pt-1">
                        You should confirm this priority order with your manager (Daniel Lim) before deferring or declining the testing documentation so expectations are aligned.
                      </p>

                      <p className="text-xs font-bold text-slate-900 pt-0.5">
                        Need suggested draft message?
                      </p>

                      {/* Suggested Message Box */}
                      <div className="p-4 rounded-2xl bg-[#F8F9FE] border border-[#5455EE]/25 flex flex-col gap-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#5455EE]">Suggested draft message:</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard?.writeText(msg.suggestedDraft);
                              setDraftCopied(true);
                              if (onShowToast) onShowToast('Draft message copied to clipboard');
                              setTimeout(() => setDraftCopied(false), 2500);
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-[#5455EE] hover:bg-[#4344dd] text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                          >
                            {draftCopied ? <Check size={13} /> : <Copy size={13} />}
                            <span>{draftCopied ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                        <p className="text-slate-700 italic text-xs sm:text-[13px] leading-relaxed">
                          “{msg.suggestedDraft}”
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Turn 5: Proactive Recurring-Issue Check-in Quick Actions */}
                  {msg.isTurn5 && msg.showActionButtons && (
                    <div className="mt-3.5 pt-3.5 border-t border-slate-100 flex flex-col gap-2.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {/* 1. Submit anonymous report */}
                        <button
                          type="button"
                          onClick={() => {
                            setVoiceTab('report');
                            if (onShowToast) onShowToast('Opening Confidential Workplace Report modal...');
                          }}
                          className="p-3 rounded-2xl bg-gradient-to-r from-[#5455EE] to-[#4344dd] hover:from-[#4344dd] hover:to-[#3839cb] text-white transition-all text-left flex items-center justify-between cursor-pointer group shadow-sm shadow-[#5455EE]/20 hover:scale-[1.01]"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-white/20 text-white flex items-center justify-center flex-shrink-0">
                              <ShieldCheck size={16} />
                            </div>
                            <div>
                              <span className="font-bold text-xs block leading-tight">
                                Submit anonymous report
                              </span>
                              <span className="text-[10px] text-white/80 leading-tight">
                                Identity not shared · Confidential HR review
                              </span>
                            </div>
                          </div>
                          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform flex-shrink-0 ml-1 opacity-90" />
                        </button>

                        {/* 2. Give feedback */}
                        <button
                          type="button"
                          onClick={() => {
                            setVoiceTab('feedback');
                            if (onShowToast) onShowToast('Opening Feedback Form modal...');
                          }}
                          className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-[#5455EE] hover:bg-[#F8F9FD] transition-all text-left flex items-center justify-between cursor-pointer group shadow-2xs hover:scale-[1.01]"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                              <MessageSquare size={16} />
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 text-xs group-hover:text-[#5455EE] transition-colors block leading-tight">
                                Give feedback
                              </span>
                              <span className="text-[10px] text-slate-500 leading-tight">
                                Share suggestions & improvements
                              </span>
                            </div>
                          </div>
                          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform flex-shrink-0 ml-1 text-slate-400 group-hover:text-[#5455EE]" />
                        </button>

                        {/* 3. View community discussions */}
                        <button
                          type="button"
                          onClick={() => {
                            if (setHighlightPostId) setHighlightPostId('COM-1');
                            setActivePage('community');
                            if (onShowToast) onShowToast('Navigating to Community Board (COM-1)...');
                          }}
                          className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-[#5455EE] hover:bg-[#F8F9FD] transition-all text-left flex items-center justify-between cursor-pointer group shadow-2xs hover:scale-[1.01]"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                              <Users size={16} />
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 text-xs group-hover:text-[#5455EE] transition-colors block leading-tight">
                                View community discussions
                              </span>
                              <span className="text-[10px] text-slate-500 leading-tight">
                                See peer thread on workload (COM-1)
                              </span>
                            </div>
                          </div>
                          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform flex-shrink-0 ml-1 text-slate-400 group-hover:text-[#5455EE]" />
                        </button>

                        {/* 4. Not now */}
                        <button
                          type="button"
                          onClick={() => {
                            setMessages((prev) =>
                              prev.map((m) =>
                                m.id === msg.id ? { ...m, showActionButtons: false, dismissed: true } : m
                              )
                            );
                            if (onShowToast) onShowToast('Check-in suggestion dismissed. You can continue chatting normally.');
                          }}
                          className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-all text-left flex items-center justify-between cursor-pointer group shadow-2xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-slate-200/70 text-slate-600 flex items-center justify-center flex-shrink-0">
                              <X size={15} />
                            </div>
                            <div>
                              <span className="font-bold text-slate-700 text-xs group-hover:text-slate-900 transition-colors block leading-tight">
                                Not now
                              </span>
                              <span className="text-[10px] text-slate-400 leading-tight">
                                Return to normal chat
                              </span>
                            </div>
                          </div>
                          <span className="text-[11px] font-bold text-slate-400 group-hover:text-slate-600">
                            Dismiss
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 self-start bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
              <EchoLogo size={14} color="#5455EE" animated />
              <span>Eko is retrieving guidance...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Demo Completion Navigation (Shown once full sequence completes in one shot) */}
      {!isManager && demoStep === 3 && !isTyping && (
        <div className="mb-2">
          <button
            type="button"
            onClick={() => {
              if (setHighlightPostId) setHighlightPostId('COM-1');
              setActivePage('community');
              if (onShowToast) onShowToast('Navigating to Community Board (COM-1)...');
            }}
            className="w-full p-2.5 rounded-2xl bg-[#EEF0FF] border border-[#5455EE]/40 text-[#5455EE] text-xs font-bold flex items-center justify-between hover:bg-[#E0E3FF] transition-all cursor-pointer shadow-xs"
          >
            <span>👉 Next Demo Step: View Community Discussions (COM-1)</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Bottom Input Form */}
      <div className="w-full">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendChat();
          }}
          className="rounded-3xl border border-slate-200 bg-white shadow-sm focus-within:border-[#5455EE] focus-within:ring-2 focus-within:ring-[#5455EE]/10 transition-all p-2 px-3 flex items-center gap-2"
        >
          {/* Left: a plus sign on left for any attachment */}
          <button
            type="button"
            onClick={() => {
              if (chatFileInputRef.current) {
                chatFileInputRef.current.click();
              }
            }}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-[#EEF0FF] text-slate-500 hover:text-[#5455EE] flex items-center justify-center transition-all flex-shrink-0 cursor-pointer shadow-2xs"
            title="Attach file, screenshot or note"
            aria-label="Add attachment"
          >
            <Plus size={17} />
          </button>
          <input
            type="file"
            ref={chatFileInputRef}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && onShowToast) {
                onShowToast(`Attached "${file.name}" for Eko analysis`);
              }
            }}
          />

          {/* Middle: typing space */}
          <textarea
            rows={1}
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendChat();
              }
            }}
            placeholder={
              isManager
                ? 'Ask Eko about sprint capacity, team alignment, 1-on-1 coaching...'
                : 'Ask anything about onboarding, workload, or expectations...'
            }
            className="flex-1 py-1.5 px-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none resize-none bg-transparent max-h-28 overflow-y-auto"
          />

          {/* Right: audio icon and send icon */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              type="button"
              onClick={() => {
                if (onShowToast) {
                  onShowToast('Voice dictation active. Speak into your microphone...');
                }
              }}
              className="w-9 h-9 rounded-full hover:bg-slate-100 text-slate-400 hover:text-[#5455EE] flex items-center justify-center transition-all cursor-pointer"
              title="Voice input"
              aria-label="Voice input"
            >
              <Mic size={17} />
            </button>
            <button
              type="submit"
              disabled={!chatInput.trim()}
              className="w-9 h-9 rounded-full bg-[#5455EE] hover:bg-[#4344dd] disabled:opacity-40 disabled:hover:bg-[#5455EE] text-white flex items-center justify-center transition-all shadow-sm cursor-pointer"
              title="Send message"
              aria-label="Send message"
            >
              <Send size={15} className="translate-x-[0.5px]" />
            </button>
          </div>
        </form>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 mt-2">
          <ShieldCheck size={13} className="text-emerald-600" />
          <span>
            {isManager
              ? 'Confidential managerial coaching and copilot workspace.'
              : 'Private AI conversation is not automatically attached to an HR report.'}
          </span>
        </div>
      </div>

      {/* Modal: Resource Preview */}
      {showResourcePreview && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 flex flex-col gap-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-900">Client Launch Checklist Example</h4>
              <button
                type="button"
                onClick={() => setShowResourcePreview(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Standard client launch assets include: 1) Executive Pitch Deck (Slide deck), 2) Architectural Whitepaper, 3) End-to-end sandbox walkthrough demo, and 4) Sign-off sheet from Squad Lead and Product Director.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl text-slate-500 text-[11px]">
              Retrieved from Engineering Confluence / Launches.
            </div>
            <button
              type="button"
              onClick={() => setShowResourcePreview(false)}
              className="mt-2 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 cursor-pointer"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
