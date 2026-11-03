// Nexora Technologies - HR Early Disengagement Intelligence Platform Data Store
// Consolidated 4-Category Model (Demo.md Specification)

export const CATEGORIES = {
  con_01: {
    id: "con_01",
    code: "CON-01",
    name: "Burnout & Workload Imbalance",
    shortName: "Workload Imbalance",
    color: "#F43F5E", // Red
    lightBg: "#FFF1F2",
    description: "Unsustainable workload, frequent overtime, unrealistic deadlines, unequal work allocation, and difficulty refusing additional work.",
  },
  con_02: {
    id: "con_02",
    code: "CON-02",
    name: "Unclear Role Expectations & Poor Manager Support",
    shortName: "Role Expectations & Management",
    color: "#F97316", // Orange
    lightBg: "#FFF7ED",
    description: "Unclear instructions, confusing deliverables, conflicting lead directives, insufficient managerial guidance, and lack of regular 1-on-1 support.",
  },
  con_03: {
    id: "con_03",
    code: "CON-03",
    name: "Lack of Recognition & Career Growth",
    shortName: "Recognition & Career Growth",
    color: "#8B5CF6", // Purple
    lightBg: "#F5F3FF",
    description: "Extra effort goes unnoticed, feedback focuses on mistakes rather than contributions, and limited time or path for career development.",
  },
  con_04: {
    id: "con_04",
    code: "CON-04",
    name: "Collaboration & Organisational Change",
    shortName: "Collaboration & Change",
    color: "#06B6D4", // Blue
    lightBg: "#ECFEFF",
    description: "Hybrid disconnect, decision siloing, and workflow or process changes introduced without adequate explanation, training, or support.",
  },
};

// Aliases for backward compatibility across existing component imports
CATEGORIES.burnout = CATEGORIES.con_01;
CATEGORIES.role_expectations = CATEGORIES.con_02;
CATEGORIES.leadership = CATEGORIES.con_02;
CATEGORIES.recognition = CATEGORIES.con_03;
CATEGORIES.growth = CATEGORIES.con_03;
CATEGORIES.collaboration = CATEGORIES.con_04;
CATEGORIES.change_mgmt = CATEGORIES.con_04;
CATEGORIES.A = CATEGORIES.con_01;
CATEGORIES.B = CATEGORIES.con_02;
CATEGORIES.C = CATEGORIES.con_03;
CATEGORIES.D = CATEGORIES.con_04;

export const COMPANY_PROFILE = {
  name: "Nexora Technologies",
  industry: "B2B Cloud Software / Technology",
  totalEmployees: 300,
  workArrangement: "Hybrid and remote",
  hrTeamCount: 6,
  reportingPeriod: "21 September – 20 October 2026",
  departments: ["Engineering", "Product", "Sales & Marketing", "Customer Success", "Operations"],
};

