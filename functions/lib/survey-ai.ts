export type SurveyQuestionType = "single_choice" | "likert5" | "text";

export type GeneratedQuestion = {
  id: string;
  aspectIndex: number;
  title: string;
  questionType: SurveyQuestionType;
  scaleLabel?: string;
  sourceCiting: string;
  sourceDocName: string;
  required?: boolean;
  options?: Array<{ label: string; value?: string }>;
};

export type GeneratedSurveySection = {
  id: string;
  title: string;
  description: string;
  questions: GeneratedQuestion[];
};

export type GeneratedSurvey = {
  id: string;
  activityId: string;
  surveyTitle: string;
  welcomeText?: string;
  generatedDate: string;
  scaleType: string;
  aiConfidenceScore?: number;
  status: "ready_for_review";
  sections: GeneratedSurveySection[];
};

export type SurveyValidation = {
  valid: boolean;
  errors: string[];
  warnings: string[];
};

export type SurveyGenerationContext = {
  activity: Record<string, unknown>;
  analysis: {
    summary?: string;
    extractedEntities?: unknown[];
    primaryDoc?: string;
  };
  requestedInstruction?: string;
};

const ALLOWED_TYPES = new Set<SurveyQuestionType>(["single_choice", "likert5", "text"]);

export function validateGeneratedSurvey(value: unknown): SurveyValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!value || typeof value !== "object") {
    return { valid: false, errors: ["ผลลัพธ์ AI ต้องเป็น JSON object"], warnings };
  }

  const survey = value as Record<string, unknown>;
  if (typeof survey.surveyTitle !== "string" || !survey.surveyTitle.trim()) {
    errors.push("ต้องมี surveyTitle");
  }

  if (!Array.isArray(survey.sections) || survey.sections.length === 0) {
    errors.push("ต้องมี sections อย่างน้อย 1 ส่วน");
  }

  const seenQuestions = new Set<string>();
  for (const [sectionIndex, rawSection] of (Array.isArray(survey.sections) ? survey.sections : []).entries()) {
    if (!rawSection || typeof rawSection !== "object") {
      errors.push(`Section ${sectionIndex + 1} ไม่ถูกต้อง`);
      continue;
    }
    const section = rawSection as Record<string, unknown>;
    if (typeof section.id !== "string" || !section.id.trim()) errors.push(`Section ${sectionIndex + 1}: ต้องมี id`);
    if (typeof section.title !== "string" || !section.title.trim()) errors.push(`Section ${sectionIndex + 1}: ต้องมี title`);
    if (!Array.isArray(section.questions) || section.questions.length === 0) {
      errors.push(`Section ${sectionIndex + 1}: ต้องมีคำถามอย่างน้อย 1 ข้อ`);
      continue;
    }

    for (const [questionIndex, rawQuestion] of section.questions.entries()) {
      if (!rawQuestion || typeof rawQuestion !== "object") {
        errors.push(`Section ${sectionIndex + 1} ข้อ ${questionIndex + 1}: รูปแบบไม่ถูกต้อง`);
        continue;
      }
      const question = rawQuestion as Record<string, unknown>;
      const text = typeof question.title === "string" ? question.title.trim() : "";
      const type = typeof question.questionType === "string" ? question.questionType : "";
      if (!text) errors.push(`Section ${sectionIndex + 1} ข้อ ${questionIndex + 1}: ไม่มีข้อความคำถาม`);
      if (!ALLOWED_TYPES.has(type as SurveyQuestionType)) {
        errors.push(`Section ${sectionIndex + 1} ข้อ ${questionIndex + 1}: questionType ไม่รองรับ (${type || "ว่าง"})`);
      }
      if (typeof question.required !== "boolean") {
        errors.push(`Section ${sectionIndex + 1} ข้อ ${questionIndex + 1}: required ต้องเป็น boolean`);
      }
      if (typeof question.sourceCiting !== "string" || !question.sourceCiting.trim()) {
        errors.push(`Section ${sectionIndex + 1} ข้อ ${questionIndex + 1}: ต้องมี sourceCiting`);
      }
      if (typeof question.sourceDocName !== "string" || !question.sourceDocName.trim()) {
        errors.push(`Section ${sectionIndex + 1} ข้อ ${questionIndex + 1}: ต้องมี sourceDocName`);
      }

      const normalized = text.replace(/\\s+/g, " ").toLocaleLowerCase("th-TH");
      if (normalized && seenQuestions.has(normalized)) {
        errors.push(`พบคำถามซ้ำ: "${text}"`);
      }
      if (normalized) seenQuestions.add(normalized);

      if (type === "likert5") {
        const scaleMin = Number(question.scaleMin ?? 1);
        const scaleMax = Number(question.scaleMax ?? 5);
        if (scaleMin !== 1 || scaleMax !== 5) {
          errors.push(`Section ${sectionIndex + 1} ข้อ ${questionIndex + 1}: likert5 ต้องใช้ช่วง 1-5`);
        }
      }

      if (type === "single_choice") {
        if (!Array.isArray(question.options) || question.options.length < 2) {
          errors.push(`Section ${sectionIndex + 1} ข้อ ${questionIndex + 1}: single_choice ต้องมี options อย่างน้อย 2 รายการ`);
        } else if (question.options.some((option) => !option || typeof option !== "object" || typeof (option as Record<string, unknown>).label !== "string" || !(option as Record<string, unknown>).label.trim())) {
          errors.push(`Section ${sectionIndex + 1} ข้อ ${questionIndex + 1}: options ต้องมี label ทุกตัวเลือก`);
        }
      }
    }
  }

  if (Array.isArray(survey.sections) && survey.sections.length < 3) {
    warnings.push("แบบสำรวจมีน้อยกว่า 3 sections; ตรวจสอบว่าครอบคลุมข้อมูลทั่วไป ผลสัมฤทธิ์/ความพึงพอใจ และข้อเสนอแนะแล้วหรือไม่");
  }

  const allQuestions = (Array.isArray(survey.sections) ? survey.sections : []).flatMap((section) =>
    section && typeof section === "object" && Array.isArray((section as Record<string, unknown>).questions)
      ? ((section as Record<string, unknown>).questions as unknown[])
      : [],
  );
  if (allQuestions.length > 15) warnings.push("มีคำถามมากกว่า 15 ข้อ อาจทำให้ผู้ตอบใช้เวลานาน");
  if (!allQuestions.some((q) => q && typeof q === "object" && (q as Record<string, unknown>).questionType === "text")) {
    warnings.push("ไม่มีคำถามปลายเปิดสำหรับข้อเสนอแนะ");
  }

  return { valid: errors.length === 0, errors, warnings };
}

