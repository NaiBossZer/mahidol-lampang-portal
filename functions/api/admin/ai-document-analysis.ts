import {
  getCookie,
  getSupabaseUser,
  isAdminRole,
  json,
  supabaseConfig,
} from "../auth/_shared";

type Env = Record<string, unknown>;

const ALLOWED_ROLES = new Set(["SUPER_ADMIN", "CONTENT_ADMIN", "OPERATIONS_ADMIN"]);

async function callDb<T>(env: Env, token: string, path: string, init: RequestInit = {}): Promise<T> {
  const { url, key, configured } = supabaseConfig(env);
  if (!configured) throw new Error("Supabase is not configured");
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(`Supabase REST ${response.status}: ${JSON.stringify(body).slice(0, 200)}`);
  }
  return body as T;
}

async function downloadStorageObject(
  env: Env,
  token: string,
  storagePath: string,
): Promise<{ bytes: ArrayBuffer; contentType: string }> {
  const { url, key, configured } = supabaseConfig(env);
  if (!configured) throw new Error("Supabase is not configured");
  const response = await fetch(`${url}/storage/v1/object/portal-media/${storagePath}`, {
    headers: { apikey: key, Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`Storage download ${response.status}`);
  return {
    bytes: await response.arrayBuffer(),
    contentType: response.headers.get("content-type") || "application/octet-stream",
  };
}

function bytesToBase64(bytes: ArrayBuffer): string {
  let binary = "";
  const data = new Uint8Array(bytes);
  const chunkSize = 0x8000;
  for (let offset = 0; offset < data.length; offset += chunkSize) {
    binary += String.fromCharCode(...data.subarray(offset, Math.min(offset + chunkSize, data.length)));
  }
  return btoa(binary);
}

export type ExtractedEntity = {
  id: string;
  category: "objective" | "target_group" | "location" | "kpi" | "schedule";
  categoryLabel: string;
  title: string;
  text: string;
  sourceDoc: string;
  page: string;
  confidence: number;
};

export async function onRequest({ request, env }: { request: Request; env: Env }) {
  if (request.method !== "POST" && request.method !== "GET") {
    return json({ success: false, error: "Method Not Allowed" }, 405, { Allow: "GET, POST" });
  }

  const user = await getSupabaseUser(request, env);
  const role = String(user?.app_metadata?.role ?? "");
  const token = getCookie(request, "sb_access_token");

  if (!user || !isAdminRole(role) || !token) {
    return json({ success: false, error: "Unauthorized" }, 401);
  }
  if (!ALLOWED_ROLES.has(role)) {
    return json({ success: false, error: "Forbidden: role lacks AI permission" }, 403);
  }

  // GET: Fetch previous analysis result for an activity
  if (request.method === "GET") {
    const url = new URL(request.url);
    const activityId = url.searchParams.get("activityId");
    if (!activityId) return json({ success: false, error: "activityId required" }, 400);

    try {
      const executions = await callDb<Record<string, unknown>[]>(
        env,
        token,
        `ai_executions?intent=eq.document_analysis&input->>activityId=eq.${encodeURIComponent(activityId)}&order=created_at.desc&limit=1`,
      );
      const execution = executions?.[0];
      if (!execution) return json({ success: true, data: null });
      return json({
        success: true,
        data: {
          id: execution.id,
          status: execution.status,
          output: execution.output,
          error: execution.error,
          createdAt: execution.created_at,
          completedAt: execution.completed_at,
        },
      });
    } catch (error) {
      return json({ success: false, error: error instanceof Error ? error.message : "Load failed" }, 500);
    }
  }

  // POST: Execute AI Document Analysis
  let executionId = "";
  try {
    const body = (await request.json()) as { activityId?: string; documentId?: string; retry?: boolean };
    const activityId = body.activityId?.trim();
    if (!activityId) return json({ success: false, error: "activityId is required" }, 400);

    // 1. Fetch activity details from database
    const activities = await callDb<Record<string, unknown>[]>(
      env,
      token,
      `activities?id=eq.${encodeURIComponent(activityId)}&select=id,title,slug,summary,content,activity_date,location,participant_count,objective,key_activities,outcomes,impact&limit=1`,
    );
    const activity = activities?.[0];
    if (!activity) return json({ success: false, error: "ไม่พบกิจกรรมที่ระบุ" }, 404);

    // 2. Fetch linked documents from portal_media_assets
    const documents = await callDb<Record<string, unknown>[]>(
      env,
      token,
      `portal_media_assets?entity_type=eq.activities&entity_id=eq.${encodeURIComponent(activityId)}&field_key=eq.documents&select=id,original_name,storage_path,public_url,size_bytes,mime_type,caption&order=created_at.desc`,
    );

    const requestedDocumentId = body.documentId?.trim() || "";
    const selectedDocument = requestedDocumentId
      ? documents.find((doc) => String(doc.id) === requestedDocumentId)
      : documents[0];
    if (!selectedDocument) {
      return json({ success: false, error: "ต้องมีเอกสารต้นฉบับสำหรับ AI Analysis" }, 422);
    }
    const docName = String(selectedDocument.original_name ?? "เอกสารข้อเสนอโครงการ");
    const storagePath = String(selectedDocument.storage_path ?? "");
    if (!storagePath) return json({ success: false, error: "เอกสารไม่มี Storage Path" }, 422);

    // 3. Log start of analysis in audit_logs
    await callDb(env, token, "audit_logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        actor_id: user.id,
        action: "AI analysis started",
        table_name: "activities",
        record_id: activityId,
        new_data: { documentCount: documents.length, primaryDoc: docName },
      }),
    }).catch(() => undefined);

    // 4. Create record in ai_executions
    const startedAt = new Date().toISOString();
    const execInsert = await callDb<Record<string, unknown>[]>(env, token, "ai_executions", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        actor_id: user.id,
        intent: "document_analysis",
        status: "running",
        risk_level: "low",
        input: {
          activityId,
          activityTitle: activity.title,
          documentId: body.documentId ?? documents[0]?.id ?? null,
          documents: documents.map((d) => ({ id: d.id, name: d.original_name })),
        },
        started_at: startedAt,
      }),
    });
    executionId = String(execInsert?.[0]?.id ?? crypto.randomUUID());

    // 5. Download the actual source file and send its bytes to Gemini.
    // A successful document_analysis must be based on the uploaded file content.
    const apiKey = String(env.GEMINI_API_KEY ?? "").trim();
    if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

    const sourceFile = await downloadStorageObject(env, token, storagePath);
    const rawSourceMimeType = String(selectedDocument.mime_type ?? sourceFile.contentType)
      .toLowerCase()
      .split(";")[0]
      .trim();
    const sourceMimeType = rawSourceMimeType === "image/jpg" ? "image/jpeg" : rawSourceMimeType;
    if (!["application/pdf", "image/jpeg", "image/png", "image/webp"].includes(sourceMimeType)) {
      throw new Error(`AI Analysis รองรับเฉพาะ PDF, JPEG, PNG และ WebP (ได้รับ ${sourceMimeType || "unknown"})`);
    }
    const sourceBase64 = bytesToBase64(sourceFile.bytes);
    let extractedEntities: ExtractedEntity[] = [];
    let analysisSummary = "";

    if (apiKey) {
      try {
        const systemPrompt = `คุณคือผู้เชี่ยวชาญด้านระบบสารสนเทศและการวิเคราะห์เอกสารราชการ งานพันธกิจเพื่อสังคม คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล
หน้าที่ของคุณคือวิเคราะห์ข้อมูลโครงการ/กิจกรรม และสกัดสาระสำคัญออกเป็น 5 หมวดหมู่:
1. objective (วัตถุประสงค์โครงการ)
2. target_group (กลุ่มเป้าหมายผู้เข้าร่วม)
3. location (สถานที่และสิ่งอำนวยความสะดวก)
4. kpi (ตัวชี้วัดความสำเร็จ)
5. schedule (กำหนดการและพิธีการ)

ต้องตอบกลับเป็น JSON ตาม Schema ที่กำหนดเท่านั้น`;

        const userContext = `กิจกรรม: ${activity.title}
วันที่: ${activity.activity_date}
สถานที่: ${activity.location || "มหาวิทยาลัยมหิดล วิทยาเขตลำปาง"}
จำนวนผู้เข้าร่วมเป้าหมาย: ${activity.participant_count || 30} คน
ข้อมูลกิจกรรมเดิม (ใช้เพื่อระบุตัวตนและตรวจสอบความสอดคล้องเท่านั้น): ${activity.objective || activity.summary || "-"}
ชื่อเอกสารต้นฉบับ: ${docName}

จงวิเคราะห์ "เนื้อหาจริงของไฟล์แนบ" ที่ส่งมาใน file/image part เป็นหลัก ห้ามแต่งข้อมูลจาก Activity Brief หากไม่มีหลักฐานในไฟล์
สำหรับแต่ละ entity ให้ระบุ sourceDoc เป็นชื่อไฟล์ และ page เป็นเลขหน้าจริงถ้าระบุได้; ถ้าระบุไม่ได้ให้ใช้ "-" `;

        const model = String(env.GEMINI_MODEL ?? "gemini-3.8-flash");
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;

        const geminiRes = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: [{
              role: "user",
              parts: [
                { text: userContext },
                { inlineData: { mimeType: sourceMimeType, data: sourceBase64 } },
              ],
            }],
            generationConfig: {
              maxOutputTokens: Number(env.GEMINI_MAX_OUTPUT_TOKENS ?? 4096),
              responseMimeType: "application/json",
              responseJsonSchema: {
                type: "object",
                properties: {
                  summary: { type: "string" },
                  entities: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        category: { type: "string", enum: ["objective", "target_group", "location", "kpi", "schedule"] },
                        categoryLabel: { type: "string" },
                        title: { type: "string" },
                        text: { type: "string" },
                        sourceDoc: { type: "string" },
                        page: { type: "string" },
                        confidence: { type: "number" },
                      },
                      required: ["id", "category", "categoryLabel", "title", "text", "sourceDoc", "confidence"],
                    },
                  },
                },
                required: ["summary", "entities"],
              },
            },
          }),
        });

        const geminiData = await geminiRes.json().catch(() => null);

        if (!geminiRes.ok) {
          const apiMessage =
            geminiData?.error?.message ||
            geminiData?.message ||
            `HTTP ${geminiRes.status}`;
          throw new Error(`Gemini API ${geminiRes.status}: ${apiMessage}`);
        }

        const rawText = geminiData?.candidates?.[0]?.content?.parts?.find(
          (part: { text?: unknown }) => typeof part?.text === "string",
        )?.text;

        if (!rawText) {
          const finishReason = geminiData?.candidates?.[0]?.finishReason || "unknown";
          const blockReason = geminiData?.promptFeedback?.blockReason || "none";
          throw new Error(
            `Gemini returned no analysis text (finishReason=${finishReason}, blockReason=${blockReason})`,
          );
        }

        const finishReason = geminiData?.candidates?.[0]?.finishReason || "unknown";
        if (finishReason === "MAX_TOKENS") {
          throw new Error(
            `Gemini response was truncated by maxOutputTokens (finishReason=MAX_TOKENS). Increase GEMINI_MAX_OUTPUT_TOKENS.`,
          );
        }

        let parsed: { summary?: string; entities?: ExtractedEntity[] };
        try {
          parsed = JSON.parse(rawText) as { summary?: string; entities?: ExtractedEntity[] };
        } catch {
          throw new Error(
            `Gemini returned invalid JSON (finishReason=${finishReason}): ${rawText.slice(0, 500)}`,
          );
        }

        analysisSummary = String(parsed.summary ?? "").trim();
        extractedEntities = Array.isArray(parsed.entities) ? parsed.entities : [];

        if (!analysisSummary || !extractedEntities.length) {
          throw new Error(
            `Gemini returned incomplete analysis (summary=${Boolean(analysisSummary)}, entities=${extractedEntities.length})`,
          );
        }
      } catch (geminiError) {
        const message = geminiError instanceof Error ? geminiError.message : String(geminiError);
        console.error("Gemini execution failed:", geminiError);
        throw new Error(message);
      }
    }

    const completedAt = new Date().toISOString();

    // 6. Update ai_executions to completed
    await callDb(env, token, `ai_executions?id=eq.${encodeURIComponent(executionId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "completed",
        completed_at: completedAt,
        output: {
          summary: analysisSummary,
          extractedEntities,
          documentCount: documents.length,
          primaryDoc: docName,
        },
      }),
    });

    // 7. Log completion in audit_logs
    await callDb(env, token, "audit_logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        actor_id: user.id,
        action: "AI analysis completed",
        table_name: "ai_executions",
        record_id: executionId,
        new_data: { activityId, entityCount: extractedEntities.length },
      }),
    }).catch(() => undefined);

    return json({
      success: true,
      data: {
        executionId,
        summary: analysisSummary,
        extractedEntities,
        primaryDoc: docName,
        documentCount: documents.length,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI Document Analysis failed";
    console.error("/api/admin/ai-document-analysis error:", error);

    if (executionId) {
      await callDb(env, token, `ai_executions?id=eq.${encodeURIComponent(executionId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "failed",
          completed_at: new Date().toISOString(),
          error: message,
        }),
      }).catch((patchError) => {
        console.error("Failed to persist AI execution failure:", patchError);
      });
    }

    return json({ success: false, error: message, executionId: executionId || undefined }, 500);
  }
}
