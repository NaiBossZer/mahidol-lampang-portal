type ReportStatus = "draft" | "processing" | "needs_review" | "approved" | "published" | "failed";

export interface ElectricityReportRecord {
  id: string;
  report_month: string;
  sobprab_kwh: number;
  sobprab_amount_thb: number;
  phalaad_kwh: number;
  phalaad_amount_thb: number;
  solar_yield_kwh: number;
  total_pea_kwh: number;
  total_amount_thb: number;
  solar_ratio_pct: number;
  status: ReportStatus;
}

export interface ElectricityReportModel {
  selectedFiscalYear: number;
  fiscalYears: number[];
  monthlyLabels: string[];
  costSeries: Array<{ fiscalYear: number; values: Array<number | null> }>;
  annualUsage: Array<{ fiscalYear: number; phalaad: number; sobprab: number }>;
  detail: Array<{
    label: string;
    peaKwh: number | null;
    solarKwh: number | null;
    peaPct: number | null;
    solarPct: number | null;
  }>;
  total: { peaKwh: number; solarKwh: number; peaPct: number | null; solarPct: number | null };
  generatedAt: string;
}

const THAI_MONTHS = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
const FY_MONTHS = [{m:10,o:-1},{m:11,o:-1},{m:12,o:-1},{m:1,o:0},{m:2,o:0},{m:3,o:0},{m:4,o:0},{m:5,o:0},{m:6,o:0},{m:7,o:0},{m:8,o:0},{m:9,o:0}];
const EXPORTABLE = new Set<ReportStatus>(["approved","published"]);
const W = 1600;
const H = 900;
const PPT_W = 13.75;
const PPT_H = 7.5;
const COLORS = {
  navy:"0C2340", blue:"4472C4", lineBlue:"5B9BD5", green:"70AD47", gold:"FDBE00",
  cream:"FFF1C7", orange:"ED7D31", brown:"C55A11", grid:"D0D0D0", lightBlue:"D9E2F3",
  ink:"252525", muted:"666666", white:"FFFFFF"
};

function n(v: number | null | undefined) { return v != null && Number.isFinite(v) ? v : 0; }
function fmt(v: number | null | undefined, digits = 2) {
  if (v == null || !Number.isFinite(v)) return "—";
  return v.toLocaleString("th-TH",{minimumFractionDigits:digits,maximumFractionDigits:digits});
}
function fy(iso: string) {
  const p = iso.slice(0,7).split("-").map(Number);
  return p[1] >= 10 ? p[0] + 1 : p[0];
}
function isoMonth(fiscalYear: number, month: number, offset: number) {
  return String(fiscalYear + offset) + "-" + String(month).padStart(2,"0");
}
function fyLabel(value: number) { return String(value + 543); }
function percent(a: number, b: number) { return b > 0 ? (a / b) * 100 : null; }
function maxRound(values: number[], step: number) {
  const max = Math.max(0,...values);
  return Math.max(step,Math.ceil(max / step) * step);
}
export function canGenerateElectricityReport(report: ElectricityReportRecord | null) {
  return Boolean(report && EXPORTABLE.has(report.status));
}

export function buildElectricityReportModel(reports: ElectricityReportRecord[], selectedReport: ElectricityReportRecord): ElectricityReportModel {
  const usable = reports.filter((r) => EXPORTABLE.has(r.status));
  const selectedFY = fy(selectedReport.report_month);
  const years = Array.from(new Set(usable.map((r) => fy(r.report_month))));
  if (!years.includes(selectedFY)) years.push(selectedFY);
  years.sort((a,b) => b-a);
  const fiscalYears = years.slice(0,4).sort((a,b) => a-b);
  const byMonth = new Map(usable.map((r) => [r.report_month.slice(0,7), r]));
  const months = FY_MONTHS.map((x) => ({
    iso: isoMonth(selectedFY,x.m,x.o),
    label: THAI_MONTHS[x.m-1],
    report: byMonth.get(isoMonth(selectedFY,x.m,x.o)) || null
  }));
  const costSeries = fiscalYears.map((year) => ({
    fiscalYear: year,
    values: FY_MONTHS.map((x) => {
      const r = byMonth.get(isoMonth(year,x.m,x.o));
      return r ? n(r.sobprab_amount_thb) + n(r.phalaad_amount_thb) : null;
    })
  }));
  const annualUsage = fiscalYears.map((year) => {
    let phalaad = 0;
    let sobprab = 0;
    FY_MONTHS.forEach((x) => {
      const r = byMonth.get(isoMonth(year,x.m,x.o));
      if (r) { phalaad += n(r.phalaad_kwh); sobprab += n(r.sobprab_kwh); }
    });
    return { fiscalYear:year, phalaad, sobprab };
  });
  const detail = months.map((m) => {
    const peaKwh = m.report ? n(m.report.sobprab_kwh) : null;
    const solarKwh = m.report ? n(m.report.solar_yield_kwh) : null;
    const total = peaKwh == null || solarKwh == null ? null : peaKwh + solarKwh;
    return {
      label:m.label,
      peaKwh,
      solarKwh,
      peaPct:total == null ? null : percent(peaKwh,total),
      solarPct:total == null ? null : percent(solarKwh,total)
    };
  });
  const peaKwh = detail.reduce((s,r) => s+n(r.peaKwh),0);
  const solarKwh = detail.reduce((s,r) => s+n(r.solarKwh),0);
  return {
    selectedFiscalYear:selectedFY,
    fiscalYears,
    monthlyLabels:detail.map((r) => r.label),
    costSeries,
    annualUsage,
    detail,
    total:{peaKwh,solarKwh,peaPct:percent(peaKwh,peaKwh+solarKwh),solarPct:percent(solarKwh,peaKwh+solarKwh)},
    generatedAt:new Date().toISOString()
  };
}