function extractJson(content: string): unknown {
  const cleaned = content.trim().replace(/^\`\`\`(?:json)?/i, "").replace(/\`\`\`$/i, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) return JSON.parse(cleaned.slice(start, end + 1));
    throw new Error("Pathumma ไม่ได้คืน JSON ที่ parse ได้");
  }
}

function asContent(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    return value
      .map((part) => (part && typeof part === "object" && typeof (part as Record<string, unknown>).text === "string"
        ? String((part as Record<string, unknown>).text)
        : ""))
      .join("");
  }
  return "";
}

function buildPrompt(context: SurveyGenerationContext): string {
  return [
    "คุณคือ Survey Designer สำหรับ Mahidol Lampang Portal",
    "ออกแบบแบบสำรวจภาษาไทยจากบริบทกิจกรรมที่ให้มาเท่านั้น ห้ามสร้างคำถาม generic ที่ไม่สัมพันธ์กับกิจกรรม",
    "",
    "กฎสำคัญ:",
    "1. ตอบเป็น JSON object เท่านั้น ห้าม Markdown และห้ามคำอธิบายนอก JSON",
    "2. ต้องมี surveyTitle, welcomeText และ sections",
    "3. ใช้ questionType ได้เฉพาะ single_choice, likert5, text",
    "4. likert5 ต้องใช้ scaleMin=1, scaleMax=5 และ scaleLabel="1 = น้อยที่สุด, 5 = มากที่สุด"",
    "5. single_choice ต้องมี options อย่างน้อย 2 รายการ",
    "6. หลีกเลี่ยงคำถามชี้นำและคำถามที่ถามหลายประเด็นในข้อเดียว",
    "7. ทุกคำถามต้องระบุ sourceCiting และ sourceDocName จาก context ที่มีจริง; หากไม่มีเอกสารให้ใช้ "Activity Context" อย่างชัดเจน",
    "8. ถ้า context เหมาะสม ให้มี 3 sections: ข้อมูลทั่วไป, ความพึงพอใจ/ผลสัมฤทธิ์, ข้อเสนอแนะ",
    "9. เชื่อมคำถามกับ objective, target group, location, KPI/expected outcome และผล AI Analysis",
    "10. required ต้องเป็น boolean",
    "",
    "JSON shape:",
    "{",
    '  "surveyTitle": "...",',
    '  "welcomeText": "...",',
    '  "sections": [{',
    '    "id": "sec-1",',
    '    "title": "...",',
    '    "description": "...",',
    '    "questions": [{',
    '      "id": "q-1",',
    '      "aspectIndex": 1,',
    '      "title": "...",',
    '      "questionType": "single_choice|likert5|text",',
    '      "required": true,',
    '      "options": [{"label":"...","value":"..."}],',
    '      "scaleMin": 1,',
    '      "scaleMax": 5,',
    '      "scaleLabel": "1 = น้อยที่สุด, 5 = มากที่สุด",',
    '      "sourceCiting": "...",',
    '      "sourceDocName": "..."',
    "    }]",
    "  }]",
    "}",
    "",
    "Activity context:",
    JSON.stringify(context, null, 2),
  ].join("\n");
}

export async function generateWithPathumma(
  env: Record<string, unknown>,
  context: SurveyGenerationContext,
): Promise<{ survey: GeneratedSurvey; model: string; provider: string }> {
  const apiUrl = String(env.PATHUMMA_API_URL ?? "").trim();
  const apiKey = String(env.PATHUMMA_API_KEY ?? "").trim();
  const model = String(env.PATHUMMA_MODEL ?? "nectec/pathumma-thaillm-8b-think-3.0.0").trim();

  if (!apiUrl) {
    throw new Error("PATHUMMA_API_URL is not configured. Configure the Pathumma OpenAI-compatible endpoint before enabling AI Survey Generation.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: "คุณเป็นผู้ช่วยสร้างแบบสำรวจภาษาไทยของ Mahidol Lampang Portal และต้องปฏิบัติตาม JSON contract อย่างเคร่งครัด",
          },
          { role: "user", content: buildPrompt(context) },
        ],
        temperature: 0.2,
        max_tokens: 5000,
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });

    const body = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(`Pathumma API ${response.status}: ${JSON.stringify(body).slice(0, 400)}`);
    }

    const raw = asContent(body?.choices?.[0]?.message?.content);
    if (!raw) throw new Error("Pathumma API returned no message content");

    const parsed = extractJson(raw) as Record<string, unknown>;
    const validation = validateGeneratedSurvey(parsed);
    if (!validation.valid) {
      throw new Error(`Pathumma output validation failed: ${validation.errors.join("; ")}`);
    }

    const generatedDate = new Date().toISOString();
    const survey: GeneratedSurvey = {
      id: `survey-gen-${context.activity.id ?? crypto.randomUUID()}`,
      activityId: String(context.activity.id),
      surveyTitle: String(parsed.surveyTitle),
      welcomeText: typeof parsed.welcomeText === "string" ? parsed.welcomeText : undefined,
      generatedDate,
      scaleType: "Likert Scale 5 ระดับ (1 = น้อยที่สุด, 5 = มากที่สุด)",
      status: "ready_for_review",
      sections: parsed.sections as GeneratedSurveySection[],
    };

    return { survey, model, provider: "pathumma" };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Pathumma generation timed out after 45 seconds");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export function normalizeSurveyForImprovement(value: unknown): GeneratedSurvey {
  const validation = validateGeneratedSurvey(value);
  if (!validation.valid) throw new Error(validation.errors.join("; "));
  const survey = value as GeneratedSurvey;
  return { ...survey, status: "ready_for_review" };
}

export function buildImprovementContext(
  currentSurvey: GeneratedSurvey,
  instruction: string,
  baseContext: SurveyGenerationContext,
): SurveyGenerationContext {
  return {
    ...baseContext,
    requestedInstruction: instruction,
    analysis: {
      ...baseContext.analysis,
      summary: `${baseContext.analysis.summary ?? ""}\nAdmin improvement instruction: ${instruction}\nCurrent survey: ${JSON.stringify(currentSurvey)}`,
    },
  };
}

export async function improveWithPathumma(
  env: Record<string, unknown>,
  context: SurveyGenerationContext,
  currentSurvey: GeneratedSurvey,
): Promise<{ survey: GeneratedSurvey; model: string; provider: string }> {
  const instruction = context.requestedInstruction?.trim();
  if (!instruction) throw new Error("กรุณาระบุคำสั่งสำหรับ AI Improve");

  const result = await generateWithPathumma(env, {
    ...context,
    requestedInstruction: instruction,
    analysis: {
      ...context.analysis,
      summary: [
        context.analysis.summary ?? "",
        "CURRENT SURVEY:",
        JSON.stringify(currentSurvey),
        `ADMIN INSTRUCTION: ${instruction}`,
      ].join("\n"),
    },
  });

  return result;
}
