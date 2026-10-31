# EchoHR — Prototype Demo Flow, Content & Data Specification Report

**Platform:** EchoHR (People Intelligence & Early Disengagement Platform)  
**AI Assistant:** Eko (Eko Assistant / Eko Copilot)  
**Simulated Company:** Nexora Technologies (300 Employees, B2B Cloud Software, Hybrid/Remote)  
**Reporting Period:** 21 September – 20 October 2026  
**Document Purpose:** Detailed reference report covering demo flows, data models, presentation components, input/action types, and the end-to-end user journey across Employee and HR views.

---

## 1. Executive Summary & Dual-Role Architecture

EchoHR is built around a dual-perspective workflow that connects early employee experience signals with proactive HR interventions without compromising employee trust or anonymity.

```
┌────────────────────────────────────────────────────────────────────────────┐
│                              ECHOHR PLATFORM                               │
├──────────────────────────────────────────┬─────────────────────────────────┤
│         EMPLOYEE PORTAL (Maya Tan)       │    HR INTELLIGENCE (Sarah Lee)  │
├──────────────────────────────────────────┼─────────────────────────────────┤
│ • Eko Workplace Assistant (AI Chat)      │ • Disengagement Analytics & KPIs│
│ • Weekly Pulse Survey (Sliders + Text)   │ • 4-Category Coded Disengagement│
│ • Confidential Workplace Reporting       │ • Interactive Donut Distribution│
│ • Open Constructive Feedback             │ • Priority Concern Investigations│
│ • Report Status Checker (ANON Reference) │ • Report Review & Triage Modals │
│ • Filterable "My Records" Activity List  │ • Action Plan AP-01 Management  │
│ • Peer Community Board (Verified Anon)   │ • Eko Copilot Drawer (Analysis) │
└──────────────────────────────────────────┴─────────────────────────────────┘
```

The platform supports seamless switching between the **Employee Portal** and **HR Portal** via the bottom-left profile switcher in the sidebar, allowing presenters to demonstrate the entire lifecycle of an employee concern: from initial feeling of ambiguity to private guidance, submission, HR triage, systemic action planning, and company-wide transparency.

---

## 2. Core Taxonomy: Consolidated 4-Category Model

All signals (Pulse Surveys, Confidential Reports, Community Discussions, and Operational Telemetry) are categorized under an evidence-based 4-category framework:

| Category Code | Full Category Name | UI Color Token | Focus & Key Indicators |
| :--- | :--- | :--- | :--- |
| **CON-01** | **Burnout & Workload Imbalance** | Rose (`#F43F5E`) | Unsustainable volume, weekend/evening overtime, sudden task dumping, unrealistic deadlines, difficulty saying no. |
| **CON-02** | **Unclear Role Expectations & Poor Manager Support** | Amber (`#F97316`) | Vague briefs, conflicting lead directives, missing acceptance criteria, hurried/canceled 1-on-1s. |
| **CON-03** | **Lack of Recognition & Career Growth** | Purple (`#8B5CF6`) | Extra effort ignored, feedback only given when errors occur, absence of protected development time. |
| **CON-04** | **Collaboration & Organisational Change** | Cyan (`#06B6D4`) | Hybrid/remote disconnect, decisions made informally in-office, unannounced workflow/tool changes. |

---

## 3. Employee Portal: Data Presentation & Action Types

The Employee Portal simulates the journey of **Maya Tan** (Junior Software Engineer, 5 months tenure, Engineering Department).

```
Employee Experience Hub
 ├── View 1: Eko Assistant (AI Chat Guided Journey)
 ├── View 2: Voice & Feedback Hub
 │    ├── Action Cards (Give Feedback / Pulse Survey / Confidential Report)
 │    ├── Filterable "My Records" Hub (All, Reports, Surveys, Feedback)
 │    └── Modal Forms (Report Modal, Pulse Modal, Feedback Modal, Status Modal)
 └── View 3: Community Board (Peer Support & Verified Anonymity)
```

### 3.1 View 1: Eko Assistant (AI Chat Journey)

