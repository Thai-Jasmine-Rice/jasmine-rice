import { Card } from "./components/Card";
import { DataDictionary } from "./components/DataDictionary";
import { FeatureImpactChart } from "./components/FeatureImpactChart";
import { FeatureTable } from "./components/FeatureTable";
import { LossChart } from "./components/LossChart";
import { PriceChart } from "./components/PriceChart";
import { FEATURES } from "./lib/mockData";

export default function Home() {
  return (
    <div className="relative flex-1 overflow-hidden">
      {/* พื้นหลังไล่สีอ่อน ๆ */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(60%_80%_at_20%_0%,rgba(0,0,0,0.06),transparent_70%)]"
      />

      <main className="relative mx-auto w-full max-w-6xl px-5 pb-20 pt-14 sm:px-8 sm:pt-20">
        {/* หัวข้อ + คำอธิบาย */}
        <header className="max-w-3xl">
          <h1 className="font-heading text-4xl font-bold leading-[1.25] tracking-tight text-ink sm:text-5xl">
            ปัจจัยที่ส่งผลต่อ
            <span className="text-orange-600">ราคาข้าวหอมมะลิ</span>ไทย
          </h1>
          <p className="mt-5 text-base leading-8 text-ink/75 sm:text-lg">
            เว็บไซต์นี้รวบรวมและนำเสนอผลการวิเคราะห์ว่าปัจจัยใดบ้างที่มีผลต่อราคาข้าวหอมมะลิในประเทศไทย
            ตั้งแต่ผลผลิต สต็อก ต้นทุน การส่งออก ไปจนถึงอัตราแลกเปลี่ยน
            พร้อมแสดงราคาที่โมเดลพยากรณ์ไว้สำหรับปี 2027
            ผลการเรียนรู้ของโมเดล และน้ำหนักของแต่ละปัจจัยว่าส่งผลต่อราคาไปในทิศทางใด
          </p>
        </header>

        {/* กราฟ 2 ช่อง */}
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Card
            title="ราคาข้าวหอมมะลิคาดการณ์ ปี 2027"
            subtitle="ราคาที่โมเดลพยากรณ์รายเดือน ม.ค. – ธ.ค."
            badge="ข้อมูลจำลอง"
          >
            <PriceChart />
          </Card>

          <Card
            title="ค่า Loss ระหว่างการเทรนโมเดล"
            subtitle="เปรียบเทียบ Train loss กับ Validation loss ในแต่ละ epoch"
            badge="ข้อมูลจำลอง"
          >
            <LossChart />
          </Card>
        </div>

        {/* กราฟผลของ feature */}
        <Card
          className="mt-6"
          title="ปัจจัยแต่ละตัวส่งผลต่อราคาอย่างไร"
          subtitle="ค่าน้ำหนัก (standardized coefficient) ของแต่ละ feature ที่โมเดลเรียนรู้ บอกทิศทางและความแรงของผลต่อราคาข้าวหอมมะลิ"
          badge="ข้อมูลจำลอง"
        >
          <FeatureImpactChart features={FEATURES} />
        </Card>

        {/* Data dictionary */}
        <Card
          className="mt-6"
          title="Data Dictionary"
          subtitle="คำอธิบายคอลัมน์ทั้งหมดในชุดข้อมูล: 8 features และ 1 target"
          badge="ข้อมูลจำลอง"
        >
          <DataDictionary />
        </Card>

        {/* ตารางข้อมูล feature */}
        <Card
          className="mt-6"
          title="ตัวอย่างข้อมูล Feature ที่ใช้"
          subtitle="ข้อมูลรายเดือนทั้งหมด 190 แถว (ม.ค. 2011 – ต.ค. 2026) แบ่งแสดงเป็นหน้า พร้อมค่าต่ำสุด ค่าเฉลี่ย และค่าสูงสุดของทั้งชุดข้อมูล"
          badge="ข้อมูลจำลอง"
        >
          <FeatureTable />
        </Card>

        <footer className="mt-12 text-center text-xs text-ink/50">
          ข้อมูลในหน้านี้เป็นข้อมูลจำลองเพื่อใช้ออกแบบหน้าเว็บ จะถูกแทนที่ด้วยผลลัพธ์จริงจากทีม DS/DE
        </footer>
      </main>
    </div>
  );
}
