import React from 'react';
import { AlertTriangle, Clock, FileText, CheckCircle2, ArrowUpRight, Activity } from 'lucide-react';

export default function MetricCards({
  metrics,
  operationalIndicators,
  isDepartmentView = false,
}) {
  const cards = isDepartmentView && operationalIndicators
    ? [
        {
          title: 'Pulse Response Rate',
          value: metrics?.pulseResponseRate?.value || operationalIndicators.pulseResponseRate?.value || '81%',
          trend: metrics?.pulseResponseRate?.countText || operationalIndicators.pulseResponseRate?.trend || '81 of 100 engineers',
          status: metrics?.pulseResponseRate?.status || 'Active Participation',
          isPrimary: false,
          iconBox: 'bg-[#EEF0FF] text-[#5455EE] border border-indigo-200/60',
          trendClass: 'bg-[#EEF0FF] text-[#5455EE] border border-indigo-200/60',
          icon: Activity,
          sparklineColor: '#5455EE',
          sparklinePath: 'M2 18 L16 14 L30 19 L44 9 L58 12 L68 4',
        },
        {
          title: 'Average Overtime',
          value: operationalIndicators.averageOT?.value || '+18%',
          trend: operationalIndicators.averageOT?.trend || 'vs previous 30-day period',
          status: operationalIndicators.averageOT?.status || 'Overtime Surge',
          isPrimary: false,
          iconBox: 'bg-rose-50 text-rose-600 border border-rose-200/60',
          trendClass: 'bg-rose-50 text-rose-700 border border-rose-200/60',
          icon: AlertTriangle,
          sparklineColor: '#E11D48',
          sparklinePath: 'M2 12 L16 16 L30 8 L44 14 L58 6 L68 9',
        },
        {
          title: 'Deadline Delays',
          value: operationalIndicators.deadlineDelays?.value || '+12%',
          trend: operationalIndicators.deadlineDelays?.trend || 'vs previous 30-day period',
          status: operationalIndicators.deadlineDelays?.status || 'Slippage Detected',
          isPrimary: false,
          iconBox: 'bg-amber-50 text-amber-600 border border-amber-200/60',
          trendClass: 'bg-amber-50 text-amber-800 border border-amber-200/60',
          icon: Clock,
          sparklineColor: '#D97706',
          sparklinePath: 'M2 6 L16 10 L30 7 L44 18 L58 14 L68 20',
        },
        {
          title: 'Active Reports',
          value: operationalIndicators.reportRate?.value || '4 active',
          trend: operationalIndicators.reportRate?.trend || 'High Signal Density',
          status: operationalIndicators.reportRate?.status || 'Priority Triage',
          isPrimary: false,
          iconBox: 'bg-emerald-50 text-emerald-600 border border-emerald-200/60',
          trendClass: 'bg-emerald-50 text-emerald-800 border border-emerald-200/60',
          icon: FileText,
          sparklineColor: '#059669',
          sparklinePath: 'M2 20 L16 16 L30 14 L44 11 L58 7 L68 3',
        },
      ]
    : [
        {
          title: 'Pulse Response Rate',
          value: metrics?.pulseResponseRate?.value ?? '78%',
          trend: metrics?.pulseResponseRate?.countText || metrics?.pulseResponseRate?.trend || '234 of 300 employees',
          status: metrics?.pulseResponseRate?.status ?? 'Healthy Participation',
          isPrimary: false,
          iconBox: 'bg-[#EEF0FF] text-[#5455EE] border border-indigo-200/60',
          trendClass: 'bg-[#EEF0FF] text-[#5455EE] border border-indigo-200/60',
          icon: Activity,
          sparklineColor: '#5455EE',
          sparklinePath: 'M2 18 L16 14 L30 19 L44 9 L58 12 L68 4',
        },
        {
          title: 'Reports to Review',
          value: metrics?.reportsToReview?.value ?? 8,
          trend: metrics?.reportsToReview?.countText || metrics?.reportsToReview?.trend || '3 newly submitted',
          status: metrics?.reportsToReview?.status ?? 'Action Required',
          isPrimary: false,
          iconBox: 'bg-rose-50 text-rose-600 border border-rose-200/60',
          trendClass: 'bg-rose-50 text-rose-700 border border-rose-200/60',
          icon: AlertTriangle,
          sparklineColor: '#E11D48',
          sparklinePath: 'M2 12 L16 16 L30 8 L44 14 L58 6 L68 9',
        },
        {
          title: 'Overdue Actions',
          value: metrics?.overdueActions?.value ?? 2,
          trend: metrics?.overdueActions?.countText || metrics?.overdueActions?.trend || 'Follow-up has exceeded target',
          status: metrics?.overdueActions?.status ?? 'SLA Breached',
          isPrimary: false,
          iconBox: 'bg-amber-50 text-amber-600 border border-amber-200/60',
          trendClass: 'bg-amber-50 text-amber-800 border border-amber-200/60',
          icon: Clock,
          sparklineColor: '#D97706',
          sparklinePath: 'M2 6 L16 10 L30 7 L44 18 L58 14 L68 20',
        },
        {
          title: 'Avg First Response Time',
          value: metrics?.avgResponseTime?.value ?? '1.4 Days',
          trend: metrics?.avgResponseTime?.countText || metrics?.avgResponseTime?.trend || 'Last 30 days',
          status: metrics?.avgResponseTime?.status ?? 'Fast Triage SLA',
          isPrimary: false,
          iconBox: 'bg-emerald-50 text-emerald-600 border border-emerald-200/60',
          trendClass: 'bg-emerald-50 text-emerald-800 border border-emerald-200/60',
          icon: CheckCircle2,
          sparklineColor: '#059669',
          sparklinePath: 'M2 20 L16 16 L30 14 L44 11 L58 7 L68 3',
        },
      ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => {
        const Icon = c.icon;

        return (
          <div
            key={i}
            className="bg-white border border-[#EBECEF] rounded-3xl p-4 sm:p-5 flex flex-col justify-between hover:-translate-y-1 hover:shadow-hover hover:border-[#5455EE]/40 transition-all duration-200 shadow-card group cursor-default relative overflow-hidden min-h-[140px]"
          >
            <div className="absolute -right-2 -bottom-1 pointer-events-none opacity-20 group-hover:opacity-35 transition-opacity w-32 h-14 overflow-hidden">
              <svg viewBox="0 0 70 24" fill="none" className="w-full h-full">
                <path
                  d={c.sparklinePath}
                  stroke={c.sparklineColor}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${c.iconBox}`}>
                  <Icon size={18} strokeWidth={2.2} />
                </div>
                <span className="text-sm font-medium leading-5 text-slate-700 tracking-normal">
                  {c.title}
                </span>
              </div>
              <div className="w-6 h-6 rounded-full border border-slate-200 text-slate-400 group-hover:border-[#5455EE] group-hover:text-[#5455EE] flex items-center justify-center font-bold text-xs transition-colors flex-shrink-0">
                <ArrowUpRight size={13} />
              </div>
            </div>

            <div className="flex items-center gap-2.5 my-2 relative z-10">
              <span className="text-2xl sm:text-[30px] font-semibold text-slate-900 tracking-tight leading-9 tabular-nums">
                {c.value}
              </span>
              <span className={`text-xs font-medium leading-[18px] px-2 py-0.5 rounded-lg ${c.trendClass}`}>
                {c.trend}
              </span>
            </div>

            <div className="text-xs font-normal leading-[18px] text-slate-500 relative z-10">
              {c.status}
            </div>
          </div>
        );
      })}
    </div>
  );
}
