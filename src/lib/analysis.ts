/**
 * Generic survey analysis engine.
 * Everything is derived from the actual Google Sheets columns — no hard-coded
 * questions, options or numbers.
 */

export type ColumnKind = "rating" | "categorical" | "text" | "timestamp" | "other";

export type ColumnInfo = {
  index: number;
  header: string;
  kind: ColumnKind;
  answered: number;
  uniqueValues: number;
  scaleMax?: number;
};

export type RatingStat = {
  header: string;
  index: number;
  n: number;
  mean: number;
  sd: number;
  scaleMax: number;
  percent: number;
  distribution: { value: number; count: number }[];
  importance: number;
};

export type CategoryStat = {
  header: string;
  index: number;
  total: number;
  items: { label: string; count: number; percent: number }[];
};

export type Analysis = {
  headers: string[];
  columns: ColumnInfo[];
  responses: number;
  ratings: RatingStat[];
  categoricals: CategoryStat[];
  textColumns: ColumnInfo[];
  timestampColumn?: ColumnInfo;
  overall: { mean: number; percent: number; sd: number; scaleMax: number } | null;
  groups: {
    experience: RatingStat[];
    learning: RatingStat[];
    satisfaction: RatingStat[];
  };
  learningImpactScore: number | null;
  experienceScore: number | null;
  nps: { score: number; promoters: number; passives: number; detractors: number } | null;
  futureParticipation: {
    header: string;
    yes: number;
    unsure: number;
    no: number;
    total: number;
    percentYes: number;
  } | null;
  futureActivities: CategoryStat | null;
  successScore: { score: number; label: string; parts: { label: string; value: number }[] } | null;
  timeline: { date: string; count: number; mean: number | null }[];
  keywords: { word: string; count: number }[];
  openAnswers: { header: string; text: string }[];
  matrix: { label: string; satisfaction: number; importance: number; quadrant: string }[];
};

const TS_RE = /timestamp|ประทับเวลา|เวลา|วันที่|date|เวลาที่ตอบ/i;
const EXPERIENCE_RE =
  /สถานที่|ต้อนรับ|ลงทะเบียน|เวลา|ระยะเวลา|กำหนดการ|พิธี|บรรยากาศ|อาหาร|สิ่งอำนวย|สะดวก|เจ้าหน้าที่|วิทยากร|ประชาสัมพันธ์|จัดกิจกรรม|นิทรรศการ|โสตทัศน|เสียง/i;
const LEARNING_RE =
  /ความรู้|เข้าใจ|เรียนรู้|นำไปใช้|ประโยชน์|ต่อยอด|ครั่ง|แรงบันดาลใจ|ทักษะ|เนื้อหา|สาระ/i;
const NPS_RE = /แนะนำ|บอกต่อ|เชิญชวน|recommend|nps/i;
const FUTURE_RE = /อนาคต|ครั้งต่อไป|ครั้งหน้า|เข้าร่วมอีก|สนใจเข้าร่วม|future/i;
const FUTURE_ACT_RE = /กิจกรรมที่ต้องการ|ประเภทกิจกรรม|หลักสูตร|อบรม|workshop|กิจกรรมใด/i;

const THAI_STOP = new Set(
  `และ ที่ ของ ใน การ เป็น มี ให้ ได้ ไม่ ก็ กับ จะ ว่า ความ อยาก ควร แต่ หรือ นี้ นั้น จาก โดย เพื่อ มาก ดี ครับ ค่ะ คะ นะ อย่าง ทำ ถ้า แล้ว เมื่อ ซึ่ง ต้อง ทุก ต่อ ยัง เรา ฉัน ผม การจัด งาน มัน คือ ขอ ขอบคุณ อื่น ๆ ไป มา อยู่ ต่างๆ ต่าง the and for with this that have very good was are you`
    .split(/\s+/)
    .filter(Boolean),
);

const toNumber = (v: string): number | null => {
  const m = v.replace(/[^\d.,-]/g, "").replace(/,/g, "");
  if (!m || !/\d/.test(m)) return null;
  const n = Number(m);
  return Number.isFinite(n) ? n : null;
};

const parseDate = (v: string): Date | null => {
  if (!v) return null;
  const iso = Date.parse(v);
  if (!Number.isNaN(iso)) return new Date(iso);
  const m = v.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);
  if (m) {
    let year = Number(m[3]);
    if (year > 2400) year -= 543;
    return new Date(year, Number(m[2]) - 1, Number(m[1]));
  }
  return null;
};

