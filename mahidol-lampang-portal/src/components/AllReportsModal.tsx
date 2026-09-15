import React, { useEffect, useMemo, useState } from 'react';
import { Activity } from '../types';
import { getAdminDashboardData, type AdminDashboardData } from '@/services/api';

interface AllReportsModalProps {
  isOpen: boolean;
  activities: Activity[];
  onSelectActivity: (id: string) => void;
  onClose: () => void;
}

interface ReportRow {
  id: string; name: string; code: string; codeColor: string; date: string;
  participants: number; respondents: number; responseRate: number | null; avgScore: number | null;
}

const SCORE_FIELDS = ['p2_location','p2_schedule','p2_readiness','p2_reception','p2_overall','p3_interest','p3_content','p3_clarity','p3_benefit','p3_application','p4_knowledge','p4_inspiration','p4_community_resource','p4_future_return'] as const;
const toScore = (value: unknown) => { const n = Number(value); return Number.isFinite(n) && n >= 1 && n <= 5 ? n : null; };

const getActivityRows = (data: AdminDashboardData): ReportRow[] => {
  const map = new Map<string, ReportRow>();
  const occurrenceToActivity = new Map<string, string>();
  for (const a of data.activities ?? []) map.set(a.id, { id:a.id, name:a.name || 'ไม่ระบุชื่อกิจกรรม', code:a.code || 'A', codeColor:'bg-sky-50 text-sky-700', date:'-', participants:0, respondents:0, responseRate:null, avgScore:null });
  for (const o of data.activity_occurrences ?? []) {
    if (!o.activity_id || !map.has(o.activity_id)) continue;
    occurrenceToActivity.set(o.id, o.activity_id);
    const status = String(o.status ?? '').toLowerCase();
    if (status === 'cancelled' || status === 'canceled' || status === 'archived') continue;
    const row = map.get(o.activity_id)!;
    row.participants += Number(o.participant_count ?? 0) || 0;
    const d = o.start_at || o.date || o.created_at;
    if (d && (row.date === '-' || String(d).slice(0,10) > row.date)) row.date = String(d).slice(0,10);
  }
  const totals = new Map<string,{total:number;count:number}>();
  for (const r of data.survey_responses ?? []) {
    const activityId = r.activity_id || occurrenceToActivity.get(r.occurrence_id);
    if (!activityId || !map.has(activityId)) continue;
    map.get(activityId)!.respondents += 1;
    const s = totals.get(activityId) ?? {total:0,count:0};
    for (const f of SCORE_FIELDS) { const n = toScore(r[f]); if (n !== null) { s.total += n; s.count += 1; } }
    totals.set(activityId,s);
  }
  return Array.from(map.values()).map(row => { const s=totals.get(row.id); return {...row, responseRate:row.participants>0 ? Math.min(100,row.respondents/row.participants*100) : null, avgScore:s && s.count ? s.total/s.count : null}; }).filter(r=>r.participants>0 || r.respondents>0).sort((a,b)=>b.date.localeCompare(a.date));
};