export const DEPARTMENTS_DATA = {
  all: {
    name: "All Departments",
    headcount: 300,
    metrics: {
      pulseResponseRate: { value: "78%", countText: "234 of 300 employees", status: "Healthy Participation", tone: "blue" },
      reportsToReview: { value: 8, countText: "3 newly submitted", status: "Action Required", tone: "rose" },
      overdueActions: { value: 2, countText: "Follow-up has exceeded target", status: "SLA Breached", tone: "amber" },
      avgResponseTime: { value: "1.4 Days", countText: "Last 30 days", status: "Fast Triage SLA", tone: "emerald" },
      totalEmployees: { value: 300, countText: "Across 5 departments", status: "Hybrid & Remote", tone: "blue" },
    },
    operationalIndicators: {
      averageOT: { value: "+18%", trend: "Engineering overtime surge", status: "Elevated Overtime", tone: "rose" },
      deadlineDelays: { value: "+12%", trend: "vs previous 30 days", status: "Moderate Slippage", tone: "amber" },
      absenceRate: { value: "4.8%", trend: "Within normal limits", status: "Monitoring", tone: "blue" },
      reportRate: { value: "8 active", trend: "3 new this cycle", status: "Active Triage", tone: "emerald" },
    },
    // Pie Chart Distribution: Exactly 4 categories totaling 100%
    distribution: [
      { categoryId: "con_01", count: 42, percentage: 35 },
      { categoryId: "con_02", count: 36, percentage: 30 },
      { categoryId: "con_03", count: 24, percentage: 20 },
      { categoryId: "con_04", count: 18, percentage: 15 },
    ],
    // Only 3 actionable concern cards for the live walkthrough
    priorityConcerns: [
      {
        id: "CON-01",
        code: "CON-01",
        categoryKey: "con_01",
        title: "Burnout & Workload Imbalance",
        priority: "High",
        status: "Requires Investigation",
        detected: "Past 14 days",
        description: "Employees report increasing workloads, competing deadlines, and difficulty refusing additional work.",
        aiInterpretation: "Multiple anonymized signals indicate recurring task allocation ambiguity and workload friction among new hires in Engineering. HR should validate with manager context before assigning corrective action.",
        evidenceSummary: {
          pulseSurvey: "Company-wide survey: 14 pulse responses cite workload pressure and competing deadlines (Priority clarity score: 2.8/5, down 12%).",
          recurringPattern: "Recurring friction pattern detected in 6 anonymized Eko support interactions over the past two weeks regarding task handoffs.",
          feedbackCountSummary: "1 anonymous report and 3 voluntary feedback submissions.",
          feedbackItems: [
            "Anonymous report: Expresses distress over senior colleagues repeatedly passing down documentation work without workload checks.",
            "Voluntary feedback: Inquiries regarding unclear task ownership and conflicting deadlines between sprint deliverables and ad-hoc requests."
          ],
          community: "24 employees upvoted a peer advice thread on 'How to handle extra tasks passed down by senior peers without clear priorities' (7 comments).",
          operationalIndicators: [
            "Engineering overtime: increased by 18% over the past 30 days.",
            "Deadline collisions: 2 new hires affected with 3 conflicting deliverables in JIRO."
          ]
        },
        illustrativeNote: "*Illustrative demo data: 120 coded concern instances across reporting period (21 Sept – 20 Oct 2026). Categories represent coded themes, not unique employees.",
        potentialNegativeEffects: [
          "Increased exhaustion and overtime.",
          "Delayed task completion and project slippage.",
          "Reduced confidence among new hires.",
          "Higher risk of disengagement if problems persist."
        ],
        departmentsAffected: [
          "Engineering (High)",
          "Sales & Marketing (Medium)"
        ],
        recommendedNextStep: [
          "Investigate workload distribution and priority-setting practices in Engineering.",
          "Review how new tasks are assigned to new hires before handoff.",
          "Establish a clear escalation process for conflicting deadlines."
        ]
      },
      {
        id: "CON-02",
        code: "CON-02",
        categoryKey: "con_02",
        title: "Unclear Role Expectations & Poor Manager Support",
        priority: "High",
        status: "Requires Review",
        detected: "Past 21 days",
        description: "Employees receive incomplete instructions or are uncertain about expected deliverables, success criteria, and priorities, compounded by insufficient 1-on-1 feedback.",
        aiInterpretation: "Signals suggest junior engineers face ambiguous acceptance criteria and conflicting guidance across technical leads, lengthening PR cycles to 4+ days. Standardizing task briefs and review SLAs is recommended.",
        evidenceSummary: {
          pulseSurvey: "Company-wide survey: 11 pulse responses mention unclear deliverable expectations and 10 cite insufficient managerial guidance.",
          recurringPattern: "4 anonymized Eko inquiries on architectural standards and conflicting technical guidance between squad leads.",
          feedbackCountSummary: "1 anonymous report and 5 voluntary feedback submissions.",
          feedbackItems: [
            "Anonymous report: Notes contradictory directives from senior peers and conflicting architectural reviews.",
            "Voluntary feedback: Inquiries requesting explicit acceptance criteria and standardized task briefs for sprint items."
          ],
          community: "Peer onboarding discussion on 'Unwritten PR review standards and conflicting lead directives' received 8 upvotes.",
          operationalIndicators: [
            "PR review turnaround: lengthened to 4.2 days across squads (target SLA: 24 hours).",
            "1-on-1 cadence adherence: dropped to 68% for junior cohort over the past 14 days."
          ]
        },
        illustrativeNote: "*Illustrative evidence. Connects directly to new hire onboarding ambiguity and conflicting sprint directives.",
        potentialNegativeEffects: [
          "Hesitation in task ownership and duplicated effort.",
          "Unresolved blockers persisting into sprint rollovers.",
          "Probationary friction and heightened early turnover risk."
        ],
        departmentsAffected: [
          "Engineering (High)",
          "Product (Medium)"
        ],
        recommendedNextStep: [
          "Introduce standard task briefs containing expected outputs, acceptance criteria, and deadlines.",
          "Enforce 24-hour review SLAs on pull requests across engineering squads.",
          "Review manager 1-on-1 check-in practices to support junior engineers."
        ]
      },
      {
        id: "CON-03",
        code: "CON-03",
        categoryKey: "con_03",
        title: "Lack of Recognition & Career Growth",
        priority: "Medium",
        status: "Monitoring",
        detected: "Past 30 days",
        description: "Employees report that extra effort is rarely acknowledged and struggle to identify development opportunities or protected learning time.",
        aiInterpretation: "Signals indicate employees in Product and Customer Success perceive contributions on cross-functional releases as uncredited, creating recognition gaps after launch milestones. Structured milestone acknowledgments are recommended.",
        evidenceSummary: {
          pulseSurvey: "Company-wide survey: 8 pulse responses cite lack of recognition and 7 cite absence of protected learning time.",
          recurringPattern: "3 anonymized Eko inquiries regarding promotion criteria and progression frameworks.",
          feedbackCountSummary: "2 voluntary feedback submissions.",
          feedbackItems: [
            "Voluntary feedback: Notes that contributions to release deliverables were omitted from sprint retrospective shoutouts.",
            "Voluntary feedback: Inquiries requesting structured 30-60-90 development check-ins with people managers."
          ],
          community: "Peer recognition discussion on 'Does extra effort during launch milestones actually get acknowledged?' received 11 upvotes (4 comments).",
          operationalIndicators: [
            "Peer shoutouts logged: declined by 35% among new cohorts over the past 30 days.",
            "Protected learning time: zero professional development hours logged in past sprint cycle."
          ]
        },
        illustrativeNote: "*Illustrative evidence. Demonstrates platform capability to identify non-workload employee concerns.",
        potentialNegativeEffects: [
          "Declining motivation and engagement after Month 1 onboarding.",
          "Perception of invisibility within cross-functional teams.",
          "Early voluntary attrition during first quarter tenure."
        ],
        departmentsAffected: [
          "Product (Medium)",
          "Customer Success (Medium)"
        ],
        recommendedNextStep: [
          "Encourage managers to provide specific, timely feedback and recognise meaningful contributions.",
          "Review structured learning, protected growth time, and progression frameworks.",
          "Institute milestone celebration shoutouts in cross-functional syncs."
        ]
      }
    ],
    // 4 Representative Reports from Demo.md Section 10.A
    reports: [
      {
        id: "R004",
        employeeCode: "ANON-4827",
        isAnonymous: true,
        anonymityType: "Department-Level Anonymous",
        department: "Engineering",
        tenure: "5 months",
        submissionDate: "20 October 2026",
        date: "Today, 20 Oct",
        priority: "High",
        status: "Action Required",
        statusType: "action_needed",
        urgencyLabel: "Need Action",
        concernCategory: "con_01",
        concernTitle: "Repeated workload transfers and conflicting priorities",
        blocker: "Senior peer transfers testing work; manager directives unclear without priority guidance",
        privacySetting: "Department visible, identity hidden",
        referenceCode: "ANON-4827",
        snippet: "A senior colleague repeatedly transfers testing and documentation work without checking existing commitments. My manager gives unclear instructions and does not consistently resolve conflicting deadlines. I am working overtime and am afraid to raise the issue because I am new.",
        suggestedAction: "Investigate task allocation, route case to Head of Engineering, protect reporter identity",
        signals: [
          "Workload manageability rated 6/10 in illustrative pulse check-in",
          "Role clarity rated 6/10",
          "Comfort asking for help rated 6/10",
          "Engineering overtime increased by 18%",
          "Related concerns appear in community discussions",
          "Similar workload and priority issues appear in other reports"
        ],
        aiCaseSummary: "An anonymous Engineering employee with approximately five months of tenure reports repeated additional task assignments from a senior colleague and unclear prioritisation from their manager. The report describes sustained overtime, uncertainty about task ownership, and reluctance to raise concerns because of perceived career risk. Related department-level indicators show increased overtime and recurring concerns about workload balance and role clarity."
      },
      {
        id: "R001",
        employeeCode: "Fully Anonymous",
        isAnonymous: true,
        anonymityType: "Full Anonymity",
        department: "Undisclosed",
        tenure: "Hidden",
        submissionDate: "16 October 2026",
        date: "4 days ago",
        priority: "High",
        status: "In Progress",
        statusType: "review",
        urgencyLabel: "In Progress",
        concernCategory: "con_02",
        concernTitle: "Unclear sprint priorities & conflicting technical reviews",
        blocker: "Contradictory directives between tech leads stalling PR approvals",
        privacySetting: "Full Anonymity (Department & Tenure Hidden)",
        referenceCode: "ANON-3912",
        snippet: "Two technical leads provided contradictory architectural instructions for a payment gateway refactoring task. PR reviews stall for days without resolution.",
        suggestedAction: "Standardise code review guidelines and align tech lead architecture rubric",
        signals: [
          "Pulse score decreased from 8.5 to 5.2 during Week 4",
          "Two 1-on-1 meetings were rescheduled",
          "Recurring theme: Unclear Role Expectations"
        ]
      },
      {
        id: "R002",
        employeeCode: "EMP-5821 - Marcus Chen",
        isAnonymous: false,
        anonymityType: "Non-Anonymous",
        reporterName: "Marcus Chen",
        department: "Sales & Marketing",
        tenure: "1 year 2 months",
        submissionDate: "17 October 2026",
        date: "3 days ago",
        priority: "High",
        status: "Overdue",
        statusType: "overdue",
        urgencyLabel: "Overdue: 3 Days Past SLA",
        concernCategory: "con_01",
        concernTitle: "Extended shifts while covering senior colleague's quota",
        blocker: "Covering senior workload while expected to hit full target with broken CRM",
        privacySetting: "Named Report (Identity Disclosed)",
        referenceCode: "REP-5821",
        snippet: "I am repeatedly covering additional work while still being expected to meet my own targets. My working hours have increased, and I do not know how to raise this without affecting my standing in the team.",
        suggestedAction: "Manager remediation required (3 days past target response SLA)",
        signals: [
          "Sales overtime up 38% vs baseline",
          "12-hour shifts logged on CRM telemetry",
          "Repeated missed check-in flags"
        ]
      },
      {
        id: "R003",
        employeeCode: "Fully Anonymous",
        isAnonymous: true,
        anonymityType: "Full Anonymity",
        department: "Undisclosed",
        tenure: "Hidden",
        submissionDate: "19 October 2026",
        date: "Yesterday",
        priority: "Medium",
        status: "New",
        statusType: "new",
        urgencyLabel: "New",
        concernCategory: "con_02",
        concernTitle: "Unclear expectations for product deliverables",
        blocker: "Late scope shifts without clear deliverable criteria leading to repeated rework",
        privacySetting: "Full Anonymity (Department & Tenure Hidden)",
        referenceCode: "ANON-1955",
        snippet: "I often receive requests without a clear definition of what the final deliverable should look like. I spend extra time checking examples and redoing work.",
        suggestedAction: "Product Director to implement standard kickoff briefs and milestone gates",
        signals: [
          "Sprint scope changed in 42% of active sprints",
          "Redoing work reported in 3 consecutive retrospectives",
          "Sense of direction scored 5.0/10"
        ]
      },
      {
        id: "R005",
        employeeCode: "EMP-3104 - Priya Sharma",
        isAnonymous: false,
        anonymityType: "Non-Anonymous",
        reporterName: "Priya Sharma",
        department: "Design & UX",
        tenure: "8 months",
        submissionDate: "20 October 2026",
        date: "Today, 20 Oct",
        priority: "Medium",
        status: "New",
        statusType: "new",
        urgencyLabel: "New",
        concernCategory: "con_03",
        concernTitle: "Recognition & attribution omitted on cross-functional launch deliverables",
        blocker: "Design system tokens uncredited on major marketing release notes",
        privacySetting: "Named Report (Identity Disclosed)",
        referenceCode: "REP-3104",
        snippet: "Contributions to design system tokens and cross-platform UI components were omitted from the company release notes. This has happened twice, affecting performance review visibility.",
        suggestedAction: "Design Director to establish explicit contributor attribution guidelines",
        signals: [
          "Recognition score 4.8/10",
          "Design team pulse indicates low attribution satisfaction"
        ]
      }
    ]
  },
  engineering: {
    name: "Engineering",
    headcount: 100,
    mainConcern: "Workload imbalance & unclear expectations",
    relativeSignal: "High",
    operationalIndicators: {
      averageOT: { value: "+18%", trend: "vs previous 30-day period", status: "Overtime Surge", tone: "rose" },
      deadlineDelays: { value: "+12%", trend: "pipeline delays", status: "Slippage Detected", tone: "amber" },
      absenceRate: { value: "5.2%", trend: "monitoring", status: "Within Range", tone: "blue" },
      reportRate: { value: "4 active", trend: "High signal density", status: "Priority Triage", tone: "emerald" },
    },
    metrics: {
      pulseResponseRate: { value: "81%", countText: "81 of 100 engineers", status: "Active Participation", tone: "blue" },
      reportsToReview: { value: 3, countText: "2 high priority", status: "Action Required", tone: "rose" },
      overdueActions: { value: 1, countText: "1 SLA pending", status: "Attention", tone: "amber" },
      avgResponseTime: { value: "1.2 Days", countText: "Engineering SLA", status: "Fast Triage", tone: "emerald" },
      totalEmployees: { value: 100, countText: "Engineering Pods", status: "Hybrid & Remote", tone: "blue" },
    },
    distribution: [
      { categoryId: "con_01", count: 24, percentage: 48 },
      { categoryId: "con_02", count: 18, percentage: 36 },
      { categoryId: "con_03", count: 5, percentage: 10 },
      { categoryId: "con_04", count: 3, percentage: 6 },
    ],
    summary: "Engineering shows recurring reports of competing priorities, unclear task ownership, and insufficient clarification of expected deliverables. Increased overtime (+18%) and deadline delays (+12%) suggest that the issue involves how work is assigned and coordinated, rather than individual time management alone.",
    recommendedInvestigation: "Review task allocation, onboarding guidance, manager communication, and the process for deciding which tasks take priority.",
    priorityConcerns: [
      {
        id: "CON-01",
        code: "CON-01",
        categoryKey: "con_01",
        title: "Burnout & Workload Imbalance",
        priority: "High",
        status: "Requires Investigation",
        detected: "Past 14 days",
        description: "Engineers report receiving new work before finishing existing tasks; overtime is up 18% with delayed deliverable sign-offs.",
        aiInterpretation: "Multiple anonymized signals indicate recurring task allocation ambiguity and workload friction among new hires in Engineering. HR should validate with manager context before assigning corrective action.",
        departmentsAffected: [
          "Engineering (High)"
        ],
        evidenceSummary: {
          pulseSurvey: "Engineering cohort (18 responses): Priority clarity rated low at 2.8/5 (-12% vs last cycle) with 14 engineers citing severe workload pressure and competing sprint deadlines.",
          recurringPattern: "Recurring friction pattern detected across 6 anonymized support interactions within Engineering over the past two weeks regarding task delegation.",
          feedbackCountSummary: "1 anonymous report and 3 voluntary feedback submissions from Engineering pods.",
          feedbackItems: [
            "Anonymous report: Expresses distress over senior colleagues repeatedly passing down documentation work without checking existing sprint capacity.",
            "Voluntary feedback: Engineers note uncertainty over whether they can refuse ad-hoc documentation tasks when sprint deliverables are due."
          ],
          community: "24 employees upvoted a peer advice thread on 'How to handle extra tasks passed down by senior peers without clear priorities' (7 comments).",
          operationalIndicators: [
            "Engineering overtime: increased by 18% over the past 30 days.",
            "Deadline collisions: 2 new hires affected with 3 conflicting deliverables in JIRO."
          ]
        },
        recommendedNextStep: [
          "Review task allocation and priority confirmation procedures with Head of Engineering.",
          "Check whether task owner, priority, and deadline impact are confirmed before handoff.",
          "Establish an escalation path for conflicting sprint deliverables."
        ]
      },
      {
        id: "CON-02",
        code: "CON-02",
        categoryKey: "con_02",
        title: "Unclear Role Expectations & Poor Manager Support",
        priority: "High",
        status: "Requires Review",
        detected: "Past 21 days",
        description: "Conflicting architectural instructions between tech leads and ambiguous deliverable expectations.",
        aiInterpretation: "Signals suggest junior engineers face ambiguous acceptance criteria and conflicting guidance across technical leads, lengthening PR cycles to 4+ days. Standardizing task briefs and review SLAs is recommended.",
        departmentsAffected: [
          "Engineering (High)"
        ],
        evidenceSummary: {
          pulseSurvey: "Engineering cohort (16 responses): Role clarity index declined 14% to 3.0/5 among engineers under 6 months tenure.",
          recurringPattern: "4 anonymized Eko inquiries on architectural standards and conflicting technical guidance between squad leads.",
          feedbackCountSummary: "1 anonymous report and 5 voluntary feedback submissions from Engineering squads.",
          feedbackItems: [
            "Anonymous report: Notes contradictory technical directives between tech leads delaying payment gateway sign-off.",
            "Voluntary feedback: Inquiries requesting explicit definition-of-done and standardized task briefs for sprint items."
          ],
          community: "Squad onboarding discussion on 'Unwritten PR review standards and conflicting lead directives' received 8 upvotes.",
          operationalIndicators: [
            "PR review turnaround: lengthened to 4.2 days across squads (target SLA: 24 hours).",
            "1-on-1 cadence adherence: dropped to 68% for junior cohort over the past 14 days."
          ]
        },
        recommendedNextStep: [
          "Standardise task briefs with explicit acceptance criteria and review SLAs.",
          "Enforce 24-hour PR review SLA on junior submissions.",
          "Align technical leads on architectural standards during weekly manager sync."
        ]
      }
    ],
    reports: [
      {
        id: "R004",
        employeeCode: "ANON-4827",
        isAnonymous: true,
        anonymityType: "Department-Level Anonymous",
        department: "Engineering",
        tenure: "5 months",
        submissionDate: "20 October 2026",
        date: "Today, 20 Oct",
        priority: "High",
        status: "Action Required",
        statusType: "action_needed",
        urgencyLabel: "Need Action",
        concernCategory: "con_01",
        concernTitle: "Repeated workload transfers and conflicting priorities",
        blocker: "Senior peer transfers testing work; manager directives unclear without priority guidance",
        privacySetting: "Department visible, identity hidden",
        referenceCode: "ANON-4827",
        snippet: "A senior colleague repeatedly transfers testing and documentation work without checking existing commitments. My manager gives unclear instructions and does not consistently resolve conflicting deadlines.",
        suggestedAction: "Route to Head of Engineering and establish priority confirmation workflow"
      },
      {
        id: "R001",
        employeeCode: "Fully Anonymous",
        isAnonymous: true,
        anonymityType: "Full Anonymity",
        department: "Undisclosed",
        tenure: "Hidden",
        submissionDate: "16 October 2026",
        date: "4 days ago",
        priority: "High",
        status: "In Progress",
        statusType: "review",
        urgencyLabel: "In Progress",
        concernCategory: "con_02",
        concernTitle: "Unclear sprint priorities & conflicting technical reviews",
        blocker: "Contradictory directives between tech leads stalling PR approvals",
        privacySetting: "Department visible, identity hidden",
        referenceCode: "ANON-3912",
        snippet: "Two technical leads provided contradictory architectural instructions for a payment gateway refactoring task.",
        suggestedAction: "Standardise code review guidelines"
      }
    ]
  },
  product: {
    name: "Product",
    headcount: 55,
    mainConcern: "Recognition & career growth",
    relativeSignal: "Medium",
    metrics: {
      pulseResponseRate: { value: "76%", countText: "42 of 55 employees", status: "Healthy", tone: "blue" },
      reportsToReview: { value: 2, countText: "1 medium priority", status: "Scheduled", tone: "rose" },
      overdueActions: { value: 0, countText: "0 overdue", status: "All Clean", tone: "amber" },
      avgResponseTime: { value: "1.6 Days", countText: "Product SLA", status: "Normal", tone: "emerald" },
      totalEmployees: { value: 55, countText: "Product & Design", status: "Hybrid", tone: "blue" },
    },
    distribution: [
      { categoryId: "con_03", count: 12, percentage: 46 },
      { categoryId: "con_02", count: 8, percentage: 31 },
      { categoryId: "con_04", count: 4, percentage: 15 },
      { categoryId: "con_01", count: 2, percentage: 8 },
    ],
    priorityConcerns: [
      {
        id: "CON-03",
        code: "CON-03",
        categoryKey: "con_03",
        title: "Lack of Recognition & Career Growth",
        priority: "Medium",
        status: "Monitoring",
        description: "Designers report extra hours unnoticed and unclear advancement paths.",
        evidenceSummary: {
          pulseSurvey: "Recognition index scored 4.2/10 among product specialists.",
          community: "Community post on unnoticed effort received 11 upvotes."
        },
        recommendedNextStep: "Institute structured milestone appreciation and career progression roadmaps."
      }
    ],
    reports: [
      {
        id: "R003",
        employeeCode: "EMP-ANON",
        isAnonymous: true,
        department: "Product",
        tenure: "4 months",
        date: "Yesterday",
        priority: "Medium",
        status: "New",
        statusType: "urgent",
        concernCategory: "con_02",
        concernTitle: "Unclear expectations for product deliverables",
        snippet: "I often receive requests without a clear definition of what the final deliverable should look like. I spend extra time checking examples and redoing work.",
        suggestedAction: "Standardise deliverable templates"
      }
    ]
  },
  sales: {
    name: "Sales & Marketing",
    headcount: 65,
    mainConcern: "Workload imbalance & poor manager support",
    relativeSignal: "High",
    metrics: {
      pulseResponseRate: { value: "74%", countText: "48 of 65 reps", status: "Monitoring", tone: "blue" },
      reportsToReview: { value: 2, countText: "1 high priority", status: "Action Required", tone: "rose" },
      overdueActions: { value: 1, countText: "1 past target", status: "Overdue", tone: "amber" },
      avgResponseTime: { value: "2.1 Days", countText: "Sales SLA", status: "SLA Warning", tone: "emerald" },
      totalEmployees: { value: 65, countText: "Sales Pods", status: "Hybrid", tone: "blue" },
    },
    distribution: [
      { categoryId: "con_01", count: 14, percentage: 44 },
      { categoryId: "con_02", count: 10, percentage: 32 },
      { categoryId: "con_03", count: 5, percentage: 16 },
      { categoryId: "con_04", count: 3, percentage: 8 },
    ],
    priorityConcerns: [
      {
        id: "CON-01",
        code: "CON-01",
        categoryKey: "con_01",
        title: "Burnout & Workload Imbalance",
        priority: "High",
        status: "Requires Investigation",
        description: "BDRs covering senior colleague quotas during ramp-up leading to critical overtime.",
        departmentsAffected: [
          "Sales & Marketing (High)"
        ],
        aiInterpretation: "Sales telemetry and survey responses indicate early-tenure sales representatives are absorbing unmanaged quota transfers during enterprise closing periods without formal ramp relief.",
        evidenceSummary: {
          pulseSurvey: "Sales & Marketing cohort (14 responses): 9 sales reps cite covering additional quotas without quota relief or timeline adjustments (workload score: 2.6/5).",
          recurringPattern: "4 anonymized Eko inquiries regarding ramp-up quota expectations and weekend shift expectations.",
          feedbackCountSummary: "1 anonymous report and 2 voluntary feedback submissions from Sales.",
          feedbackItems: [
            "Anonymous report: Expresses fatigue over extended shifts while covering senior account executive quotas without credit.",
            "Voluntary feedback: Inquiries requesting quota relief guidelines during unexpected senior peer absences."
          ],
          community: "Discussion thread on 'Unreasonable ramp expectations during enterprise deal close' received 12 upvotes.",
          operationalIndicators: [
            "Sales telemetry: late-night prospecting activity up 24% over the past 3 weeks.",
            "Pipeline quota coverage: 3 junior reps carrying 140% of baseline target."
          ]
        },
        recommendedNextStep: [
          "Review ramp-up quota policies and temporary coverage credits with Sales Director.",
          "Establish formal re-allocation protocol for accounts during extended peer leave.",
          "Conduct workload check-in with new BDR cohort."
        ]
      }
    ],
    reports: [
      {
        id: "R002",
        employeeCode: "EMP-ANON",
        isAnonymous: true,
        department: "Sales & Marketing",
        tenure: "65 Days",
        date: "3 days ago",
        priority: "High",
        status: "Overdue",
        statusType: "overdue",
        concernCategory: "con_01",
        concernTitle: "Extended shifts while covering senior colleague's quota",
        snippet: "I am repeatedly covering additional work while still being expected to meet my own targets. My working hours have increased.",
        suggestedAction: "Manager remediation required (3 days past SLA)"
      }
    ]
  },
  support: {
    name: "Customer Success",
    headcount: 45,
    mainConcern: "Collaboration & organisational change",
    relativeSignal: "Medium",
    metrics: {
      pulseResponseRate: { value: "82%", countText: "37 of 45 agents", status: "Good", tone: "blue" },
      reportsToReview: { value: 1, countText: "0 high priority", status: "Controlled", tone: "rose" },
      overdueActions: { value: 0, countText: "0 overdue", status: "All Clean", tone: "amber" },
      avgResponseTime: { value: "1.1 Days", countText: "Support SLA", status: "Fast Triage", tone: "emerald" },
      totalEmployees: { value: 45, countText: "Customer Support", status: "Remote", tone: "blue" },
    },
    distribution: [
      { categoryId: "con_04", count: 8, percentage: 45 },
      { categoryId: "con_03", count: 5, percentage: 28 },
      { categoryId: "con_02", count: 3, percentage: 17 },
      { categoryId: "con_01", count: 2, percentage: 10 },
    ],
    priorityConcerns: [
      {
        id: "CON-04",
        code: "CON-04",
        categoryKey: "con_04",
        title: "Collaboration & Organisational Change",
        priority: "Medium",
        status: "Monitoring",
        description: "Remote agents feel disconnected from product decision channels during rapid ticketing shifts.",
        departmentsAffected: [
          "Customer Success (Medium)"
        ],
        aiInterpretation: "Support agents report procedural friction following recent ticketing changes, where lack of bi-directional feedback between Product and Support creates unnecessary handoff friction.",
        evidenceSummary: {
          pulseSurvey: "Customer Success cohort (15 responses): Collaboration satisfaction rated at 5.4/10 (-18% following ticketing restructure).",
          recurringPattern: "5 anonymized Eko inquiries on escalation paths for unhandled product defects.",
          feedbackCountSummary: "2 voluntary feedback submissions from Support agents.",
          feedbackItems: [
            "Voluntary feedback: Disconnect between tier-1 triage notes and product bug fix notifications.",
            "Voluntary feedback: Lack of visibility into sprint fix schedules for customer escalations."
          ],
          community: "Peer thread on 'Remote agent isolation and disconnected product channels' received 14 upvotes.",
          operationalIndicators: [
            "Ticket re-assignment frequency: increased by 22% across support queues.",
            "Escalation turnaround time: lengthened to 3.2 days for cross-department issues."
          ]
        },
        recommendedNextStep: [
          "Establish daily cross-team triage huddles and shared decision logs.",
          "Implement real-time product fix notification channel for tier-1 agents.",
          "Review escalation protocol to eliminate repetitive handoffs."
        ]
      }
    ],
    reports: []
  },
  operations: {
    name: "Operations",
    headcount: 35,
    mainConcern: "Collaboration & organisational change",
    relativeSignal: "Medium",
    metrics: {
      pulseResponseRate: { value: "77%", countText: "27 of 35 employees", status: "Stable", tone: "blue" },
      reportsToReview: { value: 0, countText: "No active reports", status: "All Clean", tone: "rose" },
      overdueActions: { value: 0, countText: "0 overdue", status: "All Clean", tone: "amber" },
      avgResponseTime: { value: "1.0 Days", countText: "Ops SLA", status: "Fast Triage", tone: "emerald" },
      totalEmployees: { value: 35, countText: "Operations & Admin", status: "Hybrid", tone: "blue" },
    },
    distribution: [
      { categoryId: "con_04", count: 6, percentage: 50 },
      { categoryId: "con_02", count: 3, percentage: 25 },
      { categoryId: "con_01", count: 2, percentage: 17 },
      { categoryId: "con_03", count: 1, percentage: 8 },
    ],
    priorityConcerns: [
      {
        id: "CON-04",
        code: "CON-04",
        categoryKey: "con_04",
        title: "Collaboration & Organisational Change",
        priority: "Medium",
        status: "Monitoring",
        description: "Workflow updates rolled out without explanatory guides create procedural uncertainty.",
        departmentsAffected: [
          "Operations (Medium)"
        ],
        aiInterpretation: "Operations employees are encountering execution hurdles due to rapid workflow updates deployed without accompanying training or documentation.",
        evidenceSummary: {
          pulseSurvey: "Operations cohort (11 responses): Process clarity score dipped 22% after latest ERP tool change.",
          recurringPattern: "3 anonymized Eko inquiries requesting training materials for revised procurement procedures.",
          feedbackCountSummary: "1 voluntary feedback submission from Operations team.",
          feedbackItems: [
            "Voluntary feedback: Inquiries regarding missing change documentation for the new vendor payment workflow."
          ],
          community: "Team feedback thread on 'Uncommunicated ERP process adjustments' received 9 upvotes.",
          operationalIndicators: [
            "Procurement cycle time: lengthened by 2.4 days due to workflow errors.",
            "Invoice rework rate: increased by 15% across departmental submissions."
          ]
        },
        recommendedNextStep: [
          "Provide standardized change logs and transition training sessions.",
          "Host Q&A office hours for upcoming process migrations.",
          "Create quick-reference process guides for updated procurement flows."
        ]
      }
    ],
    reports: []
  }
};

