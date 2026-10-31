# EchoHR Prototype Modification Prompt

Modify the existing EchoHR prototype to implement the latest hackathon demo flow.

Do not redesign or change the existing UI style, color system, layout language, component patterns, fonts, spacing, sidebar behavior, card style, modal style, or overall visual identity. Reuse the current EchoHR design system and existing components wherever possible.

Keep the existing HR dashboard data largely unchanged unless a small change is necessary to support the new demo flow.

The main addition is a new **Manager Action Workspace** for Daniel Lim, the Engineering Manager. This new manager view must visually match the existing EchoHR UI style.

---

## 1. Product context

Product name: **EchoHR**  
AI assistant name: **Eko** or **EkoAI**  
Simulated company: Nexora Technologies  
Demo employee: **Maya Tan**, Junior Software Engineer, Engineering Department, 5 months tenure, hybrid work mode.  
HR user: **Sarah Lee / Sarah Jenkins**, Lead People Partner / Senior HRBP.  
Manager user: **Daniel Lim**, Engineering Manager, Department A / Engineering.

The demo must show this complete flow:

Maya completes pulse survey → Maya asks Eko for task clarification → Maya asks Eko about workload conflict → Eko detects recurring pattern from Maya’s past two weeks of conversations → Maya views community post and upvotes → Maya submits anonymous report with department-level privacy → HR reviews anonymized dashboard and report → HR assigns action to manager → manager receives only anonymized action → manager asks HR question and updates progress → HR closes loop → Maya sees report resolved and community announcement.

---

## 2. Critical privacy and role rules

Implement **Mode 1 only** for manager access.

### HR

HR can see:

- Full anonymized analytics dashboard.
- Pulse-survey trends.
- Anonymized Eko recurring-theme signals.
- Community posts, upvotes, and discussion themes.
- Anonymous reports and case details.
- Workload, overtime, delay, and other operational indicators.
- Action plans and follow-up status.

HR must not expose to managers:

- Maya’s identity.
- Maya’s AI-chat transcript.
- Individual pulse-survey answers.
- Individual anonymous-report identity.
- Community-post authors.
- Upvote identities.
- The full HR analytics dashboard.
- The evidence details behind HR’s analysis.

### Manager

The manager must NOT see:

- HR analytics dashboard.
- Employee identities.
- Employee AI-chat transcripts.
- Individual survey answers.
- Individual anonymous reports.
- Community-post authors or upvote identities.
- Raw Eko conversation history.
- Other departments’ detailed analysis.

The manager receives only:

- An anonymized concern theme.
- HR instruction.
- Deadline.
- Priority.
- Action status.
- Secure HR-manager chat.
- Progress-update form.

### Employee

Maya can:

- Complete pulse survey.
- Chat with Eko.
- View community posts and upvote.
- Submit anonymous report.
- Choose privacy level.
- View report status using case reference.
- Receive HR updates through anonymous case channel.

Maya cannot see:

- HR dashboard.
- Manager action workspace.
- Other employees’ reports.
- Manager identity or manager actions.

---

## 3. Update Employee Portal: Maya flow

Keep the existing Employee Portal layout, Eko chat interface, Voice & Feedback Hub, Community Board, modals, and “My Records” structure.

Make the following content and flow updates.

### 3.1 Pulse survey positioning

Change the pulse-survey positioning from “weekly” to **occasional pulse survey**.

Update the Pulse Survey card subtitle to:

“Occasional check-in · 2 min”

Update the pulse modal subtitle to:

“This helps EchoHR understand broader team trends. You can also use Eko anytime for immediate work support.”

Keep the existing four pulse-survey questions and slider design:

1. Workload manageability: 6/10
2. Role clarity: 6/10
3. Support: 7/10
4. Optional comment: “Quite a busy week, but I’m managing. There were a few things I wasn’t sure about.”

Do not change the existing visual slider style.

### 3.2 Update Eko guided walkthrough

