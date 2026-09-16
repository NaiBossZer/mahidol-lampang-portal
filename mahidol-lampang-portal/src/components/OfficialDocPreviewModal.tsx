import React, { useState } from 'react';
import { OfficialDocument } from '../types';
import { DETAILED_OFFICIAL_DOCS, DetailedOfficialDoc } from '../data/officialDocDetails';

interface OfficialDocPreviewModalProps {
  isOpen: boolean;
  document: OfficialDocument | null;
  documentsList: OfficialDocument[];
  onSelectDocument: (doc: OfficialDocument) => void;
  onClose: () => void;
  displayMode?: 'modal' | 'side-panel';
  onToggleDisplayMode?: () => void;
}

export const OfficialDocPreviewModal: React.FC<OfficialDocPreviewModalProps> = ({
  isOpen,
  document,
  documentsList,
  onSelectDocument,
  onClose,
  displayMode = 'modal',
  onToggleDisplayMode,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showAiHighlights, setShowAiHighlights] = useState(true);
  const [activeTab, setActiveTab] = useState<'document' | 'ai-insights' | 'metadata'>('document');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!isOpen || !document) return null;

  // Retrieve rich detailed document or fallback
  const detailedDoc: DetailedOfficialDoc = DETAILED_OFFICIAL_DOCS[document.id] || {
    id: document.id,
    name: document.name,
    docNumber: document.docNumber,
    documentType: document.documentType,
    documentTypeName: document.documentTypeName,
    fileType: document.fileType,
    fileSize: document.fileSize,
    uploadDate: document.uploadDate,
    totalPages: 1,
    signatory: 'ผู้รับผิดชอบโครงการ มหาวิทยาลัยมหิดล วิทยาเขตลำปาง',
    organization: 'คณะสิ่งแวดล้อมและทรัพยากรศาสตร์',
    aiVerificationScore: 98.0,
    aiVerifiedDate: document.uploadDate,
    pages: [
      {
        pageNumber: 1,
        title: document.name,
        sections: [
          {
            heading: 'รายละเอียดเอกสารราชการ',
            text: `เอกสาร ${document.name} เลขที่ ${document.docNumber} ได้รับการตรวจสอบความถูกต้องและบันทึกในระบบเรียบร้อยแล้ว`,
          },
        ],
      },
    ],
    extractedSummary: {
      objectives: ['วัตถุประสงค์ตามเอกสารราชการ'],
      targetAudience: 'ผู้เข้าร่วมกิจกรรม',
      dateAndLocation: 'มหาวิทยาลัยมหิดล วิทยาเขตลำปาง',
      budget: 'ตามที่ได้รับจัดสรร',
      kpis: ['เกณฑ์การประเมินผลสัมฤทธิ์'],
    },
  };

  const totalPages = detailedDoc.pages.length;
  const activePageData = detailedDoc.pages.find((p) => p.pageNumber === currentPage) || detailedDoc.pages[0];

  // Current document index for next/prev
  const currentIndex = documentsList.findIndex((d) => d.id === document.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < documentsList.length - 1;

  const handlePrevDoc = () => {
    if (hasPrev) {
      onSelectDocument(documentsList[currentIndex - 1]);
      setCurrentPage(1);
    }
  };

  const handleNextDoc = () => {
    if (hasNext) {
      onSelectDocument(documentsList[currentIndex + 1]);
      setCurrentPage(1);
    }
  };

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 15, 175));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 15, 60));
  const handleResetZoom = () => setZoomLevel(100);

  const handlePrint = () => {
    window.print();
  };

  // Content for the previewer
  const previewContent = (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-100 overflow-hidden">
      {/* Viewer Action Toolbar */}
      <div className="bg-white px-4 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[12px] shrink-0 shadow-2xs">
        {/* Left: Document Tabs & Navigation */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('document')}
            className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'document'
                ? 'bg-sky-50 text-sky-700 font-bold border border-sky-200'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">visibility</span>
            <span>หน้าเอกสาร (Document View)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ai-insights')}
            className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'ai-insights'
                ? 'bg-purple-50 text-purple-700 font-bold border border-purple-200'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-purple-600">auto_awesome</span>
            <span>ข้อมูลที่ AI สกัดได้</span>
            <span className="bg-purple-200/80 text-purple-800 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {detailedDoc.aiVerificationScore}%
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('metadata')}
            className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'metadata'
                ? 'bg-slate-100 text-slate-800 font-bold border border-slate-200'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">info</span>
            <span>คุณสมบัติไฟล์</span>
          </button>
        </div>

        {/* Center/Right: Page Controls & Zoom Tools */}
        {activeTab === 'document' && (
          <div className="flex items-center gap-2 flex-wrap">
            {/* AI Highlight Toggle */}
            <label className="flex items-center gap-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 px-2.5 py-1 rounded-md text-[11px] font-medium border border-purple-200 cursor-pointer select-none transition-colors">
              <input
                type="checkbox"
                checked={showAiHighlights}
                onChange={(e) => setShowAiHighlights(e.target.checked)}
                className="w-3.5 h-3.5 text-purple-600 rounded border-purple-300 focus:ring-purple-500 cursor-pointer"
              />
              <span>แสดงไฮไลท์ AI</span>
            </label>

            {/* Page Navigator */}
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-md p-0.5 text-slate-700">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage <= 1}
                className="p-1 hover:bg-white rounded text-slate-600 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                title="หน้าก่อนหน้า"
              >
                <span className="material-symbols-outlined text-[16px]">chevron_left</span>
              </button>
              <span className="px-2 font-mono text-[11px] font-semibold">
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage >= totalPages}
                className="p-1 hover:bg-white rounded text-slate-600 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                title="หน้าถัดไป"
              >
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-md p-0.5 text-slate-700">
              <button
                type="button"
                onClick={handleZoomOut}
                className="p-1 hover:bg-white rounded text-slate-600 cursor-pointer"
                title="ย่อขนาด (-15%)"
              >
                <span className="material-symbols-outlined text-[16px]">zoom_out</span>
              </button>
              <button
                type="button"
                onClick={handleResetZoom}
                className="px-1.5 font-mono text-[11px] hover:bg-white rounded text-slate-700 font-semibold cursor-pointer"
                title="คืนค่า 100%"
              >
                {zoomLevel}%
              </button>
              <button
                type="button"
                onClick={handleZoomIn}
                className="p-1 hover:bg-white rounded text-slate-600 cursor-pointer"
                title="ขยายขนาด (+15%)"
              >
                <span className="material-symbols-outlined text-[16px]">zoom_in</span>
              </button>
            </div>

            {/* Quick Text Filter */}
            <div className="relative w-36">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาในหน้านี้..."
                className="w-full px-2 py-1 pl-6 bg-slate-50 border border-slate-200 rounded text-[11px] focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              <span className="material-symbols-outlined absolute left-1.5 top-1/2 -translate-y-1/2 text-slate-400 text-[13px]">
                search
              </span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <span className="material-symbols-outlined text-[12px]">close</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex justify-center">
        {/* TAB 1: Real Authentic Official Thai Government Document Layout */}
        {activeTab === 'document' && (
          <div
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            className="transition-transform duration-150 w-full max-w-[760px]"
          >
            {/* A4 Document Canvas Sheet */}
            <div className="bg-white rounded-lg shadow-xl border border-slate-300 p-8 sm:p-12 text-slate-900 min-h-[960px] flex flex-col justify-between relative selection:bg-amber-100">
              {/* Watermark/Seal Stamp in Top Corner */}
              <div className="absolute top-6 right-6 flex flex-col items-end opacity-80 pointer-events-none select-none">
                <div className="text-[10px] font-mono text-slate-400">MAHIDOL UNIVERSITY LAMPANG</div>
                <div className="text-[9px] text-emerald-600 font-bold border border-emerald-500 px-2 py-0.5 rounded uppercase mt-0.5">
                  AI Verified & Archival Copy
                </div>
              </div>

              <div>
                {/* Official Header: Garuda or University Seal */}
                {detailedDoc.documentType === 'memorandum' ? (
                  <div className="text-center mb-6">
                    {/* Thai Royal Garuda Emblem representation */}
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-50 border border-amber-300 text-amber-800 shadow-xs mb-1">
                      <span className="material-symbols-outlined text-[34px]">
                        verified_user
                      </span>
                    </div>
                    <div className="text-[20px] font-bold tracking-widest text-slate-900 font-serif">
                      บันทึกข้อความ
                    </div>
                  </div>
                ) : (
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 border border-blue-200 text-[#0c2340] shadow-xs mb-1">
                      <span className="font-serif font-bold text-[18px]">MU</span>
                    </div>
                    <div className="text-[18px] font-bold text-slate-900">
                      มหาวิทยาลัยมหิดล วิทยาเขตลำปาง
                    </div>
                    <div className="text-[13px] text-slate-600">
                      {detailedDoc.documentTypeName}
                    </div>
                  </div>
                )}

                {/* Sub-Header details: ส่วนราชการ, เลขที่, วันที่ */}
                <div className="border-b-2 border-slate-800 pb-3 mb-5 text-[13px] space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <div>
                      <span className="font-bold">ส่วนงาน:</span>{' '}
                      <span className="text-slate-800">{activePageData.headerLeft || detailedDoc.organization}</span>
                    </div>
                    <div className="font-mono text-slate-900 font-semibold">
                      {activePageData.headerRight || `ที่ ${detailedDoc.docNumber}`}
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[12px] text-slate-600">
                    <span>
                      <strong>วันที่บันทึก:</strong> {detailedDoc.uploadDate.split(' ')[0]} {detailedDoc.uploadDate.split(' ')[1]} {detailedDoc.uploadDate.split(' ')[2]}
                    </span>
                    <span className="font-medium text-slate-500">
                      หน้า {activePageData.pageNumber} จาก {totalPages}
                    </span>
                  </div>
                </div>

                {/* Search banner if searching */}
                {searchQuery && (
                  <div className="mb-4 p-2 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-900 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-amber-700">manage_search</span>
                    <span>
                      กำลังค้นหาคำว่า: <strong>"{searchQuery}"</strong> ในหน้านี้
                    </span>
                  </div>
                )}

                {/* Document Body Sections */}
                <div className="space-y-4 text-[13px] leading-relaxed text-slate-800">
                  {activePageData.sections.map((sec, sIdx) => {
                    const isAiMatch = showAiHighlights && sec.aiHighlighted;
                    const matchesSearch =
                      searchQuery &&
                      (sec.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (sec.heading && sec.heading.toLowerCase().includes(searchQuery.toLowerCase())));

                    return (
                      <div
                        key={sIdx}
                        className={`transition-all duration-200 rounded-lg p-3 ${
                          isAiMatch
                            ? 'bg-purple-50/70 border-l-4 border-purple-600 pl-3.5 shadow-2xs'
                            : matchesSearch
                            ? 'bg-amber-50 border border-amber-300'
                            : 'hover:bg-slate-50/70'
                        }`}
                      >
                        {sec.heading && (
                          <div className="font-bold text-slate-900 mb-1 flex items-center justify-between">
                            <span>{sec.heading}</span>
                            {isAiMatch && (
                              <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <span className="material-symbols-outlined text-[12px]">auto_awesome</span>
                                {sec.aiTag}
                              </span>
                            )}
                          </div>
                        )}

                        <p className="whitespace-pre-line text-slate-700 font-normal">
                          {searchQuery ? (
                            sec.text.split(new RegExp(`(${searchQuery})`, 'gi')).map((part, i) =>
                              part.toLowerCase() === searchQuery.toLowerCase() ? (
                                <mark key={i} className="bg-amber-200 text-amber-900 px-0.5 rounded">
                                  {part}
                                </mark>
                              ) : (
                                part
                              )
                            )
                          ) : (
                            sec.text
                          )}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Notes / Official Endorsements on page 2 */}
                {activePageData.notes && (
                  <div className="mt-8 p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-[12px] space-y-1">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-emerald-600">
                        verified
                      </span>
                      <span>บันทึกความเห็นชอบ / คำสั่งการ:</span>
                    </div>
                    <p className="text-slate-600 italic pl-5">{activePageData.notes}</p>
                  </div>
                )}
              </div>

              {/* Bottom Signatory & Stamp Section */}
              <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 text-[11px] text-slate-500">
                <div className="space-y-0.5">
                  <div>รหัสอ้างอิงเอกสาร: <span className="font-mono text-slate-700">{detailedDoc.docNumber}</span></div>
                  <div>ระบบจัดเก็บเอกสาร: Mahidol Lampang Document Registry v2.4</div>
                </div>

                <div className="text-right space-y-1 self-end">
                  <div className="italic text-slate-400 font-serif">
                    (ลงชื่อรับรองความถูกต้องในระบบอิเล็กทรอนิกส์)
                  </div>
                  <div className="font-bold text-slate-800 text-[12px]">
                    {detailedDoc.signatory}
                  </div>
                  <div className="text-slate-500">{detailedDoc.organization}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AI Extracted Insights */}
        {activeTab === 'ai-insights' && (
          <div className="w-full max-w-3xl space-y-4">
            <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/30 flex items-center justify-center border border-purple-400/40">
                    <span className="material-symbols-outlined text-[24px] text-purple-200">
                      psychology
                    </span>
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-white">
                      ผลการสกัดข้อมูลและวัตถุประสงค์โดย AI
                    </h3>
                    <p className="text-[11px] text-purple-200 mt-0.5">
                      ข้อมูลที่ระบบ AI สกัดได้จาก {detailedDoc.name} เพื่อนำไปตั้งคำถามในแบบสอบถามความพึงพอใจ
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[22px] font-bold text-emerald-400 font-mono">
                    {detailedDoc.aiVerificationScore}%
                  </div>
                  <div className="text-[10px] text-purple-200">Confidence Score</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-purple-600">flag</span>
                    วัตถุประสงค์โครงการที่สกัดได้
                  </span>
                  <ul className="list-disc list-inside text-[12px] text-slate-800 space-y-1">
                    {detailedDoc.extractedSummary.objectives.map((obj, i) => (
                      <li key={i}>{obj}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-sky-600">group</span>
                    กลุ่มเป้าหมายผู้เข้าร่วม
                  </span>
                  <p className="text-[12px] text-slate-800">
                    {detailedDoc.extractedSummary.targetAudience}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-amber-600">calendar_month</span>
                    วันเวลาและสถานที่
                  </span>
                  <p className="text-[12px] text-slate-800">
                    {detailedDoc.extractedSummary.dateAndLocation}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-emerald-600">trending_up</span>
                    เกณฑ์ตัวชี้วัดความสำเร็จ (KPIs)
                  </span>
                  <ul className="list-disc list-inside text-[12px] text-slate-800 space-y-1">
                    {detailedDoc.extractedSummary.kpis.map((kpi, i) => (
                      <li key={i}>{kpi}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-[12px] text-emerald-900">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-[20px]">
                    verified
                  </span>
                  <span>
                    เอกสารนี้ได้รับการตรวจสอบความถูกต้องและผ่านการประมวลผลเข้าสู่ <strong>STEP 3 (AI Survey Generation)</strong> เรียบร้อยแล้ว
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Metadata & File Properties */}
        {activeTab === 'metadata' && (
          <div className="w-full max-w-2xl bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-[15px] font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-600 text-[18px]">
                badge
              </span>
              ข้อมูลกำกับเอกสารราชการ (Document Metadata)
            </h3>

            <div className="grid grid-cols-2 gap-4 text-[12px]">
              <div>
                <span className="text-slate-400 text-[11px]">ชื่อไฟล์ต้นฉบับ</span>
                <div className="font-semibold text-slate-900 mt-0.5 break-all">{detailedDoc.name}</div>
              </div>

              <div>
                <span className="text-slate-400 text-[11px]">เลขที่เอกสาร / รหัสอ้างอิง</span>
                <div className="font-semibold text-slate-900 mt-0.5">{detailedDoc.docNumber}</div>
              </div>

              <div>
                <span className="text-slate-400 text-[11px]">ประเภทเอกสาร</span>
                <div className="font-semibold text-slate-900 mt-0.5">{detailedDoc.documentTypeName}</div>
              </div>

              <div>
                <span className="text-slate-400 text-[11px]">นามสกุลไฟล์ / ขนาด</span>
                <div className="font-semibold text-slate-900 mt-0.5 uppercase">
                  {detailedDoc.fileType} • {detailedDoc.fileSize}
                </div>
              </div>

              <div>
                <span className="text-slate-400 text-[11px]">จำนวนหน้าทั้งหมด</span>
                <div className="font-semibold text-slate-900 mt-0.5">{detailedDoc.totalPages} หน้า</div>
              </div>

              <div>
                <span className="text-slate-400 text-[11px]">วันที่อัปโหลดเข้าระบบ</span>
                <div className="font-semibold text-slate-900 mt-0.5">{detailedDoc.uploadDate}</div>
              </div>

              <div>
                <span className="text-slate-400 text-[11px]">หน่วยงานเจ้าของเรื่อง</span>
                <div className="font-semibold text-slate-900 mt-0.5">{detailedDoc.organization}</div>
              </div>

              <div>
                <span className="text-slate-400 text-[11px]">สถานะการประมวลผล AI</span>
                <div className="font-semibold text-emerald-600 mt-0.5 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  ตรวจผ่าน ({detailedDoc.aiVerificationScore}%)
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>SHA-256 Checksum: e3b0c44298fc1c149afbf4c8996fb924...</span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium border border-emerald-200">
                พร้อมใช้งานในระบบ
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Viewer Bottom Footer Navigation */}
      <div className="bg-white px-4 py-2 border-t border-slate-200 flex items-center justify-between text-[12px] shrink-0">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrevDoc}
            disabled={!hasPrev}
            className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded text-[11px] font-medium flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[14px]">arrow_back</span>
            <span>เอกสารก่อนหน้า</span>
          </button>

          <span className="text-slate-400 text-[11px]">
            เอกสารที่ {currentIndex + 1} จาก {documentsList.length}
          </span>

          <button
            type="button"
            onClick={handleNextDoc}
            disabled={!hasNext}
            className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded text-[11px] font-medium flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            <span>เอกสารถัดไป</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-3 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded text-[11px] font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
            title="พิมพ์เอกสาร"
          >
            <span className="material-symbols-outlined text-[14px]">print</span>
            <span>พิมพ์</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1 bg-[#0c2340] hover:bg-[#163a66] text-white rounded text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>ปิดตัวอย่าง</span>
          </button>
        </div>
      </div>
    </div>
  );

  // If Display Mode is Side-Panel
  if (displayMode === 'side-panel') {
    return (
      <div className="fixed inset-y-0 right-0 w-full md:w-[680px] lg:w-[740px] xl:w-[820px] z-50 bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-250">
        {/* Side-Panel Header */}
        <div className="bg-[#0c2340] text-white px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="material-symbols-outlined text-rose-400 text-[22px] shrink-0">
              {detailedDoc.fileType === 'pdf' ? 'picture_as_pdf' : 'description'}
            </span>
            <div className="min-w-0">
              <h2 className="text-[14px] font-bold text-white truncate" title={detailedDoc.name}>
                {detailedDoc.name}
              </h2>
              <div className="text-[11px] text-slate-300 flex items-center gap-2">
                <span>เลขที่: {detailedDoc.docNumber}</span>
                <span>•</span>
                <span>{detailedDoc.fileSize}</span>
                <span>•</span>
                <span className="text-emerald-300 font-medium">AI Verified</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {onToggleDisplayMode && (
              <button
                type="button"
                onClick={onToggleDisplayMode}
                className="p-1 text-slate-300 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer"
                title="เปลี่ยนเป็นโหมด Modal เต็มจอ"
              >
                <span className="material-symbols-outlined text-[18px]">open_in_full</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1 text-slate-300 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer"
              title="ปิดแผงดูตัวอย่าง"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {previewContent}
      </div>
    );
  }

  // Default Display Mode: Modal
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 animate-in fade-in duration-200">
      <div
        className={`relative bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden text-slate-800 transition-all duration-200 ${
          isFullscreen
            ? 'w-full h-full max-w-none max-h-none rounded-none'
            : 'w-full max-w-5xl h-[92vh]'
        }`}
      >
        {/* Modal Top Header */}
        <div className="bg-[#0c2340] text-white px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-rose-400 text-[22px]">
                {detailedDoc.fileType === 'pdf' ? 'picture_as_pdf' : 'description'}
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-[15px] font-bold text-white truncate" title={detailedDoc.name}>
                  {detailedDoc.name}
                </h2>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full shrink-0">
                  AI Verified ({detailedDoc.aiVerificationScore}%)
                </span>
              </div>
              <div className="text-[11px] text-slate-300 flex items-center gap-2 mt-0.5">
                <span>ประเภท: {detailedDoc.documentTypeName}</span>
                <span>•</span>
                <span>เลขที่: {detailedDoc.docNumber}</span>
                <span>•</span>
                <span>ขนาด: {detailedDoc.fileSize}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onToggleDisplayMode && (
              <button
                type="button"
                onClick={onToggleDisplayMode}
                className="px-2.5 py-1 text-slate-300 hover:text-white hover:bg-white/10 rounded text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                title="เปลี่ยนเป็นแถบข้าง (Side-Panel)"
              >
                <span className="material-symbols-outlined text-[16px]">dock_to_right</span>
                <span className="hidden sm:inline">โหมดแถบข้าง</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer"
              title={isFullscreen ? 'ย่อขนาด' : 'เต็มหน้าจอ'}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isFullscreen ? 'close_fullscreen' : 'fullscreen'}
              </span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title="ปิด (Esc)"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {previewContent}
      </div>
    </div>
  );
};
