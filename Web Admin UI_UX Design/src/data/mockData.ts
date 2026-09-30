export const FISCAL_YEAR = '2567';
export const CURRENT_MONTH = 'กันยายน 2567';

export const monthlyReportData = [
  { month: 'ต.ค. 66', sobprab_kwh: 18420, sobprab_thb: 62814, palad_kwh: 9870, palad_thb: 33658, solar_kwh: 4200, solar_ratio: 15.3, co2_avoided: 2.35, coal_saved: 1.68 },
  { month: 'พ.ย. 66', sobprab_kwh: 17850, sobprab_thb: 60869, palad_kwh: 9560, palad_thb: 32609, solar_kwh: 3800, solar_ratio: 13.8, co2_avoided: 2.13, coal_saved: 1.52 },
  { month: 'ธ.ค. 66', sobprab_kwh: 16900, sobprab_thb: 57632, palad_kwh: 9100, palad_thb: 31031, solar_kwh: 3200, solar_ratio: 11.9, co2_avoided: 1.79, coal_saved: 1.28 },
  { month: 'ม.ค. 67', sobprab_kwh: 17200, sobprab_thb: 58655, palad_kwh: 9300, palad_thb: 31714, solar_kwh: 3400, solar_ratio: 12.5, co2_avoided: 1.90, coal_saved: 1.36 },
  { month: 'ก.พ. 67', sobprab_kwh: 15800, sobprab_thb: 53882, palad_kwh: 8600, palad_thb: 29327, solar_kwh: 4100, solar_ratio: 16.8, co2_avoided: 2.30, coal_saved: 1.64 },
  { month: 'มี.ค. 67', sobprab_kwh: 19500, sobprab_thb: 66512, palad_kwh: 10400, palad_thb: 35462, solar_kwh: 5200, solar_ratio: 17.6, co2_avoided: 2.91, coal_saved: 2.08 },
  { month: 'เม.ย. 67', sobprab_kwh: 21000, sobprab_thb: 71628, palad_kwh: 11200, palad_thb: 38194, solar_kwh: 6100, solar_ratio: 18.8, co2_avoided: 3.42, coal_saved: 2.44 },
  { month: 'พ.ค. 67', sobprab_kwh: 22500, sobprab_thb: 76744, palad_kwh: 12000, palad_thb: 40925, solar_kwh: 6800, solar_ratio: 19.3, co2_avoided: 3.81, coal_saved: 2.72 },
  { month: 'มิ.ย. 67', sobprab_kwh: 21800, sobprab_thb: 74356, palad_kwh: 11600, palad_thb: 39559, solar_kwh: 7200, solar_ratio: 21.2, co2_avoided: 4.03, coal_saved: 2.88 },
  { month: 'ก.ค. 67', sobprab_kwh: 20900, sobprab_thb: 71285, palad_kwh: 11100, palad_thb: 37852, solar_kwh: 6500, solar_ratio: 19.9, co2_avoided: 3.64, coal_saved: 2.60 },
  { month: 'ส.ค. 67', sobprab_kwh: 20100, sobprab_thb: 68557, palad_kwh: 10700, palad_thb: 36486, solar_kwh: 6200, solar_ratio: 19.7, co2_avoided: 3.47, coal_saved: 2.48 },
  { month: 'ก.ย. 67', sobprab_kwh: 19800, sobprab_thb: 67534, palad_kwh: 10500, palad_thb: 35803, solar_kwh: 5900, solar_ratio: 19.0, co2_avoided: 3.30, coal_saved: 2.36 },
];

export const currentReport = monthlyReportData[monthlyReportData.length - 1];