#### Initial Screen & Welcome State
* **Presentation:**
  * Clean, vertically and horizontally centered welcome hero area.
  * Brand mark: `<EchoLogo size={32} animated />`.
  * Heading: `"Good morning, Maya 👋"`.
  * Subheading: *"What can I help you with today?"*
  * Supporting prompt: *"Whether you need help understanding a task, organising your priorities, or finding support, you don't have to figure everything out alone."*
* **3 Quick Action Cards:**
  1. **Live Walkthrough / Start Demo** — Sparkles icon (`#5455EE`), opens the guided turn-by-turn demo.
  2. **Weekly Check-in / Pulse Survey** — ClipboardCheck icon (`emerald`), opens the Pulse Survey modal.
  3. **Private Voice / Submit Report** — Lock icon (`rose`), opens the Confidential Report modal.

#### Turn-by-Turn Guided Walkthrough Flow

```
[Start Demo Clicked]
        │
        ▼
[Turn 1: Maya expresses role ambiguity]
        │
        ▼
[Turn 2: Eko AI provides checklist & Launch Checklist modal preview]
        │
        ▼
[Turn 3: Maya reveals senior colleague task transfer & sprint conflict]
        │
        ▼
[Turn 4: Eko AI displays Task Comparison Table & Neutral Draft Copy]
        │
        ▼
[Turn 5: Proactive Check-in with 1-Click Action Buttons to Report Modal]
```

* **Turn 1 (Maya):**
  * *Text:* *"My manager said, 'Prepare the client launch materials and make sure everything is ready for Friday.' But what exactly am I supposed to prepare?."*
* **Turn 2 (Eko AI):**
  * *Text:* Instant validation and structured guidance retrieved from internal repository.
  * *Data Presentation — Company Resource Card:*
    * Document Title: `Company Resource: Client Launch Checklist`
    * Action Type: Interactive button `"View Example"`, which triggers the **Client Launch Checklist Example Modal**:
      * Executive Pitch Deck (Slide deck)
      * Architectural Whitepaper
      * End-to-end sandbox walkthrough demo
      * Sign-off sheet from Squad Lead and Product Director
* **Turn 3 (Maya):**
  * *Text:* *"Also, Alex just assigned me 4 extra testing documentation tasks for Friday, but I already have 6 hours of sprint tickets..."*
* **Turn 4 (Eko AI):**
  * *Data Presentation — Workload & Commitment Comparison Table:*
    | Commitment | Deadline | Estimated Effort |
    | :--- | :--- | :---: |
    | Existing sprint tasks | Thursday, 22 Oct | 6 hours |
    | Client launch materials | Friday, 23 Oct | 5 hours |
    | Additional testing documentation *(amber highlight)* | Friday, 23 Oct | 4 hours |
  * *Data Presentation — Bold Suggestion Paragraph:*
    * **Suggestion:** Confirm priority with your manager before taking on additional tasks.
  * *Data Presentation — Suggested Neutral Draft Message Box:*
    * Context: Non-confrontational, factual message Maya can copy to Slack/Email.
    * Copy text: *“Hi Daniel, I have 6 hours of sprint tasks due Thursday and 5 hours of client launch prep due Friday. Alex also asked for 4 hours of testing docs on Friday. Which of these should take priority so I can plan my week effectively?”*
    * Action Type: 1-click `"Copy"` button that changes to `"Copied ✓"` and stores text to clipboard.
* **Turn 5 (Eko AI):**
  * *Presentation:* Proactive follow-up acknowledging cumulative stress.
  * *Action Types — Recommended Next Step CTA Pills:*
    1. **Primary Button:** `"Submit Confidential Report"` (with ShieldCheck icon) — directly opens the Confidential Report Modal.
    2. **Secondary Button:** `"Feedback Form"` (with MessageSquare icon) — opens Feedback Form.
    3. **Secondary Button:** `"Community Board"` (with Users icon) — navigates to peer forum.

---

### 3.2 View 2: Voice & Feedback Hub

