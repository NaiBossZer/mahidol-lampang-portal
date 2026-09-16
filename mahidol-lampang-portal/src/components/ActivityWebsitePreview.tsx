import React, { useState } from 'react';
import { AdminActivityItem, ActivityReport } from '../types';
import { PublishConfirmModal } from './PublishConfirmModal';

interface ActivityWebsitePreviewProps {
  activity: AdminActivityItem;
  report: ActivityReport;
  onPublishConfirmed: () => void;
  onBackToEdit: () => void;
}

export const ActivityWebsitePreview: React.FC<ActivityWebsitePreviewProps> = ({
  activity,
  report,
  onPublishConfirmed,
  onBackToEdit,
}) => {
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [copiedLink, setCopiedLink] = useState(false);

  const isAlreadyPublished = activity.status === 'published';
  const coverUrl =
    report.coverImage ||
    activity.photos?.find((p) => p.isCover)?.url ||
    activity.photos?.[0]?.url;

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://portal.lampang.mahidol.ac.th/news/' + activity.code.toLowerCase());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Top Admin Verification Action Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isAlreadyPublished
                ? 'bg-emerald-600 text-white'
                : 'bg-[#0c2340] text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">
              {isAlreadyPublished ? 'verified' : 'rate_review'}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-bold text-slate-900">
                {isAlreadyPublished
                  ? 'ข่าวกิจกรรมได้รับการเผยแพร่บนเว็บไซต์แล้ว (Published)'
                  : 'ขั้นตอนที่ 9: ADMIN ตรวจสอบเนื้อหาก่อนเผยแพร่'}
              </span>
              <span
                className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full border ${
                  isAlreadyPublished
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-sky-100 text-sky-800 border-sky-300'
                }`}
              >
                {isAlreadyPublished ? '● เผยแพร่แล้ว (Live)' : '● พร้อมเผยแพร่ (Ready)'}
              </span>
            </div>

            <p className="text-[11.5px] text-slate-500 mt-0.5">
              {isAlreadyPublished
                ? `เผยแพร่เมื่อ ${activity.publishedAt || '15 ก.ย. 2568'} • บุคคลทั่วไปสามารถเข้าชมได้ผ่านหน้าเว็บมหาวิทยาลัย`
                : 'ตรวจสอบความถูกต้องของหัวข้อ เนื้อหา รูปภาพ และผลการดำเนินงานในรูปแบบหน้าเว็บไซต์จริง'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Device viewport toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-slate-600">
            <button
              type="button"
              onClick={() => setPreviewDevice('desktop')}
              className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                previewDevice === 'desktop' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-500'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">desktop_windows</span>
              <span>Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice('mobile')}
              className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                previewDevice === 'mobile' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-500'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">smartphone</span>
              <span>Mobile</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onBackToEdit}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium rounded-lg text-[12px] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">edit</span>
            <span>แก้ไขเนื้อหา</span>
          </button>

          {!isAlreadyPublished ? (
            <button
              type="button"
              onClick={() => setPublishModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[12px] flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">rocket_launch</span>
              <span>เผยแพร่เว็บไซต์ (Publish)</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-medium rounded-lg text-[12px] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">
                {copiedLink ? 'done' : 'link'}
              </span>
              <span>{copiedLink ? 'คัดลอกลิงก์แล้ว' : 'คัดลอกลิงก์ข่าว'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Website Frame Container */}
      <div className="flex justify-center">
        <div
          className={`w-full transition-all duration-300 bg-white rounded-2xl border border-slate-300 shadow-md overflow-hidden ${
            previewDevice === 'mobile' ? 'max-w-md' : 'max-w-5xl'
          }`}
        >
          {/* Simulated Browser Bar */}
          <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            </div>

            <div className="bg-white px-3 py-1 rounded-md border border-slate-200 flex items-center gap-1.5 text-slate-600 font-mono text-[10.5px] w-3/5 truncate">
              <span className="material-symbols-outlined text-[13px] text-emerald-600">lock</span>
              <span className="truncate">
                https://portal.lampang.mahidol.ac.th/news/{activity.code.toLowerCase()}
              </span>
            </div>

            <span className="text-[10px] text-slate-400">Web Portal Preview</span>
          </div>

          {/* Website Header */}
          <div className="bg-[#0c2340] text-white px-6 py-4 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white text-[#0c2340] font-bold flex items-center justify-center text-[13px] shadow-xs">
                  MU
                </div>
                <div>
                  <div className="font-bold text-[14px] tracking-tight leading-tight">
                    มหาวิทยาลัยมหิดล วิทยาเขตลำปาง
                  </div>
                  <div className="text-[10px] text-slate-300">
                    Mahidol University, Lampang Campus
                  </div>
                </div>
              </div>

              {previewDevice === 'desktop' && (
                <div className="hidden sm:flex items-center gap-4 text-[11px] text-slate-200">
                  <span className="hover:text-white cursor-pointer">หน้าแรก</span>
                  <span className="hover:text-white cursor-pointer">เกี่ยวกับวิทยาเขต</span>
                  <span className="text-sky-300 font-bold border-b border-sky-400 pb-0.5">
                    ข่าวสารและกิจกรรม
                  </span>
                  <span className="hover:text-white cursor-pointer">บริการวิชาการ</span>
                </div>
              )}
            </div>
          </div>

          {/* Website Content Area */}
          <div className="p-6 md:p-8 space-y-6 bg-slate-50/40">
            {/* Breadcrumbs & Category Pill */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
              <span>หน้าแรก</span>
              <span>&gt;</span>
              <span>ข่าวสารและกิจกรรม</span>
              <span>&gt;</span>
              <span className="text-sky-700 font-semibold">ข่าวกิจกรรมเพื่อสังคมและสิ่งแวดล้อม</span>
            </div>

            {/* Article Headline */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
                  ข่าวประชาสัมพันธ์
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                  โครงการยุทธศาสตร์ ปี 2568
                </span>
              </div>

              <h1 className="text-[22px] md:text-[26px] font-bold text-slate-900 leading-snug tracking-tight">
                {report.title || activity.name}
              </h1>

              {/* Author & Meta Row */}
              <div className="flex flex-wrap items-center gap-4 text-[11.5px] text-slate-500 pt-1 border-b border-slate-200 pb-3">
                <span className="flex items-center gap-1 text-slate-700 font-semibold">
                  <span className="material-symbols-outlined text-[16px] text-sky-600">
                    apartment
                  </span>
                  {activity.faculty}
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                  จัดเมื่อ: {activity.date}
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">location_on</span>
                  {activity.location}
                </span>
              </div>
            </div>

            {/* Hero Cover Image */}
            {coverUrl && (
              <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-slate-100">
                <img
                  src={coverUrl}
                  alt={report.title}
                  className="w-full h-auto max-h-[420px] object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="p-2.5 bg-white border-t border-slate-100 text-[11px] text-slate-500 text-center italic">
                  ภาพบรรยากาศ: {activity.name} ณ {activity.location}
                </div>
              </div>
            )}

            {/* Executive Summary Lead Callout */}
            <div className="p-4 bg-sky-50/70 border-l-4 border-sky-600 rounded-r-xl text-slate-800 text-[13px] font-medium leading-relaxed">
              {report.summary}
            </div>

            {/* Main Article Body */}
            <div className="text-[13px] text-slate-700 leading-relaxed space-y-4 font-sans whitespace-pre-line">
              {report.content}
            </div>

            {/* Performance Results & Impact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-[13px]">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>ผลการดำเนินงานและตัวชี้วัด (KPIs)</span>
                </div>
                <p className="text-[12px] text-slate-600 leading-relaxed">
                  {report.performanceResults ||
                    'ผู้เข้าร่วมกิจกรรมครบตามเป้าหมาย และได้รับคะแนนความพึงพอใจในระดับดีมาก'}
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 text-indigo-700 font-bold text-[13px]">
                  <span className="material-symbols-outlined text-[18px]">impact_factor</span>
                  <span>ผลลัพธ์และผลกระทบต่อชุมชน (Impact)</span>
                </div>
                <p className="text-[12px] text-slate-600 leading-relaxed">
                  {report.outcomesAndImpact ||
                    'เสริมสร้างความเข้มแข็งของเครือข่ายสิ่งแวดล้อมชุมชนและการพัฒนาอย่างยั่งยืน'}
                </p>
              </div>
            </div>

            {/* Attached Photo Gallery (if available) */}
            {activity.photos && activity.photos.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-[14px] font-bold text-slate-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sky-700 text-[18px]">
                    photo_library
                  </span>
                  <span>ภาพบรรยากาศการดำเนินกิจกรรมเพิ่มเติม ({activity.photos.length} รูป)</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {activity.photos.map((p) => (
                    <div
                      key={p.id}
                      className="aspect-4/3 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 relative group cursor-pointer"
                    >
                      <img
                        src={p.url}
                        alt={p.caption || 'Activity'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2 text-white text-[10px]">
                        <span className="truncate">{p.caption || 'ภาพกิจกรรม'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Verified Official Document Citation Banner */}
            <div className="p-3 bg-purple-50/50 border border-purple-200 rounded-xl flex items-center justify-between gap-3 text-[11.5px]">
              <div className="flex items-center gap-2 text-purple-950">
                <span className="material-symbols-outlined text-purple-700 text-[18px]">
                  verified_user
                </span>
                <span>
                  รายงานนี้อ้างอิงและสกัดข้อมูลจากเอกสารราชการที่ได้รับอนุมัติ: เลขที่{' '}
                  <strong className="font-mono">
                    {activity.officialDocs[0]?.docNumber || 'อว 78.02/0942'}
                  </strong>
                </span>
              </div>
              <span className="text-[10px] text-purple-700 font-semibold bg-purple-100 px-2 py-0.5 rounded">
                AI Verified
              </span>
            </div>
          </div>

          {/* Website Footer */}
          <div className="bg-slate-900 text-white px-6 py-4 text-center text-[11px] text-slate-400 border-t border-slate-800">
            © 2568 มหาวิทยาลัยมหิดล วิทยาเขตลำปาง • 119 หมู่ 5 ถนนลำปาง-เชียงใหม่ ตำบลแม่ทะ อำเภอแม่ทะ จังหวัดลำปาง 52150
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <PublishConfirmModal
        isOpen={publishModalOpen}
        activity={activity}
        report={report}
        onClose={() => setPublishModalOpen(false)}
        onConfirm={() => {
          setPublishModalOpen(false);
          onPublishConfirmed();
        }}
      />
    </div>
  );
};
