export type ProductStandard = "GAP" | "Organic 100%" | "งานวิจัย";

export type PlotStatus = "ready" | "normal" | "attention";

export interface SensorData {
  temperatureC: number;
  humidityPercent: number;
  soilMoisturePercent: number;
  lightLux: number;
  recordedAt: string;
}

export interface HarvestPrediction {
  estimatedDate: string;
  confidencePercent: number;
  qualityScore: number;
}

export interface SensorTrendPoint extends SensorData {
  label: string;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  standards: ProductStandard[];
  price: number;
  unit: string;
  stock: number; // 0 means out of stock
  isPreOrder: boolean;
  harvestDate?: string;
  plotId: string;
  sensorData: SensorData;
  harvestPrediction: HarvestPrediction;
  plotMapUrl?: string;
  plotStatus: PlotStatus;
  sensorTrend: SensorTrendPoint[];
  qualityCertificates: string[];
}

const createTrend = (sensor: SensorData): SensorTrendPoint[] =>
  Array.from({ length: 6 }, (_, index) => ({
    ...sensor,
    temperatureC: Number((sensor.temperatureC - (5 - index) * 0.2).toFixed(1)),
    humidityPercent: Math.max(0, sensor.humidityPercent - (5 - index) * 1.2),
    soilMoisturePercent: Math.max(0, sensor.soilMoisturePercent - (5 - index) * 1.5),
    lightLux: Math.max(0, sensor.lightLux - (5 - index) * 110),
    label: `${index + 1} ชม.ก่อน`,
  }));

const monitored = (
  sensor: SensorData,
  prediction: HarvestPrediction,
  plotStatus: PlotStatus,
): Pick<
  Product,
  | "plotId"
  | "sensorData"
  | "harvestPrediction"
  | "plotStatus"
  | "sensorTrend"
  | "qualityCertificates"
