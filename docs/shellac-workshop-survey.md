# Shellac Workshop Online Survey

## Event
- Title: โครงการอบรมเชิงปฏิบัติการ “ครั่งสร้างรายได้ สู้โลกร้อน: การปล่อยเลี้ยงครั่งและการจัดการครั่งอย่างยั่งยืน”
- Date: Friday, 18 December 2026, 08:30–16:00 (Asia/Bangkok)
- Location: คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล อำเภอสบปราบ จังหวัดลำปาง
- Survey route: `/survey?surveyId=<survey-id>`
- Admin setup: `/admin/surveys`

## Setup
1. Sign in with an account authorized for activity and survey creation.
2. Open `/admin/surveys`.
3. Select **ตั้งค่าแบบประเมินโครงการครั่ง**.
4. The setup action reuses an activity with the distinctive shellac workshop title when present. Otherwise it creates a **draft** activity, creates the 18 Dec 2026 scheduled occurrence, creates an anonymous survey, and installs the 26-question template.
5. Select the survey and use **คัดลอกลิงก์** to copy its public response URL.
6. Review the activity draft and event metadata in Activity Management before publishing the activity page.

The public survey is scheduled to open at 15:45 on 18 Dec 2026 (UTC+7) and close at 23:59:59 on 25 Dec 2026 (UTC+7). The survey is anonymous and does not ask for names or phone numbers. Optional demographic questions are intentionally non-identifying.

## Survey sections
1. General participant profile (age band, occupation, prior shellac experience, host plants)
2. Event organization
3. Learning content and speakers
4. Demonstration and hands-on practice
5. Knowledge gain, confidence, implementation plan, barriers and support needs
6. Overall satisfaction
7. Open feedback

Ratings use a 1–5 scale (1 = น้อยที่สุด, 5 = มากที่สุด). Question data is stored through the existing `occurrence_surveys`, `survey_questions`, `survey_responses`, and `survey_answers` tables and existing Admin Survey Analytics pages.

## Important review before publication
- The user brief names the organizer as **องค์การบริหารส่วนตำบลแม่วะ** while the attached schedule text appears to say **องค์การบริหารส่วนตำบลแม่กัวะ**. Confirm the official spelling and organizer before publishing the activity content; the questionnaire does not hard-code the organizer name.
- Confirm the event location and exact wording with the event owner.
- The current consent notice is a concise in-form notice, not a substitute for the university's approved PDPA privacy notice. The data controller should confirm the lawful basis, retention period, data-subject contact, and final privacy wording before collecting real responses.
- Public submission validation checks the survey window, active question IDs, required answers, rating bounds and choice options. This does not provide CAPTCHA or distributed rate limiting; add an approved anti-abuse control if the public link is expected to receive high-volume or hostile traffic.
- The public API writes a response and its answers in two REST operations, not one database transaction. If the answer insert fails after response creation, an incomplete response row may need operational cleanup.
