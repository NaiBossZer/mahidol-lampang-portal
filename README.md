# Mahidol Event Insights

ช่วยสร้าง Dashboard แสดงข้อมูลจาก

แบบเก็บข้อมูลความพึงพอใจพิธีเปิดห้องการเรียนรู้ครั่งครบวงจร

โดยเชื่อมต่อข้อมูลจาก Google Sheets ผ่าน Connectors

Google Sheets:
https://docs.google.com/spreadsheets/d/1s12EnpAjUB2Xq_QHDzlUXbYt9kIZ-Rl7ayxIbiR2HNg/edit?usp=drive_link

ให้ระบบอ่านข้อมูลและชื่อ Column จาก Google Sheets โดยอัตโนมัติ ห้าม Hard-code ข้อมูล และต้องสามารถอัปเดตข้อมูลจาก Google Sheets ได้

1. DESIGN / UI

ออกแบบเป็น Executive Dashboard สำหรับผู้บริหาร

UI ให้มีลักษณะใกล้เคียงภาพ Reference ที่แนบมา โดยใช้แนวคิด

Dark Infographic / Modular Dashboard

ไม่ต้องทำเป็น Dashboard แบบ Card สีขาวทั่วไป

ใช้ Layout แบบหลาย Panel ในหน้าเดียว เน้น

ตัวเลขขนาดใหญ่

กราฟขนาดกะทัดรัด

Infographic

Thin Border

Dark Background

Minimal UI

Modern Executive

อ่านข้อมูลได้อย่างรวดเร็ว

ให้มีความรู้สึกคล้าย

Executive Data Wall + Modern Infographic

2. MAHIDOL THEME

ใช้ Theme ของ Mahidol University

เว็บไซต์อ้างอิง:
https://en.mahidol.ac.th/

ใช้

Mahidol Blue เป็นสีหลัก

Mahidol Yellow / Gold เป็นสี Accent

White สำหรับข้อความ

Dark Navy / Charcoal เป็น Background

Green ใช้เป็น Accent สำหรับข้อมูลด้านสิ่งแวดล้อมและครั่ง

ใช้ Official Mahidol Logo

ไม่ต้องใช้ Green เป็นสีหลัก เพราะต้องรักษา Identity ของ Mahidol University

3. HEADER

ด้านบนแสดง

MAHIDOL UNIVERSITY

พิธีเปิดห้องการเรียนรู้ครั่งครบวงจร

ด้านล่างแสดง

Satisfaction & Event Insight Dashboard

ด้านขวาแสดง

จำนวนผู้ตอบ

Last Updated

Refresh

Filter

Export

4. EXECUTIVE SUMMARY

สร้าง KPI สำหรับผู้บริหาร ได้แก่

จำนวนผู้ตอบแบบสอบถาม

ค่าเฉลี่ยความพึงพอใจโดยรวม

ระดับความพึงพอใจ (%)

จำนวน/สัดส่วนผู้เข้าร่วมจากแต่ละกลุ่ม

ความประทับใจต่อกิจกรรม

ความต้องการเข้าร่วมกิจกรรมในอนาคต หากมีข้อมูล

Recommendation / NPS หากมีคำถามในแบบสอบถาม

ใช้ KPI ขนาดใหญ่แบบ Infographic

เกณฑ์สี:

เขียว > 4.50
เหลือง 4.00–4.49
แดง < 4.00

5. PARTICIPANT PROFILE

วิเคราะห์ข้อมูลผู้ตอบจาก Column ที่มีอยู่จริงใน Google Sheets

ให้ระบบตรวจสอบและสร้างกราฟตามข้อมูลที่พบ เช่น

Donut Chart

หน่วยงาน

ประเภทหน่วยงาน

กลุ่มผู้เข้าร่วม

Bar Chart

ตำแหน่ง

บทบาท

กลุ่มผู้เข้าร่วม

Table

แสดงจำนวนผู้ตอบแยกตามหน่วยงาน

6. EVENT SATISFACTION

วิเคราะห์คำถามด้านความพึงพอใจของพิธีเปิดทั้งหมด

ให้ระบบตรวจจับคำถามประเภท Rating / Likert Scale จาก Google Sheets อัตโนมัติ

แสดงด้วย

Horizontal Bar Chart

แสดง

ค่าเฉลี่ย

SD

Ranking

พร้อมจัดอันดับ

TOP 3

หัวข้อที่ได้รับคะแนนสูงสุด

BOTTOM 3