> => ({
  plotId: "",
  sensorData: sensor,
  harvestPrediction: prediction,
  plotStatus,
  sensorTrend: createTrend(sensor),
  qualityCertificates: ["GAP", "ตรวจสารตกค้างแล้ว"],
});

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "ผักสลัดกรีนโอ๊ค (Green Oak)",
    image:
      "https://images.unsplash.com/photo-1640958904159-51ae08bc3412?auto=format&fit=crop&q=80&w=400&h=300",
    standards: ["GAP", "งานวิจัย"],
    price: 50,
    unit: "กก.",
    stock: 15,
    isPreOrder: false,
    ...monitored(
      {
        temperatureC: 25.8,
        humidityPercent: 68,
        soilMoisturePercent: 61,
        lightLux: 18400,
        recordedAt: "2026-08-30T09:45:00+07:00",
      },
      { estimatedDate: "2026-09-02", confidencePercent: 94, qualityScore: 4.7 },
      "ready",
    ),
    plotId: "P-01",
  },
  {
    id: "p2",
    name: "มะเขือเทศราชินี",
    image:
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400&h=300",
    standards: ["Organic 100%"],
    price: 80,
    unit: "กก.",
    stock: 0,
    isPreOrder: true,
    harvestDate: "2026-09-05",
    ...monitored(
      {
        temperatureC: 26.4,
        humidityPercent: 72,
        soilMoisturePercent: 66,
        lightLux: 16200,
        recordedAt: "2026-08-30T09:43:00+07:00",
      },
      { estimatedDate: "2026-09-05", confidencePercent: 88, qualityScore: 4.5 },
      "normal",
    ),
    plotId: "T-02",
  },
  {
    id: "p3",
    name: "เมล่อนสายพันธุ์ใหม่ (วิจัย)",
    image:
      "https://images.unsplash.com/photo-1595475207225-428b62bda831?auto=format&fit=crop&q=80&w=400&h=300",
    standards: ["GAP", "งานวิจัย"],
    price: 150,
    unit: "ลูก",
    stock: 5,
    isPreOrder: false,
    ...monitored(
      {
        temperatureC: 29.1,
        humidityPercent: 55,
        soilMoisturePercent: 31,
        lightLux: 24100,
        recordedAt: "2026-08-30T09:41:00+07:00",
      },
      { estimatedDate: "2026-09-10", confidencePercent: 81, qualityScore: 4.2 },
      "attention",
    ),
    plotId: "M-01",
  },
  {
    id: "p4",
    name: "ฟักทองบัตเตอร์นัท",
    image:
      "https://images.unsplash.com/photo-1570586437263-ab629fccc818?auto=format&fit=crop&q=80&w=400&h=300",
    standards: ["Organic 100%"],
    price: 60,
    unit: "กก.",
    stock: 20,
    isPreOrder: false,
    ...monitored(
      {
        temperatureC: 27.1,
        humidityPercent: 64,
        soilMoisturePercent: 58,
        lightLux: 20500,
        recordedAt: "2026-08-30T09:40:00+07:00",
      },
      { estimatedDate: "2026-09-04", confidencePercent: 91, qualityScore: 4.6 },
      "normal",
    ),
    plotId: "B-03",
  },
  {
    id: "p5",
    name: "ผักกาดขาวปลอดสารพิษ",
    image:
      "https://images.unsplash.com/photo-1580738204555-8686f3a2db43?auto=format&fit=crop&q=80&w=400&h=300",
    standards: ["GAP", "Organic 100%"],
    price: 45,
    unit: "กก.",
    stock: 25,
    isPreOrder: false,
    ...monitored(
      {
        temperatureC: 26.2,
        humidityPercent: 70,
        soilMoisturePercent: 63,
        lightLux: 17600,
        recordedAt: "2026-08-30T09:38:00+07:00",
      },
      { estimatedDate: "2026-09-06", confidencePercent: 92, qualityScore: 4.8 },
      "ready",
    ),
    plotId: "C-01",
  },
  {
    id: "p6",
    name: "แครอทสีม่วง (วิจัย)",
    image:
      "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=400&h=300",
    standards: ["งานวิจัย", "GAP"],
    price: 70,
    unit: "กก.",
    stock: 8,
    isPreOrder: false,
    ...monitored(
      {
        temperatureC: 25.4,
        humidityPercent: 67,
        soilMoisturePercent: 59,
        lightLux: 19300,
        recordedAt: "2026-08-30T09:36:00+07:00",
      },
      { estimatedDate: "2026-09-08", confidencePercent: 86, qualityScore: 4.4 },
      "normal",
    ),
    plotId: "C-02",
  },
  {
    id: "p7",
    name: "ผักโขมเย็นจากแปลงเกษตรอัจฉริยะ",
    image:
      "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=400&h=300",
    standards: ["GAP", "งานวิจัย"],
    price: 55,
    unit: "กก.",
    stock: 12,
    isPreOrder: false,
    ...monitored(
      {
        temperatureC: 26.9,
        humidityPercent: 61,
        soilMoisturePercent: 48,
        lightLux: 22100,
        recordedAt: "2026-08-30T09:34:00+07:00",
      },
      { estimatedDate: "2026-09-09", confidencePercent: 84, qualityScore: 4.3 },
      "normal",
    ),
    plotId: "S-01",
  },
  {
    id: "p8",
    name: "สตรอว์เบอร์รีแปลงวิจัย",
    image:
      "https://images.unsplash.com/photo-1464965911861-746a04b4b9ae?auto=format&fit=crop&q=80&w=400&h=300",
    standards: ["งานวิจัย", "GAP"],
    price: 200,
    unit: "กก.",
    stock: 0,
    isPreOrder: true,
    harvestDate: "2026-09-10",
    ...monitored(
      {
        temperatureC: 27.8,
        humidityPercent: 74,
        soilMoisturePercent: 69,
        lightLux: 15800,
        recordedAt: "2026-08-30T09:32:00+07:00",
      },
      { estimatedDate: "2026-09-10", confidencePercent: 89, qualityScore: 4.6 },
      "normal",
    ),
    plotId: "F-02",
  },
];
