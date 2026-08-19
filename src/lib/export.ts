import type { Analysis } from "./analysis";
import { shortLabel, toMean5 } from "./analysis";
import type { InsightResult } from "./insight.functions";

const EVENT_TITLE = "พิธีเปิดห้องการเรียนรู้ครั่งครบวงจร";
const SUBTITLE = "Satisfaction & Event Insight Dashboard — Mahidol University";

function fmt(n: number, d = 2) {
  return Number.isFinite(n) ? n.toFixed(d) : "-";
}

export async function exportExcel(a: Analysis, headers: string[], rows: string[][]) {
  const XLSX = await import("xlsx");
  const wb = XLSX.utils.book_new();

  const kpi: (string | number)[][] = [
    ["รายการ", "ค่า"],
    ["จำนวนผู้ตอบแบบสอบถาม", a.responses],
    ["ค่าเฉลี่ยความพึงพอใจโดยรวม (เต็ม 5)", a.overall ? Number(fmt(a.overall.mean)) : "-"],
    ["ระดับความพึงพอใจ (%)", a.overall ? Number(fmt(a.overall.percent, 1)) : "-"],
    ["Learning Impact Score (%)", a.learningImpactScore ? Number(fmt(a.learningImpactScore, 1)) : "-"],
    ["Event Experience Score (%)", a.experienceScore ? Number(fmt(a.experienceScore, 1)) : "-"],
    ["Event Success Score", a.successScore ? Number(fmt(a.successScore.score, 1)) : "-"],
    ["ระดับความสำเร็จ", a.successScore?.label ?? "-"],
    ["NPS", a.nps ? a.nps.score : "-"],
    [
      "ความต้องการเข้าร่วมกิจกรรมในอนาคต (%)",
      a.futureParticipation ? Number(fmt(a.futureParticipation.percentYes, 1)) : "-",
    ],
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(kpi), "Executive Summary");

  const ratingRows: (string | number)[][] = [
    ["อันดับ", "หัวข้อ", "จำนวนผู้ตอบ", "ค่าเฉลี่ย (เต็ม 5)", "SD", "ร้อยละ"],
    ...[...a.ratings]
      .sort((x, y) => y.percent - x.percent)
      .map((r, i) => [i + 1, r.header, r.n, Number(fmt(toMean5(r))), Number(fmt(r.sd)), Number(fmt(r.percent, 1))]),
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(ratingRows), "Satisfaction");

  const profile: (string | number)[][] = [];
  a.categoricals.forEach((c) => {
    profile.push([c.header]);
    profile.push(["ตัวเลือก", "จำนวน", "ร้อยละ"]);
    c.items.forEach((it) => profile.push([it.label, it.count, Number(fmt(it.percent, 1))]));
    profile.push([]);
  });
  if (profile.length)
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(profile), "Participant Profile");

  if (a.openAnswers.length)
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.aoa_to_sheet([["คำถาม", "คำตอบ"], ...a.openAnswers.map((o) => [o.header, o.text])]),
      "Feedback",
    );

  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([headers, ...rows]), "Raw Data");
  XLSX.writeFile(wb, `Mahidol-Lac-Learning-Room-Summary-${new Date().toISOString().slice(0, 10)}.xlsx`);
}

