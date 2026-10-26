import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import "./globals.css";

const satoshi = localFont({ src: "./fonts/Satoshi-Variable.ttf", weight: "300 900", display: "swap", variable: "--font-satoshi" });

export const metadata: Metadata = {
  title: "Upbranch — Learn AI. Build what's next.",
  description: "Practice with AI agents, learn to verify results, and discover projects worth building.",
  icons: { icon: "/polyshield_logo_nobg.png" },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="en"><body className={`${satoshi.variable} font-sans antialiased`}>{children}</body></html>;
}
