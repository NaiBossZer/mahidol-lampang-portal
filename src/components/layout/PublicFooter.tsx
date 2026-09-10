import { MapPin } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="bg-[#0e2b42] py-8 text-white">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-bold">งานพันธกิจเพื่อสังคม คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล</p>
        <p className="mt-2 flex items-center gap-2 text-xs text-slate-300">
          <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
          พื้นที่ปฏิบัติการสบปราบ จังหวัดลำปาง
        </p>
        <p className="mt-4 text-[11px] text-slate-400">© 2026 Mahidol Social Engagement Platform</p>
      </div>
    </footer>
  );
}
