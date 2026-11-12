import { useEffect, useRef, useState } from "react";

type V3 = [number, number, number];
type Material = { name: string; color: [number, number, number, number]; roughness?: number; metallic?: number };
type Part = { name: string; material: number; positions: number[]; normals: number[]; indices: number[] };

const materials: Material[] = [
  { name: "Grass", color: [0.20, 0.38, 0.16, 1] },
  { name: "Road asphalt", color: [0.20, 0.22, 0.23, 1] },
  { name: "Road shoulder", color: [0.46, 0.43, 0.34, 1] },
  { name: "Concrete", color: [0.68, 0.66, 0.59, 1] },
  { name: "Building walls", color: [0.78, 0.75, 0.66, 1] },
  { name: "Roof terracotta", color: [0.38, 0.20, 0.14, 1] },
  { name: "Roof grey", color: [0.30, 0.34, 0.35, 1] },
  { name: "Glass", color: [0.55, 0.78, 0.82, 0.52], roughness: 0.2, metallic: 0.1 },
  { name: "Tree canopy", color: [0.10, 0.29, 0.12, 1] },
  { name: "Tree light", color: [0.20, 0.39, 0.17, 1] },
  { name: "Trunk", color: [0.25, 0.15, 0.09, 1] },
  { name: "Crop rows", color: [0.34, 0.48, 0.18, 1] },
  { name: "Water", color: [0.19, 0.48, 0.58, 0.8] },
  { name: "Mountain", color: [0.22, 0.32, 0.29, 1] },
  { name: "White", color: [0.88, 0.87, 0.80, 1] },
];

