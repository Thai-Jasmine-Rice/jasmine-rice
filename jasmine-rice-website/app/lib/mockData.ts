// ข้อมูลจำลอง (mock) — เปลี่ยนเป็นข้อมูลจริงจากทีม DS/DE ภายหลัง

export const MONTHS_TH = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
];

/** ราคาข้าวหอมมะลิคาดการณ์ ปี 2027 (บาท/ตัน) รายเดือน */
export const PRICE_2027 = [
  17800, 17650, 17900, 18300, 18750, 19100,
  19400, 19250, 18900, 18500, 18200, 18450,
];

/** Loss ระหว่างการเทรนโมเดล (50 epochs) */
export const EPOCHS = Array.from({ length: 50 }, (_, i) => i + 1);

const r4 = (n: number) => Math.round(n * 10000) / 10000;

export const TRAIN_LOSS = EPOCHS.map((e) =>
  r4(0.95 * Math.exp(-e / 8) + 0.06 + 0.012 * Math.sin(e * 1.7) * Math.exp(-e / 25)),
);

export const VAL_LOSS = EPOCHS.map((e) =>
  r4(
    0.98 * Math.exp(-e / 9) +
      0.11 +
      0.015 * Math.sin(e * 1.3 + 1) * Math.exp(-e / 30) +
      (e > 38 ? (e - 38) * 0.0008 : 0),
  ),
);

export type Feature = {
  name: string;
  /** ค่าน้ำหนัก (standardized coefficient) — บวก = ดันราคาขึ้น, ลบ = กดราคาลง */
  impact: number;
  note: string;
};

export const FEATURES: Feature[] = [
  { name: "ผลผลิตต่อไร่", impact: -0.31, note: "ผลผลิตมากขึ้น อุปทานเพิ่ม ราคามีแนวโน้มลดลง" },
  { name: "สต็อกข้าวคงคลัง", impact: -0.52, note: "สต็อกสูง ทำให้แรงกดดันด้านราคาเพิ่มขึ้น" },
  { name: "ต้นทุนปุ๋ย", impact: 0.27, note: "ต้นทุนการผลิตสูงขึ้น ผลักดันราคาขาย" },
  { name: "ปริมาณส่งออก", impact: 0.68, note: "ความต้องการจากต่างประเทศดันราคาขึ้นมากที่สุด" },
  { name: "ปริมาณน้ำฝน", impact: -0.22, note: "ฝนเพียงพอ ผลผลิตดี ราคามีแนวโน้มลดลงเล็กน้อย" },
  { name: "อัตราแลกเปลี่ยน THB/USD", impact: 0.38, note: "บาทอ่อนค่า ราคาส่งออกในรูปบาทสูงขึ้น" },
  { name: "ราคาน้ำมันดีเซล", impact: 0.15, note: "ต้นทุนขนส่งและเครื่องจักรสูงขึ้น ส่งผลต่อราคาเล็กน้อย" },
  { name: "ราคาข้าวหอมเวียดนาม", impact: 0.45, note: "คู่แข่งขึ้นราคา ทำให้ข้าวไทยมีแรงหนุนด้านราคา" },
];

/* ───────────── Data Dictionary ───────────── */

export type SchemaItem = {
  key: string;
  name: string;
  type: "date" | "float" | "int";
  unit: string;
  source: string;
  freq: string;
  desc: string;
  role: "index" | "feature" | "target";
  digits: number;
};

