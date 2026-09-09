# Phase 6 — Storefront Stabilization Audit

## Scope

รอบนี้เน้นทำให้ Storefront อยู่ในสถานะที่ปลอดภัยและแยกขอบเขตชัดเจน ก่อนพัฒนาระบบข้อมูลผลผลิตและการชำระเงินจริงในเฟสถัดไป

## Audit findings

### 1. Storefront ยังผูกกับ Production data

`StorefrontWidget` เดิมเรียก `/api/products` และใช้ `ProductionProductCard`, `ProductionPlotDetailView` และ `ProductionEvCalendar` โดยตรง ทำให้หน้าขายผักขึ้นกับโครงสร้าง Production data ที่ถูกกำหนดให้ Mark Work

**Action:** เปลี่ยน Storefront ให้ใช้ `MOCK_PRODUCTS` เป็นข้อมูลชั่วคราว และคง production components ไว้สำหรับเฟสถัดไปโดยไม่ถูกเรียกจากหน้าขายหลัก

### 2. Product card มี Smart Farm / IoT presentation

`ProductCard` เดิมแสดง IoT monitored, sensor data และ plot analytics ซึ่งทำให้ storefront ผูกกับ Smart Farm โดยไม่จำเป็น

**Action:** เปลี่ยนเป็น product card สำหรับสินค้า/มาตรฐาน/stock/ตะกร้าเท่านั้น และไม่แสดง sensor หรือ IoT data

### 3. Checkout ยังเปิดเส้นทาง PromptPay / Slip Storage

`CartDrawer` เดิมเปิด `CheckoutModal` ซึ่งเรียก PromptPay QR และ slip upload

**Action:** ปิดปุ่มชำระเงินไว้ก่อน และคง `CheckoutModal` กับ upload API เป็น Mark Work ไม่ให้เป็น active flow ในรอบนี้

### 4. Accessibility / resilience

เพิ่ม `type="button"`, `aria-label`, lazy image loading และข้อความสถานะของระบบที่ยังไม่พร้อมใช้งานใน Storefront/Cart

## งานที่เหลือ — Mark Work

- [ ] Production data / central production source
- [ ] PromptPay configuration และ payment flow
- [ ] Slip Storage / upload verification / retention policy
- [ ] Checkout order confirmation ที่เชื่อม payment จริง
- [ ] Smart Farm / IoT integration
- [ ] Production plot analytics / harvest calendar

## Release validation

`package.json` มี scripts สำหรับ `lint`, `build` และ `smoke` แต่รอบนี้ไม่สามารถรันบนเครื่อง local ผ่าน Remote Desktop ได้ เนื่องจากไม่มี device ที่เชื่อมต่ออยู่ จึงยังไม่ claim ว่า build ผ่านจริง

Static code audit ตรวจแล้วว่าโค้ดใหม่ของ Storefront ไม่เรียก production components, ไม่แสดง IoT/sensor UI และไม่เปิด checkout/payment flow
