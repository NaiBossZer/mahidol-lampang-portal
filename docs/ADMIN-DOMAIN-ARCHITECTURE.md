# Central Admin — Domain Architecture

This document translates the Master Feature Map into production domain boundaries.

## Domain ownership

| Domain | Primary records | Primary responsibility |
| --- | --- | --- |
| Activity | activities | activity master data |
| Occurrence | activity_occurrences | each real delivery of an activity |
| Activity Media | activity media references | cover/post-event media inside Activity workspace |
| Learning Center | learning_centers | learning-center identity and relationships |
| Organization | organizations | participant/partner organization hierarchy |
| Survey | occurrence_surveys, survey_questions | survey definition and publication window |
| Response | survey_responses, survey_answers | submitted answers and historical responses |
| Content | CMS records | public/admin managed content |
| Partner | partner records | partner/network presentation |
| Analytics | derived read models/queries | executive and operational insight |
| Governance | admin/RBAC/audit/lifecycle | authorization, traceability and retention |
| AI | intents/jobs/plans/actions | governed orchestration across domains |

## Relationship rules

```text
Activity 1 ─── N Occurrence
Activity N ─── M Learning Center
Activity N ─── M Organization/Organizer relationships where required
Occurrence 0 ─── 1 Survey
Survey 1 ─── N Question
Survey 1 ─── N Response
Response 1 ─── N Answer
```

## Lifecycle

### Activity
`Draft → Scheduled → Ongoing → Completed → Archived → Retired`

`Cancelled` is a terminal business state for an activity/occurrence where applicable. Cancelled records remain stored for audit/history and are hidden from normal operational views.

### Survey
`Draft → Published → Closed → Archived`

### Content
`Draft → Published → Archived → Retired`

Hard delete is not the normal lifecycle for records with historical responses or audit dependencies.

## Survey model

Production surveys must be data-driven:

```text
Survey
 ├── Sections
 │    └── Questions
 └── Responses
      └── Answers
```

Questions are not represented as fixed database columns. A question has a stable identifier and answer records reference that identifier. This allows new questions and survey versions without schema changes for every question.

The standard satisfaction scale is five levels, while the question model remains extensible for other approved question types.

## Media model

Actual image files belong in Supabase Storage. PostgreSQL stores references and metadata required by the application. Activity management owns media workflows; there is no standalone AI Media domain.

Recommended logical paths:

```text
activity-media/{activity-id}/cover/{file}
activity-media/{activity-id}/post-event/{file}
activity-media/{activity-id}/occurrences/{occurrence-id}/{file}
```

## Analytics rules

- No Survey is not score zero.
- No response is not score zero.
- Cancelled records are excluded from normal KPI/satisfaction calculations.
- Archived historical data remains queryable where authorized.
- Satisfaction uses valid submitted answers only.
- Anonymous/Identified is a survey/occurrence privacy mode, not a separate response store.

## AI domain contract

AI operates across domains only through typed tools. A tool must declare:

- input schema
- output schema
- required permission
- risk class
- supported domain
- audit requirements
- whether admin confirmation is required

AI agents do not receive database credentials and do not execute SQL.

## Implementation rule

A domain is considered implemented only when its UI, service/API contract, persistence model, authorization and lifecycle behavior are connected. Static Stitch prototypes are references, not implementations.
