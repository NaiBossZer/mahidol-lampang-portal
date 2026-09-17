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

export async function onRequest({ request, env }: { request: Request; env: Env }) {
  if (request.method !== "POST") {
    return json({ success: false, error: "Method Not Allowed" }, 405, { Allow: "POST" });
  }

  const user = await getSupabaseUser(request, env);
  const role = String(user?.app_metadata?.role ?? "");
  const token = getCookie(request, "sb_access_token");

  if (!user || !isAdminRole(role) || !token) {
    return json({ success: false, error: "Unauthorized" }, 401);
  }
  if (!ALLOWED_ROLES.has(role)) {
    return json({ success: false, error: "Forbidden: role lacks permission" }, 403);
  }

  try {
    const body = (await request.json()) as { activityId?: string };
    const activityId = body.activityId?.trim();
    if (!activityId) return json({ success: false, error: "activityId is required" }, 400);

    // Fetch activity
    const activities = await callDb<Record<string, unknown>[]>(
      env,
      token,
      `activities?id=eq.${encodeURIComponent(activityId)}&select=id,title,slug,summary,content,activity_date,location,participant_count,objective,key_activities,outcomes,impact&limit=1`,
    );
    const activity = activities?.[0];
    if (!activity) return json({ success: false, error: "ไม่พบกิจกรรม" }, 404);

    // Fetch survey responses for this activity
    const responses = await callDb<Record<string, unknown>[]>(
      env,
      token,
      `survey_responses?activity_id=eq.${encodeURIComponent(activityId)}&select=p2_location,p2_schedule,p2_readiness,p2_reception,p2_overall,p3_interest,p3_content,p3_clarity,p3_benefit,p3_application,p4_knowledge,p4_inspiration,p4_community_resource,p4_future_return`,
    );

    // Calculate official satisfaction metrics
    const scores = responses.flatMap((r) =>
      Object.entries(r)
        .filter(([k, v]) => /^p[234]_/.test(k) && typeof v === "number")
        .map(([, v]) => v as number),
    );
    const average = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null;
    const satisfaction = average != null ? Number(((average / 5) * 100).toFixed(2)) : null;

    const title = String(activity.title);
    const dateStr = new Date(String(activity.activity_date)).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    let reportTitle = `งานพันธกิจเพื่อสังคม คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล จัดกิจกรรม "${title}" ขับเคลื่อนสุขภาวะและสิ่งแวดล้อมยั่งยืน`;
    let reportSummary = `งานพันธกิจเพื่อสังคม คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล จัดกิจกรรม "${title}" ณ ${activity.location || "วิทยาเขตลำปาง"} เมื่อวันที่ ${dateStr} โดยมีผู้เข้าร่วม ${activity.participant_count || 30} คน`;
    let reportContent = `เมื่อวันที่ ${dateStr} งานพันธกิจเพื่อสังคม คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล ได้จัดกิจกรรม "${title}" ณ ${activity.location || "มหาวิทยาลัยมหิดล วิทยาเขตลำปาง"}\n\nโดยมีวัตถุประสงค์เพื่อ ${activity.objective || "ส่งเสริมและพัฒนาการมีส่วนร่วมของชุมชน"}\n\nกิจกรรมประกอบด้วย: ${activity.key_activities || "การอบรม การสาธิต และการแลกเปลี่ยนเรียนรู้ระหว่างคณาจารย์และชุมชน"}`;
    let performanceResults = `มีผู้เข้าร่วมกิจกรรมทั้งสิ้น ${activity.participant_count || 30} คน`;
    if (responses.length > 0 && satisfaction != null) {
      performanceResults += ` โดยมีผู้ตอบแบบประเมินจำนวน ${responses.length} คน ผลการประเมินภาพรวมได้คะแนนเฉลี่ย ${average?.toFixed(4)} จากเต็ม 5.0000 คะแนน คิดเป็นระดับความพึงพอใจ ${satisfaction}% (ระดับดีมาก)`;
    } else {
      performanceResults += ` (อยู่ระหว่างการประมวลผลข้อมูลแบบประเมินความพึงพอใจ)`;
    }
    let outcomesAndImpact = String(
      activity.impact || activity.outcomes || "เกิดความร่วมมืออย่างยั่งยืนระหว่างงานพันธกิจเพื่อสังคม คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล และชุมชนในพื้นที่",
    );

    // Optional Gemini synthesis if configured
    const apiKey = String(env.GEMINI_API_KEY ?? "").trim();
    if (apiKey) {
      try {
        const systemPrompt = `คุณคือนักประชาสัมพันธ์และบรรณาธิการข่าวสาร งานพันธกิจเพื่อสังคม คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล
หน้าที่ของคุณคือร่างข่าวประชาสัมพันธ์และรายงานสรุปผลการจัดกิจกรรมอย่างเป็นทางการ
ตอบกลับเป็น JSON: {"title":"...","summary":"...","content":"...","performanceResults":"...","outcomesAndImpact":"..."}`;

        const userContext = `กิจกรรม: ${title}
วันที่: ${dateStr}
สถานที่: ${activity.location || "มหาวิทยาลัยมหิดล วิทยาเขตลำปาง"}
ผู้เข้าร่วม: ${activity.participant_count || 30} คน
ผู้ตอบแบบประเมิน: ${responses.length} คน
คะแนนเฉลี่ย: ${average ? average.toFixed(2) : "รอการประเมิน"} / 5.00 (ความพึงพอใจ: ${satisfaction ? satisfaction + "%" : "รอการประเมิน"})
วัตถุประสงค์: ${activity.objective || "-"}
กระบวนการ: ${activity.key_activities || "-"}
ผลลัพธ์เดิม: ${activity.outcomes || "-"}`;

        const model = String(env.GEMINI_MODEL ?? "gemini-3.8-flash");
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;

        const geminiRes = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: [{ role: "user", parts: [{ text: userContext }] }],
            generationConfig: {
              maxOutputTokens: 2000,
              responseMimeType: "application/json",
            },
          }),
        });

        if (geminiRes.ok) {
          const payload = await geminiRes.json();
          const raw = payload?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed.title) reportTitle = parsed.title;
            if (parsed.summary) reportSummary = parsed.summary;
            if (parsed.content) reportContent = parsed.content;
            if (parsed.performanceResults) performanceResults = parsed.performanceResults;
            if (parsed.outcomesAndImpact) outcomesAndImpact = parsed.outcomesAndImpact;
          }
        }
      } catch (e) {
        console.warn("Gemini report generation fallback:", e);
      }
    }

    // Persist execution
    await callDb(env, token, "ai_executions", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        actor_id: user.id,
        intent: "post_project_report",
        status: "completed",
        risk_level: "low",
        input: { activityId, activityTitle: title },
        output: {
          report: {
            title: reportTitle,
            summary: reportSummary,
            content: reportContent,
            performanceResults,
            outcomesAndImpact,
            averageScore: average,
            satisfactionPercent: satisfaction,
            responseCount: responses.length,
          },
        },
        completed_at: new Date().toISOString(),
      }),
    }).catch(() => undefined);

    // Audit
    await callDb(env, token, "audit_logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        actor_id: user.id,
        action: "post project report drafted",
        table_name: "activities",
        record_id: activityId,
        new_data: { responseCount: responses.length, satisfaction },
      }),
    }).catch(() => undefined);

    return json({
      success: true,
      data: {
        report: {
          title: reportTitle,
          summary: reportSummary,
          content: reportContent,
          performanceResults,
          outcomesAndImpact,
          averageScore: average,
          satisfactionPercent: satisfaction,
          responseCount: responses.length,
          author: "ฝ่ายสื่อสารองค์กรและบริการวิชาการ วิทยาเขตลำปาง",
        },
      },
    });
  } catch (error) {
    console.error("/api/admin/ai-post-project error:", error);
    return json(
      { success: false, error: error instanceof Error ? error.message : "Report generation failed" },
      500,
    );
  }
}
