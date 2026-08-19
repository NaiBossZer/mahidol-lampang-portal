import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const isAuth = sessionStorage.getItem("dashboard_auth") === "true";
      if (!isAuth) {
        throw redirect({ to: "/login" });
      }
    }
  },
  component: DashboardPage,
});

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxIXYFkonDlYf8sb1VqTDoJXlsZ58Pd53qYSP-rxeLc-9_hiHA4kKIUVAUEM-IdcrLIkQ/exec";

interface SurveyResponse {
  timestamp?: string;
  ageGroup?: string;
  affiliation?: string;
  everJoined?: string;
  channels?: string;
  p2_location?: number | string;
  p2_schedule?: number | string;
  p2_readiness?: number | string;
  p2_reception?: number | string;
  p2_overall?: number | string;
  p3_interest?: number | string;
  p3_content?: number | string;
  p3_clarity?: number | string;
  p3_benefit?: number | string;
  p3_application?: number | string;
  p4_knowledge?: number | string;
  p4_inspiration?: number | string;
  p4_communityResource?: number | string;
  p4_futureReturn?: number | string;
  feedback?: string;
}

const QUESTION_MAP: Record<keyof SurveyResponse, { title: string; category: string }> = {
  p2_location: { title: "ความเหมาะสมของสถานที่", category: "การจัดงาน" },
  p2_schedule: { title: "ความเหมาะสมของระยะเวลา", category: "การจัดงาน" },
  p2_readiness: { title: "ความพร้อมของอุปกรณ์/สื่อ", category: "การจัดงาน" },
  p2_reception: { title: "การต้อนรับและการอำนวยความสะดวก", category: "การจัดงาน" },
  p2_overall: { title: "ภาพรวมการจัดกิจกรรม", category: "การจัดงาน" },
  p3_interest: { title: "ความน่าสนใจของเนื้อหา", category: "เนื้อหา/การเรียนรู้" },
  p3_content: { title: "ความสมบูรณ์ครบถ้วนของเนื้อหา", category: "เนื้อหา/การเรียนรู้" },
  p3_clarity: { title: "ความชัดเจนในการถ่ายทอด", category: "เนื้อหา/การเรียนรู้" },
  p3_benefit: { title: "ประโยชน์ที่ได้รับ", category: "เนื้อหา/การเรียนรู้" },
  p3_application: { title: "การนำไปประยุกต์ใช้", category: "เนื้อหา/การเรียนรู้" },
  p4_knowledge: { title: "ความรู้ความเข้าใจที่เพิ่มขึ้น", category: "ผลกระทบ" },
  p4_inspiration: { title: "แรงบันดาลใจในการต่อยอด", category: "ผลกระทบ" },
  p4_communityResource: { title: "การเป็นแหล่งเรียนรู้ของชุมชน", category: "ผลกระทบ" },
  p4_futureReturn: { title: "ความสนใจเข้าร่วมอีกในอนาคต", category: "ผลกระทบ" },
  timestamp: { title: "", category: "" },
  ageGroup: { title: "", category: "" },
  affiliation: { title: "", category: "" },
  everJoined: { title: "", category: "" },
  channels: { title: "", category: "" },
  feedback: { title: "", category: "" },
};

const COLOR_PALETTE = ["#0284c7", "#6366f1", "#a855f7", "#ec4899", "#f97316", "#10b981", "#f59e0b"];

const MONTH_NAMES = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];