#### Top Action Cards
* Top subtitle: *"Your space to share suggestions, complete your weekly pulse survey, or raise a concern confidentially."*
* Quick utility: `"Check Report Status (ANON-4827)"` button in header.
* 3 interactive action cards (with hover lift and icon containers):
  1. **Give Feedback** (Blue badge: *Constructive*) → Opens Feedback Form Modal.
  2. **Pulse Survey** (Emerald badge: *Weekly · 2 min*) → Opens Pulse Survey Modal.
  3. **Confidential Report** (Rose badge: *Private Reporting*) → Opens Confidential Report Modal.

---

### 3.3 Modal 1: Pulse Survey Form

Used for fast weekly sentiment telemetry.

* **Modal Presentation:** Centered backdrop blur modal with title, 2-minute notice, and close (✕) button.
* **Questions & Input Types:**
  1. **Question 1: Workload Manageability**
     * *Prompt:* `"1. How manageable has your workload felt this week?"`
     * *Input Type:* HTML5 Range Slider (`min=1`, `max=10`).
     * *Live Display:* Current numeric score badge (e.g., `6 / 10`).
     * *Scale Labels:* `1 (Severe Overload)` to `10 (Completely Manageable)`.
  2. **Question 2: Role Clarity**
     * *Prompt:* `"2. Do you have clear instructions and priority guidelines for your tasks?"`
     * *Input Type:* HTML5 Range Slider (`min=1`, `max=10`).
     * *Live Display:* Current numeric score badge (e.g., `6 / 10`).
     * *Scale Labels:* `1 (Very Unclear)` to `10 (Crystal Clear)`.
  3. **Question 3: Support**
     * *Prompt:* `"3. How supported do you feel by your manager and senior squad mates?"`
     * *Input Type:* HTML5 Range Slider (`min=1`, `max=10`).
     * *Live Display:* Current numeric score badge (e.g., `7 / 10`).
     * *Scale Labels:* `1 (Isolated / No Support)` to `10 (Fully Supported)`.
  4. **Question 4: Qualitative Commentary**
     * *Prompt:* `"Any specific comments on this week's pace? (Optional)"`
     * *Input Type:* Multi-line `<textarea>` (3 rows).
     * *Default Demo Content:* *"Quite a busy week, but I'm managing. There were a few things I wasn't sure about."*
* **Actions:**
  * `"Cancel"` button → Closes modal without saving.
  * `"Submit Pulse Check-in"` button → Saves record to `submittedRecords`, closes modal, shows 5-second green confirmation toast, and dispatches notification.

---

### 3.4 Modal 2: Confidential Workplace Report Form

Enables safe escalation of workload friction without personal exposure.

* **Questions & Input Types:**
  1. **Concern Category Dropdown (`<select>`):**
     * `CON-01: Burnout & Workload Imbalance`
     * `CON-02: Unclear Role Expectations & Poor Manager Support`
     * `CON-03: Lack of Recognition & Career Growth`
     * `CON-04: Collaboration & Organisational Change`
  2. **Concern Narrative (`<textarea rows={4}>`):**
     * *Prompt:* `"Describe your concern"`
     * *Realistic Context Preloaded:*
       > "Over the past few weeks, a senior colleague has repeatedly assigned me additional testing and documentation work without discussing my existing commitments. At the same time, my manager often gives instructions without clearly explaining the expected deliverables or which tasks should take priority. I have been working late to finish everything. I am uncomfortable raising this directly because I am new and worry that I may be viewed as difficult or incapable. I would like HR to review how work is allocated, clarify task ownership, and establish a safer way to resolve conflicting priorities."
  3. **Desired Outcome (`<input type="text">`):**
     * *Prompt:* `"What outcome would help?"`
     * *Content:* *"Fairer workload allocation, clearer task priorities, and a safe way to raise concerns without retaliation."*
  4. **Fixed Organizational Context (Non-editable badges):**
     * Department: `Engineering`
     * Tenure: `5 months`
  5. **Privacy & Information Visibility Accordion:**
     * *Dropdown Selector:*
       * **Option A (Recommended):** `Share my department (Engineering)` — Allows HR to spot systemic squad-level patterns while strictly masking name and ID.
       * **Option B:** `Hide my department too (Fully anonymous, no department)` — Pure factual escalation.
     * *Summary Matrix:*
       * Identity: **Hidden**
       * Private AI Chat: **Not attached**
       * Department: **Engineering (or Hidden)**
       * Direct Manager: **Not disclosed**
  6. **Consent Checkbox (`<input type="checkbox">`):**
     * `"I understand that the information I submit may be used to investigate this concern. I have reviewed the privacy choice above."`
