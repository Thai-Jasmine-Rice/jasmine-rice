"use client";

import { LineChart } from "./LineChart";
import { EPOCHS, TRAIN_LOSS, VAL_LOSS } from "../lib/mockData";

export function LossChart() {
  return (
    <LineChart
      ariaLabel="กราฟเส้นแสดงค่า loss ของชุดเทรนและชุดตรวจสอบในแต่ละ epoch"
      series={[
        { name: "Train loss", color: "#0a0a0a", values: TRAIN_LOSS },
        { name: "Validation loss", color: "#737373", values: VAL_LOSS, dashed: true },
      ]}
      xLabels={EPOCHS.map(String)}
      xTickIndices={[0, 9, 19, 29, 39, 49]}
      yMin={0}
      yMax={1.2}
      yStep={0.2}
      formatY={(v) => v.toFixed(1)}
      formatTip={(v) => v.toFixed(3)}
      xAxisTitle="Epoch"
      yAxisTitle="Loss (MSE)"
      tipTitle={(e) => `Epoch ${e}`}
    />
  );
}