export const AllReportsModal: React.FC<AllReportsModalProps> = ({ isOpen, activities, onSelectActivity, onClose }) => {
  const [searchTerm,setSearchTerm] = useState('');
  const [reportRows,setReportRows] = useState<ReportRow[]>([]);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState<string|null>(null);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled=false;
    (async()=>{ setLoading(true); setError(null); try { const data=await getAdminDashboardData(); if(!cancelled) setReportRows(getActivityRows(data)); } catch(e) { console.error(e); if(!cancelled) setError('ไม่สามารถโหลดข้อมูลรายงานจากฐานข้อมูลได้'); } finally { if(!cancelled) setLoading(false); } })();
    return ()=>{cancelled=true;};
  },[isOpen]);

  if (!isOpen) return null;
  const rows = reportRows.length ? reportRows : activities.map(a=>({id:a.id,name:a.name,code:a.code,codeColor:a.codeColor,date:a.date,participants:a.participants,respondents:a.respondents,responseRate:a.responseRate,avgScore:a.avgScore}));
  const filtered = useMemo(()=>rows.filter(a=>a.name.toLowerCase().includes(searchTerm.toLowerCase())),[rows,searchTerm]);
  const csvEscape=(v:unknown)=>`"${String(v ?? '').replace(/"/g,'""')}"`;
  const handleExportCSV=()=>{ const headers=['กิจกรรม','วันที่','ผู้เข้าร่วม','ผู้ตอบ','อัตราตอบกลับ','คะแนนเฉลี่ย']; const data=rows.map(a=>[csvEscape(a.name),csvEscape(a.date),a.participants,a.respondents,csvEscape(a.responseRate===null?'-':`${a.responseRate.toFixed(2)}%`),csvEscape(a.avgScore===null?'-':a.avgScore.toFixed(2))]); const content='data:text/csv;charset=utf-8,\uFEFF'+[headers.join(','),...data.map(r=>r.join(','))].join('\n'); const link=document.createElement('a'); link.href=encodeURI(content); link.download='Mahidol_Lampang_Executive_Report_2568.csv'; document.body.appendChild(link); link.click(); document.body.removeChild(link); };

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
    <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden text-slate-800">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70"><div><div className="flex items-center gap-2"><span className="material-symbols-outlined text-sky-600 text-[22px]">summarize</span><h2 className="text-[17px] font-bold text-slate-900">รายงานผลสัมฤทธิ์รวมทุกกิจกรรม (Executive Summary)</h2></div><p className="text-[12px] text-slate-500 mt-0.5">คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล วิทยาเขตลำปาง</p></div><button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/50"><span className="material-symbols-outlined text-[20px]">close</span></button></div>
      <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-white"><div className="relative w-full sm:w-72"><span className="material-symbols-outlined text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 text-[18px]">search</span><input type="text" placeholder="ค้นหากิจกรรม..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} className="w-full pl-9 pr-3 py-1.5 text-[12px] border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-600" /></div><div className="flex items-center gap-2"><button type="button" onClick={handleExportCSV} className="px-3 py-1.5 text-[12px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-lg flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">file_download</span><span>ส่งออก CSV</span></button><button type="button" onClick={()=>window.print()} className="px-3 py-1.5 text-[12px] font-medium text-sky-700 bg-sky-50 border border-sky-200 hover:bg-sky-100 rounded-lg flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">print</span><span>พิมพ์รายงาน</span></button></div></div>
      <div className="flex-1 overflow-y-auto p-5">{loading && <div className="py-10 text-center text-[12px] text-slate-500">กำลังโหลดข้อมูลรายกิจกรรม...</div>}{error && <div className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[12px] text-rose-700">{error}</div>}{!loading && <div className="rounded-xl border border-slate-200 overflow-hidden"><table className="w-full text-left text-[12px]"><thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold"><tr><th className="py-2.5 px-3">กิจกรรม</th><th className="py-2.5 px-3">วันที่จัด</th><th className="py-2.5 px-3 text-center">ผู้เข้าร่วม</th><th className="py-2.5 px-3 text-center">ผู้ตอบ</th><th className="py-2.5 px-3 text-center">Response Rate</th><th className="py-2.5 px-3 text-right">คะแนนเฉลี่ย</th><th className="py-2.5 px-3 text-center">การจัดการ</th></tr></thead><tbody className="divide-y divide-slate-100">{filtered.map(act=><tr key={act.id} className="hover:bg-sky-50/50"><td className="py-3 px-3 font-medium text-slate-900"><div className="flex items-center gap-2"><span className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${act.codeColor}`}>{act.code}</span><span>{act.name}</span></div></td><td className="py-3 px-3 text-slate-500 whitespace-nowrap">{act.date}</td><td className="py-3 px-3 text-center">{act.participants} คน</td><td className="py-3 px-3 text-center font-semibold">{act.respondents} คน</td><td className="py-3 px-3 text-center"><span className="px-2 py-0.5 rounded-full text-[11px] bg-teal-50 text-teal-700 font-medium border border-teal-200">{act.responseRate===null?'-':`${act.responseRate.toFixed(2)}%`}</span></td><td className="py-3 px-3 text-right font-bold text-slate-900">{act.avgScore===null?'-':`${act.avgScore.toFixed(2)} / 5.00`}</td><td className="py-3 px-3 text-center"><button type="button" onClick={()=>{onSelectActivity(act.id);onClose();}} className="px-2.5 py-1 text-[11px] font-medium text-sky-700 hover:bg-sky-100 rounded-md">ดูแดชบอร์ด</button></td></tr>)}{filtered.length===0 && <tr><td colSpan={7} className="py-10 text-center text-slate-400">ไม่พบกิจกรรม</td></tr>}</tbody></table></div>}</div>
      <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 bg-slate-50/50"><span>รวมกิจกรรมทั้งหมด: {rows.length} รายการ</span><button type="button" onClick={onClose} className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-medium">ปิดหน้าต่าง</button></div>
    </div>
  </div>;
};