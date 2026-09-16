import React, { useState } from 'react';

export const SystemSettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'ai' | 'integrations' | 'notifications'>('general');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states
  const [campusName, setCampusName] = useState('มหาวิทยาลัยมหิดล วิทยาเขตลำปาง');
  const [fiscalYear, setFiscalYear] = useState('2568');
  const [defaultFaculty, setDefaultFaculty] = useState('คณะสิ่งแวดล้อมและทรัพยากรศาสตร์');
  const [confidenceThreshold, setConfidenceThreshold] = useState(85);
  const [surveyScale, setSurveyScale] = useState('5');
  const [adminApprovalMandatory, setAdminApprovalMandatory] = useState(true);
  const [portalUrl, setPortalUrl] = useState('https://portal.lampang.mahidol.ac.th');
  const [docRetentionYears, setDocRetentionYears] = useState('5');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [lineAlerts, setLineAlerts] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3000);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">settings</span>
            </span>
            <h1 className="text-[17px] font-bold text-slate-900">
              ตั้งค่าระบบ (System Configuration & Governance)
            </h1>
          </div>
          <p className="text-[12px] text-slate-500 mt-1">
            กำหนดค่ามาตรฐานการทำงานของระบบพอร์ทัล กฎเกณฑ์ AI Assistant และการเชื่อมต่อเครือข่ายมหาวิทยาลัย
          </p>
        </div>

        {savedSuccess && (
          <div className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-lg text-[12px] font-semibold flex items-center gap-1.5 animate-in fade-in">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            <span>บันทึกการตั้งค่าเรียบร้อยแล้ว</span>
          </div>
        )}
      </div>

      {/* Tabs Layout */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50/70 overflow-x-auto text-[12px]">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`px-4 py-3 font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'general'
                ? 'border-[#0c2340] text-[#0c2340] bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            <span>ข้อมูลทั่วไป &amp; วิทยาเขต</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ai')}
            className={`px-4 py-3 font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'ai'
                ? 'border-[#0c2340] text-[#0c2340] bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[18px] text-purple-600">psychology</span>
            <span>เกณฑ์มาตรฐาน AI &amp; ธรรมาภิบาล</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('integrations')}
            className={`px-4 py-3 font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'integrations'
                ? 'border-[#0c2340] text-[#0c2340] bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">hub</span>
            <span>การเชื่อมต่อพอร์ทัล &amp; คลังเอกสาร</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-3 font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'notifications'
                ? 'border-[#0c2340] text-[#0c2340] bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">notifications</span>
            <span>ช่องทางการแจ้งเตือน</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="p-5 space-y-6 text-[12.5px]">
          {/* TAB 1: General */}
          {activeTab === 'general' && (
            <div className="space-y-4 max-w-2xl">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  ชื่อหน่วยงาน / วิทยาเขต
                </label>
                <input
                  type="text"
                  value={campusName}
                  onChange={(e) => setCampusName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden focus:border-sky-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    ปีงบประมาณปฏิบัติการ
                  </label>
                  <select
                    value={fiscalYear}
                    onChange={(e) => setFiscalYear(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden font-medium"
                  >
                    <option value="2567">ปีงบประมาณ 2567</option>
                    <option value="2568">ปีงบประมาณ 2568 (ปัจจุบัน)</option>
                    <option value="2569">ปีงบประมาณ 2569</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    คณะผู้จัดหลัก (Default Faculty)
                  </label>
                  <input
                    type="text"
                    value={defaultFaculty}
                    onChange={(e) => setDefaultFaculty(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  รูปแบบปฏิทินและเวลาของระบบ
                </label>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-[11.5px] space-y-1">
                  <div><strong>Timezone:</strong> Asia/Bangkok (UTC+7:00)</div>
                  <div><strong>Era:</strong> พุทธศักราช (พ.ศ.) อ้างอิงตามระเบียบสารบรรณ</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AI & Governance */}
          {activeTab === 'ai' && (
            <div className="space-y-4 max-w-2xl">
              <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-xl space-y-1.5">
                <div className="font-bold text-purple-900 flex items-center gap-1.5 text-[13px]">
                  <span className="material-symbols-outlined text-purple-700 text-[18px]">
                    verified_user
                  </span>
                  <span>กฎเหล็กธรรมาภิบาล AI (Mahidol AI Governance Policy)</span>
                </div>
                <p className="text-purple-950/80 text-[11.5px] leading-relaxed">
                  ระบบกำหนดให้ AI ทำหน้าที่เป็นเพียงผู้ช่วยร่าง (Drafting Assistant) และสกัดข้อมูลจากเอกสารทางการเท่านั้น <strong>ADMIN จะต้องเป็นผู้ตรวจสอบ ทบทวน และกดยืนยันด้วยตนเองทุกครั้ง</strong> ก่อนนำแบบสอบถามไปใช้งานหรือเผยแพร่ข่าวสู่สาธารณะ
                </p>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <div className="font-bold text-slate-900">
                    บังคับให้ ADMIN ตรวจสอบและยืนยันแบบสอบถาม &amp; ข่าว (Mandatory Admin Approval)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    ไม่อนุญาตให้ AI เผยแพร่หรือเปิดแบบประเมินโดยไม่ผ่านการอนุมัติ
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={adminApprovalMandatory}
                  onChange={(e) => setAdminApprovalMandatory(e.target.checked)}
                  className="w-5 h-5 accent-[#0c2340] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-800">
                    เกณฑ์ความเชื่อมั่นขั้นต่ำสำหรับการสกัดเอกสารราชการ (Confidence Threshold)
                  </label>
                  <span className="font-bold text-purple-700">{confidenceThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="99"
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
                <div className="text-[11px] text-slate-400 mt-0.5">
                  หากความเชื่อมั่นต่ำกว่า {confidenceThreshold}% ระบบจะแจ้งเตือนให้ ADMIN ตรวจสอบไฟล์ต้นฉบับอย่างละเอียด
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  มาตราส่วนแบบประเมินความพึงพอใจเริ่มต้น
                </label>
                <select
                  value={surveyScale}
                  onChange={(e) => setSurveyScale(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden font-medium"
                >
                  <option value="5">Likert Scale 5 ระดับ (มากที่สุด ถึง น้อยที่สุด - มาตรฐาน ม.มหิดล)</option>
                  <option value="4">Likert Scale 4 ระดับ (ไม่มีระดับปานกลาง)</option>
                  <option value="10">NPS Scale 10 ระดับ (0 ถึง 10)</option>
                </select>
              </div>
            </div>
          )}

          {/* TAB 3: Integrations */}
          {activeTab === 'integrations' && (
            <div className="space-y-4 max-w-2xl">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  URL เว็บไซต์พอร์ทัลสาธารณะ (Public Portal Domain)
                </label>
                <input
                  type="text"
                  value={portalUrl}
                  onChange={(e) => setPortalUrl(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden font-medium"
                />
                <div className="text-[11px] text-slate-400 mt-1">
                  เมื่อ ADMIN กดยืนยันเผยแพร่ ข่าวจะแสดงผลที่โดเมนนี้ทันที
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sky-600 text-[20px]">
                      lock
                    </span>
                    <span className="font-bold text-slate-800">
                      ระบบยืนยันตัวตน Mahidol SSO (OAuth 2.0)
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    เชื่อมต่อแล้ว (Connected)
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  รองรับการเข้าสู่ระบบผ่านบัญชี Google Workspace ของมหาวิทยาลัย (@mahidol.ac.th)
                </p>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  ระยะเวลาจัดเก็บเอกสารราชการในคลัง (PDF Retention)
                </label>
                <select
                  value={docRetentionYears}
                  onChange={(e) => setDocRetentionYears(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden font-medium"
                >
                  <option value="5">5 ปี (ตามระเบียบสำนักนายกรัฐมนตรีว่าด้วยงานสารบรรณ)</option>
                  <option value="10">10 ปี (เอกสารโครงการยุทธศาสตร์สำคัญ)</option>
                  <option value="99">จัดเก็บถาวร (Permanent Archive)</option>
                </select>
              </div>
            </div>
          )}

          {/* TAB 4: Notifications */}
          {activeTab === 'notifications' && (
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <div className="font-bold text-slate-900">
                    การแจ้งเตือนทางอีเมล (Email Notifications)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    ส่งการแจ้งเตือนเมื่อ AI ประมวลผลเสร็จ และเมื่อมีผู้ตอบแบบสอบถามครบตามเป้าหมาย
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-5 h-5 accent-[#0c2340] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <div className="font-bold text-slate-900">
                    การแจ้งเตือนผ่าน LINE Official Notify (ม.มหิดล ลำปาง)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    ส่งสรุปยอดตอบแบบประเมินรายวันเข้ากลุ่มประสานงานโครงการ
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={lineAlerts}
                  onChange={(e) => setLineAlerts(e.target.checked)}
                  className="w-5 h-5 accent-[#0c2340] cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => {
                setCampusName('มหาวิทยาลัยมหิดล วิทยาเขตลำปาง');
                setFiscalYear('2568');
                setConfidenceThreshold(85);
              }}
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold rounded-lg text-[12px] transition-colors cursor-pointer"
            >
              คืนค่าเริ่มต้น (Reset Defaults)
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-[#0c2340] hover:bg-[#163a66] text-white font-bold rounded-lg text-[12px] shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">save</span>
              <span>บันทึกการตั้งค่า</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
