import {
  getCookie,
  getSupabaseUser,
  hasAdminPermission,
  isAdminRole,
  json,
  supabaseConfig,
} from "../auth/_shared";

type Env = Record<string, unknown>;

const BUCKET = "electricity-source-docs";
const MAX_FILE_BYTES = 50 * 1024 * 1024;
const ALLOWED_MIME = new Set([
  "application/pdf",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
]);
const SOURCE_TYPES = new Set(["pea_bill", "solar_excel", "report_pdf", "report_pptx", "other"]);
const REPORT_STATUSES = new Set(["draft", "processing", "needs_review", "approved", "published", "failed"]);
const REPORT_EDITABLE_STATUSES = new Set(["draft", "processing", "needs_review", "failed"]);
const SITE_CODES = new Set(["SOBPRAB", "PHALAAD", "SOLAR"]);

const extractionSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    document_type: { type: "string", enum: ["pea_bill", "solar_excel", "other"] },
    billing_period: { type: ["string", "null"] },
    site_code: { type: ["string", "null"] },
    bill: {
      type: ["object", "null"],
      additionalProperties: false,
      properties: {
        meter_number: { type: ["string", "null"] },
        previous_reading: { type: ["number", "null"] },
        current_reading: { type: ["number", "null"] },
        billed_kwh: { type: ["number", "null"] },
        energy_charge_thb: { type: ["number", "null"] },
        ft_charge_thb: { type: ["number", "null"] },
        service_charge_thb: { type: ["number", "null"] },
        subtotal_thb: { type: ["number", "null"] },
        vat_thb: { type: ["number", "null"] },
        total_amount_thb: { type: ["number", "null"] },
      },
      required: [
        "meter_number",
        "previous_reading",
        "current_reading",
        "billed_kwh",
        "energy_charge_thb",
        "ft_charge_thb",
        "service_charge_thb",
        "subtotal_thb",
        "vat_thb",
        "total_amount_thb",
      ],
    },
    solar_rows: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          reading_period: { type: "string" },
          yield_kwh: { type: "number" },
          operating_days: { type: ["number", "null"] },
        },
        required: ["reading_period", "yield_kwh", "operating_days"],
      },
    },
    validation_errors: { type: "array", items: { type: "string" } },
    confidence: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "document_type",
    "billing_period",
    "site_code",
    "bill",
    "solar_rows",
    "validation_errors",
    "confidence",
  ],
} as const;

function accessToken(request: Request) {
  return getCookie(request, "sb_access_token");
}

async function authorize(
  request: Request,
  env: Env,
  permission: "facility.read" | "facility.manage",
) {
  const user = await getSupabaseUser(request, env);
  const role = user?.app_metadata?.role;
  const token = accessToken(request);

  if (!user || !isAdminRole(role) || !token) {
    return { error: json({ success: false, error: "Unauthorized" }, 401) } as const;
  }
  if (!hasAdminPermission(role, permission)) {
    return { error: json({ success: false, error: "Forbidden" }, 403) } as const;
  }

  const config = supabaseConfig(env);
  if (!config.configured) {
    return { error: json({ success: false, error: "Supabase is not configured" }, 503) } as const;
  }

  return { user, role, token, config } as const;
}