export function DashboardPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [selectedYear, setSelectedYear] = useState<string>("ALL");
  const [selectedMonth, setSelectedMonth] = useState<string>("ALL");
  const [selectedAge, setSelectedAge] = useState<string>("ALL");
  const [selectedAffiliation, setSelectedAffiliation] = useState<string>("ALL");

  useEffect(() => {
    const isAuth = sessionStorage.getItem("dashboard_auth") === "true";
    if (!isAuth) {
      navigate({ to: "/login" });
      return;
    }
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate({ to: "/login", replace: true });
  };

  const handleResetFilter = () => {
    setSelectedYear("ALL");
    setSelectedMonth("ALL");
    setSelectedAge("ALL");
    setSelectedAffiliation("ALL");
  };

  const fetchData = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch(GOOGLE_SCRIPT_URL, { method: "GET", redirect: "follow" });
      if (!res.ok) throw new Error("ไม่สามารถเชื่อมต่อกับ Google Apps Script ได้");
      const json = await res.json();

      if (Array.isArray(json)) {
        const validData = json.filter((item: any) => {
          if (!item || typeof item !== "object") return false;
          return Object.values(item).some(
            (val) => val !== null && val !== undefined && String(val).trim() !== ""
          );
        });
        setData(validData);
      } else {
        setData([]);
      }

      const now = new Date();
      setLastUpdated(
        `${now.getDate()} ส.ค. ${now.getFullYear() + 543} ${now
          .getHours()
          .toString()
          .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
      );
    } catch (err: any) {
      console.error("Error fetching dashboard data:", err);
      setErrorMsg("ไม่สามารถดึงข้อมูลได้ในขณะนี้ กรุณากด Refresh อีกครั้ง");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const parseNum = (val: any): number => {
    const n = Number(val);
    return isNaN(n) ? 0 : n;
  };

  const availableYears = useMemo(() => {
    const yearSet = new Set<string>();
    data.forEach((item) => {
      if (item.timestamp) {
        const d = new Date(item.timestamp);
        if (!isNaN(d.getTime())) {
          yearSet.add(d.getFullYear().toString());
        }
      }
    });
    return Array.from(yearSet).sort((a, b) => Number(b) - Number(a));
  }, [data]);

  const availableMonths = useMemo(() => {
    const monthSet = new Set<number>();
    data.forEach((item) => {
      if (item.timestamp) {
        const d = new Date(item.timestamp);
        if (!isNaN(d.getTime())) {
          if (selectedYear === "ALL" || d.getFullYear().toString() === selectedYear) {
            monthSet.add(d.getMonth());
          }
        }
      }
    });
    return Array.from(monthSet).sort((a, b) => a - b);
  }, [data, selectedYear]);

  const ageGroupList = useMemo(() => {
    const set = new Set<string>();
    data.forEach((item) => {
      if (item.ageGroup?.trim()) set.add(item.ageGroup.trim());
    });
    return Array.from(set);
  }, [data]);

  const affiliationsList = useMemo(() => {
    const set = new Set<string>();
    data.forEach((item) => set.add(item.affiliation?.trim() || "ไม่ระบุ"));
    return Array.from(set);
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (item.timestamp) {
        const itemDate = new Date(item.timestamp);
        if (!isNaN(itemDate.getTime())) {
          if (selectedYear !== "ALL" && itemDate.getFullYear().toString() !== selectedYear) {
            return false;
          }
          if (selectedMonth !== "ALL" && itemDate.getMonth().toString() !== selectedMonth) {
            return false;
          }
        }
      }

      if (selectedAge !== "ALL") {
        const itemAge = item.ageGroup?.trim() || "";
        if (itemAge !== selectedAge) return false;
      }

      if (selectedAffiliation !== "ALL") {
        const itemAff = item.affiliation?.trim() || "ไม่ระบุ";
        if (itemAff !== selectedAffiliation) return false;
      }

      return true;
    });
  }, [data, selectedYear, selectedMonth, selectedAge, selectedAffiliation]);

  const itemScores = useMemo(() => {
    const keys = Object.keys(QUESTION_MAP).filter(
      (k) => QUESTION_MAP[k as keyof SurveyResponse].title !== ""
    ) as (keyof SurveyResponse)[];

    return keys.map((key) => {
      let sum = 0;
      let count = 0;
      filteredData.forEach((item) => {
        const val = parseNum(item[key]);
        if (val > 0) {
          sum += val;
          count++;
        }
      });
      const avg = count > 0 ? parseFloat((sum / count).toFixed(2)) : 0;
      return {
        key,
        title: QUESTION_MAP[key].title,
        category: QUESTION_MAP[key].category,
        avg,
      };
    });
  }, [filteredData]);

  // จัดกลุ่มคะแนนตามหมวดหมู่ + เรียงลำดับจากคะแนนมากที่สุดไปน้อยที่สุด (Descending Order)
  const categoryGroupedScores = useMemo(() => {
    const groups: Record<string, { category: string; avg: number; items: typeof itemScores }> = {};

    itemScores.forEach((item) => {
      if (!groups[item.category]) {
        groups[item.category] = { category: item.category, avg: 0, items: [] };
      }
      groups[item.category].items.push(item);
    });

    const resultList = Object.values(groups).map((group) => {
      const total = group.items.reduce((sum, i) => sum + i.avg, 0);
      const avg = group.items.length > 0 ? parseFloat((total / group.items.length).toFixed(2)) : 0;
      
      // เรียงหัวข้อย่อยภายในหมวดหมู่จากคะแนนมากไปน้อย
      const sortedItems = [...group.items].sort((a, b) => b.avg - a.avg);

      return {
        ...group,
        avg,
        items: sortedItems,
      };
    });

    // เรียงหมวดหมู่ใหญ่จากคะแนนเฉลี่ยมากไปน้อย
    return resultList.sort((a, b) => b.avg - a.avg);
  }, [itemScores]);

  const cardMetrics = useMemo(() => {
    if (itemScores.length === 0 || filteredData.length === 0) return null;

    const sorted = [...itemScores].sort((a, b) => b.avg - a.avg);
    const highest = sorted[0];
    const lowest = sorted[sorted.length - 1];

    const rawGrandAvg = itemScores.reduce((acc, curr) => acc + curr.avg, 0) / itemScores.length;
    const grandAvgPercent = Math.round((rawGrandAvg / 5) * 100);

    return {
      highest,
      lowest,
      grandAvgPercent,
      totalQuestions: itemScores.length,
    };
  }, [itemScores, filteredData]);

  const affiliationBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredData.forEach((item) => {
      const key = item.affiliation?.trim() || "ไม่ระบุ";
      counts[key] = (counts[key] || 0) + 1;
    });
    const total = filteredData.length || 1;
    return Object.entries(counts).map(([name, count], idx) => ({
      name,
      count,
      percent: parseFloat(((count / total) * 100).toFixed(1)),
      color: COLOR_PALETTE[idx % COLOR_PALETTE.length],
    }));
  }, [filteredData]);

  const feedbackAnalysis = useMemo(() => {
    const rawFeedbacks = filteredData
      .filter((d) => d.feedback && d.feedback.trim() !== "")
      .map((d) => ({
        text: d.feedback!.trim(),
        affiliation: d.affiliation || "ไม่ระบุ",
        timestamp: d.timestamp || "N/A",
      }));

    let positiveCount = 0;
    let followUpCount = 0;
    let urgentCount = 0;
    let generalCount = 0;

    const topicCounts: Record<string, number> = {
      "การให้บริการ": 0,
      "กิจกรรม/การเรียนรู้": 0,
      "สิ่งแวดล้อม/สถานที่": 0,
      "อุปกรณ์/สื่อ": 0,
    };

    const parsedList = rawFeedbacks.map((item) => {
      const t = item.text.toLowerCase();
      let status: "positive" | "followup" | "urgent" | "general" = "positive";
      let tag = "ทั่วไป";

      if (t.includes("ด่วน") || t.includes("ปรับปรุง") || t.includes("แย่") || t.includes("เสีย") || t.includes("ช้า")) {
        status = "urgent";
        urgentCount++;
      } else if (t.includes("ควร") || t.includes("อยากให้") || t.includes("ติดตาม") || t.includes("เพิ่ม")) {
        status = "followup";
        followUpCount++;
      } else if (t.includes("ดี") || t.includes("ประทับใจ") || t.includes("ชอบ") || t.includes("เยี่ยม") || t.includes("ขอบคุณ")) {
        status = "positive";
        positiveCount++;
      } else {
        status = "general";
        generalCount++;
      }

      if (t.includes("บริการ") || t.includes("พนักงาน") || t.includes("ต้อนรับ") || t.includes("เจ้าหน้าที่")) {
        tag = "การให้บริการ";
        topicCounts["การให้บริการ"]++;
      } else if (t.includes("จอดรถ") || t.includes("สถานที่") || t.includes("ห้อง") || t.includes("แอร์") || t.includes("สะอาด")) {
        tag = "สิ่งแวดล้อม/สถานที่";
        topicCounts["สิ่งแวดล้อม/สถานที่"]++;
      } else if (t.includes("อุปกรณ์") || t.includes("สื่อ") || t.includes("ไมค์") || t.includes("สไลด์")) {
        tag = "อุปกรณ์/สื่อ";
        topicCounts["อุปกรณ์/สื่อ"]++;
      } else {
        tag = "กิจกรรม/การเรียนรู้";
        topicCounts["กิจกรรม/การเรียนรู้"]++;
      }

      return {
        ...item,
        status,
        tag,
      };
    });

    const maxTopicCount = Math.max(...Object.values(topicCounts), 1);

    return {
      total: rawFeedbacks.length,
      positiveCount,
      followUpCount,
      urgentCount,
      generalCount,
      topicCounts,
      maxTopicCount,
      latestList: parsedList.slice(0, 5),
    };
  }, [filteredData]);

  const getScoreBadge = (score: number) => {
    if (score >= 4.5) return <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">🟢 ดีมากที่สุด</span>;
    if (score >= 3.5) return <span className="px-2 py-0.5 rounded text-[10px] bg-blue-100 text-blue-800 font-bold border border-blue-200">🔵 ดีมาก</span>;
    if (score >= 2.5) return <span className="px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 font-bold border border-amber-200">🟡 ปานกลาง</span>;
    return <span className="px-2 py-0.5 rounded text-[10px] bg-red-100 text-red-800 font-bold border border-red-200">🔴 ควรปรับปรุง</span>;
  };

  const renderPieChart = () => {
    if (affiliationBreakdown.length === 0) return null;

    let accumulatedPercent = 0;
    return (
      <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
          {affiliationBreakdown.map((item, idx) => {
            const strokeDasharray = `${item.percent} ${100 - item.percent}`;
            const strokeDashoffset = -accumulatedPercent;
            accumulatedPercent += item.percent;

            return (
              <circle
                key={idx}
                cx="18"
                cy="18"
                r="15.91549430918954"
                fill="transparent"
                stroke={item.color}
                strokeWidth="4.5"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300 hover:opacity-80 cursor-pointer"
              />
            );
          })}
        </svg>
        <div className="absolute text-center pointer-events-none">
          <p className="text-xl font-black text-amber-600 font-mono">{filteredData.length}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">คนทั้งหมด</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 sm:p-6 font-sans selection:bg-amber-100 selection:text-amber-900">
      <div className="max-w-7xl mx-auto space-y-5">
        
        {/* Top Navigation */}
        <div className="flex justify-between items-center text-xs text-slate-500">
          <Link to="/" className="hover:text-amber-600 transition-colors flex items-center gap-1 font-semibold">
            ← Back to home
          </Link>
          <span className="text-amber-700 font-semibold bg-amber-50 px-3 py-1 rounded-full border border-amber-200/80 shadow-sm">
            Viewing Fixed Google Sheets
          </span>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs text-center font-medium shadow-sm">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Header Banner */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-amber-50/50 border border-amber-200 flex items-center justify-center p-1.5 shadow-sm shrink-0 overflow-hidden">
              <img
                src="/Mahidol_U.jpg"
                alt="Mahidol Logo"
                className="w-full h-full object-contain rounded-full"
              />
            </div>

            <div>
              <p className="text-xs font-bold text-amber-600 tracking-wider uppercase">Mahidol University</p>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                พิธีเปิดห้องการเรียนรู้ครั่งครบวงจร
              </h1>
              <p className="text-xs text-slate-500 tracking-wider mt-0.5 font-medium">
                EXECUTIVE ANALYTICS & SATISFACTION INSIGHT
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end border-t border-slate-100 lg:border-t-0 pt-3 lg:pt-0">
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end">
                <span className={`w-2 h-2 rounded-full ${loading ? "bg-amber-500 animate-ping" : "bg-emerald-500"}`}></span>
                <span className={`text-xs font-bold ${loading ? "text-amber-600" : "text-emerald-600"}`}>
                  {loading ? "CONNECTING..." : "LIVE / CONNECTED"}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Last Updated: {lastUpdated || "กำลังโหลด..."}</p>
            </div>

            <button
              onClick={fetchData}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-sm active:scale-95"
            >
              🔄 Refresh
            </button>
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            >
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Multi-Filter Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3 text-xs">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-indigo-50 text-indigo-600 text-sm">🎛️</span>
              <span className="font-bold text-slate-800 text-sm">ปรับเลือกข้อมูลที่ต้องการดู</span>
              <span className="text-[11px] text-slate-400 hidden sm:inline">— เลือกตัวกรองได้หลายเงื่อนไขพร้อมกัน</span>
            </div>
            <button
              onClick={handleResetFilter}
              className="text-slate-500 hover:text-red-600 font-semibold flex items-center gap-1 text-xs transition-colors cursor-pointer bg-slate-50 hover:bg-red-50 px-2.5 py-1 rounded-lg border border-slate-200 hover:border-red-200"
            >
              ✕ ล้างตัวกรอง
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 shadow-sm focus-within:border-amber-500 transition-colors">
                <span className="text-amber-700 font-bold">📅 ปี:</span>
                <select
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(e.target.value);
                    setSelectedMonth("ALL");
                  }}
                  className="bg-transparent text-slate-800 outline-none cursor-pointer font-semibold text-xs"
                >
                  <option value="ALL">ทุกปี</option>
                  {availableYears.map((year) => (
                    <option key={year} value={year}>
                      พ.ศ. {Number(year) + 543} ({year})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 shadow-sm focus-within:border-amber-500 transition-colors">
                <span className="text-amber-700 font-bold">🗓️ เดือน:</span>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="bg-transparent text-slate-800 outline-none cursor-pointer font-semibold text-xs"
                >
                  <option value="ALL">ทุกเดือน</option>
                  {availableMonths.map((mIdx) => (
                    <option key={mIdx} value={mIdx.toString()}>
                      {MONTH_NAMES[mIdx]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 shadow-sm focus-within:border-amber-500 transition-colors">
                <span className="text-amber-700 font-bold">🎂 อายุ:</span>
                <select
                  value={selectedAge}
                  onChange={(e) => setSelectedAge(e.target.value)}
                  className="bg-transparent text-slate-800 outline-none cursor-pointer font-semibold text-xs"
                >
                  <option value="ALL">ทุกช่วงอายุ</option>
                  {ageGroupList.map((age) => (
                    <option key={age} value={age}>{age}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 shadow-sm focus-within:border-amber-500 transition-colors">
                <span className="text-amber-700 font-bold">📌 สังกัด:</span>
                <select
                  value={selectedAffiliation}
                  onChange={(e) => setSelectedAffiliation(e.target.value)}
                  className="bg-transparent text-slate-800 outline-none cursor-pointer font-semibold text-xs max-w-[150px] truncate"
                >
                  <option value="ALL">ทั้งหมด</option>
                  {affiliationsList.map((aff) => (
                    <option key={aff} value={aff}>{aff}</option>
                  ))}
                </select>
              </div>

            </div>

            <div className="flex items-center justify-end gap-1.5 bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 self-start md:self-auto font-medium">
              <span className="text-slate-500">แสดงผล:</span>
              <span className="text-amber-600 font-bold font-mono text-sm">{filteredData.length}</span>
              <span className="text-slate-400">/ {data.length} รายการ</span>
            </div>
          </div>
        </div>

        {/* Executive Summary Cards (ปรับเหลือ 4 CARD ตามต้องการ) */}
        {cardMetrics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* Card 1: จำนวนคนประเมิน */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-sm mb-2 font-bold">
                📋
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold">จำนวนคนประเมิน</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black text-slate-800 font-mono">{filteredData.length}</span>
                  <span className="text-xs text-slate-400 font-medium">คน</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 truncate">จากทั้งหมด {data.length} รายการ</p>
              </div>
            </div>

            {/* Card 2: คะแนนเฉลี่ยรวม คิดเป็นร้อยละ */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-sm mb-2 font-bold">
                ⭐
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold">คะแนนเฉลี่ยรวม</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black text-amber-600 font-mono">{cardMetrics.grandAvgPercent}%</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 truncate">คำนวณจาก {cardMetrics.totalQuestions} หัวข้อประเมิน</p>
              </div>
            </div>

            {/* Card 3: หมวดคะแนนสูงสุด คิดเต็ม 5 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-sm mb-2 font-bold">
                🏅
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold">หมวดคะแนนสูงสุด</p>
                <p className="text-xs font-bold text-slate-800 line-clamp-1 mt-1">{cardMetrics.highest.title}</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-xl font-black text-purple-600 font-mono">{cardMetrics.highest.avg.toFixed(2)}</span>
                  <span className="text-xs text-slate-400">/ 5</span>
                </div>
              </div>
            </div>

            {/* Card 4: หมวดที่ควรปรับปรุง คิดเต็ม 5 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-sm mb-2 font-bold">
                🛠️
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold">หมวดที่ควรปรับปรุง</p>
                <p className="text-xs font-bold text-slate-800 line-clamp-1 mt-1">{cardMetrics.lowest.title}</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-xl font-black text-rose-600 font-mono">{cardMetrics.lowest.avg.toFixed(2)}</span>
                  <span className="text-xs text-slate-400">/ 5</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Visual Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* คะแนนความพึงพอใจเรียงตามหมวดหมู่ (เรียงจากมากไปน้อย) */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h2 className="text-xs font-bold text-amber-700 tracking-wider uppercase border-b border-slate-100 pb-2.5 flex items-center gap-1.5">
              <span>📊</span> คะแนนความพึงพอใจแยกตามหมวดหมู่ (เรียงตามคะแนนสูงสุด-ต่ำสุด)
            </h2>
            
            <div className="space-y-5 max-h-[420px] overflow-y-auto pr-2">
              {categoryGroupedScores.map((catGroup, groupIdx) => (
                <div key={catGroup.category} className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 space-y-3">
                  
                  <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      <span className="font-bold text-slate-800 text-xs sm:text-sm">
                        ด้าน{catGroup.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white px-2.5 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                      <span className="text-[10px] text-slate-400 font-medium">เฉลี่ยหมวด:</span>
                      <span className="font-mono font-black text-amber-600 text-xs sm:text-sm">
                        {catGroup.avg.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 pl-1">
                    {catGroup.items.map((item, itemIdx) => {
                      const globalIdx = groupIdx * 3 + itemIdx;
                      return (
                        <div key={item.key} className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-700 truncate max-w-[65%] font-medium">
                              {item.title}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-slate-800">
                                {item.avg.toFixed(2)}
                              </span>
                              {getScoreBadge(item.avg)}
                            </div>
                          </div>
                          <div className="w-full bg-slate-200/70 h-2.5 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500 shadow-sm"
                              style={{
                                width: `${(item.avg / 5) * 100}%`,
                                backgroundColor: COLOR_PALETTE[globalIdx % COLOR_PALETTE.length],
                              }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h2 className="text-xs font-bold text-amber-700 tracking-wider uppercase border-b border-slate-100 pb-2.5">
              🍕 สัดส่วนผู้ตอบจำแนกตามหน่วยงาน
            </h2>
            
            {renderPieChart()}

            <div className="space-y-2 pt-2 border-t border-slate-100 max-h-[180px] overflow-y-auto pr-1">
              {affiliationBreakdown.map((item) => (
                <div key={item.name} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 truncate max-w-[70%]">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: item.color }}></span>
                    <span className="text-slate-700 truncate font-medium">{item.name}</span>
                  </div>
                  <span className="text-slate-500 font-mono shrink-0">{item.count} คน ({item.percent}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FEEDBACK & SUGGESTIONS SECTION */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5">
          
          <div className="flex justify-between items-start sm:items-center border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <span>💬</span> FEEDBACK & SUGGESTIONS
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">ภาพรวมความคิดเห็นและข้อเสนอแนะ</p>
            </div>
            <button className="text-xs text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1 cursor-pointer hover:underline">
              ดูทั้งหมด →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-3.5 text-center">
              <p className="text-2xl font-black text-blue-700 font-mono">{feedbackAnalysis.total}</p>
              <p className="text-xs font-bold text-blue-900 mt-0.5">🔵 ความคิดเห็น</p>
              <p className="text-[10px] text-blue-600/80 mt-0.5">รวมทุกหมวด</p>
            </div>

            <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-3.5 text-center">
              <p className="text-2xl font-black text-emerald-700 font-mono">{feedbackAnalysis.positiveCount}</p>
              <p className="text-xs font-bold text-emerald-900 mt-0.5">🟢 เชิงบวก / ปกติ</p>
              <p className="text-[10px] text-emerald-600/80 mt-0.5">ชื่นชมกิจกรรม</p>
            </div>

            <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-3.5 text-center">
              <p className="text-2xl font-black text-amber-700 font-mono">{feedbackAnalysis.followUpCount}</p>
              <p className="text-xs font-bold text-amber-900 mt-0.5">🟡 ควรติดตาม</p>
              <p className="text-[10px] text-amber-600/80 mt-0.5">ข้อเสนอแนะพัฒนา</p>
            </div>

            <div className="bg-rose-50/60 border border-rose-200/80 rounded-xl p-3.5 text-center">
              <p className="text-2xl font-black text-rose-700 font-mono">{feedbackAnalysis.urgentCount}</p>
              <p className="text-xs font-bold text-rose-900 mt-0.5">🔴 เร่งด่วน</p>
              <p className="text-[10px] text-rose-600/80 mt-0.5">ควรปรับปรุงทันที</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <div className="space-y-3 bg-slate-50/50 p-4 rounded-xl border border-slate-200/70">
              <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <span>🔎</span> ประเด็นสำคัญจำแนกตามเรื่อง
              </h3>
              
              <div className="space-y-3 pt-1">
                {Object.entries(feedbackAnalysis.topicCounts).map(([topic, count]) => {
                  const percent = Math.round((count / feedbackAnalysis.maxTopicCount) * 100);
                  return (
                    <div key={topic} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-medium text-slate-700">{topic}</span>
                        <span className="font-mono font-bold text-slate-900">{count} เรื่อง</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3 bg-slate-50/50 p-4 rounded-xl border border-slate-200/70">
              <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <span>🕐</span> ข้อเสนอแนะล่าสุด
              </h3>

              <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                {feedbackAnalysis.latestList.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">ไม่มีข้อเสนอแนะเพิ่มเติม</p>
                ) : (
                  feedbackAnalysis.latestList.map((item, idx) => {
                    const statusBadges = {
                      positive: { bg: "bg-emerald-100 text-emerald-800 border-emerald-200", text: "🟢 ปกติ/เชิงบวก" },
                      followup: { bg: "bg-amber-100 text-amber-800 border-amber-200", text: "🟡 ควรติดตาม" },
                      urgent: { bg: "bg-rose-100 text-rose-800 border-rose-200", text: "🔴 เร่งด่วน" },
                      general: { bg: "bg-blue-100 text-blue-800 border-blue-200", text: "🔵 ข้อมูลทั่วไป" },
                    };

                    const statusStyle = statusBadges[item.status];

                    return (
                      <div key={idx} className="bg-white border border-slate-200 rounded-lg p-2.5 text-xs space-y-1.5 shadow-2xs">
                        <p className="text-slate-800 font-medium leading-relaxed">"{item.text}"</p>
                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                            [{item.tag}]
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${statusStyle.bg}`}>
                            {statusStyle.text}
                          </span>
                          <span className="text-[10px] text-slate-400 ml-auto font-mono">
                            {item.affiliation}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