// Department breakdown table from Demo.md Section 9.B
export const DEPARTMENT_BREAKDOWN_TABLE = [
  { id: "engineering", name: "Engineering", employees: 100, mainConcern: "Workload imbalance & unclear expectations", signal: "High", categories: ["con_01", "con_02"] },
  { id: "product", name: "Product", employees: 55, mainConcern: "Recognition & career growth", signal: "Medium", categories: ["con_03"] },
  { id: "sales", name: "Sales & Marketing", employees: 65, mainConcern: "Workload imbalance & poor manager support", signal: "High", categories: ["con_01", "con_02"] },
  { id: "support", name: "Customer Success", employees: 45, mainConcern: "Collaboration & organisational change", signal: "Medium", categories: ["con_04"] },
  { id: "operations", name: "Operations", employees: 35, mainConcern: "Collaboration & organisational change", signal: "Medium", categories: ["con_04"] },
];

// Community Board posts mapped to consolidated categories (Demo.md Section 6 & 13)
export const COMMUNITY_POSTS = [
  {
    id: "COM-1",
    author: "Anonymous Employee",
    department: "Engineering",
    time: "16 October 2026",
    badge: "Anonymous",
    title: "Drowning in conflicting deadlines & vague instructions... is this normal for new hires? :/",
    content: `tbh I'm not sure if I'm just struggling to ramp up or if this is actually chaotic. My manager literally just drops 1-sentence Slack messages like "make sure the client launch stuff is ready by Friday :)" with zero context on what needs to be in it.

At the exact same time, a senior dev on my team dumped their leftover testing documentation onto my board. When I politely asked which one takes priority because I already have 40h of sprint tickets, I just got told "both are top priority lol".

I've been staying late off-the-clock every night this week just trying not to drop anything, but I feel so burnt out already 😭. I want to push back, but since I'm only 5 months in, I'm scared I'll get branded as "difficult" or incompetent.

How do you guys deal with competing priorities when nobody will give you a straight answer? Any advice appreciated!`,
    upvotes: 24,
    userUpvoted: false,
    comments: 3,
    tag: "Workload & Role Clarity",
    categoryKey: "con_01",
    replies: [
      {
        author: "Anonymous Employee 1",
        time: "16 Oct",
        text: "Do NOT work off-the-clock, you're masking bad planning. Email them: 'I can deliver A by Friday, or B. Which one should I pause?' Put the trade-off back on them in writing 👍"
      },
      {
        author: "Anonymous Employee 2",
        time: "16 Oct",
        text: "Classic senior move dumping unglamorous doc tickets on the new joiner haha. Check with your manager first before taking on work passed down unofficially."
      },
      {
        author: "Anonymous Employee 3",
        time: "17 Oct",
        text: "If everything is P0, nothing is P0. Don't sacrifice your mental health trying to be a hero :)"
      }
    ]
  },
  {
    id: "COM-2",
    author: "Anonymous Employee",
    department: "Product",
    time: "15 October 2026",
    badge: "Anonymous",
    title: "Putting in extra hours and crickets... how do you stay motivated? 🙃",
    content: "Stayed until 9pm two nights in a row to help the team unblock a release blocker, but not even a quick 'thanks' or acknowledgement. Meanwhile, miss one minor deadline by 2 hours and everyone notices immediately haha.\n\nNot asking for a parade, but a little positive reinforcement goes a long way when you're working hard ✨",
    upvotes: 11,
    userUpvoted: false,
    comments: 2,
    tag: "Recognition & Career Growth",
    categoryKey: "con_03",
    replies: [
      {
        author: "Anonymous Employee",
        time: "15 Oct",
        text: "Specific feedback helps so much more than silence! Totally agree with you."
      },
      {
        author: "Anonymous Employee",
        time: "16 Oct",
        text: "Same here. When management only speaks up when things break, it kills morale fast."
      }
    ]
  },
  {
    id: "COM-3",
    author: "Anonymous Employee",
    department: "Sales & Marketing",
    time: "17 October 2026",
    badge: "Anonymous",
    title: "Are your 1-on-1s actually useful or just status updates? :(",
    content: "Every 1-on-1 feels like a rushed 10-minute ticket status check: 'Did you finish ticket X? Okay cool.' I rarely get actual feedback on how I'm doing or where to improve until something blows up :(\n\nHow do you steer 1-on-1s towards actual career development and clearing blockers without sounding needy?",
    upvotes: 8,
    userUpvoted: false,
    comments: 1,
    tag: "Manager Support & Guidance",
    categoryKey: "con_02",
    replies: [
      {
        author: "Anonymous Employee",
        time: "17 Oct",
        text: "Bring an agenda! I send my manager 3 bullet points 24h before: 1 blocker, 1 priority trade-off, 1 skill goal. Changed the game for me."
      }
    ]
  },
  {
    id: "COM-4",
    author: "Anonymous Employee",
    department: "Customer Success",
    time: "18 October 2026",
    badge: "Anonymous",
    title: "Feeling a bit left out of the loop on remote days 😅",
    content: "Anyone else feel like key decisions get made casually at someone's desk on in-office days, and if you're remote that day you only find out after you've already spent half a day doing it the old way? 😅 A shared Slack decision log would save so much rework.",
    upvotes: 5,
    userUpvoted: false,
    comments: 1,
    tag: "Collaboration & Change",
    categoryKey: "con_04",
    replies: [
      {
        author: "Anonymous Employee",
        time: "18 Oct",
        text: "100%. If it wasn't typed in the squad channel, it didn't happen. That should be standard practice."
      }
    ]
  }
];