const parts: Part[] = [];
function part(name: string, material: number): Part {
  const p = { name, material, positions: [], normals: [], indices: [] } as Part;
  parts.push(p);
  return p;
}
function face(p: Part, a: V3, b: V3, c: V3, d: V3, normal: V3) {
  const start = p.positions.length / 3;
  for (const v of [a, b, c, d]) { p.positions.push(...v); p.normals.push(...normal); }
  p.indices.push(start, start + 1, start + 2, start, start + 2, start + 3);
}
function box(name: string, mat: number, x: number, y: number, z: number, w: number, h: number, d: number, rotation = 0) {
  const p = part(name, mat), c = Math.cos(rotation), s = Math.sin(rotation);
  const tr = (v: V3): V3 => [x + v[0] * c + v[2] * s, y + v[1], z - v[0] * s + v[2] * c];
  const X=w/2,Y=h/2,Z=d/2;
  face(p,tr([-X,-Y,Z]),tr([X,-Y,Z]),tr([X,Y,Z]),tr([-X,Y,Z]),[0,0,1]);
  face(p,tr([X,-Y,-Z]),tr([-X,-Y,-Z]),tr([-X,Y,-Z]),tr([X,Y,-Z]),[0,0,-1]);
  face(p,tr([-X,-Y,-Z]),tr([-X,-Y,Z]),tr([-X,Y,Z]),tr([-X,Y,-Z]),[-1,0,0]);
  face(p,tr([X,-Y,Z]),tr([X,-Y,-Z]),tr([X,Y,-Z]),tr([X,Y,Z]),[1,0,0]);
  face(p,tr([-X,Y,Z]),tr([X,Y,Z]),tr([X,Y,-Z]),tr([-X,Y,-Z]),[0,1,0]);
  face(p,tr([-X,-Y,-Z]),tr([X,-Y,-Z]),tr([X,-Y,Z]),tr([-X,-Y,Z]),[0,-1,0]);
}
function cylinder(name: string, mat: number, x: number, y: number, z: number, radius: number, height: number, sides=8, cone=false) {
  const p=part(name,mat), bottom=y-height/2, top=y+height/2;
  for(let i=0;i<sides;i++){
    const a=i/sides*Math.PI*2,b=(i+1)/sides*Math.PI*2;
    const rTop=cone?0.03:radius;
    const n:[number,number,number]=[Math.cos((a+b)/2),0,Math.sin((a+b)/2)];
    const v1:V3=[x+Math.cos(a)*radius,bottom,z+Math.sin(a)*radius];
    const v2:V3=[x+Math.cos(b)*radius,bottom,z+Math.sin(b)*radius];
    const v3:V3=[x+Math.cos(b)*rTop,top,z+Math.sin(b)*rTop];
    const v4:V3=[x+Math.cos(a)*rTop,top,z+Math.sin(a)*rTop];
    face(p,v1,v2,v3,v4,n);
  }
}
function roof(name:string, x:number,z:number,w:number,d:number,y:number,mat:number,angle=0){
  box(name,mat,x,y,z,w,0.35,d,angle);
}
function road(name:string,x:number,z:number,length:number,width:number,angle:number){
  box(name,2,x,-0.08,z,length,0.12,width,angle);
  box(name+" asphalt",1,x,-0.005,z,length-1,0.08,width-0.7,angle);
}
function tree(x:number,z:number,scale=1,light=false){
  cylinder("Tree trunk",10,x,1.7*scale,z,0.28*scale,3.4*scale,7);
  cylinder("Tree crown",light?9:8,x,4.1*scale,z,1.7*scale,3.3*scale,9,true);
}
function building(name:string,x:number,z:number,w:number,d:number,h:number,roofMat=6,angle=0){
  box(name+" structure",4,x,h/2,z,w,h,d,angle);
  roof(name+" roof",x,z,w+1,d+1,h+0.22,roofMat,angle);
  const doorX=x-w/2+1.1;
  box(name+" entrance",10,doorX,1.0,z+d/2+0.03,1.2,2,0.12,angle);
  for(let i=0;i<Math.max(2,Math.floor(w/4));i++){
    const wx=x-w/2+2+i*(w-3)/Math.max(1,Math.floor(w/4)-1);
    box(name+" window",7,wx,h*0.57,z+d/2+0.05,1.35,1.15,0.08,angle);
  }
}
function createScene(){
  parts.length=0;
  // Main ground plane and distant ridgeline, built as a broad low-relief campus base.
  box("Campus terrain",0,0,-1,0,1000,2,760);
  // Main road enters diagonally from the west and meets the village-side corridor.
  road("Highway", -365, 15, 600, 22, -0.63);
  // Internal access spine and southern cross connection.
  road("Internal access", 70, 135, 500, 14, 0.42);
  road("Southern cross road", -105, 275, 410, 12, 0.02);
  // Agricultural plot at the center-left.
  box("Agricultural plot",11,-185,0,45,250,0.18,230);
  for(let row=0;row<9;row++) for(let col=0;col<10;col++){
    const x=-292+col*23, z=-52+row*23;
    cylinder("Crop plant",11,x,1.1,z,0.8,1.8,6,true);
  }
  // Greenhouse pair visible in the supplied aerial photograph.
  for(let g=0;g<2;g++){
    const gx=190+g*58, gz=5;
    box("Greenhouse base "+(g+1),3,gx,0.5,gz,49,1,78);
    box("Greenhouse glazed shell "+(g+1),7,gx,5,gz,47,9,76);
    box("Greenhouse roof ridge "+(g+1),14,gx,9.7,gz,4,0.5,78);
    for(let side=-1;side<=1;side+=2) box("Greenhouse side frame",14,gx+side*23,4.5,gz,0.8,8,78);
    for(let z=-30;z<=30;z+=15) box("Greenhouse frame",14,gx,4.5,gz+z,48,0.45,0.5);
  }
  // Main low-rise buildings clustered east of the agricultural plots.
  building("Learning and research building",65,-170,82,30,12,6,-0.04);
  building("Operations building",165,-155,58,26,10,5,0.02);
  building("Service building",250,-105,45,25,8,6,0.12);
  building("Community learning pavilion",275,150,45,34,7,5,-0.18);
  building("Field office",205,215,34,25,6,6,0.1);
  // Landscape, orchard and tree belts around buildings and roads.
  for(let i=0;i<22;i++){ tree(-410+(i%8)*23,-190+Math.floor(i/8)*25,0.7+(i%3)*0.12,i%4===0); }
  for(let i=0;i<18;i++){ tree(320+(i%6)*22,-220+Math.floor(i/6)*27,0.8+(i%3)*0.1,i%5===0); }
  for(let i=0;i<24;i++){ tree(320+(i%8)*25,35+Math.floor(i/8)*34,0.75+(i%4)*0.12,i%6===0); }
  for(let i=0;i<18;i++){ tree(-340+(i%9)*24,210+Math.floor(i/9)*27,0.65+(i%3)*0.1); }
  // Distant forest and mountain context.
  for(let i=0;i<30;i++){ tree(-480+i*32,-330+(i%4)*14,1.1+(i%4)*0.15,i%7===0); }
  for(let i=0;i<18;i++) cylinder("Mountain ridge",13,-500+i*58,45,-410,38+(i%4)*8,90+(i%5)*18,7,true);
  // Small water feature on the far eastern edge.
  box("Water feature",12,455,-0.05,-255,110,0.12,52,-0.2);
  return parts;
}