Update the existing five-turn Eko walkthrough to the following conversation.

#### Turn 1 — Maya

Maya says:

“My manager said, ‘Prepare the client launch materials and make sure everything is ready for Friday.’ But what exactly am I supposed to prepare? I don’t want to keep asking questions and look incapable.”

#### Turn 2 — Eko

Eko replies:

“I can help you work that out. Based on the Client Launch Checklist and a previous client-launch project, you will normally need to prepare:

- Client presentation using the approved template
- Product overview and key benefits
- Demo preparation checklist
- Final review and approval from your project lead

Approved resources:
- Client Launch Checklist
- Previous client launch example
- Client presentation template

Retrieved from approved internal company resources. Please confirm project-specific requirements with your manager.”

Keep the existing Company Resource Card and “View Example” modal.

Update the resource card title to:

“Company Resource: Client Launch Checklist”

Add a small source note:

“Retrieved from approved internal company resources.”

#### Turn 3 — Maya

Maya says:

“That helps. But my senior also asked me to finish their testing documentation. I already have other sprint tasks due this week. I don’t know what I should do first…”

#### Turn 4 — Eko

Eko replies:

“Based on the workload information you linked from JIRO, let’s compare your current commitments before deciding.”

Keep the existing workload comparison table, but ensure it shows:

| Commitment | Deadline | Estimated Effort |
|---|---|---|
| Existing sprint tasks | Thursday, 22 Oct | 6 hours |
| Client launch materials | Friday, 23 Oct | 5 hours |
| Additional testing documentation | Friday, 23 Oct | 4 hours |

Add this summary below the table:

“Your existing sprint tasks and launch materials already require an estimated 11 hours. The additional testing documentation could create a deadline conflict.”

Update the suggestion text to:

“Suggested handling options:  
1. Confirm priority and task ownership with your manager.  
2. Ask whether the testing documentation can be reassigned or rescheduled.  
3. Use the drafted message below to clarify priorities professionally.”

Keep the existing neutral draft message and copy button.

#### Turn 5 — Recurring pattern detection

Maya says:

“This has happened a few times. I am not sure whether I should raise it.”

Eko replies:

“Based on your conversations over the past two weeks, I noticed a recurring pattern: unclear task priorities, additional tasks assigned by others, and difficulty balancing your existing commitments.

This may not be an ideal situation, especially if it is affecting your workload or deadlines. You do not need to decide immediately, but you may want to address it.

You can:

- Use the drafted message to speak with your manager.
- Check whether other employees have raised a similar concern in the community.
- Submit feedback or an anonymous report to help HR understand the issue.

If you choose to report anonymously, your identity will not be shared. HR will see anonymized themes, not your individual conversation.”

Replace the current Turn 5 action buttons with:

- “View community discussions”
- “Submit anonymous report”
- “Use drafted message with manager”
- “Save for later”

Important behavior:

- Eko must not automatically submit a report.
- Eko must not automatically notify HR.
- Eko must not label Maya as disengaged.
- Eko must only suggest voluntary next steps.

### 3.3 Community board behavior

When Maya clicks “View community discussions,” navigate to the existing Community Board.

Highlight or scroll to the existing post:

COM-1: “Drowning in conflicting deadlines & vague instructions... is this normal for new hires? :/”

Maya clicks the existing upvote button.

After Maya upvotes, show a subtle Eko prompt near the post or as a small floating suggestion:

“It looks like you may have a similar concern. Would you like to share feedback or submit an anonymous report so HR can understand this issue better?”

Add two buttons:

- “Submit anonymous report”
- “Not now”

Maya clicks “Submit anonymous report.”

### 3.4 Anonymous report privacy choice

Keep the existing Confidential Report modal and its current visual style.

Update the privacy section to make the two options clearer.

Option A:

“Department-level privacy: HR can see my department but not my identity.”

Description:

“You choose department-level privacy so HR can understand where the issue is happening and take targeted action. HR will not see your name, employee ID, email, individual AI-chat transcript, or other identifying information.”

