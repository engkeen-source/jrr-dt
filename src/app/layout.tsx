import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Readiness Assessment | Workforce Alliance Foundation",
  description:
    "Discover how AI will transform your business and workforce. Get a personalised consultant-level assessment report in minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#060B1E] text-slate-200">
        {children}
      </body>
    </html>
  );
}
