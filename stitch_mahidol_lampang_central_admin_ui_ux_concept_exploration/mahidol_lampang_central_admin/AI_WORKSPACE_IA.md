# AI Workspace — Information Architecture

## Decision

Adopt **Option A: AI Workspace as a single top-level Admin destination**.

The navigation should expose one AI entry only. The existing AI capabilities remain intact as workspace tabs/views rather than separate primary navigation items.

## Admin navigation

```text
CENTRAL ADMIN
├── Dashboard
│
├── OPERATIONS
│   ├── กิจกรรม
│   ├── แบบสอบถาม
│   ├── Analytics
│   ├── ศูนย์การเรียนรู้
│   └── Content / CMS
│
├── AI WORKSPACE
│   └── AI Workspace
│       ├── Overview
│       ├── Command
│       ├── Queue
│       ├── Execution
│       ├── Approval
│       └── History
│
└── ADMINISTRATION
    ├── Governance
    ├── System & Access
    └── Audit Trail
```

## Operations consolidation

`Engagement & Insights` is removed as a navigation layer. It is an organizational concept, not a required destination for administrators.

Survey and analytics capabilities remain available directly under `OPERATIONS`:

- แบบสอบถาม
- Analytics

No survey, analytics, activity, or data capability is removed by this IA change.

## AI Workspace behavior

### Overview

The landing view answers three questions immediately:

1. What is AI doing now?
2. What needs my attention?
3. What happened recently?

Recommended summary blocks:

- Running executions
- Awaiting approval
- Completed today
- Failed / needs attention
- Recent executions
- Quick actions

### Command

Used to create a new AI task:

- Select agent/tool
- Enter objective/instruction
- Attach relevant context or documents
- Review execution intent
- Submit

### Queue

Shows operational AI work states:

- Queued
- Running
- Awaiting approval
- Failed / retryable

### Execution

Shows the active execution plan and step-level progress:

- Plan
- Current step
- Inputs / outputs
- Progress
- Errors
- Retry state

### Approval

Human decision workspace:

- Items requiring review
- Proposed action/result
- Evidence/context
- Approve
- Reject with reason

### History

Auditable execution history:

- Time
- Actor
- Agent/tool
- Status
- Duration
- Result
- Link to execution detail

## Navigation rule

The AI capabilities must **not** be deleted or merged at the data/API/domain level merely because their primary navigation entries are consolidated.

The IA change is presentation/navigation only. Existing execution, approval, queue, and history states remain first-class domain capabilities.

## UX rule

Do not render all six views as one long page. Use a single AI Workspace shell with persistent contextual tabs so users can move between Overview, Command, Queue, Execution, Approval, and History without leaving the AI domain.

## Labels

Primary navigation label: **AI Workspace**

Page title: **AI Workspace**

Suggested Thai subtitle: **ศูนย์จัดการงาน AI ของ Mahidol Lampang**

The former label `AI Command Center` may remain as the conceptual name of the command capability, but it should not be the only label for the whole AI domain.
