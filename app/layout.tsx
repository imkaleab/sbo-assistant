import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SBO Assistant – Gas Station Command Center",
  description: "Open source dashboard for small business owners – gas station operations: tank health, pump uptime, payments, c-store, expenses",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50">{children}</body>
    </html>
  );
}
