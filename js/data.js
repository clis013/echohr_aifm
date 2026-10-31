// Data store for HR Dashboard - Early Employee Disengagement Prototype

export const CATEGORIES = {
  A: {
    id: "A",
    key: "role_expectations",
    code: "A",
    name: "Unclear role expectations",
    shortName: "Role Expectations",
    color: "#6366F1", // Indigo
    lightBg: "#EEF2FF",
    description: "Confusing responsibilities, unclear priorities, conflicting instructions or uncertainty about success criteria.",
  },
  B: {
    id: "B",
    key: "recognition",
    code: "B",
    name: "Lack of recognition and appreciation",
    shortName: "Recognition & Appreciation",
    color: "#F59E0B", // Amber
    lightBg: "#FEF3C7",
    description: "Employees feel their contributions go unnoticed, feedback is absent, or achievements are not acknowledged fairly.",
  },
  C: {
    id: "C",
    key: "leadership",
    code: "C",
    name: "Poor leadership and support",
    shortName: "Leadership & Support",
    color: "#8B5CF6", // Violet
    lightBg: "#F5F3FF",
    description: "Inconsistent managerial guidance, limited feedback, inaccessible managers or weak support when employees encounter difficulties.",
  },
  D: {
    id: "D",
    key: "burnout",
    code: "D",
    name: "Burnout and workload imbalance",
    shortName: "Burnout & Workload",
    color: "#EF4444", // Coral Red
    lightBg: "#FEE2E2",
    description: "Unsustainable workload, frequent overtime, unrealistic deadlines, unequal work allocation or insufficient recovery time.",
  },
  E: {
    id: "E",
    key: "growth",
    code: "E",
    name: "Limited growth and career development",
    shortName: "Growth & Development",
    color: "#06B6D4", // Cyan
    lightBg: "#ECFEFF",
    description: "Unclear progression, insufficient learning opportunities, limited mentorship or uncertainty about future career paths.",
  },
  F: {
    id: "F",
    key: "collaboration",
    code: "F",
    name: "Collaboration and social connection difficulties",
    shortName: "Social & Collaboration",
    color: "#10B981", // Emerald
    lightBg: "#D1FAE5",
    description: "Fragmented workflows, poor cross-team coordination, weak onboarding connections, isolation or difficulty building relationships at work.",
  },
  G: {
    id: "G",
    key: "change_mgmt",
    code: "G",
    name: "Unsuccessful change management",
    shortName: "Change Management",
    color: "#EC4899", // Rose Pink
    lightBg: "#FCE7F3",
    description: "Poor communication about organisational changes, unclear reasons for changes, insufficient transition support or employee concerns not being addressed.",
  }
};

