import { useCallback, useMemo, useState, type ChangeEvent } from "react";

const MODEL_URL =
  "https://huggingface.co/BossLampang/site-map-3d-MU-Lampang/resolve/main/site-map-3d.glb";

type GltfNode = {
  name?: string;
  mesh?: number;
  children?: number[];
  translation?: number[];
  rotation?: number[];
  scale?: number[];
};
type GltfDocument = {
  scene?: number;
  scenes?: Array<{ name?: string; nodes?: number[] }>;
  nodes?: GltfNode[];
  meshes?: Array<{ name?: string; primitives?: Array<{ attributes?: Record<string, number>; material?: number; mode?: number }> }>;
  materials?: Array<{ name?: string }>;
  textures?: Array<{ name?: string; source?: number }>;
  images?: Array<{ name?: string; mimeType?: string; uri?: string }>;
  accessors?: Array<{ min?: number[]; max?: number[]; count?: number; type?: string }>;
};

type AuditReport = {
  source: string;
  fileSize?: number;
  sceneCount: number;
  activeSceneName: string;
  nodeCount: number;
  meshCount: number;
  primitiveCount: number;
  materialCount: number;
  textureCount: number;
  imageCount: number;
  accessors: Array<{ index: number; type?: string; count?: number; min?: number[]; max?: number[] }>;
  nodes: Array<{
    index: number;
    name: string;
    mesh?: number;
    children: number[];
    translation?: number[];
    rotation?: number[];
    scale?: number[];
  }>;
  meshes: Array<{ index: number; name: string; primitiveCount: number; primitives: Array<{ material?: number; attributes: string[]; mode?: number }> }>;
  materials: Array<{ index: number; name: string }>;
  textures: Array<{ index: number; name: string; source?: number }>;
  images: Array<{ index: number; name: string; mimeType?: string; uri?: string }>;
};

function parseGlbJson(buffer: ArrayBuffer): GltfDocument {
  const view = new DataView(buffer);
  if (buffer.byteLength < 20 || view.getUint32(0, true) !== 0x46546c67) {
    throw new Error("ไฟล์ไม่ใช่ GLB 2.0 หรือส่วนหัวไฟล์ไม่สมบูรณ์");
  }
  const version = view.getUint32(4, true);
  if (version !== 2) throw new Error(`รองรับ GLB 2.0 เท่านั้น (พบเวอร์ชัน ${version})`);
  const declaredLength = view.getUint32(8, true);
  const jsonLength = view.getUint32(12, true);
  const jsonType = view.getUint32(16, true);
  if (jsonType !== 0x4e4f534a || jsonLength < 2 || 20 + jsonLength > buffer.byteLength) {
    throw new Error("ไม่พบ JSON chunk ที่สมบูรณ์ในไฟล์ GLB");
  }
  const jsonText = new TextDecoder().decode(new Uint8Array(buffer, 20, jsonLength)).replace(/[\u0000\u0020]+$/g, "");
  const doc = JSON.parse(jsonText) as GltfDocument;
  if (declaredLength < 20 + jsonLength) throw new Error("ขนาดที่ระบุใน GLB ไม่ถูกต้อง");
  return doc;
}

function makeReport(doc: GltfDocument, source: string, fileSize?: number): AuditReport {
  const nodes = doc.nodes ?? [];
  const meshes = doc.meshes ?? [];
  const activeScene = doc.scenes?.[doc.scene ?? 0];
  const report: AuditReport = {
    source,
    fileSize,
    sceneCount: doc.scenes?.length ?? 0,
    activeSceneName: activeScene?.name ?? `Scene ${doc.scene ?? 0}`,
    nodeCount: nodes.length,
    meshCount: meshes.length,
    primitiveCount: meshes.reduce((sum, mesh) => sum + (mesh.primitives?.length ?? 0), 0),
    materialCount: doc.materials?.length ?? 0,
    textureCount: doc.textures?.length ?? 0,
    imageCount: doc.images?.length ?? 0,
    accessors: (doc.accessors ?? []).map((accessor, index) => ({ index, type: accessor.type, count: accessor.count, min: accessor.min, max: accessor.max })),
    nodes: nodes.map((node, index) => ({
      index,
      name: node.name?.trim() || `Node ${index}`,
      mesh: node.mesh,
      children: node.children ?? [],
      translation: node.translation,
      rotation: node.rotation,
      scale: node.scale,
    })),
    meshes: meshes.map((mesh, index) => ({
      index,
      name: mesh.name?.trim() || `Mesh ${index}`,
      primitiveCount: mesh.primitives?.length ?? 0,
      primitives: (mesh.primitives ?? []).map((primitive) => ({
        material: primitive.material,
        attributes: Object.keys(primitive.attributes ?? {}),
        mode: primitive.mode,
      })),
    })),
    materials: (doc.materials ?? []).map((material, index) => ({ index, name: material.name?.trim() || `Material ${index}` })),
    textures: (doc.textures ?? []).map((texture, index) => ({ index, name: texture.name?.trim() || `Texture ${index}`, source: texture.source })),
    images: (doc.images ?? []).map((image, index) => ({ index, name: image.name?.trim() || `Image ${index}`, mimeType: image.mimeType, uri: image.uri })),
  };
  return report;
}

