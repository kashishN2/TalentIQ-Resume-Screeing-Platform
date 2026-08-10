import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TalentIQ",
  description: "Resume Screening & Candidate Intelligence Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
