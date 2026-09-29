# Electricity Reporting Architecture

## 1. Current source of truth

As of 2026-09-29, the repository does not contain the real PEA PDF bills or Solar Excel source files, and the Supabase Storage project had no electricity source documents before this implementation.

The old EE Report page used hard-coded sample values. Those samples are no longer the source of truth.

The production source of truth is now:

1. Private Supabase Storage bucket: \`electricity-source-docs\`
2. \`electricity_source_documents\` metadata + SHA-256
3. Parsed bill rows in \`electricity_bill_readings\`
4. Parsed solar rows in \`electricity_solar_readings\`
5. Monthly aggregate in \`electricity_monthly_reports\`
6. Provenance links in \`electricity_monthly_report_sources\`

The legacy UI wording \`data/inbox/\` is not a real connected folder and must not be treated as an input source.

## 2. End-to-end flow

\`\`\`
PEA PDF (สบปราบ / ผาลาด)     Solar XLS/XLSX
          │                        │
          └────────────┬───────────┘
                       ▼
        Admin uploads through Portal
                       │
                       ▼
       Supabase Storage (private)
         electricity-source-docs
                       │
                       ▼
      electricity_source_documents
          + SHA-256 + metadata
                       │
                       ▼
        Admin selects 1-10 documents
                       │
                       ▼
   /api/admin/electricity?action=process
                       │
                       ▼
           Electricity AI Agent
             OpenAI Responses API
                       │
          ┌────────────┴────────────┐
          ▼                         ▼
    PEA extraction            Solar extraction
          │                         │
          ▼                         ▼
 electricity_bill_readings  electricity_solar_readings
          │                         │
          └────────────┬────────────┘
                       ▼
          rebuild Monthly Report
                       │
                       ▼
       electricity_monthly_reports
                       │
                       ▼
               Admin Dashboard
                       │
                       ▼
        Human review / approval
\`\`\`

## 3. AI Agent behavior

The AI agent is an extraction and validation worker, not the final approver.

For a PEA PDF it extracts only printed values: meter number, previous/current reading, billed kWh, energy charge, Ft, service charge, subtotal, VAT and printed total.

For a Solar spreadsheet it extracts every relevant date/period row and solar yield kWh.

The agent must not invent missing values and must not calculate CO2 avoided or coal saved. Those figures require a governed calculation factor or explicit human input.

Every run stores:

- source document IDs
- agent name/version
- confidence
- validation errors
- processing status
- timestamps
- output report ID

The agent leaves the resulting Monthly Report in \`needs_review\` so a human can verify the document against the extracted numbers before approval.

OpenAI file inputs support PDFs and spreadsheet formats through the Responses API. The implementation uploads the source temporarily to the OpenAI Files API with \`user_data\`, sends the file ID to Responses, then deletes the temporary OpenAI file after extraction.

## 4. Supabase schema

### Sites

\`electricity_sites\`

Represents each PEA meter / Solar site.

Seeded sites:

- \`SOBPRAB\` — กฟภ. สถานีสบปราบ
- \`PHALAAD\` — กฟภ. ผาลาด
- \`SOLAR\` — Solar Cell

### Source documents

\`electricity_source_documents\`

Tracks the original file, period, source type, storage path, hash, parser status and extracted JSON.

This table is the provenance anchor.

### PEA readings

\`electricity_bill_readings\`

Stores a structured record extracted from each PEA bill.

### Solar readings

\`electricity_solar_readings\`

Stores date/period level solar generation. Monthly reports aggregate these rows.

### Monthly reports

\`electricity_monthly_reports\`

Stores the executive-facing monthly summary.

\`total_pea_kwh\`, \`total_amount_thb\`, and \`solar_ratio_pct\` are PostgreSQL generated columns, so the dashboard does not perform the authoritative aggregation itself.

### Provenance

\`electricity_monthly_report_sources\`

Links a Monthly Report back to the source PDF/Excel documents used to create it.

### Processing audit

\`electricity_processing_runs\`

Tracks AI processing runs, documents, result report, status, metrics and errors.

## 5. Authorization / RLS

Electricity tables are protected with RLS.

Read and write access is allowed only for authenticated users whose current application role resolves to:

- \`SUPER_ADMIN\`
- \`FACILITY_ADMIN\`

The Portal API additionally checks the existing application permissions:

- \`facility.read\` for dashboard/read/download
- \`facility.manage\` for upload, AI processing and CRUD

Electricity table changes are written into the existing \`audit_logs\` through a private SECURITY DEFINER trigger function.

## 6. Admin CRUD

The Admin page now supports:

- Upload source PDF/XLS/XLSX
- Select site and billing period
- Review source status and validation errors
- Download the original private source file
- Select source files for AI processing
- Create a Monthly Report manually
- Edit a Monthly Report
- Delete a Monthly Report without deleting its source files
- Change report workflow status

The source file is not deleted when a report is deleted. This preserves the evidence trail.

## 7. Dashboard rules

The dashboard reads only from Supabase.

It does not use \`INITIAL_REPORTS\` or other hard-coded electricity values.

The dashboard shows:

- total PEA cost
- total PEA kWh
- Sobprab kWh and cost
- Phalaad kWh and cost
- Solar yield and ratio
- CO2 / coal values when governed values exist
- report status
- source documents
- latest AI processing run

## 8. Deployment requirement

Set the secret in the Portal deployment environment:

\`OPENAI_API_KEY\`

Optional:

\`OPENAI_ELECTRICITY_MODEL\`

The default model in the electricity worker is \`gpt-4o-mini\` for compatibility with the existing Portal AI service.

Do not put \`OPENAI_API_KEY\` in Vite client environment variables or browser code.

## 9. Still required for a full monthly production cycle

The source files themselves are still required from the real PEA / Solar workflow. No authoritative PDF/XLSX source files were discoverable in GitHub or the connected Supabase Storage at implementation time.

The next production step is therefore operational rather than architectural: upload the real monthly PEA PDFs and Solar Excel into the Admin page, process them, verify the extracted readings against the documents, and approve the resulting Monthly Report.

Report PDF/PPTX generation remains a separate output module because no authoritative report template/renderer was present in the repository. Uploaded report PDF/PPTX files can still be tracked as source documents.