Option B:

“Fully anonymous: HR will not see my department.”

Description:

“HR will see a company-wide anonymized theme but will not know which department the concern came from. HR can still review broader trends and take general action.”

For the demo, Maya selects:

“Department-level privacy: HR can see my department but not my identity.”

The report should remain associated with:

- Case reference: ANON-4827
- Department: Engineering
- Reporter identity: Hidden
- AI-chat transcript: Not attached
- Manager identity: Not disclosed

After submission, show:

“Your report has been submitted anonymously.  
Your case ID is ANON-4827.  
You can use this case ID to view updates and communicate securely with HR.  
HR will see that the concern came from Engineering, but will not see your identity.”

---

## 4. Update HR Portal

Keep the existing HR dashboard layout, metric cards, donut chart, priority concern cards, report queue, action plan, and Eko Copilot drawer.

Make only these necessary updates.

### 4.1 Add recurring-pattern evidence to CON-01

In the existing CON-01 “Burnout & Workload Imbalance” priority concern card, update or add the evidence summary to include:

- Recurring Eko conversation pattern detected over the past two weeks.
- Multiple related questions about unclear task priorities, additional tasks from senior colleagues, and workload conflict.
- Community post COM-1 and upvotes.
- Anonymous report ANON-4827 from Engineering.
- JIRO workload conflict and overtime indicator.

Add a small badge or label:

“Recurring pattern detected: Past 2 weeks”

Do not remove the existing operational indicators, metric cards, donut chart, or other priority concern cards.

### 4.2 Update report R004 review modal

In the existing R004 report review modal, add a clear privacy section.

Show:

Case ID: ANON-4827  
Department: Engineering  
Privacy level: Department-level privacy  
Reporter identity: Hidden  
AI-chat transcript: Not attached  
Manager identity: Not disclosed  

Add this privacy notice:

“Maya selected department-level privacy. HR can see that the concern came from Engineering, but cannot see Maya’s identity, individual AI-chat transcript, or individual survey answers.”

Add a “Related signals” section:

- Recurring Eko conversation pattern over the past two weeks.
- Similar community post COM-1 with 24 upvotes.
- JIRO workload conflict and overtime indicator.
- Pulse-survey trend showing workload pressure in Engineering.

### 4.3 Update HR action flow

Keep the existing Action Plan AP-01, but update it to reflect Mode 1.

Action Plan AP-01:

Title:  
“Engineering Workload & Role-Clarity Review”

Owner:  
Sarah Lee, Senior HR Business Partner

Assigned manager:  
Daniel Lim, Engineering Manager

Concern theme:  
“Unclear task ownership and workload conflict among new hires”

HR instruction to manager:

“We have identified a recurring concern among new hires in Engineering related to unclear task ownership and workload conflicts. Please review current workload allocation, clarify task ownership before assigning additional work, and introduce a weekly workload check-in during the first 90 days. Please update EchoHR when the action is completed.”

Deadline:  
Two weeks from report review.

Priority:  
High.

Status:  
Assigned.

Add a button or workflow step:

“Send anonymized action to manager”

After HR clicks it, show confirmation:

“Action assigned to Daniel Lim. The manager will receive only the anonymized concern theme, HR instruction, deadline, and action status. The manager will not receive employee identity, AI-chat transcripts, individual survey answers, or report details.”

---

## 5. Add Manager Action Workspace

Create a new **Manager Action Workspace** for Daniel Lim.

This is a new role/view, but it must reuse the existing EchoHR UI style: same sidebar pattern, card style, typography, color tokens, spacing, buttons, badges, modal style, and overall visual language.

Add “Engineering Manager” or “Daniel Lim” as a third role in the existing profile switcher.

### 5.1 Manager workspace layout

The Manager Action Workspace should contain:

1. Header: “Manager Action Workspace”
2. Welcome message: “Hello, Daniel”
3. Assigned action card
4. Secure HR chat
5. Action progress update form
6. Privacy notice