export const SCHEMA: SchemaItem[] = [
  { key: "month", name: "เดือน", type: "date", unit: "YYYY-MM", source: "—", freq: "รายเดือน", desc: "เดือนของข้อมูล ใช้เป็น index ของชุดข้อมูล", role: "index", digits: 0 },
  { key: "rice_yield", name: "ผลผลิตต่อไร่", type: "float", unit: "กก./ไร่", source: "สำนักงานเศรษฐกิจการเกษตร (สศก.)", freq: "รายเดือน", desc: "ผลผลิตข้าวหอมมะลิเฉลี่ยต่อไร่ของทั้งประเทศ", role: "feature", digits: 0 },
  { key: "rice_stock", name: "สต็อกข้าวคงคลัง", type: "float", unit: "ล้านตัน", source: "กรมการค้าภายใน", freq: "รายเดือน", desc: "ปริมาณข้าวสารคงคลัง ณ สิ้นเดือน", role: "feature", digits: 2 },
  { key: "fertilizer_cost", name: "ต้นทุนปุ๋ย", type: "float", unit: "บาท/กก.", source: "กรมการค้าภายใน", freq: "รายเดือน", desc: "ราคาปุ๋ยเคมีสูตร 46-0-0 เฉลี่ยทั้งประเทศ", role: "feature", digits: 1 },
  { key: "export_volume", name: "ปริมาณส่งออก", type: "int", unit: "ตัน/เดือน", source: "สมาคมผู้ส่งออกข้าวไทย", freq: "รายเดือน", desc: "ปริมาณส่งออกข้าวหอมมะลิรวมทุกประเทศปลายทาง", role: "feature", digits: 0 },
  { key: "rainfall", name: "ปริมาณน้ำฝน", type: "float", unit: "มม.", source: "กรมอุตุนิยมวิทยา", freq: "รายเดือน", desc: "ปริมาณน้ำฝนสะสมเฉลี่ยในพื้นที่ปลูกหลัก (ภาคอีสานตอนบน)", role: "feature", digits: 0 },
  { key: "usd_thb", name: "อัตราแลกเปลี่ยน THB/USD", type: "float", unit: "บาท/USD", source: "ธนาคารแห่งประเทศไทย (ธปท.)", freq: "รายเดือน", desc: "อัตราแลกเปลี่ยนเฉลี่ยรายเดือน", role: "feature", digits: 1 },
  { key: "diesel_price", name: "ราคาน้ำมันดีเซล", type: "float", unit: "บาท/ลิตร", source: "สำนักงานนโยบายและแผนพลังงาน (สนพ.)", freq: "รายเดือน", desc: "ราคาขายปลีกน้ำมันดีเซลเฉลี่ยรายเดือน", role: "feature", digits: 1 },
  { key: "vn_fragrant_price", name: "ราคาข้าวหอมเวียดนาม", type: "float", unit: "USD/ตัน", source: "FAO Rice Price Update", freq: "รายเดือน", desc: "ราคาส่งออกข้าวหอมของเวียดนาม ใช้เป็นราคาคู่แข่งอ้างอิง", role: "feature", digits: 0 },
  { key: "price_thb_ton", name: "ราคาข้าวหอมมะลิ", type: "float", unit: "บาท/ตัน", source: "สมาคมโรงสีข้าวไทย", freq: "รายเดือน", desc: "ราคาข้าวหอมมะลิเป้าหมายที่ต้องการพยากรณ์ (target)", role: "target", digits: 0 },
];

/** ชุดข้อมูลจำลอง 190 แถว (ม.ค. 2011 – ต.ค. 2026) — ลำดับค่าตรงกับ SCHEMA (ไม่รวม month) */
const ROW_COUNT = 190;

const monthLabel = (i: number) =>
  `${2011 + Math.floor(i / 12)}-${String((i % 12) + 1).padStart(2, "0")}`;

const round = (n: number, d: number) => {
  const k = 10 ** d;
  return Math.round(n * k) / k;
};

export const DATASET: { month: string; values: number[] }[] = Array.from(
  { length: ROW_COUNT },
  (_, t) => {
    const m = t % 12;
    const season = Math.sin((m / 12) * 2 * Math.PI);
    const w = (phase: number, k: number) => Math.sin(t * k + phase);

    const riceYield = 440 + 0.12 * t + 10 * w(0, 0.45) + 6 * season;
    const stock = 2.4 + 0.3 * w(1, 0.11) - 0.2 * season;
    const fert = 18 + 0.07 * t + 2 * w(2, 0.3);
    const exportVol = 45000 + 120 * t + 9000 * Math.cos((m / 12) * 2 * Math.PI) + 4000 * w(3, 0.6);
    const rain = Math.max(5, 150 + 140 * Math.sin(((m - 3) / 12) * 2 * Math.PI) + 25 * w(4, 1.3));
    const usdThb = 31 + 3 * w(5, 0.05) + 0.8 * w(1, 0.7);
    const diesel = 24 + 0.04 * t + 3 * w(3, 0.2);
    const vn = 450 + 1.1 * t + 40 * w(4, 0.25);
    const price =
      11000 + 35 * t + 2.2 * (vn - 450) + 0.04 * (exportVol - 45000) - 1200 * (stock - 2.4) + 300 * w(5, 0.5);

    return {
      month: monthLabel(t),
      values: [
        round(riceYield, 0),
        round(stock, 2),
        round(fert, 1),
        round(exportVol, 0),
        round(rain, 0),
        round(usdThb, 1),
        round(diesel, 1),
        round(vn, 0),
        round(price, 0),
      ],
    };
  },
);