async function supabaseJson<T>(
  config: { url: string; key: string },
  token: string,
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(config.url + "/rest/v1/" + path, {
    ...init,
    headers: {
      apikey: config.key,
      Authorization: "Bearer " + token,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const detail =
      body && typeof body === "object" && "message" in body
        ? String((body as { message?: unknown }).message)
        : JSON.stringify(body);
    throw new Error("Supabase REST " + response.status + ": " + detail.slice(0, 500));
  }
  return body as T;
}

async function storageRequest(
  config: { url: string; key: string },
  token: string,
  path: string,
  init: RequestInit = {},
) {
  return fetch(config.url + "/storage/v1/object/" + BUCKET + "/" + path, {
    ...init,
    headers: {
      apikey: config.key,
      Authorization: "Bearer " + token,
      ...(init.headers ?? {}),
    },
  });
}

function safeFileName(name: string) {
  const cleaned = name.normalize("NFC").replace(/[\\\\/\\0]/g, "_").replace(/\\s+/g, " ").trim();
  return cleaned.slice(0, 180) || "source";
}

function normalizePeriod(value: unknown) {
  if (typeof value !== "string") return null;
  const match = value.match(/^(\\d{4})-(\\d{2})(?:-(\\d{2}))?$/);
  if (!match) return null;
  const date = new Date(
    match[1] + "-" + match[2] + "-" + (match[3] ?? "01") + "T00:00:00.000Z",
  );
  if (Number.isNaN(date.getTime())) return null;
  return (
    match[1] +
    "-" +
    match[2] +
    "-" +
    (match[3] ?? "01")
  );
}

function numberOrNull(value: unknown) {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

function jsonObject(value: unknown) {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function responseText(response: Record<string, unknown>) {
  if (typeof response.output_text === "string") return response.output_text;
  const output = Array.isArray(response.output) ? response.output : [];
  for (const item of output) {
    const content = Array.isArray(jsonObject(item).content) ? (jsonObject(item).content as unknown[]) : [];
    for (const part of content) {
      const text = jsonObject(part).text;
      if (typeof text === "string") return text;
    }
  }
  return "{}";
}

async function uploadToOpenAI(apiKey: string, file: File) {
  const form = new FormData();
  form.append("purpose", "user_data");
  form.append("file", file, file.name);

  const response = await fetch("https://api.openai.com/v1/files", {
    method: "POST",
    headers: { Authorization: "Bearer " + apiKey },
    body: form,
  });
  const body = await response.json().catch(() => null);

  if (!response.ok || typeof body?.id !== "string") {
    const message =
      typeof body?.error?.message === "string" ? body.error.message : "upload failed";
    throw new Error("OpenAI file upload " + response.status + ": " + message);
  }
  return String(body.id);
}

async function deleteOpenAIFile(apiKey: string, fileId: string) {
  await fetch("https://api.openai.com/v1/files/" + encodeURIComponent(fileId), {
    method: "DELETE",
    headers: { Authorization: "Bearer " + apiKey },
  }).catch(() => undefined);
}

async function extractWithAI(
  apiKey: string,
  file: File,
  source: {
    source_type: string;
    site_code?: string | null;
    billing_period?: string | null;
    filename: string;
  },
  model: string,
) {
  const fileId = await uploadToOpenAI(apiKey, file);
  const sourceContext = [
    "ระบบ: Mahidol Lampang Electricity Reporting",
    "ไฟล์ต้นฉบับ: " + source.filename,
    "source_type: " + source.source_type,
    "site_code ที่เจ้าหน้าที่เลือก: " + (source.site_code || "ไม่ระบุ"),
    "รอบเดือนที่เจ้าหน้าที่เลือก: " + (source.billing_period || "ไม่ระบุ"),
  ].join("\n");

  const prompt = [
    "You are the extraction agent for an institutional electricity reporting system.",
    "Extract only values actually present in the supplied source document.",
    "For PEA bills, identify billing period, site or meter, previous/current readings, billed kWh, printed charges, VAT, and printed total.",
    "For Solar Excel, extract every relevant row with period and solar yield kWh. Do not invent missing rows.",
    "Preserve source numbers exactly. Do not estimate or interpolate.",
    "Convert Thai Buddhist year values to Gregorian YYYY-MM-DD.",
    "Missing values must be null and explained in validation_errors.",
    "Use site_code SOBPRAB, PHALAAD, or SOLAR only when supported by the document or staff metadata.",
    "Do not calculate CO2 avoided or coal saved.",
    "Return JSON matching the supplied schema exactly.",
    "",
    sourceContext,
  ].join("\\n");

  try {
    const content: Array<Record<string, unknown>> = [
      {
        type: "input_file",
        file_id: fileId,
        ...(file.type === "application/pdf" ? { detail: "high" } : {}),
      },
      { type: "input_text", text: prompt },
    ];

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + apiKey,
      },
      body: JSON.stringify({
        model,
        input: [{ role: "user", content }],
        text: {
          format: {
            type: "json_schema",
            name: "electricity_source_extraction",
            strict: true,
            schema: extractionSchema,
          },
        },
      }),
    });

    const body = (await response.json().catch(() => null)) as Record<string, unknown> | null;
    if (!response.ok) {
      const message =
        typeof jsonObject(body?.error).message === "string"
          ? String(jsonObject(body?.error).message)
          : "Responses API failed";
      throw new Error("OpenAI Responses " + response.status + ": " + message);
    }

    return {
      data: JSON.parse(responseText(body ?? {})) as Record<string, unknown>,
      model,
      responseId: typeof body?.id === "string" ? body.id : null,
    };
  } finally {
    await deleteOpenAIFile(apiKey, fileId);
  }
}

async function rebuildMonthlyReport(
  config: { url: string; key: string },
  token: string,
  userId: string,
  period: string,
  sourceDocumentIds: string[],
) {
  const month = period.slice(0, 7) + "-01";
  const sourceFilter = sourceDocumentIds.map(encodeURIComponent).join(",");
  const bills = await supabaseJson<Array<Record<string, unknown>>>(
    config,
    token,
    "electricity_bill_readings?billing_period=eq." +
      encodeURIComponent(month) +
      "&source_document_id=in.(" +
      sourceFilter +
      ")&select=id,site_id,billing_period,billed_kwh,total_amount_thb,needs_review,source_document:electricity_source_documents(id,uploaded_at,source_type,status),site:electricity_sites(code,name)&order=site_id.asc",
  );
  const nextMonthDate = new Date(month + "T00:00:00.000Z");
  nextMonthDate.setUTCMonth(nextMonthDate.getUTCMonth() + 1);
  const nextMonth =
    nextMonthDate.toISOString().slice(0, 7) + "-01";

  const solar = await supabaseJson<Array<Record<string, unknown>>>(
    config,
    token,
    "electricity_solar_readings?reading_period=gte." +
      encodeURIComponent(month) +
      "&reading_period=lt." +
      encodeURIComponent(nextMonth) +
      "&source_document_id=in.(" +
      sourceFilter +
      ")&select=id,site_id,reading_period,yield_kwh,needs_review,source_document:electricity_source_documents(id,uploaded_at,source_type,status)&order=site_id.asc,reading_period.asc",
  );

  const latestBillBySite = new Map<string, Record<string, unknown>>();
  for (const row of bills) {
    const code = String(jsonObject(row.site).code ?? "");
    const current = latestBillBySite.get(code);
    const uploadedAt = String(jsonObject(row.source_document).uploaded_at ?? "");
    const currentAt = String(jsonObject(current?.source_document).uploaded_at ?? "");
    if (!current || uploadedAt > currentAt) latestBillBySite.set(code, row);
  }

  const latestSolarSourceBySite = new Map<string, string>();
  for (const row of solar) {
    const siteId = String(row.site_id ?? "SOLAR");
    const currentSourceId = latestSolarSourceBySite.get(siteId);
    const uploadedAt = String(jsonObject(row.source_document).uploaded_at ?? "");
    const currentSourceAt = currentSourceId
      ? String(
          jsonObject(
            solar.find(
              (candidate) =>
                String(jsonObject(candidate.source_document).id ?? "") === currentSourceId,
            )?.source_document,
          ).uploaded_at ?? "",
        )
      : "";
    if (!currentSourceId || uploadedAt > currentSourceAt) {
      latestSolarSourceBySite.set(siteId, String(jsonObject(row.source_document).id ?? ""));
    }
  }

  const sobprab = latestBillBySite.get("SOBPRAB");
  const phalaad = latestBillBySite.get("PHALAAD");
  const sobprabKwh = numberOrNull(sobprab?.billed_kwh) ?? 0;
  const sobprabAmount = numberOrNull(sobprab?.total_amount_thb) ?? 0;
  const phalaadKwh = numberOrNull(phalaad?.billed_kwh) ?? 0;
  const phalaadAmount = numberOrNull(phalaad?.total_amount_thb) ?? 0;

  let solarYield = 0;
  let requiresReview = Boolean(sobprab?.needs_review) || Boolean(phalaad?.needs_review);
  for (const row of solar) {
    const sourceId = String(jsonObject(row.source_document).id ?? "");
    const siteId = String(row.site_id ?? "SOLAR");
    if (latestSolarSourceBySite.get(siteId) !== sourceId) continue;
    solarYield += numberOrNull(row.yield_kwh) ?? 0;
    requiresReview ||= Boolean(row.needs_review);
  }

  const existing = await supabaseJson<Array<Record<string, unknown>>>(
    config,
    token,
    "electricity_monthly_reports?report_month=eq." +
      encodeURIComponent(month) +
      "&select=id,co2_avoided_ton,coal_saved_ton,created_by&limit=1",
  );
  const old = existing[0] ?? {};

  const payload = {
    report_month: month,
    sobprab_kwh: sobprabKwh,
    sobprab_amount_thb: sobprabAmount,
    phalaad_kwh: phalaadKwh,
    phalaad_amount_thb: phalaadAmount,
    solar_yield_kwh: solarYield,
    co2_avoided_ton: numberOrNull(old.co2_avoided_ton),
    coal_saved_ton: numberOrNull(old.coal_saved_ton),
    status: "needs_review",
    processed_at: new Date().toISOString(),
    calculation_version: "electricity-v1",
    created_by: old.created_by ?? userId,
    updated_by: userId,
  };

  let report: Record<string, unknown>;
  if (old.id) {
    const updated = await supabaseJson<Array<Record<string, unknown>>>(
      config,
      token,
      "electricity_monthly_reports?id=eq." + encodeURIComponent(String(old.id)),
      {
        method: "PATCH",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify(payload),
      },
    );
    report = updated[0] ?? { id: old.id };
  } else {
    const created = await supabaseJson<Array<Record<string, unknown>>>(
      config,
      token,
      "electricity_monthly_reports",
      {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify(payload),
      },
    );
    report = created[0] ?? {};
  }

  return {
    report,
    requiresReview,
    sourceDocumentIds,
  };
}

async function handleGet(request: Request, env: Env) {
  const auth = await authorize(request, env, "facility.read");
  if ("error" in auth) return auth.error;

  const params = new URL(request.url).searchParams;
  const resource = params.get("resource") ?? "dashboard";

  try {
    if (resource === "report") {
      const id = params.get("id");
      if (!id) return json({ success: false, error: "id is required" }, 400);

      const reports = await supabaseJson<Array<Record<string, unknown>>>(
        auth.config,
        auth.token,
        "electricity_monthly_reports?id=eq." + encodeURIComponent(id) + "&select=*",
      );
      if (!reports.length) return json({ success: false, error: "Report not found" }, 404);

      const sources = await supabaseJson<Array<Record<string, unknown>>>(
        auth.config,
        auth.token,
        "electricity_monthly_report_sources?report_id=eq." +
          encodeURIComponent(id) +
          "&select=source_role,source_document:electricity_source_documents(id,filename,source_type,billing_period,status,uploaded_at,processed_at,sha256,site:electricity_sites(code,name))&order=source_role.asc",
      );
      return json({ success: true, data: { report: reports[0], sources } });
    }

    const [reports, sources, sites, runs] = await Promise.all([
      supabaseJson<Array<Record<string, unknown>>>(
        auth.config,
        auth.token,
        "electricity_monthly_reports?select=*&order=report_month.desc&limit=120",
      ),
      supabaseJson<Array<Record<string, unknown>>>(
        auth.config,
        auth.token,
        "electricity_source_documents?select=id,site_id,source_type,billing_period,filename,storage_bucket,mime_type,file_size,sha256,status,parser_version,validation_errors,error_message,uploaded_by,uploaded_at,processed_at,site:electricity_sites(code,name)&order=uploaded_at.desc&limit=250",
      ),
      supabaseJson<Array<Record<string, unknown>>>(
        auth.config,
        auth.token,
        "electricity_sites?select=id,code,name,site_type,account_number,meter_number,active&order=code.asc",
      ),
      supabaseJson<Array<Record<string, unknown>>>(
        auth.config,
        auth.token,
        "electricity_processing_runs?select=*&order=started_at.desc&limit=50",
      ),
    ]);

    return json({ success: true, data: { reports, sources, sites, runs } });
  } catch (error) {
    console.error("/api/admin/electricity GET", error);
    return json(
      { success: false, error: error instanceof Error ? error.message : "โหลดข้อมูลไม่สำเร็จ" },
      500,
    );
  }
}

function isPdfFile(file: File) {
  return file.type === "application/pdf" || /\.pdf$/i.test(file.name);
}

function isSpreadsheetFile(file: File) {
  return (
    file.type === "application/vnd.ms-excel" ||
    file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    /\.(xls|xlsx)$/i.test(file.name)
  );
}

function validateSetFile(file: File, role: "pea" | "solar") {
  if (file.size <= 0 || file.size > MAX_FILE_BYTES) {
    return "ไฟล์ " + file.name + " ต้องมีขนาดมากกว่า 0 และไม่เกิน 50 MB";
  }
  if (role === "pea" && !isPdfFile(file)) {
    return "เอกสาร PEA ต้องเป็น PDF";
  }
  if (role === "solar" && !isSpreadsheetFile(file)) {
    return "เอกสาร Solar ต้องเป็น XLS หรือ XLSX";
  }
  return null;
}

async function sha256File(file: File) {
  const digest = await crypto.subtle.digest("SHA-256", await file.arrayBuffer());
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function ensureSourceHashIsNew(
  config: { url: string; key: string },
  token: string,
  sha256: string,
) {
  const rows = await supabaseJson<Array<Record<string, unknown>>>(
    config,
    token,
    "electricity_source_documents?sha256=eq." +
      encodeURIComponent(sha256) +
      "&select=id,filename&limit=1",
  );
  return rows[0] ?? null;
}

async function handleUploadSet(request: Request, env: Env) {
  const auth = await authorize(request, env, "facility.manage");
  if ("error" in auth) return auth.error;

  const form = await request.formData();
  const billingPeriod = normalizePeriod(form.get("billingPeriod"));
  const sobprabFile = form.get("sobprabFile");
  const phalaadFile = form.get("phalaadFile");
  const solarFile = form.get("solarFile");

  if (!billingPeriod) {
    return json({ success: false, error: "billingPeriod ต้องเป็น YYYY-MM-DD หรือ YYYY-MM" }, 400);
  }
  if (!(sobprabFile instanceof File) || !(phalaadFile instanceof File) || !(solarFile instanceof File)) {
    return json(
      {
        success: false,
        error: "หนึ่งชุดรายงานต้องมีเอกสาร 3 ไฟล์: PEA สบปราบ, PEA ผาลาด และ Solar",
      },
      400,
    );
  }

  const requiredFiles = [
    { role: "pea" as const, siteCode: "SOBPRAB", sourceType: "pea_bill", file: sobprabFile },
    { role: "pea" as const, siteCode: "PHALAAD", sourceType: "pea_bill", file: phalaadFile },
    { role: "solar" as const, siteCode: "SOLAR", sourceType: "solar_excel", file: solarFile },
  ];

  for (const item of requiredFiles) {
    const validationError = validateSetFile(item.file, item.role);
    if (validationError) return json({ success: false, error: validationError }, 415);
  }

  const siteRows = await supabaseJson<Array<Record<string, unknown>>>(
    auth.config,
    auth.token,
    "electricity_sites?code=in.(SOBPRAB,PHALAAD,SOLAR)&select=id,code,name",
  );
  const siteByCode = new Map(siteRows.map((row) => [String(row.code), String(row.id)]));
  for (const item of requiredFiles) {
    if (!siteByCode.has(item.siteCode)) {
      return json({ success: false, error: "ไม่พบสถานที่ไฟฟ้า " + item.siteCode }, 404);
    }
  }

  const hashes = await Promise.all(requiredFiles.map((item) => sha256File(item.file)));
  for (const sha256 of hashes) {
    const duplicate = await ensureSourceHashIsNew(auth.config, auth.token, sha256);
    if (duplicate) {
      return json(
        {
          success: false,
          error: "พบไฟล์ซ้ำใน Source of Truth แล้ว: " + String(duplicate.filename ?? "unknown"),
        },
        409,
      );
    }
  }

  const uploadedPaths: string[] = [];
  const createdDocumentIds: string[] = [];

  try {
    const rows = [];
    for (let index = 0; index < requiredFiles.length; index += 1) {
      const item = requiredFiles[index];
      const originalName = safeFileName(item.file.name);
      const path =
        "raw/" +
        billingPeriod +
        "/" +
        item.siteCode +
        "/" +
        crypto.randomUUID() +
        "-" +
        originalName;
      uploadedPaths.push(path);

      const uploadResponse = await storageRequest(auth.config, auth.token, path, {
        method: "POST",
        headers: {
          "Content-Type": item.file.type || "application/octet-stream",
          "x-upsert": "false",
        },
        body: await item.file.arrayBuffer(),
      });
      if (!uploadResponse.ok) {
        const detail = await uploadResponse.text().catch(() => "");
        throw new Error(
          "อัปโหลด " +
            item.file.name +
            " เข้า Storage ไม่สำเร็จ (" +
            uploadResponse.status +
            "): " +
            detail.slice(0, 200),
        );
      }

      rows.push({
        site_id: siteByCode.get(item.siteCode),
        source_type: item.sourceType,
        billing_period: billingPeriod,
        filename: originalName,
        storage_bucket: BUCKET,
        storage_path: path,
        mime_type: item.file.type || "application/octet-stream",
        file_size: item.file.size,
        sha256: hashes[index],
        status: "uploaded",
        uploaded_by: auth.user.id,
      });
    }

    const created = await supabaseJson<Array<Record<string, unknown>>>(
      auth.config,
      auth.token,
      "electricity_source_documents",
      {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify(rows),
      },
    );

    for (const row of created) {
      if (row.id) createdDocumentIds.push(String(row.id));
    }
    if (createdDocumentIds.length !== requiredFiles.length) {
      throw new Error("บันทึกชุดเอกสาร Source of Truth ไม่ครบ 3 รายการ");
    }

    const processed = await processElectricityDocuments(auth, env, createdDocumentIds);

    return json(
      {
        success: true,
        data: {
          documents: created,
          ...processed,
        },
      },
      201,
    );
  } catch (error) {
    for (const id of createdDocumentIds) {
      await supabaseJson(
        auth.config,
        auth.token,
        "electricity_source_documents?id=eq." + encodeURIComponent(id),
        { method: "DELETE" },
      ).catch(() => undefined);
    }
    for (const path of uploadedPaths) {
      await storageRequest(auth.config, auth.token, path, { method: "DELETE" }).catch(() => undefined);
    }
    throw error;
  }
}

async function handleFileDownload(request: Request, env: Env) {
  const auth = await authorize(request, env, "facility.read");
  if ("error" in auth) return auth.error;

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return json({ success: false, error: "id is required" }, 400);

  const docs = await supabaseJson<Array<Record<string, unknown>>>(
    auth.config,
    auth.token,
    "electricity_source_documents?id=eq." +
      encodeURIComponent(id) +
      "&select=id,filename,mime_type,storage_bucket,storage_path&limit=1",
  );
  const doc = docs[0];

  if (!doc || doc.storage_bucket !== BUCKET) {
    return json({ success: false, error: "ไม่พบเอกสารต้นฉบับ" }, 404);
  }

  const response = await storageRequest(auth.config, auth.token, String(doc.storage_path), {
    method: "GET",
  });
  if (!response.ok) {
    return json({ success: false, error: "ไม่สามารถเปิดเอกสารต้นฉบับได้" }, response.status);
  }

  const headers = new Headers(response.headers);
  headers.set("Content-Type", String(doc.mime_type || "application/octet-stream"));
  headers.set(
    "Content-Disposition",
    "attachment; filename*=UTF-8''" + encodeURIComponent(String(doc.filename || "download")),
  );
  headers.set("Cache-Control", "private, no-store");

  return new Response(response.body, { status: 200, headers });
}

async function handleReportCreate(request: Request, env: Env) {
  const auth = await authorize(request, env, "facility.manage");
  if ("error" in auth) return auth.error;

  const body = (await request.json()) as Record<string, unknown>;
  const reportMonth = normalizePeriod(body.report_month);
  if (!reportMonth) return json({ success: false, error: "report_month ไม่ถูกต้อง" }, 400);

  const payload: Record<string, unknown> = {
    report_month: reportMonth.slice(0, 7) + "-01",
    status: REPORT_EDITABLE_STATUSES.has(String(body.status)) ? String(body.status) : "draft",
    created_by: auth.user.id,
    updated_by: auth.user.id,
  };

  for (const field of [
    "sobprab_kwh",
    "sobprab_amount_thb",
    "phalaad_kwh",
    "phalaad_amount_thb",
    "solar_yield_kwh",
    "co2_avoided_ton",
    "coal_saved_ton",
  ]) {
    const value = body[field];
    if (value === undefined) continue;
    const n = value === null || value === "" ? null : numberOrNull(value);
    if (n !== null && (n < 0 || !Number.isFinite(n))) {
      return json({ success: false, error: field + " ไม่ถูกต้อง" }, 400);
    }
    payload[field] = n;
  }

  const created = await supabaseJson<Array<Record<string, unknown>>>(
    auth.config,
    auth.token,
    "electricity_monthly_reports",
    {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(payload),
    },
  );

  return json({ success: true, data: created[0] ?? null }, 201);
}

async function handleReportPatch(request: Request, env: Env) {
  const auth = await authorize(request, env, "facility.manage");
  if ("error" in auth) return auth.error;

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return json({ success: false, error: "id is required" }, 400);

  const body = (await request.json()) as Record<string, unknown>;
  const existingRows = await supabaseJson<Array<Record<string, unknown>>>(
    auth.config,
    auth.token,
    "electricity_monthly_reports?id=eq." + encodeURIComponent(id) + "&select=id,status&limit=1",
  );
  const existing = existingRows[0];
  if (!existing) return json({ success: false, error: "ไม่พบรายงานที่ต้องการแก้ไข" }, 404);

  const payload: Record<string, unknown> = { updated_by: auth.user.id };
  let hasDataChanges = false;

  if (body.report_month !== undefined) {
    const period = normalizePeriod(body.report_month);
    if (!period) return json({ success: false, error: "report_month ไม่ถูกต้อง" }, 400);
    payload.report_month = period.slice(0, 7) + "-01";
    hasDataChanges = true;
  }

  if (body.status !== undefined) {
    const status = String(body.status);
    if (!REPORT_STATUSES.has(status))
      return json({ success: false, error: "status ไม่ถูกต้อง" }, 400);
    if (!REPORT_EDITABLE_STATUSES.has(status))
      return json({ success: false, error: "สถานะอนุมัติ/เผยแพร่ต้องใช้ workflow transition ที่กำหนด" }, 409);
    payload.status = status;
  }

  for (const field of [
    "sobprab_kwh",
    "sobprab_amount_thb",
    "phalaad_kwh",
    "phalaad_amount_thb",
    "solar_yield_kwh",
    "co2_avoided_ton",
    "coal_saved_ton",
  ]) {
    if (body[field] === undefined) continue;
    const n = body[field] === null || body[field] === "" ? null : numberOrNull(body[field]);
    if (n !== null && (n < 0 || !Number.isFinite(n))) {
      return json({ success: false, error: field + " ไม่ถูกต้อง" }, 400);
    }
    payload[field] = n;
    hasDataChanges = true;
  }

  if (
    hasDataChanges &&
    ["approved", "published"].includes(String(existing.status))
  ) {
    payload.status = "needs_review";
  }

  const updated = await supabaseJson<Array<Record<string, unknown>>>(
    auth.config,
    auth.token,
    "electricity_monthly_reports?id=eq." + encodeURIComponent(id),
    {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(payload),
    },
  );
  if (!updated.length) return json({ success: false, error: "ไม่พบรายงานที่ต้องการแก้ไข" }, 404);
  return json({ success: true, data: updated[0] });
}

async function handleReportTransition(
  request: Request,
  env: Env,
  transition: "approve" | "publish",
) {
  const auth = await authorize(request, env, "facility.manage");
  if ("error" in auth) return auth.error;

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return json({ success: false, error: "id is required" }, 400);

  const reports = await supabaseJson<Array<Record<string, unknown>>>(
    auth.config,
    auth.token,
    "electricity_monthly_reports?id=eq." + encodeURIComponent(id) +
      "&select=id,status,report_month,sobprab_kwh,sobprab_amount_thb,phalaad_kwh,phalaad_amount_thb,solar_yield_kwh,co2_avoided_ton,coal_saved_ton&limit=1",
  );
  const report = reports[0];
  if (!report) return json({ success: false, error: "ไม่พบรายงานที่ต้องการ" }, 404);

  const currentStatus = String(report.status ?? "");
  if (transition === "approve" && currentStatus !== "needs_review") {
    return json({ success: false, error: "รายงานต้องอยู่ในสถานะรอตรวจสอบก่อนอนุมัติ" }, 409);
  }
  if (transition === "publish" && currentStatus !== "approved") {
    return json({ success: false, error: "ต้องอนุมัติรายงานก่อนเผยแพร่" }, 409);
  }

  const numericFields = [
    "sobprab_kwh",
    "sobprab_amount_thb",
    "phalaad_kwh",
    "phalaad_amount_thb",
    "solar_yield_kwh",
  ];
  for (const field of numericFields) {
    const value = numberOrNull(report[field]);
    if (value === null || value < 0) {
      return json({ success: false, error: "ข้อมูล " + field + " ไม่พร้อมสำหรับการรับรอง" }, 409);
    }
  }

  if (transition === "approve") {
    const sourceRows = await supabaseJson<Array<Record<string, unknown>>>(
      auth.config,
      auth.token,
      "electricity_monthly_report_sources?report_id=eq." +
        encodeURIComponent(id) +
        "&select=source_role,source_document_id,source_document:electricity_source_documents(status)&order=source_role.asc",
    );
    const requiredRoles = new Set(["pea_sobprab", "pea_phalaad", "solar"]);
    const actualRoles = new Set(sourceRows.map((row) => String(row.source_role ?? "")));
    if (actualRoles.size !== 3 || [...requiredRoles].some((role) => !actualRoles.has(role))) {
      return json(
        {
          success: false,
          error: "ยังรับรองไม่ได้: Monthly Report ต้องผูก Source of Truth ครบ 3 เอกสาร",
        },
        409,
      );
    }

    const sourceIds = sourceRows
      .map((row) => String(row.source_document_id ?? ""))
      .filter(Boolean);
    const billRows = await supabaseJson<Array<Record<string, unknown>>>(
      auth.config,
      auth.token,
      "electricity_bill_readings?source_document_id=in.(" +
        sourceIds.map(encodeURIComponent).join(",") +
        ")&select=source_document_id&limit=20",
    );
    const solarRows = await supabaseJson<Array<Record<string, unknown>>>(
      auth.config,
      auth.token,
      "electricity_solar_readings?source_document_id=in.(" +
        sourceIds.map(encodeURIComponent).join(",") +
        ")&select=source_document_id&limit=100",
    );
    const billSourceIds = new Set(billRows.map((row) => String(row.source_document_id)));
    const solarSourceIds = new Set(solarRows.map((row) => String(row.source_document_id)));
    const sobprabSource = sourceRows.find((row) => row.source_role === "pea_sobprab");
    const phalaadSource = sourceRows.find((row) => row.source_role === "pea_phalaad");
    const solarSource = sourceRows.find((row) => row.source_role === "solar");
    if (
      !sobprabSource ||
      !phalaadSource ||
      !solarSource ||
      !billSourceIds.has(String(sobprabSource.source_document_id)) ||
      !billSourceIds.has(String(phalaadSource.source_document_id)) ||
      !solarSourceIds.has(String(solarSource.source_document_id))
    ) {
      return json(
        {
          success: false,
          error: "ยังรับรองไม่ได้: AI Agent ต้องดึงข้อมูลจาก PEA ทั้ง 2 จุดและ Solar ได้ก่อน",
        },
        409,
      );
    }
  }

  const nextStatus = transition === "approve" ? "approved" : "published";
  const updated = await supabaseJson<Array<Record<string, unknown>>>(
    auth.config,
    auth.token,
    "electricity_monthly_reports?id=eq." + encodeURIComponent(id),
    {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ status: nextStatus, updated_by: auth.user.id }),
    },
  );
  return json({ success: true, data: updated[0] ?? null });
}
async function handleReportDelete(request: Request, env: Env) {
  const auth = await authorize(request, env, "facility.manage");
  if ("error" in auth) return auth.error;

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return json({ success: false, error: "id is required" }, 400);

  await supabaseJson(
    auth.config,
    auth.token,
    "electricity_monthly_reports?id=eq." + encodeURIComponent(id),
    { method: "DELETE" },
  );
  return json({ success: true });
}

