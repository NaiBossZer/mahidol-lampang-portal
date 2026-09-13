# 📋 Prompt สำหรับส่งต่องาน AI Workspace

---

## 🎯 โจทย์หลัก

พัฒนา AI Workspace ของระบบ Mahidol Lampang Portal ให้เป็น AI Agent ที่ทำงานกับระบบจริงภายใต้ Governance, RBAC, Approval และ Audit Log

---

## ✅ งานที่เสร็จแล้ว (Phase 1-4, 8)

### 1. Repository Inspection & AI Architecture Audit

- ✅ ตรวจสอบโครงสร้างโปรเจกต์ (React/TypeScript, Cloudflare Pages, Supabase)
- ✅ วิเคราะห์ AI Workspace UI ที่มีอยู่แล้ว (CommandCenter, WorkQueue, Execution, Approval, History)
- ✅ ตรวจสอบ AI APIs ที่มีอยู่ (ai-intent, ai-queue, ai-approval, ai-history, ai-tools, audit-trail)
- ✅ ตรวจสอบ RBAC system (4 roles: SUPER_ADMIN, CONTENT_ADMIN, OPERATIONS_ADMIN, FACILITY_ADMIN)
- **🔍 พบปัญหาสำคัญ**: Database tables `ai_executions`, `ai_tools`, `ai_approvals`, `audit_logs` ไม่มีใน migrations

### 2. Database Schema Creation

- ✅ สร้าง `supabase/migrations/20260913_ai_governance_schema.sql`
  - `ai_tools` table - Governed Tool Registry
  - `ai_executions` table - AI Execution Records
  - `ai_approvals` table - Approval Records
  - `audit_logs` table - Comprehensive Audit Trail
  - `admin_notifications` table - Admin Notifications
  - RLS policies สำหรับทุก table
  - Audit triggers สำหรับ automatic logging
  - Helper functions (is_central_admin, update_updated_at)

### 3. Tool Registry Seed

- ✅ สร้าง `supabase/migrations/20260913_ai_tools_seed.sql`
  - 20+ tools ครอบคลุม domains: activities, surveys, analytics, learning_centers, cms, organizations
  - แต่ละ tool มี input/output schema, risk level, permission, execution mode

### 4. Drizzle Schema Update

- ✅ อัปเดต `src/db/schema.ts`
  - เพิ่ม AI table definitions (aiTools, aiExecutions, aiApprovals, auditLogs, adminNotifications)
  - เพิ่ม relations ระหว่าง tables
  - เพิ่ม indexes สำหรับ performance
  - Import `jsonb` type

---

## ⏳ งานที่เหลือ (Phase 5-7, 9-10)

### 5. OpenAI Integration - Intent Parser

**สิ่งที่ต้องทำ:**

- สร้าง `src/services/ai/openai-client.ts` - OpenAI API client
- สร้าง `src/services/ai/intent-parser.ts` - Natural language to structured intent
- สร้าง `functions/api/admin/ai-process.ts` - Intent processing endpoint

**Context:**

- ใช้ OpenAI API สำหรับ intent parsing (ตามที่ user เลือก)
- ต้อง implement ให้แปลง natural language → structured intent:
  ```typescript
  interface ParsedIntent {
    domain: string; // activities, survey, analytics, etc.
    action: string; // list, create, update, publish, etc.
    tool: string; // activity.list, survey.analytics, etc.
    parameters: Record<string, any>;
    confidence: number;
    reasoning: string;
  }
  ```
- ต้อง generate execution plan พร้อม step-by-step
- API key จะถูกเก็บใน Cloudflare environment variables

### 6. Execution Engine - Hybrid Sync/Async

**สิ่งที่ต้องทำ:**

- สร้าง `functions/api/admin/ai-execution.ts` - Execution management API
- สร้าง `src/services/ai/execution-engine.ts` - Execution orchestration

**Context:**

- Hybrid execution model (ตามที่ user เลือก):
  - **Sync**: สำหรับงานเร็วๆ (list, get, create)
  - **Async**: สำหรับงานช้าๆ (analytics, export)
- Tool configuration มี `execution_mode` field
- ต้อง track execution status และ update steps
- ต้อง handle errors และ retry logic

### 7. API Enhancements

**สิ่งที่ต้องทำ:**

- อัปเดต `functions/api/admin/ai-intent.ts` - Integrate OpenAI intent parser
- อัปเดต `functions/api/admin/ai-queue.ts` - Add execution plan display
- อัปเดต `functions/api/admin/ai-approval.ts` - Enhance with execution trigger

**Context:**

- APIs มีอยู่แล้ว แต่ยังไม่มี actual intent processing
- ต้อง integrate กับ OpenAI parser และ execution engine
- ต้อง return structured response ตาม AI Response Format