// Official HR Announcement from Demo.md Section 6.1 & 13
export const OFFICIAL_ANNOUNCEMENT = {
  id: "ANN-01",
  author: "Nexora People & Culture Team",
  badge: "Official HR Action Plan",
  posted: "20 October 2026",
  title: "📢 You said, we did: Clearer task ownership and workload support for new hires",
  content: `Several employees raised concerns about unclear task ownership and workload conflicts. We have updated the new-hire prioritization guide, clarified task ownership, and introduced a weekly workload check-in for new hires in affected departments.

Thank you for speaking up. Your feedback helps us improve how we support new employees.`,
  acknowledged: false
};

// Action Plan AP-01 from Demo.md Specification
export const ACTION_PLAN_AP01 = {
  id: "AP-01",
  title: "Review task allocation and priority-setting for new hires",
  linkedConcern: "CON-01",
  linkedConcernTitle: "Burnout & Workload Imbalance",
  linkedReport: "R004",
  priority: "High",
  owner: "Daniel Lim",
  department: "Engineering",
  due: "30 Oct 2026",
  dueDate: "30 Oct 2026",
  status: "In progress",
  progress: 50,
  lastUpdate: "23 Oct 2026 (Today)",
  created: "20 October 2026",
  anonymizedSummary: "Employees report increasing workloads, competing deadlines, and difficulty refusing additional work without fear of negative evaluation. Senior colleagues repeatedly pass down documentation work without checking existing sprint commitments.",
  managerUpdate: "Reviewed current task-allocation practice. Added requirement that senior colleagues confirm task owner and priority before delegating documentation work. Weekly new-hire priority check-in scheduled from 3 Nov.",
  managerUpdateDate: "23 Oct 2026, 14:30",
  outcomeTracking: {
    ekoAiPatterns: {
      label: "Related EkoAI patterns",
      trend: "Reduced from 6 to 2",
      change: "-67%",
      status: "Significant Improvement",
      details: "Support inquiries mentioning 'task handoff' or 'competing priorities' dropped from 6 to 2 over the past 14 days."
    },
    newReports: {
      label: "New related reports",
      trend: "0 new reports",
      change: "No new reports",
      status: "Safe Range",
      details: "No new related anonymous or named reports submitted in past 14 days."
    },
    communityActivity: {
      label: "Community board activity",
      trend: "Friction thread cooled",
      change: "Resolved",
      details: "No new complaint threads. 1 positive comment acknowledging clearer priority discussions in COM-1 thread."
    },
    pulseTrend: {
      label: "Pulse survey trend",
      trend: "Priority clarity 2.8 → 3.4 / 5",
      change: "+21%",
      status: "Positive Recovery",
      details: "Role clarity and priority manageability scores improved 21% in the latest weekly pulse check-in."
    },
    operationalIndicators: {
      label: "Operational indicators",
      trend: "Overtime +18% → +6%",
      change: "Improving",
      status: "Within SLA",
      details: "Engineering overtime surge moderated from +18% to +6%. JIRO deadline collisions dropped from 3 to 0."
    }
  },
  actionItems: [
    {
      id: "ACT-01",
      title: "Review task allocation and informal handoffs to new hires",
      owner: "Daniel Lim (Engineering Manager)",
      due: "23 Oct 2026",
      completed: true,
      status: "Completed"
    },
    {
      id: "ACT-02",
      title: "Clarify task ownership before assigning additional work",
      owner: "Daniel Lim (Engineering Manager)",
      due: "25 Oct 2026",
      completed: true,
      status: "Completed"
    },
    {
      id: "ACT-03",
      title: "Introduce a weekly workload and priority check-in for new hires (scheduled from 3 Nov)",
      owner: "Daniel Lim & Squad Leads",
      due: "30 Oct 2026",
      completed: false,
      status: "In progress"
    },
    {
      id: "ACT-04",
      title: "Establish an escalation path for conflicting sprint deadlines",
      owner: "Daniel Lim (Engineering Manager)",
      due: "30 Oct 2026",
      completed: false,
      status: "In progress"
    },
    {
      id: "ACT-05",
      title: "Reassign or reschedule additional testing documentation across senior peers",
      owner: "Engineering Leads",
      due: "30 Oct 2026",
      completed: false,
      status: "Scheduled"
    }
  ]
};