async function processElectricityDocuments(
  auth: {
    user: { id: string };
    token: string;
    config: { url: string; key: string };
  },
  env: Env,
  ids: string[],
) {
  const apiKey = String(env.OPENAI_API_KEY ?? "");
  if (!apiKey) {
    throw new Error("ยังไม่ได้ตั้งค่า OPENAI_API_KEY สำหรับ AI Agent ใน environment ของ deployment");
  }

  const documents = await supabaseJson<Array<Record<string, unknown>>>(
    auth.config,
    auth.token,
    "electricity_source_documents?id=in.(" +
      ids.map(encodeURIComponent).join(",") +
      ")&select=id,filename,source_type,billing_period,mime_type,file_size,storage_bucket,storage_path,status,site_id,site:electricity_sites(code,name)&order=uploaded_at.asc",
  );
  if (documents.length !== 3) {
    throw new Error("AI Agent รับเฉพาะชุดเอกสาร 3 รายการ: PEA สบปราบ, PEA ผาลาด และ Solar");
  }

  const periods = [...new Set(documents.map((d) => String(d.billing_period ?? "")).filter(Boolean))];
  if (periods.length !== 1) {
    throw new Error("เอกสารทั้ง 3 รายการต้องอยู่ในรอบเดือนเดียวกัน");
  }
  const reportPeriod = periods[0].slice(0, 7) + "-01";

  const roles = documents.map((document) => ({
    sourceType: String(document.source_type),
    siteCode: String(jsonObject(document.site).code ?? ""),
  }));
  const expectedRoles = new Set(["pea_bill:SOBPRAB", "pea_bill:PHALAAD", "solar_excel:SOLAR"]);
  const actualRoles = new Set(roles.map((role) => role.sourceType + ":" + role.siteCode));
  if (
    actualRoles.size !== 3 ||
    [...expectedRoles].some((role) => !actualRoles.has(role))
  ) {
    throw new Error("ชุดเอกสารต้องประกอบด้วย PEA สบปราบ + PEA ผาลาด + Solar เท่านั้น");
  }

  const runRows = await supabaseJson<Array<Record<string, unknown>>>(
    auth.config,
    auth.token,
    "electricity_processing_runs",
    {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        status: "running",
        agent_name: "electricity-report-agent",
        agent_version: "v2-document-set",
        trigger_source: "admin_document_set",
        triggered_by: auth.user.id,
        input_document_ids: ids,
      }),
    },
  );
  const runId = String(runRows[0]?.id ?? "");
  if (!runId) throw new Error("สร้าง processing run ไม่สำเร็จ");

  const metrics: Record<string, unknown> = {
    documents: [],
    startedAt: new Date().toISOString(),
    documentSet: {
      required: ["SOBPRAB", "PHALAAD", "SOLAR"],
      count: 3,
      reportMonth: reportPeriod,
    },
  };
  const processingDocumentIds = new Set<string>(ids);

  try {
    for (const document of documents) {
      const sourceId = String(document.id);
      await supabaseJson(
        auth.config,
        auth.token,
        "electricity_source_documents?id=eq." + encodeURIComponent(sourceId),
        {
          method: "PATCH",
          body: JSON.stringify({ status: "processing", error_message: null }),
        },
      );

      const download = await storageRequest(auth.config, auth.token, String(document.storage_path), {
        method: "GET",
      });
      if (!download.ok) throw new Error("อ่านไฟล์ " + document.filename + " จาก Storage ไม่สำเร็จ");

      const bytes = await download.arrayBuffer();
      const file = new File([bytes], String(document.filename), {
        type: String(document.mime_type || "application/octet-stream"),
      });

      const extraction = await extractWithAI(
        apiKey,
        file,
        {
          source_type: String(document.source_type),
          site_code: String(jsonObject(document.site).code ?? ""),
          billing_period: String(document.billing_period ?? ""),
          filename: String(document.filename),
        },
        String(env.OPENAI_ELECTRICITY_MODEL ?? "gpt-4o-mini"),
      );

      const parsed = extraction.data;
      const aiErrors = Array.isArray(parsed.validation_errors)
        ? parsed.validation_errors.filter((x): x is string => typeof x === "string")
        : [];
      const metadataSite = String(jsonObject(document.site).code ?? "");
      const modelSite = String(parsed.site_code ?? "");
      const extractedPeriod = normalizePeriod(parsed.billing_period);
      const documentPeriod = normalizePeriod(document.billing_period);
      const validationErrors = [...aiErrors];

      if (metadataSite && modelSite && metadataSite !== modelSite) {
        validationErrors.push("site_code ของเอกสารไม่ตรงกับ site ที่เลือก");
      }
      if (
        documentPeriod &&
        extractedPeriod &&
        documentPeriod.slice(0, 7) !== extractedPeriod.slice(0, 7)
      ) {
        validationErrors.push("billing period ไม่ตรงกับที่เจ้าหน้าที่เลือก");
      }

      const confidence = Math.max(0, Math.min(1, numberOrNull(parsed.confidence) ?? 0));
      await supabaseJson(
        auth.config,
        auth.token,
        "electricity_source_documents?id=eq." + encodeURIComponent(sourceId),
        {
          method: "PATCH",
          body: JSON.stringify({
            status: validationErrors.length ? "needs_review" : "processed",
            parser_version: extraction.model + ";" + (extraction.responseId ?? "no-response-id"),
            extracted_payload: parsed,
            validation_errors: validationErrors,
            error_message: null,
            processed_at: new Date().toISOString(),
          }),
        },
      );

      const effectivePeriod = documentPeriod || extractedPeriod;
      if (effectivePeriod && effectivePeriod.slice(0, 7) !== reportPeriod.slice(0, 7)) {
        validationErrors.push("เอกสารนี้มีรอบเดือนไม่ตรงกับชุดเอกสาร");
      }

      const siteId = String(document.site_id);
      const bill = jsonObject(parsed.bill);
      if (
        String(document.source_type) === "pea_bill" &&
        numberOrNull(bill.billed_kwh) !== null &&
        numberOrNull(bill.total_amount_thb) !== null &&
        effectivePeriod === reportPeriod
      ) {
        await supabaseJson(
          auth.config,
          auth.token,
          "electricity_bill_readings",
          {
            method: "POST",
            headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
            body: JSON.stringify({
              source_document_id: sourceId,
              site_id: siteId,
              billing_period: reportPeriod,
              meter_number: bill.meter_number,
              previous_reading: numberOrNull(bill.previous_reading),
              current_reading: numberOrNull(bill.current_reading),
              billed_kwh: numberOrNull(bill.billed_kwh),
              energy_charge_thb: numberOrNull(bill.energy_charge_thb),
              ft_charge_thb: numberOrNull(bill.ft_charge_thb),
              service_charge_thb: numberOrNull(bill.service_charge_thb),
              subtotal_thb: numberOrNull(bill.subtotal_thb),
              vat_thb: numberOrNull(bill.vat_thb),
              total_amount_thb: numberOrNull(bill.total_amount_thb),
              raw_fields: parsed,
              confidence,
              needs_review: validationErrors.length > 0 || confidence < 0.9,
            }),
          },
        );
      }

      if (String(document.source_type) === "solar_excel") {
        const rows = Array.isArray(parsed.solar_rows) ? parsed.solar_rows : [];
        for (const rawRow of rows) {
          const row = jsonObject(rawRow);
          const readingPeriod = normalizePeriod(row.reading_period);
          const yieldKwh = numberOrNull(row.yield_kwh);
          if (!readingPeriod || yieldKwh === null || yieldKwh < 0) continue;
          if (readingPeriod.slice(0, 7) !== reportPeriod.slice(0, 7)) {
            continue;
          }

          await supabaseJson(
            auth.config,
            auth.token,
            "electricity_solar_readings",
            {
              method: "POST",
              headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
              body: JSON.stringify({
                source_document_id: sourceId,
                site_id: siteId,
                reading_period: readingPeriod,
                yield_kwh: yieldKwh,
                operating_days: numberOrNull(row.operating_days),
                raw_fields: parsed,
                confidence,
                needs_review: validationErrors.length > 0 || confidence < 0.9,
              }),
            },
          );
        }
      }

      processingDocumentIds.delete(sourceId);
      const metricDocuments = metrics.documents as unknown[];
      metricDocuments.push({
        id: sourceId,
        filename: document.filename,
        sourceType: document.source_type,
        siteCode: jsonObject(document.site).code,
        status: validationErrors.length ? "needs_review" : "processed",
        confidence,
        validationErrors,
      });
    }

    const result = await rebuildMonthlyReport(
      auth.config,
      auth.token,
      auth.user.id,
      reportPeriod,
      ids,
    );
    const reportId = String(result.report.id ?? "");
    if (!reportId) throw new Error("สร้าง Monthly Report ไม่สำเร็จ");

    for (const sourceId of ids) {
      const sourceDoc = documents.find((d) => String(d.id) === sourceId);
      const sourceSiteCode = String(jsonObject(sourceDoc?.site).code ?? "");
      const sourceRole =
        String(sourceDoc?.source_type) === "solar_excel"
          ? "solar"
          : sourceSiteCode === "PHALAAD"
            ? "pea_phalaad"
            : "pea_sobprab";

      await supabaseJson(
        auth.config,
        auth.token,
        "electricity_monthly_report_sources",
        {
          method: "POST",
          headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
          body: JSON.stringify({
            report_id: reportId,
            source_document_id: sourceId,
            source_role: sourceRole,
          }),
        },
      );
    }

    metrics.reportId = reportId;
    metrics.reportMonth = reportPeriod;
    metrics.status = result.requiresReview ? "needs_review" : "ready_for_review";

    const finalRun = await supabaseJson<Array<Record<string, unknown>>>(
      auth.config,
      auth.token,
      "electricity_processing_runs?id=eq." + encodeURIComponent(runId),
      {
        method: "PATCH",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({
          status: "needs_review",
          finished_at: new Date().toISOString(),
          output_report_id: reportId,
          metrics,
        }),
      },
    );

    return {
      run: finalRun[0] ?? null,
      reports: [result.report],
      metrics,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI processing failed";

    for (const sourceId of processingDocumentIds) {
      await supabaseJson(
        auth.config,
        auth.token,
        "electricity_source_documents?id=eq." + encodeURIComponent(sourceId),
        {
          method: "PATCH",
          body: JSON.stringify({
            status: "failed",
            error_message: message.slice(0, 1000),
          }),
        },
      ).catch(() => undefined);
    }

    await supabaseJson(
      auth.config,
      auth.token,
      "electricity_processing_runs?id=eq." + encodeURIComponent(runId),
      {
        method: "PATCH",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({
          status: "failed",
          finished_at: new Date().toISOString(),
          error_message: message.slice(0, 1000),
          metrics,
        }),
      },
    ).catch(() => undefined);

    throw error;
  }
}

