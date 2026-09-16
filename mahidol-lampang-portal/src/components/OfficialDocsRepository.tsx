import React, { useState } from 'react';
import { OfficialDocument, Project } from '../types';
import { OfficialDocPreviewModal } from './OfficialDocPreviewModal';

interface OfficialDocsRepositoryProps {
  project: Project;
  documents: OfficialDocument[];
  onUploadNew: () => void;
}

export const OfficialDocsRepository: React.FC<OfficialDocsRepositoryProps> = ({
  project,
  documents,
  onUploadNew,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewDoc, setPreviewDoc] = useState<OfficialDocument | null>(null);
  const [displayMode, setDisplayMode] = useState<'modal' | 'side-panel'>('modal');

  const filteredDocs = documents.filter((doc) => {
    const matchType = filterType === 'all' || doc.documentType === filterType;
    const matchSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.docNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });

  const handleOpenPreview = (doc: OfficialDocument) => {
    setPreviewDoc(doc);
  };

  const handleClosePreview = () => {
    setPreviewDoc(null);
  };

  const toggleDisplayMode = () => {
    setDisplayMode((prev) => (prev === 'modal' ? 'side-panel' : 'modal'));
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-[#0c2340] text-white rounded-xl p-5 shadow-sm border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 text-sky-200 px-2 py-0.5 rounded">
                คลังเอกสารราชการ
              </span>
              <span className="text-[12px] text-slate-300">
                โครงการ: {project.name} ({project.code})
              </span>
            </div>
            <h1 className="text-[18px] font-bold text-white mt-1">
              เอกสารราชการและบันทึกข้อความที่ใช้ประมวลผล AI
            </h1>
            <p className="text-[12px] text-slate-300 mt-0.5">
              จัดเก็บเอกสารราชการที่เกี่ยวข้องกับกิจกรรม เช่น บันทึกข้อความขออนุมัติ, แบบเสนอโครงการ (TOR), และกำหนดการกิจกรรม
            </p>
          </div>

          <button
            type="button"
            onClick={onUploadNew}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg text-[12px] flex items-center gap-2 shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">upload_file</span>
            <span>+ แนบเอกสารใหม่</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-3 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors cursor-pointer ${
                filterType === 'all'
                  ? 'bg-sky-100 text-sky-800 font-bold'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              ทั้งหมด ({documents.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('memorandum')}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors cursor-pointer ${
                filterType === 'memorandum'
                  ? 'bg-sky-100 text-sky-800 font-bold'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              บันทึกข้อความ
            </button>
            <button
              type="button"
              onClick={() => setFilterType('proposal')}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors cursor-pointer ${
                filterType === 'proposal'
                  ? 'bg-sky-100 text-sky-800 font-bold'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              โครงการฉบับอนุมัติ (TOR)
            </button>
            <button
              type="button"
              onClick={() => setFilterType('schedule')}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors cursor-pointer ${
                filterType === 'schedule'
                  ? 'bg-sky-100 text-sky-800 font-bold'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              กำหนดการและวิทยากร
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Display Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[11px]">
              <button
                type="button"
                onClick={() => setDisplayMode('modal')}
                className={`px-2 py-1 rounded font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                  displayMode === 'modal'
                    ? 'bg-white text-sky-800 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="เปิดแบบหน้าต่างป๊อปอัป (Modal)"
              >
                <span className="material-symbols-outlined text-[15px]">fullscreen</span>
                <span>Modal</span>
              </button>
              <button
                type="button"
                onClick={() => setDisplayMode('side-panel')}
                className={`px-2 py-1 rounded font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                  displayMode === 'side-panel'
                    ? 'bg-white text-sky-800 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="เปิดแบบแถบด้านข้าง (Side-Panel)"
              >
                <span className="material-symbols-outlined text-[15px]">dock_to_right</span>
                <span>Side-Panel</span>
              </button>
            </div>

            <div className="relative w-full sm:w-60">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาชื่อไฟล์ หรือเลขที่เอกสาร..."
                className="w-full px-3 py-1.5 pl-8 border border-slate-200 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-sky-600 bg-slate-50"
              />
              <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-[16px]">
                search
              </span>
            </div>
          </div>
        </div>

        {/* Informative Hint Banner for Admins */}
        <div className="flex items-center justify-between text-[11px] bg-sky-50 border border-sky-100 rounded-lg px-3 py-2 text-sky-900">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sky-600 text-[16px]">
              preview
            </span>
            <span>
              <strong>ระบบแสดงตัวอย่างเอกสารทันที:</strong> คลิกที่การ์ดเอกสาร หรือปุ่ม <strong>"ดูตัวอย่าง"</strong> เพื่อเปิดอ่านเนื้อหา PDF ฉบับเต็ม ตรวจสอบไฮไลท์ข้อมูลที่ AI สกัดได้ โดยไม่ต้องดาวน์โหลดไฟล์ลงเครื่อง
            </span>
          </div>
          <span className="text-[10px] text-sky-700 bg-white/80 border border-sky-200 px-2 py-0.5 rounded font-mono shrink-0 hidden md:inline">
            Fast In-Browser PDF Preview
          </span>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            onClick={() => handleOpenPreview(doc)}
            className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between space-y-3 hover:border-sky-400 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-rose-500 text-[24px]">
                    {doc.fileType === 'pdf' ? 'picture_as_pdf' : 'description'}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                    {doc.fileType}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">verified</span>
                  AI ตรวจสอบแล้ว
                </span>
              </div>

              <div className="font-bold text-[13px] text-slate-900 line-clamp-2 group-hover:text-sky-700 transition-colors" title={doc.name}>
                {doc.name}
              </div>

              <div className="text-[11px] text-slate-500 space-y-0.5">
                <div>ประเภท: <strong className="text-slate-700">{doc.documentTypeName}</strong></div>
                <div>เลขที่: <strong className="text-slate-700">{doc.docNumber}</strong></div>
                <div>ขนาด: {doc.fileSize} • อัปโหลดเมื่อ: {doc.uploadDate}</div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-purple-700 font-medium flex items-center gap-1 text-[10px]">
                <span className="material-symbols-outlined text-[13px]">auto_awesome</span>
                ใช้สร้าง Survey แล้ว
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenPreview(doc);
                  }}
                  className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold rounded text-[11px] flex items-center gap-1 transition-colors cursor-pointer border border-sky-200"
                >
                  <span className="material-symbols-outlined text-[14px]">visibility</span>
                  <span>ดูตัวอย่าง</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Document Previewer Modal / Side-Panel */}
      <OfficialDocPreviewModal
        isOpen={!!previewDoc}
        document={previewDoc}
        documentsList={documents}
        onSelectDocument={handleOpenPreview}
        onClose={handleClosePreview}
        displayMode={displayMode}
        onToggleDisplayMode={toggleDisplayMode}
      />
    </div>
  );
};