function canvasPage() {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported");
  ctx.textBaseline = "middle";
  return {canvas,ctx};
}
function text(ctx:CanvasRenderingContext2D, value:string, x:number, y:number, size:number, weight:number=400, align:CanvasTextAlign="left", color:string=COLORS.ink) {
  ctx.font = weight + " " + size + "px Tahoma, Arial, sans-serif";
  ctx.fillStyle = "#" + color;
  ctx.textAlign = align;
  ctx.fillText(value,x,y);
}
function box(ctx:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,fill:string|null=null,stroke:string|null=null) {
  if (fill) { ctx.fillStyle = "#" + fill; ctx.fillRect(x,y,w,h); }
  if (stroke) { ctx.strokeStyle = "#" + stroke; ctx.lineWidth = 1; ctx.strokeRect(x,y,w,h); }
}
function line(ctx:CanvasRenderingContext2D,x1:number,y1:number,x2:number,y2:number,color:string,width:number=2) {
  ctx.strokeStyle = "#" + color; ctx.lineWidth = width; ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
}
function circle(ctx:CanvasRenderingContext2D,cx:number,cy:number,r:number,fill:string) {
  ctx.fillStyle = "#" + fill; ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fill();
}
async function loadImage(src:string) {
  try {
    const img = new Image();
    img.crossOrigin = "anonymous";
    await new Promise<void>((resolve,reject) => { img.onload = () => resolve(); img.onerror = () => reject(new Error("image")); img.src = src; });
    return img;
  } catch { return null; }
}
function header(ctx:CanvasRenderingContext2D,logo:HTMLImageElement|null) {
  box(ctx,0,0,W,150,COLORS.gold);
  box(ctx,470,8,700,115,COLORS.cream);
  text(ctx,"งานพันธกิจเพื่อสังคม",820,67,46,400,"center");
  if (logo) ctx.drawImage(logo,25,22,92,92);
  else { circle(ctx,72,67,42,COLORS.blue); text(ctx,"MU",72,67,18,700,"center",COLORS.white); }
  text(ctx,"มหาวิทยาลัยมหิดล",138,41,27,700,"left",COLORS.blue);
  text(ctx,"คณะสิ่งแวดล้อม",138,70,18,700,"left",COLORS.blue);
  text(ctx,"และทรัพยากรศาสตร์",138,94,18,700,"left",COLORS.blue);
}
function page1(ctx:CanvasRenderingContext2D,model:ElectricityReportModel,logo:HTMLImageElement|null) {
  header(ctx,logo);
  box(ctx,55,168,1490,605,null,COLORS.grid);
  text(ctx,"ค่าไฟฟ้า รวม 2 พื้นที่ (สบปราบ ผาลาด) งานพันธกิจเพื่อสังคม จ.ลำปาง ประจำปีงบประมาณ " + model.fiscalYears.map(fyLabel).join(" - "),800,203,25,500,"center");
  const plot={x:200,y:255,w:1260,h:430};
  const vals=model.costSeries.flatMap((s) => s.values.filter((v): v is number => v != null));
  const maxY=maxRound(vals,5000);
  for(let i=0;i<=7;i++){const v=maxY*i/7;const y=plot.y+plot.h-plot.h*v/maxY;line(ctx,plot.x,y,plot.x+plot.w,y,COLORS.grid,1);text(ctx,fmt(v),plot.x-15,y,14,400,"right",COLORS.muted);}
  model.monthlyLabels.forEach((m,i) => text(ctx,m,plot.x+plot.w*i/11,plot.y+plot.h+30,15,400,"center"));
  const cs=[COLORS.lineBlue,COLORS.green,COLORS.gold,COLORS.brown];
  model.costSeries.forEach((s,si) => {
    let prev:null|{x:number,y:number}=null;
    s.values.forEach((v,i)=>{
      if(v==null){prev=null;return;}
      const x=plot.x+plot.w*i/11; const y=plot.y+plot.h-plot.h*v/maxY;
      if(prev) line(ctx,prev.x,prev.y,x,y,cs[si],4);
      circle(ctx,x,y,7,cs[si]); text(ctx,fmt(v),x,y-20,14,400,"center");
      prev={x,y};
    });
    const ly=195+si*28; line(ctx,1475,ly,1502,ly,cs[si],4); circle(ctx,1488,ly,5,cs[si]); text(ctx,fyLabel(s.fiscalYear),1510,ly,14);
  });
  text(ctx,"หมายเหตุ  * ช่องว่างหมายถึงยังไม่มี Monthly Report ที่ผ่านการอนุมัติสำหรับเดือนนั้น",55,825,15);
  text(ctx,"ข้อมูลรายงานจัดทำจาก Source of Truth และสร้างรายงานได้เมื่อสถานะเป็น Approved / Published",55,852,15);
}
function page2(ctx:CanvasRenderingContext2D,model:ElectricityReportModel,logo:HTMLImageElement|null) {
  header(ctx,logo);
  box(ctx,55,182,1490,605,null,COLORS.grid);
  text(ctx,"สถิติหน่วยไฟฟ้ารวม(หน่วย) งานพันธกิจเพื่อสังคม ประจำปี " + model.fiscalYears.map(fyLabel).join(" - "),800,220,25,500,"center");
  const plot={x:170,y:285,w:1320,h:385};
  const maxY=maxRound(model.annualUsage.flatMap((r)=>[r.phalaad,r.sobprab]),5000);
  for(let i=0;i<=8;i++){const v=maxY*i/8;const y=plot.y+plot.h-plot.h*v/maxY;line(ctx,plot.x,y,plot.x+plot.w,y,COLORS.grid,1);text(ctx,fmt(v),plot.x-15,y,14,400,"right",COLORS.muted);}
  const gw=plot.w/Math.max(1,model.annualUsage.length);
  model.annualUsage.forEach((r,i)=>{
    const c=plot.x+gw*(i+0.5); const bw=Math.min(90,gw*0.22);
    [[r.phalaad,COLORS.lineBlue,"ผาลาด"],[r.sobprab,COLORS.orange,"สบปราบ"]].forEach((a,j)=>{
      const h=plot.h*a[0]/maxY; const x=c+(j===0?-bw-8:8); const y=plot.y+plot.h-h;
      box(ctx,x,y,bw,h,a[1] as string); text(ctx,fmt(a[0] as number),x+bw/2,y-16,15,400,"center"); 
    });
    text(ctx,fyLabel(r.fiscalYear),c,plot.y+plot.h+32,15,400,"center");
  });
  box(ctx,715,810,18,18,COLORS.lineBlue); text(ctx,"ผาลาด",740,819,14);
  box(ctx,865,810,18,18,COLORS.orange); text(ctx,"สบปราบ",890,819,14);
  text(ctx,"หมายเหตุ  * ใช้เฉพาะข้อมูล Monthly Report ที่ผ่านการอนุมัติ / เผยแพร่แล้ว",20,870,15);
}
function pie(ctx:CanvasRenderingContext2D,cx:number,cy:number,r:number,pea:number,solar:number) {
  const p=Math.max(0,Math.min(1,pea/100));
  ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*p); ctx.closePath(); ctx.fillStyle="#"+COLORS.blue; ctx.fill();
  ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,r,-Math.PI/2+Math.PI*2*p,Math.PI*1.5); ctx.closePath(); ctx.fillStyle="#"+COLORS.orange; ctx.fill();
  if(pea>7) text(ctx,fmt(pea),cx+Math.cos(-Math.PI/2+Math.PI*p)*r*.55,cy+Math.sin(-Math.PI/2+Math.PI*p)*r*.55,16,700,"center",COLORS.white);
  if(solar>7) {const a=-Math.PI/2+Math.PI*(p+(solar/100))*1; text(ctx,fmt(solar),cx+Math.cos(a)*r*.55,cy+Math.sin(a)*r*.55,16,700,"center",COLORS.white);}
}
function page3(ctx:CanvasRenderingContext2D,model:ElectricityReportModel,logo:HTMLImageElement|null) {
  header(ctx,logo);
  const x=0,y=165,w=665,h=700; const cw=[95,130,155,140,145]; const rh=h/14;
  box(ctx,x,y,w,rh,COLORS.lightBlue); 
  for(let rr=0;rr<=14;rr++) line(ctx,x,y+rh*rr,x+w,y+rh*rr,COLORS.grid,1);
  let dx=x; for(const c of cw){line(ctx,dx,y,dx,y+h,COLORS.grid,1);dx+=c;} line(ctx,x+w,y,x+w,y+h,COLORS.grid,1);
  const hs=["เดือน","หน่วยไฟฟ้าจาก กฟภ.","หน่วยไฟฟ้าจาก Solar Cell 18 kWp","ไฟฟ้าจาก กฟภ. (%)","ไฟฟ้าจาก Solar Cell 18 kWp (%)"];
  dx=0; hs.forEach((v,i)=>{text(ctx,v,dx+cw[i]/2,y+rh/2,14,600,"center");dx+=cw[i];});
  model.detail.forEach((r,i)=>{
    dx=0; const vals=[r.label,fmt(r.peaKwh),fmt(r.solarKwh),fmt(r.peaPct),fmt(r.solarPct)];
    vals.forEach((v,j)=>{text(ctx,v,dx+(j===0?8:cw[j]/2),y+rh*(i+1)+rh/2,13,j===0?400:400,j===0?"left":"center");dx+=cw[j];});
  });
  const ty=y+rh*13; box(ctx,0,ty,w,rh,COLORS.lightBlue); dx=0;
  ["รวม",fmt(model.total.peaKwh),fmt(model.total.solarKwh),fmt(model.total.peaPct),fmt(model.total.solarPct)].forEach((v,j)=>{text(ctx,v,dx+(j===0?8:cw[j]/2),ty+rh/2,14,700,j===0?"left":"center");dx+=cw[j];});
  const rx=720;
  text(ctx,"สัดส่วนการใช้พลังงานไฟฟ้า อ.สบปราบ จ.ลำปาง ประจำปี " + fyLabel(model.selectedFiscalYear),1120,205,19,500,"center",COLORS.muted);
  pie(ctx,900,350,82,model.total.peaPct||0,model.total.solarPct||0);
  box(ctx,765,455,16,16,COLORS.blue); text(ctx,"ไฟฟ้าจาก กฟภ. (%)",790,463,13);
  box(ctx,1000,455,16,16,COLORS.orange); text(ctx,"ไฟฟ้าจาก Solar Cell (%)",1025,463,13);
  text(ctx,"สรุปผลการใช้พลังงานไฟฟ้าในรอบปีงบประมาณ " + fyLabel(model.selectedFiscalYear),rx,520,16,700);
  text(ctx,"1. ปริมาณหน่วยไฟฟ้าที่ใช้จาก กฟภ. จำนวน " + fmt(model.total.peaKwh) + " หน่วย ร้อยละ " + fmt(model.total.peaPct),rx,555,15);
  text(ctx,"2. ปริมาณหน่วยไฟฟ้าที่ผลิตจากพลังงานแสงอาทิตย์ (Solar Cell 18 kWp) จำนวน " + fmt(model.total.solarKwh) + " หน่วย ร้อยละ " + fmt(model.total.solarPct),rx,590,15);
  text(ctx,"สัดส่วนการใช้พลังงานไฟฟ้ารายเดือน อ.สบปราบ จ.ลำปาง ประจำปี " + fyLabel(model.selectedFiscalYear),1120,660,19,500,"center",COLORS.muted);
  const p={x:775,y:705,w:770,h:145}; const maxY=maxRound(model.detail.flatMap((r)=>[n(r.peaKwh),n(r.solarKwh)]),500);
  model.detail.forEach((r,i)=>{const cx=p.x+p.w*(i+.5)/12;const a=p.h*n(r.peaKwh)/maxY;const b=p.h*n(r.solarKwh)/maxY;box(ctx,cx-24,p.y+p.h-a,48,a,COLORS.blue);box(ctx,cx-24,p.y+p.h-a-b,48,b,COLORS.orange);text(ctx,r.label,cx,p.y+p.h+14,10,400,"center",COLORS.muted);});
}
async function renderPages(model:ElectricityReportModel) {
  const logo=await loadImage("/social-engagement-logo.png");
  const pages=[] as HTMLCanvasElement[];
  for(const draw of [page1,page2,page3] as const){const {canvas,ctx}=canvasPage();draw(ctx,model,logo);pages.push(canvas);}
  return pages;
}

