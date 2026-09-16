import React, { useState } from 'react';
import { OfficialDocument, Project } from '../types';
import { SAMPLE_OFFICIAL_DOCS } from '../data/adminWorkflow';

interface Step1CreateActivityProps {
  project: Project;
  onProceedToStep2: (activityData: {
    name: string;
    date: string;
    location: string;
    faculty: string;
    campus: string;
    targetCount: number;
    responsiblePerson: string;
    objectives: string;
    documents: OfficialDocument[];
  }) => void;
  onCancel: () => void;
}

export const Step1CreateActivity: React.FC<Step1CreateActivityProps> = ({
  project,
  onProceedToStep2,
  onCancel,
}) => {
  const [name, setName] = useState('ENVI Mahidol ร่วมใจ พัฒนาชุมชน');
  const [date, setDate] = useState('14 กันยายน 2568');
  const [location, setLocation] = useState('อาคารอเนกประสงค์ มหาวิทยาลัยมหิดล วิทยาเขตลำปาง');
  const [faculty, setFaculty] = useState(project.faculty);
  const [campus, setCampus] = useState(project.campus);
  const [targetCount, setTargetCount] = useState<number>(30);
  const [responsiblePerson, setResponsiblePerson] = useState('ดร. เกียรติศักดิ์ (ประธานโครงการ)');
  const [objectives, setObjectives] = useState(
    'เพื่อเสริมสร้างความรู้ความเข้าใจเรื่องการจัดการสิ่งแวดล้อมชุมชน และสร้างความร่วมมือระหว่างมหาวิทยาลัยกับองค์กรปกครองส่วนท้องถิ่น'
  );
  const [documents, setDocuments] = useState<OfficialDocument[]>(SAMPLE_OFFICIAL_DOCS);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState<'memorandum' | 'proposal' | 'schedule'>('memorandum');

  const handleAddSampleDoc = (type: 'memorandum' | 'proposal' | 'schedule') => {
    const docMap: Record<string, OfficialDocument> = {
      memorandum: {
        id: `doc-${Date.now()}-memo`,
        name: 'บันทึกข้อความ_ขออนุมัติจัดกิจกรรม_อว78_02_0942.pdf',
        fileType: 'pdf',
        fileSize: '2.4 MB',
        uploadDate: 'วันนี้',
        documentType: 'memorandum',
        documentTypeName: 'บันทึกข้อความราชการ',
        docNumber: 'อว 78.02/0942',
        verifiedByAi: true,
      },
      proposal: {
        id: `doc-${Date.now()}-prop`,
        name: 'เอกสารโครงการฉบับอนุมัติ_ENVI_ร่วมใจพัฒนาชุมชน.pdf',
        fileType: 'pdf',
        fileSize: '5.1 MB',
        uploadDate: 'วันนี้',
        documentType: 'proposal',
        documentTypeName: 'แบบเสนอโครงการ (TOR)',
        docNumber: 'แผนงาน 68-ENV-ACT-04',
        verifiedByAi: true,
      },
      schedule: {
        id: `doc-${Date.now()}-sched`,
        name: 'กำหนดการกิจกรรมและรายชื่อวิทยากรผู้ทรงคุณวุฒิ.docx',
        fileType: 'docx',
        fileSize: '840 KB',
        uploadDate: 'วันนี้',
        documentType: 'schedule',
        documentTypeName: 'กำหนดการและรายชื่อวิทยากร',
        docNumber: 'แนบท้ายบันทึกข้อความ',
        verifiedByAi: true,
      },
    };

    setDocuments((prev) => [...prev, docMap[type]]);
  };

  const handleRemoveDoc = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onProceedToStep2({
      name,
      date,
      location,
      faculty,
      campus,
      targetCount,
      responsiblePerson,
      objectives,
      documents,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Role Action Callout */}
      <div className="bg-[#0c2340] text-white rounded-xl p-4 flex items-start justify-between gap-4 shadow-sm border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px] text-sky-300">
              person_outline
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 text-sky-200 px-2 py-0.5 rounded">
                STEP 1: ADMIN ACTION
              </span>
              <span className="text-[12px] text-slate-300">
                โครงการ: <strong className="text-white">{project.name}</strong> ({project.code})
              </span>
            </div>
            <h2 className="text-[16px] font-bold text-white mt-1">
              สร้างกิจกรรม และ อัปโหลดเอกสารราชการที่เกี่ยวข้อง
            </h2>
            <p className="text-[12px] text-slate-300 mt-0.5">
              กรอกข้อมูลกิจกรรมและแนบเอกสารราชการ (เช่น บันทึกข้อความ, โครงการที่ได้รับอนุมัติ, กำหนดการ) เพื่อให้ AI ตรวจสอบและใช้เป็นฐานในการจัดทำแบบสอบถาม
            </p>
          </div>
        </div>

        <div className="text-right shrink-0 hidden sm:block">
          <span className="text-[11px] text-slate-300">เอกสารที่แนบแล้ว</span>
          <div className="text-[20px] font-bold text-sky-300">
            {documents.length} <span className="text-[12px] font-normal text-slate-300">ฉบับ</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Col: Activity Details Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-[14px] font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-sky-700 text-[18px]">
                event_note
              </span>
              ข้อมูลรายละเอียดกิจกรรม
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">
              * ข้อมูลเบื้องต้นก่อน AI วิเคราะห์เอกสาร
            </span>
          </div>

          <div className="space-y-3 text-[12px]">
            <div>
              <label className="block text-[12px] font-medium text-slate-700 mb-1">
                ชื่อกิจกรรม <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="เช่น ENVI Mahidol ร่วมใจ พัฒนาชุมชน"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-sky-600 bg-slate-50 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-medium text-slate-700 mb-1">
                  วันที่จัดกิจกรรม <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="เช่น 14 กันยายน 2568"
                    className="w-full px-3 py-2 pl-9 border border-slate-200 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-sky-600 bg-slate-50 focus:bg-white"
                  />
                  <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                    calendar_month
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-slate-700 mb-1">
                  จำนวนผู้เข้าร่วมเป้าหมาย (คน)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    value={targetCount}
                    onChange={(e) => setTargetCount(Number(e.target.value))}
                    className="w-full px-3 py-2 pl-9 border border-slate-200 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-sky-600 bg-slate-50 focus:bg-white"
                  />
                  <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                    group
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-medium text-slate-700 mb-1">
                  หน่วยงาน / คณะที่รับผิดชอบ
                </label>
                <input
                  type="text"
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-sky-600 bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-slate-700 mb-1">
                  วิทยาเขต / สถานที่ตั้ง
                </label>
                <input
                  type="text"
                  value={campus}
                  onChange={(e) => setCampus(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-sky-600 bg-slate-50 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-slate-700 mb-1">
                สถานที่จัดงาน (Location)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="เช่น อาคารอเนกประสงค์ มหาวิทยาลัยมหิดล วิทยาเขตลำปาง"
                  className="w-full px-3 py-2 pl-9 border border-slate-200 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-sky-600 bg-slate-50 focus:bg-white"
                />
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                  location_on
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-slate-700 mb-1">
                ผู้รับผิดชอบโครงการ / กิจกรรม
              </label>
              <input
                type="text"
                value={responsiblePerson}
                onChange={(e) => setResponsiblePerson(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-sky-600 bg-slate-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-slate-700 mb-1">
                วัตถุประสงค์โดยสรุป (ADMIN บันทึกเบื้องต้น)
              </label>
              <textarea
                rows={2}
                value={objectives}
                onChange={(e) => setObjectives(e.target.value)}
                placeholder="ระบุวัตถุประสงค์สั้นๆ เพื่อให้ AI สอบทานกับเอกสารแนบ"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600 bg-slate-50 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Right Col: Official Documents Upload (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3.5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-[14px] font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-sky-700 text-[18px]">
                  upload_file
                </span>
                เอกสารราชการที่เกี่ยวข้อง
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">
                (PDF, DOCX)
              </span>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              เอกสารราชการนี้จะถูกส่งต่อไปยัง <strong>STEP 2: AI ตรวจสอบเอกสาร</strong> เพื่อสกัดวัตถุประสงค์และสร้างแบบสอบถามอัตโนมัติ
            </p>

            {/* Dropzone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                handleAddSampleDoc('proposal');
              }}
              className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors cursor-pointer ${
                isDragging
                  ? 'border-sky-500 bg-sky-50'
                  : 'border-slate-300 hover:border-sky-400 bg-slate-50/70'
              }`}
              onClick={() => handleAddSampleDoc(selectedDocType)}
            >
              <span className="material-symbols-outlined text-[36px] text-sky-600">
                cloud_upload
              </span>
              <div className="text-[12px] font-bold text-slate-800 mt-1">
                คลิกเพื่ออัปโหลดเอกสารราชการ หรือ ลากไฟล์มาวาง
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                รองรับไฟล์ PDF, DOCX ขนาดสูงสุด 25MB ต่อไฟล์
              </div>
            </div>

            {/* Quick Template Attachment Bar */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-500 font-medium">แนบด่วน:</span>
              <button
                type="button"
                onClick={() => handleAddSampleDoc('memorandum')}
                className="px-2 py-1 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium transition-colors"
              >
                + บันทึกข้อความ
              </button>
              <button
                type="button"
                onClick={() => handleAddSampleDoc('proposal')}
                className="px-2 py-1 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium transition-colors"
              >
                + แบบเสนอโครงการ (TOR)
              </button>
              <button
                type="button"
                onClick={() => handleAddSampleDoc('schedule')}
                className="px-2 py-1 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium transition-colors"
              >
                + กำหนดการกิจกรรม
              </button>
            </div>

            {/* Uploaded Documents List */}
            <div className="space-y-2 pt-1">
              <div className="text-[11px] font-semibold text-slate-600">
                รายการเอกสารที่แนบ ({documents.length}):
              </div>

              {documents.length === 0 ? (
                <div className="py-6 text-center text-slate-400 text-[11px] border border-slate-100 rounded-lg bg-slate-50">
                  ยังไม่มีเอกสารแนบ กรุณาแนบอย่างน้อย 1 ฉบับ
                </div>
              ) : (
                <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-2 text-[11px] hover:bg-slate-100/70 transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="material-symbols-outlined text-rose-500 text-[18px] shrink-0">
                          {doc.fileType === 'pdf' ? 'picture_as_pdf' : 'description'}
                        </span>
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900 truncate" title={doc.name}>
                            {doc.name}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {doc.documentTypeName} • {doc.fileSize}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveDoc(doc.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                        title="ลบเอกสาร"
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-3.5 py-2 text-[12px] font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              ยกเลิก
            </button>

            <button
              type="submit"
              disabled={documents.length === 0}
              className="px-4 py-2 bg-sky-700 hover:bg-sky-800 disabled:opacity-50 text-white rounded-lg text-[12px] font-semibold flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
            >
              <span>บันทึกและส่งให้ AI ตรวจสอบ (ไปยัง STEP 2)</span>
              <span className="material-symbols-outlined text-[16px]">
                arrow_forward
              </span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