// All Action Plans list for the Actions & Follow-up page
export const ACTION_PLANS_LIST = [
  ACTION_PLAN_AP01,
  {
    id: "AP-02",
    title: "Standardize task briefs & enforce 24h PR review SLA",
    linkedConcern: "CON-02",
    linkedConcernTitle: "Unclear Role Expectations & Poor Manager Support",
    linkedReport: "R002",
    priority: "High",
    owner: "Elena Chen",
    department: "Engineering",
    due: "05 Nov 2026",
    dueDate: "05 Nov 2026",
    status: "Awaiting manager update",
    progress: 25,
    lastUpdate: "22 Oct 2026",
    created: "19 October 2026",
    anonymizedSummary: "Junior engineers face ambiguous acceptance criteria and conflicting guidance across technical leads, lengthening PR review cycles to 4+ days.",
    managerUpdate: "Drafted standardized PR checklist with squad leads. Initial pilot launched in squad Alpha; awaiting squad feedback before company-wide enforcement.",
    managerUpdateDate: "22 Oct 2026, 17:15",
    outcomeTracking: {
      ekoAiPatterns: {
        label: "Related EkoAI patterns",
        trend: "4 queries → 3 queries",
        change: "-25%",
        status: "Early Stage",
        details: "Technical ambiguity queries decreased slightly as initial squad brief guidelines circulate."
      },
      newReports: {
        label: "New related reports",
        trend: "0 new reports",
        change: "Stable",
        status: "Safe Range",
        details: "No new escalation reports logged in the past 7 days."
      },
      communityActivity: {
        label: "Community board activity",
        trend: "Discussion stabilized",
        change: "Neutral",
        details: "Peer onboarding thread COM-2 received 2 helpful suggestions from senior engineers."
      },
      pulseTrend: {
        label: "Pulse survey trend",
        trend: "Deliverable clarity 3.0 / 5",
        change: "+5%",
        status: "Monitoring",
        details: "Manager guidance score steady at 3.1/5; deliverable clarity up 0.2 points."
      },
      operationalIndicators: {
        label: "Operational indicators",
        trend: "PR turnaround 4.2d → 3.6d",
        change: "Improving",
        status: "Target: 24h",
        details: "PR turnaround reduced from 4.2 days to 3.6 days; continuing to work towards 24h SLA."
      }
    },
    actionItems: [
      {
        id: "ACT-21",
        title: "Draft standardized sprint task briefs with clear acceptance criteria",
        owner: "Elena Chen (Head of Engineering)",
        due: "28 Oct 2026",
        completed: true,
        status: "Completed"
      },
      {
        id: "ACT-22",
        title: "Implement automated 24h PR review reminders in GitHub/Slack",
        owner: "DevOps Squad Lead",
        due: "02 Nov 2026",
        completed: false,
        status: "In progress"
      },
      {
        id: "ACT-23",
        title: "Mandate bi-weekly technical 1-on-1s for probationary engineers",
        owner: "Engineering Managers",
        due: "05 Nov 2026",
        completed: false,
        status: "Pending"
      }
    ]
  },
  {
    id: "AP-03",
    title: "Cross-functional recognition framework for release contributors",
    linkedConcern: "CON-03",
    linkedConcernTitle: "Lack of Recognition & Career Growth",
    linkedReport: "R006",
    priority: "Medium",
    owner: "Marcus Brody",
    department: "Product",
    due: "12 Nov 2026",
    dueDate: "12 Nov 2026",
    status: "Monitoring",
    progress: 80,
    lastUpdate: "21 Oct 2026",
    created: "15 October 2026",
    anonymizedSummary: "Product and support engineers reported feeling uncredited after major releases, with feedback primarily focused on minor bugs rather than core contributions.",
    managerUpdate: "Launched 'Release Heroes' shout-out program at all-hands and introduced peer-spotlight bonus nominations. Feedback from teams has been overwhelmingly positive.",
    managerUpdateDate: "21 Oct 2026, 11:20",
    outcomeTracking: {
      ekoAiPatterns: {
        label: "Related EkoAI patterns",
        trend: "5 queries → 1 query",
        change: "-80%",
        status: "Resolved",
        details: "Career stagnation queries from Product cohort decreased significantly."
      },
      newReports: {
        label: "New related reports",
        trend: "0 new reports",
        change: "Clear",
        status: "Safe Range",
        details: "Zero recognition concerns logged this sprint."
      },
      communityActivity: {
        label: "Community board activity",
        trend: "14 kudos posted",
        change: "+300%",
        status: "Vibrant",
        details: "Community recognition channel shows active peer appreciation for launch milestones."
      },
      pulseTrend: {
        label: "Pulse survey trend",
        trend: "Recognition score 2.5 → 3.8 / 5",
        change: "+52%",
        status: "Significant Gain",
        details: "Employee recognition satisfaction rebounded to 3.8/5 in Product and Support."
      },
      operationalIndicators: {
        label: "Operational indicators",
        trend: "Retention risk lowered",
        change: "Safe",
        status: "Healthy",
        details: "Disengagement warning flags in Product cleared for 100% of junior cohort."
      }
    },
    actionItems: [
      {
        id: "ACT-31",
        title: "Introduce cross-functional release celebration shout-outs",
        owner: "Marcus Brody (Product Director)",
        due: "20 Oct 2026",
        completed: true,
        status: "Completed"
      },
      {
        id: "ACT-32",
        title: "Establish quarterly growth roadmap reviews with Lead HRBP",
        owner: "Sarah Jenkins & Marcus Brody",
        due: "05 Nov 2026",
        completed: true,
        status: "Completed"
      },
      {
        id: "ACT-33",
        title: "Evaluate 30-day post-rollout satisfaction survey",
        owner: "People & Culture Team",
        due: "12 Nov 2026",
        completed: false,
        status: "Scheduled"
      }
    ]
  },
  {
    id: "AP-04",
    title: "Hybrid squad decision log & asynchronous documentation protocol",
    linkedConcern: "CON-04",
    linkedConcernTitle: "Collaboration & Organisational Change",
    linkedReport: "R005",
    priority: "Low",
    owner: "Priya Patel",
    department: "Operations",
    due: "18 Oct 2026",
    dueDate: "18 Oct 2026",
    status: "Completed",
    progress: 100,
    lastUpdate: "19 Oct 2026",
    created: "10 October 2026",
    anonymizedSummary: "Remote workers felt disconnected from informal in-office decisions, creating confusion and duplicated work across hybrid working days.",
    managerUpdate: "Completed all squad training sessions on the new decision log protocol. Slack-to-Notion integration active across all 5 departments.",
    managerUpdateDate: "19 Oct 2026, 16:45",
    outcomeTracking: {
      ekoAiPatterns: {
        label: "Related EkoAI patterns",
        trend: "3 queries → 0 queries",
        change: "-100%",
        status: "Resolved",
        details: "No hybrid communication friction logged in Eko assistant over the past 2 weeks."
      },
      newReports: {
        label: "New related reports",
        trend: "0 new reports",
        change: "Clear",
        status: "Safe Range",
        details: "Operations communication concerns resolved with 100% audit compliance."
      },
      communityActivity: {
        label: "Community board activity",
        trend: "COM-4 thread verified",
        change: "Resolved",
        details: "Thread marked resolved after decision log template was shared and pinned."
      },
      pulseTrend: {
        label: "Pulse survey trend",
        trend: "Hybrid inclusion 4.1 / 5",
        change: "+18%",
        status: "Healthy",
        details: "Remote employee inclusion score reached highest level this quarter."
      },
      operationalIndicators: {
        label: "Operational indicators",
        trend: "Decision rework 0%",
        change: "Optimal",
        status: "Standardized",
        details: "Zero rework tickets attributed to communication gaps in October."
      }
    },
    actionItems: [
      {
        id: "ACT-41",
        title: "Set up asynchronous decision log template in Notion",
        owner: "Priya Patel (Operations)",
        due: "14 Oct 2026",
        completed: true,
        status: "Completed"
      },
      {
        id: "ACT-42",
        title: "Integrate decision log bot into squad Slack channels",
        owner: "DevOps & IT",
        due: "16 Oct 2026",
        completed: true,
        status: "Completed"
      },
      {
        id: "ACT-43",
        title: "Conduct department briefing on remote-first documentation standards",
        owner: "Priya Patel",
        due: "18 Oct 2026",
        completed: true,
        status: "Completed"
      }
    ]
  }
];