Do not show:

- HR metric cards.
- Donut chart.
- Priority concern cards.
- Report queue.
- Eko Copilot drawer.
- Employee identities.
- AI-chat transcripts.
- Individual survey answers.
- Community-post authors or upvote identities.

### 5.2 Assigned action card

Show:

Action title:  
“Clarify task ownership and review workload allocation for new hires”

Department:  
Engineering

Assigned by:  
Sarah Lee, HR

Concern theme:  
“Unclear task ownership and workload conflict among new hires”

HR instruction:

“We have identified a recurring concern among new hires in Engineering related to unclear task ownership and workload conflicts. Please review current workload allocation, clarify task ownership before assigning additional work, and introduce a weekly workload check-in during the first 90 days. Please update EchoHR when the action is completed.”

Deadline:  
Two weeks from assignment.

Priority:  
High.

Status:  
Assigned.

Add privacy notice:

“For privacy protection, individual employee identities, AI-chat transcripts, survey answers, and report details are not shared with managers.”

### 5.3 Secure HR-manager chat

Add a secure chat panel between Daniel Lim and Sarah Lee.

Use the following conversation:

Manager:

“Hi HR, I received the action about workload and task ownership. Could you share more about the type of concerns raised? I want to make sure I address the right issue.”

HR:

“Hi Daniel. We cannot share individual identities or chat transcripts. However, the recurring theme is that new hires receive additional tasks from senior colleagues while also managing their own sprint tasks. This creates uncertainty about priorities and ownership.  
The recommended focus is to clarify task ownership during sprint planning and review workload allocation before assigning additional work.”

Manager:

“Understood. I will review task allocation in the next sprint planning. Can I also ask new hires directly about their workload?”

HR:

“Yes. We recommend using open, supportive questions. For example: ‘How are your current priorities and workload feeling?’ or ‘Are there any tasks where ownership or deadline is unclear?’ Please avoid asking who submitted feedback.”

Manager:

“Noted. I will add a weekly check-in for new hires and update the action by Friday.”

### 5.4 Manager progress update

Add an action-update form.

Fields:

Status:  
Dropdown: Assigned / In progress / Completed  
Default for demo: In progress

Actions taken:  
Text area with prefilled demo content:

“Reviewed current sprint allocation. Identified two new hires with additional tasks from senior colleagues. Clarified that testing documentation should be reassigned. Added a weekly 15-minute workload check-in for new hires. Updated sprint-planning guidelines to confirm task owner before assigning extra work.”

Next step:  
Text area:

“Monitor workload signals and review progress in the next sprint.”

Completion date:  
Friday.

Buttons:

- “Save draft”
- “Submit update”

After the manager submits, HR should see:

Action status: In progress.  
Manager update received.  
HR can approve, request more information, or keep the action open.

---

## 6. HR close-loop flow

After the manager submits the update, HR reviews it.

HR clicks:

“Mark action as completed.”

HR then sends an update to Maya through the anonymous case channel.

HR message to Maya:

“Thank you for raising this concern. We have reviewed workload allocation in Engineering and clarified task-ownership guidance for new hires. Your manager will also introduce a weekly check-in during your first 90 days.  
Please continue to use Eko or submit feedback if similar issues occur.”

Maya’s report status changes to:

“Resolved.”

### 6.1 Community announcement

Keep the existing community announcement feature.

Update or reuse ANN-01 with this content:

Title:  
“You said, we did: Clearer task ownership and workload support for new hires”

Content:

“Several employees raised concerns about unclear task ownership and workload conflicts. We have updated the new-hire prioritization guide, clarified task ownership, and introduced a weekly workload check-in for new hires in affected departments.  
Thank you for speaking up. Your feedback helps us improve how we support new employees.”

Maya opens the community board and sees this announcement.

Maya’s report status also shows:

“Resolved.”

---

## 7. Update demo walkthrough

Update the existing “Start Demo” / “Live Walkthrough” flow to follow this sequence:

