import { useState, useEffect } from "react";

export function PrivacyConsentModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasConsented = localStorage.getItem("mahidol_privacy_consent");
      if (!hasConsented) {
        setIsOpen(true);
      }
    }
  }, []);

  const handleAccept = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("mahidol_privacy_consent", "true");
    }
    setIsOpen(false);
  };

  const handleDecline = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("mahidol_privacy_consent", "false");
      window.location.href = "https://www.google.com";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="mb-4 flex items-center gap-2 text-blue-600 dark:text-blue-400">
          <svg className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            การแจ้งการคุ้มครองข้อมูลส่วนบุคคล (PDPA)
          </h3>
        </div>

        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            ก่อนตอบแบบประเมินความพึงพอใจกิจกรรมพิธีเปิดห้องการเรียนรู้ครั่งครบวงจร ขอแจ้งให้ท่านทราบว่า ข้อมูลที่ท่านให้ผ่านแบบประเมินนี้จะถูกเก็บรวบรวมและนำไปใช้เพื่อ ประเมินผลการจัดกิจกรรม สรุปผลการดำเนินงาน และนำไปปรับปรุงและพัฒนากิจกรรมการเรียนรู้ในอนาคต โดยใช้ข้อมูลเท่าที่จำเป็นและเหมาะสมกับวัตถุประสงค์ดังกล่าว
          </p>
          <p>
            ข้อมูลของท่านจะได้รับการเก็บรักษาอย่างเหมาะสมโดยจะไม่สอบถาม ชื่อ-นามสกุล และจะไม่นำข้อมูลส่วนบุคคลไปเปิดเผยต่อบุคคลภายนอกเพื่อวัตถุประสงค์อื่น ทั้งนี้ การตอบแบบประเมินเป็นไปโดยสมัครใจ
          </p>
          
          <div className="rounded-lg bg-blue-50 dark:bg-slate-800 p-3.5 text-xs text-slate-700 dark:text-slate-300 border border-blue-100 dark:border-slate-700 leading-normal">
            <p className="font-semibold text-blue-700 dark:text-blue-400 mb-1">การให้ความยินยอม</p>
            <p>
              โดยการกด <span className="font-semibold text-slate-900 dark:text-white">“เริ่มทำแบบประเมิน”</span> ถือว่าท่านรับทราบรายละเอียดการเก็บรวบรวมและใช้ข้อมูลตามที่แจ้งข้างต้น และยินยอมให้ผู้จัดกิจกรรมใช้ข้อมูลเพื่อวัตถุประสงค์ในการประเมินและพัฒนากิจกรรมดังกล่าว
            </p>
          </div>

          <p className="text-xs text-center font-medium text-slate-500 dark:text-slate-400 pt-1">
            ขอขอบคุณสำหรับความร่วมมือและความคิดเห็นของท่าน
          </p>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={handleDecline}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            ปฏิเสธ
          </button>
          <button
            onClick={handleAccept}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 shadow-sm transition-colors"
          >
            เริ่มทำแบบประเมิน
          </button>
        </div>
      </div>
    </div>
  );
}