function mean(list: number[]) {
  return list.length ? list.reduce((a, b) => a + b, 0) / list.length : 0;
}

function sd(list: number[]) {
  if (list.length < 2) return 0;
  const m = mean(list);
  return Math.sqrt(list.reduce((a, b) => a + (b - m) ** 2, 0) / (list.length - 1));
}

function pearson(a: number[], b: number[]) {
  const n = Math.min(a.length, b.length);
  if (n < 3) return 0;
  const ma = mean(a.slice(0, n));
  const mb = mean(b.slice(0, n));
  let num = 0;
  let da = 0;
  let db = 0;
  for (let i = 0; i < n; i++) {
    const x = (a[i] ?? 0) - ma;
    const y = (b[i] ?? 0) - mb;
    num += x * y;
    da += x * x;
    db += y * y;
  }
  if (!da || !db) return 0;
  return num / Math.sqrt(da * db);
}

export function parseDateValue(v: string) {
  return parseDate(v);
}

export function detectColumns(headers: string[], rows: string[][]): ColumnInfo[] {
  return headers.map((header, index) => {
    const values = rows.map((r) => r[index] ?? "").filter((v) => v.length > 0);
    const answered = values.length;
    const uniq = new Set(values);
    const nums = values.map(toNumber).filter((n): n is number => n !== null);
    const numericRatio = answered ? nums.length / answered : 0;
    const avgLen = answered ? mean(values.map((v) => v.length)) : 0;
    const dates = values.slice(0, 30).map(parseDate).filter(Boolean).length;

    if (TS_RE.test(header) && dates >= Math.min(3, values.length)) {
      return { index, header, kind: "timestamp", answered, uniqueValues: uniq.size };
    }

    if (answered >= 2 && numericRatio >= 0.7) {
      const max = Math.max(...nums);
      const min = Math.min(...nums);
      const distinct = new Set(nums).size;
      if (min >= 0 && max <= 10 && distinct <= 11) {
        const scaleMax = max <= 5 ? 5 : 10;
        return { index, header, kind: "rating", answered, uniqueValues: uniq.size, scaleMax };
      }
    }

    if (answered && avgLen >= 25 && uniq.size / answered > 0.6) {
      return { index, header, kind: "text", answered, uniqueValues: uniq.size };
    }

    if (answered && uniq.size >= 1 && uniq.size <= Math.max(15, answered * 0.5) && avgLen < 60) {
      return { index, header, kind: "categorical", answered, uniqueValues: uniq.size };
    }

    if (answered && avgLen >= 15) {
      return { index, header, kind: "text", answered, uniqueValues: uniq.size };
    }

    return { index, header, kind: "other", answered, uniqueValues: uniq.size };
  });
}

function classifyYesNo(value: string): "yes" | "unsure" | "no" | null {
  const v = value.trim();
  if (!v) return null;
  if (/ไม่แน่ใจ|อาจ|maybe|unsure|ยังไม่/i.test(v)) return "unsure";
  if (/^ไม่|ไม่ต้องการ|ไม่สนใจ|ไม่เข้าร่วม|no\b/i.test(v)) return "no";
  if (/ต้องการ|สนใจ|ใช่|แน่นอน|เข้าร่วม|yes|มาก/i.test(v)) return "yes";
  return "unsure";
}

function scoreLabel(score: number) {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Very Good";
  if (score >= 70) return "Good";
  return "Needs Improvement";
}