### 8. Testing (Phase 9)

**สิ่งที่ต้องทำ:**

- สร้าง `tests/ai/ai-governance.test.ts` - Governance tests
- สร้าง `tests/ai/ai-intent-parser.test.ts` - Intent parser tests
- สร้าง `tests/ai/ai-execution.test.ts` - Execution engine tests

**Context:**

- Test RLS policies กับ different roles
- Test OpenAI intent parsing
- Test sync/async execution
- Test audit logging
- Test end-to-end workflow

### 9. Production Verification (Phase 10)

**สิ่งที่ต้องทำ:**

- Run TypeScript check: `npm run typecheck`
- Run lint: `npm run lint`
- Run build: `npm run build`
- Test AI Workspace UI กับ real data
- Verify approval workflow end-to-end

---

## 📁 Files ที่สร้าง/แก้ไขแล้ว

### New Files:

- ✅ `supabase/migrations/20260913_ai_governance_schema.sql`
- ✅ `supabase/migrations/20260913_ai_tools_seed.sql`

### Modified Files:

- ✅ `src/db/schema.ts` - Added AI table definitions

---

## 📁 Files ที่ต้องสร้างต่อ

### New Files (ที่ต้องสร้าง):

- ❌ `src/services/ai/openai-client.ts`
- ❌ `src/services/ai/intent-parser.ts`
- ❌ `src/services/ai/execution-engine.ts`
- ❌ `functions/api/admin/ai-process.ts`
- ❌ `functions/api/admin/ai-execution.ts`
- ❌ `functions/api/admin/ai-config.ts`
- ❌ `tests/ai/ai-governance.test.ts`
- ❌ `tests/ai/ai-intent-parser.test.ts`
- ❌ `tests/ai/ai-execution.test.ts`

### Modified Files (ที่ต้องแก้):

- ❌ `functions/api/admin/ai-intent.ts` - Integrate OpenAI
- ❌ `functions/api/admin/ai-queue.ts` - Add execution plan
- ❌ `functions/api/admin/ai-approval.ts` - Enhance execution trigger
- ❌ `.env.example` - Add OPENAI_API_KEY placeholder

---

## 🔑 สิ่งสำคัญที่ต้องรู้

### Architecture Requirements:

- AI Frontend ห้ามติดต่อ Supabase Database โดยตรง
- ห้าม expose service-role key ใน frontend
- ทุก action ต้องผ่าน Governance → RBAC → Intent validation → Tool permission → Risk classification → Approval → Execute → Audit Log

### Security:

- OpenAI API key ต้องเก็บใน Cloudflare environment variables
- ห้ามแก้ Homepage ที่ได้รับการอนุมัติแล้ว
- ห้ามทำ destructive git operation

### User Preferences:

- **Intent Processing**: LLM integration (OpenAI)
- **Execution Model**: Hybrid (sync/async)
- **Implementation**: Full implementation

---

## 🚀 ขั้นตอนแรกที่ควรทำ

1. **Apply migrations** ไปยัง database:

   ```bash
   supabase db push
   ```

2. **เริ่มทำ Phase 5** (OpenAI Integration):
   - สร้าง OpenAI client
   - สร้าง intent parser
   - Test intent parsing กับ sample commands

3. **ทำ Phase 6** (Execution Engine):
   - สร้าง execution engine
   - Implement hybrid sync/async logic
   - Test tool execution

4. **ทำ Phase 7** (API Enhancements):
   - Integrate intent parser ใน ai-intent API
   - Integrate execution engine ใน approval workflow

---

## 📄 Documents ที่เกี่ยวข้อง

- **Plan file**: `C:\Users\apsun\.devin\plans\plan-7ea61b48d1a20eed.md`
- **AI Development Prompt**: `AI_DEVELOPMENT_PROMPT.md`
- **AI Production UX**: `docs/AI-PRODUCTION-UX.md`
- **Admin Domain Architecture**: `docs/ADMIN-DOMAIN-ARCHITECTURE.md`
- **Central Admin Architecture**: `docs/CENTRAL_ADMIN_ARCHITECTURE_V1.md`

---

## 🎯 Success Criteria

เมื่อเสร็จ Phase 5-10:

- ✅ AI Command สามารถ parse natural language → structured intent
- ✅ AI สามารถ execute tools แบบ sync/async
- ✅ Approval workflow ทำงานได้จริง
- ✅ Audit logs ถูกสร้างสำหรับทุก action
- ✅ TypeScript, lint, build ผ่าน
- ✅ AI Workspace UI ทำงานกับ real data ได้

---

**โปรดอ่าน plan file และ documents ข้างต้นก่อนเริ่มทำงานครับ!** 🚀