function b64Bytes(dataUrl:string) {
  const raw=atob(dataUrl.split(",")[1]); const out=new Uint8Array(raw.length);
  for(let i=0;i<raw.length;i++) out[i]=raw.charCodeAt(i); return out;
}
function concat(parts:Uint8Array[]) {
  const size=parts.reduce((s,p)=>s+p.length,0); const out=new Uint8Array(size); let o=0;
  parts.forEach((p)=>{out.set(p,o);o+=p.length;}); return out;
}
function le16(v:number){const b=new Uint8Array(2);new DataView(b.buffer).setUint16(0,v,true);return b;}
function le32(v:number){const b=new Uint8Array(4);new DataView(b.buffer).setUint32(0,v>>>0,true);return b;}
function crc32(bytes:Uint8Array){let c=0xffffffff;for(const b of bytes){c^=b;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0);}return(c^0xffffffff)>>>0;}
class Zip {
  items:Array<{name:Uint8Array,data:Uint8Array,crc:number,offset:number}>=[]; enc=new TextEncoder();
  add(name:string,data:Uint8Array){this.items.push({name:this.enc.encode(name),data,crc:crc32(data),offset:0});}
  blob(){const parts:Uint8Array[]=[];let off=0;this.items.forEach((f)=>{f.offset=off;const h=concat([le32(0x04034b50),le16(20),le16(0),le16(0),le16(0),le16(0),le32(f.crc),le32(f.data.length),le32(f.data.length),le16(f.name.length),le16(0),f.name,f.data]);parts.push(h);off+=h.length;});const cd=off;this.items.forEach((f)=>{const h=concat([le32(0x02014b50),le16(20),le16(20),le16(0),le16(0),le16(0),le16(0),le32(f.crc),le32(f.data.length),le32(f.data.length),le16(f.name.length),le16(0),le16(0),le16(0),le16(0),le32(0),le32(f.offset),f.name]);parts.push(h);off+=h.length;});parts.push(concat([le32(0x06054b50),le16(0),le16(0),le16(this.items.length),le16(this.items.length),le32(off-cd),le32(cd),le16(0)]));return new Blob(parts,{type:"application/vnd.openxmlformats-officedocument.presentationml.presentation"});}
}