// Daniel Lim's Profile (Engineering Manager - Mode 1)
export const DANIEL_PROFILE = {
  name: "Daniel Lim",
  role: "Engineering Manager",
  department: "Engineering",
  departmentLabel: "Department A / Engineering",
  assignedActionTitle: "Clarify task ownership and review workload allocation for new hires",
  assignedBy: "Sarah Lee, HR",
  concernTheme: "Unclear task ownership and workload conflict among new hires",
  hrInstruction: "We have identified a recurring concern among new hires in Engineering related to unclear task ownership and workload conflicts. Please review current workload allocation, clarify task ownership before assigning additional work, and introduce a weekly workload check-in during the first 90 days. Please update EchoHR when the action is completed.",
  deadline: "Two weeks from assignment (Friday, 30 Oct)",
  priority: "High",
  status: "Assigned"
};

// Maya's Profile and Journey Context
export const MAYA_PROFILE = {
  name: "Maya Tan",
  role: "Junior Software Engineer",
  department: "Engineering",
  tenure: "5 months",
  workArrangement: "Hybrid",
  manager: "Daniel Lim",
  seniorColleague: "Alex Wong",
  hrOwner: "Sarah Lee, Senior HR Business Partner",
  escalationAuthority: "Head of Engineering",
  referenceCode: "ANON-4827",
  // Section 5.B Historical Pulse Check-in Scores
  pulseHistory: [
    { measure: "Workload manageability", previous: 8, current: 6, followUp: 7 },
    { measure: "Role clarity", previous: 8, current: 6, followUp: 8 },
    { measure: "Manager support", previous: 8, current: 6, followUp: 8 },
    { measure: "Comfort asking for help", previous: 8, current: 6, followUp: 8 },
  ],
  pulseComment: "Quite a busy week, but I'm managing. There were a few things I wasn't sure about.",
  followUpComment: "It's easier to understand what needs to be done first now. When new tasks come in, we discuss what should move instead of trying to finish everything at once. I feel more comfortable asking for clarification."
};

