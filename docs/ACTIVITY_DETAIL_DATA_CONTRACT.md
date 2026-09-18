# Activity Detail — Data Contract

Branch: `feat/dashboard-redesign`

## 1. Purpose

Define the read contract for an Activity Detail view without changing the existing database schema.

The existing Activity data remains the source of truth. AI Analysis and Survey data are related records/results and must not silently overwrite Activity fields.

## 2. Canonical Activity object

| UI field | API/Type field | Database column | Source | Required |
| --- | --- | --- | --- | --- |
| ชื่อกิจกรรม | `title` | `activities.title` | Activity Brief | yes |
| URL Slug | `slug` | `activities.slug` | Activity Brief | yes |
| สรุปกิจกรรม | `summary` | `activities.summary` | Activity Brief | no |
| รายละเอียดกิจกรรม | `content` | `activities.content` | Activity data | no |
| วันที่จัดกิจกรรม | `activityDate` | `activities.activity_date` | Activity Brief | yes |
| สถานที่ | `location` | `activities.location` | Activity Brief | no |
| ผู้เข้าร่วมเป้าหมาย | `participantCount` | `activities.participant_count` | Activity Brief | no |
| วัตถุประสงค์ | `objective` | `activities.objective` | Activity Brief | no |
| กระบวนการดำเนินงาน | `process` | `activities.process` | Activity data | no |
| ผลลัพธ์ | `outcome` | `activities.outcome` | Activity data | no |
| ผลกระทบ | `impact` | `activities.impact` | Activity data | no |
| รูปภาพหลัก | `featuredImage` | `activities.featured_image` | Activity data | no |
| สถานะ | `status` | `activities.status` | Activity lifecycle | yes |

## 3. Related collections

### Photos

From `activity_photos`:

```ts
type ActivityPhoto = {
  id: string;
  activityId: string;
  imageUrl: string;
  thumbnailUrl?: string | null;
  caption?: string | null;
  altText?: string | null;
  sortOrder: number;
  isCover: boolean;
};
```

### Outcome metrics

From `activity_outcomes`:

```ts
type ActivityOutcomeMetric = {
  id: string;
  activityId: string;
  metricName: string;
  metricValue?: string | null;
  unit?: string | null;
  description?: string | null;
};
```

### Partners

From `activity_partners` → `partners`:

```ts
type ActivityPartner = {
  id: string;
  name: string;
  type?: string | null;
  logo?: string | null;
  description?: string | null;
};
```

## 4. AI Analysis contract

AI document analysis returns entities with:

```ts
type ActivityAiEntity = {
  id: string;
  category: "objective" | "target_group" | "location" | "kpi" | "schedule";
  categoryLabel: string;
  title: string;
  text: string;
  sourceDoc: string;
  page: string;
  confidence: number;
};
```

Important distinction:

- `objective`, `location`, etc. from Activity are canonical Activity fields.
- `target_group`, `kpi`, and `schedule` are currently AI-extracted information.
- AI-extracted information should be displayed as AI/source evidence until an approved persistence contract exists.
- Do not present `participantCount` as the target group. It is a numeric target participant count.

## 5. Survey contract

Generated Survey is related to the Activity by `activityId`.

```ts
type ActivitySurvey = {
  id: string;
  activityId: string;
  surveyTitle: string;
  generatedDate: string;
  scaleType: string;
  aiConfidenceScore: number;
  status: "ready_for_review";
  sections: Array<{
    id: string;
    title: string;
    description: string;
    questions: Array<{
      id: string;
      aspectIndex: number;
      title: string;
      questionType: "single_choice" | "likert5" | "text";
      scaleLabel?: string;
      sourceCiting: string;
      sourceDocName: string;
      required?: boolean;
    }>;
  }>;
};
```

The Activity Detail view should show Survey status/summary, not duplicate the complete survey editor.

## 6. Read-model shape for Activity Detail

```ts
type ActivityDetail = {
  activity: {
    id: string;
    title: string;
    slug: string;
    summary?: string | null;
    content?: string | null;
    activityDate: string;
    location?: string | null;
    participantCount?: number | null;
    objective?: string | null;
    process?: string | null;
    outcome?: string | null;
    impact?: string | null;
    featuredImage?: string | null;
    status: "draft" | "published" | "archived";
  };
  photos: ActivityPhoto[];
  outcomes: ActivityOutcomeMetric[];
  partners: ActivityPartner[];
  aiAnalysis?: {
    status?: string;
    summary?: string;
    entities: ActivityAiEntity[];
    executionId?: string;
  } | null;
  survey?: {
    executionId?: string;
    status?: string;
    title?: string;
    questionCount: number;
    sectionCount: number;
  } | null;
};
```

## 7. Empty-state rules

- Missing `summary`: do not invent a description.
- Missing `content`: hide the full-detail section or show an explicit empty state.
- Missing `featuredImage` and photos: use a neutral media placeholder.
- No AI Analysis: show "ยังไม่มีผลวิเคราะห์ AI".
- No Survey: show "ยังไม่ได้สร้างแบบประเมิน".
- No outcome metrics: show "ยังไม่มีตัวชี้วัดผลลัพธ์".
- No partners: do not show an empty partner list.

## 8. Data ownership

```
Activity Brief
  └── activities  ← canonical activity data

Uploaded documents
  └── portal_media_assets

AI Analysis
  └── ai_executions (intent = document_analysis)

AI Survey
  └── ai_executions (intent = survey_generation)

Approval
  └── ai_approvals

Audit
  └── audit_logs
```

No new `description`, `target_group`, `kpi`, or `schedule` column is introduced by this contract.