* **Actions:**
  * `"Cancel"` button → Dismisses modal.
  * `"Submit Anonymous Report"` button → Assigns reference code `ANON-4827`, adds record to `submittedRecords`, closes modal, and alerts HR triage queue.

---

### 3.5 Modal 3: Constructive Feedback Form

For proactive, non-grievance team suggestions.

* **Inputs:**
  * Category Dropdown: Workload & Capacity, Process & Tooling, Onboarding, Team Culture, Management Communication.
  * Target Scope: Text input (default: `Engineering Department`).
  * Suggestion Title: Text input (e.g. `Standardize 24h PR turnaround SLA`).
  * Detailed Suggestion: Multi-line text.
  * Positive Outcome: Short description of anticipated impact.
  * Anonymity Checkbox: *"Submit anonymously without attaching my name or profile"*.
* **Actions:** Cancel / Submit Feedback.

---

### 3.6 Modal 4: Report Status Checker

Allows employees to check progress anonymously using their reference code.

* **Input:** Text search field for reference code (default: `ANON-4827`).
* **Data Display:**
  * Case Reference: `ANON-4827`
  * Status Badge: `Escalated for Review` (Blue)
  * Response Narrative: Official triage note from People Partner Sarah Lee.
  * Timeline: Last updated (20 October 2026), Next review (22 October 2026).
  * Interactive Simulated Follow-Up button (simulates 3 Nov 2026 outcome).

---

### 3.7 "My Records" Hub: Filtering & Detail Modal

* **Filter Pills (Interactive Count Badges):**
  * `All (N)`
  * `Reports (N)`
  * `Surveys (N)`
  * `Feedback (N)`
* **Record Card Presentation:**
  * Monospace ID tag (`ANON-4827`, `PULSE-W42`, `FDB-1042`).
  * Report title.
  * Submission date.
  * HR Review Status badge (`Reviewed by HR` vs `Pending Review`).
  * Resolution Status badge (`In Progress`, `Open`, `Solved`, `Withdrawn by Employee`).
  * `"View"` button.
* **Detail Record Modal (Deep Inspection & Actions):**
  * Displays full inner description, requested outcomes, and category.
  * Timeline of HR updates.
  * **Action Button 1: "Add Follow-up Note"** → Opens note input modal to add supplementary details without altering original submission.
  * **Action Button 2: "Take Back / Retract"** →
    * If *Pending Review*: Completely removes the submission from queue.
    * If *Already Reviewed*: Marks case as `Withdrawn by Employee` while maintaining audit trail for compliance.

---

## 4. HR Intelligence Platform: Data Presentation & Action Types

Switched via profile card (`Sarah Jenkins, Lead People Partner` / `Sarah Lee, Senior HRBP`).

```
HR Intelligence Hub
 ├── Top Header: Department Filter Dropdown (All, Engineering, Product, Sales, Support, Ops)
 ├── Metric Cards: Operational Telemetry & KPI Indicators
 ├── Priority Concerns: 4-Category Coded Cards with Evidence & Action Plans
 ├── Donut Distribution: Coded Theme Percentages & Category Drill-down
 ├── Follow-Up & Feedback Reports: Full Case Queue with Review Modal
 └── Eko Copilot Drawer: Slide-over AI Disengagement Analyst
```

### 4.1 Department Filter Dropdown & Metric Cards

| Metric Card | Value Display | Subtext / Indicator | Status Pill | Visual Tone |
| :--- | :---: | :--- | :--- | :--- |
| **Pulse Response Rate** | **78%** (All) / **81%** (Eng) | 234 of 300 employees | Healthy Participation | Blue |
| **Reports Awaiting Review** | **8** (All) / **3** (Eng) | 3 newly submitted today | Action Required | Rose |
| **Overdue SLA Follow-ups** | **2** (All) / **1** (Eng) | Exceeded target turnaround | SLA Breached | Amber |
| **Average Triage Time** | **1.4 Days** | Last 30-day rolling cycle | Fast Triage SLA | Emerald |
| **Total Headcount** | **300** | Across 5 departments | Hybrid & Remote | Slate |

