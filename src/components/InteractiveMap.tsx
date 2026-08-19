import React from "react";

export function InteractiveMap() {
  return (
    <div className="max-w-6xl mx-auto px-4 space-y-4">
      <div className="text-center space-y-1">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
          แผนผังกิจกรรม ศูนย์ฯ อ.สบปราบ จ.ลำปาง
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          คลิกเลือกหมายเลขบนแผนที่เพื่อดูรายละเอียดกิจกรรม
        </p>
      </div>

      {/* Container หลัก: กำหนด relative และความสูงขั้นต่ำเพื่อป้องกันการยุบตัว */}
      <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md bg-slate-100 dark:bg-slate-900 min-h-[350px] sm:min-h-[500px]">
        {/* เรียกใช้รูปภาพผ่าน Absolute Path สไตล์เดียวกับโลโก้ MU */}
        <img
          src="/map-sobprab.png"
          alt="แผนผังศูนย์ฯ สบปราบ"
          className="w-full h-auto object-cover block"
        />

        {/* ตัวอย่างการวางหมุด interactive (ปรับ positionตามพิกัดจริง) */}
        {/* 
        <button className="absolute top-[30%] left-[25%] bg-red-600 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-lg hover:scale-110 transition-transform">
          1
        </button> 
        */}
      </div>
    </div>
  );
}
