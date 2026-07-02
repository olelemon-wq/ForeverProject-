import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FOREVER — แพลตฟอร์มสร้างเว็บไซต์ความทรงจำ (Digital Memorial SaaS)",
  description: "สร้างเว็บไซต์รำลึกถึงผู้ล่วงลับ ครอบครัว สัตว์เลี้ยง แบบบริการตนเอง 100% ภายใน 3 นาที เพื่อให้ความทรงจำอันทรงคุณค่าอยู่ตลอดไป",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
