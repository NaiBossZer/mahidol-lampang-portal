# EE Report Code Architecture

The EE Report is an existing Portal feature, not a standalone app.

## Runtime entry

`src/App.tsx`
→ `/admin/electricity-reports`
→ `ProtectedRoute`
→ `AdminGuard`
→ `AdminAppShell`
→ `src/pages/admin/ElectricityReportsPage.tsx`

## UI ownership

`src/pages/admin/ElectricityReportsPage.tsx`
- page orchestration
- dashboard/report state
- monthly document-set state
- AI processing actions
- report CRUD
- approval/export state

`src/components/admin/electricity/ElectricitySourceUploadCard.tsx`
- Source of Truth upload UI for exactly 3 documents per month
- fixed roles: PEA สบปราบ, PEA ผาลาด, Solar 18 kWp
- one multipart upload request for the monthly set
- automatically starts the AI Agent run after the three files are stored

`src/lib/electricityReportGenerator.ts`
- approved Monthly Report → report model
- PPTX generation
- PDF generation
- export filename/download helpers

## Backend boundary

`functions/api/admin/electricity.ts`
- dashboard reads
- private source upload/download
- AI processing
- Monthly Report CRUD

## Data boundary

Supabase tables:
- electricity_sites
- electricity_source_documents
- electricity_bill_readings
- electricity_solar_readings
- electricity_monthly_reports
- electricity_monthly_report_sources
- electricity_processing_runs

The browser must consume these APIs instead of mock electricity data.

## Figma import rule

The Figma Make export was a standalone React/Vite application with its own entry point, package manifest, CSS, mock data and simulated workflow. It is UI reference material, not a second application boundary.

Therefore the standalone `Web Admin UI_UX Design/` scaffold is removed from the production Portal tree.

When Figma UI is adopted, migrate its visual patterns/components into the existing Admin Portal structure and keep the real API/Supabase/RBAC flow unchanged.

## Single-page workflow

Select reporting month
→ Upload 3 Source-of-Truth documents together
→ AI Agent processes the exact 3-document set
→ Cross-validate site/month/completeness
→ Monthly Report
→ Human review
→ Approval
→ Executive view
→ Export

The existing electricity_processing_runs.input_document_ids is the persisted record of which three source documents formed the AI processing set; no second standalone upload application or mock-data workflow is introduced.

No separate Figma app, duplicate Vite setup, duplicate package manager, or mock electricity data should be introduced for this feature.