function esc(s:string){return s.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&apos;");}
function e(inches:number){return Math.round(inches*914400);}
function p(points:number){return Math.round(points*100);}
let SHAPE_ID=10;
function nv(id:number,name:string){return "<p:nvSpPr><p:cNvPr id=\"" + id + "\" name=\"" + esc(name) + "\"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr>";}
function sp(id:number,x:number,y:number,w:number,h:number,fill:string|null,stroke:string|null){return "<p:sp>" + nv(id,"shape-"+id) + "<p:spPr><a:xfrm><a:off x=\"" + e(x) + "\" y=\"" + e(y) + "\"/><a:ext cx=\"" + e(w) + "\" cy=\"" + e(h) + "\"/></a:xfrm><a:prstGeom prst=\"rect\"><a:avLst/></a:prstGeom>" + (fill?"<a:solidFill><a:srgbClr val=\"" + fill + "\"/></a:solidFill>":"<a:noFill/>") + (stroke?"<a:ln w=\"12700\"><a:solidFill><a:srgbClr val=\"" + stroke + "\"/></a:solidFill></a:ln>":"<a:ln><a:noFill/></a:ln>") + "</p:spPr></p:sp>";}
function tb(id:number,x:number,y:number,w:number,h:number,value:string,size:number,bold=false,align:"l"|"ctr"|"r"="l"){return "<p:sp>" + nv(id,"text-"+id) + "<p:spPr><a:xfrm><a:off x=\"" + e(x) + "\" y=\"" + e(y) + "\"/><a:ext cx=\"" + e(w) + "\" cy=\"" + e(h) + "\"/></a:xfrm><a:prstGeom prst=\"rect\"><a:avLst/></a:prstGeom><a:noFill/><a:ln><a:noFill/></a:ln></p:spPr><p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:pPr algn=\"" + align + "\"/><a:r><a:rPr lang=\"th-TH\" sz=\"" + p(size) + "\" b=\"" + (bold?1:0) + "\"><a:latin typeface=\"Tahoma\"/><a:ea typeface=\"Tahoma\"/><a:cs typeface=\"Tahoma\"/><a:solidFill><a:srgbClr val=\"" + COLORS.ink + "\"/></a:solidFill></a:rPr><a:t>" + esc(value) + "</a:t></a:r><a:endParaRPr lang=\"th-TH\" sz=\"" + p(size) + "\"/></a:p></p:txBody></p:sp>";}
function ln(id:number,x1:number,y1:number,x2:number,y2:number,color:string,w=2){const x=Math.min(x1,x2),y=Math.min(y1,y2),ww=Math.max(.001,Math.abs(x2-x1)),hh=Math.max(.001,Math.abs(y2-y1));return "<p:sp>" + nv(id,"line-"+id) + "<p:spPr><a:xfrm" + (x2<x1?" flipH=\"1\"":"") + (y2<y1?" flipV=\"1\"":"") + "><a:off x=\"" + e(x) + "\" y=\"" + e(y) + "\"/><a:ext cx=\"" + e(ww) + "\" cy=\"" + e(hh) + "\"/></a:xfrm><a:prstGeom prst=\"line\"><a:avLst/></a:prstGeom><a:ln w=\"" + e(w/72) + "\"><a:solidFill><a:srgbClr val=\"" + color + "\"/></a:solidFill></a:ln></p:spPr></p:sp>";}
function cir(id:number,cx:number,cy:number,r:number,fill:string){return "<p:sp>" + nv(id,"circle-"+id) + "<p:spPr><a:xfrm><a:off x=\"" + e(cx-r) + "\" y=\"" + e(cy-r) + "\"/><a:ext cx=\"" + e(r*2) + "\" cy=\"" + e(r*2) + "\"/></a:xfrm><a:prstGeom prst=\"ellipse\"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val=\"" + fill + "\"/></a:solidFill><a:ln><a:noFill/></a:ln></p:spPr></p:sp>";}
function slideXml(content:string){return "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><p:sld xmlns:a=\"http://schemas.openxmlformats.org/drawingml/2006/main\" xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\" xmlns:p=\"http://schemas.openxmlformats.org/presentationml/2006/main\"><p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id=\"1\" name=\"\"/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/>" + sp(2,0,0,PPT_W,PPT_H,COLORS.white,null) + content + "</p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>";}
function pptImage(id:number,x:number,y:number,w:number,h:number,relId:number,name:string){return "<p:pic><p:nvPicPr><p:cNvPr id=\"" + id + "\" name=\"" + esc(name) + "\"/><p:cNvPicPr/><p:nvPr/></p:nvPicPr><p:blipFill><a:blip r:embed=\"" + "rId" + relId + "\"/><a:stretch><a:fillRect/></a:stretch></p:blipFill><p:spPr><a:xfrm><a:off x=\"" + e(x) + "\" y=\"" + e(y) + "\"/><a:ext cx=\"" + e(w) + "\" cy=\"" + e(h) + "\"/></a:xfrm><a:prstGeom prst=\"rect\"><a:avLst/></a:prstGeom></p:spPr></p:pic>";}
function pptHeader(parts:string[],useLogo:boolean){parts.push(sp(SHAPE_ID++,0,0,PPT_W,1.25,COLORS.gold,null),sp(SHAPE_ID++,4,.06,5.8,.95,COLORS.cream,null),tb(SHAPE_ID++,4.05,.18,5.7,.7,"งานพันธกิจเพื่อสังคม",31,false,"ctr"),tb(SHAPE_ID++,1.12,.23,2.9,.25,"มหาวิทยาลัยมหิดล",18,true),tb(SHAPE_ID++,1.12,.49,2.9,.22,"คณะสิ่งแวดล้อม",12,true),tb(SHAPE_ID++,1.12,.73,2.9,.22,"และทรัพยากรศาสตร์",12,true));}
function pptSlide1(model:ElectricityReportModel,useLogo:boolean){const a:string[]=[];pptHeader(a,useLogo);a.push(sp(SHAPE_ID++,.45,1.38,12.85,5.05,null,COLORS.grid));a.push(tb(SHAPE_ID++,.65,1.56,12.45,.4,"ค่าไฟฟ้า รวม 2 พื้นที่ (สบปราบ ผาลาด) งานพันธกิจเพื่อสังคม จ.ลำปาง ประจำปีงบประมาณ " + model.fiscalYears.map(fyLabel).join(" - "),18,false,"ctr"));const q={x:1.55,y:2,w:10.7,h:3.65};const vals=model.costSeries.flatMap(s=>s.values.filter((v):v is number=>v!=null));const my=maxRound(vals,5000);function addGrid(){for(let i=0;i<=7;i++){const v=my*i/7;const y=q.y+q.h-q.h*v/my;a.push(ln(SHAPE_ID++,q.x,y,q.x+q.w,y,COLORS.grid,.6),tb(SHAPE_ID++,.65,y-.11,.75,.2,fmt(v),9,false,"r"));}}addGrid();model.monthlyLabels.forEach((m,i)=>a.push(tb(SHAPE_ID++,q.x+q.w*i/11-.35,q.y+q.h+.13,.7,.3,m,8.5,false,"ctr")));const cc=[COLORS.lineBlue,COLORS.green,COLORS.gold,COLORS.brown];model.costSeries.forEach((s,si)=>{let prev:null|{x:number,y:number}=null;s.values.forEach((v,i)=>{if(v==null){prev=null;return;}const x=q.x+q.w*i/11,y=q.y+q.h-q.h*v/my;if(prev)a.push(ln(SHAPE_ID++,prev.x,prev.y,x,y,cc[si],2));a.push(cir(SHAPE_ID++,x,y,.06,cc[si]),tb(SHAPE_ID++,x-.35,y-.26,.7,.18,fmt(v),8,false,"ctr"));prev={x,y};});const y=1.69+si*.28;a.push(ln(SHAPE_ID++,12.38,y,12.63,y,cc[si],2),cir(SHAPE_ID++,12.5,y,.045,cc[si]),tb(SHAPE_ID++,12.66,y-.09,.55,.18,fyLabel(s.fiscalYear),9));});a.push(tb(SHAPE_ID++,.45,6.78,12.3,.18,"หมายเหตุ  * ช่องว่างหมายถึงยังไม่มี Monthly Report ที่ผ่านการอนุมัติสำหรับเดือนนั้น",9));return slideXml(a.join(""));}\nfunction maxRound(vals:number[],step:number){return Math.max(step,Math.ceil(Math.max(0,...vals)/step)*step);}\nfunction pptSlide2(model:ElectricityReportModel,useLogo:boolean){const a:string[]=[];pptHeader(a,useLogo);a.push(sp(SHAPE_ID++,.45,1.5,12.85,5.05,null,COLORS.grid),tb(SHAPE_ID++,.65,1.68,12.45,.35,"สถิติหน่วยไฟฟ้ารวม(หน่วย) งานพันธกิจเพื่อสังคม ประจำปี " + model.fiscalYears.map(fyLabel).join(" - "),18,false,"ctr"));const q={x:1.4,y:2.08,w:10.9,h:3.85};const my=maxRound(model.annualUsage.flatMap(r=>[r.phalaad,r.sobprab]),5000);for(let i=0;i<=8;i++){const v=my*i/8,y=q.y+q.h-q.h*v/my;a.push(ln(SHAPE_ID++,q.x,y,q.x+q.w,y,COLORS.grid,.6),tb(SHAPE_ID++,.6,y-.09,.65,.18,fmt(v),8.5,false,"r"));}const gw=q.w/Math.max(1,model.annualUsage.length);model.annualUsage.forEach((r,i)=>{const c=q.x+gw*(i+.5),bw=Math.min(.65,gw*.22);[[r.phalaad,COLORS.lineBlue],[r.sobprab,COLORS.orange]].forEach((pair,j)=>{const h=q.h*(pair[0] as number)/my,x=c+(j===0?-bw-.08:.08),y=q.y+q.h-h;a.push(sp(SHAPE_ID++,x,y,bw,h,pair[1] as string,null),tb(SHAPE_ID++,x-.25,y-.25,bw+.5,.18,fmt(pair[0] as number),8,false,"ctr"));});a.push(tb(SHAPE_ID++,c-.35,q.y+q.h+.15,.7,.2,fyLabel(r.fiscalYear),9,false,"ctr"));});return slideXml(a.join(""));}\nfunction pptSlide3(model:ElectricityReportModel,useLogo:boolean,pieRel:boolean){const a:string[]=[];pptHeader(a,useLogo);const x=0,y=1.38,rh=.47,cw=[.8,1.1,1.35,1.15,1.2];let dx=x;["เดือน","หน่วยไฟฟ้าจาก กฟภ.","หน่วยไฟฟ้าจาก Solar Cell 18 kWp","ไฟฟ้าจาก กฟภ. (%)","ไฟฟ้าจาก Solar Cell 18 kWp (%)"].forEach((h,i)=>{a.push(sp(SHAPE_ID++,dx,y,cw[i],rh,COLORS.lightBlue,COLORS.grid),tb(SHAPE_ID++,dx+.03,y+.03,cw[i]-.06,rh-.06,h,6.8,true,"ctr"));dx+=cw[i];});model.detail.forEach((r,i)=>{dx=x;[r.label,fmt(r.peaKwh),fmt(r.solarKwh),fmt(r.peaPct),fmt(r.solarPct)].forEach((v,j)=>{a.push(sp(SHAPE_ID++,dx,y+rh*(i+1),cw[j],rh,null,COLORS.grid),tb(SHAPE_ID++,dx+.03,y+rh*(i+1)+.03,cw[j]-.06,rh-.06,v,7.4,false,j===0?"l":"ctr"));dx+=cw[j];});});dx=x;[ "รวม",fmt(model.total.peaKwh),fmt(model.total.solarKwh),fmt(model.total.peaPct),fmt(model.total.solarPct)].forEach((v,j)=>{a.push(sp(SHAPE_ID++,dx,y+rh*13,cw[j],rh,COLORS.lightBlue,COLORS.grid),tb(SHAPE_ID++,dx+.03,y+rh*13+.03,cw[j]-.06,rh-.06,v,7.5,true,j===0?"l":"ctr"));dx+=cw[j];});const rx=6.05;a.push(tb(SHAPE_ID++,rx,1.58,7.1,.35,"สัดส่วนการใช้พลังงานไฟฟ้า อ.สบปราบ จ.ลำปาง ประจำปี " + fyLabel(model.selectedFiscalYear),14,false,"ctr"));if(pieRel)a.push(pptImage(SHAPE_ID++,6.95,1.95,2.35,2.35,3,"electricity mix pie"));a.push(sp(SHAPE_ID++,9.55,2.32,.18,.18,COLORS.blue,null),tb(SHAPE_ID++,9.82,2.34,2.8,.2,"ไฟฟ้าจาก กฟภ. (%)",8.8),sp(SHAPE_ID++,11.85,2.32,.18,.18,COLORS.orange,null),tb(SHAPE_ID++,12.1,2.34,1.3,.2,"Solar (%)",8.8),tb(SHAPE_ID++,rx+.1,4.72,6.7,.25,"สรุปผลการใช้พลังงานไฟฟ้าในรอบปีงบประมาณ " + fyLabel(model.selectedFiscalYear),11,true),tb(SHAPE_ID++,rx+.1,5.06,6.7,.48,"1. ปริมาณหน่วยไฟฟ้าที่ใช้จาก กฟภ. จำนวน " + fmt(model.total.peaKwh) + " หน่วย ร้อยละ " + fmt(model.total.peaPct),8.7),tb(SHAPE_ID++,rx+.1,5.55,6.7,.48,"2. ปริมาณหน่วยไฟฟ้าที่ผลิตจากพลังงานแสงอาทิตย์ (Solar Cell 18 kWp) จำนวน " + fmt(model.total.solarKwh) + " หน่วย ร้อยละ " + fmt(model.total.solarPct),8.7),tb(SHAPE_ID++,9.9,5.98,3.15,.25,"สัดส่วนการใช้พลังงานไฟฟ้ารายเดือน",10,true));const bp={x:6.65,y:6.25,w:6.35,h:.7};const mbw=bp.w/12;const barMax=maxRound(model.detail.flatMap(r=>[n(r.peaKwh),n(r.solarKwh)]),500);model.detail.forEach((r,i)=>{const cx=bp.x+mbw*(i+.5),a1=bp.h*n(r.peaKwh)/barMax,a2=bp.h*n(r.solarKwh)/barMax;a.push(sp(SHAPE_ID++,cx-.17,bp.y+bp.h-a1,.34,a1,COLORS.blue,null),sp(SHAPE_ID++,cx-.17,bp.y+bp.h-a1-a2,.34,a2,COLORS.orange,null),tb(SHAPE_ID++,cx-.25,bp.y+bp.h+.02,.5,.15,r.label.slice(0,3),5.5,false,"ctr"));});return slideXml(a.join(""));}\nfunction pptPackage(slides:string[],logoBytes:Uint8Array|null,pieBytes:Uint8Array|null){const z=new Zip();const enc=new TextEncoder();z.add("[Content_Types].xml",enc.encode("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><Types xmlns=\"http://schemas.openxmlformats.org/package/2006/content-types\"><Default Extension=\"rels\" ContentType=\"application/vnd.openxmlformats-package.relationships+xml\"/><Default Extension=\"xml\" ContentType=\"application/xml\"/><Default Extension=\"png\" ContentType=\"image/png\"/><Override PartName=\"/ppt/presentation.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml\"/><Override PartName=\"/ppt/slideMasters/slideMaster1.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml\"/><Override PartName=\"/ppt/slideLayouts/slideLayout1.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml\"/><Override PartName=\"/ppt/theme/theme1.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.theme+xml\"/><Override PartName=\"/ppt/slides/slide1.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.presentationml.slide+xml\"/><Override PartName=\"/ppt/slides/slide2.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.presentationml.slide+xml\"/><Override PartName=\"/ppt/slides/slide3.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.presentationml.slide+xml\"/><Override PartName=\"/docProps/core.xml\" ContentType=\"application/vnd.openxmlformats-package.core-properties+xml\"/><Override PartName=\"/docProps/app.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.extended-properties+xml\"/></Types>"));z.add("_rels/.rels",enc.encode("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\"><Relationship Id=\"rId1\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument\" Target=\"ppt/presentation.xml\"/><Relationship Id=\"rId2\" Type=\"http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties\" Target=\"docProps/core.xml\"/><Relationship Id=\"rId3\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties\" Target=\"docProps/app.xml\"/></Relationships>"));z.add("docProps/core.xml",enc.encode("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><cp:coreProperties xmlns:cp=\"http://schemas.openxmlformats.org/package/2006/metadata/core-properties\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\"><dc:title>EE Report — Mahidol Lampang</dc:title><dc:creator>Mahidol Lampang Portal</dc:creator></cp:coreProperties>"));z.add("docProps/app.xml",enc.encode("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><Properties xmlns=\"http://schemas.openxmlformats.org/officeDocument/2006/extended-properties\"><Application>Mahidol Lampang Portal</Application><Slides>3</Slides></Properties>"));z.add("ppt/presentation.xml",enc.encode("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><p:presentation xmlns:a=\"http://schemas.openxmlformats.org/drawingml/2006/main\" xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\" xmlns:p=\"http://schemas.openxmlformats.org/presentationml/2006/main\"><p:sldMasterIdLst><p:sldMasterId id=\"2147483648\" r:id=\"rId1\"/></p:sldMasterIdLst><p:sldIdLst><p:sldId id=\"256\" r:id=\"rId2\"/><p:sldId id=\"257\" r:id=\"rId3\"/><p:sldId id=\"258\" r:id=\"rId4\"/></p:sldIdLst><p:sldSz cx=\"" + e(PPT_W) + "\" cy=\"" + e(PPT_H) + "\" type=\"custom\"/><p:notesSz cx=\"6858000\" cy=\"9144000\"/></p:presentation>"));z.add("ppt/_rels/presentation.xml.rels",enc.encode("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\"><Relationship Id=\"rId1\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster\" Target=\"slideMasters/slideMaster1.xml\"/><Relationship Id=\"rId2\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide\" Target=\"slides/slide1.xml\"/><Relationship Id=\"rId3\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide\" Target=\"slides/slide2.xml\"/><Relationship Id=\"rId4\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide\" Target=\"slides/slide3.xml\"/><Relationship Id=\"rId5\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme\" Target=\"theme/theme1.xml\"/></Relationships>"));z.add("ppt/slideMasters/slideMaster1.xml",enc.encode("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><p:sldMaster xmlns:a=\"http://schemas.openxmlformats.org/drawingml/2006/main\" xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\" xmlns:p=\"http://schemas.openxmlformats.org/presentationml/2006/main\"><p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id=\"1\" name=\"\"/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/></p:spTree></p:cSld><p:clrMap bg1=\"lt1\" tx1=\"dk1\" bg2=\"lt2\" tx2=\"dk2\" accent1=\"accent1\" accent2=\"accent2\" accent3=\"accent3\" accent4=\"accent4\" accent5=\"accent5\" accent6=\"accent6\" hlink=\"hlink\" folHlink=\"folHlink\"/><p:sldLayoutIdLst><p:sldLayoutId id=\"1\" r:id=\"rId1\"/></p:sldLayoutIdLst></p:sldMaster>"));z.add("ppt/slideMasters/_rels/slideMaster1.xml.rels",enc.encode("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\"><Relationship Id=\"rId1\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout\" Target=\"../slideLayouts/slideLayout1.xml\"/><Relationship Id=\"rId2\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme\" Target=\"../theme/theme1.xml\"/></Relationships>"));z.add("ppt/slideLayouts/slideLayout1.xml",enc.encode("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><p:sldLayout xmlns:a=\"http://schemas.openxmlformats.org/drawingml/2006/main\" xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\" xmlns:p=\"http://schemas.openxmlformats.org/presentationml/2006/main\" type=\"blank\" preserve=\"1\"><p:cSld name=\"Blank\"><p:spTree><p:nvGrpSpPr><p:cNvPr id=\"1\" name=\"\"/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/></p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sldLayout>"));z.add("ppt/slideLayouts/_rels/slideLayout1.xml.rels",enc.encode("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\"><Relationship Id=\"rId1\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster\" Target=\"../slideMasters/slideMaster1.xml\"/></Relationships>"));z.add("ppt/theme/theme1.xml",enc.encode("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><a:theme xmlns:a=\"http://schemas.openxmlformats.org/drawingml/2006/main\" name=\"Office\"><a:themeElements><a:clrScheme name=\"Office\"><a:dk1><a:srgbClr val=\"000000\"/></a:dk1><a:lt1><a:srgbClr val=\"FFFFFF\"/></a:lt1><a:dk2><a:srgbClr val=\"44546A\"/></a:dk2><a:lt2><a:srgbClr val=\"E7E6E6\"/></a:lt2><a:accent1><a:srgbClr val=\"4472C4\"/></a:accent1><a:accent2><a:srgbClr val=\"ED7D31\"/></a:accent2><a:accent3><a:srgbClr val=\"A5A5A5\"/></a:accent3><a:accent4><a:srgbClr val=\"FFC000\"/></a:accent4><a:accent5><a:srgbClr val=\"5B9BD5\"/></a:accent5><a:accent6><a:srgbClr val=\"70AD47\"/></a:accent6><a:hlink><a:srgbClr val=\"0563C1\"/></a:hlink><a:folHlink><a:srgbClr val=\"954F72\"/></a:folHlink></a:clrScheme><a:fontScheme name=\"Office\"><a:majorFont><a:latin typeface=\"Arial\"/><a:ea typeface=\"Tahoma\"/><a:cs typeface=\"Tahoma\"/></a:majorFont><a:minorFont><a:latin typeface=\"Arial\"/><a:ea typeface=\"Tahoma\"/><a:cs typeface=\"Tahoma\"/></a:minorFont></a:fontScheme><a:fmtScheme name=\"Office\"><a:fillStyleLst><a:solidFill><a:srgbClr val=\"FFFFFF\"/></a:solidFill></a:fillStyleLst><a:lnStyleLst><a:ln w=\"12700\"><a:solidFill><a:srgbClr val=\"808080\"/></a:solidFill></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:srgbClr val=\"FFFFFF\"/></a:solidFill></a:bgFillStyleLst></a:fmtScheme></a:themeElements></a:theme>"));if(logoBytes)z.add("ppt/media/logo.png",logoBytes);if(pieBytes)z.add("ppt/media/electricity-mix-pie.png",pieBytes);slides.forEach((s,i)=>{z.add("ppt/slides/slide"+(i+1)+".xml",enc.encode(s));const rels=["<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>","<Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\">","<Relationship Id=\"rId1\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout\" Target=\"../slideLayouts/slideLayout1.xml\"/>",...(logoBytes?["<Relationship Id=\"rId2\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/image\" Target=\"../media/logo.png\"/>"]:[]),...(pieBytes?["<Relationship Id=\"rId3\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/image\" Target=\"../media/electricity-mix-pie.png\"/>"]:[]),"</Relationships>"].join("");z.add("ppt/slides/_rels/slide"+(i+1)+".xml.rels",enc.encode(rels));});return z.blob();}

export async function generateElectricityPptx(model:ElectricityReportModel) {
  const logo=await fetch("/social-engagement-logo.png",{credentials:"same-origin"}).then(r=>r.ok?r.arrayBuffer():null).catch(()=>null);
  SHAPE_ID=10;
  return pptPackage([pptSlide1(model),pptSlide2(model),pptSlide3(model)],logo?new Uint8Array(logo):null);
}

function pdfFromImages(images:Array<{bytes:Uint8Array;w:number;h:number}>) {
  const enc=new TextEncoder(), objects:Uint8Array[]=[enc.encode("<< /Type /Catalog /Pages 2 0 R >>"),enc.encode("<< /Type /Pages /Kids [3 0 R 6 0 R 9 0 R] /Count 3 >>")], offsets:number[]=[]; let pos=0;
  const header=enc.encode("%PDF-1.4\\n%\\xFF\\xFF\\xFF\\xFF\\n"); pos=header.length;
  images.forEach((im,i)=>{const pg=3+i*3,io=pg+1,co=pg+2;const stream=enc.encode("q\\n990 0 0 540 0 0 cm\\n/Im"+(i+1)+" Do\\nQ");objects[pg-1]=enc.encode("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 990 540] /Resources << /XObject << /Im"+(i+1)+" "+io+" 0 R >> >> /Contents "+co+" 0 R >>");objects[io-1]=concat([enc.encode("<< /Type /XObject /Subtype /Image /Width "+im.w+" /Height "+im.h+" /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length "+im.bytes.length+" >>\\nstream\\n"),im.bytes,enc.encode("\\nendstream")]);objects[co-1]=concat([enc.encode("<< /Length "+stream.length+" >>\\nstream\\n"),stream,enc.encode("\\nendstream")]);});
  const chunks:Uint8Array[]=[header];let off=pos;objects.forEach((obj,i)=>{offsets[i+1]=off;const a=enc.encode((i+1)+" 0 obj\\n"),b=enc.encode("\\nendobj\\n");chunks.push(a,obj,b);off+=a.length+obj.length+b.length;});const x=off;let xref="xref\\n0 "+(objects.length+1)+"\\n0000000000 65535 f \\n";for(let i=1;i<=objects.length;i++)xref+=String(offsets[i]).padStart(10,"0")+" 00000 n \\n";xref+="trailer\\n<< /Size "+(objects.length+1)+" /Root 1 0 R >>\\nstartxref\\n"+x+"\\n%%EOF";chunks.push(enc.encode(xref));return new Blob(chunks,{type:"application/pdf"});
}
export async function generateElectricityPdf(model:ElectricityReportModel) {
  const pages=await renderPages(model); return pdfFromImages(pages.map((c)=>({bytes:b64Bytes(c.toDataURL("image/jpeg",.94)),w:c.width,h:c.height})));
}
export function downloadBlob(blob:Blob,filename:string) {
  const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export function electricityReportFilename(model:ElectricityReportModel,ext:"pptx"|"pdf") {return "EE-Report-FY"+fyLabel(model.selectedFiscalYear)+"."+ext;}
