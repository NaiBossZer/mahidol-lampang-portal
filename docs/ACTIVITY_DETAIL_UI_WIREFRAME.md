# Activity Detail — UI Wireframe

Branch: `feat/dashboard-redesign`

## Desktop layout

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ ← กลับกิจกรรม                                      [สถานะ: เผยแพร่แล้ว]      │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  [ COVER / FEATURED IMAGE ]                 ชื่อกิจกรรม                     │
│  ┌──────────────────────────┐               วันที่จัดกิจกรรม                │
│  │                          │               สถานที่                         │
│  │                          │               ผู้เข้าร่วมเป้าหมาย             │
│  │                          │               [ดู/แก้ไข Activity]             │
│  └──────────────────────────┘                                               │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│ คำอธิบายกิจกรรม                                                             │
│ [summary]                                                                   │
│                                                                              │
│ รายละเอียดกิจกรรม                                                           │
│ [content]                                                                   │
├───────────────────────────────────────────────┬──────────────────────────────┤
│ วัตถุประสงค์                                  │ AI Analysis                  │
│ [objective]                                   │ ✓ วิเคราะห์แล้ว              │
│                                               │ Summary                       │
│ กระบวนการดำเนินงาน                            │ [summary]                     │
│ [process]                                     │ Objective / Target / KPI      │
│                                               │ [entity cards]                │
├───────────────────────────────────────────────┴──────────────────────────────┤
│ ผลลัพธ์และผลกระทบ                                                           │
│ [ outcome ]                              [ impact ]                          │
│                                                                              │
│ ตัวชี้วัดผลลัพธ์                                                             │
│ ┌────────────────┬──────────────┬──────────┐                                │
│ │ Metric         │ Value        │ Unit     │                                │
│ ├────────────────┼──────────────┼──────────┤                                │
│ │ ...            │ ...          │ ...      │                                │
│ └────────────────┴──────────────┴──────────┘                                │
├──────────────────────────────────────────────────────────────────────────────┤
│ ภาพกิจกรรม                                                                  │
│ [ image ] [ image ] [ image ] [ image ]                                     │
├──────────────────────────────────────────────────────────────────────────────┤
│ หน่วยงาน/ภาคีเครือข่าย                                                      │
│ [ Partner ] [ Partner ] [ Partner ]                                          │
├──────────────────────────────────────────────────────────────────────────────┤
│ แบบประเมินกิจกรรม                                                           │
│ ┌──────────────────────────────────────────────────────────────────────────┐ │
│ │ ✓ AI Survey พร้อมใช้งาน    3 sections · 12 questions                     │ │
│ │ แบบประเมินความพึงพอใจและผลสัมฤทธิ์                                        │ │
│ │                                      [ดูแบบประเมิน] [ผลการประเมิน]        │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

## Mobile layout

```
┌─────────────────────────────┐
│ ← กิจกรรม      [สถานะ]      │
├─────────────────────────────┤
│       COVER IMAGE            │
├─────────────────────────────┤
│ ชื่อกิจกรรม                  │
│ วันที่ · สถานที่             │
│ ผู้เข้าร่วมเป้าหมาย          │
├─────────────────────────────┤
│ คำอธิบายกิจกรรม              │
│ [summary]                    │
├─────────────────────────────┤
│ รายละเอียดกิจกรรม            │
│ [content]                    │
├─────────────────────────────┤
│ วัตถุประสงค์                 │
│ [objective]                  │
├─────────────────────────────┤
│ กระบวนการดำเนินงาน           │
│ [process]                    │
├─────────────────────────────┤
│ ผลลัพธ์ / ผลกระทบ            │
│ [outcome] [impact]           │
├─────────────────────────────┤
│ AI Analysis                  │
│ [summary]                    │
│ [entity cards]               │
├─────────────────────────────┤
│ ตัวชี้วัด                    │
│ [metric cards]               │
├─────────────────────────────┤
│ ภาพกิจกรรม                   │
│ [image] [image]               │
├─────────────────────────────┤
│ ภาคีเครือข่าย                │
│ [partner cards]               │
├─────────────────────────────┤
│ แบบประเมิน                   │
│ [survey status]              │
│ [ดูแบบประเมิน]               │
└─────────────────────────────┘
```

## UI hierarchy

1. Header / identity — title, status, date, location, participant target.
2. คำอธิบายกิจกรรม — `summary` is the short description requested for each activity.
3. รายละเอียด — `content`.
4. Activity narrative — objective → process → outcome → impact.
5. Evidence — metrics, photos, partners.
6. AI evidence — analysis summary and extracted entities, clearly identified as AI output.
7. Survey — status and high-level metadata with links to survey/result screens.

## Interaction rules

- "คำอธิบายกิจกรรม" is read-only in Activity Detail; editing remains in Activity management/creation.
- AI Analysis cards are evidence/context, not silently written back into Activity fields.
- Survey section is a summary and navigation surface, not a second survey editor.
- The page should not create duplicate Activity fields.
- Draft/Published/Archived status remains the existing Activity lifecycle.