Step 1: Maya views or completes the occasional pulse survey.  
Step 2: Maya asks Eko for clarification about client launch materials.  
Step 3: Eko provides guidance from approved company resources.  
Step 4: Maya asks Eko about workload conflict.  
Step 5: Eko shows JIRO workload comparison and draft manager message.  
Step 6: Maya says the issue has happened a few times.  
Step 7: Eko detects a recurring pattern from Maya’s past two weeks of conversations.  
Step 8: Eko explains that the situation may not be ideal and offers voluntary next steps.  
Step 9: Maya views community discussion and upvotes COM-1.  
Step 10: Eko suggests anonymous report or feedback.  
Step 11: Maya submits anonymous report with department-level privacy.  
Step 12: Maya receives case ID ANON-4827.  
Step 13: Switch to HR portal.  
Step 14: HR reviews CON-01, ANON-4827, related community signals, and JIRO indicators.  
Step 15: HR assigns anonymized action to Daniel Lim.  
Step 16: Switch to Manager Action Workspace.  
Step 17: Daniel receives only the anonymized action package.  
Step 18: Daniel asks HR a question through secure chat.  
Step 19: Daniel updates action progress.  
Step 20: HR reviews update and marks action complete.  
Step 21: HR sends update to Maya through anonymous case channel.  
Step 22: HR posts “You said, we did” announcement.  
Step 23: Maya sees report status “Resolved” and community announcement.

Add a demo side panel or step indicator showing the current step and a short presenter instruction.

Example:

Step 7 instruction:

“Eko detects a recurring pattern from Maya’s past two weeks of conversations. Notice that Eko does not label Maya as disengaged. It explains that the situation may not be ideal and offers voluntary next steps.”

Step 15 instruction:

“HR assigns an anonymized action to the manager. The manager does not receive Maya’s identity, chat transcript, or individual survey answers.”

Step 16 instruction:

“Switch to the Manager Action Workspace. The manager receives only the anonymized concern theme, HR instruction, deadline, and action status.”

---

## 8. Copy and tone requirements

Use supportive, non-surveillance language.

Use:

- “Eko can help you work through this.”
- “You do not need to decide immediately.”
- “You can raise this safely and confidentially.”
- “Your identity will not be shared.”
- “HR sees anonymized themes, not your individual conversation.”
- “Your feedback can help improve the experience for other employees.”
- “You said, we did.”

Avoid:

- “We detected that you are disengaged.”
- “We are monitoring your behavior.”
- “We flagged you as a risk.”
- “Your manager will be informed about your issue.”
- “We know this is your problem.”

---

## 9. Acceptance criteria

The prototype is complete when:

1. The existing UI style is preserved.
2. The existing HR dashboard data remains mostly unchanged.
3. Maya can complete an occasional pulse survey.
4. Maya can ask Eko for client-launch clarification.
5. Eko answers using approved company resources.
6. Maya can ask Eko about a workload conflict.
7. Eko shows the JIRO workload comparison.
8. Eko detects a recurring pattern from Maya’s past two weeks of conversations.
9. Eko explains that the situation may not be ideal.
10. Eko offers voluntary next steps: manager message, community, feedback, or anonymous report.
11. Maya can upvote a similar community post.
12. Maya can submit an anonymous report.
13. Maya can choose department-level privacy.
14. Maya receives case ID ANON-4827.
15. HR can view the anonymized theme and report.
16. HR can assign an anonymized action to Daniel Lim.
17. Daniel Lim cannot access the HR dashboard.
18. Daniel receives only the anonymized action package.
19. Daniel can securely chat with HR.
20. Daniel can update action progress.
21. HR can mark the action complete.
22. HR can send an update to Maya through the anonymous case channel.
23. HR can post a “You said, we did” community announcement.
24. Maya can see the report status change to “Resolved.”
25. The demo clearly shows that Eko helps the employee first and does not automatically report, monitor, or identify the employee.