export const DEPARTMENTS_DATA = {
  all: {
    name: "All Departments",
    headcount: 420,
    newHires90d: 68,
    metrics: {
      emergingConcerns: { value: 18, trend: "+12.5%", status: "Requires Watch", tone: "blue" },
      reportsToReview: { value: 24, trend: "7 high priority", status: "Action Required", tone: "rose" },
      overdueActions: { value: 5, trend: "-2 this week", status: "SLA Breached", tone: "amber" },
      voluntaryFeedback: { value: 142, trend: "+28% response", status: "Strong Pulse", tone: "emerald" },
    },
    distribution: [
      { categoryId: "A", count: 28, percentage: 24 },
      { categoryId: "D", count: 24, percentage: 21 },
      { categoryId: "C", count: 18, percentage: 16 },
      { categoryId: "B", count: 15, percentage: 13 },
      { categoryId: "F", count: 12, percentage: 10 },
      { categoryId: "E", count: 10, percentage: 9 },
      { categoryId: "G", count: 8, percentage: 7 },
    ],
    priorityConcerns: [
      {
        id: "CON-101",
        categoryKey: "A",
        title: "Unclear Role Expectations & Deliverables Scope",
        priority: "High",
        priorityLevel: 1,
        affectedTenure: "Day 30 – Day 60",
        affectedCount: "14 new hires flagged",
        shortDesc: "Inconsistent guidance between project leads and formal onboarding checklists, creating deliverables hesitation.",
        pattern: "New employees in their 2nd month exhibit a 40% hesitation rate in committing code/deliverables, citing overlapping lead responsibilities.",
        evidence: "6 anonymous pulse check notes, 4 manager 1-on-1 escalated flags, and 3 survey comments highlighting conflicting success metrics.",
        analysis: "Early onboarding materials lack explicit Definition of Done. Junior-to-mid hires report fear of overstepping unwritten boundaries.",
        recommendation: "Deploy standardized 30-60-90 Day Outcome Rubric; mandate bi-weekly milestone sign-offs between direct managers and new joiners."
      },
      {
        id: "CON-102",
        categoryKey: "D",
        title: "Burnout & After-Hours Workload Spikes",
        priority: "High",
        priorityLevel: 1,
        affectedTenure: "Day 45 – Day 90",
        affectedCount: "11 employees flagged",
        shortDesc: "Sudden ramp-up to full sprint commitments without buffer periods leading to late-night activity.",
        pattern: "Early joiners logging active Slack/Git hours past 9:30 PM for 3+ consecutive nights to compensate for ramp-up learning curves.",
        evidence: "Aggregated activity sentiment analysis, 3 direct skip-level feedbacks, and 2 voluntary wellness alerts submitted.",
        analysis: "Teams are assigning standard production quotas too early during probation, causing quiet anxiety and early exhaustion.",
        recommendation: "Cap sprint allocation to 65% for the first 60 days; initiate an automated HR wellness check-in when overtime spans 2 weeks."
      },
      {
        id: "CON-103",
        categoryKey: "C",
        title: "Infrequent 1-on-1s & Manager Inaccessibility",
        priority: "Medium",
        priorityLevel: 2,
        affectedTenure: "Day 15 – Day 45",
        affectedCount: "9 employees flagged",
        shortDesc: "Manager 1-on-1s frequently rescheduled or shortened, leaving new joiners adrift on blockers.",
        pattern: "Over 35% of scheduled new-hire manager check-ins were cancelled or postponed more than twice during their initial month.",
        evidence: "Calendar analytics cross-referenced with onboarding check-ins; 5 anonymous feedback notes stating 'I don't know who to turn to'.",
        analysis: "People managers with heavy individual contributor workloads are treating onboarding check-ins as expendable.",
        recommendation: "Enforce non-reschedulable 30-minute weekly touchpoints in HRIS; notify department head when 2 consecutive check-ins are missed."
      },
      {
        id: "CON-104",
        categoryKey: "B",
        title: "Absence of Early Milestone Recognition",
        priority: "Medium",
        priorityLevel: 2,
        affectedTenure: "Day 30 – Day 90",
        affectedCount: "8 employees flagged",
        shortDesc: "First project completions and successful ramp-up milestones pass without acknowledgment.",
        pattern: "Sentiment scores decline by 22% between Week 4 and Week 8 following major probationary deliverables.",
        evidence: "Low interaction on peer shout-out channels; exit interview retrospectives from recent Q3 departures.",
        analysis: "Fast-moving teams move immediately to the next task without closing the feedback loop on initial achievements.",
        recommendation: "Implement automated 'First Win' recognition prompts for managers at Day 30 and Day 60 on the Community Board."
      },
      {
        id: "CON-105",
        categoryKey: "F",
        title: "Onboarding Social Isolation & Siloed Teams",
        priority: "Emerging",
        priorityLevel: 3,
        affectedTenure: "Day 1 – Day 30",
        affectedCount: "6 new hires flagged",
        shortDesc: "Remote/hybrid joiners feel disconnected from casual team camaraderie and peer support networks.",
        pattern: "New remote hires report only interacting with 1-2 designated teammates during their first 3 weeks.",
        evidence: "Onboarding pulse score of 6.1/10 on 'I feel connected to my team' among remote workers.",
        analysis: "Informal organic connection does not happen automatically in hybrid setups without structured buddy programs.",
        recommendation: "Pair every new hire with a cross-functional onboarding buddy and schedule sponsored weekly virtual coffee syncs."
      }
    ],
    reports: [
      {
        id: "REP-4091",
        employeeCode: "EMP-9204",
        department: "Engineering",
        tenure: "42 Days",
        concernCategory: "A",
        concernTitle: "Unclear sprint priorities & conflicting tech lead reviews",
        priority: "High",
        status: "Needs HR Review",
        statusType: "urgent",
        date: "2 hours ago",
        snippet: "Two different tech leads gave contradictory architectural directives on the payment gateway refactoring task.",
        suggestedAction: "Schedule 3-way alignment sync with Engineering Lead"
      },
      {
        id: "REP-4088",
        employeeCode: "EMP-9188",
        department: "Sales & Marketing",
        tenure: "65 Days",
        concernCategory: "D",
        concernTitle: "Unrealistic quota pacing without adequate lead tooling",
        priority: "High",
        status: "Overdue Action",
        statusType: "overdue",
        date: "Yesterday",
        snippet: "Working 12-hour shifts to meet pipeline quotas while outbound CRM integrations remain broken.",
        suggestedAction: "Manager remediation required (3 days past 48h SLA)"
      },
      {
        id: "REP-4075",
        employeeCode: "EMP-9311",
        department: "Product & UX",
        tenure: "28 Days",
        concernCategory: "C",
        concernTitle: "Manager missed 3 consecutive onboarding 1-on-1s",
        priority: "Medium",
        status: "In Review",
        statusType: "review",
        date: "Oct 17, 2026",
        snippet: "Blocked on roadmapping approvals because direct manager was pulled into customer escalations.",
        suggestedAction: "HR BP to meet with Product Director regarding manager bandwidth"
      },
      {
        id: "REP-4062",
        employeeCode: "EMP-9142",
        department: "Customer Support",
        tenure: "80 Days",
        concernCategory: "B",
        concernTitle: "Resolved 450 complex tickets with zero team recognition",
        priority: "Medium",
        status: "Follow-up Scheduled",
        statusType: "followup",
        date: "Oct 15, 2026",
        snippet: "Peer feedback survey notes high performance but employee feels completely invisible to department head.",
        suggestedAction: "Day-90 Celebration & recognition spotlight card"
      },
      {
        id: "REP-4050",
        employeeCode: "EMP-9402",
        department: "Operations",
        tenure: "19 Days",
        concernCategory: "F",
        concernTitle: "Cross-department friction during supply chain handoffs",
        priority: "Emerging",
        status: "Needs HR Review",
        statusType: "urgent",
        date: "Oct 14, 2026",
        snippet: "Unsure of escalation paths when vendor communications stall across procurement teams.",
        suggestedAction: "Provide process directory & assign onboarding buddy"
      }
    ]
  },
  engineering: {
    name: "Engineering & Tech",
    headcount: 145,
    newHires90d: 26,
    metrics: {
      emergingConcerns: { value: 9, trend: "+18%", status: "High Priority", tone: "blue" },
      reportsToReview: { value: 11, trend: "4 high priority", status: "Action Required", tone: "rose" },
      overdueActions: { value: 2, trend: "-1 this week", status: "Within Range", tone: "amber" },
      voluntaryFeedback: { value: 58, trend: "+32% response", status: "High Engagement", tone: "emerald" },
    },
    distribution: [
      { categoryId: "A", count: 14, percentage: 33 },
      { categoryId: "D", count: 11, percentage: 26 },
      { categoryId: "C", count: 7, percentage: 17 },
      { categoryId: "F", count: 5, percentage: 12 },
      { categoryId: "E", count: 3, percentage: 7 },
      { categoryId: "B", count: 2, percentage: 5 },
      { categoryId: "G", count: 0, percentage: 0 },
    ],
    priorityConcerns: [
      {
        id: "CON-ENG-01",
        categoryKey: "A",
        title: "Conflicting Technical Standards & PR Review Delays",
        priority: "High",
        priorityLevel: 1,
        affectedTenure: "Day 30 – Day 75",
        affectedCount: "9 engineers flagged",
        shortDesc: "Pull requests pending review for >4 days with opposing architectural feedback between leads.",
        pattern: "Junior and mid-level hires wait an average of 4.2 days for code reviews, stifling sprint momentum.",
        evidence: "GitHub webhook telemetry merged with 4 anonymous pulse feedback items.",
        analysis: "Lack of unified team code style documentation leads to subjective critique in review comments.",
        recommendation: "Establish automated linting rules and 24-hour SLA on first-pass code reviews for new engineers."
      },
      {
        id: "CON-ENG-02",
        categoryKey: "D",
        title: "On-Call Rotations Initiated Prematurely",
        priority: "High",
        priorityLevel: 1,
        affectedTenure: "Day 45 – Day 90",
        affectedCount: "6 engineers flagged",
        shortDesc: "Engineers placed on critical secondary on-call rotation before mastering system debugging.",
        pattern: "Multiple late-night PagerDuty alerts handled by engineers with less than 60 days on the job.",
        evidence: "PagerDuty on-call logs and 2 direct incident post-mortem retrospectives.",
        analysis: "New hires experience extreme stress when dealing with unmapped legacy microservices during alerts.",
        recommendation: "Institute strict 90-day shadow-only on-call policy for all engineering new joiners."
      }
    ],
    reports: [
      {
        id: "REP-4091",
        employeeCode: "EMP-9204",
        department: "Engineering",
        tenure: "42 Days",
        concernCategory: "A",
        concernTitle: "Unclear sprint priorities & conflicting tech lead reviews",
        priority: "High",
        status: "Needs HR Review",
        statusType: "urgent",
        date: "2 hours ago",
        snippet: "Two different tech leads gave contradictory architectural directives on the payment gateway refactoring task.",
        suggestedAction: "Schedule 3-way alignment sync with Engineering Lead"
      },
      {
        id: "REP-4071",
        employeeCode: "EMP-9133",
        department: "Engineering",
        tenure: "58 Days",
        concernCategory: "D",
        concernTitle: "Weekend deployment on-call stress without backup",
        priority: "High",
        status: "Overdue Action",
        statusType: "overdue",
        date: "2 days ago",
        snippet: "Assigned as solo responder for Saturday maintenance window with no escalation mentor online.",
        suggestedAction: "Assign senior buddy for next 2 on-call shifts"
      }
    ]
  },
  product: {
    name: "Product & Design",
    headcount: 65,
    newHires90d: 12,
    metrics: {
      emergingConcerns: { value: 3, trend: "-5%", status: "Stable", tone: "blue" },
      reportsToReview: { value: 5, trend: "1 high priority", status: "Review Scheduled", tone: "rose" },
      overdueActions: { value: 1, trend: "0 change", status: "Attention", tone: "amber" },
      voluntaryFeedback: { value: 29, trend: "+15% response", status: "Healthy Pulse", tone: "emerald" },
    },
    distribution: [
      { categoryId: "C", count: 6, percentage: 30 },
      { categoryId: "A", count: 5, percentage: 25 },
      { categoryId: "E", count: 4, percentage: 20 },
      { categoryId: "F", count: 3, percentage: 15 },
      { categoryId: "B", count: 2, percentage: 10 },
      { categoryId: "D", count: 0, percentage: 0 },
      { categoryId: "G", count: 0, percentage: 0 },
    ],
    priorityConcerns: [
      {
        id: "CON-PRD-01",
        categoryKey: "C",
        title: "Frequent Shifting of Product Roadmaps & Success Metrics",
        priority: "High",
        priorityLevel: 1,
        affectedTenure: "Day 30 – Day 60",
        affectedCount: "4 designers/PMs flagged",
        shortDesc: "Design requirements altered mid-sprint without executive alignment, causing duplicate work.",
        pattern: "3 design sprints scrapped midway due to stakeholder misalignment outside the sprint team.",
        evidence: "Figma comment threads and 2 voluntary feedback notes on team autonomy.",
        analysis: "Unclear sign-off hierarchy causes designers to iterate endlessly without final resolution.",
        recommendation: "Implement locked Design Review gates and single-decision-maker sign-off protocol."
      }
    ],
    reports: [
      {
        id: "REP-4075",
        employeeCode: "EMP-9311",
        department: "Product & UX",
        tenure: "28 Days",
        concernCategory: "C",
        concernTitle: "Manager missed 3 consecutive onboarding 1-on-1s",
        priority: "Medium",
        status: "In Review",
        statusType: "review",
        date: "Oct 17, 2026",
        snippet: "Blocked on roadmapping approvals because direct manager was pulled into customer escalations.",
        suggestedAction: "HR BP to meet with Product Director regarding manager bandwidth"
      }
    ]
  },
  sales: {
    name: "Sales & Marketing",
    headcount: 110,
    newHires90d: 18,
    metrics: {
      emergingConcerns: { value: 5, trend: "+20%", status: "High Priority", tone: "blue" },
      reportsToReview: { value: 6, trend: "2 high priority", status: "Action Required", tone: "rose" },
      overdueActions: { value: 2, trend: "+1 this week", status: "SLA Breached", tone: "amber" },
      voluntaryFeedback: { value: 34, trend: "+18% response", status: "Active Pulse", tone: "emerald" },
    },
    distribution: [
      { categoryId: "D", count: 9, percentage: 36 },
      { categoryId: "B", count: 6, percentage: 24 },
      { categoryId: "A", count: 5, percentage: 20 },
      { categoryId: "E", count: 3, percentage: 12 },
      { categoryId: "G", count: 2, percentage: 8 },
      { categoryId: "C", count: 0, percentage: 0 },
      { categoryId: "F", count: 0, percentage: 0 },
    ],
    priorityConcerns: [
      {
        id: "CON-SLS-01",
        categoryKey: "D",
        title: "Disproportionate Quota Pacing in Early Ramp-Up",
        priority: "High",
        priorityLevel: 1,
        affectedTenure: "Day 45 – Day 90",
        affectedCount: "7 sales reps flagged",
        shortDesc: "Early tenure BDRs expected to hit full senior quota during initial product training phases.",
        pattern: "Over 60% of new sales reps report feeling overwhelmed by outbound quotas during Month 2.",
        evidence: "Salesforce CRM activity logs and 3 confidential HR check-in transcripts.",
        analysis: "Ramping schedule was shortened from 90 days to 45 days without additional sales enablement.",
        recommendation: "Re-institute tiered ramp quota (30% Month 1, 60% Month 2, 100% Month 3) and provide dedicated shadow deals."
      }
    ],
    reports: [
      {
        id: "REP-4088",
        employeeCode: "EMP-9188",
        department: "Sales & Marketing",
        tenure: "65 Days",
        concernCategory: "D",
        concernTitle: "Unrealistic quota pacing without adequate lead tooling",
        priority: "High",
        status: "Overdue Action",
        statusType: "overdue",
        date: "Yesterday",
        snippet: "Working 12-hour shifts to meet pipeline quotas while outbound CRM integrations remain broken.",
        suggestedAction: "Manager remediation required (3 days past 48h SLA)"
      }
    ]
  },
  support: {
    name: "Customer Support",
    headcount: 70,
    newHires90d: 10,
    metrics: {
      emergingConcerns: { value: 3, trend: "-10%", status: "Controlled", tone: "blue" },
      reportsToReview: { value: 4, trend: "0 high priority", status: "On Track", tone: "rose" },
      overdueActions: { value: 0, trend: "0 overdue", status: "All Clean", tone: "amber" },
      voluntaryFeedback: { value: 21, trend: "+40% response", status: "High Trust", tone: "emerald" },
    },
    distribution: [
      { categoryId: "B", count: 7, percentage: 39 },
      { categoryId: "F", count: 4, percentage: 22 },
      { categoryId: "A", count: 3, percentage: 17 },
      { categoryId: "D", count: 2, percentage: 11 },
      { categoryId: "E", count: 2, percentage: 11 },
      { categoryId: "C", count: 0, percentage: 0 },
      { categoryId: "G", count: 0, percentage: 0 },
    ],
    priorityConcerns: [
      {
        id: "CON-SUP-01",
        categoryKey: "B",
        title: "Lack of Recognition for High-Volume Support Handlers",
        priority: "Medium",
        priorityLevel: 2,
        affectedTenure: "Day 30 – Day 90",
        affectedCount: "5 specialists flagged",
        shortDesc: "High CSAT performers receive little to no visibility from cross-functional team leaders.",
        pattern: "Agents resolving over 40 tickets daily report feelings of isolation and routine stagnation.",
        evidence: "Zendesk CSAT satisfaction scores vs internal team engagement survey indices.",
        analysis: "Customer support metrics are treated as transactional rather than celebrated across the company.",
        recommendation: "Launch weekly 'Customer Champion' badges on the company community board with gift perks."
      }
    ],
    reports: [
      {
        id: "REP-4062",
        employeeCode: "EMP-9142",
        department: "Customer Support",
        tenure: "80 Days",
        concernCategory: "B",
        concernTitle: "Resolved 450 complex tickets with zero team recognition",
        priority: "Medium",
        status: "Follow-up Scheduled",
        statusType: "followup",
        date: "Oct 15, 2026",
        snippet: "Peer feedback survey notes high performance but employee feels completely invisible to department head.",
        suggestedAction: "Day-90 Celebration & recognition spotlight card"
      }
    ]
  }
};