หัวข้อที่ควรปรับปรุง

7. EVENT EXPERIENCE

วิเคราะห์ประสบการณ์ของผู้เข้าร่วมงาน เช่น หากมีข้อมูลเกี่ยวกับ

ความเหมาะสมของสถานที่

การต้อนรับ

การลงทะเบียน

การจัดกิจกรรม

ความเหมาะสมของเวลา

ความน่าสนใจของกิจกรรม

ความสะดวกในการเข้าร่วม

ให้แสดงเป็น

Bar Chart / Radar Chart

เพื่อให้ผู้บริหารเห็นภาพรวมของประสบการณ์ผู้เข้าร่วม

8. LEARNING / KNOWLEDGE IMPACT

หากแบบสอบถามมีคำถามเกี่ยวกับผลที่ได้รับจากห้องการเรียนรู้หรือกิจกรรม

ให้วิเคราะห์

ได้รับความรู้

เข้าใจเรื่องครั่งมากขึ้น

เห็นประโยชน์ของห้องการเรียนรู้

สามารถนำความรู้ไปใช้

มีความสนใจเรียนรู้เพิ่มเติม

แสดงเป็น

Stacked Bar Chart

หรือ

Radar Chart

พร้อมคำนวณ

Learning Impact Score

9. EVENT SUCCESS SCORE

สร้างคะแนนความสำเร็จของกิจกรรม

โดยคำนวณจากข้อมูลจริง เช่น

Overall Satisfaction

Event Experience

Learning Impact

Future Interest

Recommendation

หากข้อมูลใดไม่มี ให้ตัดตัวแปรนั้นออกจากสูตรโดยอัตโนมัติ

แสดงเป็น

Gauge

พร้อมข้อความ

Excellent
Very Good
Good
Needs Improvement

10. FEEDBACK ANALYSIS

วิเคราะห์คำตอบปลายเปิด

แสดง

Word Cloud

Top Keywords

Top Topics

และถ้าสามารถวิเคราะห์ด้วย AI ได้ ให้แสดง

Sentiment Analysis

Positive

Neutral

Negative

พร้อมสรุป

จุดเด่นของกิจกรรม

ประเด็นที่ควรปรับปรุง

ข้อเสนอแนะจากผู้เข้าร่วม

11. AI EVENT INSIGHT

สร้าง AI Insight สำหรับผู้บริหาร

ให้ AI วิเคราะห์ข้อมูลทั้งหมดจาก Google Sheets และตอบ

ผู้เข้าร่วมพึงพอใจเรื่องใดมากที่สุด

เรื่องใดควรปรับปรุง

ผู้เข้าร่วมได้รับประโยชน์อะไรจากกิจกรรม

ผู้เข้าร่วมมีความสนใจต่อห้องการเรียนรู้มากน้อยเพียงใด

ผู้เข้าร่วมต้องการกิจกรรมต่อยอดหรือไม่

ควรจัดกิจกรรมครั้งต่อไปอย่างไร

แสดงเป็นข้อความสั้น ๆ ไม่เกิน 5 ข้อ

12. NEXT EVENT / FUTURE OPPORTUNITY

หากแบบสอบถามมีข้อมูลความต้องการเข้าร่วมกิจกรรมในอนาคต ให้สร้าง

Future Participation

แสดงเป็น %

และวิเคราะห์ว่า

ต้องการเข้าร่วม

ไม่แน่ใจ

ไม่ต้องการ

หากมีคำถามเกี่ยวกับประเภทกิจกรรมที่ต้องการ ให้สร้าง

Future Activity Ranking

เพื่อดูว่าผู้เข้าร่วมต้องการกิจกรรมประเภทใดมากที่สุด

13. EVENT IMPROVEMENT MATRIX

สร้าง Matrix เพื่อช่วยผู้บริหารตัดสินใจ

แกน X:

ความพึงพอใจ

แกน Y:

ความสำคัญ / ความต้องการ

แบ่งเป็น

KEEP

สิ่งที่ควรรักษา

PROMOTE

สิ่งที่ควรส่งเสริม

IMPROVE

สิ่งที่ควรปรับปรุง

PRIORITY

สิ่งที่ควรเร่งพัฒนา

14. TREND / RESPONSE

หากข้อมูลมี Timestamp หรือวันที่ตอบแบบสอบถาม ให้สร้าง

Trend Chart

แสดง

จำนวนผู้ตอบ

คะแนนความพึงพอใจ

Response Rate