export function analyse(headers: string[], rows: string[][], columns: ColumnInfo[]): Analysis {
  const ratingCols = columns.filter((c) => c.kind === "rating");
  const catCols = columns.filter((c) => c.kind === "categorical");
  const textCols = columns.filter((c) => c.kind === "text");
  const timestampColumn = columns.find((c) => c.kind === "timestamp");

  // per respondent overall (for importance correlation)
  const respondentMeans = rows.map((r) => {
    const vals = ratingCols
      .map((c) => {
        const n = toNumber(r[c.index] ?? "");
        return n === null ? null : (n / (c.scaleMax ?? 5)) * 5;
      })
      .filter((n): n is number => n !== null);
    return vals.length ? mean(vals) : null;
  });

  const ratings: RatingStat[] = ratingCols.map((c) => {
    const pairs: { v: number; overall: number | null }[] = rows.map((r, i) => ({
      v: toNumber(r[c.index] ?? "") ?? NaN,
      overall: respondentMeans[i] ?? null,
    }));
    const valid = pairs.filter((p) => Number.isFinite(p.v));
    const values = valid.map((p) => p.v);
    const scaleMax = c.scaleMax ?? 5;
    const distMap = new Map<number, number>();
    values.forEach((v) => distMap.set(v, (distMap.get(v) ?? 0) + 1));
    const withOverall = valid.filter((p) => p.overall !== null);
    const corr = pearson(
      withOverall.map((p) => p.v),
      withOverall.map((p) => p.overall as number),
    );
    return {
      header: c.header,
      index: c.index,
      n: values.length,
      mean: values.length ? mean(values) : 0,
      sd: sd(values),
      scaleMax,
      percent: values.length ? (mean(values) / scaleMax) * 100 : 0,
      distribution: Array.from(distMap.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([value, count]) => ({ value, count })),
      importance: Math.max(0, corr),
    };
  });

  const categoricals: CategoryStat[] = catCols.map((c) => {
    const counts = new Map<string, number>();
    rows.forEach((r) => {
      const raw = (r[c.index] ?? "").trim();
      if (!raw) return;
      raw
        .split(/\s*[,;|]\s*/)
        .filter(Boolean)
        .forEach((part) => counts.set(part, (counts.get(part) ?? 0) + 1));
    });
    const total = Array.from(counts.values()).reduce((a, b) => a + b, 0);
    return {
      header: c.header,
      index: c.index,
      total,
      items: Array.from(counts.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([label, count]) => ({
          label,
          count,
          percent: total ? (count / total) * 100 : 0,
        })),
    };
  });

  const npsCol = ratings.find((r) => NPS_RE.test(r.header) && r.scaleMax === 10);
  let nps: Analysis["nps"] = null;
  if (npsCol) {
    let promoters = 0;
    let passives = 0;
    let detractors = 0;
    rows.forEach((r) => {
      const v = toNumber(r[npsCol.index] ?? "");
      if (v === null) return;
      if (v >= 9) promoters++;
      else if (v >= 7) passives++;
      else detractors++;
    });
    const total = promoters + passives + detractors;
    nps = total
      ? {
          score: Math.round(((promoters - detractors) / total) * 100),
          promoters,
          passives,
          detractors,
        }
      : null;
  }

  const experience = ratings.filter((r) => EXPERIENCE_RE.test(r.header) && r !== npsCol);
  const learning = ratings.filter(
    (r) => LEARNING_RE.test(r.header) && !experience.includes(r) && r !== npsCol,
  );
  const satisfaction = ratings.filter((r) => r !== npsCol);

  const overallList = satisfaction.filter((r) => r.n > 0);
  const overall = overallList.length
    ? {
        mean: mean(overallList.map((r) => (r.mean / r.scaleMax) * 5)),
        percent: mean(overallList.map((r) => r.percent)),
        sd: mean(overallList.map((r) => r.sd)),
        scaleMax: 5,
      }
    : null;

  const learningImpactScore = learning.length ? mean(learning.map((r) => r.percent)) : null;
  const experienceScore = experience.length ? mean(experience.map((r) => r.percent)) : null;

  // Future participation
  const futureCol = catCols.find((c) => FUTURE_RE.test(c.header) && !FUTURE_ACT_RE.test(c.header));
  let futureParticipation: Analysis["futureParticipation"] = null;
  if (futureCol) {
    let yes = 0;
    let unsure = 0;
    let no = 0;
    rows.forEach((r) => {
      const k = classifyYesNo(r[futureCol.index] ?? "");
      if (k === "yes") yes++;
      else if (k === "unsure") unsure++;
      else if (k === "no") no++;
    });
    const total = yes + unsure + no;
    if (total)
      futureParticipation = {
        header: futureCol.header,
        yes,
        unsure,
        no,
        total,
        percentYes: (yes / total) * 100,
      };
  } else {
    const futureRating = ratings.find((r) => FUTURE_RE.test(r.header));
    if (futureRating && futureRating.n) {
      futureParticipation = {
        header: futureRating.header,
        yes: 0,
        unsure: 0,
        no: 0,
        total: futureRating.n,
        percentYes: futureRating.percent,
      };
    }
  }

  const futureActivities =
    categoricals.find((c) => FUTURE_ACT_RE.test(c.header)) ?? null;

  // Success score
  const parts: { label: string; value: number }[] = [];
  if (overall) parts.push({ label: "Overall Satisfaction", value: overall.percent });
  if (experienceScore !== null) parts.push({ label: "Event Experience", value: experienceScore });
  if (learningImpactScore !== null)
    parts.push({ label: "Learning Impact", value: learningImpactScore });
  if (futureParticipation)
    parts.push({ label: "Future Interest", value: futureParticipation.percentYes });
  if (nps) parts.push({ label: "Recommendation (NPS)", value: (nps.score + 100) / 2 });
  const successScore = parts.length
    ? {
        score: mean(parts.map((p) => p.value)),
        label: scoreLabel(mean(parts.map((p) => p.value))),
        parts,
      }
    : null;

  // Timeline
  let timeline: Analysis["timeline"] = [];
  if (timestampColumn) {
    const buckets = new Map<string, { count: number; scores: number[] }>();
    rows.forEach((r, i) => {
      const d = parseDate(r[timestampColumn.index] ?? "");
      if (!d) return;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate(),
      ).padStart(2, "0")}`;
      const b = buckets.get(key) ?? { count: 0, scores: [] };
      b.count += 1;
      const m = respondentMeans[i];
      if (m !== null && m !== undefined) b.scores.push(m);
      buckets.set(key, b);
    });
    timeline = Array.from(buckets.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, b]) => ({
        date,
        count: b.count,
        mean: b.scores.length ? Number(mean(b.scores).toFixed(2)) : null,
      }));
  }

  // Open text + keywords
  const openAnswers: { header: string; text: string }[] = [];
  textCols.forEach((c) => {
    rows.forEach((r) => {
      const t = (r[c.index] ?? "").trim();
      if (t.length >= 2) openAnswers.push({ header: c.header, text: t });
    });
  });

  const wordCount = new Map<string, number>();
  openAnswers.forEach(({ text }) => {
    text
      .split(/[\s,.;:!?()"'\-–—/\n\r]+/)
      .map((w) => w.trim())
      .filter((w) => w.length >= 3 && !THAI_STOP.has(w) && !/^\d+$/.test(w))
      .forEach((w) => wordCount.set(w, (wordCount.get(w) ?? 0) + 1));
  });
  const keywords = Array.from(wordCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 40)
    .map(([word, count]) => ({ word, count }));

  // Improvement matrix
  const matrixSource = satisfaction.filter((r) => r.n > 0);
  const satSorted = [...matrixSource.map((r) => r.percent)].sort((a, b) => a - b);
  const impSorted = [...matrixSource.map((r) => r.importance)].sort((a, b) => a - b);
  const satMedian = satSorted[Math.floor(satSorted.length / 2)] ?? 0;
  const impMedian = impSorted[Math.floor(impSorted.length / 2)] ?? 0;
  const matrix = matrixSource.map((r) => {
    const highSat = r.percent >= satMedian;
    const highImp = r.importance >= impMedian;
    const quadrant = highSat && highImp ? "KEEP" : highSat ? "PROMOTE" : highImp ? "PRIORITY" : "IMPROVE";
    return {
      label: r.header,
      satisfaction: Number(r.percent.toFixed(1)),
      importance: Number((r.importance * 100).toFixed(1)),
      quadrant,
    };
  });

  return {
    headers,
    columns,
    responses: rows.length,
    ratings,
    categoricals,
    textColumns: textCols,
    ...(timestampColumn ? { timestampColumn } : {}),
    overall,
    groups: { experience, learning, satisfaction },
    learningImpactScore,
    experienceScore,
    nps,
    futureParticipation,
    futureActivities,
    successScore,
    timeline,
    keywords,
    openAnswers,
    matrix,
  };
}

export function shortLabel(header: string, max = 46) {
  const cleaned = header
    .replace(/^\d+[.)]\s*/, "")
    .replace(/\(.*?\)/g, "")
    .replace(/ระดับความพึงพอใจ|ความพึงพอใจต่อ|ความคิดเห็นต่อ/g, "")
    .trim();
  const base = cleaned.length ? cleaned : header;
  return base.length > max ? `${base.slice(0, max)}…` : base;
}

export function ratingColor(mean5: number) {
  if (mean5 >= 4.5) return "var(--color-good)";
  if (mean5 >= 4.0) return "var(--color-warn)";
  return "var(--color-bad)";
}

export function toMean5(stat: { mean: number; scaleMax: number }) {
  return (stat.mean / stat.scaleMax) * 5;
}
