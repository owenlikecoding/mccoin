import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AdSense from "@/components/AdSense";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "McCoin",
  description:
    "The simplist way to enter cyptocurrency. Without the crypto side.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <AdSense />
        <div>
        <Script
                src="https://acscdn.com/script/aclib.js"
            />
        </div>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