async function readRemoteHeader(): Promise<AuditReport> {
  const headerResponse = await fetch(MODEL_URL, { headers: { Range: "bytes=0-19" } });
  if (headerResponse.status !== 206) {
    await headerResponse.body?.cancel();
    throw new Error("แหล่งไฟล์ไม่รองรับการอ่านแบบ Range request เพื่อประหยัด bandwidth กรุณาเลือกไฟล์ GLB จากเครื่องแทน");
  }
  const header = await headerResponse.arrayBuffer();
  if (header.byteLength < 20) throw new Error("อ่านส่วนหัว GLB จากแหล่งไฟล์ไม่ครบ");
  const view = new DataView(header);
  if (view.getUint32(0, true) !== 0x46546c67 || view.getUint32(4, true) !== 2) {
    throw new Error("ไฟล์ต้นทางไม่ใช่ GLB 2.0");
  }
  const totalLength = view.getUint32(8, true);
  const jsonLength = view.getUint32(12, true);
  const jsonEnd = 19 + jsonLength;
  const jsonResponse = await fetch(MODEL_URL, { headers: { Range: `bytes=20-${jsonEnd}` } });
  if (jsonResponse.status !== 206) {
    await jsonResponse.body?.cancel();
    throw new Error("เซิร์ฟเวอร์ไม่อนุญาตให้อ่าน JSON chunk แบบบางส่วน กรุณาเลือกไฟล์ GLB จากเครื่องแทน");
  }
  const jsonChunk = await jsonResponse.arrayBuffer();
  const combined = new Uint8Array(20 + jsonChunk.byteLength);
  combined.set(new Uint8Array(header), 0);
  combined.set(new Uint8Array(jsonChunk), 20);
  return makeReport(parseGlbJson(combined.buffer), "Hugging Face (HTTP Range)", totalLength);
}

async function readLocalFile(file: File): Promise<AuditReport> {
  const header = await file.slice(0, 20).arrayBuffer();
  if (header.byteLength < 20) throw new Error("ไฟล์มีขนาดเล็กเกินไปหรือไม่ใช่ GLB");
  const jsonLength = new DataView(header).getUint32(12, true);
  const jsonChunk = await file.slice(20, 20 + jsonLength).arrayBuffer();
  const combined = new Uint8Array(20 + jsonChunk.byteLength);
  combined.set(new Uint8Array(header), 0);
  combined.set(new Uint8Array(jsonChunk), 20);
  return makeReport(parseGlbJson(combined.buffer), file.name, file.size);
}

