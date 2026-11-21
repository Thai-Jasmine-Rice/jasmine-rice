"use client";

import { LineChart } from "./LineChart";
import { MONTHS_TH, PRICE_2027 } from "../lib/mockData";

export function PriceChart() {
  return (
    <LineChart
      ariaLabel="กราฟเส้นแสดงราคาข้าวหอมมะลิคาดการณ์รายเดือน ปี 2027"
      series={[{ name: "ราคาคาดการณ์", color: "#0a0a0a", values: PRICE_2027 }]}
      xLabels={MONTHS_TH}
      yMin={17000}
      yMax={20000}
      yStep={1000}
      xAxisTitle="เดือน (ปี 2027)"
      yAxisTitle="ราคา (บาท/ตัน)"
      tipTitle={(m) => `${m} 2027`}
      formatTip={(v) => `${v.toLocaleString("en-US")} บาท/ตัน`}
      smooth
      area
      dots
    />
  );
}
