import type { Metadata } from "next";
import { Noto_Sans_Thai, Prompt } from "next/font/google";
import "./globals.css";

const body = Noto_Sans_Thai({
  variable: "--font-body",
  subsets: ["thai", "latin"],
});

const heading = Prompt({
  variable: "--font-heading",
  subsets: ["thai", "latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ปัจจัยที่ส่งผลต่อราคาข้าวหอมมะลิไทย",
  description:
    "เว็บไซต์นำเสนอผลการวิเคราะห์ปัจจัยที่ส่งผลต่อราคาข้าวหอมมะลิในประเทศไทย โปรเจกต์รายวิชา Data Science / Data Engineering",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className={`${body.variable} ${heading.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