function buildGlb(): Blob {
  const geometry=createScene();
  const binaryChunks:number[]=[];
  const bufferViews:Array<Record<string,number>>=[];
  const accessors:Array<Record<string,unknown>>=[];
  const meshes:Array<Record<string,unknown>>=[];
  const nodes:Array<Record<string,unknown>>=[];
  let offset=0;
  const align=()=>{while(offset%4!==0){binaryChunks.push(0);offset++;}};
  const append=(data:Uint8Array,target:number)=>{
    align(); const start=offset;
    for(const byte of data){binaryChunks.push(byte);offset++;}
    const viewIndex=bufferViews.length;bufferViews.push({buffer:0,byteOffset:start,byteLength:data.byteLength,target});
    return viewIndex;
  };
  const addAccessor=(view:number,componentType:number,count:number,type:string,min?:number[],max?:number[])=>{
    const a:Record<string,unknown>={bufferView:view,componentType,count,type};
    if(min)a.min=min;if(max)a.max=max;accessors.push(a);return accessors.length-1;
  };
  geometry.forEach((p)=>{
    const pos=new Float32Array(p.positions), norm=new Float32Array(p.normals), ind=new Uint32Array(p.indices);
    const posView=append(new Uint8Array(pos.buffer),34962);
    const normView=append(new Uint8Array(norm.buffer),34962);
    const idxView=append(new Uint8Array(ind.buffer),34963);
    const min:[number,number,number]=[Infinity,Infinity,Infinity],max:[number,number,number]=[-Infinity,-Infinity,-Infinity];
    for(let i=0;i<pos.length;i+=3)for(let k=0;k<3;k++){min[k]=Math.min(min[k],pos[i+k]);max[k]=Math.max(max[k],pos[i+k]);}
    const pa=addAccessor(posView,5126,pos.length/3,"VEC3",min,max);
    const na=addAccessor(normView,5126,norm.length/3,"VEC3");
    const ia=addAccessor(idxView,5125,ind.length,"SCALAR");
    meshes.push({name:p.name,primitives:[{attributes:{POSITION:pa,NORMAL:na},indices:ia,material:p.material,mode:4}]});
    nodes.push({name:p.name,mesh:meshes.length-1});
  });
  const binary=new Uint8Array(binaryChunks);
  const doc={
    asset:{version:"2.0",generator:"Mahidol Lampang Procedural Digital Twin"},
    scene:0,scenes:[{name:"Mahidol Lampang — Concept Site",nodes:nodes.map((_,i)=>i)}],
    nodes,meshes,accessors,bufferViews,
    buffers:[{byteLength:binary.byteLength}],
    materials:materials.map((m)=>({name:m.name,pbrMetallicRoughness:{baseColorFactor:m.color,metallicFactor:m.metallic??0,roughnessFactor:m.roughness??0.82},doubleSided:true,alphaMode:m.color[3]<1?"BLEND":"OPAQUE"})),
  };
  const encoder=new TextEncoder();
  const json=encoder.encode(JSON.stringify(doc));
  const jsonLength=Math.ceil(json.length/4)*4;
  const binLength=Math.ceil(binary.length/4)*4;
  const total=12+8+jsonLength+8+binLength;
  const out=new ArrayBuffer(total),view=new DataView(out);
  view.setUint32(0,0x46546c67,true);view.setUint32(4,2,true);view.setUint32(8,total,true);
  view.setUint32(12,jsonLength,true);view.setUint32(16,0x4e4f534a,true);
  new Uint8Array(out,20,json.length).set(json);new Uint8Array(out,20+json.length,jsonLength-json.length).fill(0x20);
  const binHeader=20+jsonLength;view.setUint32(binHeader,binLength,true);view.setUint32(binHeader+4,0x004e4942,true);
  new Uint8Array(out,binHeader+8,binary.length).set(binary);
  return new Blob([out],{type:"model/gltf-binary"});
}

