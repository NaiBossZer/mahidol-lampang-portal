import React, { useState } from 'react';
import { Project } from '../types';

interface AiWorkspaceStudioProps {
  project: Project;
  onNavigateToWorkflow: () => void;
  onNavigateToDocs: () => void;
}

export const AiWorkspaceStudio: React.FC<AiWorkspaceStudioProps> = ({
  project,
  onNavigateToWorkflow,
  onNavigateToDocs,
}) => {
  const [selectedTask, setSelectedTask] = useState<'survey' | 'extract' | 'pr' | 'strategic'>('survey');
  const [selectedSampleDoc, setSelectedSampleDoc] = useState<string>('บันทึกข้อความ_ENVI_ขออนุมัติจัดกิจกรรม.pdf');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiOutput, setAiOutput] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Pre-canned AI tasks
  const tasks = [
    {
      id: 'survey',
      label: 'สร้างแบบประเมินอัจฉริยะ (AI Survey Builder)',
      desc: 'แปลงข้อกำหนดโครงการและตัวชี้วัดเป็นแบบสอบถามมาตราส่วน Likert 5 ระดับ',
      icon: 'quiz',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      id: 'extract',
      label: 'สกัดข้อมูลเอกสารราชการ (Document Extraction)',
      desc: 'สกัดเลขที่บันทึกข้อความ วันที่จัด งบประมาณ วัตถุประสงค์ และผู้รับผิดชอบ',
      icon: 'document_scanner',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      id: 'pr',
      label: 'ร่างข่าวประชาสัมพันธ์ (PR News Generation)',
      desc: 'สังเคราะห์เนื้อหาข่าวและรายงานผลสัมฤทธิ์พร้อมเผยแพร่สู่เว็บไซต์มหาวิทยาลัย',
      icon: 'newspaper',
      color: 'text-sky-600',
      bgColor: 'bg-sky-50',
    },
    {
      id: 'strategic',
      label: 'วิเคราะห์ความสอดคล้องยุทธศาสตร์ (Strategic Alignment)',
      desc: 'ตรวจสอบความสอดคล้องกับยุทธศาสตร์มหาวิทยาลัยมหิดล และเป้าหมาย SDGs',
      icon: 'verified',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
  ];

  const handleRunAi = () => {
    setIsProcessing(true);
    setAiOutput(null);

    setTimeout(() => {
      setIsProcessing(false);
      if (selectedTask === 'survey') {
        setAiOutput(`### ผลการวิเคราะห์และสร้างแบบสอบถามโดย AI
**เอกสารต้นฉบับ:** ${selectedSampleDoc}
**โครงการเป้าหมาย:** ${project.name}

#### ตอนที่ 1: ข้อมูลทั่วไปของผู้ตอบแบบสอบถาม (Demographics)
- ประเภทผู้เข้าร่วม (ผู้นำชุมชน / ประชาชนทั่วไป / บุคลากร / นักศึกษา)
- เพศ และ ช่วงอายุ
- สังกัดชุมชน / ตำบลในจังหวัดลำปาง

#### ตอนที่ 2: ความพึงพอใจต่อการจัดกิจกรรม (Likert 5 ระดับ)
1. **ด้านกระบวนการและขั้นตอนการจัดกิจกรรม**
   - ความเหมาะสมของระยะเวลาและกำหนดการดำเนินงาน (เฉลี่ยคาดหวัง ≥ 4.50)
   - ความชัดเจนและการประชาสัมพันธ์กิจกรรมล่วงหน้า
2. **ด้านวิทยากรและการถ่ายทอดองค์ความรู้**
   - ความเชี่ยวชาญและความรอบรู้ของวิทยากรจากคณะสิ่งแวดล้อมฯ
   - ความสามารถในการสื่อสารและเปิดโอกาสให้ชุมชนซักถาม
3. **ด้านการนำไปใช้ประโยชน์และความคุ้มค่า**
   - ความรู้ที่ได้รับสามารถนำไปปรับใช้ในการจัดการสิ่งแวดล้อมชุมชนได้จริง
   - ความคุ้มค่าและประโยชน์โดยรวมต่อการพัฒนาคุณภาพชีวิต

#### ตอนที่ 3: ข้อเสนอแนะเพื่อการพัฒนาชุมชนยั่งยืน (Open-Ended)
- ประเด็นปัญหาด้านสิ่งแวดล้อมที่ชุมชนต้องการให้มหาวิทยาลัยร่วมแก้ไขเพิ่มเติม`);
      } else if (selectedTask === 'extract') {
        setAiOutput(`### ผลการสกัดข้อมูลเอกสารราชการ (Document Intelligence)
**ชื่อไฟล์:** ${selectedSampleDoc}
**ความเชื่อมั่น (Confidence Score):** 98.4%

- **เลขที่เอกสาร:** อว 78.02/0942
- **วันที่ลงนามอนุมัติ:** 28 สิงหาคม 2568
- **หน่วยงานเสนอเรื่อง:** คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล
- **ผู้รับผิดชอบโครงการ:** ดร. เกียรติศักดิ์ รัตนวิเชียร (ประธานโครงการ)
- **สถานที่จัดกิจกรรม:** หอประชุมอเนกประสงค์ มหาวิทยาลัยมหิดล วิทยาเขตลำปาง
- **กลุ่มเป้าหมาย:** ผู้นำชุมชน ผู้แทนองค์กรปกครองส่วนท้องถิ่น และประชาชน จำนวน 30 คน
- **งบประมาณที่ได้รับอนุมัติ:** 45,000 บาท (สอดคล้องกับระเบียบราชการ)
- **ตัวชี้วัดความสำเร็จ (KPI):** ผู้เข้าร่วมไม่น้อยกว่าร้อยละ 85 มีคะแนนความพึงพอใจเฉลี่ยไม่ต่ำกว่า 4.00/5.00`);
      } else if (selectedTask === 'pr') {
        setAiOutput(`### ร่างข่าวกิจกรรมประชาสัมพันธ์ (Draft PR News)
**หัวข้อข่าว:** ม.มหิดล วิทยาเขตลำปาง ผนึกกำลังชุมชน จัดกิจกรรมพัฒนาสุขภาวะและสิ่งแวดล้อมยั่งยืน
**หน่วยงาน:** คณะสิ่งแวดล้อมและทรัพยากรศาสตร์

**เนื้อข่าว:**
มหาวิทยาลัยมหิดล วิทยาเขตลำปาง โดยคณะสิ่งแวดล้อมและทรัพยากรศาสตร์ เดินหน้าขับเคลื่อนพันธกิจบริการวิชาการแก่สังคม จัดกิจกรรมส่งเสริมสุขภาวะและการจัดการสิ่งแวดล้อมชุมชนอย่างยั่งยืน ณ อาคารอเนกประสงค์ วิทยาเขตลำปาง โดยมี ดร. เกียรติศักดิ์ ประธานโครงการ เป็นประธานกล่าวเปิดงาน

กิจกรรมประกอบด้วยการบรรยายเชิงปฏิบัติการ การสาธิตการคัดแยกขยะต้นทาง และการสร้างเครือข่ายเฝ้าระวังคุณภาพสิ่งแวดล้อมในพื้นที่ โดยมีผู้แทนจากองค์กรปกครองส่วนท้องถิ่นและผู้นำชุมชนเข้าร่วมครบตามเป้าหมาย 30 คน พร้อมผลการประเมินความพึงพอใจอยู่ในระดับ "ดีมาก" (4.54 จาก 5.00 คะแนน) สะท้อนถึงความร่วมมืออันเข้มแข็งระหว่างมหาวิทยาลัยและชุมชนท้องถิ่น`);
      } else {
        setAiOutput(`### รายงานการวิเคราะห์ความสอดคล้องเชิงยุทธศาสตร์ (Strategic Alignment)
**โครงการ:** ${project.name} (${project.code})

1. **สอดคล้องกับยุทธศาสตร์มหาวิทยาลัยมหิดล:**
   - ยุทธศาสตร์ที่ 3: การบริการวิชาการเพื่อการพัฒนาสังคมอย่างยั่งยืน (Social Engagement)
   - สอดคล้อง 100% กับแผนปฏิบัติการประจำปี 2568 คณะสิ่งแวดล้อมและทรัพยากรศาสตร์

2. **สอดคล้องกับเป้าหมายการพัฒนาที่ยั่งยืน (SDGs):**
   - SDG 3: สุขภาพและความเป็นอยู่ที่ดี (Good Health and Well-being)
   - SDG 11: เมืองและชุมชนยั่งยืน (Sustainable Cities and Communities)
   - SDG 13: การรับมือการเปลี่ยนแปลงสภาพภูมิอากาศ (Climate Action)

3. **ข้อเสนอแนะเชิงนโยบาย:**
   - ควรขยายผลความร่วมมือไปยังพื้นที่ตำบลข้างเคียงในจังหวัดลำปางในปีงบประมาณ 2569`);
      }
    }, 1000);
  };

  const handleCopy = () => {
    if (aiOutput) {
      navigator.clipboard.writeText(aiOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-900 to-[#0c2340] text-white rounded-2xl p-5 shadow-sm border border-purple-800/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-400/30 flex items-center justify-center shrink-0 shadow-inner">
            <span className="material-symbols-outlined text-[28px]">psychology</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[19px] font-bold tracking-tight text-white">
                AI Assistant Studio
              </h1>
              <span className="text-[10px] font-bold bg-purple-500/20 text-purple-200 border border-purple-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Active & Ready</span>
              </span>
            </div>
            <p className="text-[12px] text-purple-200/80 mt-0.5">
              ศูนย์รวมเครื่องมือ AI ประจำมหาวิทยาลัยมหิดล วิทยาเขตลำปาง สำหรับสกัดเอกสารราชการ สร้างแบบประเมิน และสังเคราะห์รายงาน
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onNavigateToWorkflow}
            className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-[12px] flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            <span>สร้างกิจกรรมใหม่ผ่าน AI</span>
          </button>
        </div>
      </div>

      {/* 4 Engine Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">เอกสารที่ประมวลผลแล้ว</span>
            <span className="material-symbols-outlined text-[18px] text-indigo-600">
              document_scanner
            </span>
          </div>
          <div className="text-[22px] font-bold text-slate-900">
            128 <span className="text-[12px] font-normal text-slate-500">ฉบับ</span>
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">check</span>
            <span>ความแม่นยำ 98.4%</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">แบบสอบถาม AI ที่สร้าง</span>
            <span className="material-symbols-outlined text-[18px] text-purple-600">
              quiz
            </span>
          </div>
          <div className="text-[22px] font-bold text-slate-900">
            42 <span className="text-[12px] font-normal text-slate-500">ชุด</span>
          </div>
          <div className="text-[10px] text-purple-700 font-semibold">
            ทวนโดย ADMIN แล้ว 100%
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">ข่าวกิจกรรมที่ AI ช่วยร่าง</span>
            <span className="material-symbols-outlined text-[18px] text-sky-600">
              edit_note
            </span>
          </div>
          <div className="text-[22px] font-bold text-slate-900">
            36 <span className="text-[12px] font-normal text-slate-500">เรื่อง</span>
          </div>
          <div className="text-[10px] text-sky-700 font-semibold">
            เผยแพร่สู่เว็บไซต์มหาวิทยาลัยแล้ว
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">เวลาตอบสนองเฉลี่ย</span>
            <span className="material-symbols-outlined text-[18px] text-emerald-600">
              speed
            </span>
          </div>
          <div className="text-[22px] font-bold text-emerald-600">
            1.2 <span className="text-[12px] font-normal text-slate-500">วินาที</span>
          </div>
          <div className="text-[10px] text-slate-400">
            Gemini Flash Optimized
          </div>
        </div>
      </div>

      {/* Interactive AI Sandbox / Playground */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-5">
        <div>
          <h2 className="text-[15px] font-bold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-purple-700 text-[20px]">
              science
            </span>
            <span>ทดสอบสั่งการ AI Assistant (Interactive Studio Playground)</span>
          </h2>
          <p className="text-[12px] text-slate-500 mt-0.5">
            เลือกโมดูลงาน AI และเอกสารตัวอย่าง เพื่อทดสอบการประมวลผลและการสกัดข้อมูลแบบเรียลไทม์
          </p>
        </div>

        {/* Task Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {tasks.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedTask(t.id as any)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                selectedTask === t.id
                  ? 'border-purple-600 bg-purple-50/70 ring-2 ring-purple-600/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`material-symbols-outlined text-[20px] ${t.color}`}>
                  {t.icon}
                </span>
                <span className="font-bold text-slate-900 text-[12px] leading-tight">
                  {t.label}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                {t.desc}
              </p>
            </button>
          ))}
        </div>

        {/* Controls: Select Doc & Trigger */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 block">
                เอกสารตัวอย่างสำหรับประมวลผล:
              </label>
              <select
                value={selectedSampleDoc}
                onChange={(e) => setSelectedSampleDoc(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 text-[12px] focus:outline-hidden focus:border-purple-600 font-medium"
              >
                <option value="บันทึกข้อความ_ENVI_ขออนุมัติจัดกิจกรรม.pdf">
                  บันทึกข้อความ_ENVI_ขออนุมัติจัดกิจกรรม.pdf (อว 78.02/0942)
                </option>
                <option value="เอกสารโครงการฉบับอนุมัติ_ENVI_ร่วมใจพัฒนาชุมชน.pdf">
                  เอกสารโครงการฉบับอนุมัติ_ENVI_ร่วมใจพัฒนาชุมชน.pdf (TOR & งบประมาณ)
                </option>
                <option value="คำสั่งแต่งตั้งคณะทำงาน_ENVI_2568.pdf">
                  คำสั่งแต่งตั้งคณะทำงาน_ENVI_2568.pdf (บุคลากร & อาจารย์)
                </option>
              </select>
            </div>

            <button
              type="button"
              onClick={onNavigateToDocs}
              className="text-purple-700 hover:text-purple-800 text-[11.5px] font-semibold hover:underline flex items-center gap-1 self-end pb-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">folder_open</span>
              <span>เปิดคลังเอกสาร &gt;</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleRunAi}
            disabled={isProcessing}
            className="px-5 py-2 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-bold rounded-xl text-[12.5px] flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isProcessing ? 'sync' : 'play_arrow'}
            </span>
            <span>{isProcessing ? 'กำลังประมวลผล...' : 'รันการวิเคราะห์ (Execute AI)'}</span>
          </button>
        </div>

        {/* Output Console / Terminal */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-slate-800 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-purple-700 text-[16px]">
                terminal
              </span>
              <span>ผลลัพธ์จาก AI Studio (Console Output)</span>
            </span>

            {aiOutput && (
              <button
                type="button"
                onClick={handleCopy}
                className="text-[11px] text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1 px-2 py-0.5 rounded border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[13px]">
                  {copied ? 'done' : 'content_copy'}
                </span>
                <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอกผลลัพธ์'}</span>
              </button>
            )}
          </div>

          <div className="p-4 bg-slate-900 text-slate-100 rounded-xl border border-slate-800 font-mono text-[11.5px] leading-relaxed min-h-[180px] overflow-y-auto whitespace-pre-line shadow-inner">
            {isProcessing ? (
              <div className="flex items-center gap-3 text-purple-300 py-6 justify-center">
                <span className="material-symbols-outlined animate-spin text-[24px]">sync</span>
                <span className="font-sans text-[13px]">
                  กำลังอ่านและประมวลผลเอกสารด้วยโมเดล Gemini...
                </span>
              </div>
            ) : aiOutput ? (
              <div className="text-slate-200 font-sans">{aiOutput}</div>
            ) : (
              <div className="text-slate-500 py-8 text-center font-sans">
                กดปุ่ม "รันการวิเคราะห์ (Execute AI)" ด้านบนเพื่อทดสอบการทำงานของระบบ AI Assistant
              </div>
            )}
          </div>
        </div>

        {/* Governance Callout */}
        <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-start gap-2.5 text-[11.5px] text-amber-950">
          <span className="material-symbols-outlined text-amber-700 text-[18px] shrink-0 mt-0.5">
            security
          </span>
          <div className="flex-1">
            <span className="font-bold">หลักธรรมาภิบาลและการใช้งาน AI ของมหาวิทยาลัย:</span> AI ทำหน้าที่เป็น "ผู้ช่วยสกัดข้อมูลและร่างเนื้อหา" โดยระบบจะไม่ดำเนินการผูกแบบสอบถามหรือเผยแพร่ข้อมูลสู่สาธารณะโดยอัตโนมัติ ทุกขั้นตอนต้องผ่านการทวนและยืนยันโดย ADMIN ที่ได้รับมอบหมายเสมอ
          </div>
        </div>
      </div>
    </div>
  );
};
