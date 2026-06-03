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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700;800;900&family=Inter:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-[#212529]">
        {children}
      </body>
    </html>
  );
}
