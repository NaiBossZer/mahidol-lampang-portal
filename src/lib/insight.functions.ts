import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  summary: z.string().min(1).max(40000),
});

export type InsightResult = {
  insights: string[];
  sentiment: { positive: number; neutral: number; negative: number } | null;
  strengths: string[];
  improvements: string[];
  suggestions: string[];
  topics: string[];
  recommendation: {
    keep: string[];
    improve: string[];
    add: string[];
    interest: string[];
    develop: string[];
  };
  insufficient: boolean;
};

const EMPTY: InsightResult = {
  insights: [],
  sentiment: null,
  strengths: [],
  improvements: [],
  suggestions: [],
  topics: [],
  recommendation: { keep: [], improve: [], add: [], interest: [], develop: [] },
  insufficient: true,
};

const SYSTEM = `คุณเป็นนักวิเคราะห์ข้อมูลสำหรับผู้บริหารมหาวิทยาลัยมหิดล
วิเคราะห์ผลแบบสอบถาม "พิธีเปิดห้องการเรียนรู้ครั่งครบวงจร" จากข้อมูลสรุปที่ให้มาเท่านั้น
กฎเด็ดขาด:
- ห้ามสร้างตัวเลขหรือข้อเท็จจริงที่ไม่มีในข้อมูล
- ถ้าข้อมูลไม่พอสำหรับประเด็นใด ให้ใส่ข้อความ "ไม่สามารถวิเคราะห์ในประเด็นนี้ได้ เนื่องจากข้อมูลไม่เพียงพอ"
- ตอบเป็นภาษาไทย กระชับ แต่ละข้อไม่เกิน 2 บรรทัด
- sentiment ให้นับจากคำตอบปลายเปิดที่ให้มาเท่านั้น เป็นจำนวนคน (ถ้าไม่มีคำตอบปลายเปิดให้เป็น null)
ตอบเป็น JSON ตามรูปแบบ:
{"insights":["..."],"sentiment":{"positive":0,"neutral":0,"negative":0},
"strengths":["..."],"improvements":["..."],"suggestions":["..."],"topics":["..."],
"recommendation":{"keep":["..."],"improve":["..."],"add":["..."],"interest":["..."],"develop":["..."]}}
insights ไม่เกิน 5 ข้อ, แต่ละ list อื่นไม่เกิน 4 ข้อ`;

export const getAiInsight = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }): Promise<InsightResult> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return EMPTY;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: data.summary },
        ],
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`AI gateway failed [${res.status}]: ${body}`);
      throw new Error(`AI วิเคราะห์ไม่สำเร็จ [${res.status}]`);
    }

    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = json.choices?.[0]?.message?.content ?? "";
    let parsed: Partial<InsightResult> & { sentiment?: InsightResult["sentiment"] } = {};
    try {
      parsed = JSON.parse(content.replace(/^```json\s*|```$/g, ""));
    } catch {
      return EMPTY;
    }

    const list = (v: unknown): string[] =>
      Array.isArray(v) ? v.filter((x): x is string => typeof x === "string").slice(0, 5) : [];

    return {
      insights: list(parsed.insights),
      sentiment: parsed.sentiment ?? null,
      strengths: list(parsed.strengths),
      improvements: list(parsed.improvements),
      suggestions: list(parsed.suggestions),
      topics: list(parsed.topics),
      recommendation: {
        keep: list(parsed.recommendation?.keep),
        improve: list(parsed.recommendation?.improve),
        add: list(parsed.recommendation?.add),
        interest: list(parsed.recommendation?.interest),
        develop: list(parsed.recommendation?.develop),
      },
      insufficient: false,
    };
  });
