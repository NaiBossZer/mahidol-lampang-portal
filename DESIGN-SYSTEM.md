# Phase 2 — Design System

## Design direction

**Local Wisdom, Future Learning** — งานพันธกิจเพื่อสังคมเป็นอัตลักษณ์หลัก ส่วน “พื้นที่เรียนรู้” ใช้เป็นคำอธิบายรอง ดีไซน์จึงต้องอบอุ่นแบบพื้นที่จริง แต่ยังคงความน่าเชื่อถือแบบมหาวิทยาลัย

## Brand tokens

| Token | ค่า | บทบาท |
|---|---|---|
| `brand-navy` | `#123B63` | ชื่อหน่วยงาน, Header, Heading |
| `brand-blue` | `#1677A8` | ปุ่มหลัก, Link, Focus |
| `local-terracotta` | `#C66B4F` | Accent ที่สื่อถึงพื้นที่และชุมชน |
| `northern-gold` | `#D6A84F` | Highlight, Badge, เส้นเน้น |
| `leaf` | `#5F8D62` | สิ่งแวดล้อม, เกษตร, สถานะสำเร็จ |
| `surface-warm` | `#F8F6F0` | พื้นหลังส่วนเนื้อหา |
| `ink` | `#1F2933` | เนื้อหาหลัก |
| `muted-ink` | `#667085` | คำอธิบายและ Metadata |

กติกา: พื้นหลังหลักใช้สีสว่าง, ห้ามใช้สีอย่างเดียวเพื่อสื่อสถานะ, และ Text/Background ต้องผ่าน WCAG AA

## Typography

- Body: `IBM Plex Sans Thai`, fallback `Noto Sans Thai`, `system-ui`
- Display: `Chakra Petch` ใช้เฉพาะตัวเลขหรือหัวข้อสั้นที่ต้องการบุคลิก
- Body 16px ขึ้นไป, line-height 1.6–1.8
- Heading ใช้น้ำหนัก 700–800 และจำกัดความยาวเพื่อรองรับมือถือ
- ใช้ภาษาไทยเป็นหลัก; English เป็น Label รอง เช่น `SMART FARM`

## Component rules

- Button สูงขั้นต่ำ 44px และมีข้อความบอกการกระทำชัดเจน
- Card ใช้ Radius 16–24px, Border บาง และ Shadow เบา
- รูปภาพ Card ใช้สัดส่วนเดียวกัน (`16 / 10`) และมี Alt Text
- Icon ใช้ `lucide-react`, Stroke เดียวกัน, ไม่ใช้ Emoji เป็น UI หลัก
- Section มีระยะห่างด้วย `section-space`
- Container ใช้ความกว้างสูงสุด 1280px
- ทุก Interactive Element ต้องมี Hover, Focus และ Disabled State

## Accessibility baseline

- Keyboard ใช้งานได้ครบ
- Focus Ring สี `brand-blue` เห็นชัด
- รองรับ `prefers-reduced-motion`
- Form ทุกช่องต้องมี Label
- Video ต้องมี Poster และ Caption/Transcript
- ไม่พึ่ง Hover เพียงอย่างเดียว

## ชั้นการใช้งานสี

1. Navy/Blue: โครงสร้างและการนำทาง
2. Terracotta/Gold: การชี้นำสายตาและเอกลักษณ์ท้องถิ่น
3. Leaf: เนื้อหาสิ่งแวดล้อม/เกษตรและสถานะสำเร็จ
4. Neutral: พื้นหลัง เนื้อหา และเส้นแบ่ง

## Implementation status

- [x] เพิ่ม CSS tokens ใน `src/styles.css`
- [x] เพิ่ม Focus State และ Reduced Motion
- [x] เพิ่ม utility `container-content`, `section-space`, `text-balance`
- [ ] แยก Button/Card/Header เป็น Shared Components
- [ ] ทำ Story/visual reference ของ Component States
- [ ] ตรวจ Contrast ด้วยหน้าจอจริงก่อนเผยแพร่
