import React, { useCallback, useEffect, useRef, useState } from "react";

type Map3DViewerProps = {
  modelUrl?: string;
};

type CameraPreset = "overview" | "top" | "low";

const FALLBACK_MODEL_URL =
  "https://huggingface.co/BossLampang/site-map-3d-MU-Lampang/resolve/main/site-map-3d.glb";
const CAMERA_PRESETS: Record<CameraPreset, string> = {
  overview: "45deg 55deg 100m",
  top: "0deg 15deg 100m",
  low: "35deg 75deg 100m",
};

export function Map3DViewer({ modelUrl }: Map3DViewerProps) {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [viewerReady, setViewerReady] = useState(false);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("overview");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLElement>(null);
  const activeModelUrl = modelUrl?.trim() || FALLBACK_MODEL_URL;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "160px" },
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoad) return;
    let active = true;
    void import("@google/model-viewer")
      .then(() => {
        if (active) setViewerReady(true);
      })
      .catch(() => {
        if (active) setHasError(true);
      });
    return () => {
      active = false;
    };
  }, [shouldLoad]);

  useEffect(() => {
    if (!shouldLoad || !viewerReady) return;
    const viewer = viewerRef.current;
    if (!viewer) return;

    const handleProgress = (event: Event) => {
      const value = (event as CustomEvent<{ totalProgress: number }>).detail?.totalProgress;
      if (typeof value === "number") setProgress(Math.round(value * 100));
    };
    const handleLoad = () => {
      setProgress(100);
      setIsLoaded(true);
      setHasError(false);
    };
    const handleError = () => setHasError(true);

    viewer.addEventListener("progress", handleProgress);
    viewer.addEventListener("load", handleLoad);
    viewer.addEventListener("error", handleError);
    viewer.setAttribute("src", activeModelUrl);
    viewer.setAttribute("camera-orbit", CAMERA_PRESETS.overview);
    return () => {
      viewer.removeEventListener("progress", handleProgress);
      viewer.removeEventListener("load", handleLoad);
      viewer.removeEventListener("error", handleError);
      viewer.removeAttribute("src");
    };
  }, [activeModelUrl, shouldLoad, viewerReady]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const setCamera = useCallback((preset: CameraPreset) => {
    setCameraPreset(preset);
    viewerRef.current?.setAttribute("camera-orbit", CAMERA_PRESETS[preset]);
  }, []);

  const retryLoading = useCallback(() => {
    setProgress(0);
    setIsLoaded(false);
    setHasError(false);
    setViewerReady(false);
    setShouldLoad(false);
    window.requestAnimationFrame(() => setShouldLoad(true));
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const container = containerRef.current;
    if (!container) return;
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await container.requestFullscreen();
    } catch {
      // Fullscreen can be unavailable in embedded or restricted browser contexts.
    }
  }, []);

  const buttonClass =
    "inline-flex min-h-10 items-center justify-center rounded-lg border border-white/15 bg-slate-800/90 px-3 text-xs font-semibold text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400";

  return (
    <div
      ref={containerRef}
      className="relative h-[min(72vh,680px)] min-h-[420px] w-full overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl"
      aria-label="โมเดลสามมิติพื้นที่มหาวิทยาลัยมหิดล วิทยาเขตลำปาง"
    >
      {shouldLoad ? (
        <model-viewer
          ref={viewerRef}
          alt="โมเดลสามมิติผังพื้นที่ปฏิบัติงานและการเรียนรู้ มหิดล ลำปาง"
          loading="eager"
          reveal="auto"
          camera-controls
          touch-action="pan-y"
          interaction-prompt="auto"
          shadow-intensity="1.2"
          exposure="1.05"
          camera-orbit={CAMERA_PRESETS.overview}
          field-of-view="30deg"
          min-camera-orbit="auto 5deg 20m"
          max-camera-orbit="auto 90deg 220m"
          className="h-full w-full bg-slate-950"
          style={{ backgroundColor: "#07111f" }}
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center text-slate-300">
          <span className="text-4xl" aria-hidden="true">⌖</span>
          <p className="text-sm font-semibold">โมเดลแผนที่พื้นที่ 3 มิติ</p>
          <p className="max-w-sm text-xs leading-6 text-slate-400">
            ระบบจะเริ่มโหลดโมเดลเมื่อพื้นที่แสดงผลอยู่บนหน้าจอ เพื่อลดการใช้ข้อมูลโดยไม่จำเป็น
          </p>
          <button type="button" className={buttonClass} onClick={() => setShouldLoad(true)}>
            โหลดโมเดล 3D
          </button>
        </div>
      )}

      {shouldLoad && (!isLoaded || hasError) && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/95 p-6 text-white">
          {hasError ? (
            <>
              <p role="alert" className="text-center text-lg font-semibold">ไม่สามารถโหลดโมเดล 3D ได้</p>
              <p className="mt-2 max-w-md text-center text-xs leading-6 text-slate-400">
                ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต แล้วลองโหลดไฟล์โมเดลต้นฉบับอีกครั้ง
              </p>
              <button type="button" onClick={retryLoading} className="mt-4 rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-amber-400">
                ลองโหลดอีกครั้ง
              </button>
            </>
          ) : (
            <>
              <div className="mb-4 flex items-center gap-3">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-600 border-t-amber-400" />
                <p className="text-sm font-semibold">กำลังโหลดโมเดลพื้นที่ 3D...</p>
              </div>
              <div role="progressbar" aria-label="ความคืบหน้าการโหลดโมเดล" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} className="h-2.5 w-full max-w-sm overflow-hidden rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-amber-400 transition-[width] duration-200" style={{ width: `${progress}%` }} />
              </div>
              <span className="mt-2 font-mono text-sm text-amber-300">{progress}%</span>
              <p className="mt-3 text-center text-xs text-slate-400">ไฟล์ต้นฉบับมีขนาดประมาณ 241 MB การโหลดครั้งแรกอาจใช้เวลา</p>
            </>
          )}
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-wrap items-start justify-between gap-3 bg-gradient-to-b from-slate-950/90 to-transparent p-3 sm:p-4">
        <div className="rounded-lg border border-white/10 bg-slate-900/75 px-3 py-2 text-white backdrop-blur">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-300">Mahidol Lampang</p>
          <p className="mt-0.5 text-sm font-bold">3D Campus Model</p>
          <p className="text-[10px] text-slate-300">โมเดลพื้นที่ต้นฉบับ</p>
        </div>
        <div className="pointer-events-auto flex flex-wrap justify-end gap-2">
          <button type="button" className={buttonClass} onClick={() => setCamera("overview")} aria-pressed={cameraPreset === "overview"}>มุมเฉียง</button>
          <button type="button" className={buttonClass} onClick={() => setCamera("top")} aria-pressed={cameraPreset === "top"}>มุมบน</button>
          <button type="button" className={buttonClass} onClick={() => setCamera("low")} aria-pressed={cameraPreset === "low"}>มุมระดับต่ำ</button>
          <button type="button" className={buttonClass} onClick={toggleFullscreen} aria-pressed={isFullscreen}>
            {isFullscreen ? "ออกจากเต็มจอ" : "เต็มจอ"}
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-wrap items-end justify-between gap-2 bg-gradient-to-t from-slate-950/90 to-transparent px-4 pb-4 pt-10">
        <p className="text-[11px] text-slate-300">ลากเพื่อหมุน · เลื่อนเพื่อซูม · ใช้สองนิ้วเพื่อเลื่อนพื้นที่</p>
        <span className="rounded-md border border-white/10 bg-slate-900/75 px-2 py-1 text-[10px] text-slate-300">3D MODEL · GLB</span>
      </div>
    </div>
  );
}