export const sourceDocuments = [
  {
    id: 'doc-001',
    filename: 'PEA_Bill_Sobprab_Sep2567.pdf',
    type: 'PEA Electricity Bill',
    site: 'สบปราบ',
    billingPeriod: 'กันยายน 2567',
    uploadedAt: '2567-09-28 09:14:22',
    uploadedBy: 'นางสาวพรพิมล วงศ์ทอง',
    fileSize: '1.24 MB',
    sha256: 'a3f8d2e1c7b94f0e5d6a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2',
    status: 'processed',
    processingStatus: 'Extracted 24 fields',
    selected: true,
  },
  {
    id: 'doc-002',
    filename: 'PEA_Bill_Palad_Sep2567.pdf',
    type: 'PEA Electricity Bill',
    site: 'ผาลาด',
    billingPeriod: 'กันยายน 2567',
    uploadedAt: '2567-09-28 09:18:45',
    uploadedBy: 'นางสาวพรพิมล วงศ์ทอง',
    fileSize: '0.98 MB',
    sha256: 'b4e9f0c2d8a5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1',
    status: 'processed',
    processingStatus: 'Extracted 24 fields',
    selected: true,
  },
  {
    id: 'doc-003',
    filename: 'Solar_Report_Sep2567.xlsx',
    type: 'Solar Energy Report',
    site: 'Solar Cell',
    billingPeriod: 'กันยายน 2567',
    uploadedAt: '2567-09-28 09:22:13',
    uploadedBy: 'นายอนันต์ สุขใจ',
    fileSize: '0.34 MB',
    sha256: 'c5d0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0',
    status: 'processed',
    processingStatus: 'Extracted 18 fields',
    selected: true,
  },
];

export const validationResults = {
  passed: [
    { id: 'v1', message: 'Site name ตรงกับ source document (สบปราบ)', source: 'PEA_Bill_Sobprab_Sep2567.pdf' },
    { id: 'v2', message: 'Site name ตรงกับ source document (ผาลาด)', source: 'PEA_Bill_Palad_Sep2567.pdf' },
    { id: 'v3', message: 'Billing month ตรงกัน (กันยายน 2567) ทั้ง 3 เอกสาร', source: 'All documents' },
    { id: 'v4', message: 'Source documents ครบ 3 ฉบับ (PEA Sobprab, PEA Palad, Solar)', source: 'System check' },
    { id: 'v5', message: 'รูปแบบตัวเลข kWh และ THB ถูกต้องทั้งหมด', source: 'Format validator' },
    { id: 'v6', message: 'SHA-256 integrity verified — ไฟล์ไม่ถูกแก้ไข', source: 'File integrity check' },
  ],
  warnings: [
    { id: 'w1', message: 'Solar Ratio (19.0%) ต่ำกว่าเดือนที่แล้ว (19.7%) อาจตรวจสอบค่าผลิตไฟฟ้า', source: 'Solar_Report_Sep2567.xlsx' },
  ],
  needsReview: [],
  failed: [],
};

export const approvalTrail = [
  { step: 'Draft', actor: 'ระบบ', timestamp: '2567-09-28 09:14', note: 'เริ่มต้นรายงาน' },
  { step: 'Uploaded', actor: 'นางสาวพรพิมล วงศ์ทอง', timestamp: '2567-09-28 09:22', note: 'อัปโหลด 3 เอกสาร' },
  { step: 'AI Processed', actor: 'EE-Agent v2.4.1', timestamp: '2567-09-28 09:25', note: 'Extract 66 fields, 0 errors' },
  { step: 'Needs Review', actor: 'ระบบ (Auto)', timestamp: '2567-09-28 09:25', note: '1 warning พบ — รอตรวจสอบ' },
  { step: 'Approved', actor: null, timestamp: null, note: 'รอการอนุมัติ' },
  { step: 'Published', actor: null, timestamp: null, note: 'รอเผยแพร่' },
];

export const dataProvenance = [
  { field: 'PEA Sobprab kWh', value: '19,800 kWh', source: 'PEA_Bill_Sobprab_Sep2567.pdf', page: 'หน้า 2, แถว "หน่วยที่ใช้"' },
  { field: 'PEA Sobprab Amount', value: '67,534 ฿', source: 'PEA_Bill_Sobprab_Sep2567.pdf', page: 'หน้า 1, ยอดรวม' },
  { field: 'PEA Palad kWh', value: '10,500 kWh', source: 'PEA_Bill_Palad_Sep2567.pdf', page: 'หน้า 2, แถว "หน่วยที่ใช้"' },
  { field: 'PEA Palad Amount', value: '35,803 ฿', source: 'PEA_Bill_Palad_Sep2567.pdf', page: 'หน้า 1, ยอดรวม' },
  { field: 'Solar Yield', value: '5,900 kWh', source: 'Solar_Report_Sep2567.xlsx', page: 'Sheet "Monthly", คอลัมน์ Total Yield' },
  { field: 'Solar Ratio', value: '19.0%', source: 'คำนวณ: Solar / (PEA + Solar) × 100', page: 'Derived value' },
  { field: 'CO2 Avoided', value: '3.30 ton', source: 'คำนวณ: Solar kWh × 0.5592 kg/kWh', page: 'Factor: EGAT 2566' },
];