#### Operational Indicators (Engineering Specific):
* **Average Overtime:** `+18%` (Overtime surge vs previous 30 days)
* **Deadline Delays:** `+12%` (Sprint backlog slippage detected)
* **Absence Rate:** `5.2%` (Within standard threshold)
* **Active Signals:** `4 active` (High signal density in Engineering)

---

### 4.2 Interactive Donut Chart Distribution

Visualizes the share of coded disengagement instances across the organization.

```
                    [ 35% Burnout & Workload Imbalance ]
                                   ●
               ●                                       ●
    [ 15% Collaboration ]                     [ 30% Role Expectations ]
               ●                                       ●
                                   ●
                     [ 20% Recognition & Growth ]
```

* **Interactive Actions:**
  * Hovering any slice highlights the category and displays a floating tooltip with exact counts and descriptions.
  * Clicking any category filters the entire dashboard to focus on that specific concern.
  * Center label shows total coded instances: **120 instances**.

---

### 4.3 Priority Concern Cards (Actionable Investigations)

The prototype presents three high-impact concern cards tailored to current telemetry:

1. **CON-01: Burnout & Workload Imbalance (High Priority)**
   * *Evidence Summary:*
     * Pulse Survey: 14 pulse responses cite workload pressure and competing deadlines.
     * Voluntary Reports: R004 (Maya) describes repeated documentation transfers without capacity checks.
     * Community Board: Discussion COM-1 on refusing tasks upvoted 24 times.
     * Operational Telemetry: Engineering overtime increased by 18%.
   * *Action Type:* `"Launch Intervention Plan"` button → Opens **Action Modal** with pre-configured **Action Plan AP-01**.
2. **CON-02: Unclear Role Expectations & Poor Manager Support (High Priority)**
   * *Evidence Summary:* 11 pulse responses mention unclear task briefs; 5 voluntary submissions report contradictory directives; average PR review time stretched to 4.2 days.
   * *Recommended Action:* Standardize task briefing rubrics and enforce 24h PR turnaround SLA.
3. **CON-03: Lack of Recognition & Career Growth (Medium Priority)**
   * *Evidence Summary:* 8 pulse responses cite absence of contribution feedback; recognition engagement dropped 35% in new cohorts.

---

### 4.4 Feedback & Reports Review Queue (Report Review Modal)

The full case table presents four representative cases:

| Case ID | Reporter Code | Department | Tenure | Priority | Status | Concern Summary |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **R004** | `EMP-ANON` | Engineering | 5 mos | **High** | **New** | Repeated workload transfers & conflicting priorities |
| **R001** | `EMP-ANON` | Engineering | 42 days | **High** | In Progress | Conflicting architectural guidance stalls PRs |
| **R002** | `EMP-ANON` | Sales & Marketing | 65 days | **High** | **Overdue** | Extended shifts covering senior quota |
| **R003** | `EMP-ANON` | Product | 4 mos | Medium | New | Unclear deliverable expectations cause rework |

#### Report Review Modal Workflow (`R004` Walkthrough):
* **Header:** Case ID, Submission Timestamp, Verified Anonymity Seal.
* **AI Case Summary:** Concise synthesis connecting Maya's report with squad-level indicators.
* **Aggregated Signals:** Highlights pulse drop, overtime jump (+18%), and matching community discussions.
* **Action Triage Controls:**
  * Change status: `New` → `In Progress` → `Resolved`.
  * Assign case owner: `Sarah Lee (Lead People Partner)` & `Head of Engineering`.
  * Launch Action Plan: Links directly to **Action Plan AP-01**.
  * Publish Official Update: Triggers publication of **Official Announcement ANN-01** to Community Board.

---

### 4.5 Action Plan AP-01: Engineering Workload & Role-Clarity Review