หากมีข้อมูลจากหลายช่วงเวลา ให้เปรียบเทียบแนวโน้ม

หากมีข้อมูลเพียงกิจกรรมเดียว ให้ใช้

Response Timeline

แทน

15. DASHBOARD FILTER

สามารถ Filter ตามข้อมูลที่มีจริงใน Google Sheets เช่น

หน่วยงาน

ประเภทหน่วยงาน

ตำแหน่ง

กลุ่มผู้เข้าร่วม

วันที่ตอบแบบสอบถาม

Filter ต้องทำงานร่วมกับทุก Visualization

16. VISUALIZATION

ใช้ Visualization ที่เหมาะสม ได้แก่

KPI

Gauge

Donut Chart

Bar Chart

Horizontal Bar

Stacked Bar

Radar Chart

Heatmap

Trend Chart

Word Cloud

Ranking

Matrix

Table

ไม่ต้องใช้ทุกกราฟพร้อมกัน

ให้เลือกใช้เฉพาะกราฟที่เหมาะกับข้อมูลจริง

17. REAL-TIME DATA

ระบบต้องรองรับ

Google Forms → Google Sheets → Dashboard

เมื่อมีข้อมูลใหม่ใน Google Sheets สามารถ Refresh Dashboard และคำนวณข้อมูลใหม่ได้

แสดง

LIVE / CONNECTED

Last Updated

Refresh

Loading

Error

Empty Data

หากไม่สามารถเชื่อมต่อ Google Sheets ได้ ให้แสดงข้อความแจ้งเตือนที่ชัดเจน

18. AI DATA RULE

AI ต้องวิเคราะห์จากข้อมูลจริงเท่านั้น

ห้ามสร้างตัวเลขหรือข้อมูลขึ้นเอง

หากข้อมูลไม่เพียงพอ ให้แสดง

“ไม่สามารถวิเคราะห์ในประเด็นนี้ได้ เนื่องจากข้อมูลไม่เพียงพอ”

ทุก KPI และกราฟต้องคำนวณจากข้อมูลใน Google Sheets

19. EXECUTIVE RECOMMENDATION

สร้างส่วน

WHAT SHOULD WE DO NEXT?

ให้ AI วิเคราะห์และเสนอแนวทาง เช่น

สิ่งที่ควรรักษา

สิ่งที่ควรปรับปรุง

สิ่งที่ควรเพิ่มในกิจกรรมครั้งต่อไป

รูปแบบกิจกรรมที่ผู้เข้าร่วมสนใจ

แนวทางพัฒนาห้องการเรียนรู้ครั่งครบวงจร

20. EXPORT

สามารถ Export ได้

PDF Executive Report

Excel Summary

PowerPoint Summary

PDF ให้สรุปเป็น Executive Report แบบกระชับ

ประกอบด้วย

Executive Summary

KPI

Participant Profile

Satisfaction

Event Experience

Learning Impact

Feedback

AI Recommendation

21. FINAL LAYOUT

หน้าแรกจัดเป็น Modular Infographic Dashboard คล้ายภาพ Reference

โครงสร้างโดยประมาณ:

HEADER

↓

KPI SUMMARY

↓

Participant | Satisfaction | Event Experience

↓

Learning Impact | Event Success | Future Participation

↓

Feedback | AI Insight | Recommendation

ไม่ต้องใช้พื้นที่มากเกินไป

เน้นให้ผู้บริหารสามารถเข้าใจภาพรวมของงานได้ภายใน 30 วินาที

Dashboard ต้องมีความเป็น

Mahidol University
+
Modern Infographic
+
Executive Dashboard
+
Learning & Environmental Event

และต้องสื่อถึง

“พิธีเปิดห้องการเรียนรู้ครั่งครบวงจร”

อย่างชัดเจน

เป้าหมายของ Dashboard คือไม่ใช่เพียงแสดงผลแบบสอบถาม แต่ต้องช่วยผู้บริหารตอบคำถามว่า

ผู้เข้าร่วมพึงพอใจมากน้อยเพียงใด?

กิจกรรมประสบความสำเร็จหรือไม่?

ผู้เข้าร่วมได้รับประโยชน์อะไร?

มีประเด็นใดที่ควรปรับปรุง?

ผู้เข้าร่วมต้องการอะไรต่อไป?

และกิจกรรมครั้งต่อไปควรพัฒนาอย่างไร?

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://mahidol-insight-hub.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6e54d5fb-7d0b-4af5-8652-1ec82aeffdfa).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
