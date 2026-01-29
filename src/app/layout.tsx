import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TechDev Store",
  description: "Premium Developer Gear",
};

import { MobileBottomNav } from "@/components/shop/MobileBottomNav";
import { CompareFloatingBar } from "@/components/shop/CompareFloatingBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${outfit.variable} antialiased pb-16 md:pb-0 font-sans`}
      >
        <Providers>
          {children}
          <CompareFloatingBar />
          <MobileBottomNav />
        </Providers>
      </body>
    </html>
  );
}