function formatBytes(bytes?: number) {
  if (!bytes) return "ไม่ทราบ";
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function ModelAuditPanel() {
  const [report, setReport] = useState<AuditReport | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);

  const runRemoteAudit = useCallback(async () => {
    setBusy(true);
    setError("");
    try {
      setReport(await readRemoteHeader());
      setExpanded(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "ตรวจสอบโมเดลไม่สำเร็จ");
    } finally {
      setBusy(false);
    }
  }, []);

  const onLocalFile = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      setReport(await readLocalFile(file));
      setExpanded(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "อ่านไฟล์ไม่สำเร็จ");
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  }, []);

  const downloadReport = useCallback(() => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "mahidol-lampang-glb-audit.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }, [report]);

  const hierarchy = useMemo(() => {
    if (!report) return [];
    const nodes = report.nodes;
    const roots = report.sceneCount ? [] : nodes.filter((node) => !nodes.some((parent) => parent.children.includes(node.index))).map((node) => node.index);
    const sceneRoots = roots.length ? roots : nodes.map((node) => node.index).filter((index) => !nodes.some((node) => node.children.includes(index)));
    const result: Array<{ index: number; depth: number }> = [];
    const visited = new Set<number>();
    const walk = (index: number, depth: number) => {
      if (visited.has(index) || !nodes[index]) return;
      visited.add(index);
      result.push({ index, depth });
      nodes[index].children.forEach((child) => walk(child, depth + 1));
    };
    sceneRoots.forEach((root) => walk(root, 0));
    nodes.forEach((node) => { if (!visited.has(node.index)) walk(node.index, 0); });
    return result;
  }, [report]);

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" aria-labelledby="model-audit-title">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-amber-600">Digital Twin · Model diagnostics</p>
          <h2 id="model-audit-title" className="mt-1 text-lg font-black text-slate-900">ตรวจสอบโครงสร้างโมเดล 3D</h2>
          <p className="mt-1 max-w-3xl text-xs leading-6 text-slate-600">
            อ่านเฉพาะ JSON metadata ภายใน GLB เพื่อสำรวจ Scene, Node, Mesh และ Material โดยไม่ดาวน์โหลด geometry ทั้งไฟล์ซ้ำ
          </p>
        </div>
        <button type="button" onClick={runRemoteAudit} disabled={busy} className="min-h-10 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-700 disabled:opacity-50">
          {busy ? "กำลังตรวจสอบ..." : "ตรวจสอบโมเดลต้นฉบับ"}
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-2 rounded-xl bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-slate-600">หากเซิร์ฟเวอร์ไม่รองรับ Range request สามารถเลือกไฟล์ GLB จากเครื่องได้ ระบบจะอ่านเฉพาะส่วน metadata เช่นกัน</p>
        <label className="inline-flex min-h-9 cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-100">
          เลือกไฟล์ GLB จากเครื่อง
          <input type="file" accept=".glb,model/gltf-binary" className="sr-only" onChange={onLocalFile} />
        </label>
      </div>

      {error && <p role="alert" className="mt-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs leading-5 text-rose-800">{error}</p>}

      {report && (
        <div className="mt-4">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {[
              ["ขนาดไฟล์", formatBytes(report.fileSize)],
              ["Scenes", report.sceneCount],
              ["Nodes", report.nodeCount],
              ["Meshes", report.meshCount],
              ["Primitives", report.primitiveCount],
              ["Materials", report.materialCount],
              ["Accessors", report.accessors.length],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-slate-200 p-3">
                <p className="text-[10px] font-semibold text-slate-500">{label}</p>
                <p className="mt-1 text-lg font-black tabular-nums text-slate-900">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-[11px] text-slate-500">แหล่งข้อมูล: {report.source} · Textures {report.textureCount} · Images {report.imageCount}</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => setExpanded((value) => !value)} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">{expanded ? "ซ่อนรายละเอียด" : "แสดงรายละเอียด"}</button>
              <button type="button" onClick={downloadReport} className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400">ดาวน์โหลด JSON</button>
            </div>
          </div>
          {expanded && (
            <div className="mt-3 grid gap-4 lg:grid-cols-2">
              <div className="min-w-0 rounded-xl border border-slate-200 p-3">
                <h3 className="text-sm font-bold text-slate-900">Scene hierarchy / Nodes</h3>
                <p className="mt-1 text-[10px] text-slate-500">Scene หลัก: {report.activeSceneName}</p>
                <div className="mt-2 max-h-80 overflow-auto rounded-lg bg-slate-950 p-3 font-mono text-[10px] leading-5 text-slate-200">
                  {hierarchy.map(({ index, depth }) => {
                    const node = report.nodes[index];
                    return <div key={index} style={{ paddingLeft: Math.min(depth, 12) * 12 }} className="whitespace-nowrap"><span className="text-slate-500">#{index}</span> {node.name}{node.mesh !== undefined ? <span className="text-amber-300"> · mesh {node.mesh}</span> : null}</div>;
                  })}
                </div>
              </div>
              <div className="min-w-0 rounded-xl border border-slate-200 p-3">
                <h3 className="text-sm font-bold text-slate-900">Mesh inventory</h3>
                <div className="mt-2 max-h-80 space-y-2 overflow-auto">
                  {report.meshes.map((mesh) => (
                    <div key={mesh.index} className="rounded-lg bg-slate-50 p-2">
                      <p className="text-xs font-bold text-slate-800">#{mesh.index} {mesh.name}</p>
                      <p className="mt-1 text-[10px] text-slate-500">{mesh.primitiveCount} primitives · {mesh.primitives.map((primitive) => primitive.material === undefined ? "no material" : `material ${primitive.material}`).join(", ")}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="min-w-0 rounded-xl border border-slate-200 p-3 lg:col-span-2">
                <h3 className="text-sm font-bold text-slate-900">Geometry bounds / Accessors</h3>
                <p className="mt-1 text-[10px] text-slate-500">ค่าขอบเขต min/max เป็นข้อมูลระดับ accessor ไม่ใช่ footprint อาคารหรือพิกัดภูมิศาสตร์</p>
                <div className="mt-2 max-h-64 overflow-auto">
                  <table className="w-full text-left text-[10px]">
                    <thead className="sticky top-0 bg-slate-100 text-slate-600"><tr><th className="p-2">#</th><th className="p-2">Type</th><th className="p-2">Count</th><th className="p-2">Min</th><th className="p-2">Max</th></tr></thead>
                    <tbody>{report.accessors.map((accessor) => <tr key={accessor.index} className="border-t border-slate-100"><td className="p-2">{accessor.index}</td><td className="p-2">{accessor.type ?? "—"}</td><td className="p-2 tabular-nums">{accessor.count ?? "—"}</td><td className="p-2 font-mono">{accessor.min?.join(", ") ?? "—"}</td><td className="p-2 font-mono">{accessor.max?.join(", ") ?? "—"}</td></tr>)}</tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