export async function exportPptx(a: Analysis, insight: InsightResult | null) {
  const mod = await import("pptxgenjs");
  const PptxGenJS = (mod as unknown as { default: new () => any }).default;
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_16x9";

  const NAVY = "0B1B34";
  const GOLD = "F0B323";
  const WHITE = "FFFFFF";

  const slide = (title: string) => {
    const s = pptx.addSlide();
    s.background = { color: NAVY };
    s.addText(title, { x: 0.4, y: 0.3, w: 9, h: 0.5, fontSize: 20, bold: true, color: GOLD });
    return s;
  };

  const cover = pptx.addSlide();
  cover.background = { color: NAVY };
  cover.addText("MAHIDOL UNIVERSITY", { x: 0.5, y: 1.6, fontSize: 16, color: GOLD, bold: true });
  cover.addText(EVENT_TITLE, { x: 0.5, y: 2.1, w: 9, fontSize: 28, color: WHITE, bold: true });
  cover.addText(SUBTITLE, { x: 0.5, y: 3.1, w: 9, fontSize: 13, color: "B9C6DC" });
  cover.addText(`ข้อมูล ณ ${new Date().toLocaleString("th-TH")}`, {
    x: 0.5,
    y: 3.6,
    fontSize: 11,
    color: "B9C6DC",
  });

  const kpiSlide = slide("Executive Summary / KPI");
  kpiSlide.addTable(
    [
      [
        { text: "ตัวชี้วัด", options: { bold: true, color: GOLD } },
        { text: "ค่า", options: { bold: true, color: GOLD } },
      ],
      ["จำนวนผู้ตอบ", String(a.responses)],
      ["ค่าเฉลี่ยความพึงพอใจ (เต็ม 5)", a.overall ? fmt(a.overall.mean) : "-"],
      ["ระดับความพึงพอใจ (%)", a.overall ? fmt(a.overall.percent, 1) : "-"],
      ["Learning Impact Score (%)", a.learningImpactScore ? fmt(a.learningImpactScore, 1) : "-"],
      ["Event Success Score", a.successScore ? `${fmt(a.successScore.score, 1)} (${a.successScore.label})` : "-"],
      [
        "ความต้องการเข้าร่วมในอนาคต (%)",
        a.futureParticipation ? fmt(a.futureParticipation.percentYes, 1) : "-",
      ],
    ],
    { x: 0.5, y: 1.0, w: 9, fontSize: 12, color: WHITE, border: { pt: 0.5, color: "35507A" } },
  );

  const top = [...a.ratings].sort((x, y) => y.percent - x.percent).slice(0, 3);
  const bottom = [...a.ratings].sort((x, y) => x.percent - y.percent).slice(0, 3);
  const rankSlide = slide("Satisfaction — TOP 3 / BOTTOM 3");
  rankSlide.addText(
    [
      { text: "TOP 3\n", options: { bold: true, color: "5CD6A0", fontSize: 14 } },
      ...top.map((r) => ({
        text: `• ${shortLabel(r.header, 60)} — ${fmt(toMean5(r))}\n`,
        options: { color: WHITE, fontSize: 12 },
      })),
      { text: "\nBOTTOM 3\n", options: { bold: true, color: "FF8A73", fontSize: 14 } },
      ...bottom.map((r) => ({
        text: `• ${shortLabel(r.header, 60)} — ${fmt(toMean5(r))}\n`,
        options: { color: WHITE, fontSize: 12 },
      })),
    ],
    { x: 0.5, y: 1.0, w: 9, h: 4 },
  );

  if (insight) {
    const aiSlide = slide("AI Event Insight");
    aiSlide.addText(
      (insight.insights.length ? insight.insights : ["ไม่สามารถวิเคราะห์ในประเด็นนี้ได้ เนื่องจากข้อมูลไม่เพียงพอ"])
        .map((t) => `• ${t}`)
        .join("\n"),
      { x: 0.5, y: 1.0, w: 9, h: 4, fontSize: 12, color: WHITE },
    );

    const recSlide = slide("What should we do next?");
    const rec = insight.recommendation;
    recSlide.addText(
      [
        ...[
          ["สิ่งที่ควรรักษา", rec.keep],
          ["สิ่งที่ควรปรับปรุง", rec.improve],
          ["สิ่งที่ควรเพิ่มครั้งต่อไป", rec.add],
          ["กิจกรรมที่ผู้เข้าร่วมสนใจ", rec.interest],
          ["แนวทางพัฒนาห้องการเรียนรู้", rec.develop],
        ].flatMap(([label, items]) => [
          { text: `${label}\n`, options: { bold: true, color: GOLD, fontSize: 12 } },
          {
            text: `${((items as string[]).length ? (items as string[]) : ["-"]).map((i) => `• ${i}`).join("\n")}\n`,
            options: { color: WHITE, fontSize: 11 },
          },
        ]),
      ],
      { x: 0.5, y: 1.0, w: 9, h: 4.2 },
    );
  }

  await pptx.writeFile({
    fileName: `Mahidol-Lac-Learning-Room-Executive-${new Date().toISOString().slice(0, 10)}.pptx`,
  });
}

export function exportPdf() {
  window.print();
}
