import React, { useState, useEffect, useRef } from "react";

export function Map3DViewer() {
  const [progress, setProgress] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [shouldLoad, setShouldLoad] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Lazy Loading: ตรวจจับเมื่อผู้ใช้เลื่อนหน้าจอมาถึงบริเวณนี้
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect(); // เลิกตรวจจับเมื่อเริ่มโหลดแล้ว
        }
      },
      { rootMargin: "100px" } // เริ่มโหลดล่วงหน้าก่อนเลื่อนมาถึง 100px
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-[450px] md:h-[550px] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 relative"
    >
      {shouldLoad ? (
        <model-viewer
          src="/models/mahidol-map.glb" // อย่าลืมเปลี่ยน Path ให้ตรงกับไฟล์ของคุณ
          alt="ผังบริเวณศูนย์การเรียนรู้ มหิดล ลำปาง"
          loading="lazy"
          auto-rotate
          camera-controls
          shadow-intensity="1.5"
          exposure="1.2"
          camera-orbit="45deg 55deg 100m"
          field-of-view="30deg"
          className="w-full h-full"
          onProgress={(e: any) => {
            const currentProgress = Math.round(e.detail.totalProgress * 100);
            setProgress(currentProgress);
            if (currentProgress >= 100) {
              setIsLoaded(true);
            }
          }}
        >
          {/* แถบแจ้งเตือนการโหลด (จะหายไปเมื่อโหลดครบ 100%) */}
          {!isLoaded && (
            <div
              slot="poster"
              className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/95 text-white p-6 z-10"
            >
              <div className="flex items-center gap-3 mb-4">
                <svg
                  className="animate-spin h-6 w-6 text-amber-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <p className="text-lg font-medium text-slate-100">
                  กำลังโหลดผังบริเวณ 3D...
                </p>
              </div>

              {/* Progress Bar Container */}
              <div className="w-full max-w-md bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div
                  className="bg-gradient-to-r from-amber-500 to-amber-400 h-full rounded-full transition-all duration-200 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* เปอร์เซ็นต์ */}
              <span className="text-sm font-semibold text-amber-400 mt-2 font-mono">
                {progress}%
              </span>

              <p className="text-xs text-slate-400 mt-3">
                โมเดลมีความละเอียดสูง (60 MB) อาจใช้เวลาดาวน์โหลดครู่หนึ่ง
              </p>
            </div>
          )}
        </model-viewer>
      ) : (
        /* หน้าพรีวิวเริ่มต้นก่อนที่ผู้ใช้จะเลื่อนหน้าจอมาถึง */
        <div className="flex flex-col items-center justify-center h-full text-slate-400">
          <p className="text-sm">เลื่อนลงมาเพื่อโหลดผังบริเวณ 3D</p>
        </div>
      )}
    </div>
  );
}
