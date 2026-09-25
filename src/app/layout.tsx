import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vidya Sarthi - Your Personal AI Team for Academic Excellence",
  description:
    "Vidya Sarthi is a student-focused AI workspace providing specialized AI mentors for studying, academic projects, task management, file analysis, and career placement preparation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FAF8F5] text-[#181614] antialiased selection:bg-[#D97757] selection:text-white">
        {children}
      </body>
    </html>
  );
}