* **Owner:** Sarah Lee, Senior HR Business Partner
* **Senior Reviewer:** Head of Engineering
* **Key Action Items:**
  1. `ACT-1`: **Review task allocation** (Head of Engineering) — Audit informal handoffs.
  2. `ACT-2`: **Establish priority confirmation** (Engineering Manager) — Formal escalation path for competing deadlines.
  3. `ACT-3`: **Improve task briefs** (Engineering Manager) — Standard acceptance criteria on all tickets.
  4. `ACT-4`: **Confidential follow-up** (Sarah Lee) — Anonymous check-in with reporter under reference `ANON-4827`.

---

### 4.6 Eko Copilot Drawer (HR View)

* **Trigger:** Floating circular electric blurple button (`w-14 h-14 rounded-full`) at bottom-right containing `<EchoLogo size={26} animated />` with active emerald status dot.
* **Suggested Prompts:**
  * *"Analyze early disengagement signals in Engineering"*
  * *"Draft 1-on-1 questions for week-4 probation check-ins"*
  * *"Suggest intervention plan for quota pacing burnout"*
* **Capabilities:**
  * Generates cohort telemetry breakdowns.
  * Formulates recommended manager questions for Month 1 probation check-ins.
  * Recommends intervention SLAs (e.g. 24h PR turnaround).

---

## 5. Shared Community Board: Data Presentation & Action Types

Shared collaborative space reinforcing verified anonymity and peer solidarity.

* **Verified Anonymity Guarantee:**
  * All posts, replies, and reactions display strictly as `Anonymous Employee` or `Anonymous Employee [1-3]`.
  * Verified Peer Space tag with live feed pulse indicator.
* **4 Seeded Discussions:**
  1. **COM-1 (Engineering):** *"Drowning in conflicting deadlines & vague instructions... is this normal for new hires? :/"* (24 upvotes, 3 peer advice replies).
  2. **COM-2 (Product):** *"Putting in extra hours and crickets... how do you stay motivated? 🙃"* (11 upvotes, 2 replies).
  3. **COM-3 (Sales):** *"Are your 1-on-1s actually useful or just status updates? :("* (8 upvotes, agenda advice reply).
  4. **COM-4 (Customer Success):** *"Feeling a bit left out of the loop on remote days 😅"* (5 upvotes, async documentation advice reply).
* **Action Types on Posts:**
  * **Upvote Counter Button:** Interactive count toggle.
  * **3 Anonymous Reaction Buttons:**
    * 👍 **Relatable**
    * 🙋 **Been There**
    * 💙 **Support**
  * **Reply Input:** Inline anonymous reply submission.
* **Official HR Announcements Section:**
  * Displays official broadcasts published by HR (e.g. `ANN-01: We're Listening: Action Plan on Workload Balance, Role Clarity & Team Support`).
  * Connects HR systemic action back to community voice without revealing which specific report triggered it.

---

## 6. End-to-End Recommended Demo Script

Follow this sequence for client or executive presentations:

```
Step 1: Start on Employee Portal (emp_chat)
 ├── Show centered welcome greeting for Maya Tan.
 ├── Click "Start Demo" / "Live Walkthrough".
 ├── Watch Eko clarify the client launch task with the Checklist modal.
 ├── Progress to Turn 3 & 4: View Task Comparison Table & copy neutral draft message.
 └── Turn 5: Click "Submit Confidential Report".

Step 2: Submit Confidential Report
 ├── Form opens in focused modal dialog.
 ├── Review pre-populated workload & conflicting priority narrative.
 ├── Inspect Privacy Accordion (Option A: Engineering visible vs Option B: Fully anonymous).
 ├── Check consent and click "Submit Anonymous Report".
 └── Observe reference code ANON-4827 and green auto-dismissing banner.

Step 3: Complete Weekly Pulse Survey
 ├── Click "Pulse Survey" action card.
 ├── Demonstrate rating sliders (Workload: 6/10, Clarity: 6/10, Support: 7/10).
 ├── Submit pulse survey and review "My Records" filter tabs (All, Reports, Surveys).

Step 4: Switch to HR Portal (Sarah Jenkins / Lead People Partner)
 ├── Click profile switcher at bottom of Sidebar.
 ├── Dashboard updates to All Departments / Engineering.
 ├── Note elevated Overtime (+18%) and new urgent report awaiting review.
 ├── Drill into Donut Chart (CON-01 Burnout 35%, CON-02 Unclear Roles 30%).
 ├── Open Priority Concern CON-01 and inspect connected evidence.

Step 5: Review Case R004 & Launch Action Plan AP-01
 ├── Click "Feedback & Reports" in sidebar.
 ├── Open Case R004 (Maya's anonymous report).
 ├── Read AI Case Summary and cross-department telemetry signals.
 ├── Click "Launch Action Plan" to open Action Plan AP-01 (Engineering Review).
 ├── Click "Publish Announcement" to post official update to Community Board.

Step 6: Close the Loop in Community Board
 ├── Navigate to Community Board.
 ├── Show official announcement ANN-01 visible to all employees.
 ├── Show COM-1 peer thread and demonstrate anonymous reaction counters.
 └── Open Eko Copilot Drawer via circular floating button to demonstrate instant cohort intelligence.
```