async function handleProcess(request: Request, env: Env) {
  const auth = await authorize(request, env, "facility.manage");
  if ("error" in auth) return auth.error;

  const body = (await request.json()) as { sourceDocumentIds?: unknown };
  const ids = Array.isArray(body.sourceDocumentIds)
    ? [...new Set(body.sourceDocumentIds.filter((x): x is string => typeof x === "string"))]
    : [];

  if (ids.length !== 3) {
    return json(
      {
        success: false,
        error: "ต้องเลือกชุดเอกสารให้ครบ 3 รายการ: PEA สบปราบ, PEA ผาลาด และ Solar",
      },
      400,
    );
  }

  try {
    const data = await processElectricityDocuments(auth, env, ids);
    return json({ success: true, data });
  } catch (error) {
    return json(
      { success: false, error: error instanceof Error ? error.message : "AI processing failed" },
      500,
    );
  }
}

export async function onRequest({ request, env }: { request: Request; env: Env }) {
  try {
    if (request.method === "GET") {
      const action = new URL(request.url).searchParams.get("action");
      if (action === "file") return await handleFileDownload(request, env);
      return await handleGet(request, env);
    }

    const action = new URL(request.url).searchParams.get("action");

    if (request.method === "POST") {
      if (action === "upload-set") return await handleUploadSet(request, env);
      if (action === "process") return await handleProcess(request, env);
      return await handleReportCreate(request, env);
    }

    if (request.method === "PATCH" && action === "report") {
      return await handleReportPatch(request, env);
    }
    if (request.method === "PATCH" && action === "approve") {
      return await handleReportTransition(request, env, "approve");
    }
    if (request.method === "PATCH" && action === "publish") {
      return await handleReportTransition(request, env, "publish");
    }
    if (request.method === "DELETE" && action === "report") {
      return await handleReportDelete(request, env);
    }

    return json(
      { success: false, error: "Method Not Allowed" },
      405,
      { Allow: "GET, POST, PATCH, DELETE" },
    );
  } catch (error) {
    console.error("/api/admin/electricity", error);
    return json(
      { success: false, error: error instanceof Error ? error.message : "Electricity API failed" },
      500,
    );
  }
}