export function ProceduralCampusViewer(){
  const viewerRef=useRef<HTMLElement>(null);
  const [ready,setReady]=useState(false);
  const [error,setError]=useState("");
  const [rotate,setRotate]=useState(true);
  const [preset,setPreset]=useState<"overview"|"top"|"low">("overview");
  const [selected,setSelected]=useState("ภาพจำลองแนวคิด");
  useEffect(()=>{
    let active=true,objectUrl="";
    void import("@google/model-viewer").then(()=>{
      if(!active)return;
      const blob=buildGlb();objectUrl=URL.createObjectURL(blob);
      const viewer=viewerRef.current;
      if(viewer){viewer.setAttribute("src",objectUrl);viewer.setAttribute("camera-orbit","35deg 58deg 1050m");}
      setReady(true);
    }).catch((e)=>setError(e instanceof Error?e.message:"ไม่สามารถสร้างโมเดล 3D ได้"));
    return()=>{active=false;if(objectUrl)URL.revokeObjectURL(objectUrl);};
  },[]);
  useEffect(()=>{const v=viewerRef.current;if(!v)return;if(rotate)v.setAttribute("auto-rotate","");else v.removeAttribute("auto-rotate");},[rotate,ready]);
  const setCamera=(value:"overview"|"top"|"low")=>{
    setPreset(value);
    const v=viewerRef.current;
    const orbit=value==="top"?"0deg 8deg 1050m":value==="low"?"25deg 76deg 1050m":"35deg 58deg 1050m";
    v?.setAttribute("camera-orbit",orbit);
  };
  const button="rounded-lg border border-white/15 bg-slate-800/90 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700";
  return <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl">
    <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 px-4 py-3 text-white">
      <div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300">Procedural 3D · Concept v1</p><h2 className="text-sm font-bold">Mahidol Lampang — Digital Twin</h2><p className="text-[10px] text-slate-400">สร้าง geometry ใหม่จากองค์ประกอบพื้นที่ที่มองเห็นในภาพอ้างอิง</p></div>
      <div className="flex flex-wrap gap-2"><button className={button} onClick={()=>setRotate(v=>!v)}>{rotate?"หยุดหมุน":"หมุนอัตโนมัติ"}</button><button className={button} onClick={()=>setCamera("overview")}>มุมเฉียง</button><button className={button} onClick={()=>setCamera("top")}>มุมบน</button><button className={button} onClick={()=>setCamera("low")}>มุมต่ำ</button></div>
    </div>
    <div className="relative h-[min(72vh,720px)] min-h-[440px]">
      <model-viewer ref={viewerRef} alt="แบบจำลองสามมิติแนวคิดของพื้นที่มหิดล ลำปาง" camera-controls touch-action="pan-y" interaction-prompt="auto" shadow-intensity="1.1" exposure="1.05" environment-image="neutral" field-of-view="30deg" min-camera-orbit="auto 5deg 450m" max-camera-orbit="auto 90deg 2200m" style={{width:"100%",height:"100%",background:"#a9c4cf"}} />
      {!ready&&!error&&<div className="absolute inset-0 grid place-items-center bg-slate-900/90 text-sm text-white">กำลังสร้างโมเดล 3D จาก geometry...</div>}
      {error&&<div role="alert" className="absolute inset-0 grid place-items-center bg-slate-900 p-6 text-center text-sm text-rose-200">{error}</div>}
      <div className="absolute bottom-3 left-3 rounded-lg border border-white/20 bg-slate-950/75 p-3 text-[10px] text-white backdrop-blur"><p className="font-bold text-emerald-300">พื้นที่จำลอง</p><p>ถนน · เกษตร · โรงเรือน · อาคาร · แนวต้นไม้ · ภูเขา</p><p className="mt-1 text-slate-300">เลือกสำรวจ: {selected}</p></div>
      <div className="absolute bottom-3 right-3 flex max-w-[55%] flex-wrap justify-end gap-1.5">{["ถนนหลัก","แปลงเกษตร","โรงเรือน","กลุ่มอาคาร","พื้นที่สีเขียว"].map((name)=><button key={name} className={button} onClick={()=>{setSelected(name);setCamera(name==="ถนนหลัก"?"top":name==="โรงเรือน"?"low":"overview");}}>{name}</button>)}</div>
    </div>
    <div className="grid gap-2 bg-slate-900 p-3 text-[10px] text-slate-300 sm:grid-cols-3"><p>01 · สร้างใหม่แบบ procedural — ไม่ใช้ geometry จาก GLB เดิม</p><p>02 · สัดส่วนและตำแหน่งเป็นค่าประมาณจากภาพมุมเฉียง</p><p>03 · รอผังสำรวจเพื่อปรับพิกัดและขนาดจริง</p></div>
  </div>;
}