---

## 7. Technical Specifications & File Manifest

| Component File | Role / Responsibility | Key Technologies & Subcomponents |
| :--- | :--- | :--- |
| [`EchoLogo.jsx`](file:///c:/Users/Crystal%20Yap/Desktop/AIFM/src/components/EchoLogo.jsx) | Official brand mark vector component | 7-bar acoustic waveform SVG, 98.43% fitted Beziers, animated ripple keyframes. |
| [`Sidebar.jsx`](file:///c:/Users/Crystal%20Yap/Desktop/AIFM/src/components/Sidebar.jsx) | Fixed navigational sidebar | Fixed `h-screen`, role toggle, minimized mode, direct brand header. |
| [`TopHeader.jsx`](file:///c:/Users/Crystal%20Yap/Desktop/AIFM/src/components/TopHeader.jsx) | Global application header | Dynamic page titles, alert notifications, settings trigger. |
| [`EmployeePortalView.jsx`](file:///c:/Users/Crystal%20Yap/Desktop/AIFM/src/components/EmployeePortalView.jsx) | Full employee experience suite | Centered Eko chat, modal forms (Report, Pulse, Feedback, Status), filterable My Records. |
| [`AiAssistantDrawer.jsx`](file:///c:/Users/Crystal%20Yap/Desktop/AIFM/src/components/AiAssistantDrawer.jsx) | Floating HR AI Copilot | Circular trigger button with logo, early disengagement conversational agent. |
| [`MetricCards.jsx`](file:///c:/Users/Crystal%20Yap/Desktop/AIFM/src/components/MetricCards.jsx) | HR KPI indicators | Response rates, review queues, SLA trackers, trend badges. |
| [`DonutChart.jsx`](file:///c:/Users/Crystal%20Yap/Desktop/AIFM/src/components/DonutChart.jsx) | Interactive category breakdown | SVG donut chart, percentage breakdown, hover tooltips, click filtering. |
| [`PriorityConcerns.jsx`](file:///c:/Users/Crystal%20Yap/Desktop/AIFM/src/components/PriorityConcerns.jsx) | Coded concern investigation cards | Evidence synthesis, negative effects, recommended next steps, intervention triggers. |
| [`FeedbackReportsView.jsx`](file:///c:/Users/Crystal%20Yap/Desktop/AIFM/src/components/FeedbackReportsView.jsx) | Comprehensive HR reports table | Status filters, urgency sorting, search, case triage triggers. |
| [`ActionModal.jsx`](file:///c:/Users/Crystal%20Yap/Desktop/AIFM/src/components/ActionModal.jsx) | Workflow modal engine | R004 case review, AP-01 action planning, announcement publisher. |
| [`CommunityBoardView.jsx`](file:///c:/Users/Crystal%20Yap/Desktop/AIFM/src/components/CommunityBoardView.jsx) | Anonymous peer forum | Verified anonymity tag, tag filtering, upvotes, 3 reactions, official broadcasts. |
| [`mockData.js`](file:///c:/Users/Crystal%20Yap/Desktop/AIFM/src/data/mockData.js) | Centralized data store | 4-category definitions, 5 departments, Maya profile, AP-01, reports, community feed. |

---
*Report generated for EchoHR Platform Prototype — All rights reserved.*
