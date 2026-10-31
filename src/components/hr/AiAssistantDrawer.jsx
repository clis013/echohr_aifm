import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, User, CornerDownLeft, Plus, Mic } from 'lucide-react';
import EchoLogo from '../common/EchoLogo';

export default function AiAssistantDrawer({ isOpen, setIsOpen }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hello Sarah! I'm Eko, your early disengagement AI Copilot. I analyze sentiment drops, 1-on-1 calendar trends, and peer feedback across new hires (tenure ≤ 90 days). How can I assist you today?",
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    'Analyze early disengagement signals in Engineering',
    'Draft 1-on-1 questions for week-4 probation check-ins',
    'Suggest intervention plan for quota pacing burnout',
  ];

  const handleSend = (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let aiReply = "I've analyzed the signals across your new cohort. Based on recent pulse telemetry:";

      if (query.toLowerCase().includes('engineering')) {
        aiReply =
          "In Engineering & Tech, the primary driver is 'Unclear role expectations' (42%) compounded by pull-request review delays (avg 4.2 days). I recommend: 1) Enforce a 24h PR review SLA on junior submissions, and 2) Delay un-shadowed on-call rotations until after Day 90.";
      } else if (query.toLowerCase().includes('1-on-1') || query.toLowerCase().includes('question')) {
        aiReply =
          "Here are 3 high-impact 1-on-1 questions for Month 1 check-ins:\n1. 'What unwritten team rules or expectations have surprised you so far?'\n2. 'Are there any deliverables where you feel you need approval but aren't sure who to ask?'\n3. 'How manageable has the sprint pace felt compared to your expectations?'";
      } else if (query.toLowerCase().includes('burnout') || query.toLowerCase().includes('quota')) {
        aiReply =
          "For quota-pacing burnout in Sales (48% of flags), the root cause is escalating to 100% quota before CRM ramp-up completes. Recommendation: Revert to tiered ramp-up (30% Month 1, 60% Month 2) and assign a senior deal-shadow partner.";
      } else {
        aiReply =
          `Based on current data, early disengagement is concentrated between Day 30 and Day 60, driven by conflicting guidance and sudden workload jumps. Triggering an automated 'First Win' acknowledgment and standardizing 30-60-90 rubrics typically recovers 68% of at-risk new hires.`;
      }

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'ai', text: aiReply },
      ]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <>
      {/* FLOATING AI ICON (Pure circle with logo, no need other words) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex items-center justify-center w-14 h-14 bg-[#5455EE] hover:bg-[#4344dd] text-white rounded-full shadow-primaryGlow hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          title="Ask Eko"
          aria-label="Ask Eko"
        >
          <div className="relative flex items-center justify-center">
            <EchoLogo size={26} color="#FFFFFF" animated />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#5455EE]" />
          </div>
        </button>
      </div>

      {/* Slide-over Drawer Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-50 transition-opacity"
        />
      )}

      {/* Slide-over Drawer Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out border-l border-[#EBECEF] sm:rounded-l-3xl overflow-hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 bg-[#5455EE] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <EchoLogo size={18} color="#FFFFFF" animated />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Eko Copilot</h3>
              <p className="text-[10px] text-white/80">Early Disengagement Model Active</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-7 h-7 rounded-lg text-white/80 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Quick Prompts */}
        <div className="p-3 bg-[#F4F5FA] border-b border-[#EBECEF]">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Suggested Prompts
          </div>
          <div className="flex flex-col gap-1.5">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(qp)}
                className="text-left text-xs text-slate-700 bg-white hover:border-[#5455EE]/50 hover:text-[#5455EE] border border-[#EBECEF] p-2.5 rounded-xl transition-all line-clamp-1 cursor-pointer font-medium"
              >
                💡 {qp}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#F4F5FA]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 text-xs ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-7 h-7 rounded-xl bg-[#EEF0FF] text-[#5455EE] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <EchoLogo size={14} color="#5455EE" animated />
                </div>
              )}
              <div
                className={`p-3.5 rounded-2xl max-w-[82%] leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#5455EE] text-white rounded-br-none shadow-sm font-medium'
                    : 'bg-white text-slate-800 border border-[#EBECEF] rounded-bl-none shadow-sm whitespace-pre-line'
                }`}
              >
                {m.text}
              </div>
              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-xl bg-slate-200 text-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-[10px]">
                  SJ
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-500 italic pl-9">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5455EE] animate-ping" />
              <span>Analyzing early tenure telemetry...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-[#EBECEF]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 bg-[#F4F5FA] border border-[#EBECEF] focus-within:border-[#5455EE] focus-within:bg-white rounded-2xl px-2.5 py-2 transition-all"
          >
            {/* Left: plus sign for attachment */}
            <button
              type="button"
              className="w-7 h-7 rounded-xl bg-white hover:bg-[#EEF0FF] text-slate-500 hover:text-[#5455EE] border border-[#EBECEF] flex items-center justify-center transition-all flex-shrink-0 cursor-pointer shadow-2xs"
              title="Add attachment"
              aria-label="Add attachment"
            >
              <Plus size={15} />
            </button>

            {/* Middle: typing space */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about concern patterns, interventions..."
              className="flex-1 bg-transparent text-xs text-slate-800 placeholder-slate-400 outline-none px-1"
            />

            {/* Right: audio icon and send icon */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                type="button"
                className="w-7 h-7 rounded-xl hover:bg-white text-slate-400 hover:text-[#5455EE] flex items-center justify-center transition-all cursor-pointer"
                title="Voice input"
                aria-label="Voice input"
              >
                <Mic size={15} />
              </button>
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="w-7 h-7 rounded-xl bg-[#5455EE] hover:bg-[#4344dd] disabled:opacity-40 text-white flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer shadow-sm"
                title="Send"
                aria-label="Send"
              >
                <Send size={12} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