export const COMMUNITY_POSTS = [
  {
    id: "COM-1",
    author: "Elena Rostova",
    role: "Senior UX Designer",
    department: "Product & Design",
    time: "2 hours ago",
    badge: "Kudos & Shoutout",
    title: "Huge shoutout to our new frontend joiner Maya! 🚀",
    content: "Maya joined only 3 weeks ago and already resolved 8 critical responsive UI blockers on our customer onboarding flow. The collaboration and proactive communication made all the difference!",
    likes: 24,
    comments: 5,
    tag: "Recognition"
  },
  {
    id: "COM-2",
    author: "Anonymous New Hire",
    role: "Software Engineer (Week 4)",
    department: "Engineering",
    time: "4 hours ago",
    badge: "Ask HR & Leadership",
    title: "Tips on balancing sprint tickets vs onboarding learning courses?",
    content: "Hi everyone! Excited to be here. Quick question for fellow engineers who joined recently: how do you balance the internal security learning modules with active sprint deliverables without feeling overwhelmed?",
    likes: 18,
    comments: 9,
    tag: "Workload & Culture"
  },
  {
    id: "COM-3",
    author: "Marcus Vance",
    role: "People & Culture Lead",
    department: "HR",
    time: "Yesterday",
    badge: "Company Initiative",
    title: "New 'Buddy Sync' Coffee Perks are Live! ☕",
    content: "To foster stronger social connections and ease first-month integration, all new hires and their designated buddies can now expense up to 2 coffee sessions per week during their first 60 days!",
    likes: 56,
    comments: 12,
    tag: "Social Connection"
  }
];
