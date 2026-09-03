import React, { useState, useEffect, useRef } from "react";

type Map3DViewerProps = {
  modelUrl: string;
};

const FALLBACK_MODEL_URL =
  "https://huggingface.co/BossLampang/site-map-3d-MU-Lampang/resolve/main/site-map-3d.glb";

export function Map3DViewer({ modelUrl }: Map3DViewerProps) {
  const [progress, setProgress] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [shouldLoad, setShouldLoad] = useState<boolean>(false);
  const [viewerReady, setViewerReady] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLElement>(null);
  const activeModelUrl = modelUrl?.trim() || FALLBACK_MODEL_URL;

  // Lazy Loading: ตรวจจับเมื่อผู้ใช้เลื่อนหน้าจอมาถึงบริเวณนี้
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
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

  useEffect(() => {
    if (!shouldLoad) return;

    let isActive = true;
    void import("@google/model-viewer")
      .then(() => {
        if (isActive) setViewerReady(true);
      })
      .catch(() => {
        if (isActive) setHasError(true);
      });

    return () => {
      isActive = false;
    };
  }, [shouldLoad]);

  useEffect(() => {
    if (!shouldLoad || !viewerReady) return;

    const viewer = viewerRef.current;
    if (!viewer) return;

      const handleProgress = (event: Event) => {
        const totalProgress = (event as CustomEvent<{ totalProgress: number }>).detail
          ?.totalProgress;
        if (typeof totalProgress !== "number") return;

        const nextProgress = Math.round(totalProgress * 100);
        setProgress((currentProgress) =>
          currentProgress === nextProgress ? currentProgress : nextProgress
        );
      };
      const handleLoad = () => {
        setProgress(100);
        setIsLoaded(true);
      };
      const handleError = () => setHasError(true);

      viewer.addEventListener("progress", handleProgress);
      viewer.addEventListener("load", handleLoad);
      viewer.addEventListener("error", handleError);
      viewer.setAttribute("src", activeModelUrl);

      return () => {
        viewer.removeEventListener("progress", handleProgress);
        viewer.removeEventListener("load", handleLoad);
        viewer.removeEventListener("error", handleError);
        viewer.removeAttribute("src");
      };
  }, [activeModelUrl, shouldLoad, viewerReady]);

  const retryLoading = () => {
    setProgress(0);
    setIsLoaded(false);
    setHasError(false);
    setViewerReady(false);
    setShouldLoad(false);
    requestAnimationFrame(() => setShouldLoad(true));
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-112.5 md:h-137.5 bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 relative"
    >
      {shouldLoad ? (
        <model-viewer
          ref={viewerRef}
          alt="ผังพื้นที่ปฏิบัติงานและการเรียนรู้ มหิดล ลำปาง"
          loading="eager"
          auto-rotate
          camera-controls
          shadow-intensity="1.5"
          exposure="1.2"
          camera-orbit="45deg 55deg 100m"
          field-of-view="30deg"
          className="w-full h-full"
        >
          {/* แสดงสถานะโหลดหรือข้อผิดพลาดทับบน viewer */}
          {(!isLoaded || hasError) && (
            <div
              slot="poster"
              className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/95 text-white p-6 z-10"
            >
              {hasError ? (
                <>
                  <p role="alert" className="text-center text-lg font-medium text-slate-100">
                    ไม่สามารถโหลดผังบริเวณ 3D ได้
                  </p>
                  <button
                    type="button"
                    onClick={retryLoading}
                    className="mt-4 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                  >
                    ลองโหลดอีกครั้ง
                  </button>
                </>
              ) : (
                <>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-6 w-6 animate-spin rounded-full border-4 border-slate-600 border-t-amber-500" />
                    <p className="text-lg font-medium text-slate-100">
                      กำลังโหลดผังบริเวณ 3D...
                    </p>
                  </div>

                  <div
                    role="progressbar"
                    aria-label="ความคืบหน้าการโหลดโมเดล 3D"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={progress}
                    className="h-3 w-full max-w-md overflow-hidden rounded-full border border-slate-700 bg-slate-800 p-0.5"
                  >
                    <div
                      className="h-full rounded-full bg-linear-to-r from-amber-500 to-amber-400 transition-[width] duration-200 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <span className="mt-2 font-mono text-sm font-semibold text-amber-400">
                    {progress}%
                  </span>

                  <p className="mt-3 text-center text-xs text-slate-400">
                    โมเดลมีความละเอียดสูง (241 MB) อาจใช้เวลาดาวน์โหลดครู่หนึ่ง
                  </p>
                </>
              )}
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
