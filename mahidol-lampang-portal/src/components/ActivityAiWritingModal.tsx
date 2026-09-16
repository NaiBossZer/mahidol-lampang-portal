import React, { useState } from 'react';
import { AdminActivityItem, ActivityReport } from '../types';
import { SAMPLE_DEFAULT_REPORT } from '../data/adminWorkflow';

interface ActivityAiWritingModalProps {
  isOpen: boolean;
  activity: AdminActivityItem;
  currentReport: ActivityReport;
  onClose: () => void;
  onApplyDraft: (draft: ActivityReport) => void;
}

export const ActivityAiWritingModal: React.FC<ActivityAiWritingModalProps> = ({
  isOpen,
  activity,
  currentReport,
  onClose,
  onApplyDraft,
}) => {
  const [tone, setTone] = useState<'official' | 'strategic' | 'community'>('official');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState<ActivityReport | null>(null);

  if (!isOpen) return null;

  const handleGenerate = () => {
    setIsGenerating(true);
    setGeneratedDraft(null);

    // Simulate AI synthesis with real context data
    setTimeout(() => {
      let draftTitle = `ม.มหิดล วิทยาเขตลำปาง จัดกิจกรรม "${activity.name}" ขับเคลื่อนสุขภาวะและสิ่งแวดล้อมยั่งยืน`;
      let draftSummary = `คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล วิทยาเขตลำปาง ร่วมกับชุมชนท้องถิ่น จัดกิจกรรม ${activity.name} ณ ${activity.location} เมื่อ ${activity.date} โดยมีผู้เข้าร่วมตามเป้าหมาย ${activity.targetCount} คน พร้อมผลประเมินความพึงพอใจสูงถึง 4.54/5.00 (ระดับดีมาก)`;
      let draftContent = `เมื่อวันที่ ${activity.date} คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล วิทยาเขตลำปาง ได้จัดกิจกรรม "${activity.name}" ภายใต้${activity.projectName} ณ ${activity.location} โดยมี ${activity.responsiblePerson} เป็นประธานกล่าวเปิดงาน

การจัดกิจกรรมครั้งนี้มีวัตถุประสงค์เพื่อส่งเสริมความตระหนักรู้และสร้างการมีส่วนร่วมของชุมชนท้องถิ่นในการจัดการสิ่งแวดล้อมอย่างยั่งยืน โดยบูรณาการองค์ความรู้จากมหาวิทยาลัยสู่การปฏิบัติจริงในพื้นที่ มีการจัดกิจกรรมบรรยาย การประชุมเชิงปฏิบัติการแบบมีส่วนร่วม และการระดมความคิดเห็นจากผู้นำชุมชนและประชาชน

ตลอดการดำเนินงาน คณะทำงานได้อำนวยความสะดวกและจัดกิจกรรมตามกำหนดการที่ได้รับอนุมัติในเอกสารราชการอย่างครบถ้วน โดยได้รับความร่วมมือเป็นอย่างดียิ่งจากหน่วยงานภาคีเครือข่าย`;

      let draftResults = `มีผู้เข้าร่วมกิจกรรมทั้งสิ้น ${activity.targetCount} คน ครบถ้วนตามเป้าหมายที่ระบุในแบบเสนอโครงการ จากการสำรวจความพึงพอใจผ่านระบบประเมิน AI-assisted Survey มีผู้ตอบแบบสอบถาม 28 คน (คิดเป็น 93.3%) พบว่าภาพรวมความพึงพอใจอยู่ในระดับ "ดีมาก" (คะแนนเฉลี่ย 4.54 จาก 5.00 คะแนน)`;
      let draftImpact = `เกิดเครือข่ายความร่วมมือด้านการจัดการสิ่งแวดล้อมระหว่างมหาวิทยาลัยมหิดล วิทยาเขตลำปาง และชุมชนในพื้นที่ พร้อมได้ข้อเสนอเชิงนโยบายระดับท้องถิ่น 3 ประการสำหรับการพัฒนาต่อยอดในปีงบประมาณถัดไป`;

      if (tone === 'strategic') {
        draftTitle = `รายงานสรุปผลสัมฤทธิ์เชิงยุทธศาสตร์: ${activity.name} ประจำปีงบประมาณ 2568`;
        draftSummary = `สรุปผลผลิตและผลลัพธ์ตามตัวชี้วัด (KPIs) ของกิจกรรม ${activity.name} บรรลุเป้าหมายกลุ่มเป้าหมายเชิงปริมาณ 100% และระดับความพึงพอใจเชิงคุณภาพ 90.8%`;
      } else if (tone === 'community') {
        draftTitle = `พลังชุมชนร่วมใจ! ม.มหิดล ลำปาง ผนึกกำลังชาวบ้านในกิจกรรม "${activity.name}"`;
        draftSummary = `บรรยากาศความร่วมมืออันอบอุ่นระหว่างคณาจารย์ บุคลากร และชาวชุมชนตำบลแม่ทะ ในการร่วมกันสร้างสรรค์สิ่งแวดล้อมน่าอยู่และยั่งยืน`;
      }

      setGeneratedDraft({
        ...currentReport,
        title: draftTitle,
        summary: draftSummary,
        content: draftContent,
        performanceResults: draftResults,
        outcomesAndImpact: draftImpact,
        author: `ฝ่ายสื่อสารองค์กรและประชาสัมพันธ์ ${activity.faculty}`,
        isAiAssisted: true,
        aiAssistedDate: 'วันนี้ ' + new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.',
      });

      setIsGenerating(false);
    }, 1200);
  };

  const handleApply = () => {
    if (generatedDraft) {
      onApplyDraft(generatedDraft);
    } else {
      onApplyDraft({
        ...SAMPLE_DEFAULT_REPORT,
        title: `ม.มหิดล วิทยาเขตลำปาง จัดกิจกรรม "${activity.name}" ขับเคลื่อนสุขภาวะและสิ่งแวดล้อมยั่งยืน`,
        isAiAssisted: true,
        aiAssistedDate: 'วันนี้ ' + new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.',
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-[#0c2340] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-400/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">auto_awesome</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[15px] font-bold tracking-tight text-white">
                  AI Writing Assistant (ผู้ช่วยเขียนข่าวกิจกรรม)
                </h3>
                <span className="text-[9.5px] font-bold bg-purple-400/20 text-purple-200 border border-purple-300/30 px-2 py-0.5 rounded-full">
                  Gemini-Powered
                </span>
              </div>
              <p className="text-[11px] text-purple-200/80">
                ดึงข้อมูลกิจกรรม เอกสารราชการ และสถิติผลประเมินมาร่างเนื้อหาข่าวโดยอัตโนมัติ
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-[12px]">
          {/* Context Sources Indicator */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-purple-600 text-[16px]">
                  database
                </span>
                <span>Context ข้อมูลที่ AI นำมาประมวลผล (Verified Data Sources):</span>
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                เชื่อมต่อครบถ้วน
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10.5px]">
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-400 block">ข้อมูลกิจกรรม:</span>
                <span className="font-semibold text-slate-800 truncate block">
                  {activity.name}
                </span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-400 block">เอกสารราชการ:</span>
                <span className="font-semibold text-purple-700 truncate block">
                  {activity.officialDocs.length} ฉบับ (TOR, บันทึกข้อความ)
                </span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-400 block">วันจัด & ผู้รับผิดชอบ:</span>
                <span className="font-semibold text-slate-800 truncate block">
                  {activity.date}
                </span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-400 block">ผลการประเมิน (Survey):</span>
                <span className="font-semibold text-emerald-700 block">
                  4.54/5.00 (ดีมาก • 93.3%)
                </span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-400 block">กลุ่มเป้าหมาย:</span>
                <span className="font-semibold text-slate-800 block">
                  {activity.targetCount} คน (ผู้นำชุมชน, อบต.)
                </span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-400 block">รูปภาพกิจกรรม:</span>
                <span className="font-semibold text-sky-700 block">
                  {activity.photos?.length || 0} ภาพ
                </span>
              </div>
            </div>
          </div>

          {/* Tone / Writing Style Selector */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 flex items-center gap-1.5 text-[12px]">
              <span className="material-symbols-outlined text-slate-500 text-[16px]">tune</span>
              <span>เลือกรูปแบบและโทนการเขียน (Writing Style):</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setTone('official')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  tone === 'official'
                    ? 'border-purple-600 bg-purple-50/60 ring-2 ring-purple-600/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-slate-900 text-[12px]">ข่าวประชาสัมพันธ์ทางการ</div>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  ภาษาทางการ เหมาะสำหรับลงข่าวเว็บไซต์มหาวิทยาลัยและสื่อสารภายนอก
                </p>
              </button>

              <button
                type="button"
                onClick={() => setTone('strategic')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  tone === 'strategic'
                    ? 'border-purple-600 bg-purple-50/60 ring-2 ring-purple-600/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-slate-900 text-[12px]">สรุปผลสัมฤทธิ์ยุทธศาสตร์</div>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  เน้นตัวชี้วัด KPIs ความคุ้มค่า และการบรรลุเป้าหมายเสนอผู้บริหาร
                </p>
              </button>

              <button
                type="button"
                onClick={() => setTone('community')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  tone === 'community'
                    ? 'border-purple-600 bg-purple-50/60 ring-2 ring-purple-600/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-slate-900 text-[12px]">เรื่องเล่าเพื่อชุมชน</div>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  เน้นความร่วมมือ การมีส่วนร่วม บรรยากาศ และพลังของประชาชน
                </p>
              </button>
            </div>
          </div>

          {/* Generate Button or Draft Preview */}
          <div className="space-y-3">
            {!generatedDraft && !isGenerating && (
              <div className="p-6 text-center border-2 border-dashed border-purple-200 bg-purple-50/40 rounded-xl space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">psychology</span>
                </div>
                <div className="font-bold text-slate-900 text-[13px]">
                  พร้อมประมวลผลข้อมูลและร่างข่าวกิจกรรม
                </div>
                <p className="text-[11px] text-slate-500 max-w-md mx-auto">
                  AI จะสังเคราะห์ข้อมูลจากบันทึกข้อความราชการ สถิติผู้เข้าร่วม และผลประเมิน Likert 5 ระดับ เพื่อร่างเนื้อหาที่ถูกต้องตามระเบียบราชการ
                </p>
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl text-[13px] inline-flex items-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                  <span>เริ่มสังเคราะห์เนื้อหา (Generate Draft)</span>
                </button>
              </div>
            )}

            {isGenerating && (
              <div className="p-8 text-center bg-purple-50/60 border border-purple-200 rounded-xl space-y-3">
                <div className="w-10 h-10 mx-auto rounded-full bg-purple-600 text-white flex items-center justify-center animate-spin">
                  <span className="material-symbols-outlined text-[20px]">sync</span>
                </div>
                <div className="font-bold text-purple-900 text-[13px]">
                  AI กำลังวิเคราะห์ข้อมูลและร่างเนื้อหา...
                </div>
                <div className="text-[11px] text-purple-700 space-y-1">
                  <div>• กำลังอ่านข้อความจากเอกสารราชการ อว 78.02/0942</div>
                  <div>• สรุปคะแนนผลประเมินความพึงพอใจ 4.54/5.00 คะแนน</div>
                  <div>• เรียบเรียงภาษาประชาสัมพันธ์ตามระเบียบมหาวิทยาลัยมหิดล</div>
                </div>
              </div>
            )}

            {generatedDraft && !isGenerating && (
              <div className="space-y-3 bg-white border border-purple-200 rounded-xl p-4 shadow-2xs">
                <div className="flex items-center justify-between border-b border-purple-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-600 text-[18px]">
                      check_circle
                    </span>
                    <span className="font-bold text-purple-950 text-[13px]">
                      ผลการร่างเนื้อหาโดย AI สำเร็จ (Draft Ready)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerate}
                    className="text-[11px] text-purple-700 hover:text-purple-800 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">refresh</span>
                    <span>สร้างใหม่ (Regenerate)</span>
                  </button>
                </div>

                {/* Draft Content Preview Cards */}
                <div className="space-y-2.5 text-[11.5px]">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide">
                      หัวข้อข่าวที่ AI ร่าง:
                    </span>
                    <div className="p-2.5 bg-slate-50 rounded-lg font-bold text-slate-900 border border-slate-200 text-[12.5px]">
                      {generatedDraft.title}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide">
                      สรุปข่าว (Summary):
                    </span>
                    <div className="p-2.5 bg-slate-50 rounded-lg text-slate-700 border border-slate-200 leading-relaxed">
                      {generatedDraft.summary}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide">
                      ผลการดำเนินงาน & ผลสัมฤทธิ์ (KPIs & Results):
                    </span>
                    <div className="p-2.5 bg-emerald-50/50 rounded-lg text-emerald-950 border border-emerald-200 leading-relaxed">
                      {generatedDraft.performanceResults}
                    </div>
                  </div>
                </div>

                {/* Important Governance Rule Note */}
                <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-[10.5px] flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-700 text-[16px]">
                    gavel
                  </span>
                  <span>
                    <strong>ข้อกำหนดสำคัญ:</strong> AI ทำหน้าที่ "ช่วยร่างเนื้อหา" เท่านั้น ADMIN จะเป็นผู้ตรวจสอบ แก้ไข และกดยืนยันเผยแพร่ด้วยตนเองในขั้นตอนถัดไป (AI ไม่มีสิทธิ์เผยแพร่เอง)
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-medium rounded-lg text-[12px] transition-colors cursor-pointer"
          >
            ยกเลิก
          </button>

          <button
            type="button"
            onClick={handleApply}
            disabled={isGenerating}
            className="px-4 py-2 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-bold rounded-lg text-[12px] flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">assignment_turned_in</span>
            <span>นำเนื้อหาที่ AI ร่างไปใส่ในฟอร์ม (Apply Draft)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