// Company Policies & Knowledge Base (Referenced by Eko AI to answer workplace issues)
export const COMPANY_POLICIES = [
  {
    id: "HR-POL-014",
    title: "Workload Allocation, Overtime & Task Delegation Policy",
    category: "workload",
    categoryLabel: "Workload & Hours",
    lastUpdated: "15 Oct 2026",
    version: "v3.2",
    effectiveDate: "01 Jan 2026",
    summary: "Governs sprint capacity limits, protects junior team members from ad-hoc task offloading, and establishes explicit overtime approval and compensatory rest guidelines.",
    ekoUsage: "Eko references this policy when diagnosing sprint overload, evaluating whether peer-delegated tasks require manager approval, and helping employees negotiate priorities.",
    keyGuidelines: [
      {
        clause: "Clause 4.1 - Junior Tenure Protection",
        text: "Employees in their first 6 months shall not be assigned unestimated peer tasks without prior approval from their designated people manager."
      },
      {
        clause: "Clause 4.2 - Sprint WIP Limits",
        text: "Sprint task commitments exceeding 85% of total capacity must trigger a backlog review to defer lower-priority items."
      },
      {
        clause: "Clause 5.3 - Overtime & TOIL",
        text: "Overtime exceeding 5 hours in any working week requires manager pre-approval and is eligible for Time-Off-In-Lieu (TOIL)."
      }
    ],
    faqs: [
      {
        q: "Can a senior colleague assign me extra work directly?",
        a: "Under Clause 4.1, extra tasks passed from peers must be reviewed with your manager if they impact your core sprint commitments."
      },
      {
        q: "What should I do if my sprint is over capacity?",
        a: "Notify your manager early. Under Clause 4.2, work must be reprioritized rather than expecting sustained overtime."
      }
    ]
  },
  {
    id: "ENG-SOP-008",
    title: "Sprint Task Handoff, Definition of Done & Client Launch Standards",
    category: "task_ownership",
    categoryLabel: "Task Ownership & Onboarding",
    lastUpdated: "02 Oct 2026",
    version: "v2.4",
    effectiveDate: "15 Mar 2026",
    summary: "Standard operating procedures for cross-functional task handovers, documentation requirements, and client launch release deliverables.",
    ekoUsage: "Eko uses this standard to retrieve checklists (such as the Client Launch Checklist) and define what materials an engineer is expected to prepare.",
    keyGuidelines: [
      {
        clause: "Clause 2.1 - Task Handoff Brief",
        text: "Any task delegated to another engineer must include acceptance criteria, target environment, and estimated completion effort."
      },
      {
        clause: "Clause 2.3 - Client Launch Checklist",
        text: "Client launch readiness requires: (1) Approved corporate presentation deck, (2) Product feature brief, (3) QA demo checklist, and (4) Project lead sign-off."
      },
      {
        clause: "Clause 3.2 - Definition of Done",
        text: "Testing documentation must accompany feature releases, but ownership remains with the authoring engineer unless explicitly reassigned in sprint planning."
      }
    ],
    faqs: [
      {
        q: "Where do I find the approved slide deck template for launch meetings?",
        a: "Corporate Marketing & Product templates are linked in the internal design system repository under /templates/client-launch."
      },
      {
        q: "Am I required to finish someone else's testing documentation?",
        a: "Only if formally reassigned in sprint planning. Ad-hoc requests should be verified with your engineering manager."
      }
    ]
  },
  {
    id: "HR-POL-021",
    title: "Psychological Safety, Confidential Reporting & Non-Retaliation Policy",
    category: "grievance",
    categoryLabel: "Grievance & Safety",
    lastUpdated: "28 Sep 2026",
    version: "v4.0",
    effectiveDate: "01 Feb 2026",
    summary: "Guarantees reporter privacy, anonymous reference code tracking, and strict immunity against any direct or indirect retaliation for raising concerns.",
    ekoUsage: "Eko consults this policy to explain reporting privacy levels (full anonymous vs confidential) and advise employees on their protections.",
    keyGuidelines: [
      {
        clause: "Clause 1.2 - Absolute Non-Retaliation",
        text: "Zero tolerance for retaliation. Any adverse career impact, negative review influence, or social exclusion will result in disciplinary action up to dismissal."
      },
      {
        clause: "Clause 3.1 - Anonymous Reference Tracking",
        text: "Submissions generate isolated codes (e.g., ANON-4827) allowing two-way communication without exposing employee identity to reviewers."
      },
      {
        clause: "Clause 5.2 - Investigation SLAs",
        text: "HR business partners must acknowledge and begin initial triage on high-severity workplace friction reports within 48 business hours."
      }
    ],
    faqs: [
      {
        q: "Will my manager know if I submit a confidential report?",
        a: "No. If you choose Anonymous or Department-level aggregation, your identity is cryptographically separated from the report content."
      },
      {
        q: "Can I take back a report after submitting it?",
        a: "Yes, you can retract any submission from your Voice & Feedback hub within 30 days of submission."
      }
    ]
  },
  {
    id: "HR-POL-032",
    title: "Manager 1-on-1 Check-in & Early Tenure Support Framework",
    category: "mentorship",
    categoryLabel: "Growth & Mentorship",
    lastUpdated: "10 Oct 2026",
    version: "v2.1",
    effectiveDate: "01 May 2026",
    summary: "Sets mandatory cadences for manager-employee check-ins, onboarding milestone reviews, and psychologically safe communication standards.",
    ekoUsage: "Eko uses this framework to craft recommended 1-on-1 talking points and draft neutral emails for employees asking managers for support.",
    keyGuidelines: [
      {
        clause: "Clause 2.2 - Onboarding Cadence",
        text: "Engineering managers must conduct weekly 30-minute 1-on-1 touchpoints with team members in their first 90 days."
      },
      {
        clause: "Clause 3.1 - Agenda Requirements",
        text: "Check-ins must dedicate at least 10 minutes to workload balance, psychological safety, and clarifying conflicting requirements."
      },
      {
        clause: "Clause 4.3 - Safe Communication Protocols",
        text: "Employees have the explicit right to decline tasks outside their primary scope when sprint capacity has been reached."
      }
    ],
    faqs: [
      {
        q: "How can I ask my manager for a 1-on-1 without seeming needy?",
        a: "Requesting alignment on sprint priorities is normal professional practice. Use Eko's draft generator for an appropriate message template."
      }
    ]
  },
  {
    id: "BEN-POL-005",
    title: "Employee Assistance Program (EAP) & Mental Wellbeing Support",
    category: "wellbeing",
    categoryLabel: "Wellbeing & Health",
    lastUpdated: "18 Sep 2026",
    version: "v3.0",
    effectiveDate: "01 Jan 2026",
    summary: "Provides access to confidential professional counselling, mental health days, and protected focus time blocks for all full-time employees.",
    ekoUsage: "Eko suggests EAP contact information and mental wellbeing resources when employees express distress, burnout, or anxiety.",
    keyGuidelines: [
      {
        clause: "Clause 1.1 - 24/7 Counselling Access",
        text: "6 free, confidential counselling sessions per year via an independent third-party provider (EchoCare Health). No information is shared with HR."
      },
      {
        clause: "Clause 2.4 - Protected Focus Time",
        text: "Wednesday afternoons are company-wide 'No-Meeting Focus Blocks' to prevent context switching and burnout."
      },
      {
        clause: "Clause 3.2 - Mental Health Leave",
        text: "Employees may utilize designated mental health wellness days without requiring a medical certificate for single-day absences."
      }
    ],
    faqs: [
      {
        q: "Is EAP truly confidential?",
        a: "Yes. The service is provided by an external third party. The company only receives aggregate statistics with zero identifying details."
      }
    ]
  },
  {
    id: "HR-POL-009",
    title: "Hybrid Working Norms, Core Hours & Disconnection Rights",
    category: "workload",
    categoryLabel: "Workload & Hours",
    lastUpdated: "05 Oct 2026",
    version: "v2.0",
    effectiveDate: "01 Apr 2026",
    summary: "Defines core synchronization hours, asynchronous collaboration expectations, and protects employee right to disconnect after business hours.",
    ekoUsage: "Eko references this policy when assessing late-night communication pressures, weekend slack messages, or remote coordination friction.",
    keyGuidelines: [
      {
        clause: "Clause 2.1 - Core Collaboration Hours",
        text: "Team synchronization hours are set between 10:00 AM and 4:00 PM local time. Meetings should not be scheduled outside this window."
      },
      {
        clause: "Clause 3.3 - Right to Disconnect",
        text: "Employees are not obligated to monitor or reply to work communications outside their designated work hours unless officially on on-call rotation."
      }
    ],
    faqs: [
      {
        q: "Do I have to reply to messages sent at 9 PM?",
        a: "No. Under the Right to Disconnect, you are encouraged to silence notifications outside your agreed schedule."
      }
    ]
  }
];

