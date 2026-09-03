# Phase 3–5 — Layout, Interaction และ Release QA

## Phase 3: Page Layout

หน้าแรกปัจจุบันมีองค์ประกอบที่ต้องรักษาไว้ครบ ได้แก่ Hero Carousel, โครงการหลัก, บริการ, แผนผัง 3D, EV Booking, ตลาดผัก, Knowledge Base, Partner Logos และ Footer

แนวทางนำไปใช้:

- ใช้ Hero หลักสื่อสาร “งานพันธกิจเพื่อสังคม” ก่อนชื่อพื้นที่เรียนรู้
- จัดโครงการเป็น Module Cards ที่แยกตามภารกิจ: องค์ความรู้, เกษตร, พลังงาน, ผลิตภัณฑ์
- ให้แผนผัง 3D มีชื่อรองว่า “พื้นที่ปฏิบัติงานและการเรียนรู้”
- คงลิงก์ไปยังระบบย่อยเดิมทุกแห่ง
- คงข้อมูลสินค้าและ Partner Logos เดิมก่อนย้ายไป CMS

## Phase 4: Interaction และ Accessibility

มี Search บนหน้าแรกอยู่แล้ว และต้องรักษาพฤติกรรมค้นหา Knowledge Cards เดิมไว้ พร้อมตรวจเพิ่มเติม:

- ปุ่ม Carousel ต้องมี Label และ Keyboard Control
- รูปภาพทุกใบต้องมี Alt Text ที่อธิบายเนื้อหา
- Video ต้องไม่เล่นเสียงอัตโนมัติ และต้องมี Poster/Caption
- 3D Viewer ต้องมี Fallback เป็นแผนที่หรือรายการโซน
- ปุ่มและ Link ต้องมี Focus State จาก Design System
- รองรับ Reduced Motion จาก `styles.css`
- Mobile Navigation ต้องไม่ซ่อนบริการหลักไว้เฉพาะ Hover

## Phase 5: Release Checklist

- [ ] ตรวจหน้า `/`
- [ ] ตรวจหน้า `/storefront`
- [ ] ตรวจหน้า `/smart-farm`
- [ ] ตรวจหน้า `/clean-energy`
- [ ] ตรวจหน้า `/rac`
- [ ] ตรวจหน้า `/survey`
- [ ] ตรวจการ Redirect ไป `/login` ของ `/dashboard` และ `/admin`
- [ ] ตรวจ Asset ทุกไฟล์ใน `public/`
- [ ] ตรวจ External URL ทุกแห่ง
- [ ] ตรวจ Console Error และ Runtime Error Boundary
- [ ] รัน `npm run lint`
- [ ] รัน `npm run build`
- [ ] รัน `npm run smoke`

## ข้อจำกัดที่ต้องตรวจด้วยผู้ดูแลระบบ

ระบบภายนอก Google Apps Script, ระบบ Login, Vercel Deployments และข้อมูล Real-time ต้องตรวจด้วย Credential/Environment จริงก่อน Production Sign-off