export const INITIAL_UNANSWERED_QUESTIONS = [
  {
    id: "UNQ-01",
    question: "Can an engineer claim Time-Off-In-Lieu (TOIL) if overtime was incurred resolving an unapproved weekend production incident?",
    askedBy: "Anonymous Peer (Engineering • Platform Squad)",
    askedDate: "Yesterday, 16:40",
    category: "workload",
    categoryLabel: "Workload & Hours",
    aiDiagnosis: "Eko AI flagged missing company policy coverage for emergency weekend incident compensation.",
    status: "pending", // 'pending' | 'answered'
    hrAnswer: "",
    answeredBy: "",
    answeredDate: "",
    linkedPolicyId: "HR-POL-014",
  },
  {
    id: "UNQ-02",
    question: "Is there an approved company stipend or budget for ergonomic desk chairs and noise-cancelling headphones for 100% hybrid staff?",
    askedBy: "Anonymous Peer (Product & Design)",
    askedDate: "22 Oct 2026, 11:15",
    category: "wellbeing",
    categoryLabel: "Wellbeing & Equipment",
    aiDiagnosis: "AI knowledge base only covers standard office desks and MacBook Pro allocations. No hybrid ergonomics policy found.",
    status: "pending",
    hrAnswer: "",
    answeredBy: "",
    answeredDate: "",
    linkedPolicyId: "HR-POL-009",
  },
  {
    id: "UNQ-03",
    question: "If my assigned people manager is on extended leave (>3 weeks), who has formal sign-off for sprint backlog adjustments and mid-cycle level progression?",
    askedBy: "Anonymous Peer (Customer Operations)",
    askedDate: "20 Oct 2026, 14:00",
    category: "task_ownership",
    categoryLabel: "Task Ownership & Escalation",
    aiDiagnosis: "AI knowledge gap resolved by HR. Policy published to Eko knowledge base.",
    status: "answered",
    hrAnswer: "In the event of a designated people manager leave exceeding 14 calendar days, delegation of authority automatically passes to the Group Director and designated People Partner (HR-SOP-08 Clause 2.1). Backlog trade-offs can be authorized during weekly triage.",
    answeredBy: "Sarah Jenkins (Senior HR Partner)",
    answeredDate: "21 Oct 2026, 09:30",
    linkedPolicyId: "HR-POL-021",
  },
];

export const INITIAL_KNOWLEDGE_FAQS = [
  {
    id: "KB-01",
    question: "Can senior colleagues offload documentation work to new hires without sprint estimation?",
    answer: "No. Clause 4.1 of HR-POL-014 strictly prohibits delegating unestimated peer tasks to team members in their first 6 months without designated people manager pre-approval.",
    category: "workload",
    policyId: "HR-POL-014",
    lastUpdated: "18 Oct 2026",
    verifiedBy: "HR People Team",
  },
  {
    id: "KB-02",
    question: "What is the maximum overtime an employee can work in a week without written manager consent?",
    answer: "Overtime exceeding 5 hours in any single working week requires written manager pre-approval and qualifies for Time-Off-In-Lieu (TOIL) at 1.5x hourly equivalent.",
    category: "workload",
    policyId: "HR-POL-014",
    lastUpdated: "15 Oct 2026",
    verifiedBy: "HR People Team",
  },
  {
    id: "KB-03",
    question: "How does confidential reporting protect my identity from my direct manager?",
    answer: "Reports flagged with Department-Level or Full Anonymity strip all names, employee IDs, and private Eko AI chats before reaching HR. Managers only see anonymized trend themes and approved action plans.",
    category: "grievance",
    policyId: "HR-POL-021",
    lastUpdated: "20 Oct 2026",
    verifiedBy: "Compliance & Safety",
  },
  {
    id: "KB-04",
    question: "What should I do if a pull request (PR) has been waiting for review for more than 24 hours?",
    answer: "Under the Engineering PR Review SLA, PRs inactive for 24 hours can be escalated directly to the Squad Tech Lead during morning standup without requiring individual peer nudges.",
    category: "task_ownership",
    policyId: "HR-POL-018",
    lastUpdated: "22 Oct 2026",
    verifiedBy: "Engineering & HR",
  },
];